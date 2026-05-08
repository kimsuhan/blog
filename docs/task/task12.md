---
status: todo
status_label: 할일
order: 12
title: "Task 12. 게시글 생성 API"
---

# Task 12. 게시글 생성 API

## 목표

관리자 API로 Markdown 게시글을 `posts.status = draft` 상태로 생성한다.

## 작업 내용

- `POST /api/admin/posts` request body 검증
- slug 중복 확인
- Markdown 파일 저장
- frontmatter 생성
- posts metadata 저장
- tags / post_tags 저장
- wikilink 파싱은 최소한 후속 task로 넘길 수 있게 구조만 준비

## 수정 예상 파일

- `src/pages/api/admin/posts.ts`
- `src/lib/post-store.ts`
- `src/lib/markdown.ts`
- `src/lib/db.ts`
- `drizzle/schema.ts`
- `docs/api.md`

## 하지 말 것

- 자동 publish 하지 않기
- 물리 삭제 구현하지 않기

## 완료 기준

- 인증된 요청으로 draft 게시글 생성 가능
- Markdown 파일이 `content/posts/YYYY/MM/*.md`에 저장됨
- DB에 metadata 저장됨
- 응답에 생성된 slug와 상태 반환
