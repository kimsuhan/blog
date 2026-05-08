---
status: todo
status_label: 할일
order: 20
title: "Task 20. 스마트 검색 인덱스 1차 생성"
---

# Task 20. 스마트 검색 인덱스 1차 생성

## 목표

MVP 핵심 기능인 제목, 본문, 태그, 시리즈 통합 검색 인덱스를 만든다.

## 작업 내용

- published 게시글의 검색 문서를 생성
- title, description, body text, slug, tags, series 포함
- `post_search_index` 테이블에 검색 문서 저장
- PostgreSQL full-text search 또는 유사한 검색 방식을 사용할지 결정
- 게시글 생성/수정/발행/삭제 후 갱신 흐름 결정
- `data/search-index.json`은 필요 시 클라이언트 캐시로만 사용할지 결정
- `randing-phase1-search-active.html`의 검색 활성 UI와 DB 검색 endpoint 연결 여부 결정

## 수정 예상 파일

- `src/lib/search-index.ts`
- `src/pages/search.astro`
- `drizzle/schema.ts`
- `src/pages/api/admin/posts.ts`
- `src/pages/api/admin/posts/[slug].ts`
- `.gitignore`

## 하지 말 것

- Pagefind 또는 Meilisearch 연동하지 않기
- 고급 필터 UI 만들지 않기
- 검색 랭킹 고도화까지 확장하지 않기
- 시안의 카테고리 태그를 실제 검색 필터로 확정하지 않기

## 완료 기준

- `post_search_index` 생성/갱신 가능
- 제목, 본문, 태그가 하나의 검색 결과에 반영
- draft/archived 글 제외
- 파일 기반 캐시를 만들 경우 Git에는 생성된 인덱스를 올리지 않음
