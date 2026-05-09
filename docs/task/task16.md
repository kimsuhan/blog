---
status: done
status_label: 완료
order: 16
title: "Task 16. Wikilink 파싱"
---

# Task 16. Wikilink 파싱

## 목표

Obsidian식 `[[wikilink]]`를 파싱하고 HTML 내부 링크로 변환한다.

## 작업 내용

- `[[target-slug]]` 파싱
- `[[target-slug|표시할 텍스트]]` 파싱
- HTML 렌더링 시 `/posts/target-slug` 링크로 변환
- 존재하지 않는 slug 처리 기준 결정
- markdown link와 wikilink 구분 준비

## 수정 예상 파일

- `src/lib/markdown.ts`
- `src/lib/graph.ts`
- `src/pages/posts/[slug].astro`
- `docs/project-structure.md`

## 하지 말 것

- 시각적 그래프 UI 만들지 않기
- 추천 알고리즘 만들지 않기

## 완료 기준

- 게시글 본문에서 wikilink가 내부 링크로 표시
- 표시명 문법이 정상 동작
- 파싱된 링크 정보를 후속 task에서 DB에 저장할 수 있는 구조
