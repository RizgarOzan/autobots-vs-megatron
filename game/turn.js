// Plays every open `boss:` issue as Soundwave's move in the duel, oldest first, so a queued or cancelled run never loses a move.
//   node game/turn.js            play the queue, write state.json, boss.svg, the README block and replies.json
//   node game/turn.js --reply    comment on and close each issue from replies.json (OK=true when the push went through)
// Titles: `boss: soundwave <move>` or just `boss: <move>`.
// Moves: atk | skill1 | skill2 | guard | limit | new. Locally, pass the queue as ISSUES='[{"number":1,"title":"boss: atk","player":"me"}]'.
// The fight rules and the README block live in core.js, shared with the one-click Worker.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { game, REPO } = require('./core');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'game/state.json');
const REPLIES = path.join(ROOT, 'replies.json');
const gh = (...a) => execFileSync('gh', [...a, '--repo', REPO], { encoding: 'utf8' });

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

const g = game(fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {});
const replies = issues.map((i) => {
  const [ok, text] = g.play(i.title, String(i.player).replace(/[^\w-]/g, ''));
  return { number: i.number, ok, text };
});
fs.writeFileSync(REPLIES, JSON.stringify(replies, null, 1));
// nothing played: leave the files alone, a redraw alone would still change boss.svg and make an empty commit
if (!g.db.state || !replies.some((r) => r.ok)) process.exit(0);

const RM = path.join(ROOT, 'README.md');
const out = g.files(fs.readFileSync(RM, 'utf8'));
fs.writeFileSync(STATE, out.state);
fs.writeFileSync(path.join(ROOT, 'assets/boss.svg'), out.svg);
fs.writeFileSync(RM, out.readme);
const s = g.db.state;
console.log(replies.map((r) => `#${r.number} ${r.ok ? 'played' : 'rejected'}`).join(', ') || 'no moves', '->', s.mode, 'round', s.round, 'boss', s.boss);
