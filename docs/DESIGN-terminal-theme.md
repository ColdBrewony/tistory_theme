# JB SKIN 167 — 터미널/CMD 콘솔 테마 전면 재설계 (Design Spec)

- 작성일: 2026-06-11
- 방향 전환: **기존 모던 리프레시(`DESIGN-modern-refresh.md`) 폐기.** 밝은 Bootstrap 룩을 버리고 **터미널/커맨드라인 콘솔 미감**으로 전 영역 재디자인.
- 해석: "hermes cmd 화면 느낌" = NousResearch **hermes-agent CLI**(다크 콘솔 + 골드 강조 + ASCII/프롬프트 미감)에서 따온 **다크 터미널 테마**.
- 결정 권한: 사용자가 은광에게 디자인 전권 위임("나한테 묻지 말고 은광이 판단"). 본 문서의 결정은 은광 판단.
- 기반 보존: 이전 작업의 **토큰 하이브리드 구조(custom.css :root → style.css var())와 버그 수정 B1~B5, keep-all, 포커스 링**은 그대로 활용. 토큰 값을 다크 콘솔로 재정의하고 영역 스타일을 입힌다.

## 1. 디자인 원칙
- 다크 **고정**(테마 토글 옵션 추가 안 함). 향후 라이트 복귀용 `html.jb-theme-light` 슬롯만 비워둠.
- **풀 모노스페이스** (D2Coding 한글 모노). 본문 포함 — 콘솔 진정성 우선.
- 콘솔 감은 **신호등 점·프롬프트(`$`/`▸`)·블링크 커서(`█`)·box-drawing(┌─┐)·상태바**로 표현. **과한 CRT 스캔라인·글리치는 생략**(AI 슬롭·가독성 저하 회피).
- 구조(skin.html) 보존: 티스토리 치환자/조건블록/`<s_t3>`/반복/JS 의존 불변. 시각은 CSS로만(+ html에 정적 클래스 1개).
- 접근성: 다크 배경 대비 WCAG AA 4.5:1. 순수 검정 회피(#282A36).

## 2. 팔레트 (Dracula 베이스 + Hermes 골드)

| 토큰(custom.css `:root`) | 값 | 용도 | 대비(on #282A36) |
|---|---|---|---|
| `--term-bg` / `--color-dark` | `#282A36` | 메인 콘솔 배경 | — |
| `--term-bg-elev` / `--color-dark-2` / `--color-bg-subtle` | `#21222C` | 타이틀바·상태바·코드·입력 배경 | — |
| `--term-selection` | `#44475A` | hover/선택 행 배경 | — |
| `--color-ink` / `--term-fg` | `#F8F8F2` | 기본 텍스트 | ~13:1 ✓ |
| `--color-ink-2` / `--term-fg-dim` | `#BFC7D5` | 보조 텍스트 | ~8:1 ✓ |
| `--color-muted` | `#9CA3B4` | 흐린 메타(날짜 등) | ~5:1 ✓ |
| `--color-border` / `--term-line` | `#44475A` | 창·박스 테두리/구분선 | — |
| `--color-border-strong` | `#6272A4` | 입력창·강조 경계 | — |
| `--color-accent` / `--term-gold` | `#FFB86C` | **주강조**(링크·프롬프트 강조·active) Hermes 골드/앰버 | ~9:1 ✓ |
| `--color-accent-hover` | `#FFCB8E` | 링크 hover | ✓ |
| `--term-green` / `--term-prompt` | `#50FA7B` | 프롬프트 기호($,▸)·성공 | ~11:1 ✓ |
| `--term-cyan` | `#8BE9FD` | 보조 링크/코드 토큰 | ~12:1 ✓ |
| `--term-red` | `#FF5555` | 신호등 닫기·에러 | ✓ |
| `--term-yellow` | `#F1FA8C` | 신호등 최소화·경고 | ✓ |

**폰트 토큰**
- `--font-mono: "D2Coding", "JetBrains Mono", "Cascadia Code", "Nanum Gothic Coding", Consolas, monospace;`
- CDN: D2Coding `https://cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-full.css`, JetBrains Mono `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap`

**모션**
- `--term-blink`: 블링크 커서 `@keyframes`(1s step-end, opacity 1↔0).

## 3. 영역 → 터미널 메타포 (민혁 매핑 채택)

| 영역 | 메타포 | 구체 스타일 |
|---|---|---|
| Header (`.jb-background-header`) | **터미널 창 타이틀바** | 좌상단 신호등 3점(red/yellow/green) `::before`, 블로그명 앞 프롬프트 `guest@blog:~$ ` (green), 창 테두리 1px `--term-line` |
| Nav (`.jb-navigation-*`) | **명령 탭 / `cd`** | 카테고리 `$ cd {name}`, active 항목 `▸`+골드+블링크 `█`, hover 골드 |
| Search input | **프롬프트 입력** | 배경 `--term-bg-elev`, 좌측 `$` green, 골드 캐럿, placeholder `grep ...` |
| 글목록 (`.jb-index-*`) | **`ls` / 로그 라인** | 항목 프리픽스 `▸`(green), 제목 fg, 메타 muted 모노 컬럼, hover 행 `--term-selection`, 썸네일형은 box-drawing `┌─┐` 프레임 |
| 본문 (`.jb-article`) | **man / 코드뷰** | 제목 `## ` 프리픽스, `pre/code` `--term-bg-elev`+green 보더, 인용 좌측 `▌` 골드 바 |
| Sidebar (`.jb-column-sidebar`, `.jb-module-title`) | **side 패널 / `tree`** | 모듈 제목 `▶ MODULE`(골드), 카테고리 tree `├─ └─` 들여쓰기 |
| Footer 모듈 (`.jb-background-footer`) | **로그 패널** | 최근글/댓글 `[YYYY-MM-DD] title` 로그 라인 |
| Foot (`.jb-copyright`,`.jb-designed`) | **상태바(statusline)** | 단색 바 `--term-bg-elev`: 좌 `-- NORMAL --`(골드), 중 copyright, 우 `ln 1, col 1` |
| Top 버튼 (`.jb-top`) | **스크롤** | `^` 글리프, 다크 톤 |

## 4. 구현 분해 (창섭, 순차 — 대부분 같은 style.css)

> 공통 금지: 치환자/조건블록/`<s_t3>`/반복/JS 의존 구조·index.xml 옵션 컨트랙트 변경 금지. `_backup-2026-06-11/` 보존. 의존성 추가는 은광 승인됨(아래 폰트 CDN 한정).

- **TASK-T1 (custom.css `:root`)**: §2 팔레트·폰트·모션 토큰 전체 정의/재정의. 기존 `.jb-blog-information-description` 유지. **html,body 다크 배경/전경/모노폰트 기본 규칙도 custom.css에 추가**(FOUC·visibility 무관하게 항상 다크: `html{background:var(--term-bg);color:var(--color-ink)} body{background:var(--term-bg);font-family:var(--font-mono)}`).
- **TASK-T2 (style.css 폰트 토큰화)**: 7~103·143~154·235행 등 하드코딩 폰트패밀리 → `var(--font-mono)`. `word-break:keep-all`(143) 유지. 의존: T1.
- **TASK-T3 (style.css 하드코딩 HEX 토큰화 — 최대 작업)**: 158개 HEX를 **문맥별** 토큰 치환(텍스트색 vs 배경색 구분, 기계적 일괄치환 금지). `#ffffff`→문맥상 `--color-ink`/`--term-bg-elev`, `#333/#444/#666`→`--term-fg-dim`/`--color-border`/`--term-bg-elev` 등. 에디터 파스텔 콜아웃(`#FFFDE7` 등)은 다크 반투명+밝은 텍스트로 재매핑. 의존: T1 (T2와 같은 파일이라 T2→T3 순차).
- **TASK-T4 (style.css 영역 메타포)**: §3 전 영역 스타일. 신호등/프롬프트/캐럿/`ls`프리픽스/man·코드뷰/tree/상태바. box-drawing·프롬프트는 **가상요소(::before/::after)로만**, table/float 구조 불변. 창 테두리는 `.jb-container-*`/`.jb-background-*` 단일 래퍼에만(셀 이중선 방지). 블링크 커서 `@keyframes`. 의존: T1~T3.
- **TASK-T5 (skin.html 최소 패치)**: html 클래스(6~27행)에 정적 `jb-theme-terminal` 추가. `<head>`(35행 부근)에 D2Coding·JetBrains Mono CDN `<link>` 추가. 페이지네이션 화살표(≈1300/1304)·맨위로(≈1637) `<i class=xi-*>`→유니코드(`‹ › ^`)로 교체(그 외 xeicon 유지). **그 외 구조 무수정.**
- **TASK-T6 (style.css 다크 누락영역 마감)**: 페이지네이션·검색·방명록·관리자메뉴·태그·각주·nivo 컨트롤·AdSense 격리(흰 iframe은 `--term-bg-elev` 카드+패딩+보더로 시각 격리). R-e 체크리스트 전수 검증. 의존: T3·T4.
- **TASK-P1 (preview 빌더 보강)**: build-preview.mjs/dummy-data.json —
  1) 오버라이드에 `html,body` 다크 강제 + html 루트 `jb-theme-terminal` 클래스 주입
  2) dummy `category_list`/`blog_menu` 채워 내비 항목 + active 1개
  3) `s_paging` 전개해 활성 페이지네이션(현재페이지 1개) 렌더
  4) 썸네일형: picsum 더미 직접 주입, 일부 항목 no-image로 두 상태 노출
  5) `s_sidebar` 전체 제거 대신 대표 모듈 1개(블로그정보 또는 카테고리 tree) 노출

## 5. 검증 기준 (완료 정의)
- [ ] `node preview/build-preview.mjs` exit 0, 잔여 `[##_`/`<s_` 0
- [ ] Edge 헤드리스 렌더 스샷에서 **다크 콘솔 테마** 확인: 다크 배경, 모노폰트, 신호등 타이틀바, 프롬프트, 골드 강조, 내비 항목/active, 활성 페이지네이션, 썸네일, 상태바 푸터
- [ ] 흰 배경/검정 텍스트 잔재 0 (하드코딩 HEX 누락 없음)
- [ ] 본문 한글 모노 가독성 OK, keep-all 유지, 포커스 링 보임
- [ ] 텍스트/강조 대비 WCAG AA 통과
- [ ] 치환자/옵션 컨트랙트 보존, 성재 리뷰 통과

## 6. 범위 밖(향후)
- CRT 스캔라인/글리치 토글 옵션, ASCII 배너 헤더 옵션
- jQuery/nivo/xeicon 의존성 교체
- 라이트 테마(`jb-theme-light`) 실제 구현
