---
status: todo
status_label: 할일
order: 8
title: "Task 8. 기본 블로그 페이지 구현"
---

# Task 8. 기본 블로그 페이지 구현

## 목표

MVP의 공개 페이지를 skeleton에서 실제 읽기 가능한 아카이브 화면으로 만든다. 홈 화면은 `docs/design`의 랜딩 phase1/phase2 구조를 기준으로 한다.

## 작업 내용

- 홈 페이지 phase1: 중앙 검색 아이콘, 검색 의도 중심 진입
- 홈 페이지 search active: 큰 검색 입력, 닫기 버튼, 태그/카테고리 preview
- 홈 페이지 phase2: `Recent Accessions` 보조 archive index
- 글 상세 페이지: 제목, 날짜, reference code, 태그, 본문
- 태그 페이지: 태그명, 글 목록
- 시리즈 페이지: 시리즈명, 글 목록
- 검색 페이지: MVP에서는 시안 기반 정적 UI 또는 준비 상태 표시
- 404 페이지: 단순 오류 페이지

## 수정 예상 파일

- `src/pages/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/tags/[tag].astro`
- `src/pages/series/[series].astro`
- `src/pages/search.astro`
- `src/pages/404.astro`
- `src/components/*.astro`
- `docs/design/*.html`

## 하지 말 것

- 검색 알고리즘이나 고급 검색 UI 구현하지 않기
- 관리자 UI 만들지 않기
- 시각적 그래프 만들지 않기
- `post-detail.html`이 실제 상세 시안인지 확인 전 상세 화면을 확정하지 않기

## 완료 기준

- MVP 공개 페이지가 모두 접근 가능
- 홈이 phase1 검색 중심 화면에서 phase2 보조 archive index로 자연스럽게 이어짐
- 글 상세는 SEO 직접 유입자가 해당 문서에 집중할 수 있음
- 모바일 기본 레이아웃이 깨지지 않음
- 게시글 상세에서 본문을 읽을 수 있음
