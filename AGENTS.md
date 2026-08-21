# AGENTS.md — Studio One.Zero (3D Website)

> **READ THIS FILE FIRST.** It is the single source of truth for bringing any agent
> up to speed on this project. Update it whenever the project state changes.

---

# 🔴 SECTION 0 — HANDOFF / RESUME HERE

**Updated 2026-08-12 on arrival at the Windows desktop.** The transfer is complete. The
laptop→desktop move is done, the toolchain is installed, and the framework question is
answered. **This file is still the entire handover — no chat history carries over.**

### Where we are in one paragraph
The folder held a Figma file, a Blender scene, a font and a video — **no code**. Three sessions
of investigation have happened: the `.fig` was reverse-engineered into an exact design spec
(§3), the `.blend` was inventoried (§5) and then **opened and measured in Blender** (§5b–§5e),
and the user has locked all creative direction (§6). **Not one line of website code has been
written yet.** Everything that was blocking is now unblocked: Blender 5.2 and Node 21 are
installed (§9), and the user picked **Vite + React Three Fiber** (§10).

### Next Actions, in order
1. ~~Confirm the framework pick~~ ✅ **Option A, Vite + React Three Fiber** (§10).
2. ~~Verify the toolchain~~ ✅ **Blender 5.2.0, Node 21.6.2, Python 3.12, Git 2.43** (§9).
3. ~~Export `22.blend` → `.glb`~~ ✅ **DONE — `export/hero.draco.glb`, 1.13 MB, 4 draw calls,
   112,883 tris, shatter math verified against a reference render.** Full detail in **§5f**.
4. ~~Scaffold the site~~ ✅ **DONE — Vite + R3F running on `localhost:5173`.** See **§12**.
5. ~~Build the hero~~ ✅ **DONE in first form** — starfield, motes, display type behind the
   subject, shatter shader wired to scroll, frosted rail, three scroll sections. **§12.**
6. **← YOU ARE HERE. Look at it and art-direct it.** The pipeline is proven correct
   end-to-end; what it has *not* had is a pass by eye. §12.4 lists the specific dials.
7. ~~`git init`~~ ✅ **DONE — pushed public to
   [thompmic/shattered-sphere-webgl](https://github.com/thompmic/shattered-sphere-webgl).**
8. ~~Deploy it~~ ✅ **LIVE at [michaelthompsondev.netlify.app](https://michaelthompsondev.netlify.app/)**
   (2026-08-16). Netlify, auto-deploys on push to `main`. Verified on the live host: no failed
   requests, `.glb` and `.wasm` both load, `.wasm` is served as `application/wasm`, the
   immutable cache headers apply, and **zero TODO chips render in production** — which also
   confirms the dev-only chip really is tree-shaken. 1.53 MB transferred.
9. ~~Credit @Bachynskyi_ui on the site itself~~ ✅ in the footer (§2).
10. **← YOU ARE HERE. Two things hold the site back, neither is code:**
    - **Both other project repos are private**, so two of three cards have no link at all.
      Making `thompmic/soccer-star-styles` public is the single highest-value change left.
    - **No loading state.** The 1.1 MB glb streams in behind `Suspense fallback={null}`, so
      the hero pops. The LCP poster idea in §5 is still the fix.

### Do not redo this work
- The `.fig` is already fully decoded → `design-reference/figma-canvas.json`. Don't re-decode.
- **The `.blend` has been opened and measured (§5b–§5e).** Don't re-inspect it — and note that
  §5's original prose contains three assumptions that the measurement disproved.
- Every color, font size, position and string in §3 is measured from the source file, not
  guessed. Trust it.

### Section map (they are NOT in numeric order — read in this order)
`§0` handoff (you are here) → `§1` at a glance → `§2` folder contents → `§3` **the design spec,
the heart of this file** (3.5b dark palette *overrides* 3.5; 3.7 layering; 3.8 copy) →
`§4` how to re-decode the .fig → `§5` **the .blend + the shard problem** → `§6` locked
direction → `§9` toolchain → `§10` **framework choice, blocking** → `§7` working agreements →
`§8` changelog → `§11` open threads to raise.

### Traps on the new machine (resolved 2026-08-12)
- ~~The project is nested one level deeper~~ ✅ **FLATTENED.** The root is now
  `C:\Users\PrimeMike\OneDrive\Desktop\3D website` — `package.json` sits directly in it and
  `npm run dev` works from there. `__MACOSX` deleted. The old trailing-space warning is moot.
- **This is Windows PowerShell 5.1 — `&&` is a parse error.** Use `;` to chain, or
  `A; if ($?) { B }` for conditional chaining. This bites constantly when pasting
  README-style commands.
- **After moving the project, delete `node_modules\.vite`.** Vite caches absolute paths in its
  dep-optimiser and fails to start with `EPERM: rmdir ...\.vite\deps` otherwise.
- **Blender is not on PATH.** Always call
  `"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"` with the full quoted path.
- **Never save over `22.blend`** — Blender 5.2 cannot write a file 4.4 can reopen (§9).
- Scattered `.DS_Store` files are macOS leftovers; harmless, but `.gitignore` them at `git init`.
- Paths in §4 are still the old macOS ones. Translate to the Windows root when using them.

---

## 1. Project at a glance

| | |
|---|---|
| **Name** | Studio One.Zero — 3D website |
| **Root** | `C:\Users\PrimeMike\OneDrive\Desktop\3D website` — **flattened 2026-08-12**; `npm run dev` runs straight from here. The old nested `3D website\3D website` layout and the `__MACOSX` zip junk are gone |
| **Goal** | A **full personal portfolio** — projects, about, socials, interests (§13). The shattered-sphere hero is the *opening*, not the whole site |
| **Live** | ✅ **[michaelthompsondev.netlify.app](https://michaelthompsondev.netlify.app/)** — Netlify, auto-deploys on push to `main`, config in `netlify.toml` |
| **Status** | **Direction locked (§6). Framework picked (§10). Toolchain verified present (§9). `.blend` fully characterized (§5). No site code written yet.** |
| **Machine** | ✅ Arrived on the user's **Windows desktop** 2026-08-12. Windows 11, PowerShell. The old macOS paths in §4 are historical — translate them. |
| **Stack** | **Vite + React Three Fiber** (Option A, chosen by user 2026-08-12) |
| **Git** | ✅ **[github.com/thompmic/shattered-sphere-webgl](https://github.com/thompmic/shattered-sphere-webgl)** — public, `main`. Lean repo (29 files, 2.1 MB): @Bachynskyi_ui's raw `.fig`/`.blend`/`.mp4` and the big reference PNGs are gitignored, the derived `.glb` is committed |

**Direction locked 2026-08-12:** real WebGL 3D from `22.blend` via Three.js · single hero
leading into a scrolling multi-section page with parallax carried between sections ·
**dark space background with stars** (overrides the Figma light palette, see §3.5b) ·
display type sits **behind** the 3D subject (see §3.7) · landscape/desktop first, mobile
deferred to a later phase · all copy is placeholder and will be rewritten by the user.

---

## 2. What is actually in the folder

```
3D website /
├── AGENTS.md                     ← this file
├── design-reference/             ← generated by agent from onezero.fig (see §4)
│   ├── figma-canvas.json         ← full decoded Figma node tree (colors, text, geometry)
│   ├── figma-thumbnail.png
│   ├── decode-fig.py             ← script that decodes .fig → JSON
│   └── images/
│       ├── bg-kommers-unsplash-2700x1518.png   (pink brain on white waves — bg layer)
│       ├── hero-shattered-sphere-3200x2000.png (red cracked sphere + black glossy orbs — HERO)
│       ├── right-panel-stack-220x960.png       (vertical column of 3 black orbs)
│       └── duck-petals-1580x900.png            (pink duck + petals — needs a home, §11.6)
├── export/                       ← generated by tools/export_glb.py (§5f)
│   ├── hero.draco.glb            1.13 MB — **the one to ship**
│   ├── hero.glb                  9.30 MB — uncompressed fallback
│   ├── hero.meta.json            camera, orbit, shatter constants, material values
│   └── check_A/B/C_*.png         verification renders (original vs export vs shatter math)
├── tools/
│   ├── export_glb.py             .blend → .glb, merges the shards with their attributes
│   ├── verify_shatter.py         re-renders the shatter math to prove it matches Blender
│   └── inspect_glb.py            plain-python glb inspector (no Blender needed)
└── onezero/
    ├── onezero.fig               11.5 MB — Figma source (zip + kiwi/zstd)
    ├── blender/
    │   ├── 22.blend              21.8 MB — the 3D scene
    │   ├── 22.blend1             31.8 MB — Blender autosave backup
    │   └── laptop.mp4            12.0 MB — rendered 3D animation (likely hero video)
    └── font/
        └── KulimPark-Light.ttf   the display font used for the big numerals
```

**Origin (clarified by the user 2026-08-12):** the concept and the source files come from
**[@Bachynskyi_ui](https://www.instagram.com/bachynskyi_ui/)** (bakalev / Bachynskyi), who
**gave them to the user directly**. So this is an adaptation with the author's blessing, not
reuse of a stray public file. Internal notes in the `.fig` match that: *"Hi. I'm glad you liked
my project, thanks for the feedback."*

Two standing rules follow:
- **Credit @Bachynskyi_ui by name** wherever this is presented — the README does, and the site
  itself should before it goes live.
- **Do not republish his raw sources.** `onezero.fig`, `22.blend` and `laptop.mp4` are
  gitignored on purpose; the derived `.glb` is committed so the site still builds.

The build is also **deliberately diverging** from the original (dark palette, type behind the
subject, real-time shader shatter), which is what makes it the user's own portfolio piece
rather than a copy.

---

## 3. The design (decoded from `onezero.fig` — authoritative)

### 3.1 Canvas
Main artboard is the frame named **`1`** — **1600 × 1000 px** (landscape, desktop-first).
It sits inside a wrapper frame `site` (3400 × 1000) which also holds off-canvas scratch work.
Everything else on the page (`social`, `text`, `Internal Only Canvas`) is author notes /
credits, **not part of the site**.

### 3.2 Layer stack of frame `1` (top of list = back)

| Layer | Size @ pos | Notes |
|---|---|---|
| `kommers-...unsplash 1` | 2700×1518 @ (-550, 0) | photo background, IMAGE FILL |
| `kommers-...unsplash 4` | 1600×1000 @ (0,0) | linear gradient `#EDC5C1 → #F6E9E5` wash over photo |
| `Untitled 1` | 1600×1000 @ (0,0) | **hero 3D render** — shattered red sphere + black orbs |
| `06 04` (frame) | 1600×202 @ (0,0) | giant numerals band across the top |
| ├ `kommers-...unsplash 2` | 1600×202 @ (0,202) | strip image |
| ├ `06` | 403×238 @ (20,30) | Kulim Park Light, **340px**, lh 0.8, ls −4%, gradient `#FFF → #FFF @30%` |
| └ `04` | 415×238 @ (790,30) | same style |
| `text panel` (frame) | 978×120 @ (30,240) | |
| ├ `2` (frame) | 201×48 @ (0,0) | left eyebrow block |
| │  ├ `10x Faster Prototyping` | Manrope SemiBold **18px**, ls −4%, `#8B0000` |
| │  └ `bringing ideas to life in record time` | Manrope Regular **14px**, lh 1.2, `#8B0000` |
| └ `Discover Our New Projects from ©2025` | 208×120 @ (770,0) | Manrope Medium **36px**, lh 1.1, ls −4%, `#8B0000` |
| `right` (frame) | 220×960 @ (1360,20) | **glass side panel**, see §3.3 |
| `icon` (Union vector) | 50×50 @ (450,40) | logo mark, `#8B0000` |
| `Studio One.Zero` | 147×80 @ (600,40) | Manrope Medium **36px**, lh 1.1, ls −4%, `#8B0000`, 2 lines |
| `Validate And Evolve Ideas,\nFrom Concept — To 10.0,\nRapidly` | 154×51 @ (450,154) | Manrope Regular **14px**, lh 1.2, `#8B0000` |

### 3.3 Right glass panel (`right`, 220×960 @ 1360,20)
- `bg` frame stacking: `Rectangle 5` (`#D9D9D9`) → `Rectangle 6` (linear gradient
  `#FFFFFF → #FFFFFF @30%`) → `Untitled 3` (the 220×960 orb-column image) →
  `Untitled 2` (1081×676 @ −127,236, the hero sphere image cropped inside the panel).
- `link` frame (165×920 @ 35,20):
  - `Request A Prototype` — Manrope SemiBold 18px, ls −4%, `#8B0000` (top of panel)
  - `icon` row (102×30 @ 63,890) — 3 × 30px social glyphs, 36px pitch, `#8B0000` (bottom)
- Read as a frosted-glass rail: rounded, translucent white, image bleeding through.

### 3.4 Type
| Role | Family | Weight | Size | Tracking | Source |
|---|---|---|---|---|---|
| Display numerals (`06`, `04`) | **Kulim Park** | Light (300) | 340px | −4% | local `onezero/font/KulimPark-Light.ttf` (also Google Fonts) |
| Headings / logo | **Manrope** | Medium (500) | 36px | −4%, lh 1.1 | Google Fonts |
| Labels / CTA | **Manrope** | SemiBold (600) | 18px | −4% | Google Fonts |
| Body | **Manrope** | Regular (400) | 14px | −4%, lh 1.2 | Google Fonts |
| (credits only, not site) | Inter | Regular/Medium | 40–80px | — | Google Fonts |

**All site copy uses −4% letter-spacing.** Do not forget this; it defines the look.

### 3.5 Palette
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#8B0000` | **every piece of site text and every icon**. Dark red. |
| `--paper` | `#E9DAD6` | artboard base fill |
| `--wash-a` | `#EDC5C1` | gradient start over the photo |
| `--wash-b` | `#F6E9E5` | gradient end |
| `--glass` | `#FFFFFF` 100%→30% | numerals + right-panel gradient |
| `--panel` | `#D9D9D9` | glass panel base |
| `--black` | `#121212` | true black (component swatch) |
| Accents from the 3D art | coral/red `#F0504A`-ish + glossy black orbs | not tokens — they live in the render |

Brand accents used only in the social credits block (ignore for the site):
Behance `#0057FF`, TikTok `#F00044` / `#08FFF9`, Instagram gradient `#FFDD55 → #FF543E → #C837AB`.

### 3.5b Dark palette (OVERRIDES §3.5 — decided 2026-08-12)
The user wants a dark space/starfield background. This **inverts the Figma palette**:
`#8B0000` text on a near-black field is unreadable (contrast ≈ 1.4:1, fails WCAG badly).
The dark red survives only as a *glow/accent*, never as text. Proposed tokens:

| Token | Hex | Use |
|---|---|---|
| `--space-0` | `#07060B` | deepest background / page base |
| `--space-1` | `#120A14` | mid nebula falloff |
| `--space-2` | `#2A0E18` | warm nebula bloom near the subject |
| `--star` | `#FFF6F0` | starfield points, varying alpha |
| `--ink` | `#F5EDEA` | primary text (was `#8B0000`) |
| `--ink-dim` | `#F5EDEA` @ 55% | body / secondary text |
| `--display` | `#FFFFFF` @ 100%→18% | giant numerals, gradient fade (keeps Figma's idea) |
| `--accent` | `#F0504A` | coral/red from the render — glow, rules, hover |
| `--accent-deep` | `#8B0000` | shadow side of the accent, nebula tint |
| `--glass` | `#FFFFFF` @ 6%, blur 24px, 1px `#FFFFFF` @ 12% border | the right rail |

Keep the *structure* of §3.2/§3.3 exactly; only recolor. The layout is the design.

### 3.7 Text-behind-subject layering (from the user's samurai reference)
The reference (Katana Traffic) establishes the effect to reproduce: enormous display type
sits **between the background and the character**, with the character's silhouette occluding
the middle of the words. Depth order, back → front:

1. Starfield / nebula (deepest)
2. Loose foreground particles drifting *behind* the type
3. **Giant display type** (`06` / `04`, and later the wordmark)
4. **The 3D subject** — occludes the type
5. Sparks / shards / petals flying *in front of* the subject
6. UI chrome: nav, eyebrow copy, right glass rail, stats row

Implementation note: the type must live **inside the WebGL scene** (a plane or SDF text at a
known z), not in DOM — otherwise the 3D subject cannot occlude it and the effect collapses.

### 3.7b What to actually take from the samurai reference (scope confirmed 2026-08-12)

The user confirmed the reference is for **structure and type-behind-object only**. Take these
beats; take nothing else:

- **The hero is a rounded-corner card inset from the page edge**, not a full-bleed viewport.
  The page background outside the card is a deeper gradient of the same family, so the card
  reads as floating. This is a genuinely useful structural idea our Figma doesn't have.
- **Nav across the top of the card**: small logo mark far left, a short row of centered text
  links, one bordered CTA button far right. Our §3.2 already has the logo, the wordmark and
  `Request A Prototype` — map ours onto this arrangement.
- **The display type is the largest thing on screen**, set on two lines, running nearly edge to
  edge and **clipped by the card bounds**. The subject stands centered and occludes its middle.
- **Bottom-left stat pair, bottom-right social cluster.** We have the equivalents already —
  the `06`/`04` numerals and the 3-icon row from §3.3. Use ours.
- **Lighting**: a warm radial glow behind the subject, strongest low and centered, with the
  corners falling off to near-black vignette. Matches the `Material.001` emission in §5d.
- **Particles drift both behind and in front** of the subject, selling the depth.

❌ **Explicitly NOT taken:** the samurai/katana subject matter, the brush-script lettering, the
red-and-white Japanese motif, the Katana Traffic name. Our subject is the shattered sphere and
our display face is **Kulim Park Light** per §3.4.

### 3.8 Copy inventory (exact strings — all PLACEHOLDER, user will rewrite)
- `Studio` / `One.Zero`
- `Validate And Evolve Ideas,` / `From Concept — To 10.0,` / `Rapidly`
- `10x Faster Prototyping`
- `bringing ideas to life in record time`
- `Discover Our New Projects from ©2025`
- `Request A Prototype`
- `06`, `04`

---

## 4. How to re-read the Figma file (no Figma account needed)

`onezero.fig` is a ZIP containing `canvas.fig` (Figma "kiwi" binary). Block 0 = schema
(raw deflate), block 1 = data (**zstd**). `design-reference/decode-fig.py` already handles this.

```bash
cd /tmp && rm -rf figx && mkdir figx && cd figx
unzip -o "/Users/michaelthompson/Desktop/3D website /onezero/onezero.fig"
pip3 install --user zstandard          # only dependency
python3 "/Users/michaelthompson/Desktop/3D website /design-reference/decode-fig.py" canvas.fig canvas.json
```
Then query `canvas.json` (`nodeChanges` array: `name`, `type`, `size`, `transform`,
`fillPaints`, `fontSize`, `fontName`, `letterSpacing`, `parentIndex`).
Images live in `images/` inside the zip, keyed by the SHA-1 in each fill's `image.hash`.

**Already done** — the decoded output is checked in at `design-reference/figma-canvas.json`,
so read that before re-decoding.

---

## 5. The 3D side — `22.blend` contents (inspected 2026-08-12, without Blender)

The file is **uncompressed Blender 4.4, 64-bit LE** (`BLENDER-v404`), 21.8 MB, 64,551 blocks.
Parsed straight from the block table + ID names. **This is confirmed to be the hero
shattered-sphere scene**, not a laptop scene:

| ID | Count | Detail |
|---|---|---|
| Objects (`OB`) | **2122** | **2100 × `cell_cell*`** (Cell Fracture shards) · 2 `Sphere` · 2 `core` (the black orb) · 2 `fly` · 12 `Area` · 2 `Camera` · 2 `BézierCircle` |
| Meshes (`ME`) | 2106 | ~14 MB of raw mesh DATA total |
| Materials (`MA`) | 4 | `cell`, `fly`, `lines`, `Material.001` |
| Lights (`LA`) | 12 | all Area lights |
| Cameras (`CA`) | 2 | `Camera.001`, `Camera.002` |
| Curves (`CU`) | 2 | `BézierCircle` ×2 — almost certainly camera-orbit paths |
| Actions (`AC`) | 4 | `Sphere.001Action`, `Geometry Nodes.003Action` — **the scene is animated** |
| Node trees (`NT`) | 3 | `Geometry Nodes.003`, `.004`, `Smooth by Angle` |
| Scenes / Worlds | 2 / 2 | two variants of the setup |

### 5b. ✅ VERIFIED IN BLENDER 2026-08-12 — this supersedes the guesses above

The scene was opened headlessly (`blender -b 22.blend --python …`) and measured. **Three of the
earlier assumptions were wrong.** Trust this subsection over anything above it.

| Question | Earlier guess | **Measured reality** |
|---|---|---|
| Total geometry | "2100 draw calls, single-digit FPS" | **209,509 triangles for the entire scene** (shards ≈ 140k). Trivial for WebGL — the tri count was never the problem, only the draw calls. |
| Do shards share topology? | "maybe → InstancedMesh" | **No.** 2100 unique mesh datablocks, **341 distinct topologies**. `InstancedMesh` is off the table. |
| Are the shards animated? | "the scene is animated" (4 actions) | **Zero shards have keyframes.** Only `fly` + `fly.006` are animated (a Follow-Path orbit and a rotation). **VAT is pointless** — there is no per-shard sim to bake. |
| Geometry Nodes | "on everything, must bake" | 2106 of the 2108 `NODES` modifiers are just **`Smooth by Angle`** — Blender 4.1+'s auto-smooth-normals replacement, not procedural geometry. It exports fine. |
| Materials | "procedural, rebake to PBR" | **4 plain Principled/Emission BSDFs, zero textures, zero procedural nodes.** They map straight onto glTF PBR. Exact values in §5c. |

**The two real Geometry Node graphs** (`Geometry Nodes.003` / `.004`) sit only on `Sphere` and
`Sphere.001`. They pull the shard collection via `COLLECTION_INFO` and drive
`ROTATE_INSTANCES` + `SCALE_INSTANCES` from a `PROXIMITY` falloff → `MAP_RANGE` → `VALTORGB`.
**That graph *is* the shatter effect**, and the whole thing is animated by three fcurves on one
`Transform Geometry` vector input over frames 1–250. So the explosion is driven by a *single
moving point* — which is exactly what makes it cheap to reproduce in JS.

### 5c. ✅ THE SHARD STRATEGY — merged mesh + vertex shader

Not join-static, not InstancedMesh, not VAT. **Merge all 2100 shards into one `BufferGeometry`**,
carrying two extra per-vertex attributes:

- `aShardCentroid` (vec3) — the shard's own centre, so the shader knows what to push away from
- `aShardIndex` / `aShardRandom` (float) — for per-shard rotation, delay and jitter

Then displace in a custom vertex shader against a scroll uniform, reproducing the proximity
falloff the Blender graph does. Result: **1 draw call, ~140k tris, full scroll-driven shatter,
no texture bake.** This beats all three earlier options and is the plan of record.

### 5d. Measured material values (use these directly — no bake needed)

| Material | Base color (linear) | Metallic | Roughness | What it is |
|---|---|---|---|---|
| `cell` | `0.839, 0.048, 0.017` | 0.709 | 0.595 | the red shards |
| `fly` | `0.010, 0.010, 0.010` | 0.0 | **0.0** | the glossy black orbs |
| `lines` | `0.831, 0.058, 0.000` | 0.682 | 0.843 | the red wireframe cage |
| `Material.001` | **Emission** `1.0, 0.271, 0.144` @ strength **10.0** | — | — | the coral glow → drive Bloom off this |

Note the emission color `#FF4524`-ish confirms `--accent` `#F0504A` in §3.5b is the right pick.

### 5e. Scene facts worth keeping

- **Two scenes.** `Scene` renders **1600×1000** through `Camera` (100 mm, loc `-4.00, 2.94, 3.35`,
  rot `1.12, 0, -2.21`) — that is the hero artboard size from §3.1, so this camera *is* the
  Figma hero framing. `Scene 2` renders **220×960** through `Camera.001` (100 mm, straight down
  the Z axis at `z=20.38`) — **220×960 is exactly the right glass panel** from §3.3, so the
  orb-column image was rendered from this camera. Reuse both framings.
- `Sphere` carries SUBSURF + DECIMATE + **WIREFRAME** → 63,488 tris — it is the red wire cage,
  and it is the single heaviest object in the scene. Decimate harder if the budget tightens.
- Shard bounds are a **unit sphere, radius ≈ 1.0** (`min -0.99,-0.99,-1.0` / `max 0.99,0.99,1.0`).
  Convenient: the explosion rig can assume radius 1 and scale at the group level.
- World background is a `TEX_SKY` node in both scenes — irrelevant, we replace it with the
  §3.5b starfield.
- Renderer is Cycles, 250 frames. `fly` follows a Bézier path — that orbit is worth keeping as
  scroll-driven motion.

### 5f. ✅ THE EXPORT IS DONE (2026-08-12) — `export/hero.glb`

Step 3 of §0 is complete. `tools/export_glb.py` produces everything; re-run it any time:

```bash
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b "onezero\blender\22.blend" --factory-startup --python "tools\export_glb.py"
```

**⚠️ There are only 700 shards in the hero, not 2100.** The file holds **three** copies of the
shard collection — `cell` (700, in `Scene`), `cell.001` (700, in `Scene 2`) and `cell.003`
(700, **linked to no scene at all**). The hero's `Sphere` instances **`cell.003`**. The 2100
figure in §5 counted all three duplicates. Export only `cell.003`.

#### What came out

| File | Size | Use |
|---|---|---|
| `export/hero.draco.glb` | **1.13 MB** | **ship this** — Draco compressed, 8.2× smaller |
| `export/hero.glb` | 9.30 MB | uncompressed fallback if Draco ever misbehaves |
| `export/hero.meta.json` | 6.5 KB | camera, orbit samples, shatter constants, material values |
| `export/check_{A,B,C}_*.png` | — | the verification renders described below |

#### The 4 meshes (4 draw calls, 112,883 tris)

| Node | Tris | Material | Notes |
|---|---|---|---|
| `shards` | 44,471 | `cell` | the 700 merged shards, **flat shaded**, world space, rest pose (intact shell, radius ≈ 0.99) |
| `wire_cage` | 63,488 | `lines` | `Sphere` with its geo-node instancers disabled — subsurf+decimate+wireframe only. **The heaviest object in the scene** — first thing to cut if the frame budget tightens |
| `core` | 960 | `Material.001` | the emissive coral core, smooth |
| `orb` | 3,968 | `fly` | the black orb, **centered at the origin** — JS drives its orbit. Radius ≈ 0.1558 |

#### The custom attributes (this is the whole trick)

`shards` carries two extra vertex attributes, and **they survive Draco compression** — verified:

| glTF | three.js | Meaning |
|---|---|---|
| `_SHARDC` | `geometry.attributes._shardc` | vec3 — the shard's own centroid, rest pose |
| `_SHARDR` | `geometry.attributes._shardr` | float 0–1 — stable per-shard random, for jitter/delay |

⚠️ **Rename these in JS before use.** A GLSL attribute named `_shardc` is legal but ugly and
some minifiers choke; do `geometry.setAttribute('aShardC', geometry.attributes._shardc)` on load.

#### The shatter, transcribed from the node graph — ✅ verified correct

The Blender effect is **not** an explosion. A black orb orbits the shell, and shards near it
**tumble and shrink to nothing**, exposing the wire cage beneath. Per shard:

```glsl
float d    = max(distance(shardCentroid, orbPos) - 0.1558, 1e-6); // to the orb SURFACE
float f    = 0.2 / d;
float ramp = clamp((0.8068 - f) / (0.8068 - 0.3955), 0.0, 1.0);    // 1 = intact, 0 = gone
float ang  = 14.1 * (1.0 - ramp);                                  // same angle on x, y, z
// pos = rotateXYZ(pos - shardCentroid, ang) * ramp + shardCentroid;
```

Distance thresholds that fall out of it: **fully gone below 0.248**, **fully intact above 0.506**.
The whole shell also spins — euler `(0, -0.0332, -0.733)` at frame 1 → `(0, -0.9547, -0.733)` at
frame 250. Apply that before the shatter. Scroll should drive both the orb position and the spin.

**Verification (`tools/verify_shatter.py`)**: this math was applied in numpy to the merged mesh
and rendered as `check_C_shatter_math.png`, then compared against `check_A_original.png` (the
untouched geo-node scene). Same dissolve zone, same exposed cage, same tumbling boundary.
The hole in C is slightly larger than A because Blender measures proximity to the orb's actual
mesh surface and to each shard's *object origin*, while we approximate with a sphere radius and
the bbox centroid. **Tune `k = 0.2` in the browser to close the gap** — everything else matches.

#### Loading it in R3F

Draco needs a decoder. `useGLTF(url, true)` enables it, but **self-host the decoder** rather
than relying on the default CDN — copy `node_modules/three/examples/jsm/libs/draco/` into
`public/draco/` and point `useGLTF.setDecoderPath('/draco/')` at it.

Move `export/*.glb` to `public/models/` when the site is scaffolded.

#### Deliberately not exported

Lights and cameras (we light and frame in Three.js — values are in `hero.meta.json`), the
`Scene 2` duplicates, and the geometry-node graphs. `TEXCOORD_0` rides along unused; harmless.

### Other 3D assets
- `laptop.mp4` (12 MB) — pre-rendered animation. `ffprobe` still not installed so
  resolution/duration are unknown. Useful as a poster/fallback and as motion reference.
- `hero-shattered-sphere-3200x2000.png` — a still from this scene. **Use it as the LCP poster
  behind the canvas** so the hero paints instantly while the `.glb` streams in.

---

## 6. Direction — ANSWERED by the user 2026-08-12

| # | Question | Answer |
|---|---|---|
| 1 | Static render vs real WebGL? | **Real WebGL 3D, Three.js, from the `.blend`** |
| 1a | Parallax scope | Parallax/scroll must **flow from the hero on into the other sections**, one continuous scene — not per-section islands |
| 2 | Page structure | **Single hero leading into a scroll** (multi-section, one page) |
| 3 | Framework | User asked for **two recommendations** → see §10 |
| 4 | Responsive | **Landscape/desktop first.** Mobile is a separate later phase — do not spend effort on it now |
| 5 | Copy | User will rewrite all text later. **Leave the Figma placeholder copy in for now**, but drive every string from one content file so a rewrite is a single-file edit |

Background is now **dark space + stars** (§3.5b) with display type **behind** the subject (§3.7).

### Still genuinely open
- Which shard strategy — join, instance, or VAT (§5)? Recommend **instance**.
- Does `Request A Prototype` link anywhere real yet? Are the 3 social icons real URLs?
- Is `Studio One.Zero` the final brand, or does that change with the copy rewrite?

---

## 9. ✅ Toolchain — UNBLOCKED (re-verified on the Windows desktop 2026-08-12)

Every hard blocker is gone. Measured on the new machine:

| Tool | Status | Notes |
|---|---|---|
| **Blender** | ✅ **5.2.0 LTS** | at `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` — **not on PATH**, always call the full quoted path |
| **Node / npm** | ✅ **v21.6.2 / npm 10.5.0** | Vite is good to go |
| **Python** | ✅ **3.12.1** | the `.fig` decoder still runs if ever needed |
| **Git** | ✅ **2.43.0** | repo still not initialized — do it |
| **ffmpeg** | ❌ absent | only needed to inspect `laptop.mp4`; low priority |

⚠️ **Blender 5.2 vs the file's 4.4.** `22.blend` was authored in 4.4 and opens forward cleanly,
but this is a major-version jump — geometry-node and material behaviour can shift. It read
correctly during the §5b inspection, so this is a watch-item, not a problem. **Never save over
`22.blend`** — a 5.2 save cannot be reopened in 4.4. Export to a *new* file only.

The old "zero-install CDN fallback" note is obsolete now that Node is present.

---

## 10. ✅ Framework — DECIDED: Option A (user picked 2026-08-12)

> **Vite + React Three Fiber.** The user chose Option A on arrival at the desktop machine.
> The comparison below is kept for context; **no further discussion needed — build with A.**
> Packages: `react` · `@react-three/fiber` · `@react-three/drei` ·
> `@react-three/postprocessing` · `lenis`.

### The comparison as it was presented

Both options assume Vite as the dev server/bundler. **Next.js was considered and rejected:**
a single WebGL page gets no SSR or SEO benefit from it, and its App Router adds
client/server boundary friction around a canvas that is 100% client-side.

### Option A — Vite + React Three Fiber ✅ *recommended*
`react` · `@react-three/fiber` · `@react-three/drei` · `@react-three/postprocessing` · `lenis`

Maps 1:1 onto what the user asked for:
- `<Stars>` from drei — the space background, essentially free
- `<ScrollControls>` + `useScroll` — built precisely for one continuous scene that carries
  parallax across sections (answer 1a)
- Layering type behind the subject (§3.7) is just JSX order + z — trivial to re-tune
- `<Bloom>`/`<Vignette>` give the glow around the coral accent
- `gltfjsx` auto-generates a typed component from the `.glb`
- Text as JSX/content-file props → the user's later rewrite is a one-file edit (answer 5)

Cost: ~400 KB JS baseline; React reconciliation sits between you and the render loop.

### Option B — Vite + vanilla Three.js
`three` · `gsap` + `ScrollTrigger` · `lenis`

- Leanest bundle (~150 KB) and the best raw frame budget — matters with 2100 shards
- Total control of the render loop, no abstraction to fight on custom shaders
- GSAP ScrollTrigger is the industry standard for scrub-linked scroll timelines

Cost: you hand-write the starfield, the scroll sync, and all layering; every layout tweak is
imperative code, so iteration is materially slower.

**Verdict: Option A.** The asks (stars, continuous scroll parallax, text-behind-subject,
easily-swapped copy) are all things drei already solves. Option B's perf edge is real but the
shard problem is solved at *export* (§5), not by the framework.

---

## 7. Working agreements

- **Always quote the project path** — the folder name ends with a space.
- Design fidelity matters more than convenience here. Match the exact sizes, layout and the
  −4% tracking from §3. Colors now come from **§3.5b (dark)**, not §3.5.
- ~~The website must use every asset in the folder~~ **RETRACTED by the user 2026-08-12:**
  *"not every asset should be used."* Use what serves the design. The `.blend` scene and the
  Kulim Park font are core; `laptop.mp4`, the duck/petals image and the brain image are
  **optional** and should only appear if they genuinely earn a place. Do not contort the
  layout to find them a home.
- All visible copy is **placeholder**. Drive every string from a single content file so the
  user's later rewrite touches one place.
- Prefer editing existing files over adding new ones; keep `design-reference/` read-only.

---

## 8. Changelog

- **2026-08-10** — Folder audited. `onezero.fig` reverse-engineered and fully decoded;
  design spec (§3), assets and decoder committed to `design-reference/`. No site code yet.
- **2026-08-12** — Direction locked (§6): real WebGL, single-page scroll, dark starfield,
  text behind subject, desktop-first, placeholder copy. `22.blend` parsed without Blender —
  confirmed as the shattered-sphere scene, **2100 cell-fracture shards** flagged as the
  central perf risk (§5). Toolchain audit: Blender, Node, Homebrew all missing (§9).
  Framework options written up (§10); recommending Vite + React Three Fiber.
- **2026-08-12 (end of session)** — **Handoff written (§0).** Project transferring to Claude
  Desktop; user is installing Blender + Node there. Still zero site code. Outstanding on
  arrival: pick the framework, verify the toolchain, then export the `.glb`.
- **2026-08-12 (arrival on Windows desktop)** — Transfer complete; root path corrected (nested
  one level, §1). **Toolchain verified: Blender 5.2.0 LTS, Node 21.6.2, npm 10.5.0, Python
  3.12.1, Git 2.43** — all prior blockers cleared (§9). **User picked Option A, Vite + React
  Three Fiber** (§10). `22.blend` opened headlessly in Blender for the first time and measured
  (§5b–§5e): scene is **209,509 tris total**, shards have **341 distinct topologies and zero
  keyframes**, the "geometry nodes everywhere" are 2106 × `Smooth by Angle`, and the 4 materials
  are plain BSDFs with no textures. **This disproved the InstancedMesh and VAT strategies and
  the "rebake materials" requirement.** New plan of record: merge shards to one `BufferGeometry`
  with per-shard attributes, explode in a vertex shader (§5c). Still zero site code.
- **2026-08-12 (export session)** — User retracted the "use every asset" rule and confirmed the
  samurai reference is **structure + type-behind-object only** (§3.7b, §7, §11). **Step 3 done:
  `export/hero.draco.glb` shipped at 1.13 MB / 4 draw calls / 112,883 tris** (§5f). Discovered
  the file holds **three** duplicate shard collections — the hero uses `cell.003`, so it is
  **700 shards, not 2100**. The geo-node graph was decoded: the "shatter" is an orbiting orb
  that makes nearby shards tumble and shrink, exposing the wire cage — transcribed to shader
  math and **verified against a reference render** (`check_A` vs `check_C`). `tools/` added.
- **2026-08-12 (scaffold session)** — **First site code exists.** Vite + React 19 + R3F 9 +
  drei 10 + postprocessing 3 + three 0.182 + Lenis, running on 5173, production build clean.
  Hero is live: starfield, motes, the `06`/`04` numerals inside the scene, the shatter shader
  driven by scroll, the frosted rail, three scroll sections. Three real bugs found and fixed by
  verification — the `_SHARDC` coordinate space, the `core002` node-name collision, and the
  spin-matrix basis change (**§12.2**). **Not yet judged by eye** — see §12.4. Still no `git init`.
- **2026-08-16 (live)** — **Deployed to
  [michaelthompsondev.netlify.app](https://michaelthompsondev.netlify.app/)** and verified on
  the live host. All copy written: About and Interests from the user's own four interests,
  Skills derived from the three real projects, contact address
  `michael.dev.0365@gmail.com` (a dedicated account chosen over the personal one, since
  anything on a public page gets scraped), role confirmed as Creative Developer. **Zero
  placeholder chips remain.** The Watchers and Soccer Star Styles were added from repo-derived
  breakdowns (§13.5 prompt) — **both repos are private**, verified with `gh repo view`, so
  both cards ship with no code link rather than one that 404s. `public/og.png` generated from
  the real scene at 1200×630, framed wider than the live hero so the wordmark stays readable
  in a static preview.
- **2026-08-13 (art direction round 2)** — Five requested changes, each verified by
  rendering and looking (§12.6): scroll/scene motion damped, subject given idle motion,
  `06`/`04` removed, a **brush-painted `MICHAEL THOMPSON` backdrop** added behind the
  subject (§12.7), and the starfield replaced with a coloured glowing point shader.
  Cleanup: deleted `DisplayType.jsx`, the `TYPE` config, the second particle system,
  the now-unused Kulim Park font, and the 932 KB Draco **encoder** that was being
  copied into `public/` for no reason. r3f bundle 686 → 566 KB.
- **2026-08-12 (flatten + publish)** — **Project flattened**: root is now
  `…\Desktop\3D website` (was nested one level), `__MACOSX` deleted, colliding outer `.claude`
  permissions merged and the stray 89-byte `package-lock.json` stub removed. `npm run dev` runs
  from the root. Hero art-directed in the browser (§12.4). **User clarified the origin: the
  concept and files came from [@Bachynskyi_ui](https://www.instagram.com/bachynskyi_ui/), who
  gave them to him directly** — so this is a sanctioned adaptation, and §2 now carries the
  credit rules. `prebuild` added so clean-checkout builds work. **`git init` + first commit +
  pushed public** to `thompmic/shattered-sphere-webgl` (29 files, 2.1 MB; his raw sources
  gitignored). Goal restated by the user: **this is a personal portfolio site.** Not deployed yet.

---

## 12. The site (scaffolded 2026-08-12)

```bash
npm install
```

```bash
npm run dev
```

Run these **from the project root** (`…\Desktop\3D website`) — and note PowerShell 5.1 has no
`&&`, so they are two commands, not one.

`npm run assets` copies the `.glb`, the Kulim Park TTF and the Draco decoder into `public/`.
**It must run after every re-export.** `public/` is gitignored because it is entirely
generated; `prebuild` runs the same script automatically so `npm run build` works from a clean
checkout (which is what makes CI/Vercel deploys work). Vite serves on **5173**; the production
build is clean at ≈406 KB gzipped JS + the 1.1 MB model.

### 12.1 Layout

| File | What it owns |
|---|---|
| `src/content.js` | **every visible string.** §6 answer 5 — the copy rewrite touches this file only |
| `src/config.js` | **every tunable number**, each marked `MEASURED` (from Blender — changing it breaks fidelity) or `TASTE` (dial freely) |
| `src/scroll.js` | one Lenis instance; exposes a plain `scroll.progress` object read inside `useFrame` rather than React state, so scrolling never re-renders the canvas tree |
| `src/scene/Stage.jsx` | the `<Canvas>`, camera rig, lighting, bloom/vignette, perf monitor |
| `src/scene/Subject.jsx` | loads the glb, wires the shatter uniforms to scroll |
| `src/scene/shatterMaterial.js` | the vertex-shader patch — the heart of it |
| `src/scene/NameBackdrop.jsx` | the painted name plane, **inside the scene** so the subject occludes it |
| `src/scene/inkTexture.js` | generates the brush-and-drips texture on a canvas |
| `src/scene/Starfield.jsx` | the coloured glowing star shader |
| `src/ui/Chrome.jsx` | nav, hero copy, frosted rail |
| `src/ui/Sections.jsx` | Work / About / Skills / Interests / Contact |
| `src/ui/Todo.jsx` | dev-only placeholder chip |
| `src/styles.css` | §3.5b tokens, the inset card, all layout |

### 12.2 Three things that were wrong and are now right

Each was found by verification, not by reading code — repeat the checks if you re-export.

1. **`_SHARDC` was in the wrong coordinate space.** glTF's `export_yup` rotates `POSITION`
   and `NORMAL` into Y-up but passes **custom attributes through untouched in Blender Z-up**.
   The shader would have silently produced garbage. `tools/export_glb.py` now pre-rotates the
   centroid; `tools/` has the check that proves it.
2. **The node was called `core002`, not `core`.** Blender's object namespace is global, so
   baking an object named `core` when one already exists yields `core.002`, which glTF
   sanitises to `core002` — and `nodes.core` comes back `undefined`. All exported nodes are
   now prefixed `hero_`, and the exporter **raises** on any name collision.
3. **A rotation does not survive a basis change by copying its components.** The shell spin is
   authored as a Blender euler and must be conjugated: `R_three = M · R_blender · Mᵀ`. Done in
   `spinMatrix()`. Getting this wrong spins the shell about a plausible-looking wrong axis.

### 12.3 Verified

Shader compiles with zero errors; Draco preserves `_shardc` / `_shardr` through the runtime
decoder (700 distinct randoms, centroids on the unit shell); all four `hero_*` nodes resolve;
Kulim Park parses and troika preloads the numerals in ~150 ms; production build is clean.

### 12.4 The art-direction pass that was done, and what is left

The hero **has** now been looked at in the browser at 1440×900. Four things were wrong on
first sight and are fixed; the reasoning is worth keeping because it generalises:

1. **The subject ate the frame.** At `CAMERA.position.z = 11.2` the sphere filled ~79% of the
   height and swallowed both numerals. Now `14.5`, ~60%. Note the useful property: the type
   sits on its own plane at `TYPE.z`, so moving the camera rescales the *subject* without
   rescaling the *type* — that is the dial for the §3.7b balance.
2. **The starfield was invisible.** Both point clouds were mounted and `visible: true` the
   whole time — they were simply sub-pixel. A 20° telephoto sees a tiny cone, so drei's
   default `radius`/`factor` put nothing on screen. Now `radius 18 / factor 5`, and the motes
   went `0.035 → 0.085`. **If the fov ever changes, re-tune these.**
3. **The tagline landed on top of the `06`.** §3.2 puts that block at x=450 on the artboard,
   which is deliberately to the *right* of the numeral (x 20–423). Anchoring it to the left
   edge of the card instead dropped it straight onto the digit. It is now positioned by
   artboard fraction (28.1% / 15.4%), which also keeps it right as the viewport changes.
4. **The whole card read as a red gradient, not as space.** The CSS nebula was too broad.
   Tightened so the corners fall to `--space-0` and the warm bloom stays local to the subject.

Bloom was also pulled back (`intensity 0.85 → 0.6`, `threshold 0.55 → 0.72`) because the
emissive core blows out the moment the shell opens, and a rim light was added — without one
the dark shell dissolves into the dark ground.

**Still worth a look by eye:**

- The lower sections put body copy straight over the subject; it reads, but only just.
  Either darken behind the text or push the subject aside as `scroll.progress` grows.
- `SHATTER.k` — our dissolve hole is a little larger than Blender's (§5f explains why).
- `SHATTER.burst` / `SCROLL.cameraDrift` — how violently the shell flies apart on scroll.
  At full scroll it is dramatic; possibly too much.
- The right rail is tall and mostly empty between the CTA and the social row.
- `hero.meta.json` still holds the exact off-axis Blender framing if you ever want the
  Figma crop rather than the straight-on reference structure.

### 12.6 Art direction round 2 (2026-08-13)

Five changes, each verified by rendering and looking at the result.

1. **Motion is damped.** The scene read Lenis's scroll position raw, so every wheel
   event landed on the camera and the shader as a step. `scroll.js` now exposes
   `target` (raw) and `value` (damped) — **the scene must read `value`**. Damping is
   exponential and frame-rate independent, and `dt` is clamped so a backgrounded tab
   cannot teleport the scene on return. The shatter ramp is also eased with
   smoothstep; Blender's ramp is linear and its hard boundary popped as the orb swept
   past. The subject has idle sine motion so it is never completely static.
2. **`06` / `04` are gone**, along with `DisplayType.jsx`, the `TYPE` config and the
   Kulim Park font. They were the source design's, not the user's.
3. **A painted name replaces them** (§12.7).
4. **The starfield is coloured and glowing** — a small custom point shader replaced
   drei's `<Stars>`, which is monochrome and scatters over a full sphere. With a 20°
   telephoto that put nearly every point off-screen. Also **shrank the r3f bundle from
   686 KB to 566 KB** (gzip 219 → 175 KB).
5. **`PerformanceMonitor`** steps DPR down only when frames actually drop.

### 12.7 The painted name — how it is made

`inkTexture.js` paints `MICHAEL THOMPSON` onto a 2048×1024 canvas and hands it to a
plane at `NAME.z`, behind the subject. Three things worth knowing before editing it:

- **The brush character is generated, not from a font.** Free brush faces are thin
  handwriting; the reference look is a loaded brush dragged across paper. So a heavy
  condensed base (Anton) is skewed, then eroded in three passes: striations along the
  stroke direction, fine speckle, and bites out of the silhouette.
- **The bites use real edge detection** on the rendered alpha. Scattering them at
  random leaves the outline intact and just pits the middle — which still reads as a
  bold font behind a texture. Finding the edge pixels is what tears the letters.
- **The balance is delicate.** Strokes must stay mostly solid. Pushing `speckle` or
  `edgeBites` much past the values in `config.js` turns the interiors to camouflage.
- Drips are derived from the ink: the alpha is read back to find the lowest painted
  pixel per column, so runs hang off real stroke ends. Erosion is **seeded**, so the
  name is identical on every reload rather than reshaping itself each visit.

⚠️ **Two font-loading traps, both of which silently fall back to a serif:**
`document.fonts.load()` resolves with an **empty array, not an error**, when the
@font-face rules are not in the CSSOM yet; and `check(spec)` **without text samples a
space**, which for a Google face served as many unicode-range subsets is in a subset
never fetched for Latin text — so the bare check reports false forever. There is also
an off-screen `.brush-preload` span, because a font only ever drawn into a canvas can
sit unfetched: `fonts.load()` alone is not a reliable trigger.

### 12.8 Load performance (2026-08-16)

Measured, not guessed. Two independent problems, two independent fixes.

**1. The wire cage was 57% of the model.** `tools/glbsize`-style inspection of the
per-primitive Draco bufferViews: `hero_cage` was **624 KB of a 1105 KB file** — more
than the 700 shards themselves — for geometry only ever glimpsed through the
dissolve hole. The Wireframe modifier turns every edge into an 8-triangle tube, so
cost is `(base polys x 4**SUBSURF) x 8`. Dropping `CAGE_SUBSURF` from 2 to 1 is a 4x
cut (63,488 -> 15,872 tris) and, rendered at the size it actually appears, **looks
better** — the grid now reads as a wireframe instead of a dense white blur.

    model 1105 KB -> 643 KB   (-42%)
    scene 112,883 -> 65,267 tris

**2. The 3D engine blocked first paint.** `App.jsx` statically imported `Stage.jsx`,
so three + drei + postprocessing (~347 KB brotli, ~1.2 MB parsed) had to download AND
execute before React rendered a single DOM node. `Stage` is now `React.lazy`, which
takes the **entry chunk from ~1.29 MB raw to 33 KB** (11 KB gzip). Vite still emits
`modulepreload` for the 3D chunks, which is what you want: a hint, not a blocking
dependency, so they download in parallel without holding up the paint. Verified in
dev — DOM content is present at 481 ms while three/fiber/drei land at 700–745 ms.

The canvas now fades in on a `data-ready` flag set when the model has actually
decoded (`Subject` sits behind Suspense, so reaching its effect proves it), instead
of appearing in a single frame.

⚠️ **Do not "optimise" the `<link rel="preload" as="fetch">` for the glb.** It looks
like a candidate for a credentials-mode mismatch that would double-fetch 643 KB;
it was checked, and there is exactly **one** request, `initiatorType: "link"` — the
loader reuses the preload.

Still available if load time ever matters more: `draco_decoder.js` (500 KB) ships but
is never fetched by a wasm-capable browser, and the shards themselves are now the
floor at 461 KB.

### 12.5 Known gaps

- **Mobile is untouched** — deliberate (§6 answer 4). The `@media (max-width: 900px)` block
  only stops the page breaking; it is not the mobile design.
- **No loading state.** The 1.1 MB glb streams in behind a `Suspense fallback={null}`, so the
  hero pops. §5 suggests `hero-shattered-sphere-3200x2000.png` as an LCP poster — still worth doing.
- **The wire cage is 63,488 tris**, over half the scene. First thing to cut if perf bites.
- **No `laptop.mp4`, duck/petals or brain imagery** — optional per §7, and none of them earned
  a place yet.
- `public/draco/draco_decoder.js` (500 KB) is the **non-wasm fallback** and is never fetched by
  a modern browser — confirmed at runtime. It costs deploy size, not user bandwidth. The
  932 KB `draco_encoder.js` **was** being copied and is now not: the site decodes, never encodes.

---

## 13. Where this is going — full personal portfolio (stated by the user 2026-08-12)

> *"I will improve the webpage and adapt it to a full personal portfolio showcasing my other
> projects, about me, and my LinkedIn and socials and interests — everything a personal
> portfolio must have."*

**This reframes the project.** Everything before §13 treats the shattered sphere as *the*
site. It is now **the hero of a larger portfolio** — the thing that makes someone scroll,
not the whole product. Read the §3 design spec in that light: it governs the hero, and the
sections below it are new design work, not decoded from the Figma file.

### 13.1 What still holds

- The hero, the shatter shader, the dark §3.5b palette, the −4% tracking, the inset card, the
  Kulim Park / Manrope pairing. **These become the design system** for everything added.
- The continuous-scroll rig (§6 answer 1a) already carries the 3D behind lower sections, which
  is exactly what a portfolio wants — the sphere should keep reacting as you read.
- `src/content.js` already drives every string, so new sections are content entries, not new
  components, wherever possible.

### 13.2 What a personal portfolio needs that this does not have

| Piece | Status | Note |
|---|---|---|
| Hero / identity | ✅ built | but the copy is still Figma placeholder — it says "Studio One.Zero", not the user's name |
| About | ❌ | who he is, what he does, what he's good at |
| Projects / work | ❌ **the core of it** | needs real projects with title, role, stack, outcome, links, and ideally a thumbnail each |
| Skills / stack | ❌ | |
| Experience or education | ❌ | optional depending on how he wants to read |
| Interests | ❌ | user asked for it specifically |
| Contact + socials | ⚠️ partial | the rail has 3 placeholder glyphs pointing at `#`. Needs real LinkedIn + GitHub + others |
| Resume/CV download | ❌ | conventional, worth offering |
| Meta: real `<title>`, description, OG image, favicon | ❌ | currently "Studio One.Zero" placeholder |
| Accessibility pass | ⚠️ | reduced-motion is handled; focus states, contrast and canvas-free fallback are not |
| Mobile | ❌ | deferred (§6 answer 4) — **no longer deferrable** for a portfolio; recruiters open links on phones |
| Deployment | ❌ | build is deploy-ready (§0 step 8), just not live |

### 13.3 ✅ Structure built 2026-08-12 — now waiting on content

The portfolio skeleton exists: **Work → About → Skills → Interests → Contact**, plus a footer.
Everything is wired to `src/content.js`, so filling it in is a one-file job.

- **The site now carries the user's name**, not "Studio One.Zero". `identity.name` is
  `Michael Thompson` (taken from git config); **`identity.role` is a TODO** — nobody has said
  what his actual title is.
- **`todo: true` in `content.js` renders an amber TODO chip** next to the placeholder, in dev
  only. `src/ui/Todo.jsx` early-returns on `import.meta.env.DEV`, so the whole thing is
  tree-shaken from production — **verified by grepping the built bundle**. 21 chips currently.
- **No link points at `#`.** Socials with no URL render as visibly disabled rather than as
  dead links, so nothing looks finished when it is not.
- **Mobile is done** (§13.2 said it was no longer deferrable): hamburger nav that opens,
  updates `aria-expanded` and closes on navigate; rail hidden; no horizontal overflow at 375px.
- **A11y**: skip link, `:focus-visible` rings, `sr-only` labels, reduced-motion honoured.
- Real `<title>`, description, OG tags and an SVG favicon. **`og:image` is deliberately absent**
  rather than pointing at a file that does not exist — add it after the first deploy.
- The subject now **drifts right and back** as you scroll (`SCROLL.subjectDrift`) and each
  section carries its own scrim (`.panel`), because body copy over the lit sphere was only
  just legible. Both were needed; the drift alone was not enough.

⚠️ **Two things could not be verified**, because the browser pane stopped compositing and a
hidden tab has no `requestAnimationFrame`: **Lenis anchor scrolling from the nav**, and how any
of it actually *looks*. The click handler was confirmed to fire and suppress the native jump,
so the wiring is right, but watch the nav scroll on the first real run.

### 13.5 The "portfolio entry" prompt (reusable)

Paste this into Claude Code **inside another project's folder**. It returns a ready
object to drop straight into `work.projects` in `src/content.js`. Reuse it for every
future project so the entries stay consistent.

```
Read this project and write a portfolio entry for it.

Work only from what is actually in the repo — README, package.json / requirements
/ go.mod, the source tree, and the git history. Do NOT invent features, dates,
metrics, users, or a job title. If you cannot determine something, put the literal
string "TODO" in that field rather than guessing. An honest gap is fine; a made-up
detail on a public portfolio is not.

Inspect, in this order:
1. README and any docs, for the intent
2. the dependency manifest, for the real stack (what is imported, not what is listed)
3. the source tree, for what was actually built vs scaffolded
4. `git log` — first and last commit dates, and roughly what share of commits are
   mine (my GitHub username is thompmic) so the `role` line is honest about
   whether this was solo or a team project
5. any deploy config or live URL

Then return ONLY a JavaScript object in exactly this shape, no prose around it:

{
  year: '',        // e.g. '2025' or '2024–25'. From git history, not a guess.
  title: '',       // the project's real name
  summary: '',     // TWO SENTENCES MAX. Sentence 1: the problem or the idea.
                   // Sentence 2: what was actually built. No adjectives like
                   // "innovative" or "cutting-edge" — say what it does.
  role: '',        // what *I* personally did. If it was a team project, say so
                   // and name my part specifically.
  stack: [],       // real technologies, most important first, max 6
  links: [],       // [{ label: 'Code', href: '...' }, { label: 'Live', href: '...' }]
                   // omit any link that does not exist — never use '#'
}

Then, separately, list:
- anything you had to mark TODO and what I would need to tell you to fill it
- the single most interesting technical decision in this project, in one
  sentence, in case it is worth calling out on the site
```

**Why the constraints matter:** the summary is rendered in a card at 15px, so
anything past two sentences gets skimmed and wastes the slot. And `role` is the field
recruiters actually read — "what I did" beats "what the project was" every time.

### 13.4 The one hard blocker

**Real content.** Everything above is scaffolding around facts only the user has: his name and
title, the actual projects, the LinkedIn URL, which socials, what interests. Do **not** invent
these — a portfolio with fabricated projects is worse than no portfolio. Ask for them, or build
the structure with clearly-marked `TODO` placeholders and hand it back for filling in.

Two open sub-questions: does **"Studio One.Zero"** survive as a brand, or does the site take his
own name (§11.5)? And is the samurai-reference *structure* still the target once there are six
sections instead of one screen?

---

## 11. Open threads the next agent should raise

1. ~~Framework A or B~~ ✅ **answered: Option A** (§10).
2. ~~Shard strategy~~ ✅ **settled by measurement, not preference: merged mesh + vertex shader
   (§5c).** InstancedMesh and VAT are both ruled out — see §5b for the evidence.
3. ~~The samurai reference image~~ ✅ **CONFIRMED by the user 2026-08-12.** It is a reference
   for **structure, and for how the type sits behind the object** — nothing else. **No samurai
   content, no brush-script typeface, no Katana Traffic branding.** See §3.7b for the specific
   structural beats to lift.
4. **Real links?** Does `Request A Prototype` point anywhere? Are the 3 social icons real URLs?
5. **Brand name** — is `Studio One.Zero` final, or does it change in the copy rewrite?
6. ~~Every asset must be used~~ ✅ **retracted by the user** — see §7. The duck/petals and brain
   images are optional; they need no home.
