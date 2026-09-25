import { useEffect, useState } from 'react'
import { content } from '../content.js'
import { SPLASH } from '../config.js'

/**
 * The full-page splash shown while the 3D streams in.
 *
 * It lifts when BOTH conditions hold: the model has decoded (`ready`) and a
 * minimum dwell has passed. The dwell is the point of the thing -- on a warm
 * cache `ready` fires in a couple of hundred milliseconds, and a quote that
 * flashes past unread is just a delay with extra steps.
 *
 * Three things here are load-bearing rather than decorative:
 *
 *  - It is skippable. Anyone who has read it, or does not care, gets out on the
 *    first click, key, wheel or touch.
 *  - It lifts on a timer regardless. `ready` comes from the model decoding, so a
 *    404, a blocked CDN or a refused WebGL context would otherwise leave the
 *    whole site sealed behind this screen forever. A loading overlay must never
 *    be able to become a wall.
 *  - It unmounts after the fade rather than sitting at opacity 0, where it would
 *    keep swallowing every click on the page underneath.
 */
function pickQuote() {
  const all = content.splash.quotes
  return all[Math.floor(Math.random() * all.length)]
}

export function Splash({ ready }) {
  // picked in the initialiser, not on each render: re-picking would swap the
  // quote out from under someone halfway through reading it
  const [quote] = useState(pickQuote)
  const [dwelled, setDwelled] = useState(false)
  const [lifting, setLifting] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  useEffect(() => {
    const dwell = setTimeout(() => setDwelled(true), SPLASH.minMs)
    const ceiling = setTimeout(() => setLifting(true), SPLASH.maxMs)
    return () => {
      clearTimeout(dwell)
      clearTimeout(ceiling)
    }
  }, [])

  useEffect(() => {
    if (ready && dwelled) setLifting(true)
  }, [ready, dwelled])

  // let people out early
  useEffect(() => {
    if (lifting) return
    const skip = () => setLifting(true)
    const opts = { passive: true }
    window.addEventListener('pointerdown', skip, opts)
    window.addEventListener('keydown', skip)
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchstart', skip, opts)
    return () => {
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
    }
  }, [lifting])

  useEffect(() => {
    if (!lifting) return
    const t = setTimeout(() => setUnmounted(true), SPLASH.fadeMs)
    return () => clearTimeout(t)
  }, [lifting])

  if (unmounted) return null

  const { greeting, subtitle, skipLabel, a11yLabel } = content.splash

  return (
    <div
      className="splash"
      data-lifting={lifting}
      /* the fade duration lives in config.js; hand it to CSS rather than
         hardcoding the same number in both places, where they would drift */
      style={{ '--splash-fade': `${SPLASH.fadeMs}ms` }}
      role="status"
      aria-label={a11yLabel}
      onClick={() => setLifting(true)}
    >
      <div className="splash-inner">
        <p className="splash-greeting">{greeting}</p>

        <blockquote className="splash-quote">
          <p>{quote.line}</p>
          {quote.by ? <cite>{quote.by}</cite> : null}
        </blockquote>

        <span className="splash-builder" aria-hidden="true" />

        <p className="splash-sub">{subtitle}</p>
      </div>

      <button className="splash-skip" type="button" onClick={() => setLifting(true)}>
        {skipLabel}
      </button>
    </div>
  )
}
