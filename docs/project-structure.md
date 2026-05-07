# 프로젝트 구성 문서

## 1. 프로젝트 개요

### 프로젝트명

개인 Markdown 기반 SEO 블로그

### 목적

개인 서버에 배포 가능한 블로그 시스템을 구축한다.

순수 Markdown 기반으로 게시글을 작성하고, SEO 최적화와 내부 링크 구조를 활용해 검색 유입을 극대화한다. 인증된 API를 통해 게시글 작성, 수정, AI 초안 생성이 가능하도록 한다.

## 2. 핵심 요구사항

| 구분 | 요구사항 |
| --- | --- |
| 배포 환경 | 개인 서버 |
| 도메인 | Cloudflare 도메인 사용 |
| 콘텐츠 작성 | 순수 Markdown |
| 인증 | 관리자 API Auth 필수 |
| AI 활용 | MVP 이후 AI 초안 생성 API 확장 |
| SEO | 적극적인 SEO 최적화 |
| 디자인 | 극도로 단순한 텍스트 중심 디자인 |
| 내부 구조 | 태그, 백링크, Obsidian식 `[[wikilink]]` 지원 |
| DB | PostgreSQL 사용 |
| 운영 방식 | Docker Compose 기반 배포 |
| 패키지 관리 | pnpm |

## 3. 기술 스택

| 영역 | 선택 기술 |
| --- | --- |
| 언어 | TypeScript |
| 프레임워크 | Astro |
| 렌더링 방식 | SSR / Hybrid |
| 서버 런타임 | Node.js |
| DB | PostgreSQL |
| ORM | Drizzle ORM |
| 콘텐츠 본문 저장 | Markdown 파일 |
| 메타데이터 저장 | PostgreSQL |
| 인증 | Bearer Token + 선택적 HMAC |
| 배포 | Docker Compose |
| 패키지 관리 | pnpm |
| 리버스 프록시 | Nginx |
| DNS / CDN / SSL | Cloudflare |
| 스타일링 | Daisy UI |
| 검색 | 초기 JSON 인덱스, 이후 Pagefind 또는 Meilisearch 확장 |
| AI 연동 | OpenAI API 또는 외부 AI Skill API 호출 |

## 4. 전체 아키텍처

```txt
사용자
  ↓
Cloudflare
  ↓
Nginx
  ↓
Astro Node Server
  ├─ 공개 블로그 페이지
  ├─ 관리자 API
  ├─ Markdown Renderer
  ├─ SEO Generator
  ├─ Auth Middleware
  └─ DB Client
       ↓
    PostgreSQL

Filesystem
  └─ content/posts/*.md
```

## 5. 렌더링 전략

### 기본 전략

Astro를 `output: "server"` 모드로 운영한다.

| 대상 | 렌더링 방식 |
| --- | --- |
| 게시글 상세 페이지 | SSR + 캐시 |
| 홈 | SSR 또는 prerender |
| 태그 페이지 | SSR 또는 prerender |
| 시리즈 페이지 | SSR 또는 prerender |
| RSS | 동적 생성 |
| Sitemap | 동적 생성 |
| 관리자 API | SSR endpoint |
| Draft Preview | SSR |
| 검색 페이지 | 정적 UI + JSON 인덱스 |

### 선택 기준

게시글은 DB의 발행 상태, draft 여부, 수정일, 태그, 내부 링크 정보를 반영해야 하므로 SSR 기반으로 시작한다.

성능 최적화가 필요해지면 게시글 HTML 캐시를 도입한다.

## 6. 데이터 저장 전략

### 원칙

게시글 본문은 운영 서버의 Markdown 파일로 저장한다. DB는 메타데이터, 상태, 태그, 링크, 검색 인덱싱 정보를 관리한다.

운영 중 관리자 API로 생성·수정되는 게시글 Markdown은 Git에 커밋하지 않는다. Git은 애플리케이션 코드와 디렉터리 구조를 관리하고, 게시글 원본은 서버 파일시스템과 백업 정책으로 보호한다.

```txt
Markdown 파일 = 글 본문 원본
PostgreSQL = 글 상태와 구조화 데이터
```

### 저장 책임 분리

| 저장 위치 | 책임 |
| --- | --- |
| `content/posts/*.md` | 운영 서버의 게시글 원문, 본문, frontmatter |
| PostgreSQL | slug, 제목, 발행 상태, 태그, 시리즈, 작성일, 수정일, SEO 메타데이터 |
| PostgreSQL | wikilink 분석 결과, 백링크, 검색 인덱싱 상태 |
| Filesystem cache | 필요 시 렌더링된 HTML 캐시 |

## 7. 예상 디렉터리 구조

```txt
.
├─ README.md
├─ docs/
│  ├─ project-structure.md
│  ├─ development.md
│  ├─ api.md
│  └─ mvp-roadmap.md
├─ content/
│  └─ posts/
│     ├─ .gitkeep
│     └─ 2026/
│        └─ 05/
│           └─ sample-post.md
├─ data/
│  ├─ .gitkeep
│  ├─ search-index.json
│  └─ graph-index.json
├─ src/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ posts/
│  │  │  └─ [slug].astro
│  │  ├─ tags/
│  │  │  └─ [tag].astro
│  │  ├─ series/
│  │  │  └─ [series].astro
│  │  ├─ search.astro
│  │  ├─ 404.astro
│  │  ├─ rss.xml.ts
│  │  ├─ sitemap.xml.ts
│  │  ├─ robots.txt.ts
│  │  └─ api/
│  │     └─ admin/
│  │        ├─ posts.ts
│  │        └─ posts/
│  │           ├─ [slug].ts
│  │           └─ [slug]/
│  │              ├─ publish.ts
│  │              └─ ai-draft.ts
│  ├─ components/
│  │  ├─ SeoHead.astro
│  │  ├─ Layout.astro
│  │  ├─ Header.astro
│  │  ├─ Footer.astro
│  │  ├─ PostCard.astro
│  │  ├─ TagList.astro
│  │  ├─ BacklinkList.astro
│  │  └─ RelatedPosts.astro
│  ├─ lib/
│  │  ├─ auth.ts
│  │  ├─ db.ts
│  │  ├─ markdown.ts
│  │  ├─ post-store.ts
│  │  ├─ seo.ts
│  │  ├─ graph.ts
│  │  ├─ search-index.ts
│  │  └─ ai.ts
│  ├─ styles/
│  │  └─ global.css
│  └─ middleware.ts
├─ drizzle/
│  ├─ schema.ts
│  └─ migrations/
├─ docker/
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  └─ nginx.conf
├─ package.json
├─ astro.config.mjs
├─ drizzle.config.ts
└─ tsconfig.json
```

## 8. 주요 모듈 책임

| 모듈 | 책임 |
| --- | --- |
| 공개 블로그 페이지 | 홈, 게시글, 태그, 시리즈, 검색 페이지 제공 |
| 관리자 API | 게시글 생성, 수정, 발행, 삭제 |
| Markdown Renderer | Markdown을 HTML로 변환하고 wikilink를 내부 링크로 해석 |
| SEO Generator | title, description, canonical, Open Graph, RSS, sitemap 생성 |
| Auth Middleware | 관리자 API 요청 인증 |
| DB Client | PostgreSQL 연결 및 Drizzle ORM 쿼리 관리 |
| Search Indexer | JSON 검색 인덱스 생성, 추후 Pagefind 또는 Meilisearch 확장 |

## 9. Markdown 작성 규칙

게시글은 frontmatter와 Markdown 본문으로 구성한다.

```md
---
title: "Astro로 개인 블로그 만들기"
slug: "astro-personal-blog"
description: "개인 서버에 Astro 기반 Markdown 블로그를 구축하는 방법"
date: "2026-05-07"
updated: "2026-05-07"
draft: true
tags:
  - astro
  - blog
  - seo
series: "블로그 만들기"
canonical: null
ogImage: "/og/astro-personal-blog.png"
---

# Astro로 개인 블로그 만들기

이 글은 [[cloudflare-domain-setting|Cloudflare 도메인 설정]]과 연결된다.

#astro #seo #self-hosting
```

지원 문법:

| 문법 | 용도 |
| --- | --- |
| Frontmatter | 제목, 설명, 날짜, 태그, 발행 상태 관리 |
| Markdown | 본문 작성 |
| `[[slug]]` | 내부 글 링크 |
| `[[slug\|표시명]]` | 표시명이 있는 내부 링크 |
| `#tag` | 인라인 태그 |
| 코드블록 | 기술 글 작성 |
| 이미지 Markdown | 본문 이미지 삽입 |

## 10. DB 설계

초기 DB는 Drizzle ORM으로 관리하며, 다음 테이블을 기준으로 구현한다.

| 테이블 | 역할 |
| --- | --- |
| `posts` | 게시글 메타데이터, 상태, SEO 필드 |
| `tags` | 태그 이름과 slug |
| `post_tags` | 게시글과 태그의 N:M 관계 |
| `post_links` | wikilink, markdown link, tag link 관계 |
| `api_keys` | 관리자 API 키 해시와 상태 |
| `ai_drafts` | MVP 이후 AI 초안 요청과 결과 상태 |
| `publish_logs` | 생성, 수정, 발행, 삭제 이력 |

`posts` 주요 필드:

```txt
id
slug
title
description
markdown_path
status: draft | published | archived
series
canonical_url
og_image
reading_time
published_at
created_at
updated_at
```

`post_links`는 다음 링크 유형을 저장한다.

```txt
wikilink
markdown
tag
```

## 11. 관리자 API 방향

관리자 API는 외부에 노출될 수 있으므로 인증을 필수로 둔다.

기본 인증 방식은 `Authorization: Bearer <token>`이며, 자동화 도구나 외부 AI Skill API 연동 시 요청 변조 방지를 위해 선택적으로 HMAC 검증을 추가한다.

예상 API 범위:

| Endpoint | 설명 |
| --- | --- |
| `POST /api/admin/posts` | Markdown 게시글 생성 |
| `PATCH /api/admin/posts/:slug` | 게시글 메타데이터 또는 본문 수정 |
| `POST /api/admin/posts/:slug/publish` | 게시글 발행 |
| `DELETE /api/admin/posts/:slug` | 게시글 삭제, 기본은 archived 처리 |
| `POST /api/admin/posts/:slug/ai-draft` | MVP 이후 AI 글 초안 생성 |

## 12. SEO 전략

- 게시글별 고유 slug와 canonical URL 유지
- 제목, 설명, Open Graph, Twitter Card 메타데이터 생성
- RSS와 sitemap 동적 생성
- `robots.txt` 제공
- Article, BreadcrumbList, Person, WebSite JSON-LD 제공
- 태그 페이지와 시리즈 페이지를 검색 유입 진입점으로 활용
- `[[wikilink]]`와 백링크를 통해 내부 링크 밀도 강화
- 검색 엔진이 읽기 쉬운 단순 HTML 구조 유지

필수 공개 페이지:

```txt
/
/posts/[slug]
/tags/[tag]
/series/[series]
/search
/rss.xml
/sitemap.xml
/robots.txt
```

게시글 하단에는 관련 글, 같은 태그의 글, 같은 시리즈의 글, 이 글이 링크한 글, 이 글을 링크한 글을 텍스트 기반으로 표시한다.

## 13. Obsidian식 링크 구조

내부 링크 문법:

```md
[[target-slug]]
[[target-slug|표시할 텍스트]]
```

렌더링 결과:

```html
<a href="/posts/target-slug">표시할 텍스트</a>
```

MVP에서는 시각적 그래프 UI를 만들지 않고, 연결된 글, 백링크, 관련 태그, 같은 시리즈를 텍스트로 표시한다. 그래프 UI는 MVP 이후 확장한다.

## 14. 디자인 시스템

디자인은 Daisy UI를 사용해 구현한다. 단, 컴포넌트 스타일은 과하게 꾸미지 않고 텍스트 중심 블로그에 맞게 최소한으로 사용한다.

원칙:

```txt
단순함
빠른 로딩
읽기 편한 본문
불필요한 애니메이션 제거
다크모드 선택 지원
텍스트 중심 UI
```

레이아웃 기준:

```txt
최대 본문 폭: 720px
폰트: system-ui
배경: 흰색 또는 다크모드
상단 메뉴: 최소 구성
본문: 가독성 중심
하단: 태그, 백링크, RSS
```

Daisy UI 사용 기준:

```txt
본문 가독성을 해치지 않는 범위에서만 컴포넌트 사용
버튼, 입력, 태그, 카드 등 반복 UI에 우선 적용
색상과 장식은 최소화
다크모드 선택 지원에 활용
```

## 15. 보안 정책

관리자 API 보호:

```txt
Bearer Token 필수
관리자 API rate limit
Cloudflare WAF rule 적용
HMAC signature 선택 적용
토큰 해시 저장
API 요청 로그 저장
```

게시글 발행 보호:

```txt
AI 작성 글은 draft만 가능
publish API는 별도 호출 필요
delete는 soft delete 또는 archived 처리 기본값
관리자 API는 HTTPS에서만 사용
```

Cloudflare 설정:

```txt
SSL/TLS: Full(strict)
관리자 API rate limit
Bot fight mode 선택 적용
캐시 규칙 설정
보안 헤더 추가
```

## 16. 배포 전략

운영 환경은 Docker Compose를 기준으로 한다.

구성 요소:

| 서비스 | 역할 |
| --- | --- |
| `app` | Astro Node Server |
| `db` | PostgreSQL |
| `nginx` | 리버스 프록시 |
| `backup` | DB와 Markdown 백업 작업 |

외부 트래픽은 Cloudflare를 거쳐 Nginx로 들어오며, Nginx가 Astro Node Server로 요청을 전달한다.

운영 서버 디렉터리 기준:

```txt
/server/blog/
  app/
  content/
  postgres/
  backups/
  nginx/
```

백업 대상:

```txt
PostgreSQL dump
content/posts/*.md
public/images
.env
nginx.conf
docker-compose.yml
```

## 17. 운영 정책

게시글 상태:

```txt
draft
published
archived
```

작성 플로우:

```txt
1. Markdown 직접 작성 또는 API 작성
2. draft 상태 저장
3. 미리보기 확인
4. SEO 메타데이터 확인
5. publish API 호출
6. 공개 페이지 반영
```

AI 작성 플로우는 MVP 이후 범위다.

```txt
1. 주제 입력
2. AI 초안 생성
3. draft 저장
4. 사람이 검토
5. 수정
6. publish
```

## 18. 확장 방향

- 게시글 HTML 캐시 도입
- Pagefind 또는 Meilisearch 기반 검색 고도화
- AI 초안 생성 프롬프트 템플릿 관리
- 태그 추천, 내부 링크 추천, SEO 점수 계산
- 관리자 UI 추가
- 백업 및 복구 자동화
