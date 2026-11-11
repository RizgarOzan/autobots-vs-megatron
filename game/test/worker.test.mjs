// The one-click Worker against a fake GitHub API: a real click commits once and sends the visitor back,
// stale links, bots and old hero links are turned away without a commit.
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const worker = (await import(path.join(R, 'worker/index.js'))).default;
const { game } = (await import(path.join(R, 'game/core.js'))).default;

// a tiny in-memory repo: refs, contents, trees and commits
const files = { 'game/state.json': game({}).files('<!-- boss:start --><!-- boss:end -->').state, 'README.md': fs.readFileSync(path.join(R, 'README.md'), 'utf8') };
let head = 'c0', commits = 0, pending = null, race = false, moved = () => new Date().toISOString();
globalThis.fetch = async (url, init = {}) => {
  const p = new URL(url).pathname.replace('/repos/RizgarOzan/autobots-vs-megatron', '');
  const ok = (body, raw) => new Response(raw ? body : JSON.stringify(body), { status: 200 });
  if (p === '/git/ref/heads/main') return ok({ object: { sha: head } });
  if (p.startsWith('/git/commits/') && !init.method) return ok({ tree: { sha: 't' + head }, committer: { date: moved() } });
  if (p.startsWith('/contents/')) return ok(files[p.slice(10)], true);
  if (p === '/git/trees') { pending = JSON.parse(init.body).tree; return ok({ sha: 'tree' }); }
  if (p === '/git/commits') return ok({ sha: 'n' + commits });
  if (p === '/git/refs/heads/main') {
    if (race) return new Response('{}', { status: 422 });
    commits++; head = 'c' + commits; for (const f of pending) { if (f.sha === null) delete files[f.path]; else files[f.path] = f.content; } return ok({});
  }
  return new Response('nope', { status: 404 });
};
const click = (q, ua = 'Mozilla/5.0') => worker.fetch(new Request('https://w.dev/move?' + q, { headers: { 'user-agent': ua } }), { GH_TOKEN: 'x' });
const k = () => JSON.parse(files['game/state.json']).state.k;

test('a click plays the move, commits once and redirects to the duel', async () => {
  const r = await click(`h=soundwave&m=atk&k=${k()}`);
  assert.strictEqual(r.status, 303); assert.match(r.headers.get('location'), /#duel-soundwave-vs-shockwave$/);
  assert.strictEqual(commits, 1); assert.strictEqual(k(), 2);
  const scenes = Object.keys(files).filter((f) => f.startsWith('assets/scene-'));
  assert.strictEqual(scenes.length, 1); assert(files[scenes[0]].startsWith('<svg')); assert(files['README.md'].includes(`src="${scenes[0]}"`));
});
test('a stale link (old k) right after a move is refused without a commit', async () => {
  const r = await click('h=soundwave&m=atk&k=0'); assert.match(await r.text(), /Someone moved before you/); assert.strictEqual(commits, 1);
});
test('a stale link from a cached README plays once the last move is a few seconds old', async () => {
  moved = () => new Date(Date.now() - 60000).toISOString();
  const r = await click('h=soundwave&m=guard&k=0'); moved = () => new Date().toISOString();
  assert.strictEqual(r.status, 303); assert.strictEqual(commits, 2);
});
test('link checkers and bots never play', async () => {
  const r = await click(`h=soundwave&m=guard&k=${k()}`, 'curl/8.0'); assert.match(await r.text(), /Open this link in a browser/); assert.strictEqual(commits, 2);
});
test('an old hero link gets a pointer to the duel', async () => {
  const r = await click(`h=hotrod&m=atk&k=${k()}`); assert.match(await r.text(), /The fight is a duel now/); assert.strictEqual(commits, 2);
});
test('two clicks at the same moment: the loser is told, nothing breaks', async () => {
  race = true; const r = await click(`h=soundwave&m=atk&k=${k()}`); race = false;
  assert.match(await r.text(), /got there first/); assert.strictEqual(commits, 2);
});
test('MIND SCAN by click puts the plan in the README, and the old scene file is deleted', async () => {
  await click(`h=soundwave&m=skill2&k=${k()}`);
  assert.strictEqual(Object.keys(files).filter((f) => f.startsWith('assets/scene-')).length, 1); assert.strictEqual(commits, 3); assert.match(files['README.md'], /Mind scan:\*\* Shockwave plans/);
});
