---
status: done
status_label: 완료
order: 22
title: "Task 22. Article JSON-LD 구현"
---

# Task 22. Article JSON-LD 구현

## 목표

게시글 상세 페이지에 Article 구조화 데이터를 출력한다.

## 작업 내용

- Article JSON-LD 생성 함수 작성
- 게시글 title, description, published_at, updated_at, tags, ogImage 반영
- author 또는 Person 정보 처리 방식 결정
- JSON-LD script를 `SeoHead` 또는 게시글 상세에 출력

## 수정 예상 파일

- `src/lib/seo.ts`
- `src/components/SeoHead.astro`
- `src/pages/posts/[slug].astro`
- `.env.example`

## 하지 말 것

- 자동 OG 이미지 생성하지 않기
- BreadcrumbList까지 한 번에 무리해서 완성하지 않기

## 완료 기준

- 게시글 상세 HTML에 유효한 Article JSON-LD 출력
- 필수 값 누락 시 fallback 기준 명확

## 구현 메모

- Article JSON-LD는 `src/lib/seo.ts`의 `articleJsonLd`에서 생성한다.
- 게시글 상세 페이지는 `Layout` -> `SeoHead` 경로로 `application/ld+json` script를 출력한다.
- `description`이 비어 있으면 사이트 기본 설명을 사용한다.
- `datePublished`는 `publishedAt`, 없으면 `updatedAt`, 둘 다 없으면 현재 시각을 사용한다.
- `dateModified`는 `updatedAt`, 없으면 `datePublished`를 사용한다.
- author는 `SITE_AUTHOR_NAME`을 우선하고, 없으면 `Library Archive`를 사용한다.
- 자동 OG 이미지 생성은 하지 않고, 게시글 `ogImage`가 있을 때만 `image`를 출력한다.
