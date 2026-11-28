import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  heroGraph, heroNodeGap, magneticOffset, nearbyNeutralConnections,
  neutralConnectionLimit, projectGraphPoint, repulsionOffset, separateGraphNodes,
} from '../src/lib/hero-graph.ts';

test('homepage graph ships a complete static icon without replacing other hero placeholders', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  const figure = home.match(/<figure[^>]*data-hero-graph[^>]*>(.*?)<\/figure>/s)?.[1] ?? '';
  const icon = figure.match(/<g[^>]*data-graph-nodes[^>]*>(.*?)<\/g>/s)?.[1] ?? '';
  assert.equal([...icon.matchAll(/<circle\b/g)].length, heroGraph.shapes[0].points.length);
  const ambient = figure.match(/<g[^>]*data-graph-ambient[^>]*>(.*?)<\/g>/s)?.[1] ?? '';
  assert.equal([...ambient.matchAll(/<circle\b/g)].length, heroGraph.ambient.length);
  assert.doesNotMatch(ambient, /<line\b/);
  assert.equal([...figure.matchAll(/<line\b/g)].length, heroGraph.edges.length);
  assert.equal([...figure.matchAll(/<line[^>]*vector-effect="non-scaling-stroke"/g)].length, heroGraph.edges.length);
  const scatter = home.match(/<div[^>]*data-hero-scatter[^>]*aria-hidden="true"[^>]*>(.*?)<\/div>/s)?.[1] ?? '';
  assert.equal([...scatter.matchAll(/<span\b/g)].length, heroGraph.stars.length);
  assert.match(scatter, /<svg[^>]*data-neutral-connections[^>]*aria-hidden="true"/);
  assert.equal([...scatter.matchAll(/<line[^>]*opacity="0"/g)].length, neutralConnectionLimit);
  assert.match(figure, /<svg[^>]*aria-hidden="true"/);
  assert.doesNotMatch(figure, /data-graph-label/);
  assert.match(figure, /data-graph-pause[^>]*hidden/);
  const staticDots = [...figure.matchAll(/<circle cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/g)]
    .map((match) => ({ x: +match[1], y: +match[2], radius: +match[3] }));
  assert.equal(staticDots.length, heroGraph.ambient.length + heroGraph.shapes[0].points.length);
  for (let a = 0; a < staticDots.length; a += 1) {
    for (let b = a + 1; b < staticDots.length; b += 1) {
      const first = staticDots[a];
      const second = staticDots[b];
      assert.ok(Math.hypot(first.x - second.x, first.y - second.y) >= first.radius + second.radius + heroNodeGap - 1e-5);
    }
  }
  assert.doesNotMatch(home, /data-physics/);

  for (const page of ['about', 'experience', 'skills']) {
    const html = await readFile(`dist/${page}/index.html`, 'utf8');
    assert.doesNotMatch(html, /data-hero-graph/);
    assert.doesNotMatch(html, /data-hero-scatter/);
    assert.match(html, /data-physics/);
  }
});

test('homepage role animation keeps both titles in one stable, accessible heading', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? '';
  const accessible = h1.match(/<span[^>]*data-hero-title-accessible[^>]*>([^<]+)<\/span>/)?.[1];
  assert.equal(accessible, heroGraph.shapes.map((shape) => shape.label).join(' and '));
  assert.match(h1, /<span aria-hidden="true"[^>]*data-hero-title-visual/);
  assert.doesNotMatch(h1, /aria-live/);

  for (const page of ['about', 'experience', 'skills', 'downloads']) {
    assert.doesNotMatch(await readFile(`dist/${page}/index.html`, 'utf8'), /data-hero-title/);
  }
});

test('neutral dots concentrate around both icons, with smaller, sparse outliers across the intro', () => {
  const { ambient } = heroGraph;
  assert.ok(ambient.length > heroGraph.stars.length, 'the local cluster retains more dots than the expanded outer field');
  for (const shape of heroGraph.shapes) {
    const icon = shape.points.map((point) => projectGraphPoint(point));
    const nearby = ambient.map((point) => projectGraphPoint(point)).filter((point) =>
      Math.min(...icon.map((node) => Math.hypot(point.x - node.x, point.y - node.y))) < 35,
    );
    assert.ok(nearby.length > ambient.length * 0.55, 'most neutral dots stay close to either displayed icon');
  }
  const depthSorted = ambient.toSorted((a, b) => a.depth - b.depth);
  assert.ok(depthSorted.at(-1).radius > depthSorted[0].radius * 3);
  assert.ok(depthSorted.at(-1).opacity > depthSorted[0].opacity * 2);
  for (const source of ambient) {
    const point = projectGraphPoint(source);
    assert.ok(point.x > 10 && point.x < 390 && point.y > 10 && point.y < 310);
  }

  const stars = heroGraph.stars;
  assert.ok(Math.max(...stars.map((star) => star.x)) - Math.min(...stars.map((star) => star.x)) > 85);
  assert.ok(Math.max(...stars.map((star) => star.y)) - Math.min(...stars.map((star) => star.y)) > 80);
  for (const [left, top] of [[true, true], [false, true], [true, false], [false, false]]) {
    assert.ok(stars.filter((star) => (star.x < 50) === left && (star.y < 50) === top).length >= 4);
  }
  assert.ok(
    stars.filter((star) => Math.hypot((star.x - 50) / 47, (star.y - 50) / 45) > 1).length >= 5,
    'stars also occupy the corners outside an inscribed ellipse',
  );
  const larger = stars.filter((star) => star.size >= 3);
  const sorted = stars.filter((star) => star.size < 3).toSorted((a, b) => a.depth - b.depth);
  assert.ok(larger.length >= stars.length / 5);
  assert.ok(Math.min(...larger.map((star) => star.size)) > Math.max(...sorted.map((star) => star.size)));
  assert.ok(Math.max(...larger.map((star) => star.x)) - Math.min(...larger.map((star) => star.x)) > 75);
  assert.ok(Math.max(...larger.map((star) => star.y)) - Math.min(...larger.map((star) => star.y)) > 70);
  assert.ok(sorted.at(-1).size > sorted[0].size * 3);
  assert.ok(sorted.at(-1).opacity > sorted[0].opacity);
  for (const star of stars) {
    assert.ok(star.x > 0 && star.x < 100 && star.y > 0 && star.y < 100);
  }
});

test('outer stars fill the upper, lower, and right-hand gaps with a distinct larger size', () => {
  const { stars } = heroGraph;
  for (const inBand of [
    (star) => star.x >= 52 && star.y <= 28,
    (star) => star.x >= 53 && star.y >= 80,
    (star) => star.x >= 86,
  ]) {
    const band = stars.filter(inBand);
    assert.ok(band.length >= 24, 'each marked area receives a denser constellation');
    assert.ok(band.filter((star) => star.size >= 6).length >= 8, 'the new size appears throughout each marked area');
  }
  const largest = stars.filter((star) => star.size >= 6);
  const medium = stars.filter((star) => star.size >= 3 && star.size < 6);
  assert.ok(Math.min(...largest.map((star) => star.size)) > Math.max(...medium.map((star) => star.size)) * 1.4);
});

test('accent nodes taper away from the arrowhead, slash midpoint, and matching bracket corners', () => {
  const [arrow, code] = heroGraph.shapes;
  assert.ok(arrow.points.length < 31);
  const tip = arrow.points.find((point) => point.x === 290 && point.y === 95);
  const center = code.points.find((point) => point.x === 200 && point.y === 160);
  assert.ok(tip.radius > arrow.points[0].radius * 2);
  assert.ok(tip.radius > arrow.points.at(-1).radius * 2);
  assert.equal(tip.radius, Math.max(...arrow.points.map((point) => point.radius)));
  assert.equal(center.radius, Math.max(...code.points.map((point) => point.radius)));
  const left = code.points.find((point) => point.x === 100 && point.y === 160);
  const right = code.points.find((point) => point.x === 300 && point.y === 160);
  assert.equal(left.radius, center.radius);
  assert.equal(right.radius, center.radius);
  assert.equal(code.points.filter((point) => point.radius === center.radius).length, 3);
  const slash = code.points.filter((point) => point.x >= 180 && point.x <= 220 && point.y >= 90 && point.y <= 230);
  assert.ok(center.radius > slash[0].radius * 2);
  assert.ok(center.radius > slash.at(-1).radius * 2);
  for (const [nodes, peak] of [
    [arrow.points.slice(16, 25), tip], [slash, center],
    [code.points.filter((point) => point.x <= 150), left],
    [code.points.filter((point) => point.x >= 250), right],
  ]) {
    const byDistance = nodes.toSorted((a, b) =>
      Math.hypot(a.x - peak.x, a.y - peak.y) - Math.hypot(b.x - peak.x, b.y - peak.y),
    );
    for (let index = 1; index < byDistance.length; index += 1) {
      assert.ok(byDistance[index].radius <= byDistance[index - 1].radius + 1e-10);
    }
  }
  const front = projectGraphPoint({ x: 240, y: 180, z: 100 });
  const back = projectGraphPoint({ x: 240, y: 180, z: -100 });
  assert.ok(front.scale > back.scale);
  assert.ok(front.x > back.x);
});

test('all accent connections have even centre spacing, including the arrow start and arrowhead ends', () => {
  const arrow = heroGraph.shapes[0].points;
  assert.equal(arrow.length, 27);
  assert.equal(heroGraph.shapes[1].edges.length, 24);
  for (const shape of heroGraph.shapes) {
    const distances = shape.edges.map(([a, b]) =>
      Math.hypot(shape.points[a].x - shape.points[b].x, shape.points[a].y - shape.points[b].y));
    assert.ok(Math.max(...distances) - Math.min(...distances) < 1e-8);
    for (const scale of [0.6, 1, 2.4]) {
      const desired = shape.points.map((point) => {
        const projected = projectGraphPoint(point);
        return { x: projected.x * scale, y: projected.y * scale, radius: point.radius * projected.scale * scale };
      });
      const separated = separateGraphNodes(desired, []);
      for (const [index, point] of separated.entries()) {
        assert.ok(Math.hypot(point.x - desired[index].x, point.y - desired[index].y) < 1e-8,
          'collision clearance must not bunch up resting accent nodes');
      }
    }
  }
  assert.equal(arrow[20].x, 290);
  assert.equal(arrow[20].y, 95);
  const shaft = arrow.slice(9, 16);
  assert.ok(shaft[0].radius > arrow[8].radius);
  for (let index = 1; index < shaft.length; index += 1) {
    assert.ok(shaft[index].radius > shaft[index - 1].radius);
  }
  assert.ok(shaft[3].radius > 3.5, 'the size change is visible through the shaft, not only at its tip');
  assert.ok(shaft.at(-1).radius < arrow[20].radius, 'only one node occupies the arrowhead');
  assert.ok(heroGraph.shapes[0].edges.some(([a, b]) => a === 15 && b === 20));
});

test('extended code arms are equally spaced, straight under projection, and not skewed by collision layout at rest', () => {
  const code = heroGraph.shapes[1].points;
  const arms = [[4, 3, 2, 1, 0, 25], [20, 21, 22, 23, 24, 26]];
  let armLength;
  for (const indices of arms) {
    const points = indices.map((index) => code[index]);
    const length = Math.hypot(points.at(-1).x - points[0].x, points.at(-1).y - points[0].y);
    if (armLength !== undefined) assert.ok(Math.abs(length - armLength) < 1e-10);
    armLength = length;
    for (let index = 1; index < points.length; index += 1) {
      assert.ok(Math.abs(Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y) - length / 5) < 1e-10);
    }
  }
  for (const [tiltX, tiltY] of [[0, 0], [0.1, -0.12], [-0.1, 0.12]]) {
    const projected = code.map((point) => {
      const position = projectGraphPoint(point, tiltX, tiltY);
      return { ...position, radius: point.radius * position.scale };
    });
    for (const indices of arms) {
      const start = projected[indices[0]];
      const end = projected[indices.at(-1)];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      for (const index of indices) {
        const point = projected[index];
        assert.ok(Math.abs(dx * (point.y - start.y) - dy * (point.x - start.x)) < 1e-8);
      }
    }
    for (const scale of [0.6, 1, 2.4]) {
      const circles = projected.map((point) => ({ x: point.x * scale, y: point.y * scale, radius: point.radius * scale }));
      const separated = separateGraphNodes(circles, []);
      for (const [index, point] of separated.entries()) {
        assert.ok(Math.hypot(point.x - circles[index].x, point.y - circles[index].y) < 1e-8);
      }
    }
  }
});

test('all accent targets are distinct and the code-arm extensions occupy the arrow lines rather than stack', () => {
  const [arrow, code] = heroGraph.shapes;
  const [upper, lower] = code.points.slice(-2);
  assert.ok(upper.x > 150 && upper.y < 105, 'the left upper arm extends towards the centre');
  assert.ok(lower.x < 250 && lower.y > 215, 'the right lower arm extends towards the centre');
  for (let index = code.points.length - 2; index < code.points.length; index += 1) {
    const edges = code.edges.filter((edge) => edge.includes(index));
    assert.equal(edges.length, 1);
    const attached = edges[0].find((node) => node !== index);
    assert.notDeepEqual(arrow.points[index], arrow.points[attached]);
  }
  for (const shape of heroGraph.shapes) {
    assert.equal(new Set(shape.points.map((point) => `${point.x},${point.y}`)).size, shape.points.length);
  }
  const reached = new Set([0]);
  for (let pass = 0; pass < arrow.points.length; pass += 1) {
    for (const [a, b] of arrow.edges) {
      if (reached.has(a) || reached.has(b)) { reached.add(a); reached.add(b); }
    }
  }
  assert.equal(reached.size, arrow.points.length, 'the marketing arrow remains connected without shared positions');
});

test('magnetic displacement attracts without overshooting and stops outside its reach', () => {
  const origin = { x: 0, y: 0 };
  for (const pointer of [{ x: 40, y: 0 }, { x: -40, y: 20 }, { x: 0, y: -40 }, { x: 1, y: 1 }]) {
    const offset = magneticOffset(origin, pointer, 100, 18);
    assert.ok(offset.x * pointer.x + offset.y * pointer.y > 0);
    assert.ok(Math.hypot(offset.x, offset.y) < Math.hypot(pointer.x, pointer.y));
    assert.ok(Math.hypot(offset.x, offset.y) <= 18);
  }
  assert.deepEqual(magneticOffset(origin, origin, 100, 18), origin);
  assert.deepEqual(magneticOffset(origin, { x: 100, y: 0 }, 100, 18), origin);
});

test('neutral repulsion points away from the mouse, including coincident points', () => {
  const point = { x: 0, y: 0 };
  for (const mouse of [{ x: 40, y: 0 }, { x: -20, y: 30 }, { x: 0, y: -40 }]) {
    const offset = repulsionOffset(point, mouse, 100, 24);
    assert.ok(offset.x * mouse.x + offset.y * mouse.y < 0);
    assert.ok(Math.hypot(offset.x, offset.y) <= 24);
  }
  const coincident = repulsionOffset(point, point, 100, 24);
  assert.ok(Number.isFinite(coincident.x) && Math.hypot(coincident.x, coincident.y) > 0);
  const outside = repulsionOffset(point, { x: 101, y: 0 }, 100, 24);
  assert.equal(Math.hypot(outside.x, outside.y), 0);
});

test('coincident circles separate without mutation, hidden nodes, or shrinking', () => {
  const input = Array.from({ length: 35 }, (_, index) => ({ x: 0, y: 0, radius: 1 + index % 7 }));
  const snapshot = structuredClone(input);
  const result = separateGraphNodes(input.slice(0, 5), input.slice(5));
  assert.deepEqual(input, snapshot);
  assert.deepEqual(result.map((point) => point.radius), input.map((point) => point.radius));
  for (let a = 0; a < result.length; a += 1) {
    for (let b = a + 1; b < result.length; b += 1) {
      assert.ok(Math.hypot(result[a].x - result[b].x, result[a].y - result[b].y) >=
        result[a].radius + result[b].radius + heroNodeGap - 1e-5);
    }
  }
});

test('every projected node pair stays separated through morphing, mouse forces, and responsive scales', () => {
  const [arrow, code] = heroGraph.shapes;
  for (const progress of Array.from({ length: 21 }, (_, index) => index / 20)) {
    for (const scale of [0.6, 1, 2.4]) {
      const pointer = { x: 220, y: 150 };
      const projectCircle = (point) => {
        const projected = projectGraphPoint(point, 0.1, -0.12);
        return { x: projected.x * scale, y: projected.y * scale, radius: point.radius * projected.scale * scale };
      };
      const accents = arrow.points.map((start, index) => {
        const end = code.points[index];
        const point = {
          x: start.x + (end.x - start.x) * progress,
          y: start.y + (end.y - start.y) * progress,
          z: start.z + (end.z - start.z) * progress,
          radius: start.radius + (end.radius - start.radius) * progress,
        };
        const pull = magneticOffset(point, pointer, 90, 18);
        return projectCircle({ ...point, x: point.x + pull.x, y: point.y + pull.y });
      });
      const neutrals = heroGraph.ambient.map((point) => {
        const push = repulsionOffset(point, pointer, 80, 10 + point.depth * 18);
        return projectCircle({ ...point, x: point.x + push.x, y: point.y + push.y });
      });
      const stars = heroGraph.stars.map((point) => ({
        x: point.x * 8 * scale, y: point.y * 7 * scale, radius: point.size * (scale < 1 ? 0.5 : 0.9),
      }));
      const separated = separateGraphNodes(accents, [...neutrals, ...stars]);
      assert.equal(separated.length, accents.length + neutrals.length + stars.length);
      for (let a = 0; a < separated.length; a += 1) {
        for (let b = a + 1; b < separated.length; b += 1) {
          const first = separated[a];
          const second = separated[b];
          assert.ok(Math.hypot(first.x - second.x, first.y - second.y) >=
            first.radius + second.radius + heroNodeGap - 1e-5, `overlap at progress ${progress}, scale ${scale}, nodes ${a}/${b}`);
        }
      }
    }
  }
});

test('temporary neutral links stay local, sparse, and within a fixed rendering budget', () => {
  const nodes = Array.from({ length: 200 }, (_, index) => ({
    x: index % 20 * 12, y: Math.floor(index / 20) * 12,
  }));
  const pointer = { x: 60, y: 60 };
  assert.deepEqual(nearbyNeutralConnections(nodes), []);
  assert.deepEqual(nearbyNeutralConnections(nodes, { x: 1000, y: 1000 }), []);
  const links = nearbyNeutralConnections(nodes, pointer);
  assert.ok(links.length > 0 && links.length <= neutralConnectionLimit);
  const degrees = new Map();
  for (const link of links) {
    const from = nodes[link.from];
    const to = nodes[link.to];
    assert.ok(Math.hypot(from.x - to.x, from.y - to.y) < 80);
    assert.ok(link.opacity > 0 && link.opacity <= 0.24);
    for (const index of [link.from, link.to]) {
      const point = nodes[index];
      assert.ok(Math.hypot(point.x - pointer.x, point.y - pointer.y) < 140);
      degrees.set(index, (degrees.get(index) ?? 0) + 1);
      assert.ok(degrees.get(index) <= 2);
    }
  }
  assert.equal(new Set(links.map((link) => [link.from, link.to].sort((a, b) => a - b).join(':'))).size, links.length);
});

test('both graph targets retain every connected node within the stage throughout the morph', () => {
  const [marketing, web] = heroGraph.shapes;
  assert.equal(marketing.points.length, web.points.length);
  assert.notDeepEqual(marketing.points, web.points);
  const connected = new Set(heroGraph.edges.flat());
  assert.equal(connected.size, marketing.points.length);

  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    for (const [index, start] of marketing.points.entries()) {
      const end = web.points[index];
      const x = start.x + (end.x - start.x) * progress;
      const y = start.y + (end.y - start.y) * progress;
      const radius = start.radius + (end.radius - start.radius) * progress;
      assert.ok(Number.isFinite(x) && x >= 20 && x <= 380);
      assert.ok(Number.isFinite(y) && y >= 20 && y <= 300);
      assert.ok(Number.isFinite(radius) && radius > 0 && radius < 10);
    }
  }
});

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
    'dist/index.html': 'Dennis Ferreira Technical Marketing Implementer and Technical Website Developer',
    'dist/about/index.html': 'Dennis Ferreira About',
    'dist/experience/index.html': 'Dennis Ferreira Experience',
    'dist/skills/index.html': 'Dennis Ferreira Skills',
    'dist/downloads/index.html': 'Dennis Ferreira Downloads',
    'dist/404.html': 'Page not found',
  };
  for (const [file, text] of Object.entries(expected)) {
    const html = await readFile(file, 'utf8');
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? '';
    const heroTitle = h1.match(/data-hero-title-accessible[^>]*>([^<]+)</)?.[1];
    const heading = heroTitle
      ? `${h1.match(/class="eyebrow"[^>]*>([^<]+)</)?.[1]} ${heroTitle}`
      : h1.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(heading, text, file);
  }
});

test('page content is grouped into sections, starting with the one that holds the h1', async () => {
  for (const file of ['dist/index.html', 'dist/about/index.html', 'dist/experience/index.html', 'dist/skills/index.html', 'dist/downloads/index.html', 'dist/404.html']) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /<main[^>]*>\s*<section[^>]*>\s*(<div[^>]*>\s*)?<h1/, file);
  }
});
