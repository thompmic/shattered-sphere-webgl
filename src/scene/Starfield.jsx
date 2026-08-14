import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA, STARS } from '../config.js'

/**
 * A coloured, glowing starfield.
 *
 * Replaces drei's <Stars>, which is monochrome and distributes points over a full
 * sphere. Two reasons that does not work here:
 *
 *  - the camera is a 20° telephoto, so a spherical shell puts the overwhelming
 *    majority of stars outside the frustum and the few that land on screen are
 *    sub-pixel. We generate inside a cone aimed down the view axis instead, so
 *    every star is somewhere useful.
 *  - each star needs its own colour and its own twinkle phase.
 *
 * The glow is a tight core plus a wide halo in the fragment shader, additively
 * blended — a flat disc reads as a dot, not as a light.
 */

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * sin(uTime * 0.7 + aPhase * 6.2831853);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (140.0 / max(-mv.z, 0.001));
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float f = smoothstep(0.5, 0.0, d);
    float glow = pow(f, 7.0) + 0.28 * pow(f, 2.2);   // core + halo
    float a = glow * vTwinkle;
    gl_FragColor = vec4(vColor * a, a);
  }
`

/** Builds the geometry and material. Separate from the component so it can be
 *  exercised outside React without duplicating the shader. */
export function createStarfield() {
  const n = STARS.count
  const geometry = (() => {
    const position = new Float32Array(n * 3)
    const color = new Float32Array(n * 3)
    const aSize = new Float32Array(n)
    const aPhase = new Float32Array(n)

    const spread = Math.tan(THREE.MathUtils.degToRad(STARS.spreadDeg) / 2)
    const palette = STARS.palette.map((c) => new THREE.Color(c))
    const camZ = CAMERA.position[2]
    const tmp = new THREE.Color()

    for (let i = 0; i < n; i++) {
      // distance in front of the camera, then a position within the cone at that
      // distance — this is what keeps density even instead of clumping near the eye
      const d = STARS.near + Math.random() * (STARS.far - STARS.near)
      position[i * 3 + 0] = (Math.random() * 2 - 1) * d * spread
      position[i * 3 + 1] = (Math.random() * 2 - 1) * d * spread * STARS.verticalBias
      position[i * 3 + 2] = camZ - d

      // most stars stay near-white; the colour should read as a tint on a few,
      // not as confetti
      const pick = palette[(Math.random() * palette.length) | 0]
      tmp.copy(pick).lerp(STARS.white, Math.random() * STARS.desaturate)
      color[i * 3 + 0] = tmp.r
      color[i * 3 + 1] = tmp.g
      color[i * 3 + 2] = tmp.b

      // a few bright ones carry the field; the rest are dust
      const bright = Math.random() < STARS.brightFraction
      aSize[i] = bright
        ? STARS.size[1] + Math.random() * (STARS.size[1] * 0.6)
        : STARS.size[0] + Math.random() * (STARS.size[1] - STARS.size[0])
      aPhase[i] = Math.random()
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(position, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1))
    return g
  })()

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  return { geometry, material }
}

export function Starfield() {
  const points = useRef()
  const { geometry, material } = useMemo(() => createStarfield(), [])

  useFrame((state, dt) => {
    material.uniforms.uTime.value += dt
    material.uniforms.uPixelRatio.value = state.viewport.dpr
    if (points.current) points.current.rotation.z = state.clock.elapsedTime * 0.006
  })

  // the field is generated around the camera's rest position, so it must not be
  // culled when the camera drifts on scroll
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
