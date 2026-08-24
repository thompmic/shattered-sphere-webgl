# Studio One.Zero

A WebGL hero built with React Three Fiber: a fractured sphere of 700 shards that dissolves
around an orbiting core, with the display type sitting *inside* the 3D scene so the subject
occludes it.

**Live:** **[michaelthompsondev.netlify.app](https://michaelthompsondev.netlify.app/)** · **Stack:** Vite · React 19 · React Three Fiber · Three.js · Lenis

---

## Credit

Original concept, visual design and Blender scene by **[@Bachynskyi_ui](https://www.instagram.com/bachynskyi_ui/)**,
who shared the Figma and Blender source files with me. Thank you — the idea and the artwork
are his.

This build adapts that work rather than reproducing it: the palette is inverted to a dark
starfield, the layout is rebuilt around type sitting behind the subject, and the shatter is
re-implemented as a real-time shader driven by scroll instead of a baked animation. More will
diverge as it goes.

What's mine is the engineering: decoding the `.fig` and `.blend` into a spec, collapsing the
shard geometry so it runs in a browser, reproducing the geometry-node effect as a vertex
shader, and building the site around it.

## How it was built

**[Read the full build diary →](docs/HOW-IT-WAS-BUILT.md)** — what we made, what went wrong,
and why the fixes worked. Written to be learned from: eight "traps" are flagged along the way,
each one a failure that produced a plausible-looking wrong answer instead of an error.

## The interesting part

The Blender scene shatters via a geometry-node graph: an orbiting orb drives a proximity
falloff that rotates and shrinks nearby shards to nothing, exposing a wireframe cage beneath.
None of that survives a glTF export — geometry nodes don't serialise, and 700 separate
shard objects would be 700 draw calls.

So the shards are merged into a **single mesh** carrying two extra vertex attributes — each
shard's centroid and a stable per-shard random — and the effect is re-derived in a vertex
shader from the node graph's actual constants:

```glsl
float d    = max(distance(shardCentroid, orbPos) - 0.1558, 1e-6);
float f    = 0.2 / d;
float ramp = clamp((0.8068 - f) / (0.8068 - 0.3955), 0.0, 1.0);  // 1 intact, 0 gone
float ang  = 14.1 * (1.0 - ramp);
```

**One draw call for the whole shell**, 112,883 triangles for the entire scene, and a 1.1 MB
Draco-compressed model. The shader maths was verified by applying it in numpy and comparing
the render against the untouched Blender scene.

## Running it

```bash
npm install
npm run dev
```

`npm run build` runs `prebuild` first, which copies the model, font and Draco decoder into
`public/` — that directory is generated and gitignored, so a clean checkout builds correctly.

## Layout

| Path | What it is |
|---|---|
| `src/content.js` | every visible string, in one file |
| `src/config.js` | every tunable number, tagged `MEASURED` or `TASTE` |
| `src/scene/shatterMaterial.js` | the vertex-shader patch |
| `tools/export_glb.py` | Blender → glTF, merges the shards with their attributes |
| `AGENTS.md` | the full working spec and build log |

## Status

Live and deployed. Copy is written; the two other projects are private repos, so those
cards carry no code link rather than a link that 404s.
