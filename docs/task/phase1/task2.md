---
status: done
status_label: 완료
order: 2
title: "Task 2. Daisy UI / Tailwind 기본 연결"
---

# Task 2. Daisy UI / Tailwind 기본 연결

## 목표

MVP 디자인 기준인 Library Archive 콘셉트를 구현할 수 있도록 Daisy UI / Tailwind 기반을 최소 설정으로 연결한다.

## 작업 내용

- Tailwind CSS와 Daisy UI 설정 방식 확정
- Astro에서 전역 CSS로 Tailwind/Daisy UI가 적용되도록 연결
- `Layout.astro`, `Header.astro`, `Footer.astro`에 최소 클래스 적용
- `docs/design/design-concept.md`의 Library Archive 토큰을 전역 스타일 기준으로 정리
- 글 상세 본문 최대 폭 720px, 랜딩 목록 컨테이너 최대 폭 800px 기준 정리
- headline/body serif, metadata/label sans-serif 기준 정리
- monochrome palette, fine line, 높은 여백 기준 정리
- 다크모드 선택 지원 방식 초안 정리

## 수정 예상 파일

- `package.json`
- `src/styles/global.css`
- `src/components/Layout.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- 필요 시 Tailwind 설정 파일
- `docs/project-structure.md`
- `docs/design/design-concept.md`

## 하지 말 것

- 시안 파일을 그대로 복사해 구현하지 않기
- 관리자 UI 만들지 않기
- 페이지별 세부 디자인 완성하려 하지 않기
- 검색 알고리즘이나 고급 검색 UI 구현하지 않기

## 완료 기준

- Daisy UI / Tailwind 기반이 실제 페이지에 적용됨
- Library Archive 콘셉트와 충돌하지 않음
- 텍스트 중심, search-first, archival layout 방향 유지
- 모바일에서 기본 레이아웃이 깨지지 않음
- `pnpm build` 성공
