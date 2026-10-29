# Telegram room bridge

Reuses the existing Hermes hosted Group Chat service through native groups RPC.
The bridge forwards authorized text input and publishes member replies under each member Telegram bot.
It does not create an agent loop or change the Desktop/group engine.

- Existing engine limits: 6 members, up to 3 rounds, up to 10 member messages per discussion.
- `(pass)` replies stay silent. `/stop` invokes the existing room stop control.
- Enable the plugin on every bot present in the connected Telegram group to prevent duplicate native replies.
- Configure a separate room and one ingress profile. Never publish credentials or the live delivery cursor.
- Local integration uses private native client interfaces and should be revalidated when upgrading Hermes.
- This version relays text messages; media routing is not part of the bridge.

Verified: 49 transport/policy tests, actual six-bot greeting delivered in room-log order.
