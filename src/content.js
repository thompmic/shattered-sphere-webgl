/**
 * EVERY visible string on the site lives here. Editing this file is how the site
 * gets written — you should not need to touch a component to change copy.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️  ANYTHING MARKED `todo: true` IS A PLACEHOLDER AND IS NOT TRUE YET.
 *      In `npm run dev` those render with a small amber TODO chip so they are
 *      impossible to miss. The chips never appear in a production build.
 *      Replace the text, then delete the `todo: true` line.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Do NOT invent projects, dates, employers or metrics here. A portfolio with
 * fabricated work is worse than an unfinished one.
 */

export const content = {
  // ── Identity ───────────────────────────────────────────────────────────────
  identity: {
    name: 'Michael Thompson',
    // TODO: your actual title. Examples: "Creative Developer", "Software Engineer",
    // "Full-Stack Developer, 3D & Web". This shows directly under your name.
    role: 'Creative Developer',
    roleTodo: true,
    // one line, the first thing anyone reads. Say what you do and who for.
    tagline: 'I build things for the web that move.',
    taglineTodo: true,
  },

  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],

  cta: { label: 'Get In Touch', href: '#contact' },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    intro: ['Building for the web,', 'in three dimensions,', 'end to end.'],
    introTodo: true,
    scrollHint: 'Scroll',
  },

  // ── Work ───────────────────────────────────────────────────────────────────
  // The core of the portfolio. Two or three strong entries beat six weak ones.
  // Each: what it is, what YOU did, what it is built with, and where to see it.
  work: {
    title: 'Selected Work',
    intro: 'A few things I have built recently.',
    projects: [
      {
        // This one is real — it is the hero of this very site.
        year: '2026',
        title: 'Shattered Sphere',
        summary:
          'A WebGL hero rendering 700 fracture shards in a single draw call. The shatter is a vertex shader derived from the original Blender geometry-node graph, driven by scroll.',
        role: 'Design engineering, shader work, Blender → glTF pipeline',
        stack: ['React Three Fiber', 'Three.js', 'GLSL', 'Blender', 'Vite'],
        links: [
          { label: 'Code', href: 'https://github.com/thompmic/shattered-sphere-webgl' },
          // TODO: add the live URL once this site is deployed
        ],
        credit: 'Original concept and 3D source by @Bachynskyi_ui',
      },
      {
        year: '2026',
        title: 'The Watchers',
        summary:
          'A browser-based simulation of a stylized city, intended as a real-time world players can zoom into and inspect. The pushed repo contains the backend foundation: Docker Compose dev infra (Postgres 16, Redis 7, Kafka, Zookeeper, pgAdmin), a 12-table PostgreSQL schema with typed query helpers, and a Fastify API gateway with JWT auth and stub routes for the downstream services.',
        role: 'Solo build. All 16 commits (April 2026) are mine — monorepo scaffold, Docker infra, DB schema and seed data, the typed helpers package, the gateway, and the JWT auth middleware.',
        stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Docker Compose', 'Turborepo'],
        // ⚠️ github.com/The-watchers01/the-watchers is PRIVATE — verified with
        // `gh repo view`. Linking it would 404 for every visitor, which looks
        // worse than no link. Restore this once the repo is public.
        links: [],
      },
      {
        year: '2026',
        title: 'Soccer Star Styles',
        summary:
          'People bring reference photos to the barber, but hairstyle inspiration for football fans is scattered across image searches and social posts. A cross-platform mobile app cataloguing professional players\' hairstyles year by year, each cut shown with a spec sheet (fade level, length, colour) and a "show your barber" checklist.',
        role: 'Sole author, all 9 commits. Built the 5-tab navigation, the light/dark theme system, a parametric SVG avatar renderer used as fallback artwork, the players/styles/favorites data layer with on-device persistence, and a Node script that generates a 613-player searchable directory from league salary tables.',
        stack: ['TypeScript', 'React Native', 'Expo', 'react-native-svg', 'AsyncStorage'],
        // ⚠️ github.com/thompmic/soccer-star-styles is also PRIVATE — same reasoning.
        links: [],
      },
    ],
  },

  // ── About ──────────────────────────────────────────────────────────────────
  about: {
    title: 'About',
    // Drafted from the four things Michael named: cars, music, web design, and
    // working on new ideas. The facts are his; the phrasing is a first pass —
    // read it aloud and change anything that does not sound like you.
    body: [
      'I build for the web. What pulls me in is the design side as much as the code — how a page moves, how it feels under your hands, whether it has any character to it. A site that works but feels like nothing is only half finished.',
      'Away from the screen it is mostly cars and music. Both are the same thing to me really: a lot of small decisions adding up to something you can feel immediately, even if you cannot explain why it works.',
      'I am usually in the middle of a new idea. This site is one of them.',
    ],
  },

  // ── Skills ─────────────────────────────────────────────────────────────────
  skills: {
    title: 'Skills',
    intro: 'Things I work with day to day.',
    introTodo: true,
    groups: [
      { label: 'Languages', items: ['TODO', 'TODO', 'TODO'], todo: true },
      { label: 'Frameworks', items: ['React', 'TODO', 'TODO'], todo: true },
      { label: '3D & Graphics', items: ['Three.js', 'React Three Fiber', 'GLSL', 'Blender'] },
      { label: 'Tools', items: ['Git', 'Vite', 'TODO'], todo: true },
    ],
  },

  // ── Interests ──────────────────────────────────────────────────────────────
  interests: {
    title: 'Beyond the screen',
    intro: 'What I spend time on when I am not building.',
    items: [
      {
        label: 'Cars',
        note: 'The engineering as much as the driving — how something is put together and why it behaves the way it does.',
      },
      {
        label: 'Music',
        note: 'Always on while I work, and a big part of how I think about pacing and rhythm in an interface.',
      },
      {
        label: 'Web design',
        note: 'Layout, type and motion. The part of the job I would still do if nobody were paying me for it.',
      },
      {
        label: 'New ideas',
        note: 'There is usually something half-built on my machine. Starting is the easy part.',
      },
    ],
  },

  // ── Contact ────────────────────────────────────────────────────────────────
  contact: {
    title: 'Get in touch',
    body: 'Open to new work and interesting problems. The fastest way to reach me is email.',
    bodyTodo: true,
    // TODO: decide which address to publish. Your personal Gmail was deliberately
    // NOT hardcoded here — publishing it on a public site invites scrapers. A
    // dedicated address, or a contact form, is usually the better call.
    email: null,
    resume: null, // TODO: e.g. '/michael-thompson-cv.pdf' — put the file in public/
  },

  // ── Socials ────────────────────────────────────────────────────────────────
  // `href: null` renders the link as disabled + flagged, so nothing points at '#'.
  social: [
    { label: 'GitHub', short: 'GH', href: 'https://github.com/thompmic' },
    { label: 'LinkedIn', short: 'IN', href: 'https://www.linkedin.com/in/michael-thompson-160082248/' },
  ],

  footer: {
    // credit is not optional — see AGENTS.md §2
    credit: 'Hero concept and 3D source by @Bachynskyi_ui, adapted with permission.',
    creditHref: 'https://www.instagram.com/bachynskyi_ui/',
  },
}
