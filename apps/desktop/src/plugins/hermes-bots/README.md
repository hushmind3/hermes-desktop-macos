# Hermes Bots 그룹방 구현 안내

용도: 기존 Hermes Desktop 봇 목록·공유 그룹방·입력창·그룹 모델 선택의 수정 위치를 안내합니다.

- `canonical-group-registry.tsx`, `roster-pane.tsx`: 연결 게이트웨이의 기존 방을 조회하고 소유 프로필·room_id로 엽니다. 공유 서버 목록의 같은 방은 중복 표시하지 않습니다.
- `canonical-group-workspace.tsx`: 기존 방 기록·활동 표시·전송과 그룹 전체 모델 선택 화면입니다. 기존 `ModelPicker`와 `GroupMentionInput`을 재사용합니다. Enter 전송, Shift+Enter 줄바꿈, 한글 조합 중 전송 방지를 지원합니다.
- `canonical-group-delete.tsx`: 그룹 목록과 열린 그룹 화면의 공통 삭제 버튼입니다. 확인창을 연 시점의 연결·소유 프로필·방 ID를 고정해 기존 `groups.disband`를 호출하고, 성공한 뒤에만 해당 방의 연결 캐시를 제거하고 목록을 다시 조회합니다. 실패하면 확인창과 방을 유지하며 같은 취소 ID로 재시도합니다. 봇과 개인 대화는 삭제하지 않습니다. 워크스페이스는 다른 기기에서 삭제된 방도 읽어 전송을 중지합니다.
- `model-picker.tsx`: 해당 게이트웨이의 기존 `model.options` 목록을 사용합니다. 그룹에서는 `include_unconfigured=false`로 설정된 제공자만 표시하고, 고급 편집기의 전체 목록과 캐시를 구분합니다. 특정 모델을 하드코딩하지 않습니다. 그룹 선택은 명시적으로 적용할 때만 저장합니다.
- API: `groups.list/state/log/send/model`은 기존 게이트웨이의 JSON-RPC 경로입니다. `groups.model`은 room_id, model, provider, request_id를 받으며 그룹 전체의 다음 응답 모델을 설정합니다. 개인 봇 프로필 설정은 수정하지 않습니다.
- 서버 소유 코드: `gateway/session_group_controls.py`, `session_hosted_service.py`, `session_hosted_rpc.py`, `session_hosted_transport.py`. 방 모델은 기존 state_meta에 저장하고 OS 인증을 거친 그룹 멤버 경로를 통해 기존 세션 모델 변경 기능으로 적용합니다. 기존 모델 변경 보호 검사는 유지합니다.
- 계약: `tui_gateway/contracts/canonical.py`, `groups_bot_relay.py`. 번역은 `canonical-group-locales.ts`, `ko.ts`에 있습니다.
- 확인: 기존 입력창·IME·방 다시 열기 테스트, TypeScript 검사와 기존 `apps/desktop`의 `npm run pack`을 사용합니다. 빌드와 실제 앱 적용은 별도 단계입니다. 실제 API 검증 결과·적용 상태는 기존 언어팩 README에 기록합니다.

서버 원본 설치 경로는 `~/.hermes/hermes-agent`이며, Mac 실행 앱은 `apps/desktop/release/mac-arm64/Hermes.app`입니다. 클라이언트 입력창 수정은 각 기기의 앱 빌드에 반영해야 합니다.
모델 선택과 삭제 UI의 공통 소스를 수정했다면 Mac·Windows 각각의 실제 실행 경로에 renderer를 배포하고, 현재 `index.html`이 참조하는 모듈에 `groups.model`·`groups.disband`가 모두 포함되는지 확인합니다. 서버 데이터 공유만으로 설치된 앱의 화면 코드가 갱신되지는 않습니다.
