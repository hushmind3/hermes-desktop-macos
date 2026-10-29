"""Telegram bots share group turn ordering through generation and delivery."""
import asyncio
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

from gateway.platforms.base import BasePlatformAdapter
from plugins.platforms.telegram.adapter import TelegramAdapter


def adapter():
    obj = object.__new__(TelegramAdapter)
    obj._active_sessions = {}
    obj._cleanup_finished_session_task = Mock()
    return obj


def event(chat="group", chat_id="-100123"):
    return SimpleNamespace(source=SimpleNamespace(chat_type=chat, chat_id=chat_id))


@pytest.mark.asyncio
async def test_two_bot_turns_wait_through_delivery_and_dm_is_independent(monkeypatch):
    first, second = adapter(), adapter()
    generating = asyncio.Event()
    allow_delivery = asyncio.Event()
    delivered = asyncio.Event()
    order = []

    async def process(self, incoming, key):
        order.append(key)
        if key == "first":
            generating.set()
            await allow_delivery.wait()
            order.append("first-delivered")
            delivered.set()
        elif key == "second":
            assert delivered.is_set()

    monkeypatch.setattr(BasePlatformAdapter, "_process_message_background", process)
    a = asyncio.create_task(first._process_message_background(event(), "first"))
    await generating.wait()
    b = asyncio.create_task(second._process_message_background(event(), "second"))
    await asyncio.sleep(0)
    assert order == ["first"]
    await second._process_message_background(event("dm", "123"), "dm")
    await second._process_message_background(event("group", "-100456"), "other-group")
    assert order == ["first", "dm", "other-group"]
    allow_delivery.set()
    await asyncio.gather(a, b)
    assert order[-2:] == ["first-delivered", "second"]


@pytest.mark.asyncio
async def test_cancelled_waiter_releases_its_session_guard(monkeypatch):
    first, second = adapter(), adapter()
    started, finish = asyncio.Event(), asyncio.Event()
    async def process(self, incoming, key):
        started.set()
        await finish.wait()
    monkeypatch.setattr(BasePlatformAdapter, "_process_message_background", process)
    task = asyncio.create_task(first._process_message_background(event(), "first"))
    await started.wait()
    guard = object()
    second._active_sessions["waiting"] = guard
    waiting = asyncio.create_task(second._process_message_background(event(), "waiting"))
    await asyncio.sleep(0)
    waiting.cancel()
    with pytest.raises(asyncio.CancelledError):
        await waiting
    second._cleanup_finished_session_task.assert_called_once_with("waiting", guard)
    finish.set()
    await task
    await second._process_message_background(event(), "next")
