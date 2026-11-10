// The duel's rules, Shockwave's AI, the README block and the save, end to end. Run: node --test game/test/
const { test: t } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const R = path.join(__dirname, '..') + '/';
const { Component, SOUNDWAVE: H, SHOCK } = require(R + 'engine');
const { game } = require(R + 'core');
const fs = require('fs');
const M = SHOCK.moves;
// a fresh engine with Shockwave's next move forced and dice fixed
function eng(next, rnd = 0.5) {
  const c = new Component({}); c.state.next = next;
  c.R = (a, b) => a + Math.floor(rnd * (b - a + 1));
  return c;
}
const turn = (c, ...mv) => { c.act(...mv); while (c.state.mode === 'enemy') c.enemyTurn(); return c.state; };

t('ATTACK hits Shockwave inside 200–260 and fills limit +10', () => {
  for (const r of [0, 0.999]) { const c = eng(M.cannon, r); const b = c.state.boss; turn(c, 'atk'); const d = b - c.state.boss; assert(d >= 200 && d <= 260, d); assert.strictEqual(c.state.lim[0] >= 10, true); }
});
t('LASERBEAK costs 14 EP and lands two hits of 110–140', () => {
  const c = eng(M.cannon, 0); const b = c.state.boss; c.act('skill', 0);
  assert.strictEqual(c.state.ep[0], 40 - 14); assert.strictEqual(b - c.state.boss, 220); assert.strictEqual(c.state.fx.pops.length, 2);
  const d = eng(M.cannon, 0.999); const e = d.state.boss; d.act('skill', 0); assert.strictEqual(e - d.state.boss, 280);
});
t('LASERBEAK is refused without enough EP', () => {
  const c = eng(M.cannon); c.state.ep = [5]; const k = c.state.k; c.act('skill', 0); assert.strictEqual(c.state.k, k);
});
t('GUARD takes 0.35 of ARM CANNON, gives +10 EP (capped at 40) and +15 limit', () => {
  const c = eng(M.cannon, 0); c.state.ep = [20]; turn(c, 'guard'); const d = Math.round(230 * 0.35);
  assert.strictEqual(3000 - c.state.hp[0], d); assert.strictEqual(c.state.ep[0], Math.min(40, 20 + 10 + H.regen));
  assert.strictEqual(c.state.lim[0], 15 + Math.round(d / 14));
});
t('CRUSHING GRIP goes straight through GUARD', () => {
  const c = eng(M.grip, 0); turn(c, 'guard'); assert.strictEqual(3000 - c.state.hp[0], 190);
});
t('MIND SCAN costs 8 EP and hits for 90–120', () => {
  const c = eng(M.cannon, 0); const b = c.state.boss; c.act('skill', 1); assert.strictEqual(b - c.state.boss, 90); assert.strictEqual(c.state.ep[0], 32);
  const d = eng(M.cannon, 0.999); const e = d.state.boss; d.act('skill', 1); assert.strictEqual(e - d.state.boss, 120);
});
t('MIND SCAN halves damage this round, CRUSHING GRIP included', () => {
  const c = eng(M.grip, 0); turn(c, 'skill', 1); assert.strictEqual(3000 - c.state.hp[0], 95);
});
t('MIND SCAN reveals the plan for next round, and only for that round', () => {
  const c = eng(M.cannon); turn(c, 'skill', 1);
  assert.strictEqual(c.state.scouted, true); assert(c.state.next && c.state.why, 'plan and reason set');
  turn(c, 'atk'); assert.strictEqual(c.state.scouted, false);
});
t('POWER DIVERT charges, and the next move is LOGIC CANNON 520–590', () => {
  const c = eng(M.divert, 0); turn(c, 'atk');
  assert.strictEqual(c.state.charged, true); assert.strictEqual(c.state.next.n, 'LOGIC CANNON');
  const hp = c.state.hp[0]; turn(c, 'atk'); assert.strictEqual(hp - c.state.hp[0], 520);
});
t('GUARD against LOGIC CANNON takes 0.35 of it', () => {
  const c = eng(M.blast, 0); turn(c, 'guard'); assert.strictEqual(3000 - c.state.hp[0], Math.round(520 * 0.35));
});
t('JAMMING PULSE drains 14 EP', () => {
  const c = eng(M.jam, 0); turn(c, 'atk'); assert.strictEqual(c.state.ep[0], 40 - 14 + H.regen);
});
t('LOGIC REPAIR heals 380, never above max, and counts repairs', () => {
  const c = eng(M.repair); c.state.boss = 1000; turn(c, 'guard'); assert.strictEqual(c.state.boss, 1380); assert.strictEqual(c.state.repairs, 1);
  const d = eng(M.repair); d.state.boss = 3700; turn(d, 'guard'); assert.strictEqual(d.state.boss, SHOCK.max);
});
t('AI: repairs at most twice', () => {
  let seen = 0; const c = new Component({});
  for (let i = 0; i < 300; i++) { const [m] = c.plan({ ...c.state, boss: 500, repairs: 2, next: M.cannon }, [3000], [10]); if (m === M.repair) seen++; }
  assert.strictEqual(seen, 0);
});
t('AI: crushes a guard used twice in the last three moves', () => {
  const c = new Component({}); const [m, why] = c.plan({ ...c.state, hist: ['guard', 'atk', 'guard'], next: M.cannon }, [3000], [10]);
  assert.strictEqual(m, M.grip); assert(/guard/i.test(why));
});
t('AI: the finisher and the guard-crusher also never repeat', () => {
  const c = new Component({});
  assert.strictEqual(c.plan({ ...c.state, next: M.cannon }, [800], [10])[0], M.grip);
  assert.notStrictEqual(c.plan({ ...c.state, hist: ['guard', 'atk', 'guard'], next: M.grip }, [3000], [10])[0], M.grip);
});
t('AI: goes for the finish below 30% HP', () => {
  const c = new Component({}); const [m] = c.plan({ ...c.state, next: M.grip }, [800], [10]); assert.strictEqual(m, M.cannon);
});
t('AI: never repeats a move (outside charge → blast)', () => {
  const c = new Component({});
  for (const prev of [M.cannon, M.grip, M.jam]) for (let i = 0; i < 300; i++) {
    const s = { ...c.state, round: 2 + (i % 2), next: prev, hist: ['atk'] }; const [m] = c.plan(s, [2500], [40]);
    assert.notStrictEqual(m, prev, 'repeated ' + prev.n);
  }
});
t('LIMIT is locked under 100% and hits 650–780 when full', () => {
  const c = eng(M.cannon, 0); const k = c.state.k; c.act('limit'); assert.strictEqual(c.state.k, k);
  c.state.lim = [100]; const b = c.state.boss; turn(c, 'limit'); assert.strictEqual(b - c.state.boss, 650); assert.strictEqual(c.state.lim[0] > 0 && c.state.lim[0] < 100, true);
});
t('Win: Shockwave at 0 ends the duel before he can answer', () => {
  const c = eng(M.cannon); c.state.boss = 100; const hp = c.state.hp[0]; turn(c, 'atk');
  assert.strictEqual(c.state.mode, 'over'); assert.strictEqual(c.state.win, true); assert.strictEqual(c.state.hp[0], hp);
});
t('Loss: Soundwave at 0 ends the duel', () => {
  const c = eng(M.cannon); c.state.hp = [50]; turn(c, 'atk'); assert.strictEqual(c.state.mode, 'over'); assert.strictEqual(c.state.win, false);
});
t('Every played move bumps k by 2 (Soundwave + Shockwave), refused moves by 0', () => {
  const g = game({}); const k = g.db.state.k; g.play('boss: soundwave atk'); assert.strictEqual(g.db.state.k, k + 2);
  g.db.state.ep = [0]; const k2 = g.db.state.k; const [ok] = g.play('boss: soundwave skill1'); assert(!ok); assert.strictEqual(g.db.state.k, k2);
});
t('Old hero titles are turned away, unknown moves too', () => {
  const g = game({}); assert(!g.play('boss: hotrod atk')[0]); assert(!g.play('boss: soundwave fly')[0]); assert(g.play('boss: atk')[0]); assert(g.play('duel: soundwave guard')[0]);
});
t('NEW only after the duel is over; it resets stats and keeps the hall', () => {
  const g = game({}); assert(!g.play('boss: new')[0]);
  g.db.state.boss = 1; g.play('boss: soundwave atk', 'me'); assert.strictEqual(g.db.state.mode, 'over'); assert.strictEqual(g.db.hall.length, 1);
  assert(g.play('boss: new', 'me')[0]); assert.strictEqual(g.db.state.mode, 'cmd'); assert.deepStrictEqual(g.db.stats, {}); assert.strictEqual(g.db.hall.length, 1);
});
t('Stats: issue players by login, one-click visitors as the crowd', () => {
  const g = game({}); g.play('boss: soundwave atk', 'alice'); g.play('boss: soundwave atk', null);
  assert.strictEqual(g.db.stats.alice.moves, 1); assert.strictEqual(g.db.crowd.moves, 1); assert(g.db.best && g.db.best.d >= 200);
});
t('README: move links (one-click with the current k, or issue links), MIND SCAN banner shows the plan, charge warning shows', () => {
  const g = game({}); const rd = fs.readFileSync(R + '../README.md', 'utf8');
  let out = g.files(rd); const L = require(R + 'config.json').live;
  assert(L ? out.readme.includes(`m=atk&k=${g.db.state.k})`) : out.readme.includes('title=boss%3A%20soundwave%20atk'));
  g.play('boss: soundwave skill2'); out = g.files(rd); assert(/Mind scan:\*\* Shockwave plans \*\*[A-Z ]+\*\* next/.test(out.readme));
  g.db.state.charged = true; out = g.files(rd); assert(out.readme.includes('charged the LOGIC CANNON'));
  assert(!/NaN|undefined/.test(out.svg.replace(/base64,[^"]+/g, '')));
});
t('Saved state round-trips through state.json', () => {
  const g = game({}); g.play('boss: soundwave atk', 'a'); g.play('boss: soundwave guard', 'b');
  const saved = JSON.parse(g.files('<!-- boss:start --><!-- boss:end -->').state);
  const h = game(saved); assert.deepStrictEqual(h.db.state, g.db.state); assert(h.play('boss: soundwave atk')[0]);
});
t('Scene: Soundwave is mirrored and both sprites are in the SVG', () => {
  const g = game({}); const svg = g.files('').svg; const S = require(R + 'sprites');
  assert(svg.includes(S.sw) && svg.includes(S.shock)); assert(/scale\(-1 1\)/.test(svg));
});
t('1000 full duels with random players: always ends, no crash, sane rounds', () => {
  let wins = 0, maxR = 0; const mv = ['atk', 'skill1', 'skill2', 'guard', 'limit'];
  for (let n = 0; n < 1000; n++) {
    const g = game({}); let i = 0;
    while (g.db.state.mode !== 'over' && i++ < 500) { const s = g.db.state; const m = s.lim[0] >= 100 ? 'limit' : mv[Math.floor(Math.random() * 4)]; g.play('boss: soundwave ' + m); }
    assert.strictEqual(g.db.state.mode, 'over'); wins += g.db.state.win; maxR = Math.max(maxR, g.db.state.round);
    assert(g.db.state.hp[0] >= 0 && g.db.state.boss >= 0 && g.db.state.boss <= SHOCK.max);
  }
  assert(maxR < 60, 'longest duel ' + maxR);
});
t('Balance: watching the charge wins, button mashing mostly does not, no single button dominates', () => {
  const run = (pick) => { let w = 0; for (let n = 0; n < 1500; n++) { const c = new Component({});
    for (let g = 0; g < 300 && c.state.mode !== 'over'; g++) { const s = c.state, k = s.k; c.act(...pick(s)); if (c.state.k === k) c.act('atk'); while (c.state.mode === 'enemy') c.enemyTurn(); }
    w += c.state.win; } return w / 1500; };
  const L = (s, m) => (s.lim[0] >= 100 ? ['limit'] : m);
  const attack = run((s) => L(s, ['atk']));
  const beak = run((s) => L(s, s.ep[0] >= H.skills[0].ep ? ['skill', 0] : ['atk']));
  const watch = run((s) => L(s, s.charged ? ['guard'] : ['atk']));
  assert(watch > 0.85, 'guarding the charge ' + watch);
  assert(attack > 0.15 && attack < 0.6, 'only attacking ' + attack);
  assert(beak > 0.15 && beak < 0.6, 'LASERBEAK spam ' + beak);
});
t('Issue route: turn.js plays the queue, rejects old hero titles, writes the files', () => {
  const os = require('node:os'), { execFileSync } = require('node:child_process');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'duel-'));
  fs.cpSync(R, path.join(tmp, 'game'), { recursive: true }); fs.mkdirSync(path.join(tmp, 'assets'));
  fs.copyFileSync(R + '../README.md', path.join(tmp, 'README.md'));
  fs.writeFileSync(path.join(tmp, 'game/state.json'), '{}');
  const ISSUES = JSON.stringify([{ number: 1, title: 'boss: soundwave atk', player: 'a' }, { number: 2, title: 'boss: hotrod atk', player: 'b' }, { number: 3, title: 'boss: guard', player: 'c' }]);
  execFileSync('node', [path.join(tmp, 'game/turn.js')], { env: { ...process.env, ISSUES } });
  const replies = JSON.parse(fs.readFileSync(path.join(tmp, 'replies.json'), 'utf8'));
  assert.deepStrictEqual(replies.map((r) => r.ok), [true, false, true]);
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(tmp, 'game/state.json'), 'utf8')).state.k, 4);
  assert(fs.readFileSync(path.join(tmp, 'assets/boss.svg'), 'utf8').startsWith('<svg'));
  fs.rmSync(tmp, { recursive: true });
});
