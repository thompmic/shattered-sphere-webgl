import { useEffect, useRef, useState } from 'react'
import { Stage } from './scene/Stage.jsx'
import { Nav, HeroCopy, RightRail, Sections } from './ui/Chrome.jsx'
import { startScroll, scroll } from './scroll.js'

export default function App() {
  const chrome = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stop = startScroll()
    setReady(true)

    // drive the chrome fade straight off the scroll store rather than through state,
    // so scrolling never re-renders the tree that owns the canvas
    let raf
    const tick = () => {
      if (chrome.current) {
        chrome.current.dataset.scrolled = scroll.progress > 0.06 ? 'true' : 'false'
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
      <div className="stage" id="top">
        <Stage />
      </div>

      <div className="chrome" ref={chrome} data-scrolled="false">
        <Nav />
        <HeroCopy />
        <RightRail />
      </div>

      <div className="scroller">
        <div className="hero-spacer" />
        <Sections />
      </div>
    </>
  )
}
