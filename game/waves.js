// The Decepticons come in waves: beat Megatron and Starscream steps in, beat him and Shockwave is last.
// Megatron is the engine's own boss. The other two swap BOSS's numbers and lines, the engine's hard-coded
// "Megatron" in its log lines is renamed, and render.js draws their sprite where Megatron stands.
const { BOSS } = require('./engine');

const WAVES = [
  { ...JSON.parse(JSON.stringify(BOSS)), who: 'Megatron', chip: 'MEG', src: null, swap: [] },
  {
    who: 'Starscream', chip: 'STAR', src: 'data:image/png;base64,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', name: 'STARSCREAM', max: 4800,
    intro: 'Starscream dives out of the smoke. The Autobots patch each other up and stand ready.',
    open: 'Megatron has fallen? Then the Decepticons are MINE. Starting with your scrap!',
    win: "This isn't over! I'll be back… with reinforcements!",
    lose: 'Ha! Megatron could never have done this!',
    p2: 'Soundwave drops in beside Starscream. "Soundwave: following orders. Not yours."',
    megMoves: [
      { n: 'NULL RAY', a: 270, b: 330, beam: true, say: 'Your circuits will freeze solid, Autobot!' },
      { n: 'WING BLADE', a: 220, b: 270, say: 'Too slow! Far too slow!' },
      { n: 'AIR RAID', a: 150, b: 195, all: true, say: 'Bow before the true leader of the Decepticons!' },
      { n: 'AFTERBURNER CLIMB', charge: true, say: 'Up here, fools! Look up!' },
    ],
    blast: { n: 'NULL RAY STORM', a: 400, b: 470, all: true, beam: true, say: 'STARSCREAM. SUPREME!' },
    swap: [['charges his fusion cannon', 'climbs for a dive and arms both null rays']],
  },
  {
    who: 'Shockwave', chip: 'SHOCK', src: 'data:image/png;base64,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', name: 'SHOCKWAVE', max: 4800,
    intro: 'Shockwave walks out of the ruins, arm cannon humming. The last fight.',
    open: 'Megatron and Starscream, defeated. Statistically improbable. Correcting the error.',
    win: 'Illogical… this… is… illogical…',
    lose: 'As calculated.',
    p2: 'Soundwave steps up behind Shockwave. "Soundwave: assisting. Logic: shared."',
    megMoves: [
      { n: 'ARM CANNON', a: 320, b: 380, beam: true, say: 'Resistance is illogical.' },
      { n: 'CRUSHING GRIP', a: 250, b: 300, say: 'Your survival odds: negligible.' },
      { n: 'SHOCK PULSE', a: 160, b: 210, all: true, say: 'Logic dictates your extinction.' },
      { n: 'POWER DIVERT', charge: true, say: 'Diverting all power to the cannon. Calculating impact.' },
    ],
    blast: { n: 'LOGIC CANNON', a: 430, b: 500, all: true, beam: true, say: 'Logic. Is. Absolute.' },
    swap: [['charges his fusion cannon', 'diverts all power to his arm cannon']],
  },
];
// Soundwave keeps his moves but reports to whoever is in charge
WAVES.forEach((w) => { w.swMoves = WAVES[0].swMoves.map((m) => ({ ...m, say: m.say.replace('Megatron', w.who) })); });

// point the engine's BOSS at wave i; BOSS is shared by every request in a Worker, so always set every field
function use(i) {
  const w = WAVES[i];
  for (const f of ['name', 'max', 'open', 'win', 'lose', 'p2', 'megMoves', 'blast', 'swMoves']) BOSS[f] = w[f];
  return w;
}

// the engine's own text says "Megatron", say the wave's boss instead
const rename = (w, t) => (typeof t !== 'string' || w === WAVES[0] ? t
  : w.swap.reduce((s, [a, b]) => s.split(a).join(b), t).replace(/Megatron/g, w.who).replace(/MEGATRON/g, w.name));

// between waves: the living heal 60% of their max, the fallen get back up at 60%, EP gets half its max back,
// limit bars and the round count carry on
const HEAL = 0.6;
function carry(c, HEROES, s, i) {
  const w = use(i), f = c.fresh();
  f.hp = HEROES.map((h, q) => Math.min(h.max, Math.max(0, s.hp[q]) + Math.round(h.max * HEAL)));
  f.ep = HEROES.map((h, q) => Math.min(h.ep, s.ep[q] + Math.round(h.ep / 2)));
  f.lim = s.lim.slice();
  f.round = s.round + 1; f.k = s.k + 1;
  f.speaker = w.name; f.line = w.intro;
  return f;
}

module.exports = { WAVES, use, rename, carry };
