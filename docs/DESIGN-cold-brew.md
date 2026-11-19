# ColdBrewony 4.0 — 콜드브루 리디자인

- 작성일: 2026-11-19
- 이전 터미널 테마(`DESIGN-terminal-theme.md`)와 JB SKIN 기반 구조를 대체한다. 스킨을 처음부터 다시 작성했다.

## 컨셉
GitHub 프로필(github.com/ColdBrewony)의 태그라인 **"Brewed slowly, shipped daily."** 와 팔레트(coffee · cream · caramel · ice)를 그대로 따른다.
기본 소개 문구는 "Backend Developer · Brewed slowly, shipped daily.", 푸터는 "천천히, 그러나 꾸준히 커밋합니다."

| | 밝게 (cream) | 어둡게 (coffee) |
|---|---|---|
| 배경 | `#F4EDE3` | `#140E0A` |
| 글자 | `#2A1A12` coffee-900 | `#EFE3D3` |
| 보조 글자 | `#4B2E1E` coffee-700 | `#E8D8C3` cream |
| 강조 (기본: 캐러멜) | `#8A5A2E` | `#C8A27C` |
| 강조 (아이스 블루) | `#46657F` | `#8FB3CC` |

강조 색 4종(캐러멜 · 아이스 블루 · 말차 · 커피 체리)은 스킨 설정에서 고른다. 밝은 배경 값은 글자 대비 4.5:1 이상이 되도록 프로필 색보다 진하게 조정했다.

- 글꼴: 본문 Pretendard, 워드마크·숫자 Fraunces, 메타·코드 JetBrains Mono(터미널 테마의 흔적)
- 테마: 기기 설정 → 스킨 기본값 → 방문자 선택(localStorage) 순으로 우선

## 구성
- 헤더: 유리잔 마크 + 블로그 이름, 메뉴, 검색, 테마 전환. 900px 아래에서는 서랍 메뉴(검색 · 메뉴 · 카테고리)
- 홈: 블로그 소개(첫 페이지에서만), 첫 글을 크게, 나머지는 제목 · 요약 · 썸네일 목록
- 커버: `cb-cover-featured`(카드 그리드), `cb-cover-list`(순위 목록)
- 본문: 목차 자동 생성(소제목 3개 이상), 읽는 시간, 읽기 진행 막대, 표 가로 스크롤, 티스토리 에디터 요소(인용 스타일, 링크 미리보기, 더보기, 구분선) 스타일
- 사이드바: 프로필 · 카테고리 · 많이 읽은 글 · 최근 글 · 최근 댓글 · 공지 · 태그 · 보관함 · 링크 · 방문자 · 달력. 1080px 아래에서는 본문 아래로 내려간다.
- 댓글 · 방명록: 기본은 티스토리 새 시스템(색만 맞춤), 끄면 스킨 자체 디자인

## 기술
- jQuery · nivo · xeicon 제거. 바닐라 JS 한 블록(테마, 서랍, 목차, 읽는 시간, 진행 막대, 맨 위로)
- `document.write` 없음. 썸네일은 `i1.daumcdn.net/thumb/C{w}x{h}` 로 바로 요청
- 움직임: 홈 소개 첫 등장, 제목 밑줄, 썸네일 1.03 확대, 카드 2px 들림, 버튼 눌림. `prefers-reduced-motion` 에서 모두 멈춤

## 프리뷰
`node preview/build-preview.mjs` → `preview/index.html`(홈), `preview/post.html`(글). 주소 끝 `#dark` / `#light` 로 테마 확인.
샘플 데이터는 `preview/sample-data.mjs`.
