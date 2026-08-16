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
    introTodo: true,
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
      // The two below are placeholders with the right NAMES only. Run the
      // "portfolio entry" prompt in AGENTS.md §13.5 inside each project, then
      // paste the object it returns over the matching entry here.
      {
        year: 'TODO',
        title: 'The Watchers',
        summary:
          'Awaiting the breakdown — run the AGENTS.md §13.5 prompt inside this project and paste the result here.',
        role: 'TODO — what was your part?',
        stack: ['TODO'],
        links: [],
        todo: true,
      },
      {
        year: 'TODO',
        title: 'Soccer Star',
        summary:
          'Awaiting the breakdown — run the AGENTS.md §13.5 prompt inside this project and paste the result here.',
        role: 'TODO — what was your part?',
        stack: ['TODO'],
        links: [],
        todo: true,
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
