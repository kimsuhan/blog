---
status: todo
status_label: 할일
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
