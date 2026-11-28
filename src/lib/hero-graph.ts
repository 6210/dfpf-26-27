export type GraphPoint = { x: number; y: number };
export type GraphNode = GraphPoint & { z: number };
type IconNode = GraphNode & { radius: number };
type CirclePoint = GraphPoint & { radius: number };
type GraphEdge = readonly [number, number];

export const neutralConnectionLimit = 32;
export const heroNodeGap = 3;

type Stroke = { count: number; marketing: GraphPoint[]; web: GraphPoint[] };

const points = (...coordinates: [number, number][]): GraphPoint[] =>
  coordinates.map(([x, y]) => ({ x, y }));

// Paired strokes seed reusable node identities and the established size profiles.
const strokes: Stroke[] = [
  {
    count: 9,
    marketing: points([100, 225], [170, 160], [210, 180]),
    web: points([150, 105], [100, 160], [150, 215]),
  },
  {
    count: 7,
    marketing: points([210, 180], [290, 95]),
    web: points([220, 90], [180, 230]),
  },
  {
    count: 9,
    marketing: points([200, 95], [290, 95], [290, 185]),
    web: points([250, 105], [300, 160], [250, 215]),
  },
];

const strokeNodeCount = strokes.reduce((sum, stroke) => sum + stroke.count, 0);
const extensions = [
  { from: 0, radius: 5.6 },
  { from: strokeNodeCount - 1, radius: 4.6 },
];

const marketingPaths = [
  [0, 1, 2, 3, 4, 5, 6],
  [6, 7, 8, 9],
  [9, 10, 11, 12, 13, 14, 15, 20],
  [16, 25, 17, 18, 19, 20],
  [20, 21, 22, 23, 26, 24],
];
const webPaths = [
  [25, 0, 1, 2, 3, 4],
  [4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [20, 21, 22, 23, 24, 26],
];

function sample(vertices: GraphPoint[], count: number): GraphNode[] {
  const lengths = vertices.slice(1).map((point, index) =>
    Math.hypot(point.x - vertices[index].x, point.y - vertices[index].y),
  );
  const total = lengths.reduce((sum, length) => sum + length, 0);

  return Array.from({ length: count }, (_, index) => {
    let distance = (index / (count - 1)) * total;
    let segment = 0;
    while (segment < lengths.length - 1 && distance > lengths[segment]) {
      distance -= lengths[segment++];
    }
    const start = vertices[segment];
    const end = vertices[segment + 1];
    const progress = distance / lengths[segment];
    const x = start.x + (end.x - start.x) * progress;
    const y = start.y + (end.y - start.y) * progress;
    return { x, y, z: 24 };
  });
}

export function projectGraphPoint(point: GraphNode, tiltX = 0, tiltY = 0) {
  const x = point.x - 200;
  const y = point.y - 160;
  const rotatedX = x * Math.cos(tiltY) + point.z * Math.sin(tiltY);
  const rotatedZ = point.z * Math.cos(tiltY) - x * Math.sin(tiltY);
  const depth = y * Math.sin(tiltX) + rotatedZ * Math.cos(tiltX);
  const scale = 480 / (480 - depth);
  return {
    x: 200 + rotatedX * scale,
    y: 160 + (y * Math.cos(tiltX) - rotatedZ * Math.sin(tiltX)) * scale,
    scale,
    depth,
  };
}

export function magneticOffset(point: GraphPoint, pointer: GraphPoint, reach: number, strength: number): GraphPoint {
  const dx = pointer.x - point.x;
  const dy = pointer.y - point.y;
  const distance = Math.hypot(dx, dy);
  const pull = Math.min(distance * 0.35, Math.max(0, 1 - distance / reach) ** 2 * strength);
  return distance ? { x: dx / distance * pull, y: dy / distance * pull } : { x: 0, y: 0 };
}

export function repulsionOffset(point: GraphPoint, pointer: GraphPoint, reach: number, strength: number): GraphPoint {
  const dx = point.x - pointer.x;
  const dy = point.y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const push = Math.max(0, 1 - distance / reach) ** 2 * strength;
  return distance ? { x: dx / distance * push, y: dy / distance * push } : { x: strength, y: 0 };
}

function avoidNodes(point: CirclePoint, obstacles: readonly CirclePoint[]): GraphPoint {
  let { x, y } = point;
  for (let pass = 0; pass < 8; pass += 1) {
    let moved = false;
    for (const obstacle of obstacles) {
      const dx = x - obstacle.x;
      const dy = y - obstacle.y;
      const clearance = point.radius + obstacle.radius + heroNodeGap;
      const squared = dx * dx + dy * dy;
      if (squared >= (clearance - 1e-6) ** 2) continue;
      const distance = Math.sqrt(squared);
      const push = clearance - distance;
      x += distance ? dx / distance * push : push;
      y += distance ? dy / distance * push : 0;
      moved = true;
    }
    if (!moved) return { x, y };
  }
  // Overlapping exclusion circles can trap sequential pushes; escape along the shortest of eight rays.
  let best = { x, y };
  let bestDistance = Infinity;
  for (let direction = 0; direction < 8; direction += 1) {
    const ux = Math.cos(direction * Math.PI / 4);
    const uy = Math.sin(direction * Math.PI / 4);
    let distance = 0;
    for (let pass = 0; pass <= obstacles.length; pass += 1) {
      let moved = false;
      for (const obstacle of obstacles) {
        const dx = obstacle.x - point.x;
        const dy = obstacle.y - point.y;
        const clearance = point.radius + obstacle.radius + heroNodeGap;
        const qx = dx - ux * distance;
        const qy = dy - uy * distance;
        if (qx * qx + qy * qy >= (clearance - 1e-6) ** 2) continue;
        const across = dx * uy - dy * ux;
        distance = dx * ux + dy * uy + Math.sqrt(Math.max(0, clearance ** 2 - across ** 2)) + 1e-6;
        moved = true;
      }
      if (!moved || distance >= bestDistance) break;
    }
    if (distance < bestDistance) {
      bestDistance = distance;
      best = { x: point.x + ux * distance, y: point.y + uy * distance };
    }
  }
  return best;
}

export function separateGraphNodes(accents: readonly CirclePoint[], neutrals: readonly CirclePoint[]): CirclePoint[] {
  const nodes = [...accents, ...neutrals].map((point, index) => ({ ...point, index }));
  const ordered = [
    ...nodes.slice(0, accents.length).sort((a, b) => b.radius - a.radius),
    ...nodes.slice(accents.length),
  ];
  const placed: Array<CirclePoint & { index: number }> = [];
  for (const point of ordered) placed.push({ ...point, ...avoidNodes(point, placed) });
  return placed.sort((a, b) => a.index - b.index);
}

export function nearbyNeutralConnections(nodes: readonly GraphPoint[], pointer?: GraphPoint) {
  if (!pointer) return [];
  const nearby = nodes.map((point, index) => ({
    ...point, index, distance: Math.hypot(point.x - pointer.x, point.y - pointer.y),
  })).filter((point) => point.distance < 140)
    .sort((a, b) => a.distance - b.distance).slice(0, neutralConnectionLimit);
  const candidates: Array<{ from: number; to: number; distance: number; opacity: number }> = [];
  for (let from = 0; from < nearby.length; from += 1) {
    for (let to = from + 1; to < nearby.length; to += 1) {
      const a = nearby[from];
      const b = nearby[to];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 1 || distance >= 80) continue;
      candidates.push({
        from: a.index, to: b.index, distance,
        opacity: (1 - Math.max(a.distance, b.distance) / 140) * Math.min(1, (80 - distance) / 16) * 0.24,
      });
    }
  }
  const degrees = new Map<number, number>();
  return candidates.sort((a, b) => a.distance - b.distance).filter(({ from, to }) => {
    if ((degrees.get(from) ?? 0) >= 2 || (degrees.get(to) ?? 0) >= 2) return false;
    degrees.set(from, (degrees.get(from) ?? 0) + 1);
    degrees.set(to, (degrees.get(to) ?? 0) + 1);
    return true;
  }).slice(0, neutralConnectionLimit);
}

function sampleShape(shape: 'marketing' | 'web'): IconNode[] {
  const nodes = strokes.flatMap((stroke, strokeIndex) =>
    (shape === 'marketing' && strokeIndex === 1
      ? sample(stroke[shape], stroke.count + 2).slice(1, -1)
      : sample(stroke[shape], stroke.count)).map((point, index) => {
      const progress = shape === 'marketing' && strokeIndex === 1
        ? (index + 1) / (stroke.count + 1) : index / (stroke.count - 1);
      return {
        ...point,
        radius: shape === 'marketing'
          ? 2.1 + 4.1 * (strokeIndex === 1
            ? progress ** 1.5
            : Math.exp(-Math.hypot(point.x - 290, point.y - 95) / (strokeIndex === 2 ? 28 : 14)))
          : 2.1 + 4.1 * (1 - Math.abs(2 * progress - 1)) ** 1.5,
      };
    }),
  );
  const result = [
    ...nodes,
    ...extensions.map((extension, index) => {
      if (shape === 'web') return { ...nodes[extension.from], radius: extension.radius };
      const a = nodes[extension.from];
      const b = nodes[extension.from + (index === 0 ? 1 : -1)];
      return {
        ...a,
        radius: (a.radius + b.radius) / 2,
      };
    }),
  ];
  const spacing = shape === 'marketing' ? 19.5 : 24;
  const move = (origin: GraphPoint, dx: number, dy: number, steps: number): GraphPoint => {
    const distance = Math.hypot(dx, dy);
    return { x: origin.x + dx / distance * spacing * steps, y: origin.y + dy / distance * spacing * steps };
  };
  const place = (indices: number[], start: GraphPoint, end: GraphPoint) => {
    const positions = sample([start, end], indices.length);
    indices.forEach((index, step) => {
      result[index] = { ...result[index], ...positions[step] };
    });
  };
  // Spacing is independent of radius: keep the approved organic size pattern.
  if (shape === 'marketing') {
    const tip = { x: 290, y: 95 };
    const valley = move(tip, -80, 85, 7);
    const bend = move(valley, -40, -20, 3);
    place(marketingPaths[0], move(bend, -70, 65, 6), bend);
    place(marketingPaths[1], bend, valley);
    place(marketingPaths[2], valley, tip);
    place(marketingPaths[3], move(tip, -1, 0, 5), tip);
    place(marketingPaths[4], tip, move(tip, 0, 1, 5));
  } else {
    const left = { x: 100, y: 160 };
    const right = { x: 300, y: 160 };
    const center = { x: 200, y: 160 };
    place(webPaths[0], move(left, 50, -55, 5), left);
    place(webPaths[1], left, move(left, 50, 55, 4));
    place(webPaths[2], move(center, 40, -140, 3), move(center, -40, 140, 3));
    place(webPaths[3], move(right, -50, -55, 4), right);
    place(webPaths[4], right, move(right, -50, 55, 5));
  }
  return result;
}

function seed(index: number, offset: number): number {
  const value = Math.sin((index + 1) * 127.1 + offset * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const pathEdges = (paths: number[][]): GraphEdge[] => paths.flatMap((path) =>
  path.slice(1).map((to, index) => [path[index], to] as const));
const webEdges = pathEdges(webPaths);
const marketingEdges = pathEdges(marketingPaths);
const shapes = [
  { label: 'Technical Marketing Implementer', points: sampleShape('marketing'), edges: marketingEdges },
  { label: 'Technical Website Developer', points: sampleShape('web'), edges: webEdges },
];
const starBands = [
  { x: 52, y: 5, width: 43, height: 23 },
  { x: 53, y: 80, width: 42, height: 14 },
  { x: 86, y: 8, width: 10, height: 85 },
];

export const heroGraph = {
  ambient: Array.from({ length: 192 }, (_, index) => {
    const depth = seed(index + 32, 2);
    const shape = shapes[Math.floor(index / 4) % shapes.length];
    const anchor = shape.points[Math.floor(seed(index, 3) * shape.points.length)];
    const nearIcon = index % 4 !== 0;
    return {
      x: nearIcon ? anchor.x + (seed(index, 0) - 0.5) * 80 : 55 + seed(index, 0) * 290,
      y: nearIcon ? anchor.y + (seed(index, 1) - 0.5) * 68 : 35 + seed(index, 1) * 250,
      z: (depth - 0.5) * 70,
      depth,
      radius: 0.6 + depth ** 2 * 1.5,
      opacity: 0.14 + depth * 0.32,
    };
  }).sort((a, b) => a.z - b.z),
  stars: Array.from({ length: 64 + starBands.length * 24 }, (_, index) => {
    const depth = seed(index, 2);
    const large = index % 4 === 0;
    const band = index < 64 ? undefined : starBands[Math.floor((index - 64) / 24)];
    const largest = index >= 64 && (index - 64) % 3 === 0;
    return {
      x: band ? band.x + seed(index, 0) * band.width : 3 + seed(index, 0) * 94,
      y: band ? band.y + seed(index, 1) * band.height : 5 + seed(index, 1) * 90,
      depth,
      size: largest ? 6 + depth * 1.5 : large ? 3 + depth * 1.2 : 0.8 + depth ** 2 * 2.1,
      opacity: 0.12 + depth * 0.22,
    };
  }),
  shapes,
  edges: [...webEdges, ...marketingEdges.filter(([from, to]) => !webEdges.some(([a, b]) => a === from && b === to))],
};
