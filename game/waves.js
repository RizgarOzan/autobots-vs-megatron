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
    who: 'Shockwave', chip: 'SHOCK', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAACQCAMAAADNyu5UAAAAwFBMVEUAAAATER1PJHR7PbYnJjBiMpKoedw4O0aYZcqdo7E/G2cvGEVTUWd4gJOFQ87/0h+zt8ILCQ9HSVi7luRgX3QhDzAcHCFFO1pOExPMMzP/9rDDyNMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3xOKAAAAQHRSTlMA////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAQtvQAAA41JREFUeNrt24tyoyAUBuAcrSWtNebWbXf3/d9zOdw8ICogZMfUf2ZnlEa/MUE4mOzh8CMDmNmGPMzx2MBsQx6mrh3GbdiZZ2daHiAR+wWYI00jUoaphzwBc7FTjPnSKc0A9JjiTN8bpyDT/+FRTjmmN0xfhsH55XkYrhzrSz/kUuT+fCjzNShFGXLfFGWA3J0lGZFtM6AYex5omizTNJn5JeNOa017Iy9JPfkrz4kHi4vWz2BeZSJBuN1uryaC4UTrD1L2i0+nNYx1LeR6NswwmoLMWaXruqLMVacM8y5yPl//yly7TjZlZnjjCRlzNZ1syshw5x03OXN+E+GfTSeb+ECwVYYRhq1lPGOKYnhX0wxrNDMKBM8sznJplhm9PJxxhpRFxnr5BhgRm5G3Zw5GrZ7NqSijxxq5qo5ngM5aYHrFBAPy76SjQUR5oftNKGOO4IcHF0vDW+Aw4+lGMeYIiKjJphjP7Lkzy8y3THHmN6YMQ25ZlwH3iCQGRiPDt1T8DPZ0GGrkpdEmnvklwue9jslCmm+y2ap6gZE9YMSIQoTxAYJd9SbT9UkC43TobTLMHxwpeT4/1WeDjNmUW3HM2UonIxj+yqqCD4xgPvQme8HgyjuUwY6jJgFTqCGDy8UKk4XhjV5GDAEuI07+ksagM2LkSJTG8M9zSAAjnXhGd1lxdEmmMhkGKFNSMOaUF6mMKMBsZigp2nPX0gJjBcPrSZcxnUIwVhfZIvOui1lk9E4B5ibXmpJROyEMD8QwagUgGbnzSEY4qxg4jBlcIJRnAPcWGbCThyHB0iboyV0Co/6J7em3aS1Dn1/eizPiHWNlGfmxxDFmhCaMxBvJ6B1dP2nDMMsOnW+ANMozA7lgNQgQY7gaWFpH02OWGFyt3+/MZZY7NFil2CJzx9hM2F1jpvw0JvSpwCom+JuCNUzE1xHpTNx3HkAYOAQzsV+spDAJP1OaZkSRAWSgUEzST6EmGVkygbXXwj3x91ZRTPhTrZkv1CCAOeT+0VBxRqxhyYqH7mX8KRyQBQ/ODUDW7VVGpqqsFQ/UvilpZyaVEZPNeRhjpq2BGZoyMqo4oIxpysmoJ/aU0U078/8YqOd7WiYH6vn7Zmd2ZkuM9UzSy2RxdmZnnolxT+ljMjjPw4A30+2pzAfN8KDMbld/WcW8jKIZT3v6xYQzyc7O/HTGf7JpJtF5FANxg02B/2EYm38Y5KM6eIBwXwAAAABJRU5ErkJggg==', name: 'SHOCKWAVE', max: 4800,
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
