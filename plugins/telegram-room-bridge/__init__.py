"""Telegram transport only: existing groups RPC owns context, turns and limits."""
import asyncio
from contextlib import asynccontextmanager
import json
import logging
from pathlib import Path

log = logging.getLogger(__name__)


@asynccontextmanager
async def room_client(root):
    from hermes_cli.gateway_runtime import discover_gateway_endpoint
    from hermes_cli.gateway_client import _session_ticket, gateway_ws_target, GatewayClient
    from websockets.asyncio.client import connect
    endpoint = (await asyncio.to_thread(discover_gateway_endpoint, root)).endpoint
    ticket = await asyncio.to_thread(_session_ticket, root, endpoint, scope="host")
    url, protocols = gateway_ws_target(endpoint, ticket)
    async with connect(url, subprotocols=protocols, proxy=None, max_size=8 * 1024 * 1024) as ws:
        async with GatewayClient(ws) as client:
            yield client


class Bridge:
    def __init__(self, settings, root, rpc_factory=room_client, send=None):
        self.settings, self.root, self.rpc_factory = settings, root, rpc_factory
        self.send = send or self._send
        self.cursor = int(settings.get("cursor", 0))
        suffix = settings.get("state_suffix", "")
        self.state_path = Path(__file__).resolve().with_name(f"delivery-cursor{suffix}.json")
        if self.state_path.is_file():
            self.cursor = int(json.loads(self.state_path.read_text())["cursor"])
        self.notice_path = Path(__file__).resolve().with_name(f"notice-cursors{suffix}.json")
        self.notice_cursors = json.loads(self.notice_path.read_text()) if self.notice_path.is_file() else {}

    async def submit(self, message):
        async with self.rpc_factory(self.root) as client:
            if message.text.strip().split('@', 1)[0] == '/stop':
                return await client.rpc("groups.stop", room_id=self.settings["room_id"],
                                        cancel_id=f"telegram:{message.chat.id}:{message.message_id}")
            return await client.rpc("groups.send", room_id=self.settings["room_id"],
                                    event_id=f"telegram:{message.chat.id}:{message.message_id}",
                                    payload={"text": message.text, "thread_id": "telegram"})

    def _save_cursor(self, cursor):
        temporary = self.state_path.with_suffix(".tmp")
        temporary.write_text(json.dumps({"cursor": cursor}) + "\n")
        temporary.replace(self.state_path)
        self.cursor = cursor

    async def _send(self, profile, text):
        from gateway.run import _profile_runtime_scope
        from tools.send_message_tool import send_message_tool
        home = self.root if profile == "default" else self.root / "profiles" / profile
        def deliver():
            with _profile_runtime_scope(home):
                return json.loads(send_message_tool({"action": "send",
                    "target": f"telegram:{self.settings['chat_id']}", "message": text}))
        result = await asyncio.to_thread(deliver)
        if result.get("error") or result.get("success") is False:
            raise RuntimeError("Telegram delivery was refused; cursor retained")

    def _save_notice_cursor(self, profile, session_id, epoch, sequence):
        self.notice_cursors[profile] = {"session_id": session_id, "epoch": epoch, "sequence": sequence}
        temporary = self.notice_path.with_suffix(".tmp")
        temporary.write_text(json.dumps(self.notice_cursors) + "\n")
        temporary.replace(self.notice_path)

    async def relay_typing_once(self):
        async with self.rpc_factory(self.root) as client:
            state = await client.rpc("groups.state", room_id=self.settings["room_id"])
        members = {m["member_id"]: m["profile"] for m in state["room"]["members"]}
        for activity in state["driver_status"].get("member_activity", []):
            profile = members.get(activity["member_id"])
            if activity.get("status") != "running" or profile not in self.settings["members"]:
                continue
            await self._typing(profile)

    async def _typing(self, profile):
        from gateway.run import _profile_runtime_scope
        from gateway.config import Platform
        from tools.send_message_senders import _live_adapter
        with _profile_runtime_scope(self.root / "profiles" / profile):
            _runner, adapter = _live_adapter(Platform.TELEGRAM)
            if adapter is not None and getattr(adapter.config, "typing_indicator", True):
                await adapter.send_typing(self.settings["chat_id"])

    async def watch_typing(self):
        from hermes_cli.gateway_runtime import discover_gateway_endpoint
        while (await asyncio.to_thread(discover_gateway_endpoint, self.root)).endpoint is None:
            await asyncio.sleep(1)
        while True:
            try:
                await self.relay_typing_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                log.exception("Room typing status unavailable; conversation delivery is unaffected")
            await asyncio.sleep(2)

    async def relay_notices_once(self):
        # Observe existing review.summary frames only. Never request a review or change its policy.
        async with self.rpc_factory(self.root) as client:
            for profile in self.settings["members"]:
                found = await client.rpc("session.list", profile=profile, include_hidden=True,
                                         title=f"Group: {self.settings['room_id']}")
                candidates = [s for s in found["sessions"] if s.get("source") == "bot_room"
                              and s.get("title") == f"Group: {self.settings['room_id']}"]
                if len(candidates) != 1:
                    continue
                sid = candidates[0]["session_id"]
                cursor = self.notice_cursors.get(profile, {})
                if cursor.get("session_id") != sid:
                    cursor = {}
                page = await client.rpc("session.events.since", profile=profile, session_id=sid,
                    last_sequence=cursor.get("sequence", 0), replay_epoch=cursor.get("epoch"))
                epoch = page["replay_epoch"]
                if page.get("snapshot_required"):
                    # A new subscription/restarted server has no continuous replay proof.
                    # Start at its watermark rather than duplicate old notices.
                    self._save_notice_cursor(profile, sid, epoch, page["latest_seq"])
                    continue
                for event in page["events"]:
                    text = event.get("payload", {}).get("text")
                    if event.get("type") == "review.summary" and isinstance(text, str) and text.strip():
                        await self.send(profile, text)
                    self._save_notice_cursor(profile, sid, epoch, int(event["seq"]))
                self._save_notice_cursor(profile, sid, epoch, page["latest_seq"])

    async def watch_notices(self):
        from hermes_cli.gateway_runtime import discover_gateway_endpoint
        while (await asyncio.to_thread(discover_gateway_endpoint, self.root)).endpoint is None:
            await asyncio.sleep(1)
        while True:
            try:
                await self.relay_notices_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                log.exception("Review notice relay retry scheduled")
                await asyncio.sleep(5)
            await asyncio.sleep(2)

    async def relay_once(self):
        async with self.rpc_factory(self.root) as client:
            page = await client.rpc("groups.log", room_id=self.settings["room_id"],
                                    since_seq=self.cursor, limit=100)
        for event in page["events"]:
            if event["kind"] == "message.member":
                profile = event["actor"]["profile"]
                if profile not in self.settings["members"]:
                    raise RuntimeError("Room membership changed; delivery paused")
                await self.send(profile, event["payload"]["text"])
            self._save_cursor(int(event["seq"]))

    async def watch(self):
        from hermes_cli.gateway_runtime import discover_gateway_endpoint
        while (await asyncio.to_thread(discover_gateway_endpoint, self.root)).endpoint is None:
            await asyncio.sleep(1)
        while True:
            try:
                await self.relay_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                # Transient room-store errors (stale cursor, brief blip) must not permanently
                # kill delivery; the delivery cursor only advances after a delivered event, so a
                # retry safely resumes from the last committed position.
                log.exception("Telegram room relay retry scheduled")
                await asyncio.sleep(5)
            await asyncio.sleep(1)


def register(ctx):
    settings_path = Path(__file__).resolve().with_name("settings.json")
    if not settings_path.is_file():
        return  # Prepared but not configured/activated.
    settings = json.loads(settings_path.read_text())
    if settings.get("enabled") is not True:
        return
    for room_settings in [settings, *settings.get("additional_rooms", [])]:
        if room_settings.get("enabled") is True:
            _register_room(ctx, room_settings)


def _register_room(ctx, settings):
    from hermes_constants import get_default_hermes_root
    root = get_default_hermes_root()
    bridge = None
    watcher = None
    notice_watcher = None
    typing_watcher = None

    def factory(native, adapter):
        nonlocal watcher, bridge, notice_watcher, typing_watcher
        from telegram.ext import MessageHandler, filters
        human_rooms = {str(value) for value in settings.get("human_only_chat_ids", [])}
        if human_rooms:
            class HumanRoomBotFilter(filters.MessageFilter):
                def filter(self, message):
                    user = getattr(message, "from_user", None)
                    return (str(message.chat.id) in human_rooms
                            and user is not None and bool(user.is_bot))
            async def ignore_bot(update, context):
                return
            native.add_handler(MessageHandler(HumanRoomBotFilter(), ignore_bot))
        ingress = getattr(adapter, "_owner_profile", None) == settings["ingress_profile"]
        if ingress and bridge is None:
            bridge = Bridge(settings, root)
        async def receive(update, context):
            message = update.effective_message
            if message is None or not ingress:
                return
            sender_chat = getattr(message, "sender_chat", None)
            user = getattr(message, "from_user", None)
            owner = int(settings["owner_id"])
            if sender_chat is not None:
                if sender_chat.id != message.chat.id:
                    return
                membership = await context.bot.get_chat_member(message.chat.id, owner)
                if str(membership.status) not in {"creator", "administrator"}:
                    return
            elif user is None or user.is_bot or user.id != owner:
                return
            await bridge.submit(message)
        # First-match group 0: connected group input never also enters independent bot turns.
        native.add_handler(MessageHandler(filters.Chat(int(settings["chat_id"])) & filters.TEXT &
            (~filters.COMMAND | filters.Regex(r"^/stop(?:@[A-Za-z0-9_]+)?(?:\s|$)")), receive))
        if ingress and watcher is None:
            watcher = ctx.spawn_task(bridge.watch(), name=f"telegram-room-bridge{settings.get('state_suffix', '')}")
        if ingress and notice_watcher is None:
            notice_watcher = ctx.spawn_task(bridge.watch_notices(), name=f"telegram-room-review-notices{settings.get('state_suffix', '')}")
        if ingress and typing_watcher is None:
            typing_watcher = ctx.spawn_task(bridge.watch_typing(), name=f"telegram-room-typing{settings.get('state_suffix', '')}")
    factory.__qualname__ = f"{factory.__qualname__}:{settings['room_id']}"
    ctx.register_telegram_handler(factory)
