# AGENTS.md

## 현재 작업 단계

이 프로젝트는 당분간 문서 정리 단계다.

코드 구현, 기능 추가, 리팩터링, 의존성 추가, DB schema 확정, API 구현은 사용자가 명시적으로 요청하기 전까지 진행하지 않는다.

현재 목표는 다음 문서들을 기준으로 프로젝트 방향, 작업 순서, MVP 범위, 운영 정책을 명확히 정리하는 것이다.

- `README.md`
- `docs/project-structure.md`
- `docs/development.md`
- `docs/api.md`
- `docs/mvp-roadmap.md`
- `docs/task/*.md`

## 작업 원칙

- 사용자가 요청한 문서 작업만 수행한다.
- 사용자가 “구현”, “코드 수정”, “설정 적용”을 명시하기 전에는 코드 파일을 변경하지 않는다.
- 문서 정리 중 필요한 코드 변경 아이디어가 떠오르면 바로 적용하지 말고 문서의 task 또는 메모로만 남긴다.
- 임의로 기술 선택을 바꾸지 않는다.
- 현재 확정된 기준과 충돌하는 내용이 있으면 사용자에게 확인한다.
- 한 번에 큰 범위를 구현하지 말고, 사용자가 요청한 단위로 차근차근 진행한다.

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

MVP는 Markdown 블로그 + DB 메타데이터 + 관리자 API + SEO + 배포까지다.

MVP에 포함:

- 홈, 게시글 상세, 태그, 시리즈, 404 페이지
- Markdown 파일 읽기
- Frontmatter 파싱
- Markdown HTML 변환
- PostgreSQL / Drizzle 기본 schema와 migration
- 게시글 생성, 수정, 발행, 삭제 관리자 API
- Bearer Token 인증
- SEO 메타태그, sitemap, RSS, robots.txt, Article JSON-LD
- `[[wikilink]]` 파싱
- 기본 백링크와 관련 글 표시
- Docker Compose, Nginx, Cloudflare 배포 기준
- Daisy UI 기반 텍스트 중심 UI

MVP 제외:

- AI 자동 글 작성
- 시각적 링크 그래프
- 관리자 대시보드
- 댓글
- 회원가입
- 좋아요
- 조회수 통계
- 자동 OG 이미지 생성
- Meilisearch 연동
- 고급 검색
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

현재 단계에서는 기본적으로 `.md` 문서만 수정한다.

예외는 사용자가 명시적으로 다음과 같이 요청한 경우다.

- 특정 설정 파일 수정 요청
- 커밋/푸시 요청
- 코드 구현 시작 요청
- 파일 구조 변경 요청

그 외에는 코드 파일을 수정하지 않는다.
