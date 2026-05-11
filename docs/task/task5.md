---
status: todo
status_label: 할일
order: 5
title: "Task 5. Pagefind / Meilisearch 선택 검토"
---

# Task 5. Pagefind / Meilisearch 선택 검토

## 목표

PostgreSQL 검색을 계속 유지할지, Pagefind 또는 Meilisearch로 확장할지 운영 기준으로 판단한다.

## 작업 내용

- 현재 PostgreSQL 검색의 한계 정리
- Pagefind 도입 조건 정리
- Meilisearch 도입 조건 정리
- 글 수, 검색량, 배포 방식, 운영 비용 기준 비교
- 도입하지 않을 경우 PostgreSQL 유지 기준 문서화
- 후속 구현 task가 필요한지 결정

## 수정 예상 파일

- `docs/phase2.md`
- `docs/mvp-roadmap.md`
- 필요 시 `docs/search.md`

## 하지 말 것

- 검토 task에서 검색 엔진을 바로 설치하지 않기
- 외부 검색 서버 운영을 전제로 문서를 확정하지 않기
- 고급 필터 UI 구현하지 않기
- 기존 PostgreSQL 검색을 제거하지 않기

## 완료 기준

- PostgreSQL 유지 / Pagefind 도입 / Meilisearch 도입 중 다음 방향이 결정됨
- 선택 기준이 문서화됨
- 도입이 필요하면 별도 구현 task 후보가 정리됨
- 도입하지 않으면 PostgreSQL 검색 개선 방향이 문서화됨
