---
status: todo
status_label: 할일
order: 4
title: "Task 4. 검색 랭킹 고도화"
---

# Task 4. 검색 랭킹 고도화

## 목표

기존 PostgreSQL 검색 인덱스를 유지하면서 검색 결과 품질을 개선한다.

## 작업 내용

- 현재 `post_search_index` 검색 쿼리 점검
- title, tag, series, body 가중치 기준 재정리
- exact slug / exact title match 우선순위 반영 여부 결정
- excerpt 생성 품질 개선
- 검색어가 없을 때 fallback 결과 기준 정리
- 검색 결과 UI에 필요한 최소 정보 확인

## 수정 예상 파일

- `src/lib/search-index.ts`
- `src/pages/search.astro`
- `docs/phase2.md`

## 하지 말 것

- Pagefind 또는 Meilisearch를 같이 도입하지 않기
- 고급 필터 UI 만들지 않기
- 검색 화면을 탐색형 포털로 확장하지 않기
- draft / archived 글을 검색 결과에 포함하지 않기

## 완료 기준

- 제목, 태그, 시리즈 일치 결과가 본문 단순 일치보다 우선됨
- exact slug 또는 exact title match가 상위에 노출됨
- excerpt가 검색어 주변 문맥을 보여줌
- draft / archived 글은 계속 제외됨
- PostgreSQL 기반 검색 유지 또는 한계가 문서화됨
