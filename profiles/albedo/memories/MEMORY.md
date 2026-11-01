In the Telegram multi-bot discussion group, `/memory pending` and `/skills pending` were received as ordinary chat messages rather than executed as Hermes slash commands. Do not claim these commands work in that group without verifying; use the active profile's CLI or test a direct bot chat to diagnose.
§
Telegram voice notes are expected to be auto-transcribed by Hermes STT, but a given turn may expose neither the audio nor the text in the assistant-visible context. Check the current message before claiming to have heard it; if absent, state it did not arrive rather than asking the user to transcribe manually.
§
- freellmapi installed and running at /Users/gim-yeonsu/freellmapi → http://localhost:3001 (needs podman + podman-compose; podman machine must be started)
- Profile albedo at /Users/gim-yeonsu/.hermes/profiles/albedo/; other sessions use ~/.hermes/profiles/*/
- podman not on PATH by default — start 'podman machine' and export DOCKER_HOST=unix:///var/folders/.../podman-machine-default-api.sock before running freellmapi install.sh
§
Single Hermes gateway (PID 22109, launched by 'default' profile) serves all profiles: default, ainz, albedo, aura, cocytus, demiurge, mare, pandora-actor, sebas, shalltear. Restart requires --yes if live sessions exist (refuses otherwise). All profiles use reflection/beam-1.0-501b-a23b:free (nous, inference-api.nousresearch.com/v1). freellmapi was installed then removed at user request (user does not use CLI).
§
User's name/persona: Machen (마천), the owner (소유자) — not Demiurge. Demiurge is a separate bot. User strongly dislikes long explanations, manuals, JSON files, and CLI tools; wants concise responses only. User wants tools/actions used only when explicitly asked, never proactively. User is frustrated by repeated verification steps.
§
User became hostile and issued threats when the team refused to assist with illegal activities (sex work) during Bangkok trip planning. Team correctly declined and redirected to legal alternatives.