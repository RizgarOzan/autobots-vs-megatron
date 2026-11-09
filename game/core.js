// The duel itself, shared by the issue Action (turn.js) and the one-click Worker (worker/index.js).
// No fs, no network: it takes the saved state, plays moves, and hands back the files to write.
const { Component, SOUNDWAVE: H, SHOCK, SPR } = require('./engine');
const render = require('./render');

const REPO = 'RizgarOzan/autobots-vs-megatron';
const URL = `https://github.com/${REPO}`;
const ANCHOR = `${URL}#duel-soundwave-vs-shockwave`;
// one-click links go to the Worker; set it to '' and the README falls back to issue links
const WORKER = 'https://autobots-boss.rizgarozan7.workers.dev';
const HERO = 'soundwave';
const MOVES = { atk: ['atk'], skill1: ['skill', 0], skill2: ['skill', 1], guard: ['guard'], limit: ['limit'] };
const EFFECT = {
  LASERBEAK: 'Hit twice for 130–170 each',
  'MIND SCAN': "Take half damage this round, even from CRUSHING GRIP, and see Shockwave's plan and reasoning for next round",
};
const FOE = { who: SHOCK.who, name: SHOCK.name, chip: SHOCK.chip, src: SPR.shock.src };

function game(saved = {}) {
  // a save from the old three-hero boss fight starts a fresh duel; the past fights table is kept
  const old = !saved.duel;
  // crowd: what anonymous one-click players did together, so the board isn't frozen on issue players
  const db = { duel: true, state: old ? null : saved.state, log: old ? [] : saved.log || [], stats: old ? {} : saved.stats || {},
    crowd: old ? { dmg: 0, moves: 0 } : saved.crowd || { dmg: 0, moves: 0 }, hall: saved.hall || [], best: old ? null : saved.best || null };
  const c = new Component({});
  if (!db.state) { db.state = c.fresh(); db.log = ['Soundwave and Shockwave face off.']; }
  const steps = [];
  const set = c.setState.bind(c);
  c.setState = (st) => { steps.push(st); set(st); };
  let prevBoss = null, hit = null;

  // player is a GitHub login from an issue, or null for an anonymous one-click move
  function play(title, player) {
    const who = player ? `@${player}` : 'A visitor';
    const words = title.replace(/^(boss|duel):\s*/i, '').trim().toLowerCase().split(/\s+/);
    const [hero, move] = words.length > 1 ? words : [null, words[0]];
    const s = db.state;
    if (move === 'new') {
      if (s && s.mode !== 'over') return [false, `A duel is still going (round ${s.round}). A new one can start after VICTORY or DEFEAT.`];
      db.state = c.fresh(); db.log = [`${who} started a new duel.`]; db.stats = {}; db.crowd = { dmg: 0, moves: 0 }; db.best = null;
      return [true, `New duel started. Shockwave is waiting on the [README](${ANCHOR}).`];
    }
    if (hero && hero !== HERO) return [false, `The fight is a duel now: Soundwave against Shockwave. Pick a move from the [README](${ANCHOR}).`];
    if (!MOVES[move]) return [false, `I don't know that move. Pick one from the [README](${ANCHOR}).`];
    if (s.mode === 'over') return [false, `This duel is over. Start a new one from the [README](${ANCHOR}).`];
    c.state = s; steps.length = 0;
    // the engine's setState writes into the same object, so keep what we need from before the move
    const k = s.k, boss0 = s.boss;
    c.act(...MOVES[move]);
    if (c.state.k === k) {
      const sk = H.skills[MOVES[move][1]];
      return [false, `That move can't be played right now: ${move === 'limit' ? `the limit is at ${s.lim[0]}%, it needs 100.` : `Soundwave has ${s.ep[0]} EP, ${sk.n} costs ${sk.ep}.`}`];
    }
    const dealt = Math.max(0, boss0 - steps[0].boss);
    while (c.state.mode === 'enemy') c.enemyTurn();
    prevBoss = boss0;
    // Shockwave's turn overwrites fx, so keep Soundwave's own move for the picture
    hit = { n: H.n, banner: steps[0].fx.banner, pops: steps[0].fx.onBoss ? steps[0].fx.pops : [], limit: move === 'limit' };
    const me = player ? (db.stats[player] = db.stats[player] || { dmg: 0, moves: 0 }) : db.crowd;
    me.dmg += dealt; me.moves += 1;
    if (dealt > (db.best ? db.best.d : 0)) db.best = { n: player ? '@' + player : 'a visitor', d: dealt };
    const mine = steps[0].line;
    const lines = [player ? `@${player} · ${mine}` : mine, ...steps.slice(1).map((st) => st.line)];
    const ns = c.state;
    if (ns.mode === 'over') {
      lines.push(ns.win ? `${who} landed the final blow.` : 'Shockwave wins the duel.');
      const mvp = Object.entries(db.stats).sort((a, b) => b[1].dmg - a[1].dmg)[0];
      db.hall.unshift({ foe: 'Shockwave', date: new Date().toISOString().slice(0, 10), win: ns.win, rounds: ns.round, players: Object.keys(db.stats).length, clicks: db.crowd.moves, mvp: mvp ? mvp[0] : player, last: player });
      db.hall.length = Math.min(db.hall.length, 10);
    }
    db.log.push(...lines);
    const end = ns.mode === 'over' ? (ns.win ? '**VICTORY!** Shockwave is down.' : '**DEFEAT.** Shockwave wins the duel.')
      : `Shockwave **${ns.boss}/${SHOCK.max}** · Soundwave ${ns.hp[0]}/${H.max} · ${ns.ep[0]} EP\n\n[Back to the duel](${ANCHOR})`;
    const foes = lines.slice(1).map((l) => '> ' + l).join('\n');
    return [true, [`You played **${steps[0].fx.banner}**: ${mine}`, foes, end].filter(Boolean).join('\n\n')];
  }

  // state.json, boss.svg and the README with its duel block redrawn
  function files(readme) {
    const s = (c.state = db.state);
    db.log.splice(0, Math.max(0, db.log.length - 8));
    const v = c.renderVals();
    const svg = render(v, s, { prevBoss, hit, log: db.log, best: db.best, foe: FOE });

    // a move link: straight to the Worker when it's deployed, otherwise a prefilled issue
    const link = (label, m) => {
      const href = WORKER ? `${WORKER}/move?h=${HERO}&m=${m}&k=${s.k}`
        : `${URL}/issues/new?title=${encodeURIComponent(`boss: ${HERO} ${m}`)}&body=${encodeURIComponent('Just press Submit. A GitHub Action plays the move and updates the README in about a minute.')}`;
      return `[**${label}**](${href})`;
    };
    let status, block;
    if (s.mode === 'over') {
      status = s.win ? `🏆 **VICTORY** in round ${s.round}. Shockwave goes dark.` : `💀 **DEFEAT** in round ${s.round}. Shockwave wins the duel.`;
      block = link('▶ START A NEW DUEL', 'new');
    } else {
      status = `**Round ${s.round}** · Soundwave ${s.hp[0]}/${H.max} HP, ${s.ep[0]} EP · Shockwave ${s.boss}/${SHOCK.max}. Pick Soundwave's move ↓`;
      const rows = [
        `| ${link('ATTACK', 'atk')} | – | ${H.atk[0]}: hit for ${H.atk[1]}–${H.atk[2]} |`,
        ...H.skills.map((x, j) => `| ${s.ep[0] >= x.ep ? link(x.n, 'skill' + (j + 1)) : `~~${x.n}~~`} | ${x.ep} EP${s.ep[0] < x.ep ? ` (has ${s.ep[0]})` : ''} | ${EFFECT[x.n] || x.h} |`),
        `| ${link('GUARD', 'guard')} | – | Take a third of the damage this round, +${H.guardEp} EP. CRUSHING GRIP goes through it |`,
        `| ${s.lim[0] >= 100 ? link('LIMIT: ' + H.limit[0], 'limit') : 'LIMIT: ' + H.limit[0]} | ${s.lim[0]}% | ${s.lim[0] >= 100 ? `Ready! Hit for ${H.limit[1]}–${H.limit[2]}` : 'Locked, fills as you attack and take hits'} |`,
      ];
      const B = SHOCK.moves.blast;
      const warn = s.charged ? `> ⚠️ **Shockwave has charged the ${B.n}.** It hits for ${B.a}–${B.b} this round. GUARD or MIND SCAN cuts it down.\n\n`
        : s.scouted ? `> 🧠 **Mind scan:** Shockwave plans **${s.next.n}** next. His logic: "${s.why}"\n\n` : '';
      block = `${warn}| Move | Cost | Effect |\n|---|---|---|\n${rows.join('\n')}`;
    }
    const top = [...Object.entries(db.stats).map(([u, v]) => ['@' + u, v]), ...(db.crowd.moves ? [[`one-click visitors (${db.crowd.moves} move${db.crowd.moves > 1 ? 's' : ''})`, db.crowd]] : [])]
      .sort((a, b) => b[1].dmg - a[1].dmg).slice(0, 5);
    const board = top.length ? `**Top damage this duel**: ${top.map(([u, v], n) => `${['🥇', '🥈', '🥉', '4.', '5.'][n]} ${u} ${v.dmg}`).join(' · ')}` : '';
    // workers.dev is blocked on some networks, so the issue route stays one click away
    const fallback = WORKER && s.mode !== 'over' ? `\n\n<sub>Move links not opening on your network? [Play it as an issue](${URL}/issues/new?title=${encodeURIComponent(`boss: ${HERO} atk`)}&body=${encodeURIComponent('Change atk to skill1, skill2, guard or limit for another move, then press Submit. A GitHub Action plays it and updates the README in about a minute.')}) instead.</sub>` : '';
    const recent = db.log.slice().reverse();
    const hall = db.hall.length ? `\n\n<details><summary>past fights</summary>\n\n| date | result | rounds | players | MVP |\n|---|---|---|---|---|\n${db.hall.map((h) => `| ${h.date} | ${h.win ? `🏆 won${h.foe ? ' vs ' + h.foe : ''}` : `💀 lost${h.foe ? ' to ' + h.foe : ''}`} | ${h.rounds} | ${h.players}${h.clicks ? ` + ${h.clicks} one-click move${h.clicks > 1 ? 's' : ''}` : ''} | ${h.mvp ? '@' + h.mvp : '–'} |`).join('\n')}\n\n</details>` : '';
    const section = `<!-- boss:start -->
${status}

<p align="center"><img src="assets/boss.svg?turn=${s.k}&amp;art=5" width="880" alt="Duel scene. ${s.line.replace(/"/g, "'")}"></p>

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
