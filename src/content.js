/**
 * EVERY visible string on the site lives here.
 *
 * AGENTS.md §6 answer 5: all copy is PLACEHOLDER, taken verbatim from the Figma file
 * (§3.8). The user will rewrite it later — that rewrite should touch this file and
 * nothing else. Do not hardcode copy in components.
 */
export const content = {
  brand: { line1: 'Studio', line2: 'One.Zero' },

  nav: [
    { label: 'Mastery', href: '#work' },
    { label: 'The Path', href: '#process' },
    { label: 'Openings', href: '#studio' },
  ],

  cta: { label: 'Request A Prototype', href: '#contact' },

  hero: {
    // the giant Kulim Park numerals — these render INSIDE the WebGL scene (§3.7)
    display: { left: '06', right: '04' },
    tagline: ['Validate And Evolve Ideas,', 'From Concept — To 10.0,', 'Rapidly'],
    eyebrow: { title: '10x Faster Prototyping', sub: 'bringing ideas to life in record time' },
    kicker: 'Discover Our New Projects from ©2025',
  },

  // the 3 glyphs in the right rail, bottom (§3.3). No real URLs yet — open thread §11.4.
  social: [
    { label: 'Behance', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
  ],

  sections: [
    {
      id: 'work',
      index: '01',
      title: 'Fracture, then form',
      body: 'Every prototype starts as a whole idea and comes apart under pressure. What survives the break is the part worth building. We run that cycle in days, not quarters.',
    },
    {
      id: 'process',
      index: '02',
      title: 'One continuous pass',
      body: 'Concept, validation and build are not separate engagements. They are one motion, and the work never stops moving between them.',
    },
    {
      id: 'studio',
      index: '03',
      title: 'Ten point zero',
      body: 'Version 1.0 is a hypothesis. We are interested in what the tenth iteration looks like, and in getting there before the first one would normally ship.',
    },
  ],
}
