---
status: todo
status_label: 할일
order: 19
title: "Task 19. 관련 글 표시"
---

# Task 19. 관련 글 표시

## 목표

게시글 하단에 관련 글을 텍스트 기반으로 표시한다.

## 작업 내용

- 같은 태그의 글 조회
- 같은 시리즈의 글 조회
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

## 완료 기준

- 게시글 하단에 관련 글 섹션 표시
- 현재 글 자기 자신은 제외
- 관련 글이 없으면 섹션을 과하게 노출하지 않음
