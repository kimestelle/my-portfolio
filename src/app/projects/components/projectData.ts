//TYPES
export type ProjectCategory = 
  | 'production experience'
  | 'graphics & simulation'
  | 'creative tools'
  | 'technical explorations';

export type Project = {
  id: string; //for url references
  name: string;
  category: ProjectCategory;
  
  date: string;
  role: string;
  impact?: string;
  url?: string;
  
  // brief cover card
  cover: {
    imageSrc: string;
    blurb: string;
    engineering: string;
    tags: string[]; // surface-level tags
  };
  
  // full project page
  details: {
    label: string; // project tyle
    overview: string; // longer blurb
    techStack: {
      languages: string[];
      frameworks: string[];
      libraries: string[];
      databases: string[];
      platforms: string[];
    };
    // key features & contributions
    sections: {
      title: string;
      items: string[];
    }[];
    imageUrls: string[];
  };
};

//DATA
export const PROJECTS: Project[] = [
  {
    id: 'into-the-blue',
    name: 'Into the Blue',
    category: 'production experience',
    date: 'Spring 2024',
    role: 'Frontend Developer',
    impact: '180,000+ visitors / 9 months continuous deployment',
    url: 'https://penn.museum/sites/blue/welcome/',
    
    cover: {
      imageSrc: '/project-images/covers/museum-cover.png',
      blurb: 'Offline-first artifact hunt for museum visitors',
      engineering: 'Deployed for 9+ months to 180k visitors. IndexedDB storage pipeline + artifact cutout feature with SVG masking and even-odd clipping for complex paths. Coordinated with team of 8 across design, dev, and museum stakeholders.',
      tags: ['React', 'IndexedDB', 'System Design'],
    },
    
    details: {
      label: 'Interactive Museum Experience',
      overview: "Interactive Penn Museum scavenger hunt, deployed and continually updated with changing galleries. Built under 8-week deadline with team of 8 (designers, developers, museum stakeholders)",
      techStack: {
        languages: ['TypeScript'],
        frameworks: ['Next.js'],
        libraries: ['React'],
        databases: ['IndexedDB'],
        platforms: [],
      },
      sections: [
        {
          title: 'System Architecture',
          items: [
            'Proposed and implemented IndexedDB-based offline-first architecture to handle spotty museum WiFi',
            'User-generated content uploads asynchronously with zero latency and persists even on device restart',
            'Blob storage with metadata indexing for efficient retrieval',
            "Helped re-structure website to fit museum's static hosting requirement",
          ],
        },
        {
          title: 'Custom Cutout Feature',
          items: [
            'Owned artifact cutout system using HTML canvas + SVG masking (minimal alterations for cultural preservation)',
            "Implemented camera with even-odd clipping for complex paths and SVG 'cutting' animations",
            'Pixel-perfect scaling between camera feed, PNG overlays, SVG outlines, image clipping, & DPR and zoom level',
            'Coordinated with designers on shared viewBox dimensions for control over scale and positioning',
            'Added and rasterized sticker-like outline to captured images. Prototyped a version with rough edges using noise functions',
          ],
        },
        {
          title: 'Interactive Stickerboard',
          items: [
            'Co-created drag-and-drop interface with custom physics (no external libraries)',
            'Built export pipeline using html2canvas for shareable PNG compositions',
            'Implemented modal system with swipe gestures for sticker categories',
          ],
        },
      ],
      imageUrls: [
        '/project-images/into-the-blue/blue-demo.mp4',
        '/project-images/into-the-blue/image-1.png',
        '/project-images/into-the-blue/image-2.png',
      ],
    },
  },
  
  {
    id: 'internet-atlas',
    name: 'Internet Atlas',
    category: 'production experience',
    date: 'Spring 2025',
    role: 'Technical Lead',
    impact: 'Team of 7 / 300 nodes, 1000+ edges',
    url: 'https://the-internet-atlas.com/',
    
    cover: {
      imageSrc: '/project-images/covers/atlas-cover.png',
      blurb: 'Helping humans play with web browsing data',
      engineering: 'Technical Lead for 3D force-directed graph and ML pipeline to embed visual/textual ambience into spatial coordinates.',
      tags: ['Three.js', 'Supabase', 'FastAPI', 'AI/ML'],
    },
    
    details: {
      label: '3D Web Visualization with ML Embeddings',
      overview: "Experimental interface and ML pipeline exploring web browsing behavior through spatial representation. Turned design lead's vision into technical architecture and led full-stack development.",
      techStack: {
        languages: ['TypeScript', 'Python'],
        frameworks: ['Vite', 'FastAPI'],
        libraries: ['React', 'Three.js', 'D3.js'],
        databases: ['Supabase', 'Pinecone'],
        platforms: ['WebGL'],
      },
      sections: [
        {
          title: 'Visualization Engineering',
          items: [
            'Draggable 3D force graph using react-force-graph for 300+ nodes',
            'Dynamic camera transitions that zoom to nodes and user paths',
            'SVG overlays and animations synchronized with 3D scene using world to screen space conversions',
          ],
        },
        {
          title: "Capturing the 'Feel' of a Website",
          items: [
            'Tested and evaluated 5 combinations of local models, APIs, PCA clustering, and reduction strategies',
            'Used LLM-optimized web scraper for text and screenshot collection and FastAPI for minimal backend',
            'Separated website embedding storage (Pinecone) from metadata (Supabase) for efficient retrieval',
          ],
        },
        {
          title: 'Live Deployment',
          items: [
            'Backend built for scalability and modularity, accommodates live addition + embedding of new user paths',
            'Data schema is able to aggregate overlapping paths into a collaborative graph and isolate individual user journeys',
            'Deployed full application with Vercel and Render, handled 40+ simultaneous users',
            'Currently static due to costs',
          ],
        },
      ],
      imageUrls: ['/project-images/internet-atlas/atlas-demo.mp4',
        '/project-images/internet-atlas/image-1.png',
        '/project-images/internet-atlas/image-2.png'
      ],
    },
  },
  
  // GRAPHICS
  {
    id: 'mini-minecraft',
    name: 'Mini Minecraft',
    category: 'graphics & simulation',
    date: 'Fall 2024',
    role: 'Graphics Engineer',
    impact: 'Custom OpenGL engine / Team of 3',
    url: 'https://github.com/kimestelle/mini-minecraft-opengl',
    
    cover: {
      imageSrc: '/project-images/covers/minecraft-cover.png',
      blurb: 'Real-time rendering voxel engine from scratch',
      engineering: 'Built ground-up in C++/OpenGL with VBO-based terrain rendering, Perlin noise procedural generation, custom water shaders with reflections, multithreaded chunk loading.',
      tags: ['C++', 'OpenGL', 'Team Project'],
    },
    
    details: {
      label: 'OpenGL Graphics Engine',
      overview: 'From-scratch voxel and gameplay engine built in modern OpenGL. Implemented select rendering, simulation, and shader systems with a focus on performance and visual coherence.',
      techStack: {
        languages: ['C++', 'GLSL'],
        frameworks: [],
        libraries: [],
        databases: [],
        platforms: ['OpenGL'],
      },
      sections: [
        {
          title: 'Rendering Pipeline (No external libraries)',
          items: [
            'Interleaved VBOs and indexed drawing for efficient chunk rendering',
            'Culled non-visible block faces to reduce GPU overdraw',
            'Chunk-based terrain system with dynamic loading and unloading',
          ],
        },
        {
          title: 'Shader & Visual Systems',
          items: [
            'GLSL sky shader with procedural day–night cycle, coordinated with sun position and lighting',
            'Volumetric-feeling clouds using Worley noise and fBm',
            'Animated water and lava textures using time-based UV distortion',
            'Dynamic water surface displacement with recalculated normals and Blinn-Phong lighting for highlights',
          ],
        }
      ],
      imageUrls: ['/project-images/minecraft/mc-demo.mp4'],
    },
  },
  
  {
    id: 'advanced-raytracing',
    name: 'Advanced Raytracing in C++',
    category: 'graphics & simulation',
    date: 'Spring 2025',
    role: 'Graphics Engineer',
    impact: 'Custom renderer / Advanced shading models',
    
    cover: {
      imageSrc: '/project-images/covers/461-cover.png',
      blurb: 'Physically-based rendering with deferred shading',
      engineering: 'Deferred rendering pipeline with Cook–Torrance BRDF, ray marching with SDFs, subsurface scattering, and Hosek–Wilkie sky models.',
      tags: ['C++', 'GLSL', 'PBR'],
    },
    
    details: {
      label: 'Physically-Based Rendering Engine',
      overview: 'Built multiple rendering engines, exploring modern graphics techniques including deferred shading, physically-based lighting, and shader-based ray marching.',
      techStack: {
        languages: ['C++', 'GLSL'],
        frameworks: [],
        libraries: [],
        databases: [],
        platforms: ['OpenGL'],
      },
      sections: [
        {
          title: 'Deferred Rendering Architecture',
          items: [
            'Built deferred shading pipeline with G-buffer composition',
            'Separated albedo, normals, depth, and material masks for lighting passes',
            'Implemented screen-space reflections and post-processing stack',
          ],
        },
        {
          title: 'Physically-Based Shading',
          items: [
            'Implemented Cook–Torrance BRDF for realistic material response',
            'Integrated tone mapping and Gaussian blur post effects',
            'Built matcap shading modes for rapid material iteration',
          ],
        },
        {
          title: 'Procedural & Ray-Based Techniques',
          items: [
            'Implemented shader-based ray marching with signed distance fields (SDFs)',
            'Explored domain repetition and procedural geometry',
            'Integrated subsurface scattering and sky models (Hosek–Wilkie)',
          ],
        },
      ],
      imageUrls: ['/project-images/covers/461-cover.png'],
    },
  },
  
  {
    id: 'watercolor-shader',
    name: 'Watercolor Shader',
    category: 'graphics & simulation',
    date: 'Fall 2024',
    role: 'Graphics Engineer & Designer',
    impact: 'Custom shader system / Hybrid CPU/GPU pipeline',
    url: 'https://github.com/kimestelle/watercolor-drip-shader',
    
    cover: {
      imageSrc: '/cover-images/watercolor-image.png',
      blurb: 'Custom real-time fluid drip sim',
      engineering: 'Ping-pong buffer technique for fluid state simulation. Hybrid CPU/GPU pipeline with minimal diffuse system for real-time watercolor effects in GLSL.',
      tags: ['GLSL', 'WebGL', 'Shaders'],
    },
    
    details: {
      label: 'Real-Time Fluid Simulation',
      overview: 'Real-time watercolor drip simulator using custom GLSL shaders and ping-pong buffer technique. Explores organic fluid behavior through minimal diffusion systems.',
      techStack: {
        languages: ['TypeScript', 'GLSL'],
        frameworks: ['Next.js'],
        libraries: ['React', 'Three.js'],
        databases: [],
        platforms: ['WebGL'],
      },
      sections: [
        {
          title: 'Shader Architecture',
          items: [
            'Implemented ping-pong buffer technique for fluid state simulation',
            'Built hybrid CPU/GPU pipeline balancing performance with visual quality',
            'Designed minimal diffuse system mimicking watercolor paper absorption',
            'Created custom fragment shaders for color bleeding and edge darkening',
          ],
        },
        {
          title: 'Fluid Dynamics',
          items: [
            'Simulated gravity-driven drip behavior with velocity fields',
            'Implemented edge detection for pigment concentration effects',
            'Built color mixing system preserving watercolor luminosity',
            'Added subtle noise for organic texture variation',
          ],
        },
        {
          title: 'Interactive Controls',
          items: [
            'Real-time brush input with pressure-sensitive flow',
            'Dynamic parameter controls for viscosity and diffusion rate',
            'Built export system for high-resolution render output',
          ],
        },
      ],
      imageUrls: [
        '/project-images/watercolor/watercolor-demo.mp4',
      ],
    },
  },
  
  {
    id: 'softbody-jelly',
    name: 'Softbody Jelly',
    category: 'graphics & simulation',
    date: 'Fall 2024',
    role: 'Personal Project',
    impact: 'Custom particle physics / Procedural mesh generation',
    url: 'https://github.com/kimestelle/2d-softbody-lathe',
    
    cover: {
      imageSrc: '/cover-images/blob-image.png',
      blurb: 'Soft-body physics with hybrid 2D/3D rendering',
      engineering: 'Build-your-own 3D jelly interface using bezier curves, lathe meshing, particle physics, and shader tricks.',
      tags: ['Three.js', 'Physics', 'Canvas'],
    },
    
    details: {
      label: 'Hybrid 2D/3D Physics Playground',
      overview: 'Interactive soft-body physics sandbox combining 2D bezier editing with 3D mesh generation. Build custom jelly shapes that squish, bounce, and deform in real-time.',
      techStack: {
        languages: ['TypeScript', 'GLSL'],
        frameworks: ['Next.js'],
        libraries: ['React', 'Three.js'],
        databases: [],
        platforms: ['WebGL', 'Canvas'],
      },
      sections: [
        {
          title: 'Physics Simulation',
          items: [
            'Implemented Verlet integration for stable particle dynamics',
            'Built spring constraint system for soft-body deformation',
            'Designed collision detection with ground plane and boundaries',
            'Balanced restitution and damping for believable jelly behavior',
          ],
        },
        {
          title: 'Procedural Mesh Generation',
          items: [
            'Created lathe algorithm converting 2D bezier curves to 3D meshes',
            'Implemented dynamic vertex buffer updates for real-time shape changes',
            'Built UV mapping system for consistent texture application',
            'Optimized mesh topology for smooth deformation',
          ],
        },
        {
          title: 'Hybrid Rendering Pipeline',
          items: [
            'Synchronized 2D canvas bezier editor with 3D Three.js viewport',
            'Implemented custom shader for subsurface scattering effects',
            'Added dynamic lighting responding to jelly movement',
            'Created particle trail system for motion feedback',
          ],
        },
      ],
      imageUrls: [
        '/project-images/jelly/jelly-demo.mp4'
      ],
    },
  },
  
  // CREATIVE TOOLS
  {
    id: 'textellation',
    name: 'textellation',
    category: 'creative tools',
    date: 'Winter 2024',
    role: 'Personal Project',
    impact: 'Multi-format export / POS-driven typography',
    url: 'https://www.textellation.com/',
    
    cover: {
      imageSrc: '/cover-images/textellation-image.png',
      blurb: 'Typographic constellation maker',
      engineering: 'Canvas rendering with d3-force physics for organic word layouts. Custom packing algorithm positions paragraphs with reading-order bias.',
      tags: ['Canvas API', 'd3-force', 'Next.js'],
    },
    
    details: {
      label: 'Typographic Constellation Generator',
      overview: 'Transforms text passages into visual constellations where words orbit like stars. Custom packing algorithms and physics simulation create organic layouts guided by grammatical structure.',
      techStack: {
        languages: ['TypeScript'],
        frameworks: ['Next.js'],
        libraries: ['React', 'd3-force'],
        databases: [],
        platforms: ['Canvas API'],
      },
      sections: [
        {
          title: 'Layout Algorithms',
          items: [
            'Built custom tight-packing algorithm with reading-order bias',
            'Implemented ellipse sizing model balancing word count and canvas area',
            'Designed paragraph placement using rect-packing with scanline optimization',
            'Added micro-nudging system for visually balanced composition',
          ],
        },
        {
          title: 'Physics Simulation',
          items: [
            'Engineered d3-force simulation for organic word positioning',
            'Created sentence centers using sunflower seed distribution pattern',
            'Built custom force system: charge repulsion, collision, link constraints',
            'Implemented ellipse boundary clamping with velocity-based correction',
          ],
        },
        {
          title: 'Typographic Intelligence',
          items: [
            'Integrated POS tagging (wink-pos-tagger) for grammatical analysis',
            'Applied distinct styling to nouns, verbs, adjectives, first words',
            'Created visual hierarchy through font weight and style variation',
            'Built multi-format export (2000×2800 posters to phone wallpapers)',
          ],
        },
        {
          title: 'Visual Design',
          items: [
            'Canvas-based rendering with radial gradient backgrounds',
            'ASCII particle system avoiding ellipse boundaries',
            'Interactive 3x zoom magnification with smooth transitions',
            'Decorative elements: grid patterns, radial graphs, Roman numerals',
          ],
        },
      ],
      imageUrls: [
        '/project-images/textellation/demo.mp4',
        '/project-images/textellation/image-1.png',
        '/project-images/textellation/image-2.png',
        '/project-images/textellation/image-3.png',
      ],
    },
  },
  
  {
    id: 'magnetic-poetry',
    name: 'Magnetic Poetry',
    category: 'creative tools',
    date: 'Fall 2024',
    role: 'Personal Project',
    impact: '15k+ word corpus / Custom drag-drop physics',
    url: 'https://github.com/kimestelle/magnetic-poetry',
    
    cover: {
      imageSrc: '/cover-images/poetry-image.png',
      blurb: 'Interactive word magnets, drag-drop UI',
      engineering: 'Tactile poetry board made by pre-processing a poetry dataset and implementing custom responsive drag-drop UI.',
      tags: ['React', 'Data Processing'],
    },
    
    details: {
      label: 'Tactile Word Composition Interface',
      overview: 'Interactive poetry board inspired by refrigerator magnets. Curated word dataset meets physics-based drag-drop for tactile composition.',
      techStack: {
        languages: ['TypeScript'],
        frameworks: ['Next.js'],
        libraries: ['React'],
        databases: [],
        platforms: [],
      },
      sections: [
        {
          title: 'Data Pipeline',
          items: [
            'Processed 15k+ word poetry corpus with frequency analysis',
            'Implemented POS tagging to curate balanced word categories',
            'Built semantic clustering for contextual word grouping',
            'Designed word distribution algorithm favoring poetic potential',
          ],
        },
        {
          title: 'Interaction Design',
          items: [
            'Built custom drag-drop system without external physics libraries',
            'Implemented magnetic snapping behavior for natural arrangement',
            'Added subtle rotation and scale on hover for tactile feedback',
            'Created multi-touch support for tablet/mobile composition',
          ],
        },
        {
          title: 'Technical Features',
          items: [
            'Real-time collision detection preventing word overlap',
            'Persistent layout saving with browser storage',
            'Export system generating shareable composition images',
            'Responsive grid adapting to viewport dimensions',
          ],
        },
      ],
      imageUrls: [
        '/project-images/poetry/poetry-demo.mp4',
      ],
    },
  },
  
  {
    id: 'better-spelling-bee',
    name: 'Better Spelling Bee',
    category: 'creative tools',
    date: 'Summer 2024',
    role: 'Full-Stack Developer & Designer',
    impact: 'End-to-end system / Custom gameplay logic / Team of 2',
    url: 'https://github.com/kimestelle/better-spelling-bee',
    
    cover: {
      imageSrc: '/project-images/covers/spellingbee-cover.png',
      blurb: 'Playful word game with tactile interactions',
      engineering: 'Built word-generation engine filtering 46k-word dictionary in real time. JWT auth, PostgreSQL persistence, custom drag logic with playful animations.',
      tags: ['Next.js', 'Django', 'PostgreSQL'],
    },
    
    details: {
      label: 'Playful Full-Stack Web Game',
      overview: 'Reimagined word game inspired by NYT Spelling Bee, focused on tactility, playfulness, and expressive interaction rather than pure efficiency.',
      techStack: {
        languages: ['TypeScript', 'Python'],
        frameworks: ['Next.js', 'Django'],
        libraries: ['React'],
        databases: ['PostgreSQL'],
        platforms: ['Figma'],
      },
      sections: [
        {
          title: 'Gameplay & Systems Design',
          items: [
            'Built word-generation engine filtering a 46k-word dictionary in real time',
            'Guaranteed pangram existence through constrained search logic',
            'Designed stateful gameplay loop with caching and session persistence',
          ],
        },
        {
          title: 'Interaction Design',
          items: [
            'Created draggable letter blocks and playful duck avatars',
            'Implemented dynamic reordering and cloning via custom drag logic',
            'Used subtle animations to reinforce physicality and feedback',
          ],
        },
        {
          title: 'Full-Stack Architecture',
          items: [
            'Implemented JWT-based authentication and session handling',
            'Designed PostgreSQL schema for users, games, and statistics',
            'Balanced backend rigor with lightweight frontend feel',
          ],
        },
      ],
      imageUrls: [
        '/project-images/better-spelling-bee/bsb-demo.mp4',
        '/project-images/better-spelling-bee/image-1.png',
        '/project-images/better-spelling-bee/image-2.png',
      ],
    },
  },
  
  {
    id: 'holiday-gift-box',
    name: 'Holiday Gift Box',
    category: 'creative tools',
    date: 'Fall 2024',
    role: 'Personal Project',
    impact: 'Dozens of recipients / Fully shareable artifact',
    url: 'https://estelles-giftbox.vercel.app/6927',
    
    cover: {
      imageSrc: '/project-images/covers/giftbox-cover.png',
      blurb: 'Interactive web keepsake with 2D physics',
      engineering: 'URL-encoded gift identity with Firebase data fetching. 2D physics opening sequence, hand-drawn graphics, zero-friction sharing.',
      tags: ['Next.js', 'Firebase', 'Interaction Design'],
    },
    
    details: {
      label: 'Virtual Holiday Gift Box',
      overview: 'A lightweight interactive gift designed to translate the warmth of handwritten letters into a shareable, physical-feeling web experience.',
      techStack: {
        languages: ['TypeScript'],
        frameworks: ['Next.js'],
        libraries: ['React'],
        databases: [],
        platforms: ['Firebase', 'Vercel'],
      },
      sections: [
        {
          title: 'Emotional Interaction Design',
          items: [
            'Designed opening sequence using 2D physics to simulate spatial surprise',
            'Used hand-drawn graphics and custom handwriting font',
            'Focused on immediacy—no logins, no friction, single-click access',
          ],
        },
        {
          title: 'Technical Architecture',
          items: [
            'Encoded gift identity directly in URL routes for secure access',
            'Fetched recipient-specific data from Firebase via unique IDs',
            'Avoided account systems to preserve intimacy and ease',
          ],
        },
        {
          title: 'Craft & Presentation',
          items: [
            'Balanced playful animation with restraint',
            'Designed for emotional clarity over feature density',
            'Optimized for mobile-first sharing',
          ],
        },
      ],
      imageUrls: [
        '/project-images/gift-box/giftbox-demo.mp4',
        '/project-images/gift-box/image-1.png',
        '/project-images/gift-box/image-2.png',
      ],
    },
  },
  
  // TECH EXPLORATIONS
  {
    id: 'eat-or-plant',
    name: 'Eat or Plant?',
    category: 'technical explorations',
    date: 'Spring 2024',
    role: 'Engineer & Designer',
    impact: 'Interdisciplinary collaboration with architecture students',
    
    cover: {
      imageSrc: '/project-images/covers/chocolate-cover.png',
      blurb: 'Consuming the Amazon forest, bite by bite',
      engineering: 'Arduino-powered chocolate installation with capacitive sensing, laser-cut enclosure, and live datastream integration.',
      tags: ['Arduino', 'Fabrication', 'Electronics'],
    },
    
    details: {
      label: 'Interactive Arduino Installation',
      overview: 'Interactive art installation connecting physical chocolate consumption to Amazon deforestation through real-time environmental data. Collaborated with architecture masters students on engineering and fabrication.',
      techStack: {
        languages: ['C++'],
        frameworks: ['Arduino'],
        libraries: [],
        databases: [],
        platforms: ['Rhino', 'Adobe Illustrator'],
      },
      sections: [
        {
          title: 'Hardware System Engineering',
          items: [
            'Designed copper capacitive touch sensor array detecting tree removal',
            'Programmed LED matrix animations responding to physical interaction',
            'Built real-time feedback loop between physical objects and visual display',
            'Managed 3 synchronized LED arrays: tree positions, AQI gradient, alert system',
          ],
        },
        {
          title: 'API Integration',
          items: [
            'Connected to AirNow API for live Amazon rainforest air quality data',
            'Implemented 5-minute polling cycle with error handling',
            'Translated AQI thresholds into visual warning states (red flashing alerts)',
          ],
        },
        {
          title: 'Physical Fabrication',
          items: [
            '3D printed custom enclosures using Rhino',
            'Laser-cut acrylic components with Adobe Illustrator',
            'Integrated electronics with hand-crafted chocolate trees',
            'Designed physical form factor balancing aesthetics and sensor accessibility',
          ],
        },
      ],
      imageUrls: [
        '/project-images/chocolate/chocolate-demo.mp4',
        '/project-images/chocolate/image-1.png',
        '/project-images/chocolate/image-2.png',
      ],
    },
  },
];

// UTILITY FUNCTIONS
export const getCategoryProjects = (category: ProjectCategory) => 
  PROJECTS.filter(p => p.category === category);

export const getProjectById = (id: string) => 
  PROJECTS.find(p => p.id === id);