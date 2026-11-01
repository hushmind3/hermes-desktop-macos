# hermes-lang-ko

**Hermes Desktop 한국어 언어팩.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

English: [README.md](./README.md)

Hermes 에는 이미 CLI·메시징 게이트웨이(`locales/ko.yaml`)와 TUI(`ko.tui.yaml`) 한국어가 들어 있습니다. 한국어가 없는 곳은 Desktop 앱 하나입니다. 이 팩은 그 빈자리만 `locales/ko.desktop.yaml` 로 채우고, 나머지는 Hermes 에 내장된 한국어에 맡깁니다.

텍스트만 담은 언어팩입니다. YAML 파일 두 개와 `plugin.yaml`, 그리고 아무 일도 하지 않는 `register()` 만 든 `__init__.py` 로 이뤄져 있습니다(아래 참고). Hermes 백엔드가 `i18n.catalog` 로 Desktop 에 문구를 넘겨 주고, Desktop 은 이를 내장 영어 문구 위에 덮어씁니다. 팩에 없는 문구는 영어로 남습니다.

## 요구 사항

- 백엔드와 Desktop 앱 모두 Hermes Agent 0.21.6 이상. 언어팩 기능(`provides_locales`)은 hermes-agent #126296 에서 들어왔고, 이전 버전은 이 팩을 건너뜁니다.

## 설치

### 방법 A — Hermes Desktop

Capabilities → Plugins → **Git에서 설치**(Install from Git)에 `https://github.com/dandacompany/hermes-lang-ko` 를 넣고 **Review repository** → **Install** 을 누릅니다. 그다음 언어를 한국어로 바꾸고(방법 B 의 마지막 줄 또는 Desktop 언어 선택) Desktop 을 다시 시작합니다.

### 방법 B — `hermes plugins install`

```bash
hermes plugins install hermes-lang-ko                # 플러그인 카탈로그에서 설치
hermes plugins install dandacompany/hermes-lang-ko   # 이 저장소에서 바로
hermes config set display.language ko
```

Desktop(그리고 실행 중인 게이트웨이·TUI)을 다시 시작하면 Desktop 언어 선택에 **한국어** 가 보입니다.

플러그인은 프로필마다 따로 설치됩니다. Desktop 백엔드가 쓰는 프로필에 설치하거나 `-p <프로필>` 을 붙이세요.

### 방법 C — 플러그인 없이 개인 덮어쓰기

`locales/ko.desktop.yaml` 을 `<HERMES_HOME>/locales/ko.desktop.yaml` 로 복사합니다. 둘 다 있으면 플러그인 쪽이 우선합니다.

### 확인

```bash
hermes plugins list                  # hermes-lang-ko, enabled
hermes config get display.language   # ko
```

## 번역 범위

| 화면 | 출처 | 상태 |
| --- | --- | --- |
| CLI·게이트웨이 응답·승인 프롬프트 | 내장 `locales/ko.yaml` | hermes-agent 에서 관리 |
| TUI | 내장 `locales/ko.tui.yaml` | hermes-agent 에서 관리 |
| Desktop | 이 팩 `locales/ko.desktop.yaml` | v0.22.5 및 main `cb757fac59` 기준 5,384개 중 5,282개(98.1%) |

2026-10-23에 [v0.22.5](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.5)와 [main `cb757fac59`](https://github.com/NousResearch/hermes-agent/commit/cb757fac59c92b49e9b8f2910e5cd7ab75efffdd)를 대조했습니다. 0.2.4에서는 카탈로그, 하위 에이전트 라우팅, 사용량·결제, 채팅 명령과 복구 안내 등 349개를 추가하고, 영어 원문이 바뀐 기존 문구 4개를 수정했습니다. 파일에는 구버전 호환용 91개를 포함해 총 5,373개 항목이 있습니다. 최신 Hermes는 구버전 전용 키를 무시합니다.

남은 102개는 두 종류입니다. 69개는 번역할 필요가 없는 브랜드명·식별자·예시 URL·`{0} · {1}` 같은 자리표시자입니다. 나머지 33개는 조건부 문구, 선택 항목, 배열·객체 값이라 텍스트 언어팩으로 정확히 옮길 수 없습니다. 켜짐/꺼짐 표시, 있을 때만 표시하는 초기화 시각, 번갈아 나오는 입력창 안내 등이 여기에 속합니다. Desktop이 더 풍부한 덮어쓰기 형식을 지원하거나 한국어를 내장하기 전까지 영어로 남습니다. 영어와 같은 값은 일부러 넣지 않아 최신 영어 카탈로그를 그대로 따릅니다. 영어 값이 함수인 Desktop 문구는 언어팩 규약대로 위치 자리표시자 문자열(`"{0}분 전"`)로 적습니다.

번역률은 Desktop 기본 카탈로그의 키 기준이며, 화면의 모든 문구를 뜻하지는 않습니다. 예를 들어 `Add context`는 업스트림 `apps/desktop/src/app/chat/use-chat-bar-state.ts`에 직접 적혀 있고, 플러그인별 화면은 별도 카탈로그를 사용합니다. 이 언어팩으로는 해당 문구를 덮어쓸 수 없습니다.

`locales/ko.yaml` 은 일부러 비워 두었습니다. 내장 카탈로그가 이미 채우고 있고, 검증기가 파일의 존재만 요구합니다.

## 이 플러그인이 하는 일과 하지 않는 일

- 실행되는 코드가 없습니다. `__init__.py` 에는 바로 반환하는 `register()` 하나만 있습니다. Desktop 의 「Git에서 설치」 검사가 `plugin.yaml` 옆에 이 파일을 요구해서 둔 것이고, 번역 문구(`locales/`)는 `register()` 가 불리기 전에 백엔드가 매니페스트를 보고 등록합니다. JavaScript·네트워크 접속·셸 명령·백그라운드 프로세스·자격 증명 저장도 없습니다.
- 팩을 등록해도 `display.language` 는 바뀌지 않습니다. `hermes config set display.language ko` 로 직접 켭니다.
- 설치 스캐너가 `sudo` 비밀번호를 언급하거나 공식 한 줄 설치 명령을 보여 주는 화면 문구 몇 개를 `caution` 으로 표시합니다. 실행되는 내용이 아니라 영어 원문과 같은 뜻의 화면 문구입니다.

## 새 Hermes 버전에 맞추기

`locales/ko.desktop.yaml` 이 원본이고 직접 고칩니다. Desktop 키가 바뀌면 대상 버전의 키 목록에 맞춥니다.

```bash
node tools/sync-keys.mjs --keys <hermes-agent>/locales/_keys.desktop.json --missing missing.txt   # 보고만
node tools/sync-keys.mjs --keys <hermes-agent>/locales/_keys.desktop.json --fix                   # 사라진 키 제거
hermes plugins validate .
```

`missing.txt`에는 위에서 설명한 의도적인 폴백을 포함해 팩에 없는 모든 키가 나옵니다. 영어 원문을 확인하고 표현 가능한 항목을 직접 번역합니다. `--fix`는 구버전용 키도 삭제하므로, 구버전 호환을 유지하려면 생략하세요. 이전 점검 시점과 영어 값도 비교해야 합니다. 키가 같아도 문구의 의미는 바뀔 수 있습니다.

## 번역과 출처

한국어 문구는 단테랩스가 영어 Desktop 카탈로그만 보고 AI 도움을 받아 독립적으로 번역했습니다. 어색한 번역은 이슈나 PR 로 알려 주세요.

0.1.1 까지의 릴리스는 [@dalgme](https://github.com/dalgme) 와 기여자들이 [NousResearch/hermes-agent#40716](https://github.com/NousResearch/hermes-agent/pull/40716) 에서 제안한 Desktop 한국어로 만들었고, 그 출처 표기를 유지합니다. 0.2.0 부터는 그 문구를 하나도 쓰지 않습니다. 이 팩은 #40716 을 대신하지 않습니다. Desktop 에 한국어가 내장되면 빠진 문구만 남기거나 팩을 정리합니다. [NOTICE](./NOTICE) 참조.

## 라이선스

[MIT](./LICENSE)

---
Built by [Dante Labs](https://dante-labs.com) · [YouTube @dante-labs](https://youtube.com/@dante-labs) · [dante@dante-labs.com](mailto:dante@dante-labs.com) · [Discord](https://discord.com/invite/rXyy5e9ujs) · [Buy Me a Coffee](https://buymeacoffee.com/dante.labs)
