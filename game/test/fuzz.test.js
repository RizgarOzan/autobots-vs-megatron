// Every step of 800 random duels: replay the rules by hand and compare with what the engine did.
const { test } = require('node:test');
const assert = require('node:assert');
const { Component, SOUNDWAVE: H, SHOCK } = require('../engine');
test('fuzz: 800 random duels follow the rules at every step', () => {
const M = SHOCK.moves, bad = {}; let steps = 0, duels = 0;
const flag = (k, msg) => { (bad[k] = bad[k] || []).length < 3 && bad[k].push(msg); };
const MV = [['atk'], ['skill', 0], ['skill', 1], ['guard'], ['limit']];
for (let d = 0; d < 800; d++) {
  const c = new Component({}); duels++;
  for (let g = 0; g < 300 && c.state.mode !== 'over'; g++) {
    const b = JSON.parse(JSON.stringify(c.state)); const next = c.state.next;
    const mv = MV[Math.floor(Math.random() * MV.length)];
    c.act(...mv);
    const a1 = JSON.parse(JSON.stringify(c.state));
    const name = mv[0] === 'skill' ? 'skill' + mv[1] : mv[0];
    // refusals
    const cost = mv[0] === 'skill' ? H.skills[mv[1]].ep : 0;
    if (mv[0] === 'skill' && b.ep[0] < cost) { if (a1.k !== b.k) flag('skill without EP played', JSON.stringify(b.ep)); continue; }
    if (mv[0] === 'limit' && b.lim[0] < 100) { if (a1.k !== b.k) flag('limit under 100 played', b.lim[0]); continue; }
    if (a1.k !== b.k + 1) { flag('valid move refused', name); break; }
    steps++;
    const dealt = b.boss - a1.boss;
    const [B, Sc] = H.skills, rng = { atk: [H.atk[1], H.atk[2]], skill0: [2 * B.a, 2 * B.b], skill1: [Sc.a, Sc.b], guard: [0, 0], limit: [H.limit[1], H.limit[2]] }[name];
    if (a1.boss > 0 && (dealt < rng[0] || dealt > rng[1])) flag('player damage out of range', name + ' ' + dealt);
    if (a1.mode === 'over') { if (!a1.win || a1.boss !== 0) flag('win state wrong', JSON.stringify(a1)); if (a1.hp[0] !== b.hp[0]) flag('Shockwave hit after dying', ''); continue; }
    while (c.state.mode === 'enemy') c.enemyTurn();
    const a = c.state;
    // Shockwave's answer is the planned move
    if (a.fx.banner !== next.n) flag('Shockwave played something other than his plan', next.n + ' vs ' + a.fx.banner);
    const taken = b.hp[0] - a.hp[0];
    if (next.charge || next.heal) { if (taken !== 0) flag('charge/repair hurt Soundwave', taken); }
    else if (a.mode !== 'over' || a.hp[0] > 0) {
      let lo = next.a, hi = next.b;
      // the engine rounds after each multiplier
      const f = (x) => { let y = x; if (name === 'skill1') y = Math.round(y * 0.5); if (name === 'guard' && !next.pierce) y = Math.round(y * 0.35); return y; };
      if (taken < f(lo) || taken > f(hi)) flag('damage taken out of range', `${next.n} after ${name}: ${taken} not in ${f(lo)}-${f(hi)}`);
    }
    if (next.heal) { if (a.boss !== Math.min(SHOCK.max, a1.boss + next.heal)) flag('repair amount wrong', `${a1.boss} -> ${a.boss}`); }
    if (a.repairs > 2) flag('more than two repairs', a.repairs);
    // bounds
    if (a.hp[0] < 0 || a.hp[0] > H.max) flag('Soundwave HP out of bounds', a.hp[0]);
    if (a.boss < 0 || a.boss > SHOCK.max) flag('Shockwave HP out of bounds', a.boss);
    if (a.ep[0] < 0 || a.ep[0] > H.ep) flag('EP out of bounds', a.ep[0]);
    if (a.lim[0] < 0 || a.lim[0] > 100) flag('limit out of bounds', a.lim[0]);
    if (a.mode === 'over') { if (a.win || a.hp[0] !== 0) flag('loss state wrong', ''); continue; }
    // EP: cost, guard bonus, drain, regen, cap
    let ep = b.ep[0] - cost; if (name === 'guard') ep = Math.min(H.ep, ep + H.guardEp);
    if (next.drain) ep = Math.max(0, ep - next.drain); ep = Math.min(H.ep, ep + H.regen);
    if (a.ep[0] !== ep) flag('EP bookkeeping wrong', `${name}/${next.n}: ${b.ep[0]} -> ${a.ep[0]}, expected ${ep}`);
    // limit: the move's own gain (LIMIT empties it), then a share of the damage taken, capped at 100
    let lim = name === 'limit' ? 0 : Math.min(100, b.lim[0] + ({ atk: 10, skill0: 6, skill1: 6, guard: H.guardLim }[name]));
    if (taken > 0) lim = Math.min(100, lim + Math.round(taken / 14));
    if (a.lim[0] !== lim) flag('limit bookkeeping wrong', `${name}/${next.n}: ${b.lim[0]} -> ${a.lim[0]}, expected ${lim}`);
    // the plan for next round
    if (next.charge && a.next !== M.blast) flag('charge not followed by LOGIC CANNON', a.next.n);
    if (a.next === M.blast && !next.charge) flag('LOGIC CANNON without a charge', '');
    if (a.next === next && !next.charge) flag('repeated move', next.n);
    if (a.charged !== !!next.charge) flag('charged flag wrong', next.n);
    if (a.scouted !== (name === 'skill1')) flag('scouted flag wrong', name);
    if (!a.why) flag('plan without a reason', a.next.n);
    if (a.round !== b.round + 1 || a.k !== b.k + 2) flag('round/k wrong', `${b.round}->${a.round} ${b.k}->${a.k}`);
    if (a.guard[0] || a.shield) flag('guard/shield carried over', '');
  }
  if (c.state.mode !== 'over') flag('duel never ended', c.state.round);
}
const keys = Object.keys(bad);
assert(steps > 5000, 'only ' + steps + ' moves checked');
assert.deepStrictEqual(keys.map((k) => `${k}: ${bad[k].join(' | ')}`), []);
});
