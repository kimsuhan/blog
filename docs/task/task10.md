---
status: todo
status_label: 할일
order: 10
title: "Task 10. RSS, Sitemap, Robots 구현"
---

# Task 10. RSS, Sitemap, Robots 구현

## 목표

검색 엔진과 구독기를 위한 기본 SEO endpoint를 구현한다.

## 작업 내용

- `/rss.xml` 구현
- `/sitemap.xml` 구현
- `/robots.txt` 구현
- published 게시글만 포함
- 태그/시리즈 페이지 포함 여부 결정
- 사이트 기본 URL 환경 변수 검토

## 수정 예상 파일

- `src/pages/rss.xml.ts`
- `src/pages/sitemap.xml.ts`
- `src/pages/robots.txt.ts`
- `src/lib/seo.ts`
- `.env.example`
- `docs/development.md`

## 하지 말 것

- 고급 캐시 구현하지 않기
- 검색 인덱스 구현하지 않기

## 완료 기준

- RSS XML 유효
- Sitemap XML 유효
- Robots가 sitemap 위치를 안내
- draft 글은 포함되지 않음
