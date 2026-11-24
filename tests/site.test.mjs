import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('shareable pages contain distinct metadata and crawlable navigation in HTML', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  const experience = await readFile('dist/experience/index.html', 'utf8');
  const pages = [
    { html: home, canonical: 'https://dfpf-26-27.pages.dev/' },
    { html: experience, canonical: 'https://dfpf-26-27.pages.dev/experience/' },
  ];

  const titles = [];
  const descriptions = [];

  for (const { html, canonical } of pages) {
    titles.push(html.match(/<title>([^<]+)<\/title>/)?.[1]);
    descriptions.push(html.match(/<meta name="description" content="([^"]+)"/)?.[1]);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.match(html, /<a href="\/experience\/"/);
  }

  assert.ok(titles.every(Boolean));
  assert.equal(new Set(titles).size, pages.length);
  assert.ok(descriptions.every(Boolean));
  assert.equal(new Set(descriptions).size, pages.length);
});

test('the theme toggle stays hidden without JavaScript and the theme is set before content renders', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  assert.match(html, /<button type="button" data-theme-toggle aria-pressed="false" hidden>/);
  assert.match(head, /dataset\.theme = theme/);
});

test('the generated not-found page is not presented as canonical content', async () => {
  const html = await readFile('dist/404.html', 'utf8');

  assert.match(html, /<h1>Page not found<\/h1>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
});
