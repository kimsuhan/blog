---
status: todo
status_label: 할일
order: 19
title: "Task 19. 관련 글 표시"
---

# Task 19. 관련 글 표시

## 목표

게시글 하단에 내부 링크와 백링크를 텍스트 기반 보조 정보로 표시한다.

## 작업 내용

- 이 글이 링크한 글 조회
- 이 글을 링크한 글 조회
- `RelatedPosts.astro` 구현

## 수정 예상 파일

- `src/lib/graph.ts`
- `src/lib/post-store.ts`
- `src/components/RelatedPosts.astro`
- `src/pages/posts/[slug].astro`

## 하지 말 것

- 추천 점수 알고리즘 만들지 않기
- 조회수 기반 인기 글 만들지 않기
- 다른 글 탐색을 강하게 유도하는 UI 만들지 않기

## 완료 기준

- 게시글 하단에 내부 링크/백링크 보조 섹션 표시
- 현재 글 자기 자신은 제외
- 보조 섹션이 본문 집중도를 해치지 않음
