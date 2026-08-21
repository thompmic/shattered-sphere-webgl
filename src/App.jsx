import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import { Nav, HeroCopy, RightRail } from './ui/Chrome.jsx'
import { Sections } from './ui/Sections.jsx'
import { startScroll, scroll } from './scroll.js'

/**
 * The 3D scene is code-split on purpose.
 *
 * Imported statically, three + drei + postprocessing (~347 KB brotli, ~1.2 MB
 * parsed) had to download AND execute before React could render a single DOM
 * node — so the text content could not paint until the entire WebGL engine was
 * ready. Loading it lazily lets the page paint from the small entry chunk and
 * streams the scene in behind it.
 */
const Stage = lazy(() => import('./scene/Stage.jsx').then((m) => ({ default: m.Stage })))

export default function App() {
  const chrome = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // the browser restoring a mid-page scroll on reload leaves the hero already
    // blown apart, which reads as broken rather than as an effect
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const stop = startScroll()

    // drive the hero chrome's fade straight off the scroll store rather than React
    // state — scrolling must never re-render the tree that owns the canvas
    let raf
    const tick = () => {
      if (chrome.current) {
        chrome.current.dataset.scrolled = scroll.target > 0.04 ? 'true' : 'false'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      if (typeof stop === 'function') stop()
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to content
      </a>

      {/* The brush face is only ever drawn into a canvas, and a font that nothing in
          the DOM renders can sit unfetched — `document.fonts.load()` alone is not a
          reliable trigger. Putting the glyphs on the page, off-screen, makes the
          browser fetch it as part of layout. */}
      <span className="brush-preload" aria-hidden="true">
        MichaelThompson
      </span>

      <div className="stage" id="top" data-ready={ready}>
        <Suspense fallback={null}>
          <Stage onReady={() => setReady(true)} />
        </Suspense>
      </div>

      <div className="chrome" ref={chrome} data-scrolled="false">
        <Nav />
        <HeroCopy />
        <RightRail />
      </div>

      <main className="scroller">
        <div className="hero-spacer" aria-hidden="true" />
        <Sections />
      </main>
    </>
  )
}
