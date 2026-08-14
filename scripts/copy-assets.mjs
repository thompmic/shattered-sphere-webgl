/**
 * Copies build inputs into public/ .
 * Run via `npm run assets`. Safe to re-run; it overwrites.
 *
 * Nothing here is generated — the .glb comes from tools/export_glb.py (AGENTS.md §5f)
 * and the Draco decoder ships inside the `three` package.
 */
import { cp, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Only the three decoder files. Copying the whole `gltf` folder also drags in
// draco_encoder.js — 932 KB that is never loaded, because the site decodes and
// never encodes.
const DRACO = 'node_modules/three/examples/jsm/libs/draco/gltf'
const jobs = [
  ['export/hero.draco.glb', 'public/models/hero.draco.glb'],
  [`${DRACO}/draco_decoder.js`, 'public/draco/draco_decoder.js'],
  [`${DRACO}/draco_decoder.wasm`, 'public/draco/draco_decoder.wasm'],
  [`${DRACO}/draco_wasm_wrapper.js`, 'public/draco/draco_wasm_wrapper.js'],
]

for (const [from, to] of jobs) {
  const src = join(root, from)
  const dst = join(root, to)
  if (!existsSync(src)) {
    console.error(`  MISSING  ${from}`)
    process.exitCode = 1
    continue
  }
  await mkdir(dirname(dst), { recursive: true })
  await cp(src, dst, { recursive: true })
  const s = await stat(dst)
  console.log(`  ok       ${to}${s.isFile() ? `  (${(s.size / 1024).toFixed(0)} KB)` : ''}`)
}
