import { useEffect, useMemo, useRef, useState } from 'react'

import { content } from '../content.js'
import { DECK } from '../config.js'
import { scrollToSection } from '../scroll.js'
import { Todo } from './Todo.jsx'
import { useCardDeck } from './useCardDeck.js'
import { WORK_HASH, locateProject, projectHash, readProjectSlug, setProjectHash } from './deepLink.js'

/**
 * The work section, as a deck rather than a list.
 *
 * The problem this solves: thirteen projects stacked vertically is about six
 * screens of scrolling, and nobody reaches the bottom. The deck shows three at
 * a time in a fixed slot and pages between them, so the section stays one screen
 * tall no matter how much work gets added to content.js.
 *
 * Filters are a real tablist (arrow keys move between tabs, Home/End jump to the
 * ends) because they behave like one. The pager underneath is plain buttons.
 */

function ExternalArrow() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path d="M7 17 L17 7 M9 7 h8 v8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function ProjectCard({ project, phase, style, highlighted, onPermalink }) {
  return (
    <li
      className="project"
      id={`project-${project.slug}`}
      data-todo={project.todo || undefined}
      data-phase={phase}
      data-highlighted={highlighted || undefined}
      style={style}
    >
      <div className="project-top">
        <h3 className="project-title">
          {project.title}
          {project.todo ? <Todo /> : null}
        </h3>
        <span className="project-meta">
          {/* A real anchor, not a button: middle-click, right-click → copy link
              address, and "open in new tab" all have to work, because copying
              the address is the whole point of it existing. */}
          <a
            className="project-permalink"
            href={projectHash(project.slug)}
            aria-label={`Link to ${project.title}`}
            title="Link to this project"
            onClick={(e) => {
              e.preventDefault()
              onPermalink(project.slug)
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
              <path
                d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 1 0 11 18.66l1.5-1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <span className="project-year">{project.year}</span>
        </span>
      </div>

      <p className="project-summary">
        {project.summary}
        {project.summaryTodo ? <Todo /> : null}
      </p>

      {project.role ? <p className="project-role">{project.role}</p> : null}

      {project.stack?.length ? (
        <ul className="chips">
          {project.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : null}

      {project.links?.length ? (
        <p className="project-links">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
              {l.label}
              <ExternalArrow />
            </a>
          ))}
        </p>
      ) : null}

      {project.credit ? <p className="project-credit">{project.credit}</p> : null}
    </li>
  )
}

export function WorkDeck() {
  const { work } = content
  const [filter, setFilter] = useState(work.filters[0].id)
  const tabsRef = useRef(null)

  const visible = useMemo(
    () => (filter === 'all' ? work.projects : work.projects.filter((p) => p.category === filter)),
    [filter, work.projects],
  )

  const pageCount = Math.max(1, Math.ceil(visible.length / DECK.perPage))
  const { page, phase, goTo, jumpTo, replaceWith, containerRef, delayFor } = useCardDeck({ pageCount })

  // The slug a `#work/<slug>` link pointed at, so the card can flash once on
  // arrival. Cleared on the next interaction — a permanent highlight would read
  // as "selected" rather than "here is the one you asked for".
  const [highlighted, setHighlighted] = useState(null)

  // Deep links. Resolved against the FULL project list under the `all` filter
  // rather than the current one, so a link keeps working no matter which tab it
  // happened to be copied from.
  useEffect(() => {
    const apply = () => {
      const slug = readProjectSlug()
      if (!slug) return

      const hit = locateProject(work.projects, slug, DECK.perPage)
      // Unknown slug — a link saved before a rename. Fall back to the section
      // rather than doing nothing, so the link still lands somewhere sensible.
      if (!hit) {
        scrollToSection(WORK_HASH)
        return
      }

      setFilter('all')
      jumpTo(hit.page)
      setHighlighted(slug)

      // Deferred a frame on purpose. Child effects run before the parent's, so
      // at this point App has not yet started Lenis or done its scroll-to-top —
      // scrolling now would be undone immediately. By the next frame both have
      // run and Lenis owns the scroll position.
      requestAnimationFrame(() => scrollToSection(WORK_HASH))
    }

    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [jumpTo, work.projects])

  const onPermalink = (slug) => {
    setProjectHash(slug)
    setHighlighted(slug)
  }

  // `page` is clamped asynchronously by the hook when the filter shrinks the
  // deck, so one render can still ask for a page past the end. Clamp here too
  // or that render slices past the array and shows an empty deck for a frame.
  const safePage = Math.min(page, pageCount - 1)
  const start = safePage * DECK.perPage
  const shown = visible.slice(start, start + DECK.perPage)

  // A filter change animates exactly like a page turn — `replaceWith` runs the
  // same drop-and-replace cycle and resets to page one inside the swap, so the
  // new category is never briefly shown at the old page offset.
  const pickFilter = (id) => {
    if (id === filter) return
    setHighlighted(null)
    replaceWith(() => setFilter(id))
  }

  const pickPage = (next) => {
    setHighlighted(null)
    goTo(next)
  }

  const onTabKeyDown = (e) => {
    const ids = work.filters.map((f) => f.id)
    const i = ids.indexOf(filter)
    let next = null
    if (e.key === 'ArrowRight') next = ids[(i + 1) % ids.length]
    else if (e.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length]
    else if (e.key === 'Home') next = ids[0]
    else if (e.key === 'End') next = ids[ids.length - 1]
    if (!next) return
    e.preventDefault()
    pickFilter(next)
    // Follow focus, which is what a tablist is expected to do.
    tabsRef.current?.querySelector(`[data-tab="${next}"]`)?.focus()
  }

  return (
    <div className="deck" data-phase={phase}>
      <div className="deck-tabs" role="tablist" aria-label="Filter work by kind" ref={tabsRef}>
        {work.filters.map((f) => {
          const selected = f.id === filter
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              data-tab={f.id}
              id={`deck-tab-${f.id}`}
              aria-selected={selected}
              aria-controls="deck-panel"
              tabIndex={selected ? 0 : -1}
              className="deck-tab"
              onClick={() => pickFilter(f.id)}
              onKeyDown={onTabKeyDown}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div id="deck-panel" role="tabpanel" aria-labelledby={`deck-tab-${filter}`}>
        {/* The height of this element is animated imperatively — see useCardDeck. */}
        <ol className="deck-cards" ref={containerRef}>
          {shown.map((p, i) => (
            <ProjectCard
              key={`${filter}-${p.slug}`}
              project={p}
              phase={phase}
              style={delayFor(i)}
              highlighted={p.slug === highlighted}
              onPermalink={onPermalink}
            />
          ))}
        </ol>

        {visible.length === 0 ? <p className="deck-empty">{work.empty}</p> : null}
      </div>

      {pageCount > 1 ? (
        <div className="deck-pager">
          <div className="deck-dots">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className="deck-dot"
                aria-label={`Page ${i + 1} of ${pageCount}`}
                aria-current={i === safePage ? 'true' : undefined}
                data-active={i === safePage || undefined}
                onClick={() => pickPage(i)}
              />
            ))}
          </div>

          <div className="deck-arrows">
            <button
              type="button"
              className="deck-arrow"
              onClick={() => pickPage(safePage - 1)}
              disabled={safePage === 0}
              aria-label="Previous projects"
            >
              <span aria-hidden="true">‹</span> Prev
            </button>
            <button
              type="button"
              className="deck-arrow"
              onClick={() => pickPage(safePage + 1)}
              disabled={safePage === pageCount - 1}
              aria-label="Next projects"
            >
              Next <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Without this, paging is silent to a screen reader: focus stays on the
          same button and the content behind it changes with no announcement. */}
      <p className="sr-only" role="status" aria-live="polite">
        {`Page ${safePage + 1} of ${pageCount}. Showing ${shown.length} of ${visible.length} projects.`}
      </p>
    </div>
  )
}
