---
status: done
status_label: 완료
order: 5
title: "Task 5. Markdown 파일 읽기와 Frontmatter 파싱"
---

# Task 5. Markdown 파일 읽기와 Frontmatter 파싱

## 목표

운영 서버의 `content/posts/YYYY/MM/*.md` 파일을 읽고 frontmatter와 본문을 분리하는 최소 기능을 만든다.

## 작업 내용

- Markdown 파일 경로 규칙 구현
- frontmatter 파서 라이브러리 선택
- 게시글 metadata 타입 정의
- `slug`, `title`, `description`, `date`, `updated`, `status`, `tags`, `series`, `canonical`, `ogImage` 파싱
- 잘못된 frontmatter에 대한 에러 처리 기준 정의

## 수정 예상 파일

- `src/lib/markdown.ts`
- `src/lib/post-store.ts`
- `content/posts/2026/05/sample-post.md`
- `docs/project-structure.md`

## 하지 말 것

- DB 저장까지 연결하지 않기
- API 생성/수정 로직 구현하지 않기
- 검색 인덱스 생성하지 않기

## 완료 기준

- 샘플 Markdown을 읽어 metadata와 body로 분리 가능
- `posts.status` 기준으로 `draft | published | archived` 상태 판단 가능
- invalid frontmatter 처리 방식이 명확함
