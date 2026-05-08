---
status: todo
status_label: 할일
order: 3
title: "Task 3. Drizzle DB 스키마 1차 작성"
---

# Task 3. Drizzle DB 스키마 1차 작성

## 목표

문서에 정의된 MVP DB 테이블을 Drizzle schema로 작성한다.

## 작업 내용

- `posts` 테이블 작성
- `tags` 테이블 작성
- `post_tags` 테이블 작성
- `post_links` 테이블 작성
- `post_search_index` 테이블 작성
- `api_keys`, `publish_logs` 포함 여부 결정 후 문서와 일치시킴
- `posts.status` 값으로 `draft | published | archived` 사용
- slug, status, tag slug, 검색 vector 등에 필요한 index 정의

## 수정 예상 파일

- `drizzle/schema.ts`
- `drizzle.config.ts`
- `docs/project-structure.md`
- `docs/development.md`

## 하지 말 것

- API 구현하지 않기
- Markdown 파일 저장 로직 구현하지 않기
- migration을 운영 DB에 적용하지 않기

## 완료 기준

- Drizzle schema가 문서의 DB 설계와 일치
- `post_search_index`가 제목, 본문, 태그, 시리즈 통합 검색을 지원
- `pnpm db:generate`로 migration 생성 가능
- schema 필드명이 문서와 충돌하지 않음
