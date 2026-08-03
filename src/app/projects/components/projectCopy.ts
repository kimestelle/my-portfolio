export type ProjectSection =
  | 'product design'
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
    indexLine: string;
    roleLine: string;
    resultLine: string;
  };
  story: {
    goal: string;
    role?: string;
    feedback?: string;
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
  { id: 'product design', label: 'product design' },
  { id: 'graphics systems', label: 'graphics systems' },
  { id: 'creative tools', label: 'creative tools' },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'tally',
    name: 'tally',
    section: 'product design',
    variant: 'featured',
    metadata: {
      date: 'Spring 2026',
      role: 'product designer',
      result: '10 starting flows → a full product structure',
      stack: 'Figma · Mobile Flows · Interaction States · Prototypes',
    },
    collapsed: {
      purpose:
        "Social habit app built around contracts, proof, partners, transaction incentives, and somehow crypto wallets.",
      indexLine:
        'A habit app where proof, partners, and small bets have to make sense.',
      roleLine:
        'product design · flows, states, design system, and mobile UI',
      resultLine:
        '10 starting flows → a complete product structure',
    },
    story: {
      goal:
        'Tally lets someone put a small amount of money behind a habit, then prove it with a photo or Screen Time.',
      role:
        'I mapped and designed the full mobile product and its design system: contract setup and proof, wallet and funding, profiles and friends, feed, settings, and failure states.',
      owned: [
        'the full app map',
        'contract setup',
        'photo and Screen Time proof',
        'wallet, profile, feed, and settings flows',
        'the visual and component design system',
        'success, failure, waiting, and recovery states',
      ],
      challenge:
        'The app kept asking one more question: what counts, who checks, what happens to the money, and what if someone disagrees? Put together, setup started to feel like paperwork.',
      decision:
        'I made one contract path, split setup into smaller decisions, and gave photo and Screen Time the same states after proof was submitted.',
      outcome:
        'The final file covers setup, partner approval, daily proof, disputes, missed habits, wallet funding and history, profiles, friends, feed, settings, and the empty states between them.',
      changedMind:
        'I started by designing habit screens. The project got much easier once I realized the contract—not the habit card—was the thing moving through the app.',
    },
    media: {
      cover: '/project-images/covers/tally-cover.webp',
      preview: '/project-images/tally/demo/personalize-and-activate.m4v',
    },
    technicalLabel:
      'how contracts connect setup, proof, money, people, and account surfaces →',
  },
  {
    id: 'into-the-blue',
    name: 'Into the Blue',
    section: 'shipped with teams',
    variant: 'featured',
    metadata: {
      date: 'February–April 2025',
      role: 'frontend developer',
      team: '5-person development team within an 8-person project group',
      result: 'shipped in eight weeks · ran in the exhibition for nine months',
      stack: 'Next.js · TypeScript · Canvas API · SVG · IndexedDB',
    },
    collapsed: {
      purpose:
        'Mobile museum scavenger hunt where visitors photograph artifacts and collect them as stickers.',
      indexLine:
        'A camera-to-sticker scavenger hunt built for Penn Museum’s Into the Blue exhibition.',
      roleLine:
        'frontend developer · camera, sticker creation, and offline storage',
      resultLine:
        'eight-week build · nine-month exhibition deployment',
    },
    story: {
      goal:
        'We built a mobile scavenger hunt for Penn Museum’s Into the Blue exhibition. Visitors find selected artifacts, photograph them through a guided outline, and save the cutouts as stickers for a personal board.',
      role:
        'I proposed and built the camera-to-sticker interaction. I also built local storage for stickers and progress, then worked with another developer on the stickerboard.',
      feedback:
        'A gallery walk narrowed more than 200 blue objects to about 30 that visitors could see, frame, and responsibly use as collectibles. Museum staff also set limits on how artifacts could be cropped and altered.',
      owned: [
        'camera capture and guided artifact framing',
        'SVG masking and sticker generation',
        'offline sticker and progress storage',
        'collection states and stickerboard export',
      ],
      workedWith: [
        'the lead designer on camera framing and asset rules',
        'another developer on the stickerboard',
        'museum staff on cultural and exhibit constraints',
      ],
      challenge:
        'The camera image, guide outline, cutout mask, and exported sticker had to align across different phones. The experience also had to recover from unreliable museum Wi-Fi without losing a visitor’s collection.',
      decision:
        'We put every camera and sticker asset in one 300 × 360 coordinate system. I saved each completed sticker and its progress state to IndexedDB immediately, so the app could restore the collection after a refresh or connection drop.',
      outcome:
        'We shipped the experience in eight weeks. It remained in the exhibition for nine months while Penn Museum received more than 180,000 visitors.',
      changedMind:
        'I initially fixed alignment one layer at a time. A shared coordinate system removed most of those exceptions and made the interaction consistent across devices.',
    },
    media: {
      cover: '/project-images/covers/museum-cover.webp',
      preview: 'GASgNQMNNJ016tzUTngLXSXFZ000228UTfdlfs5007gD8Y4',
    },
    technicalLabel:
      'camera-to-sticker system and offline storage →',
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
      team: '8-person club team: 7 developers + 1 designer',
      result: '300+ sites · 1,000+ navigation edges · live demo for 40+ users',
      stack: 'React · React Three Fiber · WebGL · FastAPI · Pinecone · Supabase',
    },
    collapsed: {
      purpose:
        '3D map of browsing paths that reorganizes websites around words entered by the visitor.',
      indexLine:
        'Visitors enter descriptive words, move through a 3D graph, and inspect how people traveled between 300+ websites.',
      roleLine:
        'technical lead · product, visualization, integration, and deployment',
      resultLine:
        '300+ sites · 1,000+ navigation edges · 40+ people at live demo',
    },
    story: {
      goal:
        'Internet Atlas turns web-browsing histories into a 3D map. A visitor enters words such as “fuzzy” or “heavy,” the websites reorganize by semantic similarity, and the visitor can inspect individual or aggregate browsing paths.',
      role:
        'I co-led the product with the designer and served as technical lead for seven developers. I built the main graph interaction, assigned work, integrated the team’s branches, connected the data services, and deployed the project.',
      owned: [
        'early 2D prototype used to validate the data and interaction',
        '3D graph, camera movement, selection, and path inspection',
        'API integration and team branch merges',
        'deployment and later static preservation',
      ],
      workedWith: [
        'the design co-lead on the product and interaction model',
        'a data engineer on clustering and navigation paths',
        'ML teammates on embeddings, scraping, and model experiments',
      ],
      challenge:
        'The system had to translate open-ended words into a useful layout while keeping hundreds of sites and more than 1,000 path connections readable. The team was also building the data, ML, and interface layers in parallel.',
      decision:
        'We embedded each visitor’s words in the same semantic space as the websites, then used similarity as the graph’s spatial axis. Site embeddings stayed separate from browsing-session paths, which let the interface switch between semantic layout, individual journeys, and aggregate traffic.',
      outcome:
        'We shipped a graph with more than 300 sites and 1,000 navigation edges. More than 40 people used it during the live demo, and I later preserved the core interaction as a static site when the experimental backend became too expensive to run.',
      changedMind:
        'I expected the live ML pipeline to be the main value. The preserved version showed that the important parts were entering a point of view, seeing the graph change, and tracing the paths behind a pattern.',
    },
    media: {
      cover: '/project-images/covers/atlas-cover.webp',
      preview: 'aDL519jpf01J01rs1fZqqXPHw996LWwx9UD6Jh4ecZ9Xk',
    },
    technicalLabel:
      'semantic graph layout and browsing-path data →',
    liveUrl: 'https://the-internet-atlas.com/',
    githubUrl: 'https://github.com/PennSpark/sp25-internet-atlas',
  },
  {
    id: 'sce-data-engineering',
    name: 'Data Visualization Engineering at SoCal Edison',
    section: 'shipped with teams',
    variant: 'standard',
    metadata: {
      date: 'Summer 2024',
      role: 'data viz engineering intern',
      result: '10+ production data solutions · utility serving 15 million residents',
      stack: 'SQL · Python · Power BI · Power Apps · Power Automate',
    },
    collapsed: {
      purpose:
        'Nine departments needed the same operational data to stop producing different answers.',
      indexLine:
        'Shared reporting for nine departments at a utility serving 15 million residents.',
      roleLine: 'data viz engineering intern · 9 partner departments',
      resultLine: '10 production solutions · systems serving 15 million residents',
    },
    story: {
      goal:
        'Different teams were pulling the same operational data from different systems and ending up with different answers. They needed reporting they could actually trust.',
      role:
        'I worked directly with 9+ departments, learned their workflows, and turned their questions into SQL pipelines, reporting views, data models, and an internal dashboard redesign that made a core reporting tool easier to use.',
      feedback:
        'Stakeholders taught me the operations behind each request and told me whether the tools were actually usable. My teammates pushed me to plan for continuity after I left, so I documented every pipeline and worked inside the existing stack. I also started sending my manager short nightly updates so progress and blockers stayed visible.',
      owned: [
        'cross-platform SQL transformations',
        'reporting views and dashboard data models',
        'internal reporting dashboard redesign',
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
        'One public site that a rotating student team could update without starting over.',
      indexLine:
        "Consolidating three aging codebases without erasing Penn Spark's visual history.",
      roleLine: 'technical lead · built for a rotating student team',
      resultLine: 'one typed codebase · documented updates and deployment',
    },
    story: {
      goal:
        'Penn Spark needed one public home for its projects, community, clients, applications, and writing. It also had to survive a student team that changes every year.',
      role:
        'I led the technical update, consolidated three fragmented codebases into one Vite app, and moved frequently edited content into typed data instead of hiding it inside page markup.',
      feedback:
        'I sent a survey to club members, then followed up with people who had specific thoughts. They kept saying the site felt too colorful and playful, so we made the interactions quieter while keeping the visual pieces people still recognized.',
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
        'Years of projects and visual history were split across three codebases, including an outdated Gatsby site. Starting over would have been cleaner for me, but worse for the organization. People needed to recognize the site and update it without asking the same person every semester.',
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
        'Material editor that turns one fabric photo into PBR textures, simulated cloth, and an exportable 3D asset.',
      indexLine:
        'Upload a fabric photo, tune its appearance and motion together, then export the material and cloth asset.',
      roleLine: 'solo dev · material model, cloth solver, renderer, and export',
      resultLine: 'solo build · photo-to-PBR · XPBD cloth · portable export',
    },
    story: {
      goal:
        'Digital Loom is a browser-based fabric material editor. A user uploads a photo, gets starting PBR textures and cloth properties, previews the result on live cloth or a 3D object, adjusts it, and exports the asset.',
      role:
        'I designed and built the full product: image processing, material controls, cloth simulation, rendering, preset storage, and export.',
      owned: [
        'photo-to-PBR starting point',
        'shared fabric parameter model',
        'cloth simulation and crease controls',
        'weave, light transmission, and surface rendering',
        'GLB, texture, and cloth-settings export',
      ],
      challenge:
        'The editor exposes detailed controls for appearance and motion, so it is still possible to make a material that looks like silk but bends like canvas. The problem was giving each fabric a coherent starting point without removing useful overrides.',
      decision:
        'I built each fabric profile from seven source properties: density, cover, thickness, fiber stiffness, fiber type, weave, and twist. A derivation function turns those into renderer and solver defaults, then the editor keeps the lower-level controls available for deliberate tuning.',
      outcome:
        'The current build creates a starting material from one image, previews it on cloth or a model, and exports PBR textures, a packed ORM map, a self-contained GLB, and the cloth settings.',
      changedMind:
        'The detailed controls were not the problem by themselves. The missing piece was a coherent default. Fabric profiles now supply that baseline, while lower-level controls remain available and are saved as overrides.',
    },
    media: {
      cover: '/project-images/covers/loom-cover.webp',
      preview: '/project-images/digital-loom/demo/material-studio.m4v',
    },
    technicalLabel:
      'shared material model for rendering, simulation, and export →',
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
        'A C++ and OpenGL voxel world built without a game engine or prebuilt renderer.',
      indexLine:
        'A from-scratch voxel engine with streamed terrain, procedural biomes, and animated materials.',
      roleLine: 'graphics engineer · team of 3',
      resultLine: 'chunk renderer · animated materials · procedural sky and water',
    },
    story: {
      goal:
        'Our team wanted to rebuild Minecraft from the bottom up, without a game engine or prebuilt renderer, so we could understand how the pieces actually fit together.',
      role:
        'I built the first chunk renderer, the opaque and transparent material pipeline, the texture atlas, animated fluids, and the final day–night sky with an animated sun, procedural stars, and Worley + fBM clouds.',
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
        'Together we shipped streamed terrain, procedural biomes and caves, multithreaded generation, player physics, shadows, and post-processing. My rendering work covered visible-face chunks, texture-atlas materials, the day–night sky, Worley-noise clouds, and animated water.',
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
        'A private, on-device authoring tool where one photo becomes a depth-aware scene and leaves as a small renderer.',
      indexLine:
        'One photograph becomes a depth-aware scene without leaving the browser.',
      roleLine: 'solo designer + engineer',
      resultLine: 'on-device depth · interactive parallax · HTML/React export',
    },
    story: {
      goal:
        'The depth model is useful during authoring, but it should not own the image or follow the scene into production. One still becomes a spatial scene locally, then leaves the tool as a small renderer.',
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
        'A character editor where a 2D silhouette supplies the motion and a 3D surface supplies the light.',
      indexLine:
        'An editable jelly that uses 2D springs for motion and a lathed 3D surface for depth and light.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: '2D spring motion · lathed 3D mesh · live material editing',
    },
    story: {
      goal:
        'David Li’s Blob Opera made softness look like an agreement between silhouette, rebound, and light—not a demand for a general-purpose solver. People can draw a profile, turn it into a 3D form, and poke it while the live motion stays two-dimensional.',
      challenge:
        'The interaction is mostly frontal, so a full 3D solver felt like overkill. But a flat simulation could not catch light or feel like jelly on its own.',
      decision:
        'I sampled a drawn half-profile and revolved it into a 3D mesh, while keeping the live spring motion in 2D. I recompute normals as the mesh deforms and anchor the face to specific particles so everything moves together.',
      outcome:
        'People can draw a jelly profile, turn it into a 3D form, texture it, and squish it with a pointer or touch.',
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
        'A loose drawing surface where falling glyphs and pointer marks become persistent pigment.',
      indexLine:
        'A Canvas2D drawing layer feeds a GPU loop where pigment diffuses, accumulates, and dries.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: 'CPU interaction layer · GPU ping-pong diffusion',
    },
    story: {
      goal:
        'Falling emoji, pointer forces, and direct painting should remain easy to invent in Canvas2D, while every mark still crosses into pigment that diffuses, dries, and appears absorbed by paper.',
      challenge:
        'The playful parts were easiest to build in a regular 2D canvas, but the persistent diffusion needed GPU state. Rebuilding everything as a fluid simulation would have added a lot of work without improving the one cue I cared about: pigment slowly soaking downward.',
      decision:
        'I split the piece into two systems. Canvas2D handles the emoji cloud, falling glyphs, and rainbow brush. Each frame, only its bottom pixel row enters the top of a separate WebGL surface, where two alternating textures diffuse and dry the pigment.',
      outcome:
        'The live playground supports pointer and touch painting, interactive emoji rain, pigment blending, and a continuous drip surface in the browser.',
      changedMind:
        'I thought believable watercolor would need a general fluid model. A constrained diffusion rule and good paper texture produced the part people actually recognized.',
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
        'A paper letter where touch, deformation, and fire share the same cause.',
      indexLine:
        'One burn field keeps the hole, char, ember, and moving paper aligned.',
      roleLine: 'solo designer + graphics engineer',
      resultLine: 'deforming paper mesh · shared burn field · procedural char and ember',
    },
    story: {
      goal:
        'The burn had to read as a consequence of touching the paper, not as a canned animation layered over it. Its origin, moving sheet, text, char, and hole all needed to remain part of one event.',
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
        'Small renderers for understanding how scene data becomes light, material, and screen-space effects.',
      indexLine:
        'Deferred PBR, screen-space effects, and SDF ray marching built from the inside out.',
      roleLine: 'individual graphics coursework',
      resultLine: 'deferred PBR · screen-space effects · SDF ray marching',
    },
    story: {
      goal:
        'I built a series of small renderers to understand how PBR, shared scene buffers, post-processing, and ray-marched geometry add up to one image.',
      challenge:
        'Reflections, ambient occlusion, lighting, and post effects all needed the same geometry information. Repeating that work in every pass would have made the renderer slower and harder to reason about.',
      decision:
        'I used a deferred pipeline so albedo, normals, depth, and material masks could be shared across lighting and screen-space passes.',
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
        'A poster generator between typesetting and a word cloud: loose in space, still shaped by grammar.',
      indexLine:
        'A passage becomes an editable typographic constellation shaped by its own grammar.',
      roleLine: 'solo designer + engineer',
      resultLine: 'linguistic layout · force simulation · exportable poster',
    },
    story: {
      goal:
        'Textellation treats a passage as both language and visual material. The composition can loosen beyond reading order without flattening paragraphs, sentences, and grammar into a random word cloud.',
      challenge:
        'Strict reading order looked like normal typesetting. A fully unconstrained force layout looked organic, but lost the sentence and grammar relationships in the original passage.',
      decision:
        'I built the layout in layers. Paragraphs become reading-order-biased ellipses sized by word count. Sentences get sunflower-distributed centers, and part-of-speech tags shape the typography and relationships inside a constrained force simulation.',
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
        'A shared writing surface built around arranging words rather than typing them.',
      indexLine:
        'A shared board with roughly 4,000 magnetic words that stay quick to move on pointer and touch.',
      roleLine: 'solo designer + engineer',
      resultLine:
        'roughly 4,000 words · shared rooms · pointer and touch controls',
    },
    story: {
      goal:
        'Composing happens through arrangement rather than a text cursor. Thoughts move into shape on a board where every word stays provisional: another person can open it, move it, or continue from it.',
      challenge:
        'Dragging had to feel immediate locally while a shared room stayed in sync. Sending the whole board on every pointer move would have made both worse.',
      decision:
        'I kept direct manipulation local and only sent small word actions over the socket: add, move, delete, and reset. New collaborators receive the full room once, but ongoing movement only sends the changed word and normalized position.',
      outcome:
        'The tool supports local and shareable boards, a curated source set of roughly 4,000 words, mouse and touch dragging, snapshots, and optional camera-backed surfaces.',
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
  'tally',
] as const;

export const CASE_STUDY_PROJECT_IDS = [
  ...FEATURED_PROJECT_IDS,
] as const;

export function getPortfolioProject(id: string) {
  return PORTFOLIO_PROJECTS.find((project) => project.id === id);
}
