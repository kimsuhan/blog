---
status: todo
status_label: 할일
order: 25
title: "Task 25. Nginx 운영 설정 1차"
---

# Task 25. Nginx 운영 설정 1차

## 목표

Cloudflare 뒤에서 사용할 Nginx reverse proxy 기본 설정을 정리한다.

## 작업 내용

- `nginx.conf` proxy header 확인
- 업로드 크기 제한 필요 여부 확인
- gzip 또는 brotli 적용 여부 결정
- 관리자 API rate limit 적용 위치 결정
- Cloudflare SSL/TLS Full(strict) 전제 문서화

## 수정 예상 파일

- `docker/nginx.conf`
- `docs/project-structure.md`
- `docs/development.md`

## 하지 말 것

- Cloudflare API 자동화하지 않기
- certbot 설정으로 확장하지 않기

## 완료 기준

- Nginx가 Astro 서버로 요청 전달
- 관리자 API 보호 정책이 문서와 충돌하지 않음
- 운영 적용 전에 필요한 환경 값이 명확
