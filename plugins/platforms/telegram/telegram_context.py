"""Telegram group addressing helpers, kept out of the adapter facade.

The identity line lives in ``channel_prompt`` and therefore in the cached-agent signature: it
must be stable for the life of a session (username only — never a per-message fact).
"""

import asyncio
from weakref import WeakKeyDictionary
from typing import TYPE_CHECKING, Optional

_group_turn_locks = WeakKeyDictionary()


async def process_group_turn_serially(adapter, event, session_key, process):
    """Share one generation-and-delivery lane across this host's bots in a group."""
    if event.source.chat_type not in {"group", "forum"}:
        return await process(event, session_key)
    from hermes_constants import get_default_hermes_root
    locks = _group_turn_locks.setdefault(asyncio.get_running_loop(), {})
    key = (str(get_default_hermes_root()), str(event.source.chat_id))
    lock = locks.setdefault(key, asyncio.Lock())
    guard = adapter._active_sessions.get(session_key)
    entered = False
    try:
        async with lock:
            entered = True
            return await process(event, session_key)
    finally:
        if not entered:
            # A stopped waiter never enters BasePlatformAdapter's lifecycle/finally.
            adapter._cleanup_finished_session_task(session_key, guard)

if TYPE_CHECKING:
    from telegram import Message
    from plugins.platforms.telegram.adapter import TelegramAdapter


def mentions_other_participants(adapter: "TelegramAdapter", message: "Message") -> bool:
    """True when a ``mention``/``text_mention`` entity names someone other than this bot."""
    own = adapter._current_bot_username()
    bot_id = getattr(adapter._bot, "id", None) if adapter._bot else None
    for source_text, entities in adapter._entity_sources(message):
        for entity in entities:
            entity_type = adapter._entity_type(entity)
            if entity_type == "mention":
                handle = (adapter._entity_span(source_text, entity) or "").strip().lstrip("@").lower()
                if handle and handle != own:
                    return True
            elif entity_type == "text_mention":
                user = getattr(entity, "user", None)
                if user is not None and getattr(user, "id", None) != bot_id:
                    return True
    return False


def group_trigger_text(adapter: "TelegramAdapter", message: "Message", text: Optional[str]) -> Optional[str]:
    """Strip our own handle only when we are the sole addressee. With other participants named,
    ``@research_bot , @ops_bot are you both listening?`` must not reach us as ``, @ops_bot …``."""
    if adapter._is_group_chat(message) and mentions_other_participants(adapter, message):
        return text
    return adapter._clean_bot_trigger_text(text)


def group_identity_prompt(
    adapter: "TelegramAdapter", message: "Message", channel_prompt: Optional[str],
) -> Optional[str]:
    """Session-stable identity line so the model can read retained @mentions as itself or not."""
    if not adapter._is_group_chat(message) or not getattr(adapter, "_bot", None):
        return channel_prompt
    username = adapter._current_bot_username()
    if not username:
        return channel_prompt
    identity = (
        f"Your Telegram bot username in this group: @{username}. "
        "Mentions of other bots are not requests for you to relay the message."
    )
    return f"{channel_prompt}\n\n{identity}" if channel_prompt else identity
