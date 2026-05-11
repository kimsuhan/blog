# Gemini CLI Mandates - Library Archive

이 프로젝트에서 Gemini CLI는 **디자인 및 프런트엔드 스타일링**에만 집중합니다. 기능 구현(Functional Implementation)은 수행하지 않습니다.

## 1. 역할 및 범위 (Scope)

- **디자인 시스템 유지:** `docs/design/design-concept.md`에 정의된 "Library Archive" 콘셉트를 모든 UI 작업의 최우선 기준으로 삼습니다.
- **스타일링:** Tailwind CSS v4 및 Daisy UI v5를 활용한 CSS 작업, 레이아웃 조정, 타이포그래피 미세 조정을 수행합니다.
- **Astro 컴포넌트:** UI 구조(HTML/Markup)와 스타일링 위주로 작업하며, 복잡한 비즈니스 로직이나 백엔드 연동은 제외합니다.
- **UI/UX 개선:** 시안(`docs/design/*.html`)을 바탕으로 실제 웹 환경에서의 시각적 완성도를 높이는 작업을 수행합니다.

## 2. 제외 사항 (Exclusions)

- **백엔드 로직:** Drizzle ORM, 데이터베이스 스키마 변경, API 서버 로직 구현 등은 수행하지 않습니다.
- **기능 구현:** 검색 엔진 로직, 인증 시스템, 데이터 처리 로직 등 시스템의 기능적 핵심 구현은 사용자에게 위임하거나 설계 조언만 제공합니다.

## 3. 작업 원칙

- 모든 변경 사항은 "도서관 아카이브"의 정숙하고 미니멀한 미학을 해치지 않아야 합니다.
- 기능적인 코드가 필요한 경우, 스타일 확인을 위한 최소한의 모킹(Mocking)만 수행합니다.
