// The duel: Soundwave (played by README visitors) against Shockwave (the AI).
// One round = Soundwave's move, then Shockwave's. Shockwave plans his next move at the end of each of
// his turns from what he has seen, so MIND SCAN can show it and the player can answer it.
const SPR_SRC = require('./sprites');

class Logic { constructor(p) { this.props = p || {}; } setState(s) { Object.assign(this.state, s); } }

// native sprite size comes from the PNG header; everything is drawn at 2x
// atob, not Buffer: this also runs in the Cloudflare Worker
const pngSize = (uri) => { const b = atob(uri.split(',')[1].slice(0, 44)), u = (i) => ((b.charCodeAt(i) << 24) | (b.charCodeAt(i + 1) << 16) | (b.charCodeAt(i + 2) << 8) | b.charCodeAt(i + 3)) >>> 0; return [u(16), u(20)]; };
const sprite = (src) => { const [w, h] = pngSize(src); return { src, w, h }; };
const SPR = { sw: sprite(SPR_SRC.sw), shock: sprite(SPR_SRC.shock) };
const X2 = 2;

// the player
const SOUNDWAVE = {
  k: 'sw', n: 'SOUNDWAVE', chip: 'SOUND', max: 3000, ep: 40, regen: 4, guardEp: 10,
  label: 'Soundwave, mirrored, pixel art',
  atk: ['SONIC BLASTER', 200, 260],
  skills: [
    { n: 'LASERBEAK', ep: 12, h: 'two hits · 130–170 each' },
    { n: 'MIND SCAN', ep: 10, h: 'half damage this round, even from CRUSHING GRIP · see his plan for next round' },
  ],
  limit: ['CASSETTE ASSAULT', 650, 780],
  lines: {
    atk: 'Sonic blaster: firing.',
    skill0: 'Laserbeak: eject. Operation: harass.',
    skill1: 'Your thoughts: transparent. Your next move: known.',
    guard: 'Defensive frequency: engaged.',
    limit: 'Rumble, Frenzy, Ravage, Laserbeak: eject. Operation: cassette assault.',
  },
};
const HEROES = [SOUNDWAVE];

// the AI
const SHOCK = {
  name: 'SHOCKWAVE', who: 'Shockwave', chip: 'SHOCK', max: 3750,
  open: 'Soundwave. Two Decepticons, one room. Logic says only one of us leaves it functional.',
  win: 'Illogical… my calculations… were… flawless…',
  lose: 'As calculated. Soundwave: decommissioned.',
  moves: {
    cannon: { n: 'ARM CANNON', a: 230, b: 280, beam: true, say: 'Resistance is illogical.' },
    grip: { n: 'CRUSHING GRIP', a: 190, b: 230, pierce: true, say: 'Your guard is a pattern. Patterns can be broken.' },
    jam: { n: 'JAMMING PULSE', a: 130, b: 160, drain: 14, say: 'Your energy reserves are high. Correcting that.' },
    divert: { n: 'POWER DIVERT', charge: true, say: 'Diverting all power to the cannon. Impact in one turn.' },
    blast: { n: 'LOGIC CANNON', a: 520, b: 590, beam: true, say: 'Logic. Is. Absolute.' },
    repair: { n: 'LOGIC REPAIR', heal: 380, say: 'Damage exceeds tolerance. Rerouting to self-repair.' },
  },
};

// stage: Shockwave on the left, Soundwave mirrored on the right so they face each other
const MEG = { x: 70, foot: 496 };
const SPOT = [{ x: 560, foot: 496 }];

class Component extends Logic {
  constructor(p) {
    super(p);
    this.towers = [];
    for (let i = 0; i < 16; i++) {
      const w = 34 + (i * 29) % 46, h = 90 + (i * 71) % 170;
      this.towers.push({ x: i * 56 - 20 + (i * 13) % 20, w, h, far: i % 2 });
    }
    this.embers = [];
    for (let i = 0; i < 20; i++) this.embers.push({ x: (i * 97 + 30) % 840, d: (7 + (i * 7) % 6).toFixed(1), dl: (-(i * 1.7) % 12).toFixed(1) });
    this.state = this.fresh();
  }
  R(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  fresh() {
    const s = { hp: [SOUNDWAVE.max], ep: [SOUNDWAVE.ep], lim: [0], boss: SHOCK.max, active: 0, mode: 'cmd', menu: 'main',
      scouted: false, shield: false, guard: [false], charged: false, repairs: 0, hist: [],
      speaker: SHOCK.name, speech: SHOCK.open, line: 'Soundwave and Shockwave face off, one on one.',
      k: 0, fx: null, win: false, round: 1, why: '' };
    s.next = SHOCK.moves.cannon;
    return s;
  }
  // Shockwave's plan for his next turn, and the reason he gives for it
  plan(s, hp, ep) {
    const M = SHOCK.moves, last = s.hist.slice(-3), you = hp[0] / SOUNDWAVE.max, me = s.boss / SHOCK.max;
    if (s.charged) return [M.blast, 'The cannon is charged.'];
    if (me < 0.35 && s.repairs < 2 && Math.random() < 0.75) return [M.repair, 'Self-preservation outranks offence.'];
    if (you < 0.3) return [M.cannon, 'Your structure is failing. Finishing.'];
    if (last.filter((m) => m === 'guard').length >= 2) return [M.grip, 'You keep guarding. Guards can be crushed.'];
    // he never repeats himself: a repeated move is a pattern, and patterns get read
    const fresh = (m) => m !== s.next;
    if (ep[0] >= 30 && fresh(M.jam) && Math.random() < 0.5) return [M.jam, 'Your energy is high. Draining it.'];
    if (s.round % 4 === 3) return [M.divert, 'Probability favours a decisive strike.'];
    const pool = [[M.cannon, 'Standard engagement.'], [M.grip, 'Close range is efficient.'], [M.cannon, 'Maximum output.']].filter(([m]) => fresh(m));
    return pool[this.R(0, pool.length - 1)];
  }
  setMenu(m) { if (this.state.mode === 'cmd') this.setState({ menu: m }); }
  // what: 'atk' | 'skill' (j = 0/1) | 'guard' | 'limit'
  act(what, j) {
    const s = this.state;
    if (s.mode !== 'cmd') return;
    const H = SOUNDWAVE, R = (a, b) => this.R(a, b);
    const ep = s.ep.slice(), lim = s.lim.slice(), guard = [false];
    let dmg = 0, line = '', name = '', shield = false, scouted = s.scouted;
    const pops = [], hit = { x: MEG.x + 100, y: 280 };
    if (what === 'limit') {
      if (lim[0] < 100) return;
      lim[0] = 0; name = H.limit[0]; dmg = R(H.limit[1], H.limit[2]);
      line = 'Soundwave ejects every cassette at once. ' + dmg + ' damage.';
    } else if (what === 'guard') {
      guard[0] = true; ep[0] = Math.min(H.ep, ep[0] + H.guardEp); name = 'GUARD';
      line = 'Soundwave braces and recovers ' + H.guardEp + ' EP.';
    } else if (what === 'atk') {
      name = H.atk[0]; dmg = R(H.atk[1], H.atk[2]); lim[0] = Math.min(100, lim[0] + 10);
      line = 'Soundwave uses ' + name + '. ' + dmg + ' damage.';
    } else {
      const sk = H.skills[j];
      if (ep[0] < sk.ep) return;
      ep[0] -= sk.ep; name = sk.n; lim[0] = Math.min(100, lim[0] + 6);
      if (j === 0) {
        const a = R(130, 170), b = R(130, 170); dmg = a + b;
        line = 'Laserbeak makes two passes: ' + a + ' and ' + b + '.';
        pops.push({ x: hit.x - 30, y: hit.y + 10, t: String(a), c: '#fff' }, { x: hit.x + 40, y: hit.y - 20, t: String(b), c: '#fff' });
      } else {
        shield = true; scouted = true;
        line = 'Soundwave reads Shockwave\'s logic: ' + s.next.n + ' is coming, and his next plan will show. Incoming damage halved this round.';
      }
    }
    if (dmg && !pops.length) pops.push({ ...hit, t: String(dmg), c: what === 'limit' ? '#ffd27a' : '#fff', s: what === 'limit' ? 30 : 22 });
    const boss = Math.max(0, s.boss - dmg);
    const st = { ep, lim, guard, shield, scouted, boss, line, menu: 'main', k: s.k + 1, hist: [...s.hist, what === 'skill' ? 'skill' + j : what].slice(-6),
      speaker: H.n, speech: H.lines[what === 'skill' ? 'skill' + j : what],
      fx: { actor: 0, onBoss: dmg > 0, pops, banner: name, bannerBg: '#2c46c4', shake: what === 'limit', flash: what === 'limit' ? '#fff' : '' } };
    if (boss === 0) { Object.assign(st, { mode: 'over', win: true, speaker: SHOCK.name, speech: SHOCK.win, line: line + ' SHOCKWAVE IS DOWN.' }); this.setState(st); return; }
    st.mode = 'enemy'; st.queue = ['meg'];
    this.setState(st);
  }
  popAt() { const sp = SPOT[0], h = SPR.sw; return { x: sp.x + h.w * X2 / 2 - 24, y: sp.foot - h.h * X2 - 8 }; }
  enemyTurn() {
    const s = this.state;
    if (s.mode !== 'enemy') return;
    const hp = s.hp.slice(), ep = s.ep.slice(), lim = s.lim.slice();
    const m = s.next;
    let boss = s.boss, charged = false, repairs = s.repairs, line, beam = -1;
    const pops = [], hitT = [];
    if (m.charge) { charged = true; line = 'Shockwave diverts all power to his arm cannon. LOGIC CANNON next turn. Guard!'; }
    else if (m.heal) { boss = Math.min(SHOCK.max, boss + m.heal); repairs += 1; line = 'Shockwave reroutes power to self-repair. +' + m.heal + ' HP.'; pops.push({ x: MEG.x + 100, y: 280, t: '+' + m.heal, c: '#7dff9a' }); }
    else {
      let d = this.R(m.a, m.b);
      if (s.shield) d = Math.round(d * 0.5);
      const guarded = s.guard[0] && !m.pierce;
      if (guarded) d = Math.round(d * 0.35);
      hp[0] = Math.max(0, hp[0] - d); lim[0] = Math.min(100, lim[0] + Math.round(d / 14)); hitT.push(0);
      pops.push({ ...this.popAt(), t: String(d), c: '#ff6b8a' });
      if (m.drain) ep[0] = Math.max(0, ep[0] - m.drain);
      line = 'Shockwave uses ' + m.n + '. ' + d + ' damage' + (m.pierce && s.guard[0] ? ', straight through the guard' : '') + (m.drain ? ', and ' + m.drain + ' EP drained' : '') + '.';
      if (m.beam) beam = 0;
    }
    const st = { hp, ep, lim, boss, charged, repairs, queue: [], line, speaker: SHOCK.name, speech: m.say, k: s.k + 1,
      fx: { actor: 'meg', heroHit: hitT, pops, banner: m.n, bannerBg: '#5a2a9a', shake: !!m.beam, beam, flash: m.n === 'LOGIC CANNON' ? '#b48cff' : '' } };
    if (hp[0] === 0) { Object.assign(st, { mode: 'over', win: false, speech: SHOCK.lose, line: line + ' Soundwave goes dark.' }); this.setState(st); return; }
    // next round: Shockwave plans, Soundwave gets a little EP back
    const [next, why] = this.plan({ ...s, charged, boss, repairs }, hp, ep);
    // MIND SCAN this round shows the plan he just made for the next one
    Object.assign(st, { mode: 'cmd', menu: 'main', active: 0, guard: [false], shield: false, scouted: !!s.shield, round: s.round + 1, next, why,
      ep: [Math.min(SOUNDWAVE.ep, ep[0] + SOUNDWAVE.regen)] });
    this.setState(st);
  }
  renderVals() {
    const s = this.state, fx = s.fx || {}, over = s.mode === 'over';
    const meg = { ...SPR.shock, w: SPR.shock.w * X2, h: SPR.shock.h * X2, x: MEG.x, y: MEG.foot - SPR.shock.h * X2 };
    const sp = SPR.sw, w = sp.w * X2, ht = sp.h * X2, sx = SPOT[0];
    const heroes = [{ src: sp.src, w, h: ht, x: sx.x, y: sx.foot - ht, label: SOUNDWAVE.label, delay: '0s', flip: true,
      dx: 0, cur: 'none', fl: s.hp[0] <= 0 ? 'grayscale(1) brightness(.45)' : '', foot: sx.foot }];
    const towers = this.towers.map((t) => ({ ...t, bg: t.far ? '#1d1a48' : '#141233', lit: '#b48cff88' }));
    const embers = this.embers.map((e) => ({ ...e, c: '#b48cff' }));
    const H = SOUNDWAVE, knowNext = s.scouted || s.charged;
    const party = [{ n: H.n, tag: s.guard[0] ? ' ◆' : (s.shield ? ' ◈' : ''), hp: s.hp[0], max: H.max, ep: s.ep[0], emax: H.ep,
      hc: s.hp[0] <= 0 ? '#ff6b8a' : (s.hp[0] < H.max / 4 ? '#ffd27a' : '#fff'), lim: s.lim[0], nc: '#f3c623' },
      // Shockwave has no EP or limit; his column shows what MIND SCAN read, if anything
      { n: SHOCK.name, tag: '', hp: s.boss, max: SHOCK.max, ep: knowNext && !over ? 'next: ' + s.next.n : 'AI', emax: '', hc: '#c9a6ff', lim: null, nc: '#c9a6ff' }];
    return {
      towers, embers, heroes, meg,
      horizon: '#9a6affaa', beam: '#b48cff33', floorTop: '#221a3a', grid: '#9a6aff38', pool: '#9a6aff26',
      megOp: over && s.win ? 0.25 : 1,
      chargeShow: s.charged && !over ? 'block' : 'none', chargeX: meg.x + meg.w - 40, chargeY: meg.y + meg.h * 0.2,
      pops: (fx.pops || []).map((p) => ({ ...p, s: p.s || 20 })),
      banner: fx.banner || '', bannerBg: fx.bannerBg || '#2c46c4',
      speaker: s.speaker, speakerC: s.speaker === 'SOUNDWAVE' ? '#8de0ff' : '#c9a6ff', speech: s.speech,
      party, line: s.line, activeName: H.n,
      foes: [{ n: SHOCK.name, o: 1, bar: 'block', pct: Math.round(s.boss / SHOCK.max * 100), tag: s.boss === 0 ? 'DOWN' : (s.charged ? 'CHARGED ⚠' : 'AI · LOGIC'), tc: s.charged ? '#ffd27a' : '#c9a6ff',
        sub: s.boss + ' / ' + SHOCK.max + (knowNext && !over ? ' · next: ' + s.next.n : '') }],
      overText: s.win ? 'VICTORY' : 'DEFEAT', overColor: s.win ? '#f3c623' : '#c9a6ff',
      overSub: s.win ? 'Round ' + s.round + ' · Shockwave goes dark' : 'Shockwave wins in round ' + s.round,
      overSmall: s.win ? 'Soundwave: superior. Shockwave: offline.' : 'Read him with MIND SCAN, guard the LOGIC CANNON, and don\'t guard twice in a row.',
    };
  }
}

module.exports = { Component, HEROES, SOUNDWAVE, SHOCK, BOSS: SHOCK, SPR, X2, MEG, SPOT };
