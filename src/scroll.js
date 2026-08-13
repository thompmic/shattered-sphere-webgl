import Lenis from 'lenis'
import { SCROLL } from './config.js'

/**
 * One smooth-scroll source of truth, read directly inside useFrame.
 *
 * Deliberately a plain module object rather than React state: the scene samples it
 * every frame, and routing that through re-renders would be pointless churn.
 *
 *   target — where Lenis says we are, 0 at the top of the page, 1 at the bottom
 *   value  — that, damped. THIS is what the scene should read.
 *
 * The second stage matters. Lenis smooths the *page* scroll, but it still lands as
 * a stepped value each event, and feeding it straight into a camera or a shader
 * uniform shows every one of those steps. Damping once, here, means every consumer
 * is smooth for free and nothing has to re-implement it.
 */
export const scroll = { target: 0, value: 0, velocity: 0 }

let lenis = null

/** Frame-rate independent exponential damping — identical feel at 60 and 144 Hz. */
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

export function updateScroll(dt) {
  // clamp dt so a background tab or a long frame cannot teleport the scene
  scroll.value = damp(scroll.value, scroll.target, SCROLL.damping, Math.min(dt, 0.1))
}

export function startScroll() {
  if (lenis) return () => {}

  lenis = new Lenis({
    lerp: SCROLL.lerp,
    wheelMultiplier: 0.85,
    syncTouch: true, // makes touch scrolling match the wheel feel on mobile
  })

  lenis.on('scroll', (e) => {
    scroll.target = Math.min(Math.max(e.scroll / (e.limit || 1), 0), 1)
    scroll.velocity = e.velocity
  })

  let raf
  let last = performance.now()
  const loop = (time) => {
    lenis.raf(time)
    updateScroll((time - last) / 1000)
    last = time
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(raf)
    lenis.destroy()
    lenis = null
  }
}

/**
 * Anchor navigation has to go through Lenis — it owns the scroll position, so a
 * plain `href="#work"` jump fights it and lands in the wrong place.
 */
export function scrollToSection(hash) {
  const el = typeof hash === 'string' ? document.querySelector(hash) : hash
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -12, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
