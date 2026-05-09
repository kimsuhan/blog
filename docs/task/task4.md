---
status: done
status_label: 완료
order: 4
title: "Task 4. Docker Compose 개발 DB 확인"
---

# Task 4. Docker Compose 개발 DB 확인

## 목표

PostgreSQL 컨테이너를 로컬 개발용으로 실행하고 Drizzle migration을 적용할 수 있는 상태를 만든다.

## 작업 내용

- `docker/docker-compose.yml`의 `db` 서비스 확인
- 개발용 `.env` 예시와 `DATABASE_URL` 일치 확인
- PostgreSQL volume 정책 확인
- `pnpm db:generate`와 `pnpm db:migrate` 실행 흐름 확인
- DB 연결 실패 시 원인을 문서화

## 수정 예상 파일

- `docker/docker-compose.yml`
- `.env.example`
- `docs/development.md`
- 필요 시 `drizzle.config.ts`

## 하지 말 것

- 운영 서버 배포 설정까지 확장하지 않기
- 백업 서비스 구현하지 않기
- 관리자 API 구현하지 않기

## 완료 기준

- 로컬 PostgreSQL 컨테이너 실행 가능
- migration 적용 가능
- 개발자가 `.env`를 만들어 DB 연결할 수 있음
