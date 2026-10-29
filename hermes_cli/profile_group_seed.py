"""Creation-time Telegram group preferences, without copying bot credentials."""
from copy import deepcopy
from pathlib import Path


def seed_profile_group_preferences(profile_dir: Path) -> None:
    from hermes_cli.config import atomic_config_write, read_user_config_raw
    from hermes_cli.profiles import _get_default_hermes_home

    source_path = _get_default_hermes_home() / 'config.yaml'
    source = read_user_config_raw(source_path) if source_path.is_file() else {}
    telegram = source.get('telegram') or {}
    if (telegram.get('extra') or {}).get('local_bot_group_chat') is not True:
        return
    target = profile_dir / 'config.yaml'
    config = read_user_config_raw(target) if target.is_file() else {}
    dest = config.setdefault('telegram', {})
    for key in ('require_mention', 'bots_require_mention', 'group_allow_from'):
        if key in telegram:
            dest.setdefault(key, deepcopy(telegram[key]))
    dest.setdefault('extra', {}).setdefault('local_bot_group_chat', True)
    guard = (source.get('gateway') or {}).get('bot_loop_guard')
    if isinstance(guard, dict):
        config.setdefault('gateway', {}).setdefault('bot_loop_guard', deepcopy(guard))
    atomic_config_write(target, config)
