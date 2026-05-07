---
status: todo
status_label: 할일
order: 14
title: "Task 14. 게시글 발행 API"
---

# Task 14. 게시글 발행 API

## 목표

draft 게시글을 published 상태로 변경한다.

## 작업 내용

- `POST /api/admin/posts/:slug/publish` 구현
- draft 상태 확인
- `status = published` 변경
- `published_at` 기록
- sitemap/RSS 대상에 포함되는지 확인
- publish log 저장 여부 결정

## 수정 예상 파일

- `src/pages/api/admin/posts/[slug]/publish.ts`
- `src/lib/post-store.ts`
- `src/lib/db.ts`
- `drizzle/schema.ts`
- `docs/api.md`

## 하지 말 것

- AI 생성 글 자동 발행하지 않기
- 예약 발행 구현하지 않기

## 완료 기준

- draft 글을 publish 가능
- published 글만 공개 목록, RSS, sitemap에 포함
- 이미 published인 글 처리 기준 명확
