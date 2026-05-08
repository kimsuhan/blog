# Project Brief: Library Archive Personal Blog

## 1. Project Overview

A minimalist personal knowledge archive designed with the aesthetic of a digital library. The platform prioritizes retrieving a specific record through search, not browsing a stream of posts. The layout should feel like reading a physical document or accessing a curated institutional record.

## 2. Core Concept & UX Philosophy

- **Purposeful Retrieval:** The interface evokes the "silence" of a library. High whitespace, minimal UI chrome, and a focus on one inquiry at a time.
- **Search-Centric:** The primary entry point is a single magnifying glass. The user should search for the exact thing they need rather than passively browse.
- **Verticality:** Content unfolds through scrolling, mimicking the tactile experience of scanning a physical index.
- **Refined Typography:** Heavy reliance on serif fonts (Newsreader) and monochromatic palettes to convey authority and timelessness.

## 3. Design System Summary

- **Name:** Library Archive
- **Color Palette:** Monochrome (White/Black) with soft grey accents (#f9f9f9 surface).
- **Typography:** Newsreader (Serif) for headlines and body. Geometric sans-serif for metadata and labels (all caps).
- **UI Elements:** Fine lines (0.5pt - 1pt), boxed categories, and abstracted navigation (points/lines instead of text for secondary nav).

## 4. Key Screens & Flows

1.  **Landing (Phase 1: Search Focus):** A void-like screen with only a central magnifying glass icon and a subtle scroll indicator.
2.  **Search Active:** An overlay with a single, large input field and category tags (Manuscripts, Periodicals, Correspondence).
3.  **Landing (Phase 2: Recent Accessions):** The result of scrolling down—a secondary archival shelf for recent records, not the primary navigation model.
4.  **Article Detail:** A dedicated reading view for a single record. It should support SEO direct entry and keep the reader focused on the searched topic.

## 5. Technical Considerations

- **Dark/White Mode:** Support for both themes, defaulting to White.
- **Responsive:** Desktop should feel immersive, but MVP must remain usable on mobile.
- **Interactions:** Smooth vertical transitions and subtle hover effects on navigation elements.

---

## 6. 적용 기준

이 디자인은 MVP 공개 화면의 기준 시안으로 사용한다.

이 프로젝트의 화면은 기존 블로그처럼 여러 글을 계속 탐색하도록 만들지 않는다. 사용자는 사이트 검색 또는 Google 같은 검색 엔진을 통해 원하는 문서로 바로 들어오고, 해당 문서만 확인한 뒤 떠나는 흐름을 우선한다.

구현 시 Daisy UI를 사용할 수 있지만, Daisy UI의 기본적인 카드/버튼 장식이 디자인 콘셉트를 덮어쓰지 않도록 한다. Daisy UI는 입력, 버튼, 접근성 상태, 다크모드 같은 기본 UI 토대에 활용하고, 실제 시각 언어는 Library Archive 콘셉트에 맞춘다.

## 7. 화면별 역할

| 파일 | 역할 |
| --- | --- |
| `randing-phase1.html` | 랜딩 첫 화면. 중앙 검색 아이콘과 스크롤 유도만 노출하는 search-first 화면 |
| `randing-phase1-search-active.html` | 검색 활성 상태. 큰 검색 입력, 닫기 버튼, 카테고리 태그, 결과 preview |
| `randing-phase2-latest.html` | 스크롤 후 노출되는 보조 아카이브 색인. archival index card 스타일 |
| `post-detail.html` | 글 상세 화면 시안으로 관리할 파일 |

현재 확인된 `post-detail.html`의 실제 HTML은 `randing-phase2-latest.html`와 동일한 목록 화면 구조다. 글 상세 구현 전에 이 파일이 의도한 상세 화면 시안인지 다시 확인해야 한다.

## 8. MVP 반영 범위

MVP에서 반영할 디자인 요소:

- 랜딩은 `phase1 → phase2` 수직 스크롤 구조로 구성
- 첫 화면은 검색 중심으로 구성
- 검색은 제목, 본문, 태그, 시리즈를 통합해 조회하는 경험을 목표로 함
- 최신 글 목록은 `Recent Accessions` 스타일의 세로형 index card 목록으로 제공하되 보조 색인으로 취급
- 글 목록 항목은 날짜, reference code, 제목, 설명, 태그를 표시
- SEO로 게시글 상세에 직접 들어온 사용자는 해당 문서 내용에 집중
- 전체 톤은 흰색/검정/회색 중심의 archival palette 사용
- headline/body는 serif 중심, metadata/label은 sans-serif uppercase 중심
- 선, 여백, hover 변화는 얇고 절제된 방식 사용
- 다크모드는 선택 지원하되 기본은 white theme

MVP에서 보류할 디자인 요소:

- 실제 카테고리 검색 필터
- 시각적 그래프
- 관리자 화면
- 복잡한 애니메이션

## 9. 구현 시 주의점

- `randing` 파일명은 현재 시안 파일명을 그대로 따른다. 실제 라우트명은 `landing`이 아니라 `/` 홈 화면이다.
- Google Fonts와 Material Symbols는 시안에서 사용하지만, 실제 구현 전에는 외부 폰트 의존 방식과 성능 영향을 검토한다.
- 본문 최대 폭은 기존 문서의 720px 기준과 시안의 800px container 기준을 함께 검토한다. 글 상세 본문은 720px를 우선하고, 랜딩 목록 컨테이너는 최대 800px까지 허용한다.
- 모바일에서는 phase1의 검색 아이콘, phase2의 날짜/reference 영역, 목록 카드 간격이 깨지지 않도록 별도 확인한다.
- 글 상세 화면은 다른 문서를 과하게 추천하지 않는다. 백링크와 내부 링크는 문서 이해를 돕는 보조 정보로만 배치한다.
