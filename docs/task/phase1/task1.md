---
status: done
status_label: 완료
order: 1
title: "Task 1. 프로젝트 실행 기반 정리"
---

# Task 1. 프로젝트 실행 기반 정리

## 목표

현재 skeleton 프로젝트가 로컬에서 설치, 개발 서버 실행, 빌드까지 가능한 상태인지 확인하고 부족한 설정만 보완한다.

## 작업 내용

- `pnpm install` 실행 가능 여부 확인
- `pnpm dev`로 Astro 개발 서버가 뜨는지 확인
- `pnpm build`가 통과하는지 확인
- 현재 skeleton 코드에서 타입 오류나 Astro 라우트 오류가 있으면 최소 수정
- `README.md`의 빠른 시작 명령이 실제와 맞는지 확인

## 수정 예상 파일

- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/**/*.astro`
- `src/**/*.ts`
- `README.md`

## 하지 말 것

- 실제 게시글 저장 로직 구현하지 않기
- DB schema 구현하지 않기
- 관리자 API 실제 동작 구현하지 않기
- 디자인을 본격적으로 꾸미지 않기

## 완료 기준

- `pnpm install` 성공
- `pnpm build` 성공
- 홈, 404, 검색, 샘플 라우트 skeleton이 에러 없이 로드
- 문서의 “초기 상태” 설명과 코드 상태가 일치
