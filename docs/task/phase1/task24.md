---
status: todo
status_label: 할일
order: 24
title: "Task 24. Docker 빌드 검증"
---

# Task 24. Docker 빌드 검증

## 목표

Dockerfile과 docker-compose로 Astro Node Server, PostgreSQL, Nginx가 함께 실행되는지 확인한다.

## 작업 내용

- Dockerfile 빌드 확인
- `docker compose -f docker/docker-compose.yml up --build` 확인
- app 컨테이너 포트와 nginx proxy 확인
- 환경 변수 주입 확인
- volume 정책 확인

## 수정 예상 파일

- `docker/Dockerfile`
- `docker/docker-compose.yml`
- `docker/nginx.conf`
- `.env.example`
- `docs/development.md`

## 하지 말 것

- 운영 서버에 바로 배포하지 않기
- Cloudflare 설정까지 진행하지 않기

## 완료 기준

- Docker Compose로 로컬 접속 가능
- Nginx가 app으로 reverse proxy
- PostgreSQL 컨테이너가 정상 실행
