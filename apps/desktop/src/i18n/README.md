# Desktop 언어 리소스

용도: 앱 시작·언어 선택·저장·재시작 복원과 번역 카탈로그의 구현 위치를 안내합니다.

- `catalog.ts`, `types.ts`, `languages.ts`: 기본 포함 언어와 별칭·선택 목록. 한국어 ko/ko-KR는 앱 기본 언어이므로 플러그인 등록 전에도 저장·정규화·복원이 가능합니다.
- `ko.ts`: 설치된 hermes-lang-ko v0.2.4의 기존 5,282개 번역과 누락 보완을 기존 defineLocale/mergeTranslations로 결합합니다. 새 번역 체계나 로더를 만들지 않습니다. 기존 플러그인은 선택적 덮어쓰기로 계속 호환됩니다.
- `context.tsx`: 기존 display.language의 실제 설정 읽기·저장과 재시작 복원. config 읽기 출처를 보존하므로 연결된 프로필에 저장하며 언어를 강제로 한국어로 고정하지 않습니다.
- `registry.ts`: 앱 기본 언어 위에 외부 언어팩을 적용하는 기존 등록 기능.
- 확인: context/languages 테스트의 한국어 저장 후 remount 복원, catalog/overlay-completeness 테스트로 키·값 형식·누락을 확인합니다. Windows 실제 프로세스 재시작 확인과 단위 테스트는 구분합니다.
