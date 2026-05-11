# Phase 2 계획

Phase 2는 MVP 운영을 시작한 뒤 실제 작성, 발행, 검색 경험에서 불편한 지점을 줄이는 단계다.

운영 서버, Nginx, DB, 백업 저장소 같은 인프라 설정은 사용자가 직접 관리한다. 이 문서는 애플리케이션 안에서 구현할 후속 기능만 다룬다.

## 우선순위

| 우선순위 | 작업 | 목적 | 완료 기준 |
| --- | --- | --- | --- |
| P1 | Draft Preview | 발행 전 글 화면과 SEO 값을 확인 | draft 글을 인증된 경로에서 렌더링하고 공개 목록, RSS, sitemap에는 노출하지 않음 |
| P1 | API 요청 로그 | 관리자 API 운영 추적 | 요청 시간, method, path, actor, status, 오류 요약을 저장하고 민감한 본문과 토큰은 저장하지 않음 |
| P2 | 게시글 수정 이력 | 변경 추적과 복구 판단 보조 | 게시글 metadata와 markdown 변경 시점, 변경 주체, 이전 버전 참조 기준을 저장 |
| P2 | 검색 랭킹 고도화 | 검색 결과 품질 개선 | 제목, 태그, 시리즈, 본문 가중치와 excerpt 기준이 문서화되고 기존 DB 검색에서 개선됨 |
| P3 | Pagefind 또는 Meilisearch 선택 | 검색 엔진 확장 여부 결정 | 운영 글 수, 배포 방식, 검색 지연 기준으로 유지/도입 판단 |
| 운영 별도 | 자동 백업 스크립트 | DB와 Markdown 데이터 보호 | 사용자가 운영 환경에서 별도 관리하며 앱 구현 task에서는 제외 |

## 1. Draft Preview

목표는 publish 전에 실제 게시글 상세와 거의 같은 화면으로 draft를 확인하는 것이다.

초안 범위:

- 인증된 관리자 요청에서만 접근
- `draft`와 `published` 모두 preview 가능
- preview URL은 공개 sitemap, RSS, 검색 결과, 태그/시리즈 목록에 포함하지 않음
- canonical은 공개 URL을 강제하지 않거나 `noindex` 처리 기준을 둠
- Article JSON-LD 출력 여부는 기본적으로 비활성화하고, 필요하면 preview 전용 표시만 둠

후보 경로:

```txt
/api/admin/posts/:slug/preview
/preview/posts/:slug
```

1차 구현은 Astro 페이지 렌더링이 쉬운 `/preview/posts/:slug`를 우선 검토한다. 인증은 기존 middleware 정책과 충돌하지 않게 별도 보호 규칙을 둔다.

## 2. API 요청 로그

목표는 관리자 API 호출을 운영자가 나중에 추적할 수 있게 하는 것이다.

저장 후보:

- 요청 시각
- method
- path
- status code
- 처리 시간
- actor key id 또는 token 식별자 hash
- IP 또는 proxy header 기반 client hint
- 오류 메시지 요약

저장하지 않을 것:

- Authorization header 원문
- HMAC secret
- 게시글 본문 전체
- 민감한 환경 변수

MVP의 `publish_logs`는 게시글 상태 변경 이력에 가깝다. Phase 2의 API 요청 로그는 API 호출 감사 로그로 별도 테이블을 우선 검토한다.

## 3. 게시글 수정 이력

목표는 수정 사고가 났을 때 원인 파악과 수동 복구를 돕는 것이다.

초안 범위:

- 게시글 생성, 수정, 발행, 보관 이벤트 기록
- metadata 변경 전후 요약
- markdown 본문은 전체 스냅샷 또는 diff 중 선택
- rollback UI는 Phase 2에 포함하지 않음

선택 기준:

| 방식 | 장점 | 단점 |
| --- | --- | --- |
| 전체 스냅샷 | 복구가 단순함 | DB 용량 증가 |
| diff 저장 | 저장량이 작음 | 복구와 표시가 복잡함 |

초기에는 운영 안정성을 위해 전체 스냅샷을 우선 검토한다. 글 수가 많아지면 diff 또는 파일 백업 기반으로 조정한다.

## 4. 검색 랭킹 고도화

현재 검색은 PostgreSQL `post_search_index`와 full-text search를 사용한다.

고도화 후보:

- title 가중치 유지 또는 상향
- tag, series 일치 시 rank 보정
- 최신 글 보정 여부 검토
- exact slug/title match 우선 노출
- excerpt 생성 품질 개선
- 검색어가 없을 때 최근 글 fallback 유지

하지 않을 것:

- 고급 필터 UI를 먼저 만들지 않음
- 외부 검색 엔진을 성급히 도입하지 않음
- 검색 결과 화면을 탐색형 포털로 확장하지 않음

## 5. Pagefind 또는 Meilisearch 선택 기준

Phase 2에서 바로 도입하지 않고, 먼저 PostgreSQL 검색의 한계를 확인한다.

| 기준 | PostgreSQL 유지 | Pagefind 검토 | Meilisearch 검토 |
| --- | --- | --- | --- |
| 운영 방식 | SSR과 DB 중심 | 정적 색인 파일 배포가 쉬울 때 | 별도 검색 서버 운영이 가능할 때 |
| 글 수 | 소규모/중간 규모 | 정적 페이지 색인이 충분할 때 | 검색량과 글 수가 커질 때 |
| 기능 | 기본 검색 충분 | 클라이언트 검색 선호 | typo tolerance, ranking, filter 필요 |
| 운영 비용 | 낮음 | 낮음 | 높음 |

현재 방향은 PostgreSQL 검색을 먼저 개선하고, 운영 글 수와 검색 불만이 생긴 뒤 Pagefind/Meilisearch를 재검토한다.

## 6. 자동 백업 스크립트

백업은 중요하지만 사용자가 운영 환경에서 직접 구성한다. 애플리케이션 Phase 2 구현 task에는 포함하지 않는다.

앱 문서에 남길 최소 기준:

- PostgreSQL dump 필요
- `content/posts/**/*.md` 백업 필요
- `.env`와 운영 proxy 설정 백업 필요
- 복구 절차는 운영 문서에서 관리

## Phase 2 제외

아래 항목은 Phase 3 또는 별도 운영 작업으로 둔다.

- Obsidian식 시각적 그래프 UI
- 관리자 웹 UI
- 자동 OG 이미지 생성
- 조회수 통계와 인기 글 계산
- 예약 발행
- 이메일 구독
- 다국어 지원
- Cloudflare/Nginx 세부 운영 설정
