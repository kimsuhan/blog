---
status: todo
status_label: 할일
order: 13
title: "Task 13. 게시글 수정 API"
---

# Task 13. 게시글 수정 API

## 목표

기존 게시글의 본문과 메타데이터를 수정할 수 있게 한다.

## 작업 내용

- `PATCH /api/admin/posts/:slug` request body 검증
- 기존 게시글 조회
- Markdown 파일 수정
- metadata 갱신
- 태그 재계산
- `updated_at` 갱신
- 수정 후 공개 페이지 반영 확인

## 수정 예상 파일

- `src/pages/api/admin/posts/[slug].ts`
- `src/lib/post-store.ts`
- `src/lib/markdown.ts`
- `src/lib/db.ts`

## 하지 말 것

- 수정 이력 전체 구현하지 않기
- 검색 인덱스 고도화하지 않기

## 완료 기준

- 인증된 요청으로 게시글 수정 가능
- 수정된 본문이 게시글 상세 페이지에 반영
- 태그 변경이 태그 페이지에 반영
