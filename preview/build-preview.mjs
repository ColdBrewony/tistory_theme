#!/usr/bin/env node
/**
 * ColdBrewony Terminal — 정적 프리뷰 빌더 (오프라인)
 *
 * 목적: 티스토리 치환자/조건/반복을 더미로 치환해 레이아웃·스타일 검증용
 *       index.html 을 생성한다. 완벽 렌더가 아니라 "글목록(인덱스) 페이지"
 *       한 장을 대표로 보여주는 실용 수준.
 *
 * 의존성 없음 (Node 내장 fs/path + 정규식만 사용).
 *
 * 처리 순서:
 *   1) skin.html 읽기
 *   2) <head> 정리: 외부 JS(jquery/nivo/toc/smooth-scroll) 및 인라인 변수/
 *      adsense 스크립트 제거(프리뷰에서 구문오류·네트워크 의존 방지)
 *   3) 본문에서 검증에 필요한 골격(헤더/내비/글목록/페이지네이션)만 남기고
 *      커버그룹·태그·방명록·글본문·사이드바·댓글·관련글 등 복잡 블록 제거
 *   4) <s_list_rep> 반복 블록을 더미 N개로 전개
 *   5) 남은 조건/컨테이너 <s_...> 태그 정리 (show 분기 유지, not 분기 제거)
 *   6) 값 치환자 [##_..._##] → 더미값
 *   7) <s_t3> 등 잔여 컨테이너/잔여 치환자 제거
 *   8) 자산 경로 보정 (./images/ → ../images/, ./style.css → ../style.css)
 *   9) preview/index.html 출력 + 잔여물 자가점검 로그
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const SKIN = join(ROOT, 'skin.html');
const DATA = join(__dirname, 'dummy-data.json');
const OUT = join(__dirname, 'index.html');

const data = JSON.parse(readFileSync(DATA, 'utf8'));
let html = readFileSync(SKIN, 'utf8');

const THUMB = 'https://picsum.photos/seed/PH/600/400';

/* ---------- 1) 위험/불필요 블록 통째 제거 (정규식, 비탐욕) ---------- */
function dropBlock(tag) {
  // <s_tag> ... </s_tag> (속성 포함 허용)
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, 'g');
  html = html.replace(re, '');
}

// 인덱스 페이지 검증에 불필요하고 깨지기 쉬운 큰 블록들 제거
// NOTE: s_sidebar 는 통째로 제거하지 않고 아래에서 대표 모듈 1개만 노출(P1-e)
[
  's_cover_group',        // 커버 슬라이더/그룹 (nivo 의존)
  's_tag',                // 태그 페이지
  's_guest',              // 방명록
  's_page_rep',           // 페이지(소개 등)
  's_notice_rep',         // 공지 본문
  's_article_protected',  // 보호글
  's_article_rep',        // 글 본문(댓글/관련글/TOC 등 대량 포함)
].forEach(dropBlock);

/* ---------- P1-e) s_sidebar → 대표 모듈 1개(블로그 정보 + 카테고리 tree)로 치환 ---------- */
// 원본 s_sidebar 는 반복/조건이 많아 그대로 전개하면 깨지므로, 대표 모듈 1개만 직접 주입한다.
{
  const SIDEBAR_DEMO = `
    <div class="jb-cell jb-cell-module jb-cell-module-category">
      <div class="jb-module-title jb-module-title-category"><h3>CATEGORY</h3></div>
      <div class="jb-module-content jb-module-content-category">
        <ul class="category_list">
          <li><a href="#">개발</a>
            <ul>
              <li><a href="#">프런트엔드</a></li>
              <li><a href="#">백엔드</a></li>
            </ul>
          </li>
          <li><a href="#">일상</a></li>
          <li><a href="#">메모</a></li>
        </ul>
      </div>
    </div>`;
  html = html.replace(/<s_sidebar(?:\s[^>]*)?>[\s\S]*?<\/s_sidebar>/g, SIDEBAR_DEMO);
}

/* ---------- 2) <head> 의 외부/인라인 스크립트 정리 ---------- */
// 외부 JS 로드 제거 (preview 는 JS 동작 검증 대상 아님)
html = html.replace(/<script\s+src="\.\/images\/[^"]*"><\/script>\s*/g, '');
// 인라인 <script> 블록 전부 제거 (adsense/레이아웃 document.write/구문오류 방지)
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
// nivo 슬라이더 CSS 두 줄 제거 (이미지 placeholder 깨짐 방지, 선택)
html = html.replace(/<link[^>]*jquery\.nivo\.slider[^>]*>\s*/g, '');

/* ---------- 3) <s_list> 반복 전개 ---------- */
// s_list_rep 내부 템플릿 추출 후 N개 전개. 내부의 인피드 조건블록은 제거.
html = html.replace(/<s_list_rep(?:\s[^>]*)?>([\s\S]*?)<\/s_list_rep>/g, (_, inner) => {
  // 인피드 광고 조건블록 제거
  let tpl = inner.replace(/<s_if_var_jb-adsense-infeed-show>[\s\S]*?<\/s_if_var_jb-adsense-infeed-show>/g, '');
  let out = '';
  for (let i = 0; i < (data.list_count_n || 6); i++) out += tpl;
  return out;
});

/* ---------- 4) 조건/컨테이너 <s_...> 태그 정리 ---------- */
// 특례) 사이트 타이틀: 기본값(jb-title-logo-use=false)대로 텍스트 타이틀(프롬프트) 노출.
//       로고 이미지 분기(s_if_var)는 제거, 텍스트 분기(s_not_var)는 래퍼만 벗겨 유지.
html = html.replace(/<s_if_var_jb-title-logo-use>[\s\S]*?<\/s_if_var_jb-title-logo-use>/g, '');
html = html.replace(/<\/?s_not_var_jb-title-logo-use>/g, '');
// (a) "표시 안 함" 분기는 내용째 제거
html = html.replace(/<s_not_var_[a-z0-9-]+>[\s\S]*?<\/s_not_var_[a-z0-9-]+>/g, '');
// (b) "표시" 조건블록은 래퍼만 벗기고 내용 유지 (s_if_var_..., s_search, s_cover_item_* 등)
//     여는 태그
html = html.replace(/<s_(?:if_var_[a-z0-9-]+|search|list|cover_url|cover_item|cover_item_thumbnail|cover_item_article_info|list_rep_thumbnail|sidebar_element|tag_label|random_tags)(?:\s[^>]*)?>/g, '');
//     닫는 태그
html = html.replace(/<\/s_(?:if_var_[a-z0-9-]+|search|list|cover_url|cover_item|cover_item_thumbnail|cover_item_article_info|list_rep_thumbnail|sidebar_element|tag_label|random_tags)>/g, '');

/* ---------- 5) 값 치환자 [##_..._##] 치환 ---------- */
const s = data.scalars || {};
// 5-1) html class 의 [##_var_..._##] (헤더/내비/폰트 타입 등) → 기본 타입 클래스로
html = html.replace(/\[##_var_(jb-[a-z0-9-]+)_##\]/g, (m, name) => {
  // 레이아웃/폰트 사이즈 등 숫자형은 별도 처리하므로 여기서는 타입성만
  const numeric = (data.numeric_vars && data.numeric_vars['var_' + name]);
  if (numeric !== undefined) return numeric;
  if (s['var_' + name] !== undefined) return s['var_' + name];
  // jb-xxx-type 류는 "-type-01" 기본 클래스로
  if (/-type$/.test(name)) return name + '-01';
  return name + '-01';
});
// 5-2) 일반 스칼라 치환자
function setScalar(key, val) {
  const re = new RegExp(`\\[##_${key.replace(/[-]/g, '-')}_##\\]`, 'g');
  html = html.replace(re, val);
}
for (const [k, v] of Object.entries(s)) {
  if (k.startsWith('var_')) continue;
  setScalar(k, String(v));
}
// 5-3) 글목록 반복 항목 치환자 (전개된 N개 모두 동일 더미)
const li = data.list_item || {};
for (const [k, v] of Object.entries(li)) {
  if (k === 'list_rep_thumbnail') continue;
  setScalar(k, String(v));
}
// 썸네일 치환자 → 더미 이미지 (daumcdn 프록시 src 안의 fname 부분 포함)
html = html.replace(/\/\/i1\.daumcdn\.net\/thumb\/C[^"']*\?fname=\[##_[a-z0-9_]+_##\]/g, THUMB.replace('PH', 'list'));

/* ---------- P1-b) 내비게이션 더미: category_list / blog_menu (active 1개) ---------- */
{
  const NAV_CATEGORY = `<ul class="tt_category"><li><a href="#">전체보기</a>
    <ul class="category_list">
      <li><a href="#">개발</a></li>
      <li><a href="#">디자인</a></li>
      <li><a href="#">일상</a></li>
    </ul></li></ul>`;
  // blog_menu: li 중 하나를 current(active) 로
  const NAV_BLOGMENU = `<ul>
    <li class="current"><a href="#">홈</a></li>
    <li><a href="#">소개</a></li>
    <li><a href="#">태그</a></li>
    <li><a href="#">방명록</a></li>
  </ul>`;
  html = html.replace(/\[##_category_list_##\]/g, NAV_CATEGORY);
  html = html.replace(/\[##_blog_menu_##\]/g, NAV_BLOGMENU);
}

/* ---------- P1-c) s_paging 전개 → 활성 페이지네이션(현재페이지 1개) ---------- */
{
  // s_paging 래퍼 유지하되, s_paging_rep 반복을 더미 페이지 번호로 전개하고 현재 페이지 표시
  html = html.replace(/<s_paging_rep(?:\s[^>]*)?>([\s\S]*?)<\/s_paging_rep>/g, (_, tpl) => {
    let out = '';
    for (let n = 1; n <= 5; n++) {
      let item = tpl
        .replace(/\[##_paging_rep_link_##\]/g, 'href="#"')
        // 현재 페이지(2번)는 selected span 으로 → skin.html jQuery 가 jb-active 부여하지만
        // 프리뷰는 JS 제거 상태이므로 li 에 직접 jb-active 클래스를 입혀 활성 표시
        .replace(/\[##_paging_rep_link_num_##\]/g, n === 2 ? '<span class="selected">2</span>' : String(n));
      if (n === 2) item = item.replace('<li>', '<li class="jb-active">');
      out += item;
    }
    return out;
  });
}

/* ---------- 6) <s_t3> 및 잔여 컨테이너/치환자 제거 ---------- */
html = html.replace(/<\/?s_t3>/g, '');
// 남은 모든 <s_...>/</s_...> 컨테이너 태그 제거 (열고/닫는 형태)
html = html.replace(/<\/?s_[a-z0-9_-]+(?:\s[^>]*)?>/g, '');
// 남은 값 치환자 제거 → 빈 문자열 (레이아웃 안 깨지게)
html = html.replace(/\[##_[a-z0-9_-]+_##\]/g, '');

/* ---------- P1-d) 썸네일 더미 직접 주입 (원본 document.write 는 step2 에서 제거됨) ----------
 * .jb-index-thumbnail 빈 div 에 picsum 이미지를 넣는다. 일부(3번째마다)는 no-image 로 비워
 * "썸네일 있음/없음" 두 상태를 동시에 노출한다. */
{
  let idx = 0;
  html = html.replace(/(<div class="jb-index-thumbnail[^"]*">)\s*(<\/div>)/g, (full, open, close) => {
    idx++;
    if (idx % 3 === 0) return full; // no-image 상태 유지
    const img = `<img src="https://picsum.photos/seed/thumb${idx}/300/200" alt="" loading="lazy">`;
    return `${open}${img}${close}`;
  });
}

/* ---------- 7) 자산 경로 보정 ---------- */
html = html.replace(/\.\/style\.css/g, '../style.css');
html = html.replace(/\.\/images\//g, '../images/');

/* ---------- 8) 프리뷰 전용 오버라이드 주입 ----------
 * WHY: 스킨은 style.css 에서 .jb-background 를 visibility:hidden 으로 기본 숨김(FOUC 방지)하고,
 *      원래는 skin.html 의 jQuery 가 로드 후 visibility:visible 로 노출한다.
 *      그러나 이 빌더는 검증을 위해 모든 <script> 를 제거(2번 단계)하므로 노출 JS 가 사라져
 *      .jb-background 가 영구 hidden → index.html 이 백지로 보인다.
 *      따라서 프리뷰에서는 CSS 오버라이드로 강제 노출한다. (스킨 원본은 정상이므로 빌더만 처리)
 * 위치: </head> 직전(= ../style.css 링크보다 뒤)에 주입하여 cascade + !important 로 항상 이김.
 */
const PREVIEW_OVERRIDE =
  '<style id="jb-preview-overrides">' +
  '.jb-background{visibility:visible !important}' +
  'html,body{background:var(--term-bg) !important;color:var(--color-ink) !important}' +
  'body{opacity:1 !important;font-family:var(--font-mono) !important}' +
  '.jb-top{display:block !important}' + /* JS 없이도 top 버튼 노출(프리뷰 확인용) */
  '</style>\n</head>';
html = html.replace('</head>', PREVIEW_OVERRIDE);

// P1-a) html 루트에 jb-theme-terminal 강제 주입 (skin.html 에 이미 있으나 프리뷰 안전망)
html = html.replace(/<html\b([^>]*)\bclass\s*=\s*("|')([\s\S]*?)\2/, (full, pre, q, cls) => {
  if (/\bjb-theme-terminal\b/.test(cls)) return full;
  return `<html${pre}class=${q}jb-theme-terminal ${cls}${q}`;
});

// 선택: 프런트페이지 충실 재현 — 원본 JS(skin.html:1643)가 추가하던 jb-body-frontpage 클래스 부여.
// 기존 속성(id 등) 보존하며 첫 <body ...> 여는 태그에만 적용.
html = html.replace(/<body\b([^>]*)>/, (full, attrs) => {
  if (/\bclass\s*=/.test(attrs)) {
    // 기존 class 속성에 추가
    return `<body${attrs.replace(/\bclass\s*=\s*("|')(.*?)\1/, (_m, q, cls) => `class=${q}${cls} jb-body-frontpage${q}`)}>`;
  }
  return `<body${attrs} class="jb-body-frontpage">`;
});

/* ---------- 9) 출력 ---------- */
writeFileSync(OUT, html, 'utf8');

/* ---------- 10) 자가 점검 ---------- */
const leftoverPh = (html.match(/\[##_/g) || []).length;
const leftoverS = (html.match(/<\/?s_[a-z0-9_-]+/g) || []).length;
const leftoverScriptWrite = (html.match(/document\.write/g) || []).length;
console.log('[build-preview] 출력:', OUT);
console.log('[build-preview] 잔여 [##_ 치환자:', leftoverPh);
console.log('[build-preview] 잔여 <s_ 태그:', leftoverS);
console.log('[build-preview] 잔여 document.write(인라인JS):', leftoverScriptWrite);
console.log('[build-preview] 글목록 더미 항목 수:', data.list_count_n || 6);
if (leftoverPh > 0 || leftoverS > 0) {
  console.warn('[build-preview] 경고: 잔여물이 남아 있음(레이아웃 영향 가능). 위 카운트 확인.');
}
