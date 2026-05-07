---
status: todo
status_label: 할일
order: 8
title: "Task 8. 기본 블로그 페이지 구현"
---

# Task 8. 기본 블로그 페이지 구현

## 목표

MVP의 공개 페이지를 skeleton에서 실제 읽기 가능한 블로그 화면으로 만든다.

## 작업 내용

- 홈 페이지: 최신 글, 주요 태그, 소개
- 글 상세 페이지: 제목, 날짜, 태그, 본문
- 태그 페이지: 태그명, 글 목록
- 시리즈 페이지: 시리즈명, 글 목록
- 검색 페이지: MVP에서는 정적 UI 또는 준비 상태 표시
- 404 페이지: 단순 오류 페이지

## 수정 예상 파일

- `src/pages/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/tags/[tag].astro`
- `src/pages/series/[series].astro`
- `src/pages/search.astro`
- `src/pages/404.astro`
- `src/components/*.astro`

## 하지 말 것

- 고급 검색 구현하지 않기
- 관리자 UI 만들지 않기
- 시각적 그래프 만들지 않기

## 완료 기준

- MVP 공개 페이지가 모두 접근 가능
- 모바일 기본 레이아웃이 깨지지 않음
- 게시글 상세에서 본문을 읽을 수 있음
