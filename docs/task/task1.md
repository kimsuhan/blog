---
status: todo
status_label: 할일
order: 1
title: "Task 1. Draft Preview"
---

# Task 1. Draft Preview

## 목표

발행 전 draft 게시글을 실제 상세 화면과 거의 같은 형태로 확인할 수 있는 preview 흐름을 만든다.

## 작업 내용

- preview 접근 경로 결정
- draft / published 게시글 preview 조회 기준 정리
- preview 경로 인증 방식 결정
- preview 화면에서 Markdown 렌더링, 태그, 백링크, 관련 글 표시 여부 결정
- preview 페이지의 SEO 정책 정리
- 공개 목록, RSS, sitemap, 검색 결과에서 draft가 제외되는지 재확인

## 수정 예상 파일

- `src/pages/preview/posts/[slug].astro`
- `src/middleware.ts`
- `src/lib/post-store.ts`
- `src/components/SeoHead.astro`
- `docs/api.md`
- `docs/phase2.md`

## 하지 말 것

- 관리자 웹 UI 만들지 않기
- draft를 공개 목록, RSS, sitemap, 검색 결과에 노출하지 않기
- preview 페이지에 Article JSON-LD를 공개 글처럼 출력하지 않기
- publish API 동작을 바꾸지 않기

## 완료 기준

- 인증된 요청에서 draft 게시글 preview 가능
- published 게시글도 같은 preview 경로에서 확인 가능
- 인증되지 않은 요청은 preview 접근 불가
- preview HTML에 `noindex` 기준이 반영됨
- 공개 페이지, RSS, sitemap, 검색 결과는 draft를 계속 제외함
