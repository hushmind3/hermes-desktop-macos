# Hermes Desktop 한국어 언어팩

용도: 기존 데스크톱 한국어팩과 새 봇 언어 상속·봇 화면 번역의 로컬 수정 위치를 안내합니다.

- `plugin.js`: dandacompany/hermes-lang-ko v0.2.4의 기존 번역 5,282개를 유지하고, 현재 버전에서 빠진 102개를 SDK의 앱 언어 등록으로 보완합니다. 현재 코어 키 5,384개에 대응하며 제품명·URL·식별자는 유지합니다. 함수·배열 형식도 유지합니다. 기존 `korean-ui` 플러그인은 보존합니다.
- 실제 설치본: `~/.hermes/hermes-agent/`. 실행 앱은 `apps/desktop/release/mac-arm64/Hermes.app`입니다.
- `hermes_cli/profiles_initialization.py`: 새 프로필에서 언어가 없으면 실행 프로필의 `display.language`를 상속합니다. 명시된 언어와 전체 복제 스냅샷은 보존합니다. 모델·키·대화는 변경하지 않습니다.
- `apps/desktop/src/plugins/hermes-bots/ko.ts`: 봇 생성·편집·목록·그룹·화면·예약 작업 번역 428개. `i18n.ts`의 BOTS_LOCALES에서 등록합니다.
- `canonical-group-registry.tsx`·`roster-pane.tsx`: 그룹 목록은 현재 게이트웨이의 접근 가능한 봇 프로필을 함께 조회합니다. 그룹의 원래 소유 프로필과 room_id로 열며, 조회만으로 새 그룹·세션·모델 호출을 만들지 않습니다.
- `gateway/session_hosted_service.py`: 이 설치본의 명시적 `hosted_rooms.owner_aliases`로 Mac 네이티브 소유자와 사용자가 지정한 Basic 로그인 계정의 그룹 접근을 연결합니다. 기존 소유자 값·방 ID·이벤트·작업 주체를 변경하지 않습니다. 원래 구현은 같은 Mac 서버에서도 두 인증 주체의 그룹을 서로 숨겼습니다. 설정은 루트 config.yaml 한 곳에서 읽고 게이트웨이 재시작 때 적용합니다. 관련 설명은 `website/docs/user-guide/bot-mode.md`에 있습니다. 다른 계정은 자동으로 공유되지 않습니다.
- `gateway/session_group_controls.py`: `hosted_rooms.shared_directory: true`이면 호스트 범위 접속의 그룹 목록을 서버 전체의 접근 가능한 방으로 통합하고, 방 ID로 원래 소유 프로필에 읽기·전송·제어를 연결합니다. 프로필 범위 티켓은 확장하지 않으며 기존 방별 권한 검사를 유지합니다. 여러 프로필에서 같은 ID가 발견되면 모호한 요청을 거부합니다. 현재 Mac 목록은 같은 방이 여러 조회에 반복돼도 한 번만 표시합니다. 이 서버 설정은 Windows 앱 코드 변경 없이 적용됩니다.
- `desktop-ko.patch`: 위 소스 변경을 보존한 패치입니다. 기준 원본 `bf0203a794a07aac3ff764972ab9087baa4e4f4e`. 원본 업데이트 뒤에는 해당 설치본에서 `git apply --check <이 패치의 절대 경로>`로 호환성을 확인하고 충돌을 강제로 덮어쓰지 않습니다. 데스크톱 번역 소스 변경 후 기존 `apps/desktop`의 `npm run pack`으로 앱을 갱신합니다.
- `backups/2026-10-28/`: 변경 전 프로필 config.yaml 백업. 비밀값이 포함될 수 있으므로 공개하거나 GitHub에 올리지 않습니다.

확인: 현재 설치본에서 언어가 없던 albedo/coder/planner/researcher에 동일한 상속 함수를 실행해 ko 저장과 다른 설정 불변을 확인했습니다. 기본 프로필도 ko로 저장했습니다. 원문 428개와 번역 키·값 형식 일치, TypeScript 검사, 기존 앱 빌드·패키징을 통과했습니다. 모델 호출과 검사용 봇 생성은 하지 않았습니다. GUI 자동 조작은 사용하지 않았습니다.

추가 확인: 코어 5,384개 키의 누락 0개, 봇 428개 번역의 누락·형식 차이 0개. 그룹 소유자/다시 열기 관련 기존 테스트 13개와 TypeScript 검사·앱 패키징을 통과했습니다. 기존 그룹의 hosted_rooms·이벤트 기록은 삭제·이동하지 않았습니다. 그룹 탭 자체는 일시적인 workspace이므로 앱을 다시 열면 그룹 목록에서 기존 방을 열 수 있습니다. 새 그룹을 만들 필요가 없습니다.

그룹 공유 수정 전 실측: 기본 프로필 그룹 2개·albedo 그룹 1개는 Basic 로그인 소유자, demiurge 그룹 1개는 Mac 네이티브 소유자였습니다. 원격 API에서 demiurge 목록이 비어 있어 소유자 필터 문제를 재현했습니다. 변경 전 설정·서버 소스·해당 DB 3개는 `backups/2026-10-28/group-sharing/`에 보존했습니다. 세션 생성은 Windows에서 이미 수정됐음을 확인해 이 작업에서 잠시 추가한 세션 프로토콜 변경은 되돌렸습니다. 이후 서버 공유 목록으로 프로필 조회 차이도 처리했습니다.

서버 적용 후 실제 확인: 게이트웨이 1회 재시작 후 네이티브 제어 소켓의 로컬 티켓과 공개 Tailscale 주소의 실제 Basic 로그인·WS 티켓으로 각각 접속했습니다. default 2개·albedo 1개·demiurge 1개의 방 ID가 양쪽에서 같고, 각 방의 기존 그룹 로그 8·6·5·17개(총 36개)가 JSON 전체 기준으로 같았습니다. 새 그룹·그룹 메시지·모델 호출은 만들지 않았습니다. 이전 프로세스는 정상 종료 시간 초과로 공식 재시작 명령이 SIGKILL 후 재기동했습니다. 사용자가 다시 확인한 결과 Mac에서는 Windows 그룹이 표시되고 Windows에서는 Mac 그룹이 표시되지 않았습니다. 당시에는 권한만 연결됐고 목록은 프로필별이었습니다. 관련 2개 파일만 담은 `~/.hermes/remote-access/windows-group-sharing.patch`(3,618바이트)를 Tailscale 파일 전송으로 Windows에 전달했습니다. 이 Windows 패치 적용 경로는 서버 shared_directory 방식으로 대체했습니다. Windows 앱 변경과 방 이동은 하지 않았습니다.


공유 목록 서버 적용 확인: 루트 hosted_rooms.shared_directory를 적용했습니다. 봇 작업이 0개일 때 게이트웨이를 재시작하고 Mac 앱을 다시 열었습니다. Windows와 같은 공개 URL·query ticket·기본 프로필에서 기존 방 4개가 조회되고 Mac 네이티브/demiurge 및 원격/albedo의 목록과 같았습니다. 기본 프로필에서 Mac 방 로그 17개, Mac 프로필에서 Windows 방 로그 8개가 양쪽과 동일했습니다. 2개씩 페이지 조회, 목록 조회 없이 Mac 방 직접 열기도 성공했습니다. 프로필 범위 티켓은 기본 방 2개로 제한됐습니다. 새 그룹·메시지·모델 호출은 만들지 않았습니다. 기존 테스트 13개, TypeScript 검사와 Mac 패키징을 통과했습니다. Windows 화면 표시는 사용자 확인 대기입니다.

그룹 입력창·모델 선택 적용: canonical-group-workspace가 기존 GroupMentionInput과 ModelPicker를 재사용합니다. Enter 전송·Shift+Enter 줄바꿈·IME 조합 보호와 그룹 전체 모델 적용 버튼을 추가했습니다. canonical-group-locales의 기존 9개 언어와 ko.ts에 관련 문구 4개를 추가했습니다. groups.model은 기존 state_meta에 방 모델을 저장하며, 인증된 멤버 경로를 통해 기존 세션 모델 변경 기능으로 적용합니다. 프로필 모델·다른 대화·페르소나·기억은 수정하지 않습니다. 최초 그룹 응답이 없는 멤버는 세션을 생성하지 않고 다음 실제 응답 때 적용합니다. 기존 모델 선택 보호 검사를 우회하지 않습니다.

확인: 입력·IME·기존 그룹 열기 테스트 25개, TypeScript 검사와 Mac 앱 패키징을 통과했습니다. 실제 공개 원격 API에서 기존 albedo 그룹에 현재와 같은 gpt-6-luna/openai-codex를 적용하고 공유 groups.state 저장값 및 albedo·demiurge의 적용 영수증을 확인했습니다. 두 프로필의 세션 수·메시지 수·모델 호출 수는 증가하지 않았습니다. Mac 앱은 새 빌드로 재실행했습니다. Windows에는 UI 변경만 담은 ~/.hermes/remote-access/hermes-group-controls.patch를 전송했으며, Windows 앱 빌드 적용은 아직 미완료입니다. 기존 Windows 세션 생성·게이트웨이 호환 수정은 패치에서 제외해 보존합니다.

기존 환경 모델 목록 정리: 그룹 ModelPicker는 기존 model.options를 include_unconfigured=false로 조회하며 고급 편집기 목록과 캐시를 구분합니다. 실제 API에서 openai-codex 15개·copilot 45개·gemini 17개 모델이 조회됐습니다. 모델 선택창 테스트 9개와 TypeScript 검사·Mac 빌드를 통과했습니다. 검증 때 저장했던 albedo 그룹의 gpt-6-luna 고정값은 해당 검증 revision과 일치하는 경우에만 백업 후 제거했고, 멤버 2개의 검증 적용 영수증도 같은 revision만 제거했습니다. 실제 groups.state의 model_selection=null을 확인했습니다. 현재 모델 기본값·설정·대화는 변경하지 않았습니다. Mac 앱을 새 빌드로 열었습니다. Windows에는 기존 언어팩 plugin.js와 한국어 봇 번역·그룹 입력창·환경 모델 목록 소스만 담은 hermes-korean-group-update.zip을 Tailscale로 전송했습니다. Windows 기존 프로토콜 수정은 제외했습니다. Windows 설치·실행은 여전히 미완료이며, 압축 파일에는 적용 안내가 있습니다.
