import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CAMERA, SCROLL } from '../config.js'
import { scroll } from '../scroll.js'
import { Subject } from './Subject.jsx'
import { DisplayType } from './DisplayType.jsx'

/**
 * Depth order, back → front (AGENTS.md §3.7):
 *   1 starfield / nebula      (nebula is CSS, behind the transparent canvas)
 *   2 drifting particles
 *   3 giant display type      <- in the scene, so that…
 *   4 the 3D subject          <- …this can occlude it
 *   5 sparks in front
 *   6 DOM chrome              (nav / rail / stats — outside the canvas)
 */

/** Blender fits its 36mm sensor to the LARGER image dimension, so 20.41° is the
 *  HORIZONTAL fov. Three's `fov` is vertical, so derive it from the live aspect —
 *  this keeps the framing stable instead of cropping as the window changes. */
function CameraRig() {
  const { camera, size } = useThree()
  const base = useMemo(() => new THREE.Vector3(...CAMERA.position), [])
  const target = useMemo(() => new THREE.Vector3(...CAMERA.lookAt), [])

  useFrame(() => {
    const aspect = size.width / size.height
    const hFov = THREE.MathUtils.degToRad(CAMERA.horizontalFovDeg)
    const vFov = 2 * Math.atan(Math.tan(hFov / 2) / aspect)
    const next = THREE.MathUtils.radToDeg(vFov)
    if (Math.abs(camera.fov - next) > 0.01) {
      camera.fov = next
      camera.updateProjectionMatrix()
    }

    const p = scroll.value
    camera.position.set(
      base.x + SCROLL.cameraDrift[0] * p,
      base.y + SCROLL.cameraDrift[1] * p,
      base.z + SCROLL.cameraDrift[2] * p,
    )
    camera.lookAt(target)
  })
  return null
}

/** Loose motes drifting behind the type (§3.7 layer 2). */
function Motes({ count = 220 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = -2 - Math.random() * 12
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = t * 0.012
    ref.current.position.y = Math.sin(t * 0.18) * 0.25 + scroll.value * 1.4
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.085}
        color="#F5EDEA"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SceneContents() {
  return (
    <>
      <CameraRig />

      {/* §3.5b: a dark space field. The camera is a 20° telephoto, so a wide sparse
          field puts almost nothing on screen — keep the shell tight and the count high
          or the starfield simply is not there. `fade` stops the far ones aliasing. */}
      <Stars radius={18} depth={16} count={5200} factor={5} saturation={0} fade speed={0.3} />
      <Motes />

      <DisplayType />

      <Suspense fallback={null}>
        <Subject />
      </Suspense>

      {/* Procedural environment — no HDR download. The shards are metallic 0.71, so
          they are almost entirely reflections of whatever is in here. */}
      <Environment resolution={256}>
        <Lightformer intensity={2.4} color="#fff1ec" position={[-4, 3, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.5} color="#F0504A" position={[5, -1, 1]} scale={[6, 6, 1]} />
        <Lightformer intensity={0.7} color="#8B0000" position={[0, -4, -3]} scale={[10, 4, 1]} />
      </Environment>

      <ambientLight intensity={0.12} />
      <directionalLight position={[-4, 4, 3]} intensity={1.5} color="#fff3ee" />
      <pointLight position={[2.5, -1.5, 2]} intensity={9} color="#F0504A" distance={14} decay={2} />
      {/* rim from behind — without it the dark shell dissolves into the dark ground */}
      <directionalLight position={[1.5, 1.2, -5]} intensity={2.6} color="#ffb3a3" />

      <EffectComposer disableNormalPass multisampling={4}>
        {/* the core is emissive at strength 10 (§5d); a low threshold blows it out the
            moment the shell opens, so keep it high and let the bloom stay a halo */}
        <Bloom intensity={0.6} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  )
}

export function Stage() {
  return (
    <Canvas
      className="stage-canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: CAMERA.position, near: CAMERA.near, far: CAMERA.far, fov: 13 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.15
      }}
    >
      <SceneContents />
    </Canvas>
  )
}
