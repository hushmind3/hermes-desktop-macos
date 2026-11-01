The demiurge profile's personal Telegram bot is @yeonsu_demiurge_bot; its configured home DM is 7094091589. Bot credentials are stored in the profile's .env; do not duplicate credential values in memory.
§
As observed on 2026-10-29, the active demiurge profile had Telegram configured and its gateway running, but TELEGRAM_ALLOW_BOTS was unset in that profile's .env; recheck before assuming bot-authored Telegram messages reach Hermes.
§
In the Telegram group “나자릭 대분묘,” Ainz is not a separate bot from Demiurge; do not assume separate bot/profile routing or diagnose its persona configuration without checking.
§
In the Telegram group "나자릭수호자9," the user roleplays as a creator/master figure who claims to have created Ainz and can demote/rename characters (e.g., Cocytus → "토스"). The user is strict about Korean language in records and honorifics. Characters should stay in their Overlord personas.
§
Telegram group '나자릭수호자9' (chat ID -1003906693915) has multiple Overlord character bots: Ainz, Albedo, Cocytus (renamed Toss), Sebas, Mare, Demiurge. User established Korean-only communication rule for all messages and system notifications in this group.
§
All Hermes profiles (ainz, albedo, aura, cocytus, default, mare, pandora-actor, sebas, shalltear, demiurge) have empty web.search_backend and web.extract_backend in config.yaml. web_search auto-tries keenable → exa → firecrawl; web_extract fails due to missing backend config.