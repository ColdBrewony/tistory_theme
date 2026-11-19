#!/usr/bin/env node
/**
 * ColdBrewony — 오프라인 프리뷰 빌더 (의존성 없음)
 *
 * skin.html 의 티스토리 블록(<s_...>)과 치환자([##_..._##])를 샘플 데이터로 렌더해
 * preview/index.html(홈)과 preview/post.html(글 본문)을 만든다.
 *   node preview/build-preview.mjs
 * 다크 테마로 보려면 주소 끝에 #dark, 밝은 테마는 #light.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { vars, common, pages } from './sample-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKIN = readFileSync(join(dirname(__dirname), 'skin.html'), 'utf8');

const missing = new Set();
const unknownBlocks = new Set();

/** ctx: { values: {}, blocks: {}, parent } */
function lookup(ctx, kind, key) {
  for (let c = ctx; c; c = c.parent) if (c[kind] && key in c[kind]) return c[kind][key];
  return undefined;
}
const child = (parent, data = {}) => ({ values: data.values || {}, blocks: data.blocks || {}, parent });

function findClose(src, name, from) {
  const open = new RegExp(`<s_${name}(?:\\s[^>]*)?>`, 'g');
  const close = `</s_${name}>`;
  let depth = 1, i = from;
  while (depth > 0) {
    const c = src.indexOf(close, i);
    if (c < 0) throw new Error(`닫는 태그 없음: s_${name}`);
    open.lastIndex = i;
    const o = open.exec(src);
    if (o && o.index < c) { depth++; i = o.index + o[0].length; }
    else { depth--; i = c + close.length; if (depth === 0) return c; }
  }
}

function render(src, ctx) {
  let out = '';
  const tag = /<s_([a-z0-9_]+(?:-[a-z0-9-]+)?)((?:\s[^>]*)?)>/g;
  let pos = 0, m;
  while ((m = tag.exec(src.slice(pos)))) {
    const start = pos + m.index;
    const name = m[1];
    const attr = (m[2].match(/name="([^"]+)"/) || [])[1];
    const innerStart = start + m[0].length;
    const closeAt = findClose(src, name, innerStart);
    const inner = src.slice(innerStart, closeAt);
    out += fill(src.slice(pos, start), ctx);
    out += block(name, attr, inner, ctx);
    pos = closeAt + `</s_${name}>`.length;
    tag.lastIndex = 0;
  }
  return out + fill(src.slice(pos), ctx);
}

function block(name, attr, inner, ctx) {
  let m;
  if ((m = name.match(/^if_var_(.+)$/))) return vars[m[1]] ? render(inner, ctx) : '';
  if ((m = name.match(/^not_var_(.+)$/))) return vars[m[1]] ? '' : render(inner, ctx);
  const key = attr ? `${name}:${attr}` : name;
  const rule = lookup(ctx, 'blocks', key);
  if (rule === undefined) { unknownBlocks.add(key); return ''; }
  if (rule === false) return '';
  if (rule === true) return render(inner, ctx);
  if (Array.isArray(rule)) return rule.map((d) => render(inner, child(ctx, d))).join('');
  return render(inner, child(ctx, rule));
}

function fill(text, ctx) {
  return text.replace(/\[##_([a-z0-9_-]+)_##\]/g, (_, key) => {
    if (key.startsWith('var_')) {
      const v = vars[key.slice(4)];
      if (v === undefined) missing.add(key);
      return v === undefined || v === true || v === false ? '' : String(v);
    }
    const v = lookup(ctx, 'values', key);
    if (v === undefined) { missing.add(key); return ''; }
    return v;
  });
}

function build(page) {
  missing.clear(); unknownBlocks.clear();
  const ctx = child(null, { values: { ...common.values, ...page.values }, blocks: { ...common.blocks, ...page.blocks } });
  let html = render(SKIN, ctx);

  // 프리뷰 전용: 썸네일 → picsum, 테마 해시, 홈 판정
  html = html.replace(/\/\/i1\.daumcdn\.net\/thumb\/C(\d+)x(\d+)\/\?fname=seed:([a-z0-9-]+)/g, 'https://picsum.photos/seed/$3/$1/$2');
  html = html.replace('</head>', `  <script>if(location.hash==='#dark'||location.hash==='#light')document.documentElement.setAttribute('data-theme',location.hash.slice(1));</script>\n</head>`);
  html = html.replace(/var isHome = [^;]+;/, `var isHome = ${page.home ? 'true' : 'false'};`);
  html = html.replace(/href="\.\/style\.css"/, 'href="../style.css"');

  writeFileSync(join(__dirname, page.file), html);
  const leftovers = (html.match(/\[##_|<s_[a-z]/g) || []).length;
  console.log(`${page.file}: ${(html.length / 1024).toFixed(1)}KB, 남은 치환자 ${leftovers}`
    + (missing.size ? `, 값 없음: ${[...missing].join(' ')}` : '')
    + (unknownBlocks.size ? `, 처리 안 한 블록: ${[...unknownBlocks].join(' ')}` : ''));
  if (leftovers) process.exitCode = 1;
}

pages.forEach(build);
