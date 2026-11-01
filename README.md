# Hermes 전체 상태 스냅샷 (2026-11-01)

`~/.hermes`의 설정·페르소나·플러그인·소스·방/브리지 상태를 GPT가 바로 읽을 수 있게 정리한 저장소입니다.

## 구성

| 경로 | 내용 |
|---|---|
| `config/` | 루트 `config.yaml`, `.env`, `ui-preferences.json`, `gateway_state.json`, 세션 인덱스 |
| `profiles/<봇>/` | 봇별 `config.yaml`, `SOUL.md`, `.env`, `auth.json`, `memories/`, `bot_relay/`, `sessions/`, `hooks/`, `cron/` |
| `desktop-plugins/` | 데스크톱 플러그인 소스 (`all-bots-model`, `korean-ui`, `hermes-lang-ko-live`, `hermes-newswire`, `hermes-ui-collection`) |
| `plugins/telegram-room-bridge/` | Telegram↔방 브리지 소스, 방 매핑, 전달 커서 |
| `skills/` | 전역 스킬 |
| `hermes-agent/` | Hermes 소스 (node_modules·.git·release·build 캐시 제외) |
| `state/` | 활성 방 목록, 봇 모델 표, 브리지 설정 |

## 봇 모델

| 프로필 | 제공업체 | 모델 | 추론 |
|---|---|---|---|
| ainz | opencode-go | deepseek-v4.1-flash | none |
| albedo | opencode-go | deepseek-v4.1-flash | none |
| aura | opencode-go | deepseek-v4.1-flash | none |
| cocytus | opencode-go | deepseek-v4.1-flash | none |
| demiurge | opencode-go | deepseek-v4.1-flash | none |
| mare | opencode-go | deepseek-v4.1-flash | none |
| pandora-actor | opencode-go | deepseek-v4.1-flash | none |
| sebas | opencode-go | deepseek-v4.1-flash | none |
| shalltear | opencode-go | deepseek-v4.1-flash | none |

## 활성 방 / 텔레그램

- `edd5ffbd-2db4-4e22-9ffb-dabf2ec94e35` — 텔레그램나자릭5명회의1 (next_seq=161)
- `078989e1-89c1-4d7e-ba36-e5faae2060dd` — 텔레그램나자릭4회의새로만든거 (next_seq=68)

- 기본 브리지: chat `-1003904635306` → room `edd5ffbd-2db4-4e22-9ffb-dabf2ec94e35`
- 추가 방: chat `-1004310683072` → room `078989e1-89c1-4d7e-ba36-e5faae2060dd`

## 최근 상태

- 대화 기록 DB 초기화 후 새 세션으로 재생성
- 방 엔진은 원본 기본값으로 복원, 검증 버그만 최소 수정
- 봇 9개 모델/추론 일괄 적용 지원 (`모든 봇 모델` 페이지)
- 게이트웨이는 launchd 상시 감독으로 운영

## 제외 (재생성 가능/용량)

- `backups/`, `cache/`, `installs/`, `tools/`, `logs/`
- `node_modules/`, `.git/`, `release/`, `build/` 캐시, `state.db` 바이너리

## 주의

- 비공개 저장소이며 API 키·봇 토큰이 포함되어 있습니다. 공개 전환하지 마세요.
