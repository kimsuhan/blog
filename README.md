# 개인 Markdown 기반 지식 아카이브

개인 서버에 배포하기 위한 Markdown 기반 지식 아카이브 프로젝트입니다.

일상형 블로그처럼 여러 글을 둘러보게 만드는 사이트가 아니라, VS Code 패치노트, Codex 기능 정리, 개발 도구 사용법처럼 나중에 다시 찾아볼 내용을 도서관 자료처럼 정리하는 개인 아카이브입니다.

게시글 본문은 순수 Markdown 파일로 관리하고, 게시글 상태와 태그, 내부 링크, 검색 인덱싱에 필요한 메타데이터는 PostgreSQL에 저장합니다. Astro SSR 기반으로 시작하며, SEO 직접 유입과 검색 중심 조회 경험을 핵심 기능으로 둡니다.

## 핵심 방향

- 개인 서버 + Docker Compose 기반 배포
- Cloudflare 도메인, CDN, SSL 사용
- Astro + TypeScript + Node.js SSR
- PostgreSQL + Drizzle ORM
- pnpm 기반 패키지 관리
- Markdown 파일 기반 콘텐츠 작성
- 제목, 본문, 태그를 통합한 스마트 검색
- 태그, 백링크, `[[wikilink]]` 지원
- 관리자 API 인증: Bearer Token, 필요 시 HMAC 추가
- Daisy UI 기반, Library Archive 콘셉트의 검색 중심 텍스트 UI

## 문서

- [프로젝트 구성 문서](./docs/project-structure.md)
- [개발 문서](./docs/development.md)
- [관리자 API 문서](./docs/api.md)
- [MVP 및 개발 순서](./docs/mvp-roadmap.md)
- [디자인 콘셉트](./docs/design/design-concept.md)

## 빠른 시작

```sh
pnpm install
pnpm dev
pnpm build
```

## DB migration

Drizzle schema는 `drizzle/schema.ts`에서 관리하고, migration 파일은 `drizzle/migrations/` 아래에 생성합니다.

```sh
# schema 변경 후 migration 파일 생성
pnpm db:generate

# DATABASE_URL이 가리키는 PostgreSQL DB에 migration 적용
pnpm db:migrate
```

DB는 compose 밖에서 별도로 준비하고, `DATABASE_URL`이 해당 DB를 가리키는 상태에서 migration을 적용합니다.

`pnpm db:generate`는 SQL migration 파일만 만들고 DB에는 적용하지 않습니다. 실제 DB 반영은 `pnpm db:migrate`가 수행하므로, 운영 DB에 적용하기 전에는 `DATABASE_URL`이 올바른 대상인지 확인해야 합니다.

## 상태

현재는 문서, 폴더 구조, 라우트/모듈 skeleton, Drizzle DB schema와 초기 migration을 둔 베이스입니다. 홈, 검색, 404, 게시글/태그/시리즈 skeleton 라우트가 있으며 실제 게시글 저장과 관리자 API 동작은 아직 구현하지 않았습니다.
