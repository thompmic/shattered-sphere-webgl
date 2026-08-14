import { useEffect, useRef } from 'react'
import { Stage } from './scene/Stage.jsx'
import { Nav, HeroCopy, RightRail } from './ui/Chrome.jsx'
import { Sections } from './ui/Sections.jsx'
import { startScroll, scroll } from './scroll.js'

export default function App() {
  const chrome = useRef()

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

      <div className="stage" id="top">
        <Stage />
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
