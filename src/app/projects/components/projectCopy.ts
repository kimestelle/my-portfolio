export type ProjectSection =
  | 'shipped with teams'
  | 'graphics systems'
  | 'creative tools';

export type ProjectVariant = 'featured' | 'standard' | 'compact';

export type PortfolioProject = {
  id: string;
  name: string;
  section: ProjectSection;
  variant: ProjectVariant;
  metadata: {
    date: string;
    role: string;
    team?: string;
    result: string;
    stack: string;
  };
  collapsed: {
    purpose: string;
    roleLine: string;
    resultLine: string;
  };
  story: {
    goal: string;
    role?: string;
    owned?: string[];
    workedWith?: string[];
    challenge: string;
    decision: string;
    outcome: string;
    changedMind: string;
  };
  media?: {
    cover: string;
    preview?: string;
  };
  technicalLabel?: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: string;
};

export const PROJECT_SECTIONS: {
  id: ProjectSection;
  label: string;
}[] = [
  { id: 'shipped with teams', label: 'shipped with teams' },
  { id: 'graphics systems', label: 'graphics systems' },
  { id: 'creative tools', label: 'creative tools' },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'into-the-blue',
    name: 'Into the Blue',
    section: 'shipped with teams',
    variant: 'featured',
    metadata: {
      date: 'February–April 2025',
      role: 'frontend developer',
      team: '8 leads, developers, and designers, working with Penn Museum stakeholders',
      result: '180,000+ visitors; maintained for nine months',
      stack: 'Next.js · TypeScript · Canvas API · SVG · IndexedDB',
    },
    collapsed: {
      purpose:
        'An offline-first artifact hunt that lets Penn Museum visitors collect and remix what they discover.',
      roleLine: 'frontend developer · team of 8',
      resultLine: '180,000+ visitors · nine months of continued deployment',
    },
    story: {
      goal:
        'With its new exhibition Into the Blue, Penn Museum wanted a virtual companion. In eight weeks, our team built an offline-first scavenger hunt that guides visitors to find blue artifacts, “cut” them in place, and keep + remix a personal sticker collection.',
      role:
        'I proposed the cutout feature during early team discussions, built the camera-to-sticker and IndexedDB pipelines, and co-developed the stickerboard where visitors arranged + exported what they found.',
      owned: [
        'camera capture, dynamic SVG clipping, and sticker processing',
        'IndexedDB image, metadata, UI-state, and progress storage',
        'device-safe scaling, clipping, and zoom behavior',
        'collection flow and progress indicators',
        'stickerboard input math and PNG composition export',
      ],
      workedWith: [
        'designers on shared SVG and image geometry',
        'another developer on the custom stickerboard',
        'museum stakeholders on cultural and technical constraints',
      ],
      challenge:
        'The museum Wi-Fi was spotty, so backend dependencies were not an option. We also could not distort the appearance or cultural meaning of artifacts. That meant the camera image, SVG cutout, PNG overlay, device pixel ratio, cover-fit math, and zoom all had to line up across phones.',
      decision:
        'I proposed writing each sticker to IndexedDB immediately. The PNG, metadata, and progress state were keyed by artifact ID, so the app could recover after a restart, prevent duplicate captures, and keep working without waiting for the museum network.',
      outcome:
        'The web app supported more than 180,000 museum visitors and remained in active deployment and maintenance for nine months.',
      changedMind:
        'At first I treated the camera, outline, and exported sticker as separate layers to align. It became much simpler once they shared one reference box and every crop, transform, and export came from the same geometry.',
    },
    media: {
      cover: '/project-images/covers/museum-cover.webp',
      preview: 'GASgNQMNNJ016tzUTngLXSXFZ000228UTfdlfs5007gD8Y4',
    },
    technicalLabel:
      'how the camera, cutout, and offline storage pipeline fit together →',
    liveUrl: 'https://penn.museum/sites/blue/welcome/',
    githubUrl: 'https://github.com/PennSpark/into-the-blue',
  },
  {
    id: 'internet-atlas',
    name: 'Internet Atlas',
    section: 'shipped with teams',
    variant: 'featured',
    metadata: {
      date: 'Spring 2025; static preservation update in November 2025',
      role: 'technical lead',
      team: '7',
      result: '300+ sites · 1,000+ navigation edges · live demo for 40+ users',
      stack: 'React · React Three Fiber · WebGL · FastAPI · Pinecone · Supabase',
    },
    collapsed: {
      purpose:
        'Turning personal browsing history into an explorable 3D map of the web.',
      roleLine: 'technical lead · team of 7',
      resultLine: '300+ sites · 1,000+ edges · 40+ simultaneous users',
    },
    story: {
      goal:
        'The core question was: how do we travel the Internet? We wanted to make browsing footprints legible enough that people could understand and question what was being collected about them, instead of leaving it hidden in a corporate CSV.',
      role:
        "My design co-lead and I shaped the concept, then I translated it for the team as two connected systems: a pipeline for “scoring websites by feel” and a 3D force-directed graph for traveling through the results. I led the visualization and frontend/backend integration and contributed to model tests, scraping, embeddings, API design, and deployment.",
      owned: [
        'React Three Fiber graph, camera choreography, and selection behavior',
        'animated SVG overlays for landmarks, selections, and edge tracing',
        'frontend–backend API integration and graph interaction states',
        'technical direction, deployment, and later static preservation',
      ],
      workedWith: [
        'the design co-lead on the core question and interaction model',
        'ML developers on model and embedding tests',
        'backend developers on scraping, FastAPI, Pinecone, and Supabase',
      ],
      challenge:
        'There was no preexisting model for a word like “fuzzy.” We had to scrape and summarize site content, test different models + parameters, combine text and image embeddings, and still make hundreds of moving nodes and edges understandable in the browser.',
      decision:
        'We kept website vertices in Pinecone and user-specific edges + paths in Supabase. That kept session noise out of the semantic index and let us show either one person’s journey or an aggregate graph. User-supplied adjectives were embedded into the same space, so similarity could become a spatial axis without retraining anything.',
      outcome:
        'We shipped an interactive graph of more than 300 sites and 1,000 navigation edges, deployed it for a live class demo with more than 40 simultaneous users, and later preserved the experience as a static deployment when keeping the experimental backend online no longer justified the cost.',
      changedMind:
        'I originally thought the live ML pipeline was central to the project. When I later preserved it as a static experience, I realized the memorable part was exploring and questioning the map, not watching the infrastructure recompute it.',
    },
    media: {
      cover: '/project-images/covers/atlas-cover.webp',
      preview: 'aDL519jpf01J01rs1fZqqXPHw996LWwx9UD6Jh4ecZ9Xk',
    },
    technicalLabel:
      'how free-text adjectives became axes in a 3D graph →',
    liveUrl: 'https://the-internet-atlas.com/',
    githubUrl: 'https://github.com/PennSpark/sp25-internet-atlas',
  },
  {
    id: 'sce-data-engineering',
    name: 'Data Visualization Engineering at Southern California Edison',
    section: 'shipped with teams',
    variant: 'standard',
    metadata: {
      date: 'Summer 2024',
      role: 'data visualization engineering intern',
      result: '10+ production data solutions · utility serving 15 million residents',
      stack: 'SQL · Python · Snowflake · SAP · Palantir',
    },
    collapsed: {
      purpose:
        'Turning fragmented utility data into reporting systems that internal teams could trust.',
      roleLine: 'data visualization engineering intern · 9+ partner departments',
      resultLine: '10+ production solutions · systems serving 15 million residents',
    },
    story: {
      goal:
        'Different teams were pulling the same operational data from different systems and ending up with different answers. They needed reporting they could actually trust.',
      role:
        'I worked directly with 9+ departments, learned their workflows, and turned their questions into SQL pipelines, reporting views, and data models. I also inherited legacy ETL that had to be understood before it could be fixed.',
      owned: [
        'cross-platform SQL transformations',
        'reporting views and dashboard data models',
        'legacy ETL diagnosis and optimization',
      ],
      workedWith: [
        'operations stakeholders',
        'enterprise data teams',
        'more than nine internal departments',
      ],
      challenge:
        'The same facts lived across multiple database environments, and old assumptions were buried inside pipelines that people still depended on. I could not just rewrite them without understanding who would be affected.',
      decision:
        'Instead of writing a new query for every dashboard, I pulled repeated logic into shared transformations. It took longer upfront, but each new request became easier to validate and teams spent less time reconciling different versions of the same number.',
      outcome:
        'I delivered more than ten production data solutions for a utility serving 15 million residents and received a return offer.',
      changedMind:
        'I came in thinking the dashboard was the product. Most of the real work was underneath it. If the shared data model was clear, the next team could trust it and build on it without starting over.',
    },
    media: { cover: '/project-images/covers/edison-cover.webp' },
  },
  {
    id: 'spark-website',
    name: 'Penn Spark Website',
    section: 'shipped with teams',
    variant: 'standard',
    metadata: {
      date: 'January–February 2026',
      role: 'technical lead',
      result: 'one maintained public site and documented content workflow',
      stack: 'React · TypeScript · Vite · Tailwind · GitHub Pages',
    },
    collapsed: {
      purpose:
        "Modernizing a student organization's public site without discarding years of work and visual history.",
      roleLine: 'technical lead · built for a rotating student team',
      resultLine: 'one typed codebase · documented updates and deployment',
    },
    story: {
      goal:
        'Penn Spark needed one public home for its projects, community, clients, applications, and writing. It also had to survive a student team that changes every year.',
      role:
        'I led the technical update, consolidated the site into one codebase, and moved frequently edited content into typed data instead of hiding it inside page markup.',
      owned: [
        'React and Vite architecture',
        'project and community content models',
        'interactive banners and project browsing',
        'GitHub Pages deployment and contributor documentation',
      ],
      workedWith: [
        'organization leadership',
        'designers and developers',
        'future maintainers with different levels of frontend experience',
      ],
      challenge:
        'The site held years of projects and visual history. Starting over would have been cleaner for me, but worse for the organization. People needed to recognize it, know where things lived, and update it without asking the same person every semester.',
      decision:
        'I kept the useful content and visual pieces, but simplified the structure underneath them. Frequently updated areas became typed data, deployment stayed static, and the README points future contributors to the exact files they need.',
      outcome:
        'The organization now has one maintained React and TypeScript site with project archives, community data, a static Substack fallback, and a documented production workflow.',
      changedMind:
        'I used to think modernization meant replacement. This project made me more interested in keeping the decisions that still work and only changing the parts that make future work harder.',
    },
    media: {
      cover: '/project-images/covers/spark-cover.webp',
      preview: 'aCsuOGEkaXZUc600zfyrz182UMBPlzSCyNfUGIEDZtm00',
    },
    liveUrl: 'https://pennspark.org/',
    githubUrl: 'https://github.com/PennSpark/pennspark.github.io',
  },
  {
    id: 'digital-loom',
    name: 'Digital Loom',
    section: 'graphics systems',
    variant: 'featured',
    metadata: {
      date: 'July 2026 · in active development',
      role: 'solo designer and engineer',
      result: 'photo → PBR material → simulated cloth → portable export bundle',
      stack: 'Next.js · TypeScript · Three.js · WebGL/TSL · XPBD · FAL',
    },
    collapsed: {
      purpose:
        'A material studio that turns a fabric photograph into something you can inspect, tune, simulate, and take into another 3D workflow.',
      roleLine: 'solo designer + engineer · material and simulation R&D',
      resultLine: 'PBR extraction · interactive cloth · GLB and material export',
    },
    story: {
      goal:
        'I wanted a fabric photo to become more than a texture. Digital Loom turns one image into a material you can inspect, tune on live cloth or a 3D object, and export into another workflow.',
      role:
        'I built the full system: image-to-material processing, the fabric model, cloth solver, custom rendering, editing UI, preset storage, and exports.',
      owned: [
        'photo-to-material pipeline',
        'physically motivated fabric model',
        'XPBD cloth simulation and crease behavior',
        'weave, transmission, and parallax shading',
        'GLB, PBR-map, physics, and provenance export',
      ],
      challenge:
        'PBR maps describe how a surface looks. They do not explain how the cloth should bend, shear, catch wind, transmit light, or hold a crease. When I treated rendering and motion as separate controls, it was easy to make a fabric that looked right while still moving completely wrong.',
      decision:
        'I reduced each fabric to seven core facts: weight, coverage, thickness, fiber stiffness + type, weave, and twist. One function derives both solver and renderer values from them, so warp, weft, bend, porosity, translucency, sheen, fray, and relief all describe the same material.',
      outcome:
        'The studio can extract a material from one image, preview it on deforming cloth or a model, save and transfer swatches, and export named PBR maps, a packed ORM texture, a self-contained GLB, and machine-readable material and cloth-physics metadata.',
      changedMind:
        'I kept adding sliders because I thought more control would make the fabric more expressive. It mostly made the renderer and solver disagree. A smaller source of truth gave me a much larger range of believable materials.',
    },
    media: { cover: '/textures/matter/red-silk/albedo.png' },
    technicalLabel:
      'how one fabric model drives rendering, motion, and export →',
    liveUrl: 'https://digital-loom-nine.vercel.app/',
  },
  {
    id: 'mini-minecraft',
    name: 'Mini Minecraft',
    section: 'graphics systems',
    variant: 'standard',
    metadata: {
      date: 'Fall 2024',
      role: 'graphics engineer',
      team: '3',
      result: 'from-scratch C++ and OpenGL voxel engine',
      stack: 'C++ · OpenGL · GLSL · Qt',
    },
    collapsed: {
      purpose:
        'Building a voxel world from scratch to understand how rendering, simulation, and streaming fit together.',
      roleLine: 'graphics engineer · team of 3',
      resultLine: 'chunk renderer · animated materials · procedural sky and water',
    },
    story: {
      goal:
        'Our team wanted to rebuild Minecraft from the bottom up, without a game engine or prebuilt renderer, so we could understand how the pieces actually fit together.',
      role:
        'I built the first chunk renderer, texture + transparent material pipeline, and the final sky, cloud, sun, water, and lava shaders.',
      owned: [
        'exposed-face chunk meshing',
        'indexed, interleaved vertex buffers',
        'opaque and transparent texture passes',
        'day–night sky, clouds, animated fluids, and water normals',
      ],
      workedWith: [
        'one engineer on terrain generation and multithreading',
        'one engineer on player physics, caves, shadows, and post-processing',
      ],
      challenge:
        'The world had to keep expanding around the player without sending every hidden block face to the GPU. At the same time, opaque terrain, transparent water, animated textures, and lighting still had to share one understandable render loop.',
      decision:
        'I only generated faces next to air, then split opaque and transparent geometry into separate indexed buffers. That kept GPU work tied to visible surfaces and gave blending its own pass without duplicating the world.',
      outcome:
        'The team shipped a voxel engine with streamed terrain, procedural biomes and caves, multithreaded generation, player physics, shadows, and post-processing. My rendering work added chunk visibility, texture-atlas materials, a procedural day–night sky, Worley-noise clouds, and animated water with analytic wave normals.',
      changedMind:
        'I expected the rendering work to stay fairly self-contained. It did not. Chunks, terrain, player physics, materials, and post-processing all crossed the same code, so clear ownership, careful version control, and frequent integration mattered as much as the graphics.',
    },
    media: {
      cover: '/project-images/covers/minecraft-cover.webp',
      preview: 'Upynws87FCaT1Bgu1KXND012VF4x02pUW4UqgfZA2u9TQ',
    },
    githubUrl: 'https://github.com/kimestelle/mini-minecraft-opengl',
  },
  {
    id: 'image-to-scene',
    name: 'Image to Scene',
    section: 'graphics systems',
    variant: 'standard',
    metadata: {
      date: 'June 2026 · active local 3D iteration continues',
      role: 'solo designer and engineer',
      result: 'private, on-device depth inference with dependency-light exports',
      stack: 'TypeScript · transformers.js · WebGPU · WebGL',
    },
    collapsed: {
      purpose:
        'Turning one photo into a depth-aware scene without sending it to a server.',
      roleLine: 'solo designer + engineer',
      resultLine: 'on-device depth · interactive parallax · HTML/React export',
    },
    story: {
      goal:
        'I wanted to turn one still image into a small spatial scene, keep the image on-device, and let people take the result outside the original tool.',
      role:
        'I built the browser inference worker, raw WebGL renderer, depth-layer editor, and self-contained export pipeline.',
      challenge:
        'The depth model was useful while authoring, but much too large to ship inside every exported scene. It also had to run away from the main thread so the interface did not freeze while about 50 MB of weights loaded.',
      decision:
        'I separated authoring from playback. Depth Anything runs once in a worker through WebGPU or WASM. After that, the image, depth map, and settings are baked into a tiny renderer, so the export keeps the effect without carrying the model.',
      outcome:
        'The tool runs depth estimation locally, visualizes and groups depth layers, renders mouse-responsive parallax, and exports self-contained HTML, JSX, or TSX with no runtime model dependency.',
      changedMind:
        'I started with the model at the center of the project. Once the depth map existed, I realized the useful part was actually the much smaller renderer + export system around it.',
    },
    media: {
      cover: '/project-images/covers/image-to-scene-cover.webp',
      preview: 'V3e4Pv01DquLAUK15bHnTlfZYovS2jdbdR282Tc017YZU',
    },
    githubUrl: 'https://github.com/kimestelle/image-to-scene',
  },
  {
    id: 'softbody-jelly',
    name: 'Softbody Jelly',
    section: 'graphics systems',
    variant: 'compact',
    metadata: {
      date: 'September–October 2025',
      role: 'solo designer and engineer',
      result: 'editable 3D jelly driven by lightweight 2D motion',
      stack: 'TypeScript · WebGL · GLSL',
    },
    collapsed: {
      purpose:
        'Letting people shape and play with a responsive 3D jelly in the browser.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: '2D spring motion · lathed 3D mesh · live material editing',
    },
    story: {
      goal:
        'I wanted people to draw a jelly shape, turn it into something dimensional, and poke it without needing a full 3D soft-body simulation.',
      challenge:
        'The interaction is mostly frontal, so a full 3D solver felt like overkill. But a flat simulation could not catch light or feel like jelly on its own.',
      decision:
        'I sampled a drawn half-profile and revolved it into a 3D mesh, while keeping the live spring motion in 2D. I recompute normals as the mesh deforms and anchor the face to specific particles so everything moves together.',
      outcome:
        'The result is a build-your-own jelly that can be reshaped, textured, squished, and rendered with live specular and rim lighting on pointer and touch devices.',
      changedMind:
        'The simulation did not need to reproduce every internal force. If the silhouette rebounded well and the normals changed with it, people still read the object as soft and dimensional.',
    },
    media: {
      cover: '/project-images/covers/blob-cover.webp',
      preview: 'GZdl1cDfK9NOsulE9mAQ9UkLMYa49hifCeAKGZlI01RQ',
    },
    liveUrl: 'https://2d-softbody-lathe.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/2d-softbody-lathe',
  },
  {
    id: 'watercolor-shader',
    name: 'Watercolor Drip',
    section: 'graphics systems',
    variant: 'compact',
    metadata: {
      date: 'October 2025; visual update July 2026',
      role: 'solo designer and graphics engineer',
      result: 'live browser painting and pigment-drip playground',
      stack: 'TypeScript · Canvas API · WebGL · GLSL',
    },
    collapsed: {
      purpose:
        'Making digital pigment feel absorbed by paper without simulating an entire fluid.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: 'CPU interaction layer · GPU ping-pong diffusion',
    },
    story: {
      goal:
        'I wanted drawings and falling emoji to leave pigment that actually bled through paper instead of sitting flat on top of a canvas.',
      challenge:
        'The playful parts were easiest to build in a regular 2D canvas, but the persistent diffusion needed GPU state. Rebuilding everything as a fluid simulation would have added a lot of work without improving the one cue I cared about: pigment slowly soaking downward.',
      decision:
        'I split the piece into two layers. A CPU canvas handles drawing + falling objects, and its last pixel row feeds a small ping-pong shader underneath. The GPU only simulates the diffusion behavior the interaction actually needs.',
      outcome:
        'The live playground supports pointer and touch painting, interactive emoji rain, pigment blending, and a continuous drip surface in the browser.',
      changedMind:
        'I thought believable watercolor would need a general fluid model. A constrained diffusion rule + good paper texture produced the part people actually recognized.',
    },
    media: {
      cover: '/project-images/covers/watercolor-cover.webp',
      preview: 'Q6vpA2hHh4wYGgeMfJx2uQ7TeQP4521W01PPKnjuhg4o',
    },
    liveUrl: 'https://watercolor-drip-shader.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/watercolor-drip-shader',
  },
  {
    id: 'burning-paper',
    name: 'Burning Paper',
    section: 'graphics systems',
    variant: 'compact',
    metadata: {
      date: 'May 2026',
      role: 'solo designer and graphics engineer',
      result: 'interactive, origin-aware burning on a deforming letter',
      stack: 'TypeScript · WebGL · GLSL',
    },
    collapsed: {
      purpose:
        'Making a click feel like it ignites the page rather than starts a canned animation.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: 'deforming paper mesh · shared burn field · procedural char and ember',
    },
    story: {
      goal:
        'I wanted a letter to flutter like paper and start burning from the exact point someone touched.',
      challenge:
        'The hole, charred paper, glowing edge, text, grain, and moving surface all had to stay aligned while the burn expanded.',
      decision:
        'I represented the burn as one noisy radial distance field in the fragment shader. Intact paper, char, glow, and the discarded hole all come from that same field. A lightweight CPU particle sheet handles motion, so I did not need to store a separate state for every effect.',
      outcome:
        'The scene renders a responsive, wind-fluttered letter whose text, paper, char, and ember edge burn together from any click point.',
      changedMind:
        'A stateful combustion simulation sounded more realistic. One good visual field made the interaction clearer and kept every layer in agreement.',
    },
    media: {
      cover: '/project-images/covers/burning-cover.webp',
      preview: 'gYWFPIPw9CplE01tje01wnOVvzGYtUI5f7Q4GWpdTuHFg',
    },
    liveUrl: 'https://burning-paper.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/burning-paper',
  },
  {
    id: 'advanced-rendering-studies',
    name: 'Advanced Rendering Studies',
    section: 'graphics systems',
    variant: 'compact',
    metadata: {
      date: 'Spring 2025',
      role: 'individual graphics coursework',
      result: 'deferred PBR · screen-space effects · SDF ray marching',
      stack: 'C++ · OpenGL · GLSL',
    },
    collapsed: {
      purpose:
        'Studying how scene data, light, material, and screen-space effects combine inside a renderer.',
      roleLine: 'individual graphics coursework',
      resultLine: 'deferred PBR · screen-space effects · SDF ray marching',
    },
    story: {
      goal:
        'I built a series of small renderers to understand how PBR, shared scene buffers, post-processing, and ray-marched geometry add up to one image.',
      challenge:
        'Reflections, ambient occlusion, lighting, and post effects all needed the same geometry information. Repeating that work in every pass would have made the renderer slower and harder to reason about.',
      decision:
        'I used a deferred pipeline so albedo, normals, depth, and material masks could be shared across lighting + screen-space passes.',
      outcome:
        'The studies span Cook–Torrance material shading, screen-space reflections and ambient occlusion, image-space effects, and signed-distance-field ray marching.',
      changedMind:
        'I kept expecting one more elaborate shader to make the scene feel real. It was mostly several smaller passes agreeing about the same geometry.',
    },
    media: { cover: '/project-images/covers/461-cover.webp' },
  },
  {
    id: 'textellation',
    name: 'Textellation',
    section: 'creative tools',
    variant: 'standard',
    metadata: {
      date: 'November–December 2025',
      role: 'solo designer and engineer',
      result: 'passage-to-poster generator with editable layouts and export',
      stack: 'TypeScript · Canvas API · d3-force · wink-pos-tagger',
    },
    collapsed: {
      purpose:
        'Turning passages into typographic constellations without erasing how their words relate.',
      roleLine: 'solo designer + engineer',
      resultLine: 'linguistic layout · force simulation · exportable poster',
    },
    story: {
      goal:
        'I wanted to turn a passage into something visual without flattening it into a random word cloud.',
      challenge:
        'Strict reading order looked like normal typesetting. A fully unconstrained force layout looked organic, but lost everything meaningful about the original passage.',
      decision:
        'I built the layout in layers. Paragraphs become reading-order-biased ellipses sized by word count. Sentences get sunflower-distributed centers, and part-of-speech tags shape the typography + relationships inside a constrained force simulation.',
      outcome:
        'The tool turns a passage into an editable, zoomable typographic poster whose composition is shaped by paragraph, sentence, and grammatical structure.',
      changedMind:
        'I assumed randomness would make the layout feel organic. It mostly made the passage meaningless. A few linguistic constraints gave the motion something real to organize around.',
    },
    media: {
      cover: '/project-images/covers/textellation-cover.webp',
      preview: '01602whjZXp79w6lGOpvB00w12dlNUucu8xxA55Pezrxhk',
    },
    liveUrl: 'https://www.textellation.com/',
    githubUrl: 'https://github.com/kimestelle/textellation',
  },
  {
    id: 'magnetic-poetry',
    name: 'Magnetic Poetry',
    section: 'creative tools',
    variant: 'standard',
    metadata: {
      date: 'July 2025–January 2026',
      role: 'solo designer and engineer',
      result: 'collaborative pointer-and-touch poetry boards',
      stack: 'React · TypeScript · WebSockets',
    },
    collapsed: {
      purpose:
        'Making remote writing feel as tactile and low-stakes as moving words on a refrigerator.',
      roleLine: 'solo designer + engineer',
      resultLine: '4,000-word source set · shared rooms · pointer and touch controls',
    },
    story: {
      goal:
        'I wanted people on different devices to move the same small set of words around and feel the immediacy of a physical magnetic board.',
      challenge:
        'Dragging had to feel immediate locally while a shared room stayed in sync. Sending the whole board on every pointer move would have made both worse.',
      decision:
        'I kept direct manipulation local and only sent small word actions over the socket: add, move, delete, and reset. New collaborators receive the full room once, but ongoing movement only sends the changed word + normalized position.',
      outcome:
        'The tool supports local and shareable boards, a curated 4,000-word source set, mouse and touch dragging, snapshots, and optional camera-backed surfaces.',
      changedMind:
        'I thought the board might need a physics engine to feel tactile. Slight rotation, direct movement, hover response, and a clear delete gesture were enough.',
    },
    media: {
      cover: '/project-images/covers/poetry-cover.webp',
      preview: 'VfkS2WKIky8RS6hS3GO6vLHVAfJnbfYrTuSWv5jk57g',
    },
    liveUrl: 'https://magnetic-poetry.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/magnetic-poetry',
  },
];

export const FEATURED_PROJECT_IDS = [
  'into-the-blue',
  'internet-atlas',
  'digital-loom',
] as const;

export function getPortfolioProject(id: string) {
  return PORTFOLIO_PROJECTS.find((project) => project.id === id);
}
