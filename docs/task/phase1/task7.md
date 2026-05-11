---
status: done
status_label: 완료
order: 7
title: "Task 7. Post Store 1차 구현"
---

# Task 7. Post Store 1차 구현

## 목표

아카이브 페이지와 게시글 상세가 사용할 게시글 조회 API를 `src/lib/post-store.ts`에 만든다.

## 작업 내용

- 보조 archive index용 published 게시글 목록 조회
- slug로 게시글 상세 조회
- published 글만 필터링
- tag 기준 필터링
- series 기준 필터링
- 게시글 정렬 기준 결정

## 수정 예상 파일

- `src/lib/post-store.ts`
- `src/pages/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/tags/[tag].astro`
- `src/pages/series/[series].astro`

## 하지 말 것

- DB metadata와 완전히 동기화하려 하지 않기
- 관리자 API 구현하지 않기
- 스마트 검색 구현은 `task20.md`에서 진행

## 완료 기준

- 홈 phase2 보조 archive index에서 published 게시글 목록 표시
- `/posts/[slug]`에서 게시글 상세 표시
- `/tags/[tag]`, `/series/[series]`에서 필터링된 글 목록 표시
