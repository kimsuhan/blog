# Task Index

이 폴더는 `docs/mvp-roadmap.md`를 기준으로 MVP까지 차근차근 진행할 작업을 나눈 문서다.

각 task는 하나씩 선택해서 진행한다. 작업 중에는 해당 task의 “하지 말 것”을 우선 지킨다.

## 상태값

각 task 문서 상단에는 YAML frontmatter로 진행 상태를 기록한다.

```yaml
---
status: todo
status_label: 할일
order: 1
title: "Task 1. 프로젝트 실행 기반 정리"
---
```

상태값 기준:

| status | status_label | 의미 |
| --- | --- | --- |
| `todo` | 할일 | 아직 시작하지 않은 작업 |
| `in_progress` | 진행중 | 현재 진행 중인 작업 |
| `done` | 완료 | 완료 기준을 충족한 작업 |
| `blocked` | 막힘 | 외부 결정, 권한, 정보 부족으로 진행이 막힌 작업 |

## 순서

| 순서 | 상태 | 문서 | 주제 |
| --- | --- | --- | --- |
| 1 | 완료 | [task1.md](./task1.md) | 프로젝트 실행 기반 정리 |
| 2 | 완료 | [task2.md](./task2.md) | Daisy UI / Tailwind 기본 연결 |
| 3 | 완료 | [task3.md](./task3.md) | Drizzle DB 스키마 1차 작성 |
| 4 | 완료 | [task4.md](./task4.md) | Docker Compose 개발 DB 확인 |
| 5 | 완료 | [task5.md](./task5.md) | Markdown 파일 읽기와 Frontmatter 파싱 |
| 6 | 완료 | [task6.md](./task6.md) | Markdown HTML 렌더링 |
| 7 | 완료 | [task7.md](./task7.md) | Post Store 1차 구현 |
| 8 | 완료 | [task8.md](./task8.md) | 기본 블로그 페이지 구현 |
| 9 | 완료 | [task9.md](./task9.md) | SEO Head 1차 구현 |
| 10 | 할일 | [task10.md](./task10.md) | RSS, Sitemap, Robots 구현 |
| 11 | 할일 | [task11.md](./task11.md) | 인증 Middleware 구현 |
| 12 | 할일 | [task12.md](./task12.md) | 게시글 생성 API |
| 13 | 할일 | [task13.md](./task13.md) | 게시글 수정 API |
| 14 | 할일 | [task14.md](./task14.md) | 게시글 발행 API |
| 15 | 할일 | [task15.md](./task15.md) | 게시글 삭제 API |
| 16 | 할일 | [task16.md](./task16.md) | Wikilink 파싱 |
| 17 | 할일 | [task17.md](./task17.md) | Post Links 저장과 백링크 |
| 18 | 할일 | [task18.md](./task18.md) | 태그 추출과 태그 페이지 |
| 19 | 할일 | [task19.md](./task19.md) | 관련 글 표시 |
| 20 | 할일 | [task20.md](./task20.md) | 스마트 검색 인덱스 1차 생성 |
| 21 | 할일 | [task21.md](./task21.md) | Graph Index 1차 생성 |
| 22 | 할일 | [task22.md](./task22.md) | Article JSON-LD 구현 |
| 23 | 할일 | [task23.md](./task23.md) | BreadcrumbList / WebSite 구조화 데이터 |
| 24 | 할일 | [task24.md](./task24.md) | Docker 빌드 검증 |
| 25 | 할일 | [task25.md](./task25.md) | Nginx 운영 설정 1차 |
| 26 | 할일 | [task26.md](./task26.md) | 운영 백업 정책 문서화 |
| 27 | 할일 | [task27.md](./task27.md) | MVP 통합 점검 |
| 28 | 할일 | [task28.md](./task28.md) | Phase 2 계획 재정리 |
