---
status: done
status_label: 완료
order: 21
title: "Task 21. Graph Index 1차 생성"
---

# Task 21. Graph Index 1차 생성

## 목표

텍스트 기반 백링크와 향후 그래프 UI 확장을 위한 graph index 생성 흐름을 만든다.

## 작업 내용

- posts를 nodes로 변환
- post_links를 edges로 변환
- `data/graph-index.json` 생성
- wikilink edge type 저장
- MVP에서는 UI 시각화 없이 데이터만 준비

## 수정 예상 파일

- `src/lib/graph.ts`
- `data/.gitkeep`
- `.gitignore`
- `docs/project-structure.md`

## 하지 말 것

- 그래프 시각화 만들지 않기
- 클라이언트 그래프 라이브러리 추가하지 않기

## 완료 기준

- graph index JSON 생성 가능
- Git에는 생성된 graph index를 올리지 않음

## 구현 메모

- `src/lib/graph.ts`에서 published 게시글을 nodes로, `wikilink` 타입의 `post_links`를 edges로 변환한다.
- graph index는 `data/graph-index.json`에 생성하며, 생성 파일은 Git 추적 대상이 아니다.
- 관리자 API의 생성/수정/발행/보관 흐름 이후 graph index 파일을 재생성한다.
- MVP 범위에서는 시각화 UI나 클라이언트 그래프 라이브러리를 추가하지 않는다.
