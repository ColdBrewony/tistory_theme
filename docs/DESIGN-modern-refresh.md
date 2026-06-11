# JB SKIN 167 — 모던 리프레시 설계 (Design Spec)

- 작성일: 2026-06-11
- 선행 문서: `AUDIT.md`
- 목표: 구조·옵션 체계·티스토리 치환자는 보존하고, **디자인 토큰 + 적극적 레이아웃 개편 + 명백한 버그/접근성 수정**으로 스킨을 현대화한다. 로컬에서 미리 확인 가능한 정적 프리뷰 하니스를 함께 구축한다.

## 1. 원칙 (보존 / 변경 경계)

**보존(건드리지 않음)**
- 모든 티스토리 치환자 `[##_..._##]`, 조건 블록 `<s_if_var_...>`, `<s_t3>` 등
- `index.xml`의 옵션 항목 전체(헤더 7·내비 5·사이드바 5·폰트 5·리스트 8종) — 항목은 그대로, **기본값(default)만 일부 변경**
- 기능 일체(AdSense/nivo 슬라이더/TOC/SNS) — 삭제·의존성 교체 없음

**변경**
- `style.css` — 디자인 토큰 값 외과적 교체(색·폰트크기·라운드·그림자·포커스·간격)
- `skin.html` — 버그/접근성 한정 수정(중복 변수, 남의 토큰, noopener, preconnect, lazy)
- `index.xml` — 기본값 일부 변경(본문폭, 기본 글목록 타입, 기본 폰트크기)
- `images/custom.css` — 토큰 변수(`:root`) 정의 + style.css로 깔끔히 안 되는 보조 오버라이드(기존 줄바꿈 커스텀 유지)

## 2. 구현 접근 (3안 비교)

| 안 | 방식 | 장점 | 단점 |
|----|------|------|------|
| A. custom.css 오버레이만 | 새 스타일 전부 custom.css 오버라이드 | 되돌리기 쉬움, style.css 무손상 | 명시도(specificity) 전쟁, 일부 불가, 지저분 |
| B. style.css 직접 수정 | 토큰을 제자리에서 교체 | 깔끔, 완전한 제어 | 벤더 업데이트 재적용 어려움(사용자 소유 사본이라 영향 적음) |
| **C. 하이브리드 (채택)** | 토큰 변수는 custom.css `:root`, 실제 값은 style.css의 하드코딩 hex를 변수 참조로 외과 치환, 버그는 skin.html, 기본값은 index.xml | 토큰 1곳 관리 + 깔끔 + 추적 용이 | 초기 매핑 작업량 |

**채택: C.** `custom.css`에 `:root` 디자인 토큰을 정의하고, `style.css`의 핵심 하드코딩 값(색/라운드/그림자 등)을 `var(--token)` 참조로 외과 치환한다. 향후 톤 변경이 토큰 한 곳에서 가능.

## 3. 디자인 토큰 (현재 → 제안)

### 색상
| 토큰 | 현재 | 제안 | 비고 |
|------|------|------|------|
| `--color-ink` 본문 | `#222222` | `#1A1A1A` | 미세조정 |
| `--color-ink-2` 보조 | `#666` | `#4B5563` | 위계용 |
| `--color-muted` 흐린텍스트 | `#999/#868686/#ccc` 난립 | `#6B7280` | AA 통과(≈4.8:1)로 통일 |
| `--color-accent` 포인트 | `#337ab7` | `#2563EB` | hover `#1D4ED8` |
| `--color-border` 경계 | `#dadada` | `#E5E7EB` | 부드럽게 |
| `--color-border-strong` | `#dadada` | `#D1D5DB` | 구분 필요 시 |
| `--color-bg-subtle` 연배경 | `#fafafa` | `#F9FAFB` | |
| `--color-dark` 다크영역 | `#424242/#222/#212121` | `#111827`(주)/`#1F2937`(보조) | 모던 그레이스케일 |

### 타이포그래피
| 토큰 | 현재 | 제안 |
|------|------|------|
| 기본 폰트(body) | 14px | **16px** (index.xml default) |
| 본문 폰트(article) | 14px | **17px** (index.xml default) |
| 본문 line-height | 1.8 | **1.7** |
| 제목 line-height | 1.5 | **1.3** |
| `word-break` | `break-all` | **`keep-all`** + `overflow-wrap:anywhere` |

### 형태 (라운드 / 그림자 / 포커스)
| 토큰 | 현재 | 제안 |
|------|------|------|
| `--radius-sm` 칩/태그 | 0 | 6px |
| `--radius-md` 버튼/입력 | 3px / 0 | 8px |
| `--radius-lg` 카드/썸네일 | 0 | 12px |
| `--shadow-1` 카드/드롭다운 | none | `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` (1단계, 절제) |
| `:focus-visible` | 없음(outline:none) | `outline:2px solid var(--color-accent); outline-offset:2px` |
| transition | `all .2s` | `color/background/border-color .15s ease` (속성 한정) |

### 레이아웃 (적극)
| 항목 | 현재 | 제안 | 위치 |
|------|------|------|------|
| 본문 폭 | 630 | **720** | index.xml:129 default |
| 사이드바 폭 | 300 | 300 (유지) | index.xml:139 |
| 기본 글목록 타입 | type-01(텍스트만) | **썸네일형(type-02/03)** | index.xml liststyle default — 배선 확인 후 적용 |
| 글목록 항목 간격 | 20/30px | 28/40px | style.css |
| 콘텐츠 세로 여백 | 20→30px | 24→40px | style.css:213,219 |

## 4. 파일별 변경 계획

### 4-1. `images/custom.css` (토큰 정의 + 보존)
- `:root { --color-*, --radius-*, --shadow-1, ... }` 디자인 토큰 블록 추가
- 기존 `.jb-blog-information-description` 줄바꿈 커스텀 **유지**
- style.css로 깔끔히 안 되는 보조 오버라이드만 최소 추가

### 4-2. `style.css` (외과적 토큰 치환)
- 색상 하드코딩 hex → `var(--color-*)` (전역 검색 후 치환, 영역별 검증)
- `word-break:break-all` → `keep-all` + `overflow-wrap`
- 버튼/입력/카드/썸네일/태그/페이지네이션 `border-radius` 토큰화
- 카드/드롭다운 `box-shadow` 1단계 도입(과한 그림자 금지)
- `outline:none` → `:focus-visible` 링
- 폰트 크기/행간/제목 여백/글목록 간격/내비 active state
- 태그 `color:transparent` 핵 제거 → 정상 표시
- 헤더 타이틀 여백 40→28px, Type04 text-shadow 절제

### 4-3. `skin.html` (버그/접근성 한정)
- 104행 중복 `jbAdSenseMainBottom` 삭제
- 32-33행 jbfactory 소유확인 토큰 삭제
- `<head>`에 `<link rel="preconnect" href="https://cdn.jsdelivr.net">` 추가(CDN SPOF 완화)
- `target="_blank"` 링크에 `rel="noopener noreferrer"`
- 본문/썸네일 이미지에 `loading="lazy"` (장식 placeholder 제외)
- AdSense `document.write`/로더 중복은 **이번 회차 미변경**(옵션 OFF, 위험)

### 4-4. `index.xml` (기본값)
- `jb-layout-width-content` default 630 → 720
- `jb-font-size-body` default 14 → 16, `jb-font-size-article` 14 → 17
- 기본 글목록 타입 썸네일형 — 배선 구조 확인 후 default 변경

## 5. 로컬 프리뷰 하니스 (`preview/`)

오프라인 정적 치환기. **스킨 원본은 수정하지 않고** `preview/` 산출물만 생성.

- `preview/dummy-data.json` — 치환자→더미값 매핑(title, page_title, 글 N개, 옵션값 등)
- `preview/build-preview.mjs` — Node 스크립트:
  1. `skin.html` 복사 → 값 치환자 `[##_..._##]`를 더미값으로
  2. 반복 블록(`<s_..._rep>` 등)을 더미 항목 N개로 펼침
  3. 조건 블록(`<s_if_var_X>`)은 표시 분기만 남기고 제거, `<s_t3>` 등 컨테이너 태그 제거
  4. 인라인 JS의 숫자형 치환자도 더미로 치환해 구문오류 방지
  5. 결과를 `preview/index.html`로 출력 (상대경로 `./images/`, `./style.css`는 `../`로 보정 or 복사)
- 목표: "레이아웃·스타일 검증에 필요한 치환자/조건/반복"만 우선 지원하는 실용 수준(완벽 렌더 아님)
- 검증: 브라우저로 `preview/index.html` 열어 before/after 비교

## 6. 작업 영역 / 충돌 방지

| 파일 | 담당 | 비고 |
|------|------|------|
| `images/custom.css`, `style.css`, `skin.html`, `index.xml` | 창섭(구현) — 순차 | 토큰 정의→style.css 치환 순서 의존, 단일 담당 |
| `preview/**` | 창섭(구현) | 독립, 병렬 가능 |
| 시각 검증/토큰 미세조정 | 현식(검토) | 프리뷰 산출 후 |
| 코드 리뷰/QA | 성재(검증) | Phase 4 |

브랜치: 사용자 폴더가 git repo가 아닐 수 있음 → 확인 후, repo면 `feature/skin-modern-refresh`, 아니면 작업 전 백업 사본(`skin.html.bak` 등) 생성.

## 7. 범위 밖 (향후 과제)
- jQuery 3.5.1 → 4.x 이전, nivo → Swiper/Splide 교체
- xeicon → SVG 아이콘(Lucide 등) 또는 셀프호스팅
- AdSense `document.write`/로더 중복 → 표준 비동기 1회 로드로 리팩토링
- `display:table`/`float` → Flex/Grid 전면 전환

## 8. 검증 기준 (완료 정의)
- [ ] `preview/index.html`이 브라우저에서 깨지지 않고 열림(JS 구문오류 0)
- [ ] before/after 시각 비교에서 토큰(색·라운드·폰트·간격) 반영 확인
- [ ] 🔴 버그 5건(B1~B5) 모두 수정
- [ ] 키보드 Tab 시 포커스 링 보임
- [ ] 본문이 한글에서 keep-all로 자연스럽게 줄바꿈
- [ ] 티스토리 치환자/조건 블록 원형 보존(치환은 preview 사본에서만)
- [ ] 성재 코드 리뷰 통과
