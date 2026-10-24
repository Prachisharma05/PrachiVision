import assert from 'node:assert/strict';
const base = process.env.CHECK_BASE_URL || 'http://127.0.0.1:3000';
const routes = ['/', '/about', '/projects', '/research', '/achievements', '/updates', '/club', '/contact', '/admin', '/projects/multimodal-video-understanding', '/projects/vision-language-image-dehazing', '/projects/resilient-traffic-control', '/projects/ai-financial-wellbeing', '/robots.txt', '/sitemap.xml', '/og-cover.png'];
for (const route of routes) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.doesNotMatch(html, /techfaizan|faizanahmed|AI &amp; Robotics/i, route);
  if (['/', '/about', '/contact'].includes(route)) {
    assert.doesNotMatch(html, /href="mailto:|profile-placeholder|Download résumé/, 'Empty contact and upload fields should not appear');
  }
  if (route === '/admin') assert.match(html, /Connect Supabase/);
}
for (const route of ['/projects/no-such-project', '/research/no-such-paper', '/achievements/no-such-award', '/updates/no-such-update']) {
  assert.equal((await fetch(base + route)).status, 404, route);
}
const valid = { name: 'Local QA', email: 'qa@example.com', subject: 'Local validation', message: 'This is a local validation message only.' };
const send = (body, headers = {}) => fetch(base + '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
assert.equal((await send({})).status, 400);
assert.equal((await send('{malformed')).status, 400);
assert.equal((await send(valid, { origin: 'https://other.example' })).status, 403);
assert.equal((await send('x'.repeat(12001))).status, 413);
assert.equal((await send({ ...valid, website: 'spam.example' })).status, 200);
console.log(`HTTP checks passed: ${routes.length} routes, 4 missing entries, empty fields, and contact validation without sending email.`);
