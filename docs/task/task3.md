---
status: todo
status_label: 할일
order: 3
title: "Task 3. 게시글 수정 이력"
---

# Task 3. 게시글 수정 이력

## 목표

게시글 변경 내역을 추적해 수정 사고 발생 시 원인 파악과 수동 복구 판단을 돕는다.

## 작업 내용

- 수정 이력 schema 설계
- 생성 / 수정 / 발행 / 보관 이벤트 기록 범위 결정
- metadata 변경 전후 요약 저장 방식 결정
- Markdown 본문 스냅샷 저장 여부 결정
- 관리자 API mutation 흐름에 이력 저장 연결
- 기존 `publish_logs`와 역할 분리

## 수정 예상 파일

- `drizzle/schema.ts`
- `drizzle/migrations/*`
- `src/lib/post-store.ts`
- `src/lib/post-history.ts`
- `docs/api.md`
- `docs/phase2.md`

## 하지 말 것

- rollback UI 만들지 않기
- 관리자 웹 UI 만들지 않기
- 운영 백업을 수정 이력 기능으로 대체하지 않기
- 공개 페이지에 수정 이력 노출하지 않기

## 완료 기준

- 게시글 생성 / 수정 / 발행 / 보관 시 이력 저장
- 변경 시각, 대상 slug, action, 변경 주체 기준이 저장됨
- metadata 변경 요약이 확인 가능
- Markdown 본문 저장 방식이 명확히 결정됨
- 복구는 수동 기준으로 문서화되고 자동 rollback은 포함하지 않음
