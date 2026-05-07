---
status: todo
status_label: 할일
order: 26
title: "Task 26. 운영 백업 정책 문서화"
---

# Task 26. 운영 백업 정책 문서화

## 목표

Git에 올리지 않는 Markdown 운영 데이터와 DB를 어떻게 백업할지 정리한다.

## 작업 내용

- 백업 대상 확정
- PostgreSQL dump 방식 정리
- `content/posts/*.md` 백업 방식 정리
- `.env`, `nginx.conf`, `docker-compose.yml` 백업 여부 정리
- 백업 저장 위치와 보관 주기 초안 작성

## 수정 예상 파일

- `docs/project-structure.md`
- `docs/development.md`
- 필요 시 `docs/backup.md`

## 하지 말 것

- 백업 스크립트 구현하지 않기
- 외부 스토리지 연동하지 않기

## 완료 기준

- 운영 데이터가 Git에 없다는 전제가 문서에 명확
- 재해 복구에 필요한 최소 백업 대상이 정리됨
