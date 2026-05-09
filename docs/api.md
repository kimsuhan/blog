# 관리자 API 문서

관리자 API는 Astro SSR endpoint로 구현한다.

모든 관리자 API 요청은 기본적으로 Bearer Token 인증을 요구한다.

```http
Authorization: Bearer <ADMIN_API_TOKEN>
```

## Endpoint

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/admin/posts` | Markdown 게시글 생성 |
| `PATCH` | `/api/admin/posts/:slug` | 게시글 본문 또는 메타데이터 수정 |
| `POST` | `/api/admin/posts/:slug/publish` | 게시글 발행 |
| `DELETE` | `/api/admin/posts/:slug` | 게시글 삭제, 기본은 archived 처리 |

## 인증 정책

초기 구현은 `ADMIN_API_TOKEN` 기반 Bearer Token으로 시작한다.

`/api/admin/*` 경로는 Astro middleware에서 보호한다. 토큰이 없거나 일치하지 않으면 다음 형식으로 응답한다.

```json
{
  "ok": false,
  "error": "Unauthorized"
}
```

향후 외부 자동화 도구에서 관리자 API를 호출할 경우 요청 본문 변조 방지를 위해 HMAC 검증을 추가한다.

```http
X-Signature: sha256=<signature>
```

## 게시글 생성

```http
POST /api/admin/posts
```

요청 예시:

```json
{
  "title": "Astro 블로그 시작하기",
  "slug": "start-astro-blog",
  "description": "Astro 기반 블로그 구축 기록",
  "tags": ["astro", "blog"],
  "series": "블로그 만들기",
  "markdown": "# Astro 블로그 시작하기\n\n본문 내용",
  "status": "draft"
}
```

처리 내용:

```txt
1. Auth 검증
2. slug 중복 확인
3. Markdown 파일 저장
4. frontmatter 생성
5. posts 테이블 저장
6. tags / post_tags 저장
7. wikilink 파싱은 후속 task에서 처리
8. post_links 저장은 후속 task에서 처리
9. post_search_index 갱신은 후속 task에서 처리
```

생성 API는 요청의 `status` 값과 관계없이 초기에 `draft`로 저장한다. 성공 응답은 생성된 slug, status, Markdown 경로를 포함한다.

## 게시글 수정

```http
PATCH /api/admin/posts/:slug
```

처리 내용:

```txt
1. Auth 검증
2. 기존 게시글 조회
3. Markdown 파일 수정
4. 메타데이터 갱신
5. 태그 재계산
6. 내부 링크 재계산
7. updated_at 갱신
8. post_search_index 갱신
```

## 게시글 발행

```http
POST /api/admin/posts/:slug/publish
```

처리 내용:

```txt
1. Auth 검증
2. `posts.status = draft` 상태 확인
3. `posts.status = published` 변경
4. published_at 기록
5. sitemap 갱신 대상 반영
6. RSS 갱신 대상 반영
7. publish_logs 저장
```

이미 `published` 상태인 글은 `409`로 응답한다. `draft`가 아닌 다른 상태는 발행 대상이 아니므로 실패 처리한다.

## 게시글 삭제

```http
DELETE /api/admin/posts/:slug
```

기본 처리 방식은 soft delete 또는 `archived` 상태 변경이다. 물리 삭제는 별도 옵션으로만 허용한다.

MVP 기본 구현은 항상 `archived` 상태로 변경하고 Markdown 원본 파일은 유지한다. archived 글은 공개 페이지, RSS, sitemap 대상에서 제외된다.

## 응답 형식

성공 응답은 `ok: true`를 포함한다.

```json
{
  "ok": true
}
```

실패 응답은 `ok: false`와 `error`를 포함한다.

```json
{
  "ok": false,
  "error": "Unauthorized"
}
```
