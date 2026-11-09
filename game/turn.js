// Plays every open `boss:` issue, oldest first, so a queued or cancelled run never loses a move.
//   node game/turn.js            play the queue, write state.json, boss.svg, the README block and replies.json
//   node game/turn.js --reply    comment on and close each issue from replies.json (OK=true when the push went through)
// Titles: `boss: <hero> <move>` (hero = bumblebee | grimlock | hotrod) or the older `boss: <move>`.
// Moves: atk | skill1 | skill2 | guard | limit | new. Locally, pass the queue as ISSUES='[{"number":1,"title":"boss: atk","player":"me"}]'.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Component, HEROES, BOSS } = require('./engine');
const render = require('./render');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'game/state.json');
const REPLIES = path.join(ROOT, 'replies.json');
const REPO = process.env.GITHUB_REPOSITORY || 'RizgarOzan/autobots-vs-megatron';
const URL = `https://github.com/${REPO}`;
const ANCHOR = `${URL}#boss-fight-autobots-vs-megatron`;
const gh = (...a) => execFileSync('gh', [...a, '--repo', REPO], { encoding: 'utf8' });
const key = (H) => H.n.toLowerCase().replace(/\s/g, '');

if (process.argv[2] === '--reply') {
  let list = fs.existsSync(REPLIES) ? JSON.parse(fs.readFileSync(REPLIES, 'utf8')) : null;
  if (process.env.OK !== 'true') {
    // the turn crashed or the push was rejected: nothing was saved, so say so instead of "played"
    const nums = list ? list.map((r) => r.number) : [Number(process.env.NUMBER)].filter(Boolean);
    list = nums.filter((n) => JSON.parse(gh('issue', 'view', String(n), '--json', 'state')).state === 'OPEN')
      .map((number) => ({ number, ok: false, text: "Something broke on my side and this move wasn't played. Please try again in a minute." }));
  }
  for (const r of list || []) {
    gh('issue', 'comment', String(r.number), '--body', r.text);
    gh('issue', 'close', String(r.number), '--reason', r.ok ? 'completed' : 'not planned');
  }
  process.exit(0);
}

const issues = process.env.ISSUES ? JSON.parse(process.env.ISSUES)
  : JSON.parse(gh('issue', 'list', '--state', 'open', '--limit', '100', '--json', 'number,title,author'))
    .filter((i) => /^boss:/i.test(i.title)).map((i) => ({ number: i.number, title: i.title, player: i.author.login }));
issues.sort((a, b) => a.number - b.number);

const saved = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const db = { state: saved.state || null, log: saved.log || [], stats: saved.stats || {}, hall: saved.hall || [] };
const c = new Component({});
// every state change the engine makes, so the log keeps hero lines that phase 2 would overwrite
const steps = [];
const set = c.setState.bind(c);
c.setState = (st) => { steps.push(st); set(st); };

const MOVES = { atk: ['atk'], skill1: ['skill', 0], skill2: ['skill', 1], guard: ['guard'], limit: ['limit'] };
const nameOf = (k) => (HEROES.find((H) => key(H) === k) || {}).n;
let prevBoss = null;

function play(title, player) {
  const words = title.replace(/^boss:\s*/i, '').trim().toLowerCase().split(/\s+/);
  const [hero, move] = words.length > 1 ? words : [null, words[0]];
  const s = db.state;
  if (move === 'new') {
    if (s && s.mode !== 'over') return [false, `A fight is still going (round ${s.round}). A new one can start after VICTORY or GAME OVER.`];
    db.state = c.fresh(); db.log = [`@${player} started a new fight.`]; db.stats = {};
    return [true, `New fight started. Megatron is waiting on the [README](${ANCHOR}).`];
  }
  if (!s) return [false, 'No fight yet. Open a `boss: new` issue first.'];
  if (!MOVES[move]) return [false, `I don't know that move. Pick one from the [README](${ANCHOR}).`];
  if (s.mode === 'over') return [false, `This fight is over. Start a new one from the [README](${ANCHOR}).`];
  const H = HEROES[s.active];
  if (hero && hero !== key(H)) {
    const was = nameOf(hero);
    return [false, `${was ? `That move was for **${was}**, but` : 'Wrong hero:'} it's **${H.n}**'s turn now, someone got there first. Pick again from the [README](${ANCHOR}).`];
  }
  c.state = s; steps.length = 0;
  // the engine's setState writes into the same object, so keep what we need from before the move
  const k = s.k, boss0 = s.boss, wasP2 = s.p2;
  c.act(...MOVES[move]);
  clearTimeout(c.to); // the canvas animation timer; enemy turns run right below instead
  if (c.state.k === k) {
    const sk = H.skills[MOVES[move][1]];
    return [false, `That move can't be played right now: ${move === 'limit' ? `${H.n}'s limit is at ${s.lim[s.active]}%, it needs 100.` : `${H.n} has ${s.ep[s.active]} EP, ${sk.n} costs ${sk.ep}.`}`];
  }
  const dealt = Math.max(0, boss0 - steps[0].boss);
  while (c.state.mode === 'enemy') c.enemyTurn();
  prevBoss = boss0;
  const me = (db.stats[player] = db.stats[player] || { dmg: 0, moves: 0 });
  me.dmg += dealt; me.moves += 1;
  // the hero's own move; when it tips Megatron into phase 2 the engine swaps the line for the phase 2 text
  const st0 = steps[0], dmg = (st0.fx.pops || []).map((p) => p.t).join(' + ');
  const mine = st0.p2 && !wasP2 ? `${H.n} uses ${st0.fx.banner}${dmg ? '. ' + dmg + ' damage' : ''}.` : st0.line;
  const lines = [`@${player} · ${H.n}: ${mine}`, ...(st0.p2 && !wasP2 ? [BOSS.p2] : []), ...steps.slice(1).map((st) => st.line)];
  const ns = c.state;
  if (ns.mode === 'over') {
    if (ns.win) lines.push(`@${player} landed the final blow.`);
    const mvp = Object.entries(db.stats).sort((a, b) => b[1].dmg - a[1].dmg)[0];
    db.hall.unshift({ date: new Date().toISOString().slice(0, 10), win: ns.win, rounds: ns.round, players: Object.keys(db.stats).length, mvp: mvp ? mvp[0] : player, last: player });
    db.hall.length = Math.min(db.hall.length, 10);
  }
  db.log.push(...lines);
  db.state = ns;
  const hpLine = HEROES.map((h, q) => `${h.n} ${ns.hp[q]}/${h.max}`).join(' · ');
  const end = ns.mode === 'over' ? (ns.win ? '**VICTORY!** Megatron retreats.' : '**GAME OVER.** The Autobots have fallen.')
    : `Megatron **${ns.boss}/${BOSS.max}** · ${hpLine}\n\nNext up: **${HEROES[ns.active].n}**. [Back to the fight](${ANCHOR})`;
  const foes = lines.slice(1).map((l) => '> ' + l).join('\n');
  return [true, [`You played **${H.n}**: ${mine}`, foes, end].filter(Boolean).join('\n\n')];
}

const replies = issues.map((i) => {
  const [ok, text] = play(i.title, String(i.player).replace(/[^\w-]/g, ''));
  return { number: i.number, ok, text };
});
fs.writeFileSync(REPLIES, JSON.stringify(replies, null, 1));
if (!db.state) process.exit(0);

const s = (c.state = db.state);
db.log.splice(0, Math.max(0, db.log.length - 8));
fs.writeFileSync(STATE, JSON.stringify(db, null, 1));
fs.writeFileSync(path.join(ROOT, 'assets/boss.svg'), render(c.renderVals(), s, { prevBoss, log: db.log }));

// README: scene image (cache-busted per turn) and the move table for whoever is up
const link = (label, m) => `[**${label}**](${URL}/issues/new?title=${encodeURIComponent('boss: ' + m)}&body=${encodeURIComponent('Just press Submit. A GitHub Action plays the move and updates the README in about a minute.')})`;
const EFFECT = {
  SCOUT: 'Reveal his next move, party takes 40% less this round', 'ENERGON SHARE': 'Heal every hero +240 HP',
  'ME GRIMLOCK KING': 'Taunt: single-target hits go to Grimlock', 'FIRE BREATH': 'Hit for 400–480',
  AFTERBURN: 'Hit twice for 150–190 each', RALLY: 'Team +10 EP and +25 limit',
};
let status, block;
if (s.mode === 'over') {
  status = s.win ? '🏆 **VICTORY.** Megatron retreats.' : '💀 **GAME OVER.** Megatron wins this round.';
  block = link('▶ START A NEW FIGHT', 'new');
} else {
  const i = s.active, H = HEROES[i], hk = key(H) + ' ';
  status = `**${H.n}'s turn** · round ${s.round} · Megatron ${s.boss}/${BOSS.max}. Pick a move ↓`;
  const rows = [
    `| ${link('ATTACK', hk + 'atk')} | – | ${H.atk[0]}: hit for ${H.atk[1]}–${H.atk[2]} |`,
    ...H.skills.map((x, j) => `| ${s.ep[i] >= x.ep ? link(x.n, hk + 'skill' + (j + 1)) : `~~${x.n}~~`} | ${x.ep} EP${s.ep[i] < x.ep ? ` (has ${s.ep[i]})` : ''} | ${EFFECT[x.n] || x.h} |`),
    `| ${link('GUARD', hk + 'guard')} | – | Take ½ damage this round, +8 EP |`,
    `| ${s.lim[i] >= 100 ? link('LIMIT: ' + H.limit[0], hk + 'limit') : 'LIMIT: ' + H.limit[0]} | ${s.lim[i]}% | ${s.lim[i] >= 100 ? `Ready! Hit for ${H.limit[1]}–${H.limit[2]}` : 'Locked, fills as you attack and take hits'} |`,
  ];
  const warn = s.charged ? `> ⚠️ **Megatron is charging FULL POWER BLAST.** It hits everyone for 440–520 at the end of this round. GUARD halves it${s.active === 0 ? ', and SCOUT cuts it by 40% for the whole party' : ''}.\n\n` : '';
  block = `${warn}| Move | Cost | Effect |\n|---|---|---|\n${rows.join('\n')}`;
}
const top = Object.entries(db.stats).sort((a, b) => b[1].dmg - a[1].dmg).slice(0, 5);
const board = top.length ? `**Top damage this fight** (${Object.keys(db.stats).length} player${Object.keys(db.stats).length > 1 ? 's' : ''}): ${top.map(([u, v], n) => `${['🥇', '🥈', '🥉', '4.', '5.'][n]} @${u} ${v.dmg}`).join(' · ')}` : '';
const recent = db.log.slice().reverse();
const hall = db.hall.length ? `\n\n<details><summary>past fights</summary>\n\n| date | result | rounds | players | MVP |\n|---|---|---|---|---|\n${db.hall.map((h) => `| ${h.date} | ${h.win ? '🏆 won' : '💀 lost'} | ${h.rounds} | ${h.players} | @${h.mvp} |`).join('\n')}\n\n</details>` : '';
const next = s.mode === 'over' ? '' : ` Next: ${HEROES[s.active].n}'s turn.`;
const section = `<!-- boss:start -->
${status}

<p align="center"><img src="assets/boss.svg?turn=${s.k}" width="880" alt="Battle scene. ${s.line.replace(/"/g, "'")}${next}"></p>

${block}

**Last moves**
${recent.slice(0, 3).map((l) => `- ${l}`).join('\n')}
${recent.length > 3 ? `\n<details><summary>earlier</summary>\n\n${recent.slice(3).map((l) => `- ${l}`).join('\n')}\n\n</details>\n` : ''}
${board}${hall}
<!-- boss:end -->`;
const RM = path.join(ROOT, 'README.md');
fs.writeFileSync(RM, fs.readFileSync(RM, 'utf8').replace(/<!-- boss:start -->[\s\S]*<!-- boss:end -->/, () => section));
console.log(replies.map((r) => `#${r.number} ${r.ok ? 'played' : 'rejected'}`).join(', ') || 'no moves', '->', s.mode, 'round', s.round, 'boss', s.boss);
