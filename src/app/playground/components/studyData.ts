export type InteractionStudy = {
  id: string;
  name: string;
  category: string;
  date: string;
  dateTime: string;
  explores: string;
  technical: string;
  image: string;
  imageAlt: string;
  video?: string;
  videoFit?: 'cover' | 'contain';
  recognition?: string;
  collaboration?: string;
  liveUrl?: string;
  githubUrl?: string;
  deepDiveUrl?: string;
  stage: 'released' | 'current';
};

export const INTERACTION_STUDIES: InteractionStudy[] = [
  {
    id: 'pixel-state-machine',
    name: 'Pixel State Machine',
    category: 'companion interaction',
    date: 'Jul 2026',
    dateTime: '2026-07',
    explores:
      'orbit, chase, and burst behavior that follows user attention',
    technical:
      'One 30fps ticker drives every small 2D canvas. The pixel orbits the active option, chases the pointer, and bursts on selection without giving each control its own animation loop.',
    image: '/project-images/interaction-studies/pixel-state-machine-poster.png',
    imageAlt: 'A colored companion pixel moving between resolution and sky controls in Digital Loom',
    video: '/project-images/interaction-studies/pixel-state-machine.mp4',
    liveUrl: 'https://digital-loom-nine.vercel.app/',
    // githubUrl: 'https://github.com/kimestelle/digital-loom',
    // deepDiveUrl: '/projects/digital-loom',
    stage: 'current',
  },
  {
    id: 'iridescence',
    name: 'Iridescence',
    category: 'npm library in testing',
    date: 'Aug 2026',
    dateTime: '2026-08',
    explores:
      'non-intrusive WebGL / SVG overlay to enhance everyday DOM objects',
    technical:
      'One pointer-transparent WebGL layer mirrors each element’s bounds and corner radius, so the original DOM keeps handling focus, clicks, and form state.',
    image: '/project-images/interaction-studies/iridescence-poster.png',
    imageAlt: 'Iridescence applied across buttons, inputs, switches, sliders, and cards without replacing the controls',
    video: '/project-images/interaction-studies/iridescence.m4v',
    githubUrl: 'https://github.com/kimestelle/iridescence',
    stage: 'current',
  },
  {
    id: 'drift',
    name: 'Drift',
    category: 'spatial interface',
    date: 'Jul 2026',
    dateTime: '2026-07',
    explores:
      'voice agent and interactive artifact-driven take on maps for detours',
    technical:
      'Hume EVI provides the voice layer; CopilotKit agent actions set audible cues and render typed journey tickets.',
    image: '/project-images/interaction-studies/drift.png',
    imageAlt: 'Drift mobile interface showing a hand-drawn walking route and a prompt to let the route arrive slowly',
    video: '/project-images/interaction-studies/drift.mp4',
    videoFit: 'contain',
    recognition: 'SF Make-a-thon · Best Design + Use of CopilotKit',
    collaboration: 'team of 2',
    // liveUrl: 'https://drift-map-exploration.iamestellekim.chatgpt.site',
    // githubUrl: 'https://github.com/kimestelle/maps-explorations',
    stage: 'current',
  },
  {
    id: 'magnetic-poetry',
    name: 'Magnetic Poetry',
    category: 'shared text interface',
    date: 'Jul 2025',
    dateTime: '2025-07',
    explores:
      'minimal feedback loop for collaborative editing with WebSockets',
    technical:
      'Dragging stays local so it feels immediate. WebSockets only send the word that was added, moved, deleted, or reset.',
    image: '/project-images/covers/poetry-cover.webp',
    imageAlt: 'Magnetic Poetry interface with draggable words arranged on a shared board',
    video: '/project-images/interaction-studies/magnetic-poetry.mp4',
    liveUrl: 'https://magnetic-poetry.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/magnetic-poetry',
    stage: 'released',
  },
  {
    id: 'image-to-scene',
    name: 'Image to Scene',
    category: 'spatial authoring tool',
    date: 'Jun 2026',
    dateTime: '2026-06',
    explores:
      'using depth anything v2 to create hi-fi, low-load 2.5D parallax scenes',
    technical:
      'A worker estimates depth once. The image, depth map, and settings are then baked into a small WebGL renderer for HTML or React export.',
    image: '/project-images/covers/image-to-scene-cover.webp',
    imageAlt: 'Image to Scene depth-aware parallax editor',
    video: '/project-images/interaction-studies/image-to-scene.mp4',
    githubUrl: 'https://github.com/kimestelle/image-to-scene',
    stage: 'released',
  },
  {
    id: 'burning-paper',
    name: 'Burning Paper',
    category: 'causal visual system',
    date: 'May 2026',
    dateTime: '2026-05',
    explores:
      'one noise field for multiple visual effects + cursor becomes dancing spark',
    technical:
      'One noisy distance field keeps the hole, char, ember, grain, and text aligned while a small particle sheet moves the paper.',
    image: '/project-images/covers/burning-cover.webp',
    imageAlt: 'A letter burning outward from a pointer-selected origin',
    video: '/project-images/interaction-studies/burning-paper.mp4',
    liveUrl: 'https://burning-paper.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/burning-paper',
    stage: 'released',
  },
  {
    id: 'watercolor-drip',
    name: 'Watercolor Drip',
    category: 'persistent medium',
    date: 'Oct 2025',
    dateTime: '2025-10',
    explores:
      'bottom pixel row of a CPU canvas feeds top row of a GPU diffusion shader',
    technical:
      'Canvas2D handles the playful input. Its pixels feed two alternating WebGL textures that keep diffusing and drying the pigment underneath.',
    image: '/project-images/covers/watercolor-cover.webp',
    imageAlt: 'Watercolor pigment dripping and diffusing through a textured paper surface',
    video: '/project-images/interaction-studies/watercolor-drip.mp4',
    liveUrl: 'https://watercolor-drip-shader.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/watercolor-drip-shader',
    stage: 'released',
  },
  {
    id: 'textellation',
    name: 'Textellation',
    category: 'generative interface',
    date: 'Nov 2025',
    dateTime: '2025-11',
    explores:
      'packing algorithms + POS tagging + d3-force = organic but ordered text layouts',
    technical:
      'Paragraphs, sentences, and parts of speech constrain a force layout with measured text bounds, collisions, live editing, and export.',
    image: '/project-images/covers/textellation-cover.webp',
    imageAlt: 'Textellation poster arranging a passage into a typographic constellation',
    video: '/project-images/interaction-studies/textellation.mp4',
    liveUrl: 'https://www.textellation.com/',
    githubUrl: 'https://github.com/kimestelle/textellation',
    stage: 'released',
  },
  {
    id: 'softbody-jelly',
    name: 'Softbody Jelly',
    category: 'lightweight simulation',
    date: 'Sep 2025',
    dateTime: '2025-09',
    explores:
      'lathing, baking, and deforming a lightweight 2D mesh with 3D features',
    technical:
      'A 2D spring system deforms a drawn half-profile. I lathe that profile into 3D and recompute its normals so the changing silhouette also changes the light.',
    image: '/project-images/covers/blob-cover.webp',
    imageAlt: 'Customizable softbody jelly rendered with dimensional lighting',
    video: '/project-images/interaction-studies/softbody-jelly.mp4',
    liveUrl: 'https://2d-softbody-lathe.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/2d-softbody-lathe',
    stage: 'released',
  },
];
