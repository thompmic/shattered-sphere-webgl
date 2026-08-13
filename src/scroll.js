import Lenis from 'lenis'
import { SCROLL } from './config.js'

/**
 * One smooth-scroll source of truth, read directly inside useFrame.
 *
 * Deliberately a plain module object rather than React state: the scene samples it
 * every frame, and routing that through re-renders would be pointless churn.
 * `progress` is 0 at the top of the page and 1 at the bottom (§6 answer 1a — the
 * parallax is one continuous motion from the hero through the lower sections).
 */
export const scroll = { progress: 0, velocity: 0 }

let lenis = null

export function startScroll() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: SCROLL.lerp, wheelMultiplier: 0.9 })

  lenis.on('scroll', (e) => {
    const max = e.limit || 1
    scroll.progress = Math.min(Math.max(e.scroll / max, 0), 1)
    scroll.velocity = e.velocity
  })

  let raf
  const loop = (time) => {
    lenis.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis.destroy()
    lenis = null
  }
}
