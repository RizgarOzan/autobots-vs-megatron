// The fight itself, shared by the issue Action (turn.js) and the one-click Worker (worker/index.js).
// No fs, no network: it takes the saved state, plays moves, and hands back the files to write.
const { Component, HEROES, BOSS } = require('./engine');
const render = require('./render');
const { WAVES, use, rename, carry } = require('./waves');

const REPO = 'RizgarOzan/autobots-vs-megatron';
const URL = `https://github.com/${REPO}`;
const ANCHOR = `${URL}#boss-fight-autobots-vs-megatron`;
// one-click links go to the Worker; set it to '' and the README falls back to issue links
const WORKER = 'https://autobots-boss.rizgarozan7.workers.dev';
const key = (H) => H.n.toLowerCase().replace(/\s/g, '');
const MOVES = { atk: ['atk'], skill1: ['skill', 0], skill2: ['skill', 1], guard: ['guard'], limit: ['limit'] };
const EFFECT = {
  SCOUT: 'Reveal his next move, party takes 40% less this round', 'ENERGON SHARE': 'Heal every hero +240 HP',
  'ME GRIMLOCK KING': 'Taunt: single-target hits go to Grimlock', 'FIRE BREATH': 'Hit for 400–480',
  AFTERBURN: 'Hit twice for 150–190 each', RALLY: 'Team +10 EP and +25 limit',
};

function game(saved = {}) {
  // crowd: what anonymous one-click players did together, so the board isn't frozen on issue players
  const db = { state: saved.state || null, log: saved.log || [], stats: saved.stats || {}, crowd: saved.crowd || { dmg: 0, moves: 0 }, hall: saved.hall || [],
    // damage per hero this fight and the single biggest hit, drawn as numbers on the scene
    dmg: saved.dmg || [0, 0, 0], best: saved.best || null,
    // which Decepticon is up: 0 Megatron, 1 Starscream, 2 Shockwave
    wave: saved.wave || 0 };
  use(db.wave);
  const foe = () => WAVES[db.wave];
  const c = new Component({});
  // every state change the engine makes, so the log keeps hero lines that phase 2 would overwrite
  const steps = [];
  const set = c.setState.bind(c);
  c.setState = (st) => { for (const f of ['line', 'speaker']) if (f in st) st[f] = rename(foe(), st[f]); steps.push(st); set(st); };
  const nameOf = (k) => (HEROES.find((H) => key(H) === k) || {}).n;
  let prevBoss = null, hit = null;

  // player is a GitHub login from an issue, or null for an anonymous one-click move
  function play(title, player) {
    const who = player ? `@${player}` : 'A visitor';
    const words = title.replace(/^boss:\s*/i, '').trim().toLowerCase().split(/\s+/);
    const [hero, move] = words.length > 1 ? words : [null, words[0]];
    const s = db.state;
    if (move === 'new') {
      if (s && s.mode !== 'over') return [false, `A fight is still going (round ${s.round}). A new one can start after VICTORY or GAME OVER.`];
      db.wave = 0; use(0); db.state = c.fresh(); db.log = [`${who} started a new fight.`]; db.stats = {}; db.crowd = { dmg: 0, moves: 0 }; db.dmg = [0, 0, 0]; db.best = null;
      return [true, `New fight started. Megatron is waiting on the [README](${ANCHOR}).`];
    }
    if (!s) return [false, 'No fight yet. Start a new one first.'];
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
    // the enemy turn overwrites fx, so keep the hero's own move for the picture
    hit = { n: H.n, banner: steps[0].fx.banner, pops: steps[0].fx.onBoss ? steps[0].fx.pops : [], limit: move === 'limit' };
    const me = player ? (db.stats[player] = db.stats[player] || { dmg: 0, moves: 0 }) : db.crowd;
    me.dmg += dealt; me.moves += 1;
    db.dmg[HEROES.indexOf(H)] += dealt;
    if (dealt > (db.best ? db.best.d : 0)) db.best = { n: H.n, d: dealt };
    // the hero's own move; when it tips Megatron into phase 2 the engine swaps the line for the phase 2 text
    const st0 = steps[0], dmg = (st0.fx.pops || []).map((p) => p.t).join(' + ');
    const mine = st0.p2 && !wasP2 ? `${H.n} uses ${st0.fx.banner}${dmg ? '. ' + dmg + ' damage' : ''}.` : st0.line;
    const lines = [player ? `@${player} · ${H.n}: ${mine}` : mine, ...(st0.p2 && !wasP2 ? [BOSS.p2] : []), ...steps.slice(1).map((st) => st.line)];
    let ns = c.state;
    // a boss is down and another is waiting: the party patches up and the next wave starts on the next click
    if (ns.mode === 'over' && ns.win && db.wave < WAVES.length - 1) {
      lines.push(`${who} took down ${foe().who}.`);
      db.wave += 1;
      ns = c.state = carry(c, HEROES, ns, db.wave);
      // the last hit was on the old boss, the new one walks in clean
      hit = null; prevBoss = null;
      lines.push(ns.line);
    }
    if (ns.mode === 'over') {
      if (ns.win) lines.push(`${who} landed the final blow.`);
      const mvp = Object.entries(db.stats).sort((a, b) => b[1].dmg - a[1].dmg)[0];
      db.hall.unshift({ foe: foe().who, date: new Date().toISOString().slice(0, 10), win: ns.win, rounds: ns.round, players: Object.keys(db.stats).length, clicks: db.crowd.moves, mvp: mvp ? mvp[0] : player, last: player });
      db.hall.length = Math.min(db.hall.length, 10);
    }
    db.log.push(...lines);
    db.state = ns;
    const hpLine = HEROES.map((h, q) => `${h.n} ${ns.hp[q]}/${h.max}`).join(' · ');
    const end = ns.mode === 'over' ? (ns.win ? '**VICTORY!** All three Decepticons are down.' : `**GAME OVER.** The Autobots fell to ${foe().who}.`)
      : `${foe().who} **${ns.boss}/${BOSS.max}** (wave ${db.wave + 1}/${WAVES.length}) · ${hpLine}\n\nNext up: **${HEROES[ns.active].n}**. [Back to the fight](${ANCHOR})`;
    const foes = lines.slice(1).map((l) => '> ' + l).join('\n');
    return [true, [`You played **${H.n}**: ${mine}`, foes, end].filter(Boolean).join('\n\n')];
  }

  // state.json, boss.svg and the README with its fight block redrawn
  function files(readme) {
    const s = (c.state = db.state);
    db.log.splice(0, Math.max(0, db.log.length - 8));
    const v = c.renderVals(), w = foe();
    // the engine's panel text says Megatron, name the wave's boss and show the wave count
    v.foes[0].n = w.name; v.speaker = rename(w, v.speaker); v.waitText = rename(w, v.waitText);
    v.overSub = s.win ? `Round ${s.round} · all three Decepticons are down` : `${w.who} wins this round`;
    if (!s.p2 && s.boss > 0) v.foes[0].tag = `WAVE ${db.wave + 1}/${WAVES.length}`;
    const svg = render(v, s, { prevBoss, hit, log: db.log, dmg: db.dmg, best: db.best, foe: w });

    // a move link: straight to the Worker when it's deployed, otherwise a prefilled issue
    const link = (label, m) => {
      const [h, mv] = m.includes(' ') ? m.split(' ') : ['', m];
      const href = WORKER ? `${WORKER}/move?${h ? `h=${h}&` : ''}m=${mv}&k=${s.k}`
        : `${URL}/issues/new?title=${encodeURIComponent('boss: ' + m)}&body=${encodeURIComponent('Just press Submit. A GitHub Action plays the move and updates the README in about a minute.')}`;
      return `[**${label}**](${href})`;
    };
    let status, block;
    if (s.mode === 'over') {
      status = s.win ? '🏆 **VICTORY.** Megatron, Starscream and Shockwave are all down.' : `💀 **GAME OVER.** ${foe().who} wins this round.`;
      block = link('▶ START A NEW FIGHT', 'new');
    } else {
      const i = s.active, H = HEROES[i], hk = key(H) + ' ';
      status = `**${H.n}'s turn** · round ${s.round} · wave ${db.wave + 1}/${WAVES.length}: ${foe().who} ${s.boss}/${BOSS.max}. Pick a move ↓`;
      const rows = [
        `| ${link('ATTACK', hk + 'atk')} | – | ${H.atk[0]}: hit for ${H.atk[1]}–${H.atk[2]} |`,
        ...H.skills.map((x, j) => `| ${s.ep[i] >= x.ep ? link(x.n, hk + 'skill' + (j + 1)) : `~~${x.n}~~`} | ${x.ep} EP${s.ep[i] < x.ep ? ` (has ${s.ep[i]})` : ''} | ${EFFECT[x.n] || x.h} |`),
        `| ${link('GUARD', hk + 'guard')} | – | Take ½ damage this round, +8 EP |`,
        `| ${s.lim[i] >= 100 ? link('LIMIT: ' + H.limit[0], hk + 'limit') : 'LIMIT: ' + H.limit[0]} | ${s.lim[i]}% | ${s.lim[i] >= 100 ? `Ready! Hit for ${H.limit[1]}–${H.limit[2]}` : 'Locked, fills as you attack and take hits'} |`,
      ];
      const warn = s.charged ? `> ⚠️ **${foe().who} is charging ${BOSS.blast.n}.** It hits everyone for ${BOSS.blast.a}–${BOSS.blast.b} at the end of this round. GUARD halves it${s.active === 0 ? ', and SCOUT cuts it by 40% for the whole party' : ''}.\n\n` : '';
      block = `${warn}| Move | Cost | Effect |\n|---|---|---|\n${rows.join('\n')}`;
    }
    const top = [...Object.entries(db.stats).map(([u, v]) => ['@' + u, v]), ...(db.crowd.moves ? [[`one-click visitors (${db.crowd.moves} move${db.crowd.moves > 1 ? 's' : ''})`, db.crowd]] : [])]
      .sort((a, b) => b[1].dmg - a[1].dmg).slice(0, 5);
    const board = top.length ? `**Top damage this fight**: ${top.map(([u, v], n) => `${['🥇', '🥈', '🥉', '4.', '5.'][n]} ${u} ${v.dmg}`).join(' · ')}` : '';
    // workers.dev is blocked on some networks, so the issue route stays one click away
    const fallback = WORKER && s.mode !== 'over' ? `\n\n<sub>Move links not opening on your network? [Play it as an issue](${URL}/issues/new?title=${encodeURIComponent(`boss: ${key(HEROES[s.active])} atk`)}&body=${encodeURIComponent('Change atk to skill1, skill2, guard or limit for another move, then press Submit. A GitHub Action plays it and updates the README in about a minute.')}) instead.</sub>` : '';
    const recent = db.log.slice().reverse();
    const hall = db.hall.length ? `\n\n<details><summary>past fights</summary>\n\n| date | result | rounds | players | MVP |\n|---|---|---|---|---|\n${db.hall.map((h) => `| ${h.date} | ${h.win ? '🏆 won' : `💀 lost${h.foe ? ' to ' + h.foe : ''}`} | ${h.rounds} | ${h.players}${h.clicks ? ` + ${h.clicks} one-click move${h.clicks > 1 ? 's' : ''}` : ''} | ${h.mvp ? '@' + h.mvp : '–'} |`).join('\n')}\n\n</details>` : '';
    const next = s.mode === 'over' ? '' : ` Next: ${HEROES[s.active].n}'s turn.`;
    const section = `<!-- boss:start -->
${status}

<p align="center"><img src="assets/boss.svg?turn=${s.k}&amp;art=2" width="880" alt="Battle scene. ${s.line.replace(/"/g, "'")}${next}"></p>

${block}${fallback}

**Last moves**
${recent.slice(0, 3).map((l) => `- ${l}`).join('\n')}
${recent.length > 3 ? `\n<details><summary>earlier</summary>\n\n${recent.slice(3).map((l) => `- ${l}`).join('\n')}\n\n</details>\n` : ''}
${board}${hall}
<!-- boss:end -->`;
    return {
      state: JSON.stringify(db, null, 1),
      svg,
      readme: readme.replace(/<!-- boss:start -->[\s\S]*<!-- boss:end -->/, () => section),
    };
  }

  return { db, play, files };
}

module.exports = { game, REPO, URL, ANCHOR };
