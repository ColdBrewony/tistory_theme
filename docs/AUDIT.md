# JB SKIN 167 — 전체 점검 리포트 (Audit)

- 대상: `JB SKIN 167 V3.3.3` (jbfactory.net 상용 반응형 티스토리 스킨)
- 점검일: 2026-06-11
- 점검 방식: 코드(기술) · UI/UX · 외부 스택 3축 병렬 점검, 읽기 전용
- 한 줄 진단: **잘 만들어진 2014~2016 Bootstrap 3 시대 스킨.** AI 슬롭이 없어 토큰(색·여백·라운드·폰트)만 현대화해도 인상이 크게 바뀐다.

> 모든 치환자(`[##_..._##]`)·조건 블록(`<s_if_var_...>`)·`<s_t3>`는 티스토리 정상 문법이며 건드리지 않는다.

---

## 1. 🔴 즉시 고칠 것 (버그 · 치명)

| # | 항목 | 근거 | 조치 |
|---|------|------|------|
| B1 | `jbAdSenseMainBottom` 변수 **중복 선언** (복붙 실수, 죽은 코드) | skin.html:103-104 | 104행 삭제 |
| B2 | **이전 소유자(jbfactory)의 사이트 소유확인 토큰**이 박혀 있음 — Search Console/네이버 웹마스터 소유확인이 엉킴 | skin.html:32-33 | 삭제(본인 토큰 있으면 교체) |
| B3 | 본문 `word-break: break-all` — 한글·영단어가 **줄 끝에서 중간에 잘림**, 가독성 최악 | style.css:143 | `word-break: keep-all` + `overflow-wrap: anywhere` |
| B4 | **포커스 스타일 전무** (`outline:none` 남발) — 키보드 사용자가 현재 위치를 알 수 없음 | style.css:200-203, 534 | `:focus-visible` 포인트색 링 복원 |
| B5 | **명도 대비 미달** — 날짜/보조 텍스트 `#cccccc`,`#999999`가 WCAG AA(4.5:1) 미달 | style.css:186, 327 | `#6B7280` 이상으로 통일 |

## 2. 🟡 모던 리프레시 핵심 (디자인 토큰)

현재 디자인이 "올드"하게 보이는 신호 3가지:
1. **링크/포인트색 `#337ab7`** (Bootstrap 3 기본 파랑, hover `#23527c`) — 시대를 가장 또렷이 드러냄 (style.css:160-161)
2. **직각 + 평면** — `border-radius`는 버튼 3px·아바타뿐, `box-shadow`는 전부 `none`, 카드·태그·페이지네이션이 1px `#dadada` 직각 테두리 (style.css:253, 1561)
3. **작은 폰트 14px + 좁은 본문** — 본문 630px, 회색 3~4종(`#999/#868686/#666`) 난립

| 영역 | 발견 | 근거 |
|------|------|------|
| 글목록 | **기본값 `jb-index-type-01`이 썸네일 숨김(텍스트만)** → 가장 올드한 첫인상. 썸네일형 전환이 임팩트 최대 | style.css:1136 |
| 헤더 | 기본 타이틀 여백 `40px 0` 과함, Type04 `text-shadow:2px 2px 10px` 올드 | style.css:565, 642 |
| 내비 | 활성 메뉴 표시(active state) 없음 | style.css:779-781 |
| 본문 | line-height 1.8(폰트 키우면 과함), 헤딩 border-bottom 4px 두꺼움 | style.css:143, 362 |
| 댓글/입력 | 입력창·버튼 직각 1px 테두리 | style.css:301, 311 |
| 태그 | `font-size:10px; color:transparent`로 텍스트를 가리는 위험한 핵 | style.css:249 |

## 3. 🟢 의존성 · 성능 (이번 회차 보존, 향후 과제)

| 의존성 | 버전/상태 | 비고 |
|--------|-----------|------|
| jQuery | 3.5.1 (2020) — 알려진 CVE는 안전하나 3.x 유지보수 종료 라인 | 4.x 이전은 별도 검증 필요, 이번 회차 보류 |
| Nivo Slider | v3.2 (2012) **단종** | 커버 슬라이더 옵션에서만 사용. 대체=Swiper/Splide(향후) |
| xeicon | 2.3.3 (2017) **동결**, 외부 jsdelivr CDN(jbfactory repo) | SPOF — repo 삭제 시 아이콘 전부 깨짐. preconnect로 완화 |
| 폰트 | 외부 jsdelivr CDN | 동일 SPOF/FOUT |
| AdSense | `document.write` + 로더 **10회 중복** 삽입, 모바일 parser-blocking | 옵션 기본 OFF. 구조 보존, 이번 회차 미변경 |
| 기타 | IE `X-UA-Compatible` 잔재(무의미), `target=_blank`에 `rel=noopener` 누락 | 저비용 정리 대상 |

## 4. 외부 스택 사실 (출처 확인 2026-06-11)

- **jQuery 3.5.1**: CVE-2020-11022/11023(XSS)은 3.5.0에서 수정 → 3.5.1 안전. 단 3.x는 사실상 유지보수 종료, 활성 라인은 4.x. (snyk.io, blog.jquery.com)
- **nivo slider**: discontinued, npm "Inactive". 모던 대체 = Swiper(무의존), Splide, Glide.js.
- **xeicon**: 실질 마지막 릴리스 2.3.3(2017-08). 모던 대체 = Lucide/Tabler/Phosphor(SVG) 또는 Font Awesome 6(폰트).
- **X-UA-Compatible**: IE 단종으로 무의미, 안전하게 제거 가능.
- **로컬 프리뷰**: 티스토리 치환자는 서버 렌더 비공개 문법. 도구 Tidory(세션쿠키 필요) vs 정적 더미 치환(오프라인). → **정적 더미 하니스 채택.**

## 5. 결정 사항 (사용자 확인 완료)

| 결정 | 값 |
|------|----|
| 로컬 미리보기 | 정적 더미 치환 하니스 (오프라인) |
| 사용 기능 | 불확실 → **기능 전부 보존**(AdSense/슬라이더/TOC/SNS 삭제 안 함) |
| 포인트색 | 중립 잉크 + 단일 포인트 모던 블루 `#2563EB` |
| 개편 강도 | **적극** — 토큰 전면 교체 + 본문폭 630→720 + 기본 글목록 썸네일형 |

→ 상세 작업 설계는 `DESIGN-modern-refresh.md` 참조.
