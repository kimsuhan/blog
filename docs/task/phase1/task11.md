---
status: done
status_label: 완료
order: 11
title: "Task 11. 인증 Middleware 구현"
---

# Task 11. 인증 Middleware 구현

## 목표

`/api/admin/*` 요청에 Bearer Token 인증을 적용한다.

## 작업 내용

- `ADMIN_API_TOKEN` 환경 변수 확인
- Astro middleware에서 `/api/admin/*` 경로 보호
- `Authorization: Bearer <token>` 검증
- 인증 실패 응답 형식 통일
- HMAC은 선택 사항으로 문서에만 남기고 MVP에서는 보류 여부 결정

## 수정 예상 파일

- `src/middleware.ts`
- `src/lib/auth.ts`
- `.env.example`
- `docs/api.md`

## 하지 말 것

- API key DB 저장 구현하지 않기
- 관리자 UI 만들지 않기

## 완료 기준

- 토큰 없는 관리자 API 요청은 401
- 올바른 토큰 요청은 endpoint까지 도달
- 공개 페이지는 인증 없이 접근 가능
