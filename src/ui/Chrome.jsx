import { content } from '../content.js'

/**
 * The DOM layer that sits over the canvas (§3.7 layer 6), arranged per the
 * structural beats in §3.7b: logo left, links centred, CTA right; stats bottom-left;
 * social cluster bottom-right; the frosted rail on the right edge (§3.3).
 *
 * All copy comes from content.js — see §6 answer 5.
 */

function Logo() {
  return (
    <a className="logo" href="#top" aria-label={`${content.brand.line1} ${content.brand.line2}`}>
      {/* the `icon` Union vector from §3.2, rebuilt as a mark */}
      <svg viewBox="0 0 50 50" width="34" height="34" aria-hidden="true">
        <path
          d="M25 3 L45 15 V35 L25 47 L5 35 V15 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle cx="25" cy="25" r="7.5" fill="currentColor" />
      </svg>
      <span className="logo-word">
        {content.brand.line1}
        <br />
        {content.brand.line2}
      </span>
    </a>
  )
}

export function Nav() {
  return (
    <header className="nav">
      <Logo />
      <nav className="nav-links">
        {content.nav.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="cta" href={content.cta.href}>
        {content.cta.label}
      </a>
    </header>
  )
}

export function HeroCopy() {
  const { tagline, eyebrow, kicker } = content.hero
  return (
    <>
      <div className="hero-tagline">
        {tagline.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div className="hero-stats">
        <div className="stat">
          <p className="stat-title">{eyebrow.title}</p>
          <p className="stat-sub">{eyebrow.sub}</p>
        </div>
        <p className="hero-kicker">{kicker}</p>
      </div>
    </>
  )
}

export function RightRail() {
  return (
    <aside className="rail" aria-label="Contact">
      <a className="rail-cta" href={content.cta.href}>
        {content.cta.label}
      </a>
      <ul className="rail-social">
        {content.social.map((s) => (
          <li key={s.label}>
            <a href={s.href} aria-label={s.label}>
              <span aria-hidden="true">{s.label[0]}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function Sections() {
  return (
    <div className="sections">
      {content.sections.map((s) => (
        <section key={s.id} id={s.id} className="section">
          <p className="section-index">{s.index}</p>
          <h2 className="section-title">{s.title}</h2>
          <p className="section-body">{s.body}</p>
        </section>
      ))}
    </div>
  )
}
