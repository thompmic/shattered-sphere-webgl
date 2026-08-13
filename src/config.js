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
  // much of the frame the subject eats: at 11.2 it filled ~79% of the height and
  // swallowed both numerals; 14.5 brings it to ~60% so the type reads around it.
  // The numerals hold their §3.2 size either way — they sit on their own plane, so
  // pulling back shrinks the subject without shrinking the type.
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

// ── The display type (§3.2 / §3.7) ────────────────────────────────────────────
// The Figma artboard is 1600×1000 and the numerals are 340px Kulim Park Light at
// (20,30) and (790,30). We map that grid onto the world plane sitting behind the
// subject so the sphere occludes the type — the effect the samurai reference is for.
// Raise `scale` or pull `x` toward 0 for a more aggressive overlap.
export const TYPE = {
  z: -1.8, // world z, behind the subject (which spans roughly -1..1)
  fontSizePx: 340, // MEASURED (§3.4)
  letterSpacing: -0.04, // MEASURED — −4% tracking, defines the whole look (§3.4)
  artboard: { w: 1600, h: 1000 }, // MEASURED (§3.1)
  left: { text: 'left', xPx: 221, yPx: 149 }, // MEASURED — centre of the `06` box
  right: { text: 'right', xPx: 997, yPx: 149 }, // MEASURED — centre of the `04` box
  opacityTop: 1.0, // MEASURED — §3.5b `--display` is #FFF 100% → 18%
  opacityBottom: 0.18,
}

// ── Scroll ────────────────────────────────────────────────────────────────────
export const SCROLL = {
  lerp: 0.09,
  // The parallax that carries from the hero into the lower sections (§6 answer 1a).
  //
  // Now that the page is a full portfolio (§13) rather than one screen, the subject
  // has to get OUT OF THE WAY: content sits in a column on the left, so the sphere
  // drifts right and back as you scroll. The panels carry their own scrim too —
  // both are needed, the drift alone is not enough behind long body copy.
  cameraDrift: [0, -0.9, -1.8],
  subjectDrift: [2.7, 0.8, -1.4],
}
