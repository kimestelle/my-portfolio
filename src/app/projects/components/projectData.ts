//TYPES
export type ProjectCategory = 
  | 'production experience'
  | 'graphics & simulation'
  | 'creative tools'
  // | 'technical explorations';

export type Project = {
  id: string; //for url references
  name: string;
  category: ProjectCategory;
  
  date: string;
  role: string;
  impact?: string;
  url?: string;
  githubUrl?: string;
  
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

// UTILITY FUNCTIONS
export const getCategoryProjects = (category: ProjectCategory) => 
  PROJECTS.filter(p => p.category === category);

export const getProjectById = (id: string) => 
  PROJECTS.find(p => p.id === id);

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
    githubUrl: 'https://github.com/PennSpark/into-the-blue',
    
    cover: {
      imageSrc: '/project-images/covers/museum-cover.webp',
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
        'GASgNQMNNJ016tzUTngLXSXFZ000228UTfdlfs5007gD8Y4',
        '/project-images/into-the-blue/image-1.webp',
        '/project-images/into-the-blue/image-2.webp',
      ],
    },
  },

  {
    id: 'sce-data-engineering',
    name: 'Data Viz Engineer Intern @ SCE',
    category: 'production experience',
    date: 'Summer 2024',
    role: 'Data Engineering Intern',
    impact: 'Serving 15m residents across Southern California',

    cover: {
      imageSrc: '/project-images/covers/edison-cover.webp',
      blurb: 'ETL systems for utility serving 15m residents',
      engineering:
        'Worked independently with 9+ internal teams to design + optimize cross-platform data pipelines and visualizations.',
      tags: ['SQL', 'Data Engineering', 'Python'],
    },

    details: {
      label: 'Enterprise Data Infrastructure',
      overview:
        'Designed and optimized SQL-based data pipelines serving utility infrastructure at scale for Southern California Edison.',
      techStack: {
        languages: ['SQL', 'Python'],
        frameworks: [],
        libraries: [],
        databases: ['Enterprise SQL'],
        platforms: [],
      },

      sections: [
        {
          title: 'Internal Tooling',
          items: [
            'Worked independently with 9+ internal departments to create data visualizations, optimize legacy ETL pipelines, and build new data models',
            'Funneled data between multiple enterprise SQL databases to create unified reporting views',
            'Received positive performance reviews and return offer, please contact for manager recommendation!',
          ],
        },
        // {
        //   title: 'Internal Tooling',
        //   items: [
        //     'Improved query performance across enterprise database',
        //     'Built data visualizations for operational insights',
        //     'Ensured data quality and consistency across multiple sources',
        //   ],
        // },
        // {
        //   title: 'Manager Recommendation',
        //   items: ['I am writing to provide a strong recommendation for Estelle Kim, who has recently completed a summer internship in data engineering and visualization at SCE under my supervision. Throughout her time with us, Estelle has demonstrated exceptional skills, dedication, and a remarkable ability to grasp complex concepts quickly.',
        //     'Estelle has consistently shown a high level of proficiency in data engineering tasks, including data modeling, SQL and Python code optimization, ETL processes, and data management.',
        //     'During her internship, Estelle worked on several impactful projects and initiatives involving data pipeline optimization, dashboard development, and data analysis. She has become proficient in tools such as Python, SQL, Power BI, Power Apps and Power Automate. One of her standout contributions was redesigning and fixing our internal reporting dashboard, which significantly improved usability.',
        //     "Furthermore, Estelle's work ethic and enthusiasm for learning have been evident in all her projects. She approaches each task with a positive attitude and a commitment to excellence, often going above and beyond what is expected. Her collaborative nature has made her a valuable team member, always willing to share her knowledge and assist others.",
        //     'In conclusion, I believe Estelle Kim possesses the skills, dedication, and potential to excel in any data engineering and visualization role she pursues. I highly recommend her for any future opportunities and am confident that she will be an invaluable asset to your team.'
        //   ]
        // }
      ],

      imageUrls: ['/project-images/covers/edison-cover.webp'],
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
    githubUrl: 'https://github.com/PennSpark/sp25-internet-atlas',
    
    cover: {
      imageSrc: '/project-images/covers/atlas-cover.webp',
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
      imageUrls: ['aDL519jpf01J01rs1fZqqXPHw996LWwx9UD6Jh4ecZ9Xk',
        '/project-images/internet-atlas/image-1.webp',
        '/project-images/internet-atlas/image-2.webp'
      ],
    },
  },

  {
    id: 'spark-website',
    name: 'Penn Spark Website',
    category: 'production experience',
    date: 'Fall 2024 - Present',
    role: 'Technical Lead',
    impact: 'Deployed Live / Actively Maintained',
    url: 'https://pennspark.org/',
    githubUrl: 'https://github.com/PennSpark/pennspark.github.io',

    cover: {
      imageSrc: '/project-images/covers/spark-cover.webp',
      blurb: "Redesign and modernization for public website",
      engineering: 'Preserving brand identity while establishing sustainable development practices for future club generations.',
      tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    },
    
    details: {
      label: 'Student Organization Website - Technical Leadership',
      overview: 'Leading redesign of Penn Spark\'s website with focus on sustainability and future maintainability. Chose incremental improvement over rebuild to preserve brand identity from past designers while consolidating architecture and establishing proper development standards.',
      techStack: {
        languages: ['TypeScript', 'JavaScript'],
        frameworks: ['Next.js'],
        libraries: ['React', 'Tailwind CSS'],
        databases: [],
        platforms: ['Vercel'],
      },

      sections: [
        {
          title: 'Preserving While Modernizing Existing Codebase',
          items: [
            "Existing codebase was well-organized but fragmented across 3 codebases and deployed on outdated Gatsby platform",
            'Consolidated repositories and migrated to TypeScript + Tailwind + Vite with lazy loading',
            'Kept parts of data structure and styling that worked while refactoring and optimizing the rest',
            'Sacrificed some performance for a static GitHub pages deployment to preserve free hosting and ease of contribution',
          ],
        },
        {
          title: "Strengthening Brand with Interactive Motion",
          items: [
            "Built custom banners for each page using custom canvas logic, dynamic HTML, Three.JS, matter.js, etc.",
            "Carousel banners with dynamic content filtering for homepage and client page",
            "Mouse-responsive coloring boxes and pills done two ways: CSS and JavaScript"
          ]
        },
        {
          title: "Clean Code for the User & Developer",
          items: [
            'Identified most frequently updated areas (community directory, projects), and refactored them from hard-coded JavaScript into type-safe data structures',
            'Established test deployment before production, introducing proper development practices to team',
            'Created detailed README documentation to ensure future developers do not encounter surprises',
          ],
        },
        {
          title: 'Current Focus: Standards & Accessibility',
          items: [
            'Implementing rigorous web standards and accessibility guidelines now that stable foundation is established.',
          ],
        },
      ],

      imageUrls: [
        'aCsuOGEkaXZUc600zfyrz182UMBPlzSCyNfUGIEDZtm00',
      ],
    },
  },

  // GRAPHICS
  {
    id: 'mini-minecraft',
    name: 'Mini Minecraft',
    category: 'graphics & simulation',
    date: 'Fall 2024',
    role: 'Class Project',
    impact: 'Custom OpenGL engine / Team of 3',
    githubUrl: 'https://github.com/kimestelle/mini-minecraft-opengl',
    
    cover: {
      imageSrc: '/project-images/covers/minecraft-cover.webp',
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
      imageUrls: ['Upynws87FCaT1Bgu1KXND012VF4x02pUW4UqgfZA2u9TQ'],
    },
  },
  
  {
    id: 'advanced-raytracing',
    name: 'Advanced Raytracing in C++',
    category: 'graphics & simulation',
    date: 'Spring 2025',
    role: 'Class Project',
    impact: 'Custom renderer / Advanced shading models',
    
    cover: {
      imageSrc: '/project-images/covers/461-cover.webp',
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
            'Built deferred shading pipeline with G-buffer optimizations',
            'Separated albedo, normals, depth, and material masks for lighting passes',
            'Implemented screen-space reflections and ambient occlusion for realism',
          ],
        },
        {
          title: 'Physically-Based Shading',
          items: [
            'Implemented Cook–Torrance BRDF for realistic material',
            'Integrated post effects such as gamma correction, Gaussian blur, Sobel edge detection',
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
      imageUrls: ['/project-images/covers/461-cover.webp'],
    },
  },
  
  {
    id: 'watercolor-shader',
    name: 'Watercolor Shader',
    category: 'graphics & simulation',
    date: 'Fall 2024',
    role: 'Graphics Engineer & Designer',
    impact: 'Custom shader system / Hybrid CPU/GPU pipeline',
    url: 'https://watercolor-drip-shader.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/watercolor-drip-shader',
    
    cover: {
      imageSrc: '/project-images/covers/watercolor-cover.webp',
      blurb: 'Custom real-time fluid drip sim',
      engineering: 'Ping-pong buffer, minimal diffusion operations, and two-canvas optimization for real-time watercolor effects in GLSL.',
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
            'Dual canvas: top canvas uses CPU for mouse imput and emoji movement, while bottom canvas takes the last pixel line of top canvas as input for GPU drip sim',
            'Minimal, constant-time bounded diffuse system mimicking watercolor paper absorption',
            'Custom fragment shaders for color bleeding and blending',
          ],
        },
        {
          title: "Subtle Visual Details",
          items: [
            'Moving gradient background behind cloud',
            'Background perspective shift on mouse movement',
            "Lower opacity in 'wet' areas of the paper",
            "Max. bound on number of emojis on canvas without restricting user actions"
          ]
        },
        {
          title: 'Interactive Controls',
          items: [
            "Mouse 'paint' mode intuitively toggled on click",
            'Hover on cloud cell to release emoji, click to release entire cloud',
            "Select emojis to change what's raining",
          ],
        },
      ],
      imageUrls: [
        'Q6vpA2hHh4wYGgeMfJx2uQ7TeQP4521W01PPKnjuhg4o',
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
    url: 'https://2d-softbody-lathe.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/2d-softbody-lathe',
    
    cover: {
      imageSrc: '/project-images/covers/blob-cover.webp',
      blurb: 'Soft-body physics with hybrid 2D/3D rendering',
      engineering: 'Build-your-own 3D jelly interface using bezier curves, lathe meshing, particle physics, and shader tricks.',
      tags: ['WebGL', 'HTML canvas'],
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
          title: "'3D' Softbody Physics in Real-Time?",
          items: [
            'Real 3D softbody physics are too expensive for the web',
            'Wanted to build a lightweight, modular material people can experience without compromising on speed or realism',
          ],
        },
        {
          title: 'Solution: Hybrid 2D/3D Approach',
          items: [
            'Built a lathe algorithm constructing the front view of a 3D mesh from 2D bezier curves',
            'Implemented simple 2D particle physics with spring and damping forces to simulate soft-body behavior',
          ],
        },
        {
          title: 'Graphics & Shader Tricks',
          items: [
            'Fixed normals, texture mapping, vertex z positions, and lighting for efficiency',
            'Updated vertex x/y positions based on particle simulation',
            'Custom shaders for specular and rim lighting to enhance jelly-like appearance',
            'if/then branching in fragment shader to differentiate facial features from body',
          ],
        },
      ],
      imageUrls: [
        'GZdl1cDfK9NOsulE9mAQ9UkLMYa49hifCeAKGZlI01RQ'
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
    impact: 'Organic text layouts / POS-driven typography',
    url: 'https://www.textellation.com/',
    githubUrl: 'https://github.com/kimestelle/textellation',
    
    cover: {
      imageSrc: '/project-images/covers/textellation-cover.webp',
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
            'Rectangle packing algorithm with reading-order bias for paragraph ellipses',
            'Ellipse sizing model balancing word count and canvas area',
            'Iterative adjustment of ellipse positions to minimize overlaps',
          ],
        },
        {
          title: 'Force Graph Dispersion',
          items: [
            'd3-force simulation for organic word positioning',
            'Created sentence centers using sunflower seed distribution pattern',
          ],
        },
        {
          title: 'Typographic Intelligence',
          items: [
            'Integrated POS tagging (wink-pos-tagger) for grammatical analysis',
            'Applied distinct styling and link structure to nouns, verbs, adjectives, first words',
            'Custom font for ASCII star icons'
          ],
        },
        {
          title: 'Visual Design',
          items: [
            'Canvas-based rendering with radial gradient backgrounds',
            'ASCII star scatter avoiding ellipse boundaries',
            'Decorative elements: grid patterns, radial graphs, Roman numerals',
          ],
        },
      ],
      imageUrls: [
        '01602whjZXp79w6lGOpvB00w12dlNUucu8xxA55Pezrxhk',
        '/project-images/textellation/image-1.webp',
        '/project-images/textellation/image-2.webp',
        '/project-images/textellation/image-3.webp',
      ],
    },
  },
  
  {
    id: 'magnetic-poetry',
    name: 'Magnetic Poetry',
    category: 'creative tools',
    date: 'Fall 2024',
    role: 'Personal Project',
    impact: '15k+ word corpus / Collaborative drag-drop UI',
    url: 'https://magnetic-poetry.vercel.app/',
    githubUrl: 'https://github.com/kimestelle/magnetic-poetry',
    
    cover: {
      imageSrc: '/project-images/covers/poetry-cover.webp',
      blurb: 'Real-time collaborative poetry board',
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
          title: 'Data Curation',
          items: [
            'Parsed and processed Gutenberg poetry corpus, extracting and ranking words by frequency'
          ],
        },
        {
          title: 'Interaction Design',
          items: [
            'Built custom drag-drop system without external physics libraries',
            'Slight random rotation and mouse hover response for tactile feedback',
            'Subtle cue for deleting words by dragging off-canvas',
            'Supports both click-drag and touch-drag interactions',
          ],
        },
        {
          title: 'Real-time Collaboration',
          items: [
            'Implemented WebSocket-based real-time multi-user sync via shareable URL routes',
            'Optimized payloads to only send position and word changes',
          ],
        }
      ],
      imageUrls: [
        'VfkS2WKIky8RS6hS3GO6vLHVAfJnbfYrTuSWv5jk57g',
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
    githubUrl: 'https://github.com/kimestelle/better-spelling-bee',
    
    cover: {
      imageSrc: '/project-images/covers/spellingbee-cover.webp',
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
            'Built word-generation engine using indexes, filtering a 46k-word dictionary in real time',
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
        'MoJuRZd5h6vDizNCa7IA6PAdFv02401APHwtxT6Zc34dk',
        '/project-images/better-spelling-bee/image-1.webp',
        '/project-images/better-spelling-bee/image-2.webp',
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
      imageSrc: '/project-images/covers/giftbox-cover.webp',
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
            'Animated opening sequence using to simulate surprise',
            'Used hand-drawn graphics and custom handwriting font',
            'Focused on immediate, single-click access for recipients',
          ],
        },
        {
          title: 'Minimal Data Handling',
          items: [
            'Encoded Firebase document ID directly in URL routes for easy, invisible personalized data fetching',
          ],
        },
      ],
      imageUrls: [
        'a00AFc4Ppdzh9qScLuldQUKHv028dT681zlcB1ubKF7Qs',
        '/project-images/gift-box/image-1.webp',
        '/project-images/gift-box/image-2.webp',
      ],
    },
  },
  
  // TECH EXPLORATIONS
  // {
  //   id: 'eat-or-plant',
  //   name: 'Eat or Plant?',
  //   category: 'technical explorations',
  //   date: 'Spring 2024',
  //   role: 'Engineer & Designer',
  //   impact: 'Interdisciplinary collaboration with architecture students',
    
  //   cover: {
  //     imageSrc: '/project-images/covers/chocolate-cover.webp',
  //     blurb: 'Consuming the Amazon forest, bite by bite',
  //     engineering: 'Arduino-powered chocolate installation with capacitive sensing, laser-cut enclosure, and live datastream integration.',
  //     tags: ['Arduino', 'Fabrication', 'Electronics'],
  //   },
    
  //   details: {
  //     label: 'Interactive Arduino Installation',
  //     overview: 'Interactive art installation connecting physical chocolate consumption to Amazon deforestation through real-time environmental data. Collaborated with architecture masters students on engineering and fabrication.',
  //     techStack: {
  //       languages: ['C++'],
  //       frameworks: ['Arduino'],
  //       libraries: [],
  //       databases: [],
  //       platforms: ['Rhino', 'Adobe Illustrator'],
  //     },
  //     sections: [
  //       {
  //         title: 'Hardware System Engineering',
  //         items: [
  //           'Designed copper capacitive touch sensor array detecting tree removal',
  //           'Programmed LED matrix animations responding to physical interaction',
  //           'Built real-time feedback loop between physical objects and visual display',
  //           'Managed 3 synchronized LED arrays: tree positions, AQI gradient, alert system',
  //         ],
  //       },
  //       {
  //         title: 'API Integration',
  //         items: [
  //           'Connected to AirNow API for live Amazon rainforest air quality data',
  //           'Implemented 5-minute polling cycle with error handling',
  //           'Translated AQI thresholds into visual warning states (red flashing alerts)',
  //         ],
  //       },
  //       {
  //         title: 'Physical Fabrication',
  //         items: [
  //           '3D printed custom enclosures using Rhino',
  //           'Laser-cut acrylic components with Adobe Illustrator',
  //           'Integrated electronics with hand-crafted chocolate trees',
  //           'Designed physical form factor balancing aesthetics and sensor accessibility',
  //         ],
  //       },
  //     ],
  //     imageUrls: [
  //       'E02DJOgUseJ9BPDxRzFQCMN3uCAsNPo02p2rj00OfWc00LI',
  //       '/project-images/chocolate/image-1.webp',
  //       '/project-images/chocolate/image-2.webp',
  //     ],
  //   },
  // },
];