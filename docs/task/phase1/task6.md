---
status: done
status_label: 완료
order: 6
title: "Task 6. Markdown HTML 렌더링"
---

# Task 6. Markdown HTML 렌더링

## 목표

Markdown 본문을 HTML로 변환하고 코드블록, 이미지, 기본 링크가 정상 렌더링되도록 한다.

## 작업 내용

- Markdown renderer 라이브러리 선택
- 코드블록 렌더링 확인
- 이미지 Markdown 렌더링 확인
- HTML sanitize 필요 여부 검토
- 렌더링 결과를 게시글 상세 페이지에서 출력

## 수정 예상 파일

- `package.json`
- `src/lib/markdown.ts`
- `src/pages/posts/[slug].astro`
- `src/styles/global.css`

## 하지 말 것

- wikilink DB 저장 구현하지 않기
- 백링크 구현하지 않기
- 관리자 API 구현하지 않기

## 완료 기준

- 샘플 Markdown 본문이 HTML로 표시됨
- 코드블록과 이미지가 깨지지 않음
- `pnpm build` 성공
