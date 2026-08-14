import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SHATTER, SUBJECT, SCROLL } from '../config.js'
import { createShatterMaterial, spinMatrix } from './shatterMaterial.js'
import { scroll } from '../scroll.js'

const MODEL = '/models/hero.draco.glb'
useGLTF.preload(MODEL, '/draco/')

/** GLTFLoader lowercases unknown attribute names, but don't rely on the casing. */
function takeAttribute(geometry, gltfName, newName) {
  const key = Object.keys(geometry.attributes).find(
    (k) => k.toLowerCase() === gltfName.toLowerCase(),
  )
  if (!key) {
    console.error(
      `[Subject] missing "${gltfName}" on the shards geometry — the shatter will not run.`,
      'Re-export with tools/export_glb.py (AGENTS.md §5f). Present:',
      Object.keys(geometry.attributes),
    )
    return false
  }
  geometry.setAttribute(newName, geometry.attributes[key])
  return true
}

export function Subject() {
  const group = useRef()
  const { nodes } = useGLTF(MODEL, '/draco/')

  const { shards, cage, core, orb, uniforms } = useMemo(() => {
    // Node names are prefixed `hero_` by the exporter. Blender's object namespace is
    // global, so an unprefixed `core` collides with the scene's own object and comes
    // out as `core.002` -> `core002` in glTF, which silently breaks lookup by name.
    const shardMesh = nodes.hero_shards
    if (!shardMesh) {
      console.error(
        '[Subject] no `hero_shards` node — is public/models stale? Run `npm run assets`.',
        'Found:', Object.keys(nodes),
      )
      // must still hand back real uniform objects: useFrame runs regardless, and
      // reaching into `undefined.value` there throws on every single frame
      return { shards: null, cage: null, core: null, orb: null, uniforms: createShatterMaterial().uniforms }
    }
    const geometry = shardMesh.geometry.clone()

    const ok =
      takeAttribute(geometry, '_SHARDC', 'aShardC') &&
      takeAttribute(geometry, '_SHARDR', 'aShardR')

    const { material, uniforms } = createShatterMaterial(shardMesh.material)
    // the shell is authored around the origin; a stale bounding sphere would let
    // the frustum cull it the moment shards move
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)

    return {
      shards: ok ? { geometry, material } : null,
      cage: nodes.hero_cage,
      core: nodes.hero_core,
      orb: nodes.hero_orb,
      uniforms,
    }
  }, [nodes])

  // the emissive core drives the bloom; glTF clamps emissive to the base factor
  useEffect(() => {
    if (core?.material) {
      core.material.emissiveIntensity = 6
      core.material.toneMapped = false
    }
  }, [core])

  const orbRef = useRef()
  const spin = useMemo(() => new THREE.Matrix3(), [])
  const orbPos = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const p = scroll.value
    const t = state.clock.elapsedTime

    // the orb keeps drifting on its own so the hero is alive before you touch the
    // wheel; scroll then pushes it much further around the shell
    const angle =
      SHATTER.orbitStart + t * 0.16 + p * SHATTER.orbitTurns * Math.PI * 2

    orbPos.set(
      0,
      SHATTER.orbitRadius * Math.sin(angle),
      -SHATTER.orbitRadius * Math.cos(angle),
    )
    uniforms.uOrb.value.copy(orbPos)
    if (orbRef.current) orbRef.current.position.copy(orbPos)

    spinMatrix(spin, SUBJECT.spinFrom, SUBJECT.spinTo, p)
    uniforms.uSpin.value.copy(spin)

    uniforms.uBurst.value = Math.pow(p, 1.6) * SHATTER.burst

    if (group.current) {
      // Idle motion on top of the scroll drift. Without it the sphere is completely
      // static until you touch the wheel, which reads as a stalled render rather than
      // as a still image. Sine-driven, so it is smooth by construction.
      group.current.position.set(
        SCROLL.subjectDrift[0] * p,
        SCROLL.subjectDrift[1] * p + Math.sin(t * 0.34) * 0.045,
        SCROLL.subjectDrift[2] * p,
      )
      group.current.rotation.y = t * 0.045 + p * 0.5
      group.current.rotation.x = Math.sin(t * 0.23) * 0.02
    }
  })

  return (
    <group ref={group} scale={SUBJECT.scale}>
      {shards && (
        <mesh geometry={shards.geometry} material={shards.material} frustumCulled={false} />
      )}
      {cage && <mesh geometry={cage.geometry} material={cage.material} rotation={cage.rotation} />}
      {core && <mesh geometry={core.geometry} material={core.material} scale={core.scale} />}
      {orb && <mesh ref={orbRef} geometry={orb.geometry} material={orb.material} scale={orb.scale} />}
    </group>
  )
}
