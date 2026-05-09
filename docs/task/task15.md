---
status: done
status_label: 완료
order: 15
title: "Task 15. 게시글 삭제 API"
---

# Task 15. 게시글 삭제 API

## 목표

게시글 삭제 요청을 기본적으로 archived 처리한다.

## 작업 내용

- `DELETE /api/admin/posts/:slug` 구현
- 기본 동작은 `status = archived`
- 공개 페이지, RSS, sitemap에서 제외
- 물리 삭제 옵션은 보류하거나 명시적으로만 허용
- 삭제 로그 저장 여부 결정

## 수정 예상 파일

- `src/pages/api/admin/posts/[slug].ts`
- `src/lib/post-store.ts`
- `src/lib/db.ts`
- `docs/api.md`

## 하지 말 것

- 기본값으로 Markdown 파일을 삭제하지 않기
- 복구 UI 만들지 않기

## 완료 기준

- 삭제 요청 후 글은 공개되지 않음
- Markdown 원본은 기본적으로 유지
- archived 상태가 DB에 반영
