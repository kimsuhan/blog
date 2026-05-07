---
status: todo
status_label: 할일
order: 20
title: "Task 20. JSON 검색 인덱스 1차 생성"
---

# Task 20. JSON 검색 인덱스 1차 생성

## 목표

MVP 이후 고급 검색으로 확장하기 전, 기본 JSON 검색 인덱스 생성 흐름을 만든다.

## 작업 내용

- published 게시글 목록을 JSON으로 변환
- title, description, slug, tags, series 포함
- 게시글 생성/수정/발행/삭제 후 갱신 흐름 결정
- `data/search-index.json` 런타임 생성 정책 확인
- 검색 페이지에서 JSON 인덱스 사용 여부 결정

## 수정 예상 파일

- `src/lib/search-index.ts`
- `src/pages/search.astro`
- `src/pages/api/admin/posts.ts`
- `src/pages/api/admin/posts/[slug].ts`
- `.gitignore`

## 하지 말 것

- Pagefind 또는 Meilisearch 연동하지 않기
- 고급 검색 UI 만들지 않기

## 완료 기준

- `data/search-index.json` 생성 가능
- draft/archived 글 제외
- Git에는 생성된 인덱스를 올리지 않음
