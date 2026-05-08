# 개인 Markdown 기반 SEO 블로그

개인 서버에 배포하기 위한 Markdown 기반 블로그 프로젝트입니다.

게시글 본문은 순수 Markdown 파일로 관리하고, 게시글 상태와 태그, 내부 링크, 검색 인덱싱에 필요한 메타데이터는 PostgreSQL에 저장합니다. Astro SSR 기반으로 시작하며, SEO 최적화와 Obsidian식 `[[wikilink]]` 기반 내부 링크 구조를 핵심 기능으로 둡니다.

## 핵심 방향

- 개인 서버 + Docker Compose 기반 배포
- Cloudflare 도메인, CDN, SSL 사용
- Astro + TypeScript + Node.js SSR
- PostgreSQL + Drizzle ORM
- pnpm 기반 패키지 관리
- Markdown 파일 기반 콘텐츠 작성
- 태그, 백링크, `[[wikilink]]` 지원
- 관리자 API 인증: Bearer Token, 필요 시 HMAC 추가
- Daisy UI 기반의 극도로 단순한 텍스트 중심 UI

## 문서

- [프로젝트 구성 문서](./docs/project-structure.md)
- [개발 문서](./docs/development.md)
- [관리자 API 문서](./docs/api.md)
- [MVP 및 개발 순서](./docs/mvp-roadmap.md)

## 빠른 시작

```sh
pnpm install
pnpm dev
```

## 상태

현재는 구현 전 초기 상태입니다. 문서, 폴더 구조, 라우트/모듈 skeleton, 샘플 Markdown만 둔 베이스입니다.
