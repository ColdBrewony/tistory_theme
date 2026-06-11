# 코드 리뷰 — 모던 리프레시 (TASK-REVIEW)

- 리뷰어: 성재 (QA·리뷰어, 읽기 전용)
- 일자: 2026-06-11
- 대상: `images/custom.css`, `style.css`, `skin.html`, `index.xml`, `preview/**`
- 비교 기준: `_backup-2026-06-11/` 원본 diff
- 명세: `docs/DESIGN-modern-refresh.md`, `docs/AUDIT.md`

## 결론: **Approve** (머지 가능)

발견 사항: **P0 0 / P1 0 / P2 0 / P3 2**. 명세 일치·치환자 보존·버그 수정 모두 충족. 후속(P3)은 머지 차단 사유 아님.

---

## 1. 명세 일치 (DESIGN 섹션 3 토큰표)

**OK.** DESIGN 섹션 3의 모든 토큰이 `custom.css :root`에 정확히 정의됨.

| 토큰 | 명세값 | custom.css | 결과 |
|------|--------|-----------|------|
| `--color-ink` | #1A1A1A | #1A1A1A (custom.css:7) | OK |
| `--color-ink-2` | #4B5563 | #4B5563 (custom.css:8) | OK |
| `--color-muted` | #6B7280 | #6B7280 (custom.css:9) | OK |
| `--color-accent` | #2563EB | #2563EB (custom.css:10) | OK |
| `--color-accent-hover` | #1D4ED8 | #1D4ED8 (custom.css:11) | OK |
| `--color-border` | #E5E7EB | #E5E7EB (custom.css:12) | OK |
| `--color-border-strong` | #D1D5DB | #D1D5DB (custom.css:13) | OK (정의됨, 미사용 — 무해) |
| `--color-bg-subtle` | #F9FAFB | #F9FAFB (custom.css:14) | OK |
| `--color-dark` / `-2` | #111827 / #1F2937 | #111827 / #1F2937 (custom.css:15-16) | OK |
| `--radius-sm/md/lg` | 6/8/12px | 6/8/12px (custom.css:19-21) | OK |
| `--shadow-1` | 명세 동일 | 동일 (custom.css:22) | OK |

- 타이포: body line-height 1.8→1.7, 제목 1.5→1.3 (style.css:143-144) — 명세 일치.
- 레이아웃: 콘텐츠 여백 20/30→24/40 (style.css:214,219), 글목록 간격 20/30→28/40 (style.css:1139,1160), 헤더 타이틀 40→28 (style.css:566) — 명세 일치.
- **CSS 유효성: style.css가 참조하는 14개 `var()` 토큰 전부 `:root`에 정의됨. 미정의 참조 0건.** (referenced ⊆ defined 확인)
- CSS 로드 순서: skin.html에서 custom.css(:38) → style.css(:43) 순. 토큰 정의가 소비보다 먼저 → 해석 보장.

## 2. 회귀 위험 (외과 치환 검증)

**위험 없음.** `_backup` 대비 style.css diff 전수 검토 결과, 변경은 전부 하드코딩 hex/값을 `var(--token)` 또는 명세값으로 치환한 것뿐. 닫는 괄호/세미콜론 누락, var 오타, 셀렉터 손상 없음.
- `#dadada`(경계) 다수 → `var(--color-border)` 일괄, 누락 없음.
- `#337ab7`/`#23527c`(구 Bootstrap 파랑) 잔재 **0건** (grep 확인).
- 구 저대비 회색 `#cccccc/#999999/#868686` 잔재 **0건**.
- 남은 `transparent`는 전부 정당(background-color / border-color / -webkit-tap-highlight). `color:transparent` 핵은 제거됨(주석만 잔존, style.css:250).

## 3. 🔴 B1~B5 수정 확인 (전부 수정됨)

| # | 항목 | 확인 | 결과 |
|---|------|------|------|
| B1 | 중복 `jbAdSenseMainBottom` | skin.html:104 중복줄 1줄 삭제, 선언 1개만 잔존 (diff 확인) | **수정** |
| B2 | jbfactory 소유확인 메타 | google/naver site-verification 2건 **전부 삭제** (skin.html:32-33). 본인 토큰 미보유 → 교체 없이 삭제(명세 허용) | **수정** |
| B3 | word-break | `break-all` → `keep-all; overflow-wrap:anywhere` (style.css:143). break-all 잔재 0건 | **수정** |
| B4 | 포커스 | `outline:none` 3곳 제거, `:focus-visible` 링 도입(a/button/input/textarea/select/[tabindex], style.css:204). `:focus{outline:none}` 잔재 0건 | **수정** |
| B5 | 대비 | 날짜/보조 `#ccc/#999` → `var(--color-muted)`(#6B7280, AA통과) 통일 (style.css:186,327,332,1646 등) | **수정** |

## 4. 치환자 보존 (P0급) — **OK (위반 없음)**

skin.html 원본 vs 현재 토큰 카운트 일치:
- `[##_..._##]`: 347 = 347
- `<s_if_var_...>`: 53 = 53
- `<s_t3>`: 1 = 1

치환자/조건/반복 블록 전부 원형 보존. 추가된 것은 `rel="noopener noreferrer"`, `loading="lazy"`, `<link rel=preconnect>` 속성/태그뿐(치환자 무손상).

## 5. 접근성

- `:focus-visible` 링: 인터랙티브 요소 + `[tabindex]` 포괄 (style.css:204). 적절.
- `rel="noopener noreferrer"`: 모든 `target="_blank"` 외부 SNS/디자이너 링크에 적용 (skin.html SNS×2그룹 + JB FACTORY). 누락 없음.
- `loading="lazy"`: 커버/글목록/관련글 썸네일 + 블로그정보 이미지에 적용. 장식 placeholder는 미적용 의도 유지(과제 부합).

## 6. 프리뷰 하니스 안전성 — **OK**

- **원본 오염 0**: `build-preview.mjs`는 `skin.html`을 read만(L36), 출력은 `preview/index.html`(L33). 실행 전후 skin.html md5 **동일**(d5c518... 불변) — 검증 완료.
- **외부 의존성 0**: node 내장 fs/path/url + 정규식만. `node preview/build-preview.mjs` 정상 실행(node v20).
- **잔여 치환자/JS 오류 0**: 빌드 자가점검 — 잔여 `[##_` 0, 잔여 `<s_` 0, 잔여 `document.write` 0. 인라인 `<script>` 전부 제거(L63)로 숫자형 치환자 미치환에 의한 JS 구문오류 원천 차단.
- 산출물: `../images/custom.css`, `../style.css` 경로 보정 정상, 썸네일 picsum 더미 치환. dummy-data.json 유효 JSON.

## 7. P3 (후속 가능 — 머지 차단 아님)

- **P3-1** 기본 글목록 썸네일형(DESIGN 4-4 / 8) 미적용: `<liststyle>`은 티스토리 관리자 측 선택 항목으로 XML `<default>` 슬롯이 없어 기본값 강제 불가. 명세도 "배선 확인 후 적용"으로 단서. 대신 썸네일 라운드(style.css:1140-1142,1253,1257)를 선반영해 타입 선택 시 모던하게 보이도록 처리. **합리적 deferral**. DESIGN 체크리스트의 해당 항목만 "구조상 불가—후속"으로 표기 권장.
- **P3-2** `--color-border-strong` 정의되었으나 미참조(custom.css:13). 무해. 향후 구분선 강조 시 사용 또는 정리.

## 권고

- **머지 전 필수 수정: 없음.** Approve.
- 후속: P3-1(글목록 기본 타입)은 DESIGN 8 체크리스트에 "구조 제약—후속" 명시. P3-2는 차후 정리.
- 시각 검증(현식)은 별건으로 진행 — 본 리뷰는 코드/명세/안전성 게이트 통과 판정.

---
---

# 코드 리뷰 — 터미널/CMD 콘솔 테마 전면 재구현 (TASK-REVIEW-2)

- 리뷰어: 성재 (QA·리뷰어, 읽기 전용)
- 일자: 2026-06-11
- 대상: `images/custom.css`, `style.css`, `skin.html`, `preview/build-preview.mjs`, `preview/dummy-data.json`, `preview/index.html`
- 비교 기준: `_backup-2026-06-11/` 원본 diff
- 명세: `docs/DESIGN-terminal-theme.md` (§2 팔레트/토큰, §3 영역 메타포, §4 T1~T6/P1, §5 검증기준)

## 결론: **Approve** (머지 가능)

발견: **P0 0 / P1 0 / P2 0 / P3 3**. 다크 전환 완전·일괄치환 회귀 없음·var 무결성 100%·치환자 보존 100%·대비 AA 통과·프리뷰 원본 무오염. P3는 머지 차단 사유 아님.

---

## 1. 다크 전환 완전성 (P1 점검) — **OK**

- style.css 잔존 하드코딩 HEX **5개뿐**, 전부 **의도**(에디터 콜아웃 확장 팔레트 — 토큰 미정의 색상):
  - `#FF79C6`(pink, :456) / `#BD93F9`(purple, :457) / `#6272A4`(indigo, :458) / `#8BE9C0`(teal, :461) / `#BFA58A`(brown, :467). 전부 `border-color`로만 쓰이고 배경은 동색 저알파 rgba, 텍스트는 본문 ink 상속. 흰 배경 잔재 **0**.
- `background(-color):#` 리터럴 HEX **0건**, `background:var(--color-ink)`(near-white bg) **0건** — 흰 배경 누락 없음.
- 명명색: `color:red` 2건(style.css:1020-1021 캘린더 주말)뿐 → 터미널 테마 오버라이드(:1878-1879, `--term-red`)가 우선 적용. 누락 아님.
- `color:transparent` 핵 **0건**(주석만 :250). `transparent` 잔여는 전부 정당(버튼 bg/탭하이라이트/border-color).
- `html,body` 다크 기본(FOUC 방지)이 custom.css:60-68에 정의됨(`background/color/font-family`). style.css보다 먼저 로드 → 보장.

## 2. 일괄치환 회귀 (P0/P1 점검) — **OK (의미역전 0)**

창섭 보고(`background-color`가 `color` 패턴에 부분매칭되어 5곳 오염 후 수정) 재검 — **추가 오염 없음**:
- `color:var(--배경토큰)` 진짜 텍스트색 케이스: style.css:273·480·1841·1852·1873 — 전부 **의도**(밝은 강조버튼 위 다크 텍스트 = 각주칩/활성페이지네이션/제출버튼). 역전 아님.
- `background:var(--텍스트토큰)`: 0건. (`bg:var(--color-muted)` 1건 style.css:1022는 "글 있는 날" 셀 배경 마커 — 텍스트 아님, 정당. 터미널 오버라이드 :1880서 `--term-selection`로 재매핑.)
- 깨진 값/괄호/세미콜론: 중괄호 balance style.css 1148/1148·custom.css 7/7, 빈 `var()`·빈 `:;` 선언 0.

## 3. var 무결성 (P1 점검) — **OK (미정의 참조 0)**

style.css가 참조하는 27개 var(--…), custom.css 참조 3개 — **전부** custom.css `:root`에 정의됨(referenced ⊆ defined). `--term-fg`/`--term-fg-dim`은 정의됐으나 미참조(무해, P3).

## 4. 명세 일치 — **OK**

- §2 팔레트 14색 + 폰트/모션/형태 토큰 전부 custom.css에 명세 HEX 정확히 일치(custom.css:8-48).
- §3 영역 메타포 전 항목 셀렉터 확인됨:
  - 신호등 3점(style.css:1678-1687, box-shadow로 yellow/green) · 프롬프트 `guest@blog:~$`(1690) · nav `$ cd`+active `▸`+블링크 `█`(1703-1722) · 검색 프롬프트 캐럿(1724-1739) · `ls` 프리픽스 `▸`(1746) · man `## `(1760-1762) · 인용 `▌`(1765) · sidebar `▶ MODULE`+tree `├─└─`(1773-1791) · 상태바 `-- NORMAL --`/`ln 1, col 1`(1804-1813) · top `^`(1816).
- 블링크 `@keyframes blink`(custom.css:52-55) 정의, animation 토큰 `--term-blink`로 active 캐럿 연결.

## 5. 치환자 보존 (P0 점검) — **OK (위반 0)**

backup vs current skin.html 카운트 완전 일치:
- `[##_..._##]`: 347 = 347
- `<s_if_var_...>`: 53 = 53
- `<s_t3>`: 1 = 1
- 전체 `<s_*>` 여는태그: 187 = 187

skin.html diff(T5)는 명세 그대로: html에 `jb-theme-terminal`(:7) 추가, head에 D2Coding·JetBrains Mono CDN + preconnect(:35-40), **글리프 교체 정확히 3곳**(페이지네이션 `xi-angle-left/right-min`→`‹`/`›` :1305/1309, top `xi-arrow-up`→`^` :1642). 그 외 `xi-*` 아이콘·구조 무수정(나머지 변경은 이전 과제의 `rel=noopener`/`loading=lazy` 캐리오버).

## 6. 접근성 / 대비 — **OK (AA 통과)**

다크 배경 #282A36 기준 WCAG 계산(custom.css 정의값):
- ink #F8F8F2 **13.36:1**, ink-2 #BFC7D5 **8.37:1**, muted #9CA3B4 **5.64:1**, gold **8.36:1**, green **10.38:1**, cyan **10.29:1**, yellow **12.74:1**, red **4.53:1** — 전부 AA(≥4.5) 통과.
- 다크텍스트 on 골드버튼 **8.36:1** OK. ink-2 on selection(#44475A) **5.38:1** OK.
- 포커스 링: `:focus-visible` 2px 골드 outline(style.css:204), `outline:none` 회귀 0 — 유지.

## 7. 프리뷰 보강 (P1 점검) — **OK**

- P1 5개 전부 반영(build-preview.mjs): (a) 다크강제+`jb-theme-terminal` 주입 :207-219, (b) nav category_list/blog_menu+active `current` :138-155, (c) `s_paging` 전개 활성 페이지네이션(2번 `jb-active`) :157-173, (d) 썸네일 picsum 더미+매3번째 no-image :182-193, (e) sidebar 대표 모듈(CATEGORY tree) :59-79.
- **원본 무오염**: skin.html `readFileSync`만(:36), 출력은 `preview/index.html`만(:33,232). 실행 전후 skin.html md5 **불변**(`c235742e...` 동일). 빌드 exit 0, 잔여 `[##_` 0·`<s_` 0·`document.write` 0(자가점검 로그 확인). dummy-data.json 유효 JSON.

## 8. P3 (후속 가능 — 머지 차단 아님)

- **P3-1** 인덱스 행 hover 시 메타(`--color-muted` #9CA3B4)가 hover 배경(`--term-selection` #44475A) 위에 놓이면 **3.62:1**(AA-large만, 본문 AA 미달). hover 한정 일시 상태·보조정보라 무해하나, 메타도 hover 시 `--color-ink-2`로 올리면 AA 충족(style.css:1751/1753).
- **P3-2** `--term-fg`/`--term-fg-dim` 정의됐으나 미참조(custom.css:17,19). 호환 별칭 — 무해, 차후 정리.
- **P3-3** `.jb-theme-terminal { }`(style.css:1657-1660) 빈 규칙(주석만). 유효 CSS, 무해. 정리 권장.

## 권고

- **머지 전 필수 수정: 없음.** Approve.
- 후속: P3-1(hover 메타 대비)만 다음 패스에서 한 줄 보강 권장. P3-2/P3-3은 정리성.
- 시각 검증(현식 Edge 헤드리스 스샷, §5 체크리스트)은 별건 — 본 리뷰는 코드/명세/안전성/대비 게이트 통과 판정.
