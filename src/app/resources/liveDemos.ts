type WorkLiveDemo = {
  slug: string;
  title: string;
  description: string;
  remotePath: string;
  standalonePath: string;
  caseStudyPath: string;
  frameHeight: string;
  fallbackImage: string;
};

const defaultDemoOrigin =
  process.env.NODE_ENV === "development" ? "http://127.0.0.1:5143" : "";

const configuredDemoOrigin =
  process.env.NEXT_PUBLIC_INTERACTIVE_DEMOS_URL?.trim() || defaultDemoOrigin;

const liveDemos: WorkLiveDemo[] = [
  {
    slug: "physics-simulation-engine",
    title: "Physics Simulation Live Demo",
    description: "An interactive cannon-and-projectiles remake of the original OpenGL physics coursework.",
    remotePath: "/canon",
    standalonePath: "/canon",
    caseStudyPath: "/work/physics-simulation-engine",
    frameHeight: "clamp(36rem, 82vh, 60rem)",
    fallbackImage: "/images/projects/physics-simulation-engine/physics.jpg",
  },
  {
    slug: "network-simulation-engine",
    title: "Tic Tac Toe Live Demo",
    description: "A playable browser remake of the networking final with the same aim-and-fire Tic Tac Toe mechanic.",
    remotePath: "/tictactoe",
    standalonePath: "/tictactoe",
    caseStudyPath: "/work/network-simulation-engine",
    frameHeight: "clamp(36rem, 82vh, 60rem)",
    fallbackImage: "/images/projects/physics-simulation-engine/network.png",
  },
];

function normalizeOrigin(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function buildDemoUrl(path: string) {
  if (!configuredDemoOrigin) {
    return undefined;
  }

  try {
    return new URL(path, `${normalizeOrigin(configuredDemoOrigin)}/`).toString();
  } catch {
    return undefined;
  }
}

export function getLiveDemoByWorkSlug(slug: string) {
  const demo = liveDemos.find((entry) => entry.slug === slug);

  if (!demo) {
    return null;
  }

  return {
    ...demo,
    src: buildDemoUrl(demo.remotePath),
  };
}

export function getLiveDemoByStandalonePath(path: string) {
  const demo = liveDemos.find((entry) => entry.standalonePath === path);

  if (!demo) {
    return null;
  }

  return {
    ...demo,
    src: buildDemoUrl(demo.remotePath),
  };
}
