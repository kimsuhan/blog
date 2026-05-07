---
status: todo
status_label: 할일
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
