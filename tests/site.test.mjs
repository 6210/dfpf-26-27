import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

test('shareable pages contain distinct metadata and crawlable navigation in HTML', async () => {
  const pages = [
    { file: 'dist/index.html', path: '/', label: 'Home' },
    { file: 'dist/about/index.html', path: '/about/', label: 'About' },
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

test('the theme is set in the head before content renders, with a label for each theme', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  assert.match(head, /documentElement\.dataset\.theme = current\(\)/);
  assert.match(html, /<span data-theme-label="light">Dark mode<\/span>/);
  assert.match(html, /<span data-theme-label="dark">Light mode<\/span>/);
});

test('the generated not-found page is not presented as canonical content', async () => {
  const html = await readFile('dist/404.html', 'utf8');

  assert.match(html, /<h1>Page not found<\/h1>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test('every responsibility accent on the experience page has a colour defined', async () => {
  const html = await readFile('dist/experience/index.html', 'utf8');
  const accents = [...html.matchAll(/<li data-accent="([a-z]+)"/g)].map((match) => match[1]);
  const cssFiles = (await readdir('dist/_astro')).filter((file) => file.endsWith('.css'));
  const css = [html, ...(await Promise.all(cssFiles.map((file) => readFile(`dist/_astro/${file}`, 'utf8'))))].join('\n');

  assert.equal(accents.length, 6);
  for (const accent of accents) {
    assert.match(css, new RegExp(`\\[data-accent=["']?${accent}["']?\\]\\s*\\{\\s*--color-accent:\\s*var\\(--color-accent-${accent}\\)`), accent);
    assert.match(css, new RegExp(`--color-accent-${accent}:\\s*light-dark\\(`), accent);
  }
});

test('experience and skills pages are built from the role content, including platforms', async () => {
  const experience = (await readFile('dist/experience/index.html', 'utf8')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const skills = (await readFile('dist/skills/index.html', 'utf8')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  assert.match(experience, /Lead Technical Website Developer Marketing department, Powerfleet · 2017 – Present/);
  assert.match(experience, /Platforms: Salesforce Marketing Cloud Account Engagement \(Pardot\), Salesforce CRM, Google reCAPTCHA/);
  assert.match(skills, /Salesforce Marketing Cloud Account Engagement \(Pardot\) Campaign Experiences and Lead Generation; Marketing Automation and CRM Data Capture/);
  assert.doesNotMatch(experience + skills, /Privacy, Security, and Reliability/);
});

test('the heading font is preloaded from this site, not a CDN', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const preload = html.match(/<link rel="preload" href="(\/_astro\/fonts\/[^"]+\.woff2)" as="font"/)?.[1];

  assert.ok(preload, 'font preload link');
  assert.ok((await readdir('dist/_astro/fonts')).some((file) => preload.endsWith(file)));
  assert.match(html, /@font-face\{font-family:"Lexend Deca[^"]*";src:url\("\/_astro\/fonts\//);
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net|fonts\.bunny\.net/);
});
