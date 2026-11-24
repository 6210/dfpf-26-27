import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('shareable pages contain distinct metadata and crawlable navigation in HTML', async () => {
  const pages = [
    { file: 'dist/index.html', path: '/', label: 'Home' },
    { file: 'dist/experience/index.html', path: '/experience/', label: 'Experience' },
    { file: 'dist/skills/index.html', path: '/skills/', label: 'Skills' },
  ];

  const titles = [];
  const descriptions = [];

  for (const { file, path, label } of pages) {
    const html = await readFile(file, 'utf8');
    titles.push(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    descriptions.push(html.match(/<meta name="description" content="([^"]+)"/)?.[1]);
    assert.ok(html.includes(`<link rel="canonical" href="https://dfpf-26-27.pages.dev${path}">`));
    assert.match(html, /<meta name="robots" content="noindex">/);

    for (const navLabel of ['Main navigation', 'Footer navigation']) {
      const nav = html.match(new RegExp(`<nav aria-label="${navLabel}"[^>]*>(.*?)</nav>`, 's'))?.[1] ?? '';
      const context = `${navLabel} on ${path}`;
      assert.match(nav, new RegExp(`<a aria-current="page"[^>]*>${label}</a>`), `${context} marks the page current`);
      assert.doesNotMatch(nav, new RegExp(`href="${path}"`), `${context} does not link to the page`);
      for (const other of pages.filter((page) => page.path !== path)) {
        assert.match(nav, new RegExp(`<a href="${other.path}"[^>]*>${other.label}</a>`), `${context} links to ${other.path}`);
      }
    }

    const footer = html.match(/<footer[^>]*>(.*?)<\/footer>/s)?.[1] ?? '';
    assert.match(footer, new RegExp(`<time datetime="${new Date().getFullYear()}"`));
    assert.match(footer, /Gqeberha, South Africa/);
    assert.match(footer, /South Africa Standard Time \(SAST, UTC\+2\)/);
  }

  assert.ok(titles.every(Boolean));
  assert.equal(new Set(titles).size, pages.length);
  assert.ok(descriptions.every(Boolean));
  assert.equal(new Set(descriptions).size, pages.length);
});

test('the theme toggle stays hidden without JavaScript and the theme is set before content renders', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  assert.match(html, /<button type="button" data-theme-toggle hidden>/);
  assert.match(head, /dataset\.theme = theme/);
});

test('the generated not-found page is not presented as canonical content', async () => {
  const html = await readFile('dist/404.html', 'utf8');

  assert.match(html, /<h1>Page not found<\/h1>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
});
