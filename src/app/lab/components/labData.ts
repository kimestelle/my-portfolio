export type LabItem = {
  id: string;
  name: string;
  githubUrl?: string;

  blurb?: string;

  preview?: { type: 'video' | 'image' | 'iframe'; src: string };
};

export type LabTechGroup = {
  tech: string;
  items: LabItem[];
};

export const LAB_BY_TECH: LabTechGroup[] = [
  {
    tech: 'UI/Frontend',
    items: [
      {
        id: 'roboracer-website',
        name: 'roboracer.ai',
        blurb: 'built and deployed a website integrating multiple legacy sites for an autonomous racing organization',
        githubUrl: 'https://github.com/f1tenth/roboracer-site',
        preview: { type: 'iframe', src: 'https://roboracer.ai' },
      }
    ]
  },
  {
    tech: 'Computer Vision',
    items: [
      {
        id: 'video-analysis',
        name: 'multimodal video analysis',
        blurb: 'Real-time video analysis in the browser. Used a creative approach with lightweight local tools only, time-syncing multiple results (dialogue, frame-by-frame BLIP captions, emotion recognition), and chunking scenes by string similarity.',
        preview: { type: 'iframe', src: 'https://www.youtube.com/embed/jkbK5V_D_uA?start=3"' },
      },
    ],
  },
  {
    tech: 'Interaction Toys',
    items: [
      {
        id: 'skyline',
        name: 'city skyline',
        githubUrl: 'https://github.com/kimestelle/city-skyline',
        blurb: 'Minimalistic sandbox with animated sprite and cool tornado effect',
        preview: { type: 'iframe', src: 'https://kimestelle.github.io/city-skyline/' },
      },
      {
        id: 'thumb-ball',
        name: 'thumb*ball',
        githubUrl: 'https://github.com/kimestelle/thumb-ball',
        blurb:
          'Sensory fidget toy with browser haptics on Android.',
        preview: { type: 'iframe', src: 'https://thumb-ball.vercel.app/' },
      },
    ],
  },

  {
    tech: 'Three.js',
    items: [
      {
        id: 'sdf-guy',
        name: 'sdf rigged guy',
        githubUrl: 'https://github.com/kimestelle/tiny-sdf-rig',
        blurb: 'Typescript-based rig from scratch, mouse tracking and random behavior, and SDF shader on a small canvas.',
        preview: { type: 'iframe', src: 'https://kimestelle.github.io/tiny-sdf-rig/' },
      },
      {
        id: 'threejs-material-sampler',
        name: 'material sampler',
        githubUrl: 'https://github.com/kimestelle/threejs-material-sampler',
        blurb: 'Small playground for comparing / tuning material settings.',
        preview: { type: 'iframe', src: 'https://threejs-material-sampler.vercel.app/' },
      },
    ],
  },

  {
    tech: 'Web Audio',
    items: [
      {
        id: 'drawscillate',
        name: 'drawscillate',
        githubUrl: 'https://github.com.kimestelle/drawscillate',
        blurb: 'Experimental synth where you draw the waveforms, collaborative project',
        preview: { type: 'iframe', src: 'https://kimestelle.github.io/drawscillate/' },
      },
      {
        id: 'web-karaoke',
        name: 'web karaoke',
        githubUrl: 'https://github.com.kimestelle/pocket-karaoke',
        blurb: 'Low-latency echo and amplification effects for whenever you just want to sing',
        preview: { type: 'iframe', src: 'https://kimestelle.github.io/pocket-karaoke/' },
      },
      {
        id: 'musicograph',
        name: 'microtone graph',
        githubUrl: 'https://github.com/kimestelle/musicograph',
        blurb: 'Interface for scoring melodies between traditional notes through angles and magnitudes',
        preview: { type: 'iframe', src: 'https://musicograph.vercel.app/' },
      },
    ],
  },
  {
    tech: '3D Modeling',
    items: [
      {
        id: 'clock',
        name: 'surreal clock',
        blurb: 'Autodesk Maya, modeling, texturing, lighting, and rendering a detailed desk scene. Unsatisfactory quality due to device limitations :(',
        preview: { type: 'image', src: '/creative-images/clock-scene.png' },
      },
    ],
  },
  {
    tech: 'Graphic Design',
    items: [
      {
        id: 'sound-to-form',
        name: 'sound-to-form studies',
        blurb: 'Adobe Illustrator, mapping sounds into shape language',
        preview: { type: 'image', src: '/creative-images/dsgn-0010/image-1.png' },
      },
      {
        id: 'capital-campaign-handbook',
        name: 'capital campaign print',
        blurb: '(2023) Adobe InDesign, 500 copies printed for multimillion dollar journalism campaign',
        preview: { type: 'image', src: '/creative-images/dp-8pager.png' },
      },
      {
        id: 'object-icons-coat',
        name: 'object icons (coat)',
        blurb: 'Adobe Illustrator — icon system study with clean object forms',
        preview: { type: 'image', src: '/creative-images/dsgn-0010/image-3.png' },
      },
      {
        id:'roboracer-logo',
        name: 'animated logo',
        blurb: 'Adobe After Effects — logo animation for autonomous racing organization',
        preview: { type: 'video', src: '/creative-images/roboracer-logo.mp4' },
      }
    ],
  },
  {
    tech: 'Multimedia Art',
    items: [
      {
        id: 'covid-sculptures',
        name: 'covid-19 sculptures',
        blurb: 'Cardboard, wire, masks — sculptural studies in constraint + material.',
        preview: { type: 'image', src: '/creative-images/covid-crafts.png' },
      },
      {
        id: 'fast-fashion-cardboard',
        name: 'on fast fashion',
        blurb: 'Cardboard & glue — physical study on consumption and discard.',
        preview: { type: 'image', src: '/creative-images/cardboard-art/image-2.png' },
      },
    ],
  }
];
