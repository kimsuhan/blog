---
status: done
status_label: 완료
order: 17
title: "Task 17. Post Links 저장과 백링크"
---

# Task 17. Post Links 저장과 백링크

## 목표

게시글 간 내부 링크 관계를 `post_links`에 저장하고 백링크를 표시한다.

## 작업 내용

- 게시글 생성/수정 시 링크 재계산
- `post_links` 저장
- 현재 글을 링크한 글 조회
- `BacklinkList.astro` 구현
- 게시글 하단에 백링크 표시

## 수정 예상 파일

- `src/lib/graph.ts`
- `src/lib/post-store.ts`
- `src/components/BacklinkList.astro`
- `src/pages/posts/[slug].astro`
- `drizzle/schema.ts`

## 하지 말 것

- 그래프 시각화 만들지 않기
- 관련 글 추천 고도화하지 않기

## 완료 기준

- 글 A가 글 B를 wikilink하면 글 B 하단에 글 A 표시
- 삭제/수정 시 오래된 링크가 남지 않음
