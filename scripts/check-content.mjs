import { strict as assert } from 'node:assert';
import { readFile, writeFile, mkdir, unlink, rmdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const temporary = path.join(root, 'node_modules', '.cache', 'prachivision-content-check');
await mkdir(temporary, { recursive: true });
const compiled = [];
try {
  for (const name of ['schema', 'default-content']) {
    const source = await readFile(path.join(root, 'lib', `${name}.ts`), 'utf8');
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    const filename = path.join(temporary, `${name}.mjs`);
    await writeFile(filename, output); compiled.push(filename);
  }
  const { parsePortfolio, publicPortfolio } = await import(pathToFileURL(compiled[0]).href);
  const { defaultContent } = await import(pathToFileURL(compiled[1]).href);
  const clone = () => structuredClone(defaultContent);
  assert.equal(parsePortfolio(defaultContent).projects.length, 4);
  assert.equal(defaultContent.profile.email, '');
  assert.equal(defaultContent.profile.logoUrl, '');
  assert.equal(defaultContent.experience[0].startDate, undefined);
  let data = clone(); data.projects[0].published = false;
  assert.equal(publicPortfolio(data).projects.some(p => p.id === data.projects[0].id), false, 'Drafts must not render');
  data = clone(); data.projects[0].title = '  ';
  assert.equal(publicPortfolio(data).projects.length, 3, 'Untitled entries must not render');
  data = clone(); data.profile.socials = [{ id: 'empty', label: 'GitHub', url: '  ', kind: 'github' }];
  data.skills.push({ id: 'blank', title: ' ', description: '', skills: [' '] });
  assert.equal(publicPortfolio(data).profile.socials.length, 0);
  assert.equal(publicPortfolio(data).skills.length, 4);
  data = clone(); data.profile.socials = [{ id: 'unsafe', label: 'Link', url: 'javascript:alert(1)', kind: 'custom' }];
  assert.throws(() => parsePortfolio(data), /URL/);
  data = clone(); data.profile.avatarUrl = '//untrusted.test/image.png';
  assert.throws(() => parsePortfolio(data), /URL/);
  data = clone(); data.projects[1].slug = data.projects[0].slug;
  assert.throws(() => parsePortfolio(data), /unique slug/);
  assert.throws(() => parsePortfolio({ profile: {} }));
  data = clone(); data.profile.email = 'invalid';
  assert.throws(() => parsePortfolio(data), /email/);
  data = clone(); data.profile.introduction = '';
  assert.equal(publicPortfolio(data).profile.introduction, '', 'Clearing a field must not restore fallback text');
  assert.match(publicPortfolio(defaultContent).profile.heroTitle, /\n/, 'Preserve multiline headlines');
  console.log('Content checks passed: drafts, empty fields, unsafe URLs, malformed backups, duplicate slugs, and initial facts.');
} finally {
  for (const filename of compiled) await unlink(filename);
  await rmdir(temporary);
}
