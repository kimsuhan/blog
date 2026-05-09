# 프로젝트 구성 문서

## 1. 프로젝트 개요

### 프로젝트명

개인 Markdown 기반 지식 아카이브

### 목적

개인 서버에 배포 가능한 지식 아카이브 시스템을 구축한다.

순수 Markdown 기반으로 개발 도구, 패치노트, 기능 사용법, 기술 참고자료를 정리한다.

기존 블로그처럼 여러 글을 계속 둘러보게 하는 것이 아니라, 사용자가 검색 엔진이나 사이트 검색으로 원하는 문서에 도달해 필요한 내용을 확인하고 끝내는 구조를 목표로 한다.

SEO 최적화와 제목·본문·태그 통합 검색 인덱스를 활용해 필요한 문서로 바로 진입할 수 있게 한다. 인증된 API를 통해 게시글 작성, 수정, 발행 상태 관리가 가능하도록 한다.

## 2. 핵심 요구사항

| 구분 | 요구사항 |
| --- | --- |
| 배포 환경 | 개인 서버 |
| 도메인 | Cloudflare 도메인 사용 |
| 콘텐츠 작성 | 순수 Markdown |
| 인증 | 관리자 API Auth 필수 |
| SEO | 적극적인 SEO 최적화 |
| 디자인 | Library Archive 콘셉트의 검색 중심 텍스트 디자인 |
| 내부 구조 | 태그, 백링크, Obsidian식 `[[wikilink]]` 지원 |
| 검색 | 제목, 본문, 태그, 시리즈 통합 검색 |
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
| 스타일링 | Tailwind CSS v4 + Daisy UI v5 |
| 검색 | PostgreSQL 검색 인덱스 테이블, 이후 Pagefind 또는 Meilisearch 확장 |

## 4. 전체 아키텍처

```txt
사용자
  ↓
Cloudflare
  ↓
Nginx
  ↓
Astro Node Server
  ├─ 공개 아카이브 페이지
  ├─ 관리자 API
  ├─ Markdown Renderer
  ├─ SEO Generator
  ├─ Auth Middleware
  ├─ Search Indexer
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
| 검색 페이지 | SSR 또는 endpoint + PostgreSQL 검색 인덱스 |

### 선택 기준

게시글은 DB의 `posts.status`, 수정일, 태그, 내부 링크, 검색 인덱스 정보를 반영해야 하므로 SSR 기반으로 시작한다.

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
| PostgreSQL | wikilink 분석 결과, 백링크, 검색 인덱스 |
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
│  │              └─ publish.ts
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
│  │  └─ search-index.ts
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
| 공개 아카이브 페이지 | 검색 중심 홈, 게시글, 태그, 시리즈, 검색 페이지 제공 |
| 관리자 API | 게시글 생성, 수정, 발행, 삭제 |
| Markdown Renderer | Markdown을 HTML로 변환하고 wikilink를 내부 링크로 해석 |
| SEO Generator | title, description, canonical, Open Graph, RSS, sitemap 생성 |
| Auth Middleware | 관리자 API 요청 인증 |
| DB Client | PostgreSQL 연결 및 Drizzle ORM 쿼리 관리 |
| Search Indexer | 제목, 본문, 태그, 시리즈를 통합한 PostgreSQL 검색 인덱스 생성 |

## 8.1 스타일링 기준

Tailwind CSS v4와 Daisy UI v5는 `src/styles/global.css`에서 CSS-first 방식으로 연결한다.

Daisy UI는 theme 변수, form, button, 접근성 상태 같은 기본 UI 토대에 사용하고, 공개 화면의 시각 언어는 `docs/design/design-concept.md`의 Library Archive 기준을 따른다.

| 화면 영역 | 최대 폭 |
| --- | --- |
| 랜딩 / 목록 컨테이너 | 800px |
| 글 상세 본문 | 720px |

타이포그래피는 headline/body에 serif를 우선 적용하고, metadata/label에는 sans-serif uppercase를 사용한다. 색상은 white/black/grey 중심의 monochrome palette를 유지하며, 선은 얇고 여백은 넉넉하게 잡는다.

## 9. Markdown 작성 규칙

게시글은 frontmatter와 Markdown 본문으로 구성한다.

```md
---
title: "Astro로 개인 블로그 만들기"
slug: "astro-personal-blog"
description: "개인 서버에 Astro 기반 Markdown 블로그를 구축하는 방법"
date: "2026-05-07"
updated: "2026-05-07"
status: "draft"
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

### Markdown 읽기와 Frontmatter 처리

Markdown 파일은 `content/posts/YYYY/MM/*.md` 경로만 게시글 원문으로 읽는다.

Frontmatter 파싱은 `gray-matter`를 사용한다. 파싱 결과는 `src/lib/markdown.ts`의 `PostMetadata` 타입으로 정규화하며, `status`는 `draft`, `published`, `archived` 중 하나만 허용한다.

필수 frontmatter 필드가 없거나 타입이 맞지 않으면 `FrontmatterError`를 발생시킨다. 잘못된 frontmatter를 가진 파일은 게시글 목록이나 상세 조회에 정상 게시글로 포함하지 않고, 이후 관리자 API 또는 운영 로그에서 수정 대상으로 다룬다.

Markdown HTML 렌더링은 `marked`를 사용한다. 코드블록, 이미지, 기본 링크는 GitHub Flavored Markdown 기준으로 변환한다.

MVP의 Markdown 원문은 인증된 관리자 API나 운영자가 작성하는 신뢰 가능한 콘텐츠로 취급하므로 별도 HTML sanitizer는 우선 적용하지 않는다. 외부 사용자가 Markdown을 제출하는 기능이 추가되면 sanitize 라이브러리를 별도 task에서 도입한다.
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
| `post_search_index` | 게시글 제목, 본문, 태그, 시리즈 통합 검색 문서 |
| `api_keys` | 관리자 API 키 해시와 상태 |
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

`post_search_index` 주요 필드:

```txt
post_id
slug
title_text
body_text
tag_text
series_text
search_text
search_vector
indexed_at
```

`api_keys`는 초기 MVP 인증 구현은 `ADMIN_API_TOKEN` 기반으로 시작하되, 이후 DB 기반 키 관리를 위해 다음 필드를 가진다.

```txt
id
name
key_hash
status: active | revoked
hmac_required
last_used_at
created_at
revoked_at
```

`publish_logs`는 관리자 API의 생성, 수정, 발행, 보관, 삭제 이력을 저장한다.

```txt
id
post_id
post_slug
action: created | updated | published | archived | deleted
actor_key_id
metadata
created_at
```

검색 인덱스는 다음 데이터를 통합한다.

```txt
게시글 제목
게시글 description
Markdown 본문에서 추출한 plain text
frontmatter tags
인라인 #tag
series
slug
```

## 11. 관리자 API 방향

관리자 API는 외부에 노출될 수 있으므로 인증을 필수로 둔다.

기본 인증 방식은 `Authorization: Bearer <token>`이며, 외부 자동화 도구 연동 시 요청 변조 방지를 위해 선택적으로 HMAC 검증을 추가한다.

예상 API 범위:

| Endpoint | 설명 |
| --- | --- |
| `POST /api/admin/posts` | Markdown 게시글 생성 |
| `PATCH /api/admin/posts/:slug` | 게시글 메타데이터 또는 본문 수정 |
| `POST /api/admin/posts/:slug/publish` | 게시글 발행 |
| `DELETE /api/admin/posts/:slug` | 게시글 삭제, 기본은 archived 처리 |

## 12. SEO 전략

- 게시글별 고유 slug와 canonical URL 유지
- 제목, 설명, Open Graph, Twitter Card 메타데이터 생성
- RSS와 sitemap 동적 생성
- `robots.txt` 제공
- Article, BreadcrumbList, Person, WebSite JSON-LD 제공
- 검색 엔진에서 게시글 상세 페이지로 직접 진입하는 흐름 우선
- 태그 페이지와 시리즈 페이지는 보조 진입점으로 유지
- `[[wikilink]]`와 백링크를 통해 내부 링크 밀도 강화
- 검색 엔진이 읽기 쉬운 단순 HTML 구조 유지

SEO 유입 예시:

```txt
Google 검색: "VS Code 2026년 5월 9일 패치노트"
  ↓
/posts/vscode-2026-05-09-release-note
  ↓
사용자는 해당 글 내용만 확인하고 종료
```

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

게시글 상세 페이지는 검색한 주제에 집중해야 한다. 관련 글, 같은 태그의 글, 같은 시리즈의 글, 이 글이 링크한 글, 이 글을 링크한 글은 보조 정보로만 작게 표시하고, 다른 글 탐색을 강하게 유도하지 않는다.

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

디자인은 `docs/design/design-concept.md`의 Library Archive 콘셉트를 기준으로 구현한다.

이 프로젝트에서 Library Archive는 “여러 글을 둘러보는 블로그”가 아니라 “필요한 자료를 검색해 꺼내 보는 도서관형 개인 자료실”을 의미한다.

Daisy UI를 사용할 수 있지만, Daisy UI의 기본 장식이 시각 방향을 결정하면 안 된다. Daisy UI는 버튼, 입력, 접근성 상태, 다크모드 같은 UI 토대에 활용하고, 최종 화면의 분위기는 흰색/검정/회색 중심의 archival interface를 따른다.

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
글 상세 본문 최대 폭: 720px
랜딩 목록 컨테이너 최대 폭: 800px
폰트: headline/body는 serif, metadata/label은 sans-serif
배경: 흰색 또는 다크모드
상단 메뉴: 최소 구성
본문: 가독성 중심
하단: 태그, 백링크, RSS
```

디자인 시안:

| 파일 | 역할 |
| --- | --- |
| `docs/design/randing-phase1.html` | 랜딩 첫 화면, 검색 아이콘 중심 |
| `docs/design/randing-phase1-search-active.html` | 검색 활성 상태 |
| `docs/design/randing-phase2-latest.html` | 스크롤 후 보조 아카이브 색인 |
| `docs/design/post-detail.html` | 글 상세 화면 시안, 실제 내용 확인 필요 |

홈 화면 구조:

```txt
Phase 1: 검색 중심 첫 화면
  ↓ scroll
Phase 2: Recent Accessions 보조 아카이브 인덱스
```

Phase 2의 Recent Accessions는 사용자의 주 탐색 방식이 아니다. 홈에 들어온 사용자가 검색하지 않았을 때 참고할 수 있는 보조 archive shelf로만 사용한다.

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
게시글은 기본적으로 `posts.status = draft` 상태로 생성
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
2. `posts.status = draft` 상태로 저장
3. 미리보기 확인
4. SEO 메타데이터 확인
5. publish API 호출
6. 공개 페이지 반영
```

## 18. 확장 방향

- 게시글 HTML 캐시 도입
- Pagefind 또는 Meilisearch 기반 검색 고도화
- 태그 추천, 내부 링크 추천, SEO 점수 계산
- 관리자 UI 추가
- 백업 및 복구 자동화
