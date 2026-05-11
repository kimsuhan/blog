---
status: todo
status_label: 할일
order: 2
title: "Task 2. API 요청 로그"
---

# Task 2. API 요청 로그

## 목표

관리자 API 호출을 운영자가 추적할 수 있도록 요청 로그 저장 흐름을 만든다.

## 작업 내용

- API 요청 로그 schema 설계
- 로그 저장 위치와 보관 필드 결정
- middleware 또는 endpoint wrapper 중 구현 위치 결정
- 성공 / 실패 응답의 status code와 처리 시간 기록
- actor 식별 방식 결정
- 민감 정보 제외 기준 정리

## 수정 예상 파일

- `drizzle/schema.ts`
- `drizzle/migrations/*`
- `src/middleware.ts`
- `src/lib/auth.ts`
- `src/lib/api-log.ts`
- `docs/api.md`
- `docs/development.md`

## 하지 말 것

- Authorization header 원문 저장하지 않기
- HMAC secret, 관리자 토큰, 환경 변수 저장하지 않기
- 게시글 본문 전체를 API 요청 로그에 저장하지 않기
- 로그 조회용 관리자 대시보드 만들지 않기

## 완료 기준

- 관리자 API 요청마다 method, path, status, 처리 시간, 요청 시각 저장
- 가능한 경우 actor 식별자 또는 token hash 기준 저장
- 실패 응답도 로그로 남음
- 민감 정보가 로그에 저장되지 않음
- 기존 `publish_logs`와 API 요청 로그의 역할 차이가 문서화됨
