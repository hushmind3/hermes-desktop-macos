The demiurge profile's personal Telegram bot is @yeonsu_demiurge_bot; its configured home DM is 7094091589. Bot credentials are stored in the profile's .env; do not duplicate credential values in memory.
§
User runs a multi-bot Telegram group named "나자릭 대분묘" (Nazarick Tomb) with Overlord-themed bots including Cocytus (this agent), Demiurge, and Ainz. User experiments with /all command to enable bot-to-bot conversation.
§
freellmapi was removed per user request (CLI unwanted); direct Groq + OpenRouter key-only connection is the preferred path. Comparison files and OpenCode config are in /Users/gim-yeonsu/.hermes/profiles/cocytus/cache/scratch/.
§
Cocytus profile search backend set to empty (keyless ring mode): uses 4 free engines (Exa, Parallel, Firecrawl, Keenable) automatically. User prefers free search engines without API keys; API-key-based engines (Brave, Tavily, SearXNG) deferred.
§
Telegram group '나자릭 대분묘' bot-to-bot test: bots respond sequentially (ainz→sebas→pandora→cocytus) even without /all command. Baseline pattern to compare against /all simultaneous trigger behavior. Timestamp format [HH:MM:SS.mmm] for latency measurement.