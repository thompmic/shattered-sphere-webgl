import { useState } from 'react'
import { content } from '../content.js'
import { scrollToSection } from '../scroll.js'
import { Todo } from './Todo.jsx'

/**
 * The fixed chrome over the canvas: the nav and the hero copy.
 * Scrolling page content lives in Sections.jsx.
 */

function Mark() {
  return (
    <svg viewBox="0 0 50 50" width="30" height="30" aria-hidden="true">
      <path d="M25 3 L45 15 V35 L25 47 L5 35 V15 Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="25" cy="25" r="7.5" fill="currentColor" />
    </svg>
  )
}

/** Anchor that routes through Lenis instead of the browser's native jump. */
export function SectionLink({ href, children, className, onNavigate }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (href?.startsWith('#')) {
          e.preventDefault()
          scrollToSection(href)
          onNavigate?.()
        }
      }}
    >
      {children}
    </a>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const { identity, nav, cta } = content

  return (
    <header className="nav" data-open={open}>
      <SectionLink href="#top" className="logo" onNavigate={() => setOpen(false)}>
        <Mark />
        <span className="logo-word">
          <strong>{identity.name}</strong>
          <em>
            {identity.role}
            {identity.roleTodo ? <Todo /> : null}
          </em>
        </span>
      </SectionLink>

      <button
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <nav className="nav-links" id="site-nav">
        {nav.map((item) => (
          <SectionLink key={item.label} href={item.href} onNavigate={() => setOpen(false)}>
            {item.label}
          </SectionLink>
        ))}
      </nav>

      <SectionLink href={cta.href} className="cta" onNavigate={() => setOpen(false)}>
        {cta.label}
      </SectionLink>
    </header>
  )
}

export function HeroCopy() {
  const { identity, hero } = content
  return (
    <>
      <div className="hero-intro">
        {hero.intro.map((line) => (
          <span key={line}>{line}</span>
        ))}
        {hero.introTodo ? <Todo /> : null}
      </div>

      <div className="hero-foot">
        <div className="hero-id">
          <p className="hero-name">{identity.name}</p>
          <p className="hero-tagline">
            {identity.tagline}
            {identity.taglineTodo ? <Todo /> : null}
          </p>
        </div>
        <SectionLink href="#work" className="scroll-hint">
          <span>{hero.scrollHint}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 4 V19 M6 13 L12 19 L18 13" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </SectionLink>
      </div>
    </>
  )
}

/** The frosted right rail (§3.3) — social cluster + contact shortcut. */
export function RightRail() {
  return (
    <aside className="rail" aria-label="Elsewhere">
      <SectionLink href="#contact" className="rail-cta">
        {content.cta.label}
      </SectionLink>
      <ul className="rail-social">
        {content.social.map((s) => (
          <li key={s.label}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label}>
                <span aria-hidden="true">{s.short}</span>
              </a>
            ) : (
              <span className="disabled" aria-label={`${s.label} — link not set yet`}>
                <span aria-hidden="true">{s.short}</span>
                {s.todo ? <Todo label="!" /> : null}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
