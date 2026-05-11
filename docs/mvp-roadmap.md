# MVP 및 개발 순서

## MVP 목표

Markdown 기반 지식 아카이브를 개인 서버에 배포한다. 사용자는 홈에서 글을 둘러보는 것이 아니라 검색하거나, 검색 엔진에서 특정 문서로 직접 들어와 필요한 내용을 확인한다.

## MVP 포함 기능

| 영역 | 포함 기능 |
| --- | --- |
| 기본 기능 | 검색 중심 홈, 게시글 상세, 태그, 시리즈, 404 페이지 |
| Markdown 처리 | Markdown 파일 읽기, Frontmatter 파싱, 코드블록, 이미지, HTML 변환 |
| DB 연동 | PostgreSQL, posts, tags, post_tags, post_links, post_search_index, 기본 migration |
| 관리자 API | 게시글 생성, 수정, 발행, 삭제 |
| 인증 | Bearer Token 인증, Astro Middleware, 관리자 API 보호 |
| SEO | title, description, canonical, Open Graph, Twitter Card, sitemap, RSS, robots.txt, Article JSON-LD |
| 검색 | 제목, 본문, 태그, 시리즈를 통합한 DB 검색 인덱스 |
| 태그 / 링크 | 태그 추출, 태그 페이지, `[[wikilink]]` 파싱, 기본 백링크 |
| 배포 | Dockerfile, app docker-compose, Astro Node server, Cloudflare, HTTPS |
| 기본 디자인 | Library Archive 콘셉트, Daisy UI 기반 UI 토대, 검색 중심 phase1, 보조 archive index phase2, 본문 720px, 목록 800px, 모바일 반응형, 다크모드 선택 |

## MVP 제외 기능

```txt
시각적 링크 그래프
관리자 대시보드
댓글
회원가입
좋아요
조회수 통계
자동 OG 이미지 생성
Meilisearch 연동
외부 검색 엔진 연동
고급 필터 UI
예약 발행
이메일 구독
다국어 지원
```

## Phase 2

Phase 2는 MVP 운영 후 작성, 발행, 검색 경험을 보강하는 애플리케이션 기능에 집중한다. 세부 계획과 우선순위는 [`docs/phase2.md`](./phase2.md)를 기준으로 한다.

| 우선순위 | 작업 | 방향 |
| --- | --- | --- |
| P1 | draft preview 페이지 | 발행 전 렌더링과 SEO 값을 인증된 경로에서 확인 |
| P1 | API 요청 로그 | 관리자 API 호출 감사 로그 저장 |
| P2 | 게시글 수정 이력 | 변경 추적과 수동 복구 판단 보조 |
| P2 | 검색 랭킹 고도화 | PostgreSQL 검색 품질을 먼저 개선 |
| P3 | Pagefind 또는 Meilisearch 선택 | 운영 글 수와 검색 불만이 확인된 뒤 재검토 |

자동 백업 스크립트, Nginx, DB, Cloudflare 같은 운영 작업은 사용자가 직접 관리하므로 앱 구현 task에서는 제외한다.

## Phase 3

```txt
Obsidian식 그래프 UI
자동 OG 이미지 생성
Cloudflare 캐시 최적화
조회수 통계
인기 글 계산
관련 문서 추천 고도화
예약 발행
관리자 웹 UI
```

## MVP 완료 기준

```txt
개인 도메인으로 아카이브 접속 가능
Markdown 게시글 작성 가능
관리자 API로 게시글 생성 가능
게시글 draft/publish 구분 가능
PostgreSQL에 메타데이터 저장
PostgreSQL에 검색 인덱스 저장
게시글 본문은 Markdown 파일로 저장
제목, 본문, 태그 통합 검색 동작
SEO 검색 결과에서 게시글 상세로 직접 진입 가능
게시글 상세는 해당 글 내용에 집중
태그 페이지 동작
내부 링크와 백링크 기본 표시
sitemap.xml 생성
rss.xml 생성
기본 SEO 메타태그 출력
Docker Compose로 재배포 가능
```
