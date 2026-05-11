---
status: done
status_label: 완료
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

## 구현 메모

- WebSite JSON-LD는 공통 `Layout`에서 모든 페이지에 출력한다.
- SearchAction은 `/search?q={search_term_string}` 기준으로 포함한다.
- BreadcrumbList는 실제 존재하는 URL만 사용한다.
- 홈은 `Home`, 검색은 `Home > Search`, 태그는 `Home > Tag: {tag}`, 시리즈는 `Home > Series: {series}`, 게시글은 `Home > {title}` 구조를 사용한다.
- 복잡한 breadcrumb UI는 추가하지 않고 구조화 데이터만 출력한다.
