import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { NAME } from '../config.js'
import { scroll } from '../scroll.js'
import { createInkTexture } from './inkTexture.js'

/**
 * The brush-painted name sitting behind the subject (§3.7).
 *
 * `depthWrite` is off but depth TESTING is on: the sphere is opaque and renders
 * first, so it occludes the plane. That is the whole point — the name has to be
 * inside the scene, not in the DOM, for the subject to cut through it.
 */
export function NameBackdrop() {
  const mesh = useRef()
  const [texture, setTexture] = useState(null)
  const { camera, size } = useThree()

  useEffect(() => {
    let alive = true
    let made = null
    createInkTexture().then((t) => {
      if (alive) {
        made = t
        setTexture(t)
      } else {
        t.dispose()
      }
    })
    return () => {
      alive = false
      made?.dispose()
    }
  }, [])

  // Size the plane to the frame at its own depth so it stays proportional at any
  // viewport, rather than being a fixed world size that crops on wide screens.
  const scale = useMemo(() => {
    const distance = camera.position.z - NAME.z
    const vFov = (camera.fov * Math.PI) / 180
    const height = 2 * distance * Math.tan(vFov / 2)
    const width = height * (size.width / size.height)
    const w = width * NAME.widthFraction
    return [w, (w * NAME.canvas.height) / NAME.canvas.width]
  }, [camera, camera.fov, size.width, size.height])

  useFrame(() => {
    if (!mesh.current) return
    // drifts slower than the subject — this is the parallax that separates the
    // backdrop from the sphere in front of it
    mesh.current.position.y = NAME.yOffset + scroll.value * 2.4
    mesh.current.position.z = NAME.z + scroll.value * 1.1
  })

  if (!texture) return null

  return (
    <mesh ref={mesh} position={[0, NAME.yOffset, NAME.z]} renderOrder={-1}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={NAME.opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
