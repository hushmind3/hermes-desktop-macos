"""Local Telegram bots join mention-free groups without inheriting credentials."""
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from gateway.config import PlatformConfig, Platform, GatewayConfig
from gateway.platforms.event import MessageType
from hermes_cli.config import atomic_config_write, read_user_config_raw
from hermes_cli.profiles import create_profile
from hermes_cli.profile_group_seed import seed_profile_group_preferences
from plugins.platforms.telegram.adapter import TelegramAdapter


@pytest.fixture
def group_home(tmp_path, monkeypatch):
    from pathlib import Path
    monkeypatch.setattr(Path, 'home', lambda: tmp_path)
    home = tmp_path / '.hermes'
    home.mkdir()
    monkeypatch.setenv('HERMES_HOME', str(home))
    atomic_config_write(home / 'config.yaml', {
        'telegram': {'require_mention': False, 'bots_require_mention': False,
                     'group_allow_from': ['1234'], 'extra': {'local_bot_group_chat': True}},
        'gateway': {'bot_loop_guard': {'enabled': True, 'max_events': 3,
                                     'window_seconds': 60, 'cooldown_seconds': 60}},
    })
    (home / '.env').write_text('TELEGRAM_BOT_TOKEN=777:private-token\n')
    return home


def message(sender, *, bot=False, private=False):
    return SimpleNamespace(
        message_id=1, date=datetime.now(timezone.utc),
        chat=SimpleNamespace(id=1234 if private else -100987,
                             type='private' if private else 'supergroup', title='Test', is_forum=False),
        from_user=SimpleNamespace(id=sender, full_name='Participant', first_name='Participant', is_bot=bot),
        text='다들 인사해봐', caption=None, entities=[], caption_entities=[],
        message_thread_id=None, is_topic_message=False, reply_to_message=None, sender_chat=None,
        quote=None, edit_date=None, external_reply=None, forward_origin=None,
    )


def test_new_profile_and_new_token_are_admitted_by_an_already_running_bot(group_home):
    root_config = read_user_config_raw(group_home / 'config.yaml')
    extra = {**root_config['telegram'], **root_config['telegram']['extra']}
    adapter = TelegramAdapter(PlatformConfig(enabled=True, token='777:private-token', extra=extra))
    adapter._bot = SimpleNamespace(id=777, username='existing_bot')
    adapter._mention_patterns = []
    candidate = message(888, bot=True)
    assert not adapter._is_user_authorized_from_message(candidate)

    new_profile = create_profile('new-peer', no_alias=True, no_skills=True)
    seeded = read_user_config_raw(new_profile / 'config.yaml')
    assert seeded['telegram']['require_mention'] is False
    assert seeded['telegram']['extra']['local_bot_group_chat'] is True
    assert seeded['gateway']['bot_loop_guard'] == root_config['gateway']['bot_loop_guard']
    assert 'private-token' not in (new_profile / '.env').read_text()
    (new_profile / '.env').write_text('TELEGRAM_BOT_TOKEN=888:new-private-token\n')

    assert adapter._is_user_authorized_from_message(candidate)
    assert adapter._should_process_message(candidate)
    event = adapter._build_message_event(candidate, MessageType.TEXT)
    assert event.source.role_authorized is True
    assert event.reply_expected is False
    from gateway.run import GatewayRunner
    runner = object.__new__(GatewayRunner)
    runner.config = GatewayConfig()
    runner.adapters = {Platform.TELEGRAM: adapter}
    runner.pairing_store = SimpleNamespace(is_approved=lambda *args: False)
    assert runner._is_user_authorized(event.source)

    assert adapter._is_user_authorized_from_message(message(1234))
    assert not adapter._is_user_authorized_from_message(message(999, bot=True))
    assert not adapter._is_user_authorized_from_message(message(999))
    dm = adapter._build_message_event(message(888, bot=True, private=True), MessageType.TEXT)
    assert dm.source.role_authorized is False
    assert not runner._is_user_authorized(dm.source)
    (new_profile / '.env').write_text('TELEGRAM_BOT_TOKEN=889:replacement-token\n')
    assert not adapter._is_user_authorized_from_message(candidate)
    assert adapter._is_user_authorized_from_message(message(889, bot=True))
    adapter.config.extra['local_bot_group_chat'] = False
    assert not adapter._is_user_authorized_from_message(message(889, bot=True))


def test_seed_keeps_explicit_choices_and_does_not_copy_other_telegram_settings(group_home):
    config = read_user_config_raw(group_home / 'config.yaml')
    config['telegram']['allowed_chats'] = ['-100111']
    config['telegram']['proxy_url'] = 'http://private-proxy.invalid'
    atomic_config_write(group_home / 'config.yaml', config)
    target = group_home / 'profiles' / 'staging'
    target.mkdir(parents=True)
    atomic_config_write(target / 'config.yaml', {'telegram': {
        'require_mention': True, 'extra': {'local_bot_group_chat': False}}})
    seed_profile_group_preferences(target)
    seeded = read_user_config_raw(target / 'config.yaml')
    assert seeded['telegram']['require_mention'] is True
    assert seeded['telegram']['extra']['local_bot_group_chat'] is False
    assert 'allowed_chats' not in seeded['telegram']
    assert 'proxy_url' not in seeded['telegram']
    assert 'private-token' not in (target / 'config.yaml').read_text()
