# MVP 및 개발 순서

## MVP 목표

Markdown 기반 게시글을 작성하고, 개인 서버에 배포하여 SEO 기본 요건을 갖춘 블로그를 공개한다.

## MVP 포함 기능

| 영역 | 포함 기능 |
| --- | --- |
| 블로그 기본 기능 | 홈, 게시글 상세, 태그, 시리즈, 404 페이지 |
| Markdown 처리 | Markdown 파일 읽기, Frontmatter 파싱, 코드블록, 이미지, HTML 변환 |
| DB 연동 | PostgreSQL, posts, tags, post_tags, post_links, 기본 migration |
| 관리자 API | 게시글 생성, 수정, 발행, 삭제 |
| 인증 | Bearer Token 인증, Astro Middleware, 관리자 API 보호 |
| SEO | title, description, canonical, Open Graph, Twitter Card, sitemap, RSS, robots.txt, Article JSON-LD |
| 태그 / 링크 | 태그 추출, 태그 페이지, `[[wikilink]]` 파싱, 연결된 글, 기본 백링크 |
| 배포 | Dockerfile, docker-compose, nginx.conf, PostgreSQL container, Astro Node server, Cloudflare, HTTPS |
| 기본 디자인 | Daisy UI 기반 텍스트 중심 레이아웃, 상단 네비게이션, 본문 720px, 태그, 관련 글, 모바일 반응형, 다크모드 선택 |

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
고급 검색
예약 발행
이메일 구독
다국어 지원
```

## Phase 2

```txt
draft preview 페이지
검색 인덱스 생성
Pagefind 또는 Meilisearch 연동
API 요청 로그
게시글 수정 이력
자동 백업 스크립트
```

## Phase 3

```txt
Obsidian식 그래프 UI
자동 OG 이미지 생성
Cloudflare 캐시 최적화
조회수 통계
인기 글 계산
관련 글 추천 고도화
예약 발행
관리자 웹 UI
```

## MVP 완료 기준

```txt
개인 도메인으로 블로그 접속 가능
Markdown 게시글 작성 가능
관리자 API로 게시글 생성 가능
게시글 draft/publish 구분 가능
PostgreSQL에 메타데이터 저장
게시글 본문은 Markdown 파일로 저장
태그 페이지 동작
내부 링크와 백링크 기본 표시
sitemap.xml 생성
rss.xml 생성
기본 SEO 메타태그 출력
Docker Compose로 재배포 가능
```
