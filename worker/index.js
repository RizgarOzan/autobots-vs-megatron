// One-click moves: a README link hits /move?h=soundwave&m=atk&k=12, this plays it, commits the new
// state.json, the scene and README in one commit (the old scene file is deleted in the same commit), and sends the visitor straight back to the fight.
// k is the turn the link was drawn for, so a double click or two players on the same turn can't play twice.
// An old link still plays once the last move is STALE_MS old: GitHub often shows a cached README for a while
// after a move, and refusing those clicks made moves look like they did nothing. Crawlers are kept out by user agent.
// Needs the secret GH_TOKEN: a fine-grained token with Contents read/write on this repo only.
import { game, REPO, URL as REPO_URL, ANCHOR } from '../game/core.js';

const FILES = { state: 'game/state.json', readme: 'README.md' };
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|curl|wget|python|go-http|node-fetch|axios/i;
const NO_STORE = { 'cache-control': 'no-store' };
const STALE_MS = 15000;

export default {
  async fetch(req, env) {
    const q = new URL(req.url).searchParams;
    if (new URL(req.url).pathname !== '/move') return Response.redirect(ANCHOR, 302);
    // only a real click plays: link checkers send HEAD, chat apps and crawlers fetch links to build previews
    if (req.method !== 'GET' || BOT.test(req.headers.get('user-agent') || '')) return page('Open this link in a browser to play the move.');
    const gh = async (p, init = {}, raw = false) => {
      const r = await fetch(`https://api.github.com/repos/${REPO}${p}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${env.GH_TOKEN}`, 'User-Agent': 'autobots-boss',
          Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
        },
      });
      if (!r.ok) throw Object.assign(new Error(`${p} ${r.status}`), { status: r.status });
      return raw ? r.text() : r.json();
    };

    try {
      const head = (await gh('/git/ref/heads/main')).object.sha;
      const [commit, state, readme] = await Promise.all([
        gh(`/git/commits/${head}`), gh(`/contents/${FILES.state}?ref=${head}`, {}, true), gh(`/contents/${FILES.readme}?ref=${head}`, {}, true),
      ]);
      const g = game(JSON.parse(state));
      // a missing commit date counts as just now, so the link is refused rather than played twice
      const age = Date.now() - Date.parse(commit.committer && commit.committer.date);
      if (g.db.state && String(g.db.state.k) !== q.get('k') && !(age > STALE_MS)) return page('Someone moved before you, so that link is out of date. Pick again from the fresh README.');
      const title = 'boss: ' + [q.get('h'), q.get('m')].filter(Boolean).join(' ');
      const [ok, text] = g.play(title, null);
      if (!ok) return page(text);

      const out = g.files(readme);
      const tree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({
        base_tree: commit.tree.sha,
        tree: [...Object.entries(FILES).map(([k, path]) => ({ path, mode: '100644', type: 'blob', content: out[k] })),
          { path: out.scene, mode: '100644', type: 'blob', content: out.svg },
          ...out.drop.map((path) => ({ path, mode: '100644', type: 'blob', sha: null }))],
      }) });
      const next = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message: `boss: one-click ${title.slice(6)}`, tree: tree.sha, parents: [head] }) });
      // not forced: if another move landed in the meantime GitHub refuses, and this one is dropped
      await gh('/git/refs/heads/main', { method: 'PATCH', body: JSON.stringify({ sha: next.sha, force: false }) });
      // the query only busts any page cache; GitHub ignores it
      return new Response(null, { status: 303, headers: { location: `${REPO_URL}?turn=${g.db.state.k}#duel-soundwave-vs-shockwave`, ...NO_STORE } });
    } catch (e) {
      if (e.status === 422) return page('Someone moved at the same moment and got there first. Pick again from the fresh README.');
      console.log(e.stack || e.message);
      return page("Something broke on my side and this move wasn't played. Please try again in a minute.", 500);
    }
  },
};

// the few markdown bits the game's messages use: **bold** and [text](link)
function page(md, status = 200) {
  const esc = md.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Autobots vs Megatron</title>
<body style="background:#0d1117;color:#e6edf3;font:18px/1.5 system-ui;max-width:560px;margin:15vh auto;padding:0 16px">
<p>${html}</p><p><a style="color:#f3c623" href="${ANCHOR}">← Back to the duel</a></p>`,
  { status, headers: { 'content-type': 'text/html; charset=utf-8', ...NO_STORE } });
}
