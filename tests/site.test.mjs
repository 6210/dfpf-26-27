import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

test('shareable pages contain distinct metadata and crawlable navigation in HTML', async () => {
  const pages = [
    { file: 'dist/index.html', path: '/', label: 'Home' },
    { file: 'dist/about/index.html', path: '/about/', label: 'About' },
    { file: 'dist/experience/index.html', path: '/experience/', label: 'Experience' },
    { file: 'dist/skills/index.html', path: '/skills/', label: 'Skills' },
    { file: 'dist/downloads/index.html', path: '/downloads/', label: 'Downloads' },
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

test('the header shows the name, a menu, and on-page links to sections that exist', async () => {
  for (const file of ['dist/index.html', 'dist/about/index.html', 'dist/experience/index.html', 'dist/skills/index.html', 'dist/downloads/index.html']) {
    const html = await readFile(file, 'utf8');
    const header = html.match(/<header[^>]*>(.*?)<\/header>/s)?.[1] ?? '';
    const spy = header.match(/<nav[^>]*aria-label="On this page"[^>]*>(.*?)<\/nav>/s)?.[1] ?? '';
    const targets = [...spy.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

    // The logo is decorative; the name stays as text inside the home link.
    assert.match(header, /class="site-name"[^>]*><svg[^>]*aria-hidden="true".*?<\/svg><span[^>]*>Dennis Ferreira<\/span>/s, file);
    assert.match(header, /<button[^>]*popovertarget="site-menu"/, file);
    assert.match(header, /<div id="site-menu"[^>]*popover/, file);
    assert.ok(targets.length > 1, `${file} lists its sections`);
    for (const id of targets) {
      assert.match(html, new RegExp(`id="${id}"`), `${file} has #${id}`);
    }

    // The large-screen rail outside the header links to the same sections, in the same order.
    const rail = html.match(/<nav[^>]*data-rail[^>]*>(.*?)<\/nav>/s)?.[1] ?? '';
    assert.deepEqual([...rail.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]), targets, `${file} rail`);
  }
});

test('every page links the favicons and manifest, and the files exist', async () => {
  const head = (await readFile('dist/index.html', 'utf8')).split('</head>')[0];
  for (const href of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png', '/site.webmanifest']) {
    assert.match(head, new RegExp(`href="${href}"`));
    await readFile(`dist${href}`);
  }
  const manifest = JSON.parse(await readFile('dist/site.webmanifest', 'utf8'));
  for (const { src } of manifest.icons) {
    await readFile(`dist${src}`);
  }
});

test('the theme is set in the head before content renders, with a label for each theme', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  assert.match(head, /documentElement\.dataset\.theme = current\(\)/);
  assert.match(html, /<span data-theme-label="light"[^>]*>Switch to dark mode<\/span>/);
  assert.match(html, /<span data-theme-label="dark"[^>]*>Switch to light mode<\/span>/);
  assert.match(html, /<div[^>]*data-theme-status[^>]*popover="manual"/);
  assert.match(html, /<p[^>]*role="status"[^>]*data-theme-announce/);
});

test('the generated not-found page is not presented as canonical content', async () => {
  const html = await readFile('dist/404.html', 'utf8');

  assert.match(html, /<h1[^>]*>Page not found<\/h1>/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test('every responsibility area has an accent key, and the site uses one accent colour', async () => {
  const html = await readFile('dist/experience/index.html', 'utf8');
  const accents = [...html.matchAll(/<li[^>]*data-morph="([a-z]+)"/g)].map((match) => match[1]);
  const cssFiles = (await readdir('dist/_astro')).filter((file) => file.endsWith('.css'));
  const css = [html, ...(await Promise.all(cssFiles.map((file) => readFile(`dist/_astro/${file}`, 'utf8'))))].join('\n');

  assert.equal(new Set(accents).size, 6);
  // Pantone 16-1546 TCX in both themes; light-mode link text keeps the text colour for contrast.
  assert.match(css, /--color-accent:\s*#ee7869/i);
  assert.match(css, /--color-link:\s*light-dark\(var\(--color-text\),\s*var\(--color-accent\)\)/i);
  for (const accent of new Set(accents)) {
    assert.doesNotMatch(css, new RegExp(`--color-accent-${accent}\\b`), `${accent} has no colour of its own`);
  }
});

test('experience and skills pages are built from the role content, including platforms', async () => {
  const experience = (await readFile('dist/experience/index.html', 'utf8')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const skills = (await readFile('dist/skills/index.html', 'utf8')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  assert.match(experience, /2017 MiX Telematics Powerfleet .*Lead Technical Website Developer Marketing department · Nov 2017 – Present/);
  // The timeline runs from the first role up to today, then the recommendations.
  const order = ['Urban Lava Advertising', 'RPS Media', 'I3 Zone Development', 'Lead Technical Website Developer', 'Recommendations Placeholder'];
  const positions = order.map((text) => experience.indexOf(text));
  assert.ok(positions.every((position, i) => position > (positions[i - 1] ?? -1)), `Timeline order: ${order.join(', ')}`);
  const experienceHtml = await readFile('dist/experience/index.html', 'utf8');
  // The current role's summary introduces the page in the hero, once.
  const hero = experienceHtml.slice(experienceHtml.indexOf('<h1'), experienceHtml.indexOf('id="role-powerfleet"'));
  assert.match(hero, /Own the technical delivery/);
  assert.equal(experienceHtml.split('Own the technical delivery').length, 2);
  // The whole timeline is one stop in the on-page navigation, not one per role.
  assert.match(experienceHtml, /<a href="#timeline"[^>]*>Timeline</);
  // Role links only appear on the timeline's axis, kept out of the tab order.
  assert.doesNotMatch(experienceHtml, /<a href="#role-[^"]*"(?![^>]*tabindex="-1")/);
  // Each role shows the same year axis: one linked stop per role's start year, ending at the current year.
  const axis = experienceHtml.match(/<div class="role-axis[^"]*"[^>]*>(.*?)<\/div>/s)?.[1] ?? '';
  assert.deepEqual(
    [...axis.matchAll(/<a href="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/g)].map((match) => `${match[2]} ${match[1]}`),
    ['2010 #role-urban-lava', '2011 #role-rps-media', '2013 #role-i3-zone', '2017 #role-powerfleet', `${new Date().getFullYear()} #timeline-end`],
  );
  assert.match(experienceHtml, /id="timeline-end"/);
  // The merger shows as an unlabelled, decorative branch, with the earlier company name kept from screen readers.
  assert.match(experienceHtml, /<div class="role-branch[^"]*"[^>]*aria-hidden="true"[^>]*><\/div>/);
  assert.match(experienceHtml, /<span class="role-company-former"[^>]*aria-hidden="true"[^>]*>MiX Telematics<\/span>/);
  assert.match(experience, /I3 Zone Development .*Front-end Developer Nov 2013 – Nov 2017/);
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

test('every page has Get in touch, with the contact details encoded rather than in plain text', async () => {
  const [{ contact }] = JSON.parse(await readFile('src/content/profile.json', 'utf8'));
  const decode = (value) => [...Buffer.from(value, 'base64').toString()].reverse().join('');

  for (const file of ['dist/index.html', 'dist/about/index.html', 'dist/experience/index.html', 'dist/skills/index.html', 'dist/downloads/index.html', 'dist/404.html']) {
    const html = await readFile(file, 'utf8');
    const section = html.match(/<section[^>]*id="contact"[^>]*>(.*?)<\/section>/s)?.[1] ?? '';
    const encoded = [...section.matchAll(/data-contact="([^"]+)"/g)].map((match) => decode(match[1]));

    assert.match(section, />Get in touch</, file);
    assert.deepEqual(encoded, [contact.email, contact.phone], file);
    assert.ok(!html.includes(contact.email), `${file} has no plain email`);
    assert.ok(!html.replace(/\s/g, '').includes(contact.phone.replace(/\s/g, '')), `${file} has no plain phone number`);
  }
});

test('the downloads page lists every CV version, as a link only once its file exists', async () => {
  const [{ cv }] = JSON.parse(await readFile('src/content/profile.json', 'utf8'));
  const html = await readFile('dist/downloads/index.html', 'utf8');
  const files = await readdir('public/cv').catch(() => []);

  assert.ok(cv.length > 0);
  for (const { href, label } of cv) {
    if (files.includes(href.slice('/cv/'.length))) {
      assert.match(html, new RegExp(`<a href="${href}" download[^>]*>\\s*${label.replace(/[()]/g, '\\$&')}`), href);
    } else {
      assert.doesNotMatch(html, new RegExp(`href="${href}"`), href);
      assert.ok(html.includes(label), label);
    }
  }
  assert.match(html, /Coming soon|KB/);
});

test('experience areas and skills platforms share morph targets', async () => {
  const experience = await readFile('dist/experience/index.html', 'utf8');
  const skills = await readFile('dist/skills/index.html', 'utf8');
  const accents = ['operations', 'campaigns', 'automation', 'analytics', 'seo', 'documentation'];

  for (const accent of accents) {
    assert.match(experience, new RegExp(`<li[^>]*data-morph="${accent}"`), `Experience ${accent} card is a morph target`);
  }
  const gtm = skills.match(/<div[^>]*data-morph="([^"]+)"[^>]*>\s*<dt[^>]*>Google Tag Manager/);
  assert.equal(gtm?.[1], 'analytics', 'Google Tag Manager links to the analytics area');
  for (const html of [experience, skills]) {
    assert.match(html, /<div[^>]*class="area-badge"[^>]*data-area-badge hidden/, 'the badge is hidden until its script runs');
  }
});

test('recommendations show on the experience page, with placeholder entries labelled', async () => {
  const recommendations = JSON.parse(await readFile('src/content/recommendations.json', 'utf8'));
  const html = await readFile('dist/experience/index.html', 'utf8');
  const section = html.match(/<section[^>]*id="recommendations"[^>]*>(.*?)<\/section>/s)?.[1] ?? '';

  assert.equal([...section.matchAll(/<blockquote/g)].length, recommendations.length);
  assert.equal([...section.matchAll(/>Placeholder<\/p>/g)].length, recommendations.filter((entry) => entry.placeholder).length);
  assert.match(html, /<a[^>]*href="#recommendations"/);
});

test('each page h1 starts with the name, except the not-found page', async () => {
  const expected = {
    'dist/index.html': 'Dennis Ferreira Technical Marketing Developer',
    'dist/about/index.html': 'Dennis Ferreira About',
    'dist/experience/index.html': 'Dennis Ferreira Experience',
    'dist/skills/index.html': 'Dennis Ferreira Skills',
    'dist/downloads/index.html': 'Dennis Ferreira Downloads',
    'dist/404.html': 'Page not found',
  };
  for (const [file, text] of Object.entries(expected)) {
    const html = await readFile(file, 'utf8');
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? '';
    assert.equal(h1.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), text, file);
  }
});

test('page content is grouped into sections, starting with the one that holds the h1', async () => {
  for (const file of ['dist/index.html', 'dist/about/index.html', 'dist/experience/index.html', 'dist/skills/index.html', 'dist/downloads/index.html', 'dist/404.html']) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /<main[^>]*>\s*<section[^>]*>\s*(<div[^>]*>\s*)?<h1/, file);
  }
});
