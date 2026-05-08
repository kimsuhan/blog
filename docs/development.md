# 개발 문서

## 패키지 관리

이 프로젝트는 pnpm을 기준으로 패키지를 관리한다.

```sh
pnpm install
pnpm dev
pnpm build
```

주요 스크립트:

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | Astro 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm db:generate` | Drizzle migration 생성 |
| `pnpm db:migrate` | Drizzle migration 적용 |

## 환경 변수

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `ADMIN_API_TOKEN` | 관리자 API Bearer Token |

초기 환경 변수 템플릿은 `.env.example`에 둔다.

## Drizzle ORM

DB 스키마는 `drizzle/schema.ts`에서 관리한다.

마이그레이션 파일은 `drizzle/migrations/`에 생성한다.

```sh
pnpm db:generate
pnpm db:migrate
```

초기 핵심 테이블:

| 테이블 | 역할 |
| --- | --- |
| `posts` | 게시글 메타데이터와 발행 상태 |
| `tags` | 태그 목록 |
| `post_tags` | 게시글과 태그 연결 |
| `post_links` | wikilink, markdown link, tag link 및 백링크 관계 |
| `api_keys` | 관리자 API 키 해시와 상태 |
| `publish_logs` | 게시글 생성, 수정, 발행, 삭제 이력 |

## Docker Compose

Docker 관련 파일은 `docker/` 아래에 둔다.

```sh
docker compose -f docker/docker-compose.yml up --build
```

구성 서비스:

| 서비스 | 역할 |
| --- | --- |
| `app` | Astro Node Server |
| `db` | PostgreSQL |
| `nginx` | 리버스 프록시 |
| `backup` | 운영 백업 작업 |

## 콘텐츠 작성

게시글은 운영 환경에서 `content/posts/YYYY/MM/*.md`에 저장한다.

게시글 Markdown은 API로 생성·수정되는 런타임 데이터이므로 Git 추적 대상에서 제외한다. 저장소에는 `content/posts/.gitkeep`만 남겨 기본 폴더 구조를 유지한다.

예시:

```txt
content/posts/2026/05/my-post.md
```

본문은 Markdown을 원본으로 유지하고, frontmatter와 DB 메타데이터를 동기화하는 방향으로 구현한다.

## 개발 순서

기획안 기준 개발 순서는 다음과 같다.

| 단계 | 내용 |
| --- | --- |
| 1 | Astro 프로젝트 초기화, TypeScript, Node adapter, Layout, global.css |
| 2 | PostgreSQL Docker, Drizzle ORM, schema, migration, db client |
| 3 | Markdown 디렉터리, frontmatter 파서, Markdown HTML 변환, 글 상세 페이지 |
| 4 | 홈, 게시글 상세, 태그, 시리즈, 404 페이지 |
| 5 | Auth Middleware, 게시글 생성/수정/발행/삭제 API |
| 6 | SeoHead, sitemap, RSS, robots.txt, JSON-LD, canonical |
| 7 | 태그 파싱, wikilink 파싱, post_links 저장, 백링크, 관련 글 |
| 8 | Dockerfile, docker-compose, nginx.conf, Cloudflare DNS, SSL/TLS Full(strict) |
