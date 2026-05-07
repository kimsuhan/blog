---
status: todo
status_label: 할일
order: 9
title: "Task 9. SEO Head 1차 구현"
---

# Task 9. SEO Head 1차 구현

## 목표

게시글과 주요 페이지에 기본 SEO 메타태그를 출력한다.

## 작업 내용

- `SeoHead.astro` props 정리
- title 출력
- description 출력
- canonical URL 출력
- Open Graph 출력
- Twitter Card 출력
- 게시글별 published/updated metadata 반영

## 수정 예상 파일

- `src/components/SeoHead.astro`
- `src/components/Layout.astro`
- `src/pages/posts/[slug].astro`
- `src/lib/seo.ts`

## 하지 말 것

- 자동 OG 이미지 생성하지 않기
- JSON-LD 전체를 한 번에 완성하려 하지 않기

## 완료 기준

- 각 페이지에 적절한 title과 description 출력
- 게시글 상세에 canonical과 OG 메타태그 출력
- `pnpm build` 성공
