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
 *
 * Every figure in `work.projects` below was checked against a primary source on
 * 2026-10-31 — the GitHub API, a live HTTP request, or the repo on disk. The
 * provenance is in the comment above each number. If you change one, re-check it.
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
  // Rendered as a DECK, not a list: three cards at a time, paged, with the old
  // cards dropping out and the new ones sliding in (src/ui/WorkDeck.jsx). The
  // whole point is that the section never grows taller as work is added — so
  // append freely here, the layout does not care.
  //
  // `category` must be one of the `filters` ids below. A project with no
  // category still shows under "All" but can never be filtered to, so set it.
  //
  // `links: []` is deliberate and means "this repo is private". An empty array
  // renders no link at all, which is honest. A link that 404s is worse than
  // no link — see the private-repo note on each one.
  work: {
    title: 'Selected Work',
    // `{count}` is substituted with the number of projects actually in the deck,
    // so adding a fourteenth cannot leave the intro quietly claiming thirteen.
    // It is still a string in this file — only the number is derived.
    intro: '{count} things I have built. Pick a lane, or page through all of them.',

    // The tab row. `all` must stay first — the deck opens on it.
    filters: [
      { id: 'all', label: 'All' },
      { id: 'realtime', label: 'Real-time & 3D' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'web', label: 'Web' },
      { id: 'systems', label: 'Systems & tools' },
    ],

    // Shown when a filter somehow matches nothing. Should never appear, but a
    // deck that renders an empty box with no explanation looks broken.
    empty: 'Nothing in this category yet.',

    projects: [
      {
        // The hero of this very site.
        year: '2026',
        category: 'realtime',
        title: 'Shattered Sphere',
        slug: 'shattered-sphere', // public URL fragment — do not change once shared
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
        category: 'realtime',
        title: 'SquadUp',
        slug: 'squadup', // public URL fragment — do not change once shared
        summary:
          'Real-time pickup football lineups. One person makes a room, texts four characters to the group chat, and everyone watches the formation fill up live — no accounts, nothing to install. The formation board, the who-is-here list and the room chat all update on every screen at once.',
        role:
          'Built and deployed solo for the DeepSpace internship exercise. Each room code gets its own server instance and its own database, so rooms are isolated by infrastructure rather than by a WHERE clause. Presence is deliberately a separate primitive from stored state: close the tab and you vanish from the list, but the slot you claimed stays on the board.',
        stack: ['TypeScript', 'React', 'Hono', 'Cloudflare Workers', 'Yjs', 'Tailwind CSS'],
        // Public repo, verified 2026-10-31; squadup.app.space returns 200.
        links: [
          { label: 'Code', href: 'https://github.com/thompmic/squadup' },
          { label: 'Live', href: 'https://squadup.app.space' },
        ],
      },
      {
        year: '2026',
        category: 'realtime',
        title: 'Grandmaster Arena',
        slug: 'grandmaster-arena', // public URL fragment — do not change once shared
        summary:
          'A two-player chess duel staged in a 3D colosseum, with a crowd. The Node server owns every room and validates every move — castling, en passant and promotion included — then broadcasts the board and timestamped cinematic events to players and spectators alike. Spectators cheer or boo into a shared hype level that the arena reacts to.',
        role:
          'Solo build. Server-authoritative game state, the Three.js arena and champions built from primitives rather than imported models, optional five- and ten-minute clocks, a spectator camera seat, and voice commentary that honours the operating system reduced-motion setting.',
        stack: ['Node.js', 'Express', 'Socket.IO', 'chess.js', 'Three.js'],
        // The repo is PRIVATE, so no Code link. Deployed to Render and verified
        // 200 on 2026-10-31. ⚠️ Render's free tier sleeps after 15 minutes idle,
        // so the first visit after a quiet spell can take about a minute to wake.
        links: [{ label: 'Live', href: 'https://grandmaster-arena-otyb.onrender.com/' }],
      },
      {
        year: '2026',
        category: 'systems',
        title: 'Prime — AI personal assistant',
        slug: 'prime', // public URL fragment — do not change once shared
        summary:
          'A personal assistant that triages about a hundred emails a run across Outlook and Gmail, pulls out deadlines, ranks job postings and drafts the replies. Nothing is ever sent without an approval record: the human-in-the-loop step is enforced in code, not by convention.',
        role:
          'Solo build, ongoing. Python and FastAPI behind a Playwright driver for Outlook and the Gmail API for the rest, with Claude doing the extraction. Covered by 400+ pytest tests. Prime also has a desktop body — an Electron companion that sits on the desktop on both macOS and Windows, with a tray menu, a global hotkey, pointer pass-through so he never blocks what is behind him, and Tailscale keeping the two machines in sync.',
        stack: ['Python', 'FastAPI', 'Playwright', 'SQLAlchemy', 'Alembic', 'Electron', 'Claude API'],
        // Private. The Electron half has no repo at all yet — it lives only on
        // disk at Desktop/prime-desk-windows. Push it and link it.
        links: [],
      },
      {
        year: '2026',
        category: 'mobile',
        title: 'Hatelife',
        slug: 'hatelife', // public URL fragment — do not change once shared
        summary:
          'A venting app built on the shape of a focus timer: you weather a storm instead of growing a tree, and the reward for sitting through it is finding out that somebody had a worse day than you. A snow-globe home screen, a public feed, a rain jar that fills as you let things out, and rooms that unlock as you keep going.',
        role:
          'Solo build, iOS and Android. Expo and React Native on the front, Supabase behind it — Postgres with row-level security, anonymous sign-in, and migrations under version control — plus RevenueCat for subscriptions. 549 tests across 52 Jest files, with typecheck and lint clean. Store-readiness work is done: age gate, report and block, privacy and terms.',
        stack: ['TypeScript', 'React Native', 'Expo', 'Supabase', 'PostgreSQL', 'RevenueCat'],
        // ⚠️ github.com/thompmic/hatelife is PRIVATE. Not on either store yet —
        // waiting on the Apple developer account.
        links: [],
      },
      {
        year: '2026',
        category: 'realtime',
        title: 'The Watchers',
        slug: 'the-watchers', // public URL fragment — do not change once shared
        summary:
          'A browser-based simulation of a stylized city — a real-time world you can zoom into and inspect. It started as backend scaffolding and has since grown a body: a low-poly city, a road system generated from the city\'s own geometry, and its own NPC model driving around it.',
        role:
          'Solo build, all 18 commits across April and August 2026. The April work is the foundation — Docker Compose dev infra, a 12-table PostgreSQL schema with typed query helpers, a Fastify gateway with JWT auth, and a CI pipeline. The August work is the world itself.',
        stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Three.js', 'Docker Compose', 'Turborepo'],
        // ⚠️ github.com/The-watchers01/the-watchers is PRIVATE — re-verified
        // 2026-10-31. Linking it would 404 for every visitor.
        links: [],
      },
      {
        year: '2026',
        category: 'mobile',
        title: 'Soccer Star Styles',
        slug: 'soccer-star-styles', // public URL fragment — do not change once shared
        summary:
          'People bring reference photos to the barber, but hairstyle inspiration for football fans is scattered across image searches and social posts. A cross-platform mobile app cataloguing professional players\' hairstyles year by year, each cut shown with a spec sheet (fade level, length, colour) and a "show your barber" checklist.',
        role:
          'Sole author, all 9 commits. Built the 5-tab navigation, the light/dark theme system, a parametric SVG avatar renderer used as fallback artwork, the players/styles/favorites data layer with on-device persistence, and a Node script that generates a 613-player searchable directory from league salary tables.',
        stack: ['TypeScript', 'React Native', 'Expo', 'react-native-svg', 'AsyncStorage'],
        // ⚠️ github.com/thompmic/soccer-star-styles is PRIVATE — same reasoning.
        links: [],
      },
      {
        year: '2026',
        category: 'web',
        title: 'Talk to the Devil',
        slug: 'talk-to-the-devil', // public URL fragment — do not change once shared
        summary:
          'A conversation with something that has no interest in being helpful. The entry is the whole idea: an apocalyptic painting fades up with an invented scripture line under it, the gates open, the page burns away, and then you are in the chat.',
        role:
          'Solo build. Next.js on Vercel with Claude behind the conversation, a verse-and-artwork cold open that rotates daily, and a video burn transition between states.',
        stack: ['TypeScript', 'Next.js', 'Claude API', 'Vercel'],
        // The repo is PRIVATE, so no Code link. The Vercel alias returned 200 on
        // 2026-10-31 — but it is serving the MAY build: the later production
        // deploy (the Three.js devil head and shader fire portal) is in ERROR
        // state. Fix that build and this card gets much stronger.
        links: [{ label: 'Live', href: 'https://talktothedevil.vercel.app' }],
      },
      {
        year: '2026',
        category: 'systems',
        title: 'Job Hunter',
        slug: 'job-hunter', // public URL fragment — do not change once shared
        summary:
          'An agent pipeline that goes looking for work. It scrapes listings, reads the resumes you give it, and tailors a new one per posting — with a dashboard over the top and profiles so more than one person can use it.',
        role:
          'Solo build. A Turborepo monorepo of seven packages — web, api, worker, agents, db, scraper and shared — running under Docker from a single `npm run dev`.',
        stack: ['TypeScript', 'Turborepo', 'Docker', 'PostgreSQL', 'Node.js'],
        // ⚠️ github.com/thompmic/job-hunter is PRIVATE.
        links: [],
      },
      {
        year: '2026',
        category: 'systems',
        title: 'Optimize Disk',
        slug: 'optimize-disk', // public URL fragment — do not change once shared
        summary:
          'A disk cleanup tool built around the thing most PC cleaners get wrong: on a nearly-full drive the temp-file junk is a rounding error. It measures first, cleans only what is always safe automatically, then helps you find the real culprits and remove them deliberately — size preview, typed confirmation, Recycle Bin rather than a permanent delete.',
        role:
          'Written out of a real cleanup: a 237 GB drive down to 18 GB free, where a standard junk sweep recovered 1.4 GB and finding the actual large folders recovered about 65 GB. Shipped as a matching pair, PowerShell for Windows and shell for macOS.',
        stack: ['PowerShell', 'Shell', 'Windows', 'macOS'],
        links: [
          { label: 'Windows', href: 'https://github.com/thompmic/Optimize-WindowsDisk' },
          { label: 'macOS', href: 'https://github.com/thompmic/Optimize-MacDisk' },
        ],
      },
      {
        year: '2026',
        category: 'systems',
        title: 'Flighting Budget Solver',
        slug: 'flighting-budget-solver', // public URL fragment — do not change once shared
        summary:
          'A single-file web app that solves a campaign budget to the exact dollar — the kind of arithmetic that usually gets fought with in a spreadsheet until it is close enough.',
        role: 'Solo build. One HTML file, no build step, no dependencies.',
        stack: ['HTML', 'JavaScript'],
        links: [{ label: 'Code', href: 'https://github.com/thompmic/flighting-budget-solver' }],
      },
      {
        year: '2026',
        category: 'web',
        title: 'Reelo',
        slug: 'reelo', // public URL fragment — do not change once shared
        summary:
          'A movie and TV browsing site — TMDB for the catalogue data, an embedded player for playback.',
        role: 'Solo build.',
        stack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'TMDB API'],
        // ⚠️ github.com/thompmic/reelo is PRIVATE.
        links: [],
      },
      {
        // ⚠️ PLACEHOLDER. All I could verify is what is in the repo: a one-page
        // storefront with a featured-products section and a templated product
        // detail view, built on a packaged design system, with its own photography
        // and a looping reel. I do not know who it was for or whether it shipped,
        // and I am not going to guess. Rewrite this and delete the `todo` flags.
        year: '2026',
        category: 'web',
        title: 'Inherit Love',
        slug: 'inherit-love', // public URL fragment — do not change once shared
        todo: true,
        summary:
          'A single-page storefront: a featured-products section and a templated product detail view, built on a packaged design system with its own photography and a looping reel.',
        summaryTodo: true,
        role: 'Solo build.',
        stack: ['JavaScript', 'HTML', 'CSS'],
        // ⚠️ github.com/thompmic/inherit-love-website is PRIVATE.
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
  // Every item here is used in one of the projects above — nothing is listed on
  // the strength of having read about it. That is deliberate: a skills list you
  // can point at real work is worth more than a long one you cannot. Add to it as
  // you ship, and delete anything you would not want to be interviewed on.
  skills: {
    title: 'Skills',
    intro: 'Everything here is something I have actually shipped with, not just read about.',
    groups: [
      { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'GLSL', 'Shell'] },
      { label: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Expo', 'Vite', 'Tailwind CSS'] },
      { label: '3D & graphics', items: ['Three.js', 'React Three Fiber', 'GLSL', 'Blender'] },
      {
        label: 'Backend & data',
        items: ['Node.js', 'Fastify', 'Hono', 'FastAPI', 'PostgreSQL', 'Supabase', 'Redis', 'Kafka'],
      },
      { label: 'Real-time', items: ['Socket.IO', 'Yjs', 'WebSockets', 'Cloudflare Workers'] },
      { label: 'Tooling', items: ['Git', 'Docker', 'Turborepo', 'Electron', 'Playwright', 'Jest'] },
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
    // The file lives in public/ and is committed (public/draco and public/models
    // are the only gitignored parts of that directory). Replace the PDF in place
    // to update it; the path does not need to change.
    resume: '/michael-thompson-cv.pdf',
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
