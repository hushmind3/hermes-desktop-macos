# Hermes macOS backup — 2026-10-29

Private backup of the currently customized Apple Silicon Hermes desktop source.
Upstream base: `bf0203a794a07aac3ff764972ab9087baa4e4f4e`.

## Included

- Full current source snapshot, including all tracked local changes and untracked source files.
- Korean desktop/Bot Mode resources, shared group ownership and model selection, and confirmed group deletion.
- Regression tests and the original repository AGENTS.md instructions.
- A macOS `.app` ZIP and SHA-256 checksum are stored as assets of the matching backup release.

## Existing server layout

The MacBook is the main Hermes server and owns conversations, memory, skills and tools.
Both desktop clients may choose MacBook Ollama or Windows Ollama for local inference.
The app UI is native: source changes must be built and deployed for both macOS and Windows.
The Windows repository is separate and was not changed by this backup.

## Restore

For the prebuilt app, download the `.zip` release asset, verify its SHA-256, and extract it with macOS Archive Utility or `ditto`.
Keep the existing `~/.hermes` user state and use the restored app with it. Do not replace user configuration with an example file.
For a source build, follow the repository development instructions (`./activate`, root npm dependencies, then the Desktop package build/pack scripts).
Use the README and AGENTS.md files for the supported package manager and build workflow.

The last startup repair used the existing `hermes --profile default gateway migrate --multiplex` workflow:
a stale Homebrew per-profile launchd service was replaced by the current default service serving all 10 profiles.
If restoring that startup state, inspect `--dry-run` first; the command manages its own migration backup and verification.

## Validation at backup time

- macOS group/model/delete tests: 57 passed; frontend TypeScript and renderer build passed.
- Windows matching deployment reported 59 passing tests; macOS and Windows UI bundles both contain groups.model and groups.disband.
- Mac startup recovery: canonical gateway ready, profile API HTTP 200, and the Korean app/group screen observed with the installed computer-use MCP.
- No existing group was deleted as part of testing.

## Deliberately separate user state

API keys, OAuth tokens, `.env`, auth stores, personal conversation databases/logs, downloaded models,
and private user profile/memory content are not part of this Git backup or app ZIP.
They remain on the Mac; this is a source/application backup, not a personal-data export.
