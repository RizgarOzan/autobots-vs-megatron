// One move per issue. The workflow passes the issue title and author through env:
//   TITLE="boss: atk" PLAYER=someone node game/turn.js
// Moves: atk | skill1 | skill2 | guard | limit | new
// Writes game/state.json, assets/boss.svg, the README block between the boss markers, and the issue reply (COMMENT file).
const fs = require('fs');
const path = require('path');
const { Component, HEROES, BOSS } = require('./engine');
const render = require('./render');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'game/state.json');
const REPO = process.env.GITHUB_REPOSITORY || 'RizgarOzan/autobots-vs-megatron';
const player = (process.env.PLAYER || 'someone').replace(/[^\w-]/g, '');
const move = String(process.env.TITLE || '').replace(/^boss:\s*/i, '').trim().toLowerCase();
const reply = (t) => fs.writeFileSync(process.env.COMMENT || path.join(ROOT, 'comment.md'), t + '\n');

const c = new Component({});
let saved = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : null;
const log = saved ? saved.log : [];

// every state change the engine makes, so the log keeps hero lines that phase 2 would overwrite
const steps = [];
const set = c.setState.bind(c);
c.setState = (st) => { steps.push(st); set(st); };

if (move === 'new') {
  if (saved && saved.state.mode !== 'over') { reply(`A fight is still going (round ${saved.state.round}). \`new\` only works after VICTORY or GAME OVER.`); process.exit(0); }
  c.state = c.fresh();
  log.length = 0;
  log.push(`@${player} started a new fight.`);
} else {
  if (!saved) { reply('No fight yet. Open a `boss: new` issue first.'); process.exit(0); }
  c.state = saved.state;
  const s = c.state, k = s.k, H = HEROES[s.active];
  const map = { atk: ['atk'], skill1: ['skill', 0], skill2: ['skill', 1], guard: ['guard'], limit: ['limit'] };
  if (!map[move]) { reply(`I don't know \`${move}\`. Use one of: atk, skill1, skill2, guard, limit, new.`); process.exit(0); }
  if (s.mode === 'over') { reply('This fight is over. Open a `boss: new` issue to start another.'); process.exit(0); }
  c.act(...map[move]);
  if (c.state.k === k) {
    const why = move === 'limit' ? `${H.n}'s limit is at ${s.lim[s.active]}%, it needs 100.` : `${H.n} has ${s.ep[s.active]} EP, ${H.skills[map[move][1]].n} costs ${H.skills[map[move][1]].ep}.`;
    reply(`That move can't be played right now: ${why}`); process.exit(0);
  }
  while (c.state.mode === 'enemy') c.enemyTurn();
  steps.forEach((st, i) => {
    if (i === 0) {
      // the hero's own move; when it tips Megatron into phase 2 the engine swaps the line for the phase 2 text
      const dmg = (st.fx.pops || []).map((p) => p.t).join(' + ');
      log.push(`@${player} · ${H.n}: ` + (st.p2 ? `${st.fx.banner}${dmg ? ', ' + dmg + ' damage' : ''}.` : st.line));
      if (st.p2) log.push(BOSS.p2);
    } else log.push(st.line);
  });
}

const s = c.state;
log.splice(0, Math.max(0, log.length - 8));
fs.writeFileSync(STATE, JSON.stringify({ state: s, log }, null, 1));
fs.writeFileSync(path.join(ROOT, 'assets/boss.svg'), render(c.renderVals(), s));

// README: scene image (cache-busted per turn) and the move links for whoever is up
const link = (label, m) => `[**${label}**](https://github.com/${REPO}/issues/new?title=${encodeURIComponent('boss: ' + m)}&body=${encodeURIComponent('Just press Submit. A GitHub Action plays the move and updates the README in about a minute.')})`;
let block;
if (s.mode === 'over') {
  block = `${s.win ? '🏆 **VICTORY.** Megatron retreats.' : '💀 **GAME OVER.** Megatron wins this round.'}\n\n${link('▶ NEW FIGHT', 'new')}`;
} else {
  const i = s.active, H = HEROES[i];
  const sk = H.skills.map((x, j) => (s.ep[i] >= x.ep ? link(`${x.n} (${x.ep} EP)`, 'skill' + (j + 1)) : `~~${x.n} (${x.ep} EP)~~`) + ` · ${x.h}`);
  block = [`**${H.n}'s turn** (round ${s.round}). Pick a move:`, '',
    `| move | what it does |`, `|---|---|`,
    `| ${link('ATTACK', 'atk')} | ${H.atk[0]}, ${H.atk[1]}–${H.atk[2]} damage |`,
    `| ${sk[0].split(' · ')[0]} | ${sk[0].split(' · ').slice(1).join(' · ')} |`,
    `| ${sk[1].split(' · ')[0]} | ${sk[1].split(' · ').slice(1).join(' · ')} |`,
    `| ${link('GUARD', 'guard')} | half damage this round, +8 EP |`,
    `| ${s.lim[i] >= 100 ? link('LIMIT: ' + H.limit[0], 'limit') : 'LIMIT: ' + H.limit[0]} | ${s.lim[i] >= 100 ? 'ready!' : s.lim[i] + '% charged'} |`].join('\n');
}
const recent = log.slice().reverse().map((l) => `- ${l}`).join('\n');
const section = `<!-- boss:start -->\n<p align="center"><img src="assets/boss.svg?turn=${s.k}" width="880" alt="Battle scene. ${s.line.replace(/"/g, "'")}"></p>\n\n${block}\n\n<details><summary>last moves</summary>\n\n${recent}\n\n</details>\n<!-- boss:end -->`;
const RM = path.join(ROOT, 'README.md');
const md = fs.readFileSync(RM, 'utf8');
fs.writeFileSync(RM, md.replace(/<!-- boss:start -->[\s\S]*<!-- boss:end -->/, section));

reply(move === 'new' ? 'New fight started. Megatron is waiting on the README.' : `Played. ${steps.length > 1 ? 'Megatron answered:' : ''}\n\n${steps.map((st) => '> ' + st.line).join('\n')}\n\n` + (s.mode === 'over' ? (s.win ? '**VICTORY!**' : '**GAME OVER.**') : `Next up: **${HEROES[s.active].n}**.`));
console.log(move, '->', s.mode, 'round', s.round, 'boss', s.boss, 'hp', s.hp.join('/'));
