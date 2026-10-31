import { useMemo, useRef, useState } from 'react'

import { content } from '../content.js'
import { DECK } from '../config.js'
import { Todo } from './Todo.jsx'
import { useCardDeck } from './useCardDeck.js'

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

function ProjectCard({ project, phase, style }) {
  return (
    <li className="project" data-todo={project.todo || undefined} data-phase={phase} style={style}>
      <div className="project-top">
        <h3 className="project-title">
          {project.title}
          {project.todo ? <Todo /> : null}
        </h3>
        <span className="project-year">{project.year}</span>
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
  const { page, phase, goTo, replaceWith, containerRef, delayFor } = useCardDeck({ pageCount })

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
    replaceWith(() => setFilter(id))
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
            <ProjectCard key={`${filter}-${p.title}`} project={p} phase={phase} style={delayFor(i)} />
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
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="deck-arrows">
            <button
              type="button"
              className="deck-arrow"
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 0}
              aria-label="Previous projects"
            >
              <span aria-hidden="true">‹</span> Prev
            </button>
            <button
              type="button"
              className="deck-arrow"
              onClick={() => goTo(safePage + 1)}
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
