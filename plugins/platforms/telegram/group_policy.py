"""Opt-in conversation between Telegram bots owned by this Hermes installation."""
import contextlib
import logging
from functools import lru_cache
from pathlib import Path

from dotenv import dotenv_values
from gateway.authz_mixin import _coerce_allow_set

logger = logging.getLogger(__name__)


@lru_cache(maxsize=8)
def _bot_ids_for_files(signatures: tuple) -> frozenset[str]:
    ids = set()
    for filename, _mtime, _size in signatures:
        token = dotenv_values(filename, interpolate=False).get('TELEGRAM_BOT_TOKEN') or ''
        bot_id, sep, _secret = token.partition(':')
        if sep and bot_id.isdecimal():
            ids.add(bot_id)
    return frozenset(ids)


def local_group_bot_authorized(adapter, source) -> bool:
    """Telegram authenticates the sender ID; trust local identities in groups only.

    The roster signature changes on profile creation/removal and credential edits. No
    token is exported, cached or copied into another profile's configuration.
    """
    if (adapter.config.extra.get('local_bot_group_chat') is not True
            or source.chat_type not in {'group', 'forum'} or source.is_bot is not True):
        return False
    from hermes_cli.profiles import _get_default_hermes_home, _iter_named_profile_dirs
    homes = [_get_default_hermes_home(), *_iter_named_profile_dirs()]
    signatures = []
    for home in homes:
        path = home / '.env'
        try:
            stat = path.stat()
        except FileNotFoundError:
            continue
        signatures.append((str(path), stat.st_mtime_ns, stat.st_size))
    return str(source.user_id) in _bot_ids_for_files(tuple(signatures))


def message_user_authorized(adapter, message) -> bool:
    """Early Telegram admission, shared by text, commands and media."""
    source = adapter._source_from_message_for_auth(message)
    user_id = source.user_id
    if not user_id:
        return True
    if local_group_bot_authorized(adapter, source):
        return True
    authorized = None
    adapter_allow_from = adapter.config.extra.get(
        'group_allow_from' if (source.chat_type or '') in ('group', 'forum', 'channel') else 'allow_from')
    if adapter_allow_from is not None:
        allowed = _coerce_allow_set(adapter_allow_from)
        authorized = user_id in allowed or '*' in allowed
    if authorized is None:
        callback_auth = adapter.__dict__.get('_is_callback_user_authorized')
        if callable(callback_auth):
            with contextlib.suppress(Exception):
                authorized = bool(callback_auth(
                    user_id, chat_id=source.chat_id, chat_type=source.chat_type,
                    thread_id=source.thread_id, user_name=source.user_name))
    if authorized is None:
        auth_fn = adapter._legacy_runner_auth_fn()
        has_callback = getattr(adapter, '_authorization_check', None) is not None
        if has_callback or auth_fn is not None:
            if not adapter._telegram_auth_env_configured():
                return True
            decision = adapter._is_sender_authorized(
                user_id, chat_type=source.chat_type, chat_id=source.chat_id, is_bot=source.is_bot,
                thread_id=source.thread_id) if has_callback else None
            if decision is not None:
                authorized = decision
            elif auth_fn is not None:
                try:
                    authorized = bool(auth_fn(source))
                except Exception:
                    logger.debug('[Telegram] Falling back to env-only auth for user %s', user_id, exc_info=True)
    if authorized is None:
        authorized = adapter._env_allowlist_decision(user_id)
        if authorized is None:
            return True
    if authorized:
        return True
    return adapter._should_pass_unauthorized_dm_for_pairing(source)
