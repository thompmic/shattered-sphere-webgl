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
      {
        year: 'TODO',
        title: 'Second Project',
        summary:
          'Replace with a real project. Lead with the problem, then what you actually built, then the outcome. Two sentences is plenty.',
        role: 'TODO — what was your part?',
        stack: ['TODO'],
        links: [],
        todo: true,
      },
      {
        year: 'TODO',
        title: 'Third Project',
        summary:
          'Replace with a real project. If you have fewer than three worth showing, delete this entry — three strong is better than three padded.',
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
    // 2–3 short paragraphs, first person. What you do, how you got here, what you
    // care about in the work. Avoid buzzwords — write how you talk.
    body: [
      'Replace this with a couple of paragraphs about yourself: what you build, what drew you to it, and what you are looking for next.',
      'A second paragraph is a good place for the human part — how you work, what you are curious about, what you are learning right now.',
    ],
    bodyTodo: true,
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
    introTodo: true,
    items: [
      { label: 'TODO', note: 'Replace with something you actually do.', todo: true },
      { label: 'TODO', note: 'Three or four is plenty. Specific beats generic.', todo: true },
      { label: 'TODO', note: 'This is the section that makes you a person, not a CV.', todo: true },
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
    { label: 'LinkedIn', short: 'IN', href: null, todo: true },
    { label: 'Instagram', short: 'IG', href: null, todo: true },
  ],

  footer: {
    // credit is not optional — see AGENTS.md §2
    credit: 'Hero concept and 3D source by @Bachynskyi_ui, adapted with permission.',
    creditHref: 'https://www.instagram.com/bachynskyi_ui/',
  },
}
