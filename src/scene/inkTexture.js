import * as THREE from 'three'
import { NAME } from '../config.js'

/**
 * Paints the name as heavy white brush strokes with ink running off the letters,
 * and returns it as a texture.
 *
 * The brush character is GENERATED, not taken from a font. Free "brush" faces are
 * thin handwriting; the look we want is a loaded brush dragged across paper —
 * heavy, condensed, leaning, with the bristles tearing streaks through the strokes
 * and biting chunks out of the edges. So: set a heavy condensed face, skew it, then
 * erode it in three passes (striations, speckle, edge bites).
 *
 * Drips are derived from where the ink actually IS — we read back the alpha and find
 * the lowest painted pixel per column, so runs hang off real stroke ends instead of
 * being scattered decoration.
 *
 * Generated once and cached; nothing here runs per frame.
 */

/** Seeded PRNG — the erosion must be identical on every reload, or the name appears
 *  to change shape each time the page opens, which reads as a glitch. */
function mulberry32(seed) {
  return function rand() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Waits for the base face to actually be usable.
 *
 * `document.fonts.load()` resolves with an EMPTY array — not an error — when the
 * @font-face rules are not in the CSSOM yet, and `check()` then reports false. A
 * single attempt at module time silently falls back even though the font arrives
 * moments later. Poll until it is genuinely ready, with a ceiling so a blocked CDN
 * degrades instead of hanging.
 */
async function loadBaseFont() {
  if (!document.fonts?.load) return null
  const spec = `400 200px "${NAME.font}"`
  const text = NAME.lines.join('')
  const deadline = performance.now() + NAME.fontTimeoutMs

  try {
    await document.fonts.ready
  } catch {
    /* ready() rejecting does not mean the face is unusable */
  }

  while (performance.now() < deadline) {
    try {
      await document.fonts.load(spec, text)
      // `check(spec)` without text samples a SPACE. Google serves faces as many
      // unicode-range subsets, and the one holding U+20 may never be fetched for
      // Latin text — the bare check then reports false forever. Ask about our glyphs.
      if (document.fonts.check(spec, text)) return NAME.font
    } catch {
      /* retry below */
    }
    await new Promise((r) => setTimeout(r, 120))
  }

  console.warn(
    `[inkTexture] "${NAME.font}" did not load in ${NAME.fontTimeoutMs}ms — ` +
      'painting with a fallback face. The strokes will be lighter than intended.',
  )
  return null
}

export async function createInkTexture() {
  const family = await loadBaseFont()
  const stack = family ? `"${family}", Impact, sans-serif` : 'Impact, sans-serif'

  const { width: W, height: H } = NAME.canvas
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const rand = mulberry32(NAME.seed)

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // ── 1. the strokes ─────────────────────────────────────────────────────────
  // Scale to fill the usable width. Measure the real bounding box, not just the
  // advance width, or the last letter clips — and leave headroom for the skew,
  // which pushes the top of the caps sideways.
  const lines = NAME.lines
  const maxW = W * NAME.safeWidth
  const measure = (px) => {
    ctx.font = `400 ${px}px ${stack}`
    return Math.max(
      ...lines.map((l) => {
        const m = ctx.measureText(l)
        return (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? m.width)
      }),
    )
  }

  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = NAME.letterSpacing

  const probe = H * 0.3
  const skewPad = 1 + Math.abs(NAME.skew) * 0.9
  let size = (probe * maxW) / (measure(probe) * skewPad)

  // Derive the baselines from the MEASURED ascent rather than fixed fractions.
  // Anton's caps are far taller than a nominal em fraction suggests, so guessing
  // clips the tops — and how much it clips depends on which face actually loaded.
  ctx.font = `400 ${size}px ${stack}`
  let ascent = ctx.measureText(lines[0]).actualBoundingBoxAscent || size * 0.72
  let blockH = ascent * (1 + NAME.lineGap * (lines.length - 1))
  if (blockH > H * NAME.maxBlockHeight) {
    size *= (H * NAME.maxBlockHeight) / blockH
    ctx.font = `400 ${size}px ${stack}`
    ascent = ctx.measureText(lines[0]).actualBoundingBoxAscent || size * 0.72
    blockH = ascent * (1 + NAME.lineGap * (lines.length - 1))
  }

  const top = H * NAME.topMargin
  const baselines = lines.map((_, i) => top + ascent + i * ascent * NAME.lineGap)

  lines.forEach((line, i) => {
    ctx.save()
    ctx.translate(W / 2, baselines[i])
    ctx.transform(1, 0, NAME.skew, 1, 0, 0) // lean the caps
    ctx.fillText(line, 0, 0)
    ctx.restore()
  })
  if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px'

  // the band the strokes occupy — erosion is confined to it so we do not waste
  // fill on empty canvas
  const bandTop = Math.max(0, top - 8)
  const bandBottom = Math.min(H, baselines[baselines.length - 1] + size * 0.28)
  const bandH = bandBottom - bandTop

  ctx.globalCompositeOperation = 'destination-out'

  // ── 2. striations ──────────────────────────────────────────────────────────
  // Long thin gaps torn along the direction of travel. This is the single biggest
  // contributor to reading as "brush" rather than "bold font".
  const [aLo, aHi] = NAME.striationAlpha
  for (let i = 0; i < NAME.striations; i++) {
    ctx.save()
    ctx.translate(rand() * W, bandTop + rand() * bandH)
    ctx.rotate((rand() - 0.5) * 0.16 + NAME.skew * 0.35)
    ctx.globalAlpha = aLo + rand() * (aHi - aLo)
    ctx.beginPath()
    ctx.ellipse(0, 0, 30 + rand() * 190, 0.6 + rand() * 2.2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ── 3. speckle ─────────────────────────────────────────────────────────────
  // Fine grain. Edges are thin, so uniform speckle erodes the outline far more
  // than the solid interior — which is exactly how a dry brush breaks up.
  const [spLo, spHi] = NAME.speckleRadius
  for (let i = 0; i < NAME.speckle; i++) {
    ctx.globalAlpha = 0.1 + rand() * 0.4
    ctx.beginPath()
    ctx.arc(rand() * W, bandTop + rand() * bandH, spLo + rand() * (spHi - spLo), 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  // ── 4. tear the silhouette ─────────────────────────────────────────────────
  // Scattering bites at random leaves the OUTLINE intact and just pits the middle,
  // which still reads as a bold font behind a texture. Find the actual edge pixels
  // and bite there — that is what breaks the geometric letter shapes.
  {
    const px = ctx.getImageData(0, 0, W, H).data
    const on = (x, y) =>
      x >= 0 && y >= 0 && x < W && y < H && px[((y * W + x) << 2) + 3] > 140
    const edges = []
    const r = NAME.edgeProbe
    for (let y = bandTop | 0; y < bandBottom; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (!on(x, y)) continue
        if (!on(x - r, y) || !on(x + r, y) || !on(x, y - r) || !on(x, y + r)) {
          edges.push(x, y)
        }
      }
    }

    ctx.globalCompositeOperation = 'destination-out'
    const count = edges.length >> 1
    for (let i = 0; i < NAME.edgeBites && count; i++) {
      const j = (rand() * count) | 0
      ctx.save()
      ctx.translate(edges[j * 2], edges[j * 2 + 1])
      ctx.rotate(rand() * Math.PI)
      const [bLo, bHi] = NAME.edgeBiteSize
      ctx.globalAlpha = 0.4 + rand() * 0.6
      ctx.beginPath()
      ctx.ellipse(0, 0, bLo + rand() * (bHi - bLo), bLo * 0.7 + rand() * (bHi - bLo) * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  // ── 5. the drips ───────────────────────────────────────────────────────────
  const alpha = ctx.getImageData(0, 0, W, H).data
  const bottoms = []
  for (let x = 0; x < W; x += NAME.dripColumnStep) {
    for (let y = H - 1; y >= 0; y--) {
      if (alpha[(y * W + x) * 4 + 3] > 140) {
        bottoms.push({ x, y })
        break
      }
    }
  }

  let drawn = 0
  for (const { x, y } of bottoms) {
    if (drawn >= NAME.maxDrips) break
    if (rand() > NAME.dripChance) continue

    const len = NAME.dripLength[0] + rand() * (NAME.dripLength[1] - NAME.dripLength[0])
    const w = NAME.dripWidth[0] + rand() * (NAME.dripWidth[1] - NAME.dripWidth[0])
    const end = y + len

    // a tapering run: wide where it leaves the stroke, pinched as it falls
    ctx.beginPath()
    ctx.moveTo(x - w, y - 4)
    ctx.quadraticCurveTo(x - w * 0.32, y + len * 0.62, x, end)
    ctx.quadraticCurveTo(x + w * 0.32, y + len * 0.62, x + w, y - 4)
    ctx.closePath()
    ctx.fill()

    // the bead of ink gathered at the tip
    ctx.beginPath()
    ctx.arc(x, end, w * (0.62 + rand() * 0.4), 0, Math.PI * 2)
    ctx.fill()

    // an occasional droplet that has already let go
    if (rand() < 0.28) {
      ctx.beginPath()
      ctx.arc(x + (rand() - 0.5) * 8, end + 16 + rand() * 60, w * (0.3 + rand() * 0.3), 0, Math.PI * 2)
      ctx.fill()
    }
    drawn++
  }

  // ── 6. flick spatter ───────────────────────────────────────────────────────
  for (let i = 0; i < NAME.spatter; i++) {
    ctx.globalAlpha = 0.25 + rand() * 0.55
    ctx.beginPath()
    ctx.arc(rand() * W, rand() * H, 0.8 + rand() * 2.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}
