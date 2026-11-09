// Draws the current battle as one SVG. GitHub shows README images through <img>: no scripts, no web fonts,
// but SMIL animation works, so the idle bob, cursor, embers and blinking lights stay alive.
const { SPR, HEROES, BOSS } = require('./engine');
const SHADED = require('./sprites');
// the engine hands out its own sprite sources, swap each for the shaded copy
const shade = Object.fromEntries(Object.keys(SPR).map((k) => [SPR[k].src, SHADED[k] || SPR[k].src]));

// the scene is drawn in the original 574px-tall coordinates, lifted 60px so the empty sky gets cropped
const W = 880, AX = 19, AY = 19, AW = 842, AH = 514, LIFT = 60, BY = AY + AH + 10, BH = 186, H = BY + BH + 19;
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
const img = (x, y, w, h, src, extra = '') => `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${shade[src] || src}" preserveAspectRatio="none" image-rendering="optimizeSpeed" style="image-rendering:pixelated"${extra}/>`;
const win = (x, y, w, h) => `<rect x="${x}" y="${y + 4}" width="${w}" height="${h}" rx="6" fill="#000"/><rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="6" fill="url(#win)" stroke="#e9e9f2" stroke-width="3"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4" fill="none" stroke="#0a0f3a" stroke-width="2"/>`;

function render(v, s, extra = {}) {
  const fx = s.fx || {};
  // the boss of this wave stands where Megatron does
  const foe = extra.foe || { who: 'Megatron', name: 'MEGATRON', chip: 'MEG', src: null };
  const foeSrc = foe.src || SPR.meg.src;
  const p2 = s.p2, over = s.mode === 'over', o = [];
  const sky = p2 ? [[0, '#0d0414'], [0.45, '#34092a'], [0.58, '#7a1a3a']] : [[0, '#070b24'], [0.4, '#1f2a6a'], [0.58, '#b0603a']];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Boss fight: Bumblebee, Grimlock and Hot Rod against ${foe.who}. ${esc(v.line)}">
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
<rect width="${W}" height="${H}" rx="10" fill="#070a12"/>
<g transform="translate(${AX} ${AY})" clip-path="url(#arena)">
<g transform="translate(0 -${LIFT})">
<rect width="${AW}" height="${AH + LIFT}" fill="url(#sky)"/>`);
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
  o.push(`<rect y="330" width="${AW}" height="${AH + LIFT - 330}" fill="url(#floor)"/><g stroke="${v.grid.slice(0, 7)}" stroke-opacity="${parseInt(v.grid.slice(7), 16) / 255}" stroke-width="1">`);
  for (let i = -14; i <= 14; i++) o.push(`<line x1="${421 + i * 48}" y1="330" x2="${421 + i * 190}" y2="${AH + LIFT}"/>`);
  for (let i = 1; i <= 9; i++) { const y = 330 + (AH + LIFT - 330) * Math.pow(i / 9, 1.8); o.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${AW}" y2="${y.toFixed(1)}"/>`); }
  o.push(`</g><ellipse cx="421" cy="470" rx="337" ry="100" fill="url(#pool)"/>`);
  // Soundwave (phase 2), Megatron, party sorted by depth
  if (p2) o.push(`<ellipse cx="${v.swShadow.x + v.swShadow.w / 2}" cy="${v.swShadow.y + 9}" rx="${v.swShadow.w / 2}" ry="9" fill="url(#shadow)"/><g filter="url(#back)"><g>${bob(-2, 2.2, -0.7)}${img(v.sw.x, v.sw.y, v.sw.w, v.sw.h, SPR.sw.src)}</g></g>`);
  o.push(`<ellipse cx="${v.megShadow.x + v.megShadow.w / 2}" cy="${v.megShadow.y + 13}" rx="${v.megShadow.w / 2}" ry="13" fill="url(#shadow)"/>`);
  o.push(`<g opacity="${v.megOp}"${over && s.win ? ' filter="url(#down)"' : p2 ? ' filter="url(#rage)"' : ''}><g>${over ? '' : bob(-2, 1.8)}${img(v.meg.x, v.meg.y, v.meg.w, v.meg.h, foeSrc)}</g></g>`);
  // wear on Megatron that builds as the fight goes: scorch at 75%, sparks at 50%, smoke at 25%
  const worn = over && s.win ? 3 : s.boss < BOSS.max * 0.25 ? 3 : s.boss < BOSS.max * 0.5 ? 2 : s.boss < BOSS.max * 0.75 ? 1 : 0;
  const at = (fx_, fy) => [v.meg.x + v.meg.w * fx_, v.meg.y + v.meg.h * fy];
  [[0.3, 0.3], [0.62, 0.58], [0.36, 0.78]].slice(0, worn).forEach(([a, b], i) => {
    const [x, y] = at(a, b);
    o.push(`<g fill="#1a0a0c" opacity=".75"><rect x="${x - 12}" y="${y - 6}" width="24" height="12"/><rect x="${x - 6}" y="${y - 12}" width="12" height="24"/><rect x="${x + 8}" y="${y + 6}" width="8" height="4"/></g><rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#ff5a2a" opacity=".85"/>`);
    if (worn >= 2) o.push(`<g fill="${i % 2 ? '#ffd23f' : '#8de0ff'}"><rect x="${x + 10}" y="${y - 12}" width="5" height="5"/><rect x="${x - 15}" y="${y + 6}" width="5" height="5"/><rect x="${x + 2}" y="${y - 20}" width="4" height="4"/><animate attributeName="opacity" values="1;0;0;1;0" calcMode="discrete" dur="${1.1 + i * 0.4}s" repeatCount="indefinite"/></g>`);
    if (worn >= 3) [0, 1.3].forEach((d) => o.push(`<circle cx="${x}" cy="${y}" r="5" fill="#6a6470"><animateTransform attributeName="transform" type="translate" values="0 0;${6 - i * 4} -70" dur="2.6s" begin="${d + i * 0.5}s" repeatCount="indefinite"/><animate attributeName="r" values="5;14" dur="2.6s" begin="${d + i * 0.5}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="2.6s" begin="${d + i * 0.5}s" repeatCount="indefinite"/></circle>`));
  });
  if (v.chargeShow === 'block') o.push(`<circle cx="${v.chargeX + 17}" cy="${v.chargeY + 17}" r="17" fill="url(#orb)" opacity=".8"><animate attributeName="r" values="17;22;17" dur=".5s" repeatCount="indefinite"/></circle>`);
  v.heroes.forEach((h, i) => {
    const down = h.fl.startsWith('grayscale'), x = h.x + h.dx;
    o.push(`<ellipse cx="${h.sx + h.dx + h.sw / 2}" cy="${h.sy + 9}" rx="${h.sw / 2}" ry="9" fill="url(#shadow)"/>`);
    o.push(`<g${down ? ' filter="url(#down)"' : ''}><g>${down || over ? '' : bob(-2, 1.4, parseFloat(h.delay))}${img(x, h.y, h.w, h.h, h.src)}</g></g>`);
    if (h.cur === 'block') o.push(`<g>${bob(5, 0.6)}<polygon points="${x + h.w / 2 - 9},${h.y - 46} ${x + h.w / 2 + 9},${h.y - 46} ${x + h.w / 2},${h.y - 34}" fill="#f3c623" stroke="#000" stroke-width="2"/></g>`);
  });
  // embers drifting up
  v.embers.forEach((e) => o.push(`<rect x="${e.x}" y="580" width="3" height="3" fill="${e.c}"><animateTransform attributeName="transform" type="translate" values="0 0;14 -560" dur="${e.d}s" begin="${e.dl}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" keyTimes="0;.15;1" dur="${e.d}s" begin="${e.dl}s" repeatCount="indefinite"/></rect>`));
  // what just happened: damage numbers over whoever took them, hits on Megatron in gold
  v.pops.forEach((p) => {
    const num = /^\d+$/.test(p.t);
    o.push(T(p.x, p.y + p.s - 30, num ? '-' + p.t : p.t, { size: Math.max(26, p.s + 6), fill: num && fx.onBoss && p.x < 330 ? '#ffd23f' : p.c, bold: true }));
  });
  // the player's own move, when the enemy acted after it and took over fx: a burst on Megatron, the damage and who did it
  const mine = extra.hit && !over ? extra.hit : null;
  if (mine && mine.pops.length) {
    const [x, y] = at(0.5, 0.42), r = mine.limit ? 46 : 34;
    const star = Array.from({ length: 16 }, (_, k) => { const a = (k * Math.PI) / 8, d = k % 2 ? r * 0.45 : r; return `${(x + Math.cos(a) * d).toFixed(1)},${(y + Math.sin(a) * d).toFixed(1)}`; }).join(' ');
    o.push(`<polygon points="${star}" fill="${mine.limit ? '#ffd27a' : '#fff4c2'}" stroke="#ff8a3d" stroke-width="3" opacity=".8"><animate attributeName="opacity" values=".85;.35;.85" dur="1.2s" repeatCount="indefinite"/></polygon>`);
  }
  // the engine's own pops and banner already show it when a hero moved last
  if (mine && typeof fx.actor !== 'number') {
    mine.pops.forEach((p) => o.push(T(p.x, p.y + (p.s || 20) - 30, '-' + p.t, { size: Math.max(28, (p.s || 20) + 8), fill: '#ffd23f', bold: true })));
    const label = `${mine.n} ▸ ${mine.banner}`, lw = label.length * 8.4 + 20, lx = Math.max(6, v.meg.x + v.meg.w / 2 - lw / 2), ly = v.meg.y - 34;
    o.push(`<rect x="${lx}" y="${ly}" width="${lw}" height="24" rx="4" fill="#2c46c4" stroke="#f3c623" stroke-width="2" opacity=".95"/>${T(lx + lw / 2, ly + 17, label, { size: 13, bold: true, anchor: 'middle' })}`);
  }
  o.push('</g>');
  o.push(`<rect width="${AW}" height="${AH}" fill="url(#vig)"/>`);
  const actor = fx.actor === 'meg' ? foe.name : fx.actor === 'sw' ? 'SOUNDWAVE' : HEROES[fx.actor] ? HEROES[fx.actor].n : '';
  if (v.banner && !over) {
    const label = (actor ? actor + ' ▸ ' : '') + v.banner, bw = label.length * 10.5 + 48;
    o.push(`<rect x="${AW / 2 - bw / 2}" y="92" width="${bw}" height="30" rx="4" fill="${v.bannerBg}" opacity=".92"/>${T(AW / 2, 113, label, { size: 16, bold: true, anchor: 'middle' })}`);
  }
  // dialogue window
  o.push(win(14, 12, AW - 28, 64));
  // a hero's own line when a hero moved last, otherwise the enemy's taunt
  const hero = typeof fx.actor === 'number' && HEROES[fx.actor];
  o.push(T(28, 32, hero ? hero.n : v.speaker, { size: 12, fill: hero ? '#f3c623' : v.speakerC, bold: true }));
  // the whole round in order: heroes already done are dimmed and ticked
  const chips = over ? [] : [...HEROES.map((h, i) => ({ t: ['BEE', 'GRIM', 'ROD'][i], done: i < s.active, now: i === s.active, out: s.hp[i] <= 0 })),
    { t: foe.chip, foe: true }, ...(p2 ? [{ t: 'SW', foe: true }] : [])];
  const cw = (c) => (c.t.length + (c.done ? 2 : 0)) * 8 + 14;
  const chipsW = chips.reduce((a, c) => a + cw(c) + 6, 46);
  wrap(hero ? s.line : '“' + v.speech + '”', Math.floor((AW - 70 - chipsW) / 7.6), 2).forEach((l, i) => o.push(T(28, 51 + i * 17, l, { bold: true })));
  let cx = AW - 26 - chipsW + 46;
  if (chips.length) o.push(T(cx - 42, 46, 'TURN', { size: 12, fill: '#b9c3ff' }));
  chips.forEach((c) => {
    const w = cw(c);
    o.push(`<g opacity="${c.done || c.out ? 0.45 : 1}"><rect x="${cx}" y="30" width="${w}" height="22" rx="3" fill="${c.foe ? '#4a0c22' : '#101c6e'}" stroke="${c.now ? '#f3c623' : c.foe ? '#ff6b8a' : '#e9e9f2'}" stroke-width="${c.now ? 3 : 2}"/>${T(cx + w / 2, 46, c.t + (c.done ? ' ✓' : ''), { size: 12, fill: c.foe ? '#ffd0da' : '#fff', bold: true, anchor: 'middle', shadow: false })}</g>`);
    cx += w + 6;
  });
  if (over) o.push(`<rect width="${AW}" height="${AH}" fill="${s.win ? '#2a1d00' : '#1a0008'}" opacity=".55"/>${T(AW / 2, 250, v.overText, { size: 52, fill: v.overColor, bold: true, anchor: 'middle' })}${T(AW / 2, 286, v.overSub, { size: 15, bold: true, anchor: 'middle' })}`);
  o.push('</g>');

  // bottom windows: whose turn, party, enemies
  o.push(win(AX, BY, 218, BH));
  if (over) {
    o.push(T(35, BY + 26, over && s.win ? 'VICTORY' : 'DEFEAT', { size: 13, fill: '#f3c623', bold: true }));
    wrap(v.overSmall, 24, 3).forEach((l, i) => o.push(T(35, BY + 50 + i * 17, l, { size: 12, fill: '#b9c3ff' })));
    o.push(T(35, BY + 150, '▼ NEW FIGHT in the table', { size: 13, bold: true }));
  } else {
    o.push(T(35, BY + 24, v.activeName + "'S TURN", { size: 12, fill: '#f3c623', bold: true }));
    const H = HEROES[s.active];
    const rows = [['ATTACK', H.atk[0]], [H.skills[0].n, H.skills[0].ep + ' EP'], [H.skills[1].n, H.skills[1].ep + ' EP'], ['GUARD', '½ dmg · +8 EP'], ['LIMIT', s.lim[s.active] >= 100 ? 'READY' : s.lim[s.active] + '%']];
    rows.forEach(([n, h], i) => o.push(T(35, BY + 48 + i * 22, n, { size: 13, bold: true }) + T(225, BY + 48 + i * 22, h, { size: 12, fill: '#b9c3ff', anchor: 'end' })));
    o.push(T(35, BY + 168, '▼ pick a move in the table', { size: 12, fill: '#8de0ff', bold: true }));
  }
  const PX = 245, PW = 400;
  o.push(win(PX, BY, PW, BH));
  const col = [PX + 16, PX + 112, PX + 192, PX + 254, PX + 316];
  o.push(T(col[0], BY + 24, 'ROUND ' + s.round, { size: 12, fill: '#f3c623', bold: true }));
  ['HP', 'EP', 'DMG', 'LIMIT'].forEach((t, i) => o.push(T(col[i + 1], BY + 24, t, { size: 12, fill: '#b9c3ff' })));
  // damage each hero has dealt this fight
  const dmg = extra.dmg || [0, 0, 0];
  v.party.forEach((p, i) => {
    const y = BY + 48 + i * 24;
    o.push(T(col[0], y, p.n + p.tag, { size: 14, fill: p.nc, bold: true }));
    o.push(T(col[1], y, String(p.hp), { size: 14, fill: p.hc, bold: true }) + T(col[1] + String(p.hp).length * 8.4 + 1, y, '/' + p.max, { size: 12, fill: '#b9c3ff' }));
    o.push(T(col[2], y, String(p.ep), { size: 14, bold: true }) + T(col[2] + String(p.ep).length * 8.4 + 1, y, '/' + p.emax, { size: 12, fill: '#b9c3ff' }));
    o.push(T(col[3], y, String(dmg[i] || 0), { size: 14, fill: dmg[i] ? '#ffd23f' : '#8d97d8', bold: true }));
    o.push(`<rect x="${col[4]}" y="${y - 10}" width="${PX + PW - 16 - col[4]}" height="10" fill="#0a0f3a" stroke="#e9e9f2" stroke-width="2"/><rect x="${col[4] + 1}" y="${y - 9}" width="${(PX + PW - 18 - col[4]) * p.lim / 100}" height="8" fill="url(#lim)">${p.lim >= 100 ? '<animate attributeName="opacity" values="1;.55" calcMode="discrete" dur=".5s" repeatCount="indefinite"/>' : ''}</rect>`);
  });
  o.push(`<line x1="${PX + 14}" y1="${BY + 124}" x2="${PX + PW - 14}" y2="${BY + 124}" stroke="#3b52c9" stroke-width="2"/>`);
  // the last three moves, newest first
  (extra.log || [v.line]).slice(-3).reverse().map((l) => l.replace(/^@[\w-]+ · ([A-Z ]+): (?=\1)/, '').replace(/^@[\w-]+ · /, ''))
    .forEach((l, i) => o.push(T(PX + 16, BY + 144 + i * 16, wrap(l, 52, 1)[0], { size: 12, fill: i ? '#8d97d8' : '#e3e7ff', shadow: false })));
  const FX = 653, FW = 208, BW = FW - 32;
  o.push(win(FX, BY, FW, BH));
  v.foes.forEach((f, i) => {
    const y = BY + 26 + i * 78;
    o.push(`<g opacity="${f.o < 1 ? 0.6 : 1}">` + T(FX + 16, y, f.n, { size: 13, bold: true }) + T(FX + FW - 16, y, f.tag, { size: 12, fill: f.tc, anchor: 'end' }));
    if (f.bar === 'block') {
      // what this turn took off Megatron stays visible in red behind the bar
      const was = i === 0 && extra.prevBoss != null ? Math.min(100, extra.prevBoss / BOSS.max * 100) : f.pct;
      o.push(`<rect x="${FX + 16}" y="${y + 8}" width="${BW}" height="12" fill="#0a0f3a" stroke="#e9e9f2" stroke-width="2"/><rect x="${FX + 17}" y="${y + 9}" width="${(BW - 2) * was / 100}" height="10" fill="#ff4f6a"/><rect x="${FX + 17}" y="${y + 9}" width="${(BW - 2) * f.pct / 100}" height="10" fill="${f.c}"/>`);
    }
    wrap(f.sub, 24, 2).forEach((l, k) => o.push(T(FX + 16, y + (f.bar === 'block' ? 38 : 20) + k * 15, l, { size: 12, fill: '#b9c3ff', shadow: false })));
    if (i === 0 && extra.best) o.push(T(FX + 16, y + 54, `best hit ${extra.best.d} · ${extra.best.n}`, { size: 12, fill: '#ffd23f', bold: true, shadow: false }));
    o.push('</g>');
  });
  o.push('</svg>');
  return o.join('\n');
}
module.exports = render;
