# AGENTS.md

## 현재 작업 단계

이 프로젝트는 task 단위로 차근차근 진행한다.

작업은 `docs/task/`의 task 문서를 기준으로 한다. 사용자가 특정 task를 지정하면 해당 task의 범위 안에서만 진행한다.

사용자가 명시적으로 구현을 요청하기 전까지는 문서 정리 단계로 간주한다. 구현을 요청한 경우에도 지정된 task의 “하지 말 것”과 “완료 기준”을 우선한다.

프로젝트 방향과 작업 기준은 다음 문서를 따른다.

- `README.md`
- `docs/project-structure.md`
- `docs/development.md`
- `docs/api.md`
- `docs/mvp-roadmap.md`
- `docs/design/*.md`
- `docs/design/*.html`
- `docs/task/*.md`

## 작업 원칙

- 사용자가 지정한 task 또는 문서 작업만 수행한다.
- 사용자가 “구현”, “코드 수정”, “설정 적용”, “task N 진행”을 명시하기 전에는 코드 파일을 변경하지 않는다.
- 문서 정리 중 필요한 코드 변경 아이디어가 떠오르면 바로 적용하지 말고 문서의 task 또는 메모로만 남긴다.
- 임의로 기술 선택을 바꾸지 않는다.
- 현재 확정된 기준과 충돌하는 내용이 있으면 사용자에게 확인한다.
- 한 번에 큰 범위를 구현하지 말고, 사용자가 요청한 단위로 차근차근 진행한다.

## Task 진행 규칙

task 작업은 `docs/task/taskN.md`를 단일 기준 문서로 삼는다.

작업 시작 전:

- 해당 task 파일을 먼저 읽는다.
- 관련 상위 문서도 확인한다.
  - `docs/mvp-roadmap.md`
  - `docs/project-structure.md`
  - 필요 시 `docs/api.md`, `docs/development.md`, `docs/design/design-concept.md`
- task의 `status`를 확인한다.
- 사용자가 명시하지 않은 다른 task를 같이 진행하지 않는다.

작업 중:

- 시작하면 해당 task frontmatter를 `status: in_progress`, `status_label: 진행중`으로 변경한다.
- task의 “하지 말 것”을 위반하지 않는다.
- 범위 밖의 문제가 보이면 즉시 구현하지 말고 해당 task 문서의 메모나 후속 task 후보로 남긴다.
- 다른 task가 먼저 필요하다고 판단되면 작업을 중단하고 사용자에게 순서 변경을 제안한다.

작업 완료 시:

- 완료 기준을 모두 충족했는지 확인한다.
- 충족했다면 해당 task frontmatter를 `status: done`, `status_label: 완료`로 변경한다.
- 완료하지 못했다면 `status: blocked`, `status_label: 막힘`으로 변경하고 막힌 이유를 task 문서에 적는다.
- `docs/task/README.md`의 상태 표도 함께 업데이트한다.
- 구현이 포함된 경우 가능한 검증 명령을 실행하고 결과를 요약한다.

상태값:

| status | status_label | 의미 |
| --- | --- | --- |
| `todo` | 할일 | 아직 시작하지 않은 작업 |
| `in_progress` | 진행중 | 현재 진행 중인 작업 |
| `done` | 완료 | 완료 기준을 충족한 작업 |
| `blocked` | 막힘 | 외부 결정, 권한, 정보 부족으로 진행이 막힌 작업 |

## Task 범위 관리

- task 하나는 가능하면 하나의 커밋 단위로 끝낸다.
- 여러 task를 한 번에 묶지 않는다.
- task 중간에 사용자가 방향을 바꾸면 최신 요청을 우선한다.
- task 문서와 실제 구현이 충돌하면 task 문서를 먼저 고치고 사용자 확인 후 구현한다.
- task 완료 후 새로 발견된 작업은 기존 task에 억지로 넣지 말고 새 task 후보로 정리한다.

## 현재 확정 기준

- 프레임워크: Astro
- 언어: TypeScript
- 패키지 매니저: pnpm
- DB: PostgreSQL
- ORM: Drizzle ORM
- 렌더링: SSR / Hybrid
- 배포: Docker Compose
- 리버스 프록시: Nginx
- 도메인/CDN/SSL: Cloudflare
- 인증: Bearer Token, 선택적 HMAC
- 스타일링: Daisy UI
- 본문 저장: 운영 서버의 Markdown 파일
- 메타데이터 저장: PostgreSQL

## 운영 데이터 정책

게시글 Markdown은 운영 중 API로 생성·수정되는 런타임 데이터다.

따라서 `content/posts/**/*.md`는 Git에 올리지 않는다. 저장소에는 폴더 구조 유지를 위한 `.gitkeep`만 둔다.

검색/그래프 인덱스 파일도 생성물로 보고 Git에 올리지 않는다.

## MVP 범위

MVP는 Markdown 지식 아카이브 + DB 메타데이터 + 검색 인덱스 + 관리자 API + SEO + 배포까지다.

MVP에 포함:

- 홈 검색 화면, 게시글 상세, 태그, 시리즈, 404 페이지
- Markdown 파일 읽기
- Frontmatter 파싱
- Markdown HTML 변환
- PostgreSQL / Drizzle 기본 schema와 migration
- 제목, 본문, 태그 통합 검색을 위한 DB 검색 인덱스
- 게시글 생성, 수정, 발행, 삭제 관리자 API
- Bearer Token 인증
- SEO 메타태그, sitemap, RSS, robots.txt, Article JSON-LD
- `[[wikilink]]` 파싱
- 기본 백링크와 내부 링크 표시
- Docker Compose, Nginx, Cloudflare 배포 기준
- Daisy UI 기반 Library Archive 검색 중심 UI

MVP 제외:

- 시각적 링크 그래프
- 관리자 대시보드
- 댓글
- 회원가입
- 좋아요
- 조회수 통계
- 자동 OG 이미지 생성
- Meilisearch 연동
- 외부 검색 엔진 연동과 고급 필터 UI
- 예약 발행
- 이메일 구독
- 다국어 지원

## 문서 작업 시 우선순위

1. 기존 문서 간 충돌 제거
2. MVP 범위와 제외 범위 명확화
3. task 문서의 순서와 완료 기준 정리
4. 운영 정책 정리
5. 배포/백업 정책 정리
6. 이후 구현 단계에서 사용할 결정 사항 확정

## 코드 작업 제한

사용자가 특정 task 구현을 요청하기 전에는 기본적으로 `.md` 문서만 수정한다.

예외적으로 `docs/design/*.html`은 구현 코드가 아니라 디자인 시안 문서로 취급한다. 사용자가 디자인 문서 정리를 요청한 경우에는 이 파일들을 읽고 분석할 수 있으며, 명시 요청이 있을 때만 수정한다.

예외는 사용자가 명시적으로 다음과 같이 요청한 경우다.

- 특정 설정 파일 수정 요청
- 커밋/푸시 요청
- 코드 구현 시작 요청
- 특정 task 진행 요청
- 파일 구조 변경 요청

그 외에는 코드 파일을 수정하지 않는다.
