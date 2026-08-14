/**
 * Every tunable number for the 3D hero, in one place.
 * Values marked MEASURED come from export/hero.meta.json — changing them breaks
 * fidelity with the Blender source. Values marked TASTE are free to dial.
 */

// ── Camera ────────────────────────────────────────────────────────────────────
// MEASURED: Blender's camera is a 100mm lens on a 36mm sensor => 20.41° horizontal
// FOV, sitting 5.99 units out. That telephoto compression is a big part of the look,
// so we keep the FOV and pull back far enough to frame the whole subject.
// The exact Blender framing (off-axis, subject cropped) is in hero.meta.json as
// `camera.three_position` / `camera.three_look_at` if you ever want to match the render.
export const CAMERA = {
  horizontalFovDeg: 20.41, // MEASURED
  // TASTE — straight-on, per the reference structure (§3.7b). The distance sets how
  // much of the frame the subject eats: at 11.2 it filled ~79% of the height; 14.5
  // brings it to ~60% so the backdrop type reads around it. The backdrop sits on its
  // own plane, so pulling the camera back shrinks the subject without shrinking it.
  position: [0, 0.35, 14.5],
  lookAt: [0, 0, 0],
  near: 0.1,
  far: 100,
}

// ── The subject ───────────────────────────────────────────────────────────────
export const SUBJECT = {
  scale: 1.0,
  // MEASURED: the shell spin the geometry-node graph applies, frames 1 → 250.
  spinFrom: [0, -0.0332, -0.733],
  spinTo: [0, -0.9547, -0.733],
}

// ── The shatter (MEASURED — see AGENTS.md §5f) ────────────────────────────────
// A black orb orbits the shell; shards near it tumble and shrink away, exposing the
// wire cage. `k` is the one value worth re-tuning by eye: the reference render's hole
// is slightly smaller than ours because Blender measures to the orb's true mesh
// surface and to each shard's object origin.
export const SHATTER = {
  k: 0.2, // MEASURED (tune by eye)
  rampWhite: 0.3955, // MEASURED
  rampBlack: 0.8068, // MEASURED
  rotation: 14.1, // MEASURED — radians at full dissolve
  orbRadius: 0.1558, // MEASURED
  orbitRadius: 1.13806, // MEASURED — circle in the Y/Z plane, x = 0
  orbitStart: 0.941, // MEASURED — radians, matches Blender frame 1
  orbitTurns: 2.1, // TASTE — how far the orb travels over a full page scroll
  burst: 1.5, // TASTE — extra outward push of the shards as you scroll away
}

// ── Starfield ─────────────────────────────────────────────────────────────────
// Generated inside a cone down the view axis rather than on a sphere: the camera
// is a 20° telephoto, so a spherical shell wastes almost every point off-screen.
// `spreadDeg` is deliberately wider than the fov so the field still fills the
// frame on wide viewports.
export const STARS = {
  count: 1500,
  spreadDeg: 34,
  verticalBias: 0.78,
  near: 6,
  far: 46,
  size: [0.7, 2.6],
  brightFraction: 0.07, // a few bright ones carry the field, the rest are dust
  white: { r: 1, g: 0.96, b: 0.94 }, // §3.5b --star
  desaturate: 0.72, // how far each star is pulled back toward white
  // Tints, not confetti — pulled from the scene's own palette plus a cool
  // counterweight so the field does not read as one flat wash.
  palette: ['#fff6f0', '#ffd9c2', '#f0504a', '#8bb7ff', '#c9a8ff', '#ffe9a8'],
}

// ── The name backdrop ─────────────────────────────────────────────────────────
// White brush-painted name behind the subject, with ink running off the strokes.
// Lives INSIDE the WebGL scene so the sphere occludes it — that occlusion is the
// whole effect (§3.7). Move it to the DOM and it collapses into a flat caption.
export const NAME = {
  lines: ['MICHAEL', 'THOMPSON'], // caps: the reference style is all-caps
  font: 'Anton', // heavy condensed base; the brush character is added, not borrowed
  fontTimeoutMs: 4000, // give the CDN time; fall back rather than hang
  canvas: { width: 2048, height: 1024 },
  seed: 20260813, // fixed, so the strokes are identical on every reload
  z: -1.9, // behind the subject, which spans roughly -1..1
  widthFraction: 0.94, // of the visible frame at that depth
  opacity: 0.95,
  yOffset: 0.15, // world units, nudges the block off dead centre

  // layout, as fractions of the canvas. Baselines are DERIVED from the measured
  // ascent, not fixed here — Anton's caps are much taller than a nominal em
  // fraction implies, and guessing clips the tops.
  safeWidth: 0.88,
  topMargin: 0.07,
  maxBlockHeight: 0.52, // leaves the lower canvas free for drips
  lineGap: 1.14, // multiples of the cap height
  letterSpacing: '6px', // Anton is condensed; without this the caps merge
  skew: -0.1, // leans the caps; a brush stroke is never perfectly upright

  // Brush character. The balance that matters: strokes stay mostly SOLID, the
  // streaks read through them, and the damage concentrates on the outline. Push
  // speckle or edgeBites much past these and the interiors turn to camouflage.
  striations: 620, // long dry-brush streaks along the stroke direction
  striationAlpha: [0.1, 0.38],
  speckle: 1200, // fine grain
  speckleRadius: [0.4, 1.6],
  edgeBites: 520, // chunks taken out of the OUTLINE (see edge detection)
  edgeBiteSize: [2, 9], // px radii — larger than this punches holes, not tears
  edgeProbe: 2, // px: how far to look when deciding a pixel is on the edge

  dripChance: 0.17, // per candidate column
  maxDrips: 30,
  dripColumnStep: 9, // px between candidate columns
  dripLength: [30, 175], // px
  dripWidth: [1.8, 6], // px
  spatter: 70,
}

// ── Scroll ────────────────────────────────────────────────────────────────────
export const SCROLL = {
  lerp: 0.075, // Lenis: how hard it smooths the page scroll itself
  // Second damping stage applied to the value the SCENE reads (see scroll.js).
  // Lower = smoother but laggier. 3.2 keeps the sphere feeling attached to the
  // wheel while removing the per-event stepping.
  damping: 3.2,
  // The parallax that carries from the hero into the lower sections (§6 answer 1a).
  //
  // Now that the page is a full portfolio (§13) rather than one screen, the subject
  // has to get OUT OF THE WAY: content sits in a column on the left, so the sphere
  // drifts right and back as you scroll. The panels carry their own scrim too —
  // both are needed, the drift alone is not enough behind long body copy.
  cameraDrift: [0, -0.9, -1.8],
  subjectDrift: [2.7, 0.8, -1.4],
}
