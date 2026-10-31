import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { DECK } from '../config.js'

/**
 * The state machine behind the work deck.
 *
 * A page turn is three things happening in order, and they are separated here
 * because they cannot be expressed as one CSS transition:
 *
 *   1. `out`  — the cards currently on screen tip and fall, staggered.
 *   2. swap   — the rendered page changes. This is the only moment the DOM
 *               content changes, and it happens while nothing is visible.
 *   3. `in`   — the new cards slide in, staggered.
 *
 * The height is handled separately from the cards. During `out` the cards only
 * *transform*, so they still occupy their layout boxes and the container height
 * is stable. The instant we swap, the natural height changes — usually by a lot,
 * because three long summaries and three short ones are not the same size — and
 * without intervention the whole page below jerks upward. So we pin the height
 * before the swap and animate it to the new natural height during `in`.
 *
 * Returns the page to render, the phase, and the two things the markup needs to
 * drive CSS: a ref for the container and a per-card animation delay.
 */
export function useCardDeck({ pageCount }) {
  const reduced = usePrefersReducedMotion()

  const [page, setPage] = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'out' | 'in'

  const containerRef = useRef(null)
  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  // The height to animate FROM, measured just before the swap. Read in the
  // layout effect below, which runs after React has painted the new cards.
  const fromHeightRef = useRef(null)

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => clearTimer, [])

  // A page that no longer exists — the filter changed under us, or the last
  // project in a category was removed — would render an empty deck with live
  // pager controls. Clamp instead.
  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1))
  }, [page, pageCount])

  /**
   * Run one drop-and-replace cycle around an arbitrary state change.
   *
   * `apply` is deliberately a callback rather than a page number: changing the
   * filter has to animate too, and that is a different piece of state. Whatever
   * `apply` does happens at the swap point, when nothing is on screen.
   */
  const transition = useCallback(
    (apply) => {
      // Mid-flight clicks are common on the pager: someone hits `next` three
      // times quickly. Rather than queue them, the latest change wins and the
      // animation restarts from wherever it is.
      clearTimer()

      if (reduced) {
        apply()
        setPhase('idle')
        return
      }

      pendingRef.current = apply
      setPhase('out')

      const outTotal = DECK.dropMs + DECK.stagger * (DECK.perPage - 1)
      timerRef.current = setTimeout(() => {
        const el = containerRef.current
        if (el) fromHeightRef.current = el.offsetHeight
        pendingRef.current?.()
        pendingRef.current = null
        setPhase('in')
      }, outTotal)
    },
    [reduced],
  )

  const goTo = useCallback(
    (next) => {
      if (next === page || next < 0 || next > pageCount - 1) return
      transition(() => setPage(next))
    },
    [page, pageCount, transition],
  )

  /**
   * For changes that replace the whole deck rather than page within it — i.e.
   * the filter. Resets to page one as part of the same swap.
   *
   * This exists because routing a filter change through `goTo(0)` silently did
   * nothing whenever you were ALREADY on page one, which is most of the time:
   * the cards changed instantly with no animation at all.
   */
  const replaceWith = useCallback(
    (apply) => {
      transition(() => {
        apply()
        setPage(0)
      })
    },
    [transition],
  )

  // Runs after the new cards are in the DOM but before the browser paints, which
  // is the only point where we can read the new natural height AND still pin the
  // old one without a visible flash.
  useLayoutEffect(() => {
    if (phase !== 'in') return
    const el = containerRef.current
    const from = fromHeightRef.current
    if (!el || from == null) return

    const to = el.scrollHeight
    fromHeightRef.current = null

    el.style.height = `${from}px`
    el.style.transition = 'none'

    // Two frames: one to commit the pinned height, one to start the transition.
    // A single frame gets coalesced and the height snaps instead of animating.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return
        containerRef.current.style.transition = `height ${DECK.heightMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        containerRef.current.style.height = `${to}px`
      })
    })

    const inTotal = Math.max(DECK.slideMs + DECK.stagger * (DECK.perPage - 1), DECK.heightMs)
    clearTimer()
    timerRef.current = setTimeout(() => {
      // Release the pinned height. Leaving it set would freeze the deck at this
      // size, so a later viewport resize that reflows the summaries would clip.
      const node = containerRef.current
      if (node) {
        node.style.transition = ''
        node.style.height = ''
      }
      setPhase('idle')
    }, inTotal)

    return () => cancelAnimationFrame(raf)
  }, [phase, page])

  /** Per-card inline delay. Cards leave top-first and arrive top-first. */
  const delayFor = useCallback(
    (index) => (reduced ? undefined : { animationDelay: `${index * DECK.stagger}ms` }),
    [reduced],
  )

  return { page, phase, goTo, replaceWith, containerRef, delayFor, reduced }
}

/**
 * Live — not read once at mount. Someone toggling the OS setting while the page
 * is open should get the quiet version without reloading.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
