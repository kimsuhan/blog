---
status: todo
status_label: 할일
order: 23
title: "Task 23. BreadcrumbList / WebSite 구조화 데이터"
---

# Task 23. BreadcrumbList / WebSite 구조화 데이터

## 목표

사이트 공통 구조화 데이터와 게시글 breadcrumb를 추가한다.

## 작업 내용

- WebSite JSON-LD 생성
- BreadcrumbList JSON-LD 생성
- 홈, 태그, 시리즈, 게시글 경로 기준 정리
- 검색 페이지 SearchAction 적용 여부 결정

## 수정 예상 파일

- `src/lib/seo.ts`
- `src/components/SeoHead.astro`
- `src/components/Layout.astro`
- `src/pages/posts/[slug].astro`

## 하지 말 것

- 복잡한 breadcrumb UI 만들지 않기
- 다국어 URL 정책 만들지 않기

## 완료 기준

- 주요 페이지에 구조화 데이터 출력
- JSON-LD가 깨진 JSON을 만들지 않음
