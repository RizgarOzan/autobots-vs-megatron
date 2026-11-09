// Draws the current battle as one SVG. GitHub shows README images through <img>: no scripts, no web fonts,
// but SMIL animation works, so the idle bob, cursor, embers and blinking lights stay alive.
const { SPR, HEROES } = require('./engine');

const W = 880, H = 820, AX = 19, AY = 19, AW = 842, AH = 574;
const FONT = "Consolas, 'DejaVu Sans Mono', Menlo, monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wrap = (s, n, max) => {
  const out = [''];
  for (const w of String(s).split(' ')) {
    if ((out[out.length - 1] + ' ' + w).trim().length > n) out.push(w); else out[out.length - 1] = (out[out.length - 1] + ' ' + w).trim();
  }
  if (out.length > max) { out.length = max; out[max - 1] = out[max - 1].replace(/.{0,2}$/, '…'); }
  return out;
};
// text with the card's hard 2px black shadow
const T = (x, y, s, { size = 13, fill = '#fff', bold = false, anchor = 'start', shadow = true } = {}) => {
  const a = `font-family="${FONT}" font-size="${size}"${bold ? ' font-weight="700"' : ''} text-anchor="${anchor}"`;
  return (shadow ? `<text x="${x + 2}" y="${y + 2}" ${a} fill="#000">${esc(s)}</text>` : '') + `<text x="${x}" y="${y}" ${a} fill="${fill}">${esc(s)}</text>`;
};
const bob = (dy, dur, begin = 0) => `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${dy}" calcMode="discrete" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
const img = (x, y, w, h, src, extra = '') => `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${src}" preserveAspectRatio="none" image-rendering="optimizeSpeed" style="image-rendering:pixelated"${extra}/>`;
const win = (x, y, w, h) => `<rect x="${x}" y="${y + 4}" width="${w}" height="${h}" rx="6" fill="#000"/><rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="6" fill="url(#win)" stroke="#e9e9f2" stroke-width="3"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4" fill="none" stroke="#0a0f3a" stroke-width="2"/>`;

function render(v, s) {
  const p2 = s.p2, over = s.mode === 'over', o = [];
  const sky = p2 ? [[0, '#0d0414'], [0.45, '#34092a'], [0.58, '#7a1a3a']] : [[0, '#070b24'], [0.4, '#1f2a6a'], [0.58, '#b0603a']];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Boss fight: Bumblebee, Grimlock and Hot Rod against Megatron. ${esc(v.line)}">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${sky.map(([k, c]) => `<stop offset="${k}" stop-color="${c}"/>`).join('')}</linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.floorTop}"/><stop offset=".9" stop-color="#06070d"/></linearGradient>
<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22379e"/><stop offset="1" stop-color="#0c154f"/></linearGradient>
<linearGradient id="beamlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.beam.slice(0, 7)}" stop-opacity="${parseInt(v.beam.slice(7), 16) / 255}"/><stop offset=".72" stop-color="${v.beam.slice(0, 7)}" stop-opacity="0"/></linearGradient>
<linearGradient id="lim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff4fa3"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${v.horizon.slice(0, 7)}" stop-opacity="${parseInt(v.horizon.slice(7), 16) / 255}"/><stop offset="1" stop-color="${v.horizon.slice(0, 7)}" stop-opacity="0"/></radialGradient>
<radialGradient id="pool"><stop offset="0" stop-color="${v.pool.slice(0, 7)}" stop-opacity="${parseInt(v.pool.slice(7), 16) / 255}"/><stop offset="1" stop-color="${v.pool.slice(0, 7)}" stop-opacity="0"/></radialGradient>
<radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx=".55" cy=".6" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>
<radialGradient id="orb"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#b48cff"/><stop offset="1" stop-color="#b48cff" stop-opacity="0"/></radialGradient>
<pattern id="lit" width="8" height="11" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1" fill="${v.towers[0].lit.slice(0, 7)}" fill-opacity="${parseInt(v.towers[0].lit.slice(7), 16) / 255}"/></pattern>
<filter id="blur"><feGaussianBlur stdDeviation="1.4"/></filter>
<filter id="back"><feColorMatrix type="saturate" values=".7"/><feComponentTransfer><feFuncR type="linear" slope=".62"/><feFuncG type="linear" slope=".62"/><feFuncB type="linear" slope=".62"/></feComponentTransfer><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#ff2a5a" flood-opacity=".4"/></filter>
<filter id="down"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".45"/><feFuncG type="linear" slope=".45"/><feFuncB type="linear" slope=".45"/></feComponentTransfer></filter>
<filter id="rage"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ff2a5a" flood-opacity=".55"/></filter>
<clipPath id="arena"><rect x="0" y="0" width="${AW}" height="${AH}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="#111"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="#070a12"/>
<g transform="translate(${AX} ${AY})" clip-path="url(#arena)">
<rect width="${AW}" height="${AH}" fill="url(#sky)"/>`);
  // city skyline
  o.push('<g filter="url(#blur)" opacity=".9">');
  v.towers.forEach((t, i) => {
    const b = 330, top = b - t.h, x1 = t.x + t.w;
    const pts = i % 3 === 0 ? `${t.x},${top + t.h * 0.18} ${t.x + t.w / 2},${top} ${x1},${top + t.h * 0.18} ${x1},${b} ${t.x},${b}`
      : i % 3 === 1 ? `${t.x},${top} ${t.x + t.w * 0.7},${top} ${x1},${top + t.h * 0.12} ${x1},${b} ${t.x},${b}` : `${t.x},${top} ${x1},${top} ${x1},${b} ${t.x},${b}`;
    o.push(`<polygon points="${pts}" fill="${t.bg}"/><polygon points="${pts}" fill="url(#lit)"/>`);
  });
  o.push('</g>');
  o.push(`<ellipse cx="480" cy="300" rx="295" ry="110" fill="url(#glow)"/>`);
  [[480, 120, 0], [640, 70, -2], [250, 90, -4]].forEach(([x, w, d]) => o.push(`<rect x="${x}" y="-120" width="${w}" height="760" fill="url(#beamlight)" transform="rotate(24 ${x} -120)"><animate attributeName="opacity" values=".5;.95;.5" dur="6s" begin="${d}s" repeatCount="indefinite"/></rect>`));
  // floor with a perspective grid
  o.push(`<rect y="330" width="${AW}" height="${AH - 330}" fill="url(#floor)"/><g stroke="${v.grid.slice(0, 7)}" stroke-opacity="${parseInt(v.grid.slice(7), 16) / 255}" stroke-width="1">`);
  for (let i = -14; i <= 14; i++) o.push(`<line x1="${421 + i * 48}" y1="330" x2="${421 + i * 190}" y2="${AH}"/>`);
  for (let i = 1; i <= 9; i++) { const y = 330 + (AH - 330) * Math.pow(i / 9, 1.8); o.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${AW}" y2="${y.toFixed(1)}"/>`); }
  o.push(`</g><ellipse cx="421" cy="470" rx="337" ry="100" fill="url(#pool)"/>`);
  // Soundwave (phase 2), Megatron, party sorted by depth
  if (p2) o.push(`<ellipse cx="${v.swShadow.x + v.swShadow.w / 2}" cy="${v.swShadow.y + 9}" rx="${v.swShadow.w / 2}" ry="9" fill="url(#shadow)"/><g filter="url(#back)"><g>${bob(-2, 2.2, -0.7)}${img(v.sw.x, v.sw.y, v.sw.w, v.sw.h, SPR.sw.src)}</g></g>`);
  o.push(`<ellipse cx="${v.megShadow.x + v.megShadow.w / 2}" cy="${v.megShadow.y + 13}" rx="${v.megShadow.w / 2}" ry="13" fill="url(#shadow)"/>`);
  o.push(`<g opacity="${v.megOp}"${over && s.win ? ' filter="url(#down)"' : p2 ? ' filter="url(#rage)"' : ''}><g>${over ? '' : bob(-2, 1.8)}${img(v.meg.x, v.meg.y, v.meg.w, v.meg.h, SPR.meg.src)}</g></g>`);
  if (v.chargeShow === 'block') o.push(`<circle cx="${v.chargeX + 17}" cy="${v.chargeY + 17}" r="17" fill="url(#orb)" opacity=".8"><animate attributeName="r" values="17;22;17" dur=".5s" repeatCount="indefinite"/></circle>`);
  v.heroes.forEach((h, i) => {
    const down = h.fl.startsWith('grayscale'), x = h.x + h.dx;
    o.push(`<ellipse cx="${h.sx + h.dx + h.sw / 2}" cy="${h.sy + 9}" rx="${h.sw / 2}" ry="9" fill="url(#shadow)"/>`);
    o.push(`<g${down ? ' filter="url(#down)"' : ''}><g>${down || over ? '' : bob(-2, 1.4, parseFloat(h.delay))}${img(x, h.y, h.w, h.h, h.src)}</g></g>`);
    if (h.cur === 'block') o.push(`<g>${bob(5, 0.6)}<polygon points="${x + h.w / 2 - 9},${h.y - 46} ${x + h.w / 2 + 9},${h.y - 46} ${x + h.w / 2},${h.y - 34}" fill="#f3c623" stroke="#000" stroke-width="2"/></g>`);
  });
  // embers drifting up
  v.embers.forEach((e) => o.push(`<rect x="${e.x}" y="580" width="3" height="3" fill="${e.c}"><animateTransform attributeName="transform" type="translate" values="0 0;14 -560" dur="${e.d}s" begin="${e.dl}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" keyTimes="0;.15;1" dur="${e.d}s" begin="${e.dl}s" repeatCount="indefinite"/></rect>`));
  o.push(`<rect width="${AW}" height="${AH}" fill="url(#vig)"/>`);
  // what just happened: last move banner and its numbers
  v.pops.forEach((p) => o.push(T(p.x, p.y + p.s, p.t, { size: p.s + 2, fill: p.c, bold: true })));
  if (v.banner && !over) {
    const bw = v.banner.length * 11 + 60;
    o.push(`<rect x="${AW / 2 - bw / 2}" y="92" width="${bw}" height="30" fill="${v.bannerBg}" opacity=".92"/>${T(AW / 2, 113, v.banner, { size: 16, bold: true, anchor: 'middle' })}`);
  }
  // dialogue window
  o.push(win(14, 12, AW - 28, 64));
  o.push(T(28, 32, v.speaker, { size: 11, fill: v.speakerC, bold: true }) + T(28 + v.speaker.length * 6.2 + 8, 32, '· AI-RUN', { size: 11, fill: '#8d97d8' }));
  const chipsW = v.order.reduce((a, c) => a + c.t.length * 7.5 + 18, 46);
  wrap('“' + v.speech + '”', Math.floor((AW - 70 - chipsW) / 7.6), 2).forEach((l, i) => o.push(T(28, 50 + i * 17, l, { bold: true })));
  let cx = AW - 26 - chipsW + 46;
  if (v.order.length) o.push(T(cx - 40, 46, 'TURN', { size: 11, fill: '#b9c3ff' }));
  v.order.forEach((c) => { const w = c.t.length * 7.5 + 12; o.push(`<rect x="${cx}" y="31" width="${w}" height="21" fill="${c.bg}" stroke="${c.b}" stroke-width="2"/>${T(cx + w / 2, 46, c.t, { size: 11, fill: c.c, bold: true, anchor: 'middle', shadow: false })}`); cx += w + 6; });
  if (over) o.push(`<rect width="${AW}" height="${AH}" fill="${s.win ? '#2a1d00' : '#1a0008'}" opacity=".55"/>${T(AW / 2, 280, v.overText, { size: 52, fill: v.overColor, bold: true, anchor: 'middle' })}${T(AW / 2, 316, v.overSub, { size: 15, bold: true, anchor: 'middle' })}`);
  o.push('</g>');

  // bottom windows: whose turn, party, enemies
  const BY = AY + AH + 10, BH = 186;
  o.push(win(27, BY, 214, BH));
  if (over) {
    o.push(T(43, BY + 26, over && s.win ? 'VICTORY' : 'DEFEAT', { size: 13, fill: '#f3c623', bold: true }));
    wrap(v.overSmall, 24, 3).forEach((l, i) => o.push(T(43, BY + 50 + i * 17, l, { size: 12, fill: '#b9c3ff' })));
    o.push(T(43, BY + 150, '▼ NEW FIGHT below', { size: 13, bold: true }));
  } else {
    o.push(T(43, BY + 24, v.activeName + "'S TURN", { size: 11, fill: '#f3c623', bold: true }));
    const H = HEROES[s.active];
    const rows = [['ATTACK', H.atk[0]], [H.skills[0].n, H.skills[0].ep + ' EP'], [H.skills[1].n, H.skills[1].ep + ' EP'], ['GUARD', '½ dmg · +8 EP'], ['LIMIT', s.lim[s.active] >= 100 ? 'READY' : s.lim[s.active] + '%']];
    rows.forEach(([n, h], i) => o.push(T(43, BY + 48 + i * 22, n, { size: 13, bold: true }) + T(225, BY + 48 + i * 22, h, { size: 10, fill: '#b9c3ff', anchor: 'end' })));
    o.push(T(43, BY + 168, '▼ pick a move below', { size: 11, fill: '#8de0ff' }));
  }
  const PX = 249, PW = 400;
  o.push(win(PX, BY, PW, BH));
  const col = [PX + 16, PX + 130, PX + 226, PX + 300];
  ['HP', 'EP', 'LIMIT'].forEach((t, i) => o.push(T(col[i + 1], BY + 24, t, { size: 11, fill: '#b9c3ff' })));
  v.party.forEach((p, i) => {
    const y = BY + 48 + i * 24;
    o.push(T(col[0], y, p.n + p.tag, { size: 14, fill: p.nc, bold: true }));
    o.push(T(col[1], y, String(p.hp), { size: 14, fill: p.hc, bold: true }) + T(col[1] + String(p.hp).length * 8.4 + 1, y, '/' + p.max, { size: 10, fill: '#b9c3ff' }));
    o.push(T(col[2], y, String(p.ep), { size: 14, bold: true }) + T(col[2] + String(p.ep).length * 8.4 + 1, y, '/' + p.emax, { size: 10, fill: '#b9c3ff' }));
    o.push(`<rect x="${col[3]}" y="${y - 10}" width="${PX + PW - 16 - col[3]}" height="10" fill="#0a0f3a" stroke="#e9e9f2" stroke-width="2"/><rect x="${col[3] + 1}" y="${y - 9}" width="${(PX + PW - 18 - col[3]) * p.lim / 100}" height="8" fill="url(#lim)">${p.lim >= 100 ? '<animate attributeName="opacity" values="1;.55" calcMode="discrete" dur=".5s" repeatCount="indefinite"/>' : ''}</rect>`);
  });
  o.push(`<line x1="${PX + 14}" y1="${BY + 124}" x2="${PX + PW - 14}" y2="${BY + 124}" stroke="#3b52c9" stroke-width="2"/>`);
  wrap(v.line, 52, 3).forEach((l, i) => o.push(T(PX + 16, BY + 142 + i * 16, l, { size: 12, fill: '#e3e7ff', shadow: false })));
  const FX = 657;
  o.push(win(FX, BY, 196, BH));
  v.foes.forEach((f, i) => {
    const y = BY + 26 + i * 78;
    o.push(`<g opacity="${f.o}">` + T(FX + 16, y, f.n, { size: 12, bold: true }) + T(FX + 180, y, f.tag, { size: 10, fill: f.tc, anchor: 'end' }));
    if (f.bar === 'block') o.push(`<rect x="${FX + 16}" y="${y + 8}" width="164" height="12" fill="#0a0f3a" stroke="#e9e9f2" stroke-width="2"/><rect x="${FX + 17}" y="${y + 9}" width="${162 * f.pct / 100}" height="10" fill="${f.c}"/>`);
    wrap(f.sub, 27, 2).forEach((l, k) => o.push(T(FX + 16, y + (f.bar === 'block' ? 36 : 18) + k * 14, l, { size: 10, fill: '#b9c3ff', shadow: false })));
    o.push('</g>');
  });
  o.push('</svg>');
  return o.join('\n');
}
module.exports = render;
