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
| `SITE_URL` | canonical, sitemap, RSS, robots.txt에 사용할 공개 사이트 기본 URL |

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
| `post_search_index` | 제목, 본문, 태그, 시리즈 통합 검색 인덱스 |
| `api_keys` | 관리자 API 키 해시와 상태 |
| `publish_logs` | 게시글 생성, 수정, 발행, 삭제 이력 |

초기 Drizzle schema는 `api_keys`, `publish_logs`를 포함한다. MVP의 첫 인증 구현은 `.env`의 `ADMIN_API_TOKEN`을 사용하지만, DB schema는 이후 API key 회전과 HMAC 필수 여부를 저장할 수 있게 둔다.

검색은 `post_search_index.search_vector`에 PostgreSQL `tsvector`를 저장하고 GIN index를 둔다. `title_text`, `body_text`, `tag_text`, `series_text`, `search_text`는 검색 문서 재생성과 디버깅을 위해 원문 텍스트로 함께 유지한다.

## Docker Compose

Docker 관련 파일은 `docker/` 아래에 둔다.

```sh
docker compose -f docker/docker-compose.yml up --build
```

개발 중 DB만 실행할 때는 다음 명령을 사용한다.

```sh
docker compose -f docker/docker-compose.yml up -d db
```

`db` 서비스는 PostgreSQL 17 Alpine 이미지를 사용하며 로컬 호스트의 `5433` 포트로 노출한다. 컨테이너 내부 PostgreSQL 포트는 `5432`를 유지하고, 호스트 포트만 `5433`을 사용해 로컬에 이미 설치된 PostgreSQL과 충돌하지 않게 한다. 개발용 접속 정보는 `.env.example`과 동일하게 맞춘다.

```txt
DATABASE_URL=postgres://blog:blog@localhost:5433/blog
```

컨테이너 내부에서 `app` 서비스가 DB에 접속할 때는 Compose 서비스명을 사용한다.

```txt
postgres://blog:blog@db:5432/blog
```

구성 서비스:

| 서비스 | 역할 |
| --- | --- |
| `app` | Astro Node Server |
| `db` | PostgreSQL |
| `nginx` | 리버스 프록시 |

PostgreSQL 데이터는 Docker named volume인 `postgres-data`에 저장한다. 개발 DB를 초기화해야 할 때만 아래처럼 volume까지 삭제한다.

```sh
docker compose -f docker/docker-compose.yml down -v
```

Drizzle migration 적용 흐름:

```sh
cp .env.example .env
docker compose -f docker/docker-compose.yml up -d db
pnpm db:generate
pnpm db:migrate
```

DB 연결에 실패하면 다음 항목을 먼저 확인한다.

| 증상 | 확인할 항목 |
| --- | --- |
| `ECONNREFUSED 127.0.0.1:5433` | `db` 컨테이너가 실행 중인지, `docker/docker-compose.yml`의 `5433:5432` 포트가 열려 있는지 확인 |
| `Bind for 0.0.0.0:5433 failed` | 호스트의 `5433` 포트가 이미 사용 중인지 확인하고, 필요하면 Compose 포트와 `.env`의 `DATABASE_URL`을 같은 값으로 변경 |
| `password authentication failed` | `.env`의 `DATABASE_URL`이 `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`와 일치하는지 확인 |
| `database "blog" does not exist` | 기존 `postgres-data` volume이 다른 초기값으로 만들어졌는지 확인하고, 개발 데이터 삭제가 가능하면 `down -v` 후 재시작 |
| `type "tsvector" does not exist` | PostgreSQL이 아닌 다른 DB에 연결한 것이 아닌지 `DATABASE_URL` 확인 |

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
| 7 | 검색 인덱스 생성, 태그 파싱, wikilink 파싱, post_links 저장, 백링크 |
| 8 | Dockerfile, docker-compose, nginx.conf, Cloudflare DNS, SSL/TLS Full(strict) |
