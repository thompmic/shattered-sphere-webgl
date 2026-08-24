import { useEffect, useRef, useState } from 'react'
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

/** Which rail media to render. See the note in RightRail. */
function resolveRailMode() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'none'
  if (!window.matchMedia('(min-width: 901px)').matches) return 'none'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'still' : 'video'
}

/**
 * The frosted rail: CTA, the looping animation, and the social cluster.
 *
 * The media block is given the video's EXACT aspect ratio (784:1172), so
 * `object-fit: contain` fills it precisely — no zoom, no crop, no letterbox.
 * Sizing the box to the footage is what avoids having to choose between the two.
 */
export function RightRail() {
  const video = useRef(null)

  // Three states, not two:
  //   'video' — the loop
  //   'still' — reduced motion: show the poster, because an empty glass box is
  //             exactly the problem this block exists to solve
  //   'none'  — under 901px the rail is display:none, and a hidden <video autoplay>
  //             (or even an <img>) still pulls the file down. Render nothing rather
  //             than spend a phone's data on something nobody can see.
  // Resolved in the initialiser so the wrong asset never starts downloading.
  const [mode, setMode] = useState(resolveRailMode)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 901px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setMode(resolveRailMode())
    wide.addEventListener('change', sync)
    calm.addEventListener('change', sync)
    return () => {
      wide.removeEventListener('change', sync)
      calm.removeEventListener('change', sync)
    }
  }, [])

  // The rail fades out once you scroll into the sections, but a hidden <video>
  // keeps decoding every frame for as long as someone reads the page. Pause it
  // when the chrome is scrolled away. Driven off the same data-scrolled flag App
  // already sets, via an observer rather than another rAF loop.
  useEffect(() => {
    const chrome = document.querySelector('.chrome')
    if (!chrome) return
    const apply = () => {
      const el = video.current
      if (!el) return
      if (chrome.dataset.scrolled === 'true') el.pause()
      else el.play().catch(() => {})
    }
    const mo = new MutationObserver(apply)
    mo.observe(chrome, { attributes: true, attributeFilter: ['data-scrolled'] })
    apply()
    return () => mo.disconnect()
  }, [mode])

  return (
    <aside className="rail" aria-label="Elsewhere">
      <SectionLink href="#contact" className="rail-cta">
        {content.cta.label}
      </SectionLink>

      <div className="rail-media">
        {mode === 'video' ? (
          <video
            ref={video}
            className="rail-video"
            src="/video/rail-loop.mp4"
            poster="/video/rail-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : mode === 'still' ? (
          <img className="rail-video" src="/video/rail-poster.jpg" alt="" aria-hidden="true" />
        ) : null}

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
      </div>
    </aside>
  )
}
