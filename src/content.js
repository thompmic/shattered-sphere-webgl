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
    role: 'Creative Developer', // confirmed 2026-08-15
    tagline: 'I build things for the web that move.',
  },

  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],

  cta: { label: 'Get In Touch', href: '#contact' },

  // ── Hero ───────────────────────────────────────────────────────────────────
  // Three short lines, set small at the top-left of the hero. Keep them short —
  // they sit beside the painted name, and anything longer competes with it.
  hero: {
    intro: ['Front-end and real-time 3D.', 'Built for how it feels,', 'not just whether it works.'],
    scrollHint: 'Scroll',
  },

  // ── Splash ───────────────────────────────────────────────────────────────
  // Shown while the 3D streams in. One quote is picked at random per page load.
  //
  // Keep them SHORT — the whole thing is on screen for about two seconds, and a
  // quote nobody finishes reading is just a delay. Two lines maximum.
  //
  // Tone: dry. The rest of the site does not oversell itself and neither should
  // this. Nothing with an exclamation mark.
  splash: {
    greeting: 'Welcome.',
    subtitle: 'Building the scene — one moment.',
    skipLabel: 'Skip',
    a11yLabel: 'Loading the 3D scene',

    quotes: [
      // — developer in-jokes —
      { line: 'It works on my machine.', by: 'every developer, ever' },
      {
        line: 'There are two hard problems in computer science: cache invalidation, naming things, and off-by-one errors.',
      },
      { line: 'Weeks of coding can save you hours of planning.' },
      {
        line: '99 little bugs in the code. Take one down, patch it around — 127 little bugs in the code.',
      },
      { line: 'It is not a bug. It is an undocumented feature.' },
      {
        line: 'Programming is 10% writing code and 90% working out why it does not run.',
      },
      { line: 'A user interface is like a joke. If you have to explain it, it is not that good.' },

      // — about this site specifically —
      { line: '700 shards are getting into position. They are doing their best.' },
      { line: 'Somewhere in here a vertex shader is having a genuinely difficult time.' },
      { line: 'Loading 65,267 triangles. Please enjoy this sentence while they arrange themselves.' },
      {
        line: 'This sphere survived a coordinate-space bug, a silent object rename, and a rotation that did not make it through a basis change.',
      },
      { line: 'Yes, it is a real 3D scene. No, there was no easy way to do it.' },
      { line: 'The wire cage used to be 57% of this download. It has been spoken to.' },
      { line: 'Every number behind this was measured in Blender. None of them were guessed.' },

      // — general —
      { line: 'Patience is what you have when there are too many witnesses.' },
      { line: 'Everything takes longer than you expect, including this sentence.' },
      { line: 'I am not slow. I am buffering dramatically.' },
      { line: 'Good things come to those who wait. This is at least a decent thing.' },
    ],
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
          { label: 'Live', href: 'https://michaelthompsondev.netlify.app/' },
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
      'I want to be a Software Engineer. What pulls me in is the design side as much as the code — how a page moves, how it feels under your hands, whether it has any character to it. A site that works but feels like nothing is only half finished.',
      'Away from the screen it is mostly cars and music. Both are the same thing to me really: a lot of small decisions adding up to something you can feel immediately, even if you cannot explain why it works.',
      'I am usually in the middle of a new idea. This site is one of them.',
    ],
  },

  // ── Skills ─────────────────────────────────────────────────────────────────
  // Every item here is used in one of the three projects above — nothing is listed
  // on the strength of having read about it. That is deliberate: a skills list you
  // can point at real work is worth more than a long one you cannot. Add to it as
  // you ship, and delete anything you would not want to be interviewed on.
  skills: {
    title: 'Skills',
    intro: 'Everything here is something I have actually shipped with, not just read about.',
    groups: [
      { label: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL'] },
      { label: 'Frontend', items: ['React', 'React Native', 'Expo', 'Vite'] },
      { label: '3D & graphics', items: ['Three.js', 'React Three Fiber', 'GLSL', 'Blender'] },
      { label: 'Backend & data', items: ['Node.js', 'Fastify', 'PostgreSQL', 'Redis', 'Kafka'] },
      { label: 'Tooling', items: ['Git', 'Docker', 'Turborepo'] },
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
    body: 'Open to new work — front-end, real-time 3D, or anything where how it feels matters as much as whether it works. I read everything that comes in.',
    // A dedicated address, chosen deliberately over the personal one: anything on
    // a public page gets scraped within days, and this can be abandoned without
    // losing a real inbox. That is the mitigation — do not swap in a personal
    // address here later.
    email: 'michael.dev.0365@gmail.com',
    // e.g. '/michael-thompson-cv.pdf' — drop the file in public/ and put the path
    // here, and the Download CV button appears. Hidden entirely while null.
    resume: null,
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
