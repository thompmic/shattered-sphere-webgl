import { useMemo, useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TYPE, CAMERA, SCROLL } from '../config.js'
import { content } from '../content.js'
import { scroll } from '../scroll.js'

/**
 * The giant `06` / `04` numerals (§3.2, §3.4).
 *
 * These live INSIDE the WebGL scene, not in the DOM — that is the whole point of
 * §3.7. Sitting at z = TYPE.z, behind the subject, they get depth-tested against the
 * shattered sphere, so the sphere occludes them. Move them to the DOM and the effect
 * collapses.
 *
 * Positions come from the 1600×1000 Figma artboard and are mapped onto the world
 * plane at TYPE.z, so the layout stays faithful to §3.2 at any viewport size.
 */

/** Fade the fill from 100% at the cap height to 18% at the baseline (§3.5b --display). */
function gradientMaterial(fontSize) {
  const material = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    depthWrite: false, // still depth-TESTED, so the subject occludes it
    toneMapped: false,
  })
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTop = { value: fontSize * 0.52 }
    shader.uniforms.uBottom = { value: -fontSize * 0.28 }
    shader.uniforms.uOpacityTop = { value: TYPE.opacityTop }
    shader.uniforms.uOpacityBottom = { value: TYPE.opacityBottom }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vGradY;\nuniform float uTop;\nuniform float uBottom;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGradY = clamp((position.y - uBottom) / (uTop - uBottom), 0.0, 1.0);')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vGradY;\nuniform float uOpacityTop;\nuniform float uOpacityBottom;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a *= mix(uOpacityBottom, uOpacityTop, vGradY);')
  }
  return material
}

export function DisplayType() {
  const group = useRef()
  const { viewport, camera } = useThree()

  // world size of the plane at TYPE.z, so Figma pixels map to world units
  const { unit, fontSize } = useMemo(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(...CAMERA.lookAt)) - TYPE.z
    const height = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
    const width = height * (TYPE.artboard.w / TYPE.artboard.h)
    const unit = width / TYPE.artboard.w
    return { unit, fontSize: TYPE.fontSizePx * unit }
  }, [camera, viewport.width])

  const place = (spec) => [
    (spec.xPx - TYPE.artboard.w / 2) * unit,
    (TYPE.artboard.h / 2 - spec.yPx) * unit,
    TYPE.z,
  ]

  const matLeft = useMemo(() => gradientMaterial(fontSize), [fontSize])
  const matRight = useMemo(() => gradientMaterial(fontSize), [fontSize])

  useFrame(() => {
    if (!group.current) return
    const p = scroll.value
    // the type drifts slower than the subject — this is the parallax that carries
    // from the hero down into the sections (§6 answer 1a)
    group.current.position.y = p * 2.2
    group.current.position.z = p * 1.1
  })

  return (
    <group ref={group}>
      <Text
        font="/fonts/KulimPark-Light.ttf"
        fontSize={fontSize}
        letterSpacing={TYPE.letterSpacing}
        anchorX="center"
        anchorY="middle"
        position={place(TYPE.left)}
        material={matLeft}
        renderOrder={-1}
      >
        {content.hero.display.left}
      </Text>
      <Text
        font="/fonts/KulimPark-Light.ttf"
        fontSize={fontSize}
        letterSpacing={TYPE.letterSpacing}
        anchorX="center"
        anchorY="middle"
        position={place(TYPE.right)}
        material={matRight}
        renderOrder={-1}
      >
        {content.hero.display.right}
      </Text>
    </group>
  )
}
