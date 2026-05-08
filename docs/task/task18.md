---
status: todo
status_label: 할일
order: 18
title: "Task 18. 태그 추출과 태그 페이지"
---

# Task 18. 태그 추출과 태그 페이지

## 목표

frontmatter와 인라인 `#tag`에서 태그를 추출하고 검색 인덱스와 태그 페이지에 반영한다.

## 작업 내용

- frontmatter tags 파싱
- 인라인 `#tag` 파싱 여부 결정
- tags / post_tags 저장
- post_search_index의 tag_text 갱신
- `/tags/[tag]` 페이지 구현
- 태그별 문서 목록 표시
- 관련 태그와 RSS 링크는 MVP 범위에서 최소 처리 여부 결정

## 수정 예상 파일

- `src/lib/markdown.ts`
- `src/lib/post-store.ts`
- `src/pages/tags/[tag].astro`
- `src/components/TagList.astro`
- `drizzle/schema.ts`

## 하지 말 것

- 태그 추천 기능 만들지 않기
- 고급 태그 설명 관리 UI 만들지 않기

## 완료 기준

- 태그 페이지에서 해당 태그의 published 글 표시
- 게시글 상세에 태그 링크 표시
- 태그가 사이트 검색 결과에 반영
- draft/archived 글은 태그 페이지에서 제외
