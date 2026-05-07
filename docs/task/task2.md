---
status: todo
status_label: 할일
order: 2
title: "Task 2. Daisy UI / Tailwind 기본 연결"
---

# Task 2. Daisy UI / Tailwind 기본 연결

## 목표

MVP 디자인 기준인 Daisy UI 기반 텍스트 중심 UI를 사용할 수 있도록 최소 설정만 연결한다.

## 작업 내용

- Tailwind CSS와 Daisy UI 설정 방식 확정
- Astro에서 전역 CSS로 Tailwind/Daisy UI가 적용되도록 연결
- `Layout.astro`, `Header.astro`, `Footer.astro`에 최소 클래스 적용
- 본문 최대 폭 720px 기준 유지
- 다크모드 선택 지원 방식 초안 정리

## 수정 예상 파일

- `package.json`
- `src/styles/global.css`
- `src/components/Layout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- 필요 시 Tailwind 설정 파일
- `docs/project-structure.md`

## 하지 말 것

- 화려한 랜딩 페이지 만들지 않기
- 관리자 UI 만들지 않기
- 페이지별 세부 디자인 완성하려 하지 않기

## 완료 기준

- Daisy UI 클래스가 실제 페이지에 적용됨
- 텍스트 중심 레이아웃 유지
- 모바일에서 기본 레이아웃이 깨지지 않음
- `pnpm build` 성공
