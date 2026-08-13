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
const jobs = [
  ['export/hero.draco.glb', 'public/models/hero.draco.glb'],
  ['onezero/font/KulimPark-Light.ttf', 'public/fonts/KulimPark-Light.ttf'],
  ['node_modules/three/examples/jsm/libs/draco/gltf', 'public/draco'],
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
