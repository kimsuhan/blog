# Task Index

이 폴더는 Phase 2 작업을 task 단위로 진행하기 위한 문서다.

Phase 1 / MVP 작업 문서는 `docs/task/phase1/`에 백업 형태로 보관한다. Phase 2의 기준 문서는 `docs/phase2.md`이며, 운영 서버, DB, Nginx, Cloudflare, 백업 저장소 같은 인프라 설정은 사용자가 직접 관리하므로 이 task 흐름에서는 제외한다.

각 task는 하나씩 선택해서 진행한다. 작업 중에는 해당 task의 “하지 말 것”과 “완료 기준”을 우선한다.

## 상태값

각 task 문서 상단에는 YAML frontmatter로 진행 상태를 기록한다.

```yaml
---
status: todo
status_label: 할일
order: 1
title: "Task 1. Draft Preview"
---
```

상태값 기준:

| status | status_label | 의미 |
| --- | --- | --- |
| `todo` | 할일 | 아직 시작하지 않은 작업 |
| `in_progress` | 진행중 | 현재 진행 중인 작업 |
| `done` | 완료 | 완료 기준을 충족한 작업 |
| `blocked` | 막힘 | 외부 결정, 권한, 정보 부족으로 진행이 막힌 작업 |

## Phase 2 순서

| 순서 | 상태 | 문서 | 주제 |
| --- | --- | --- | --- |
| 1 | 할일 | [task1.md](./task1.md) | Draft Preview |
| 2 | 할일 | [task2.md](./task2.md) | API 요청 로그 |
| 3 | 할일 | [task3.md](./task3.md) | 게시글 수정 이력 |
| 4 | 할일 | [task4.md](./task4.md) | 검색 랭킹 고도화 |
| 5 | 할일 | [task5.md](./task5.md) | Pagefind / Meilisearch 선택 검토 |

## Phase 2 제외

아래 항목은 사용자가 운영 환경에서 직접 관리하거나 Phase 3에서 다룬다.

- 자동 백업 스크립트
- PostgreSQL 운영 설정
- Nginx / reverse proxy 운영 설정
- Cloudflare, 도메인, SSL/TLS 설정
- 관리자 웹 UI
- 시각적 그래프 UI
- 자동 OG 이미지 생성
- 조회수 통계와 인기 글 계산
- 예약 발행
