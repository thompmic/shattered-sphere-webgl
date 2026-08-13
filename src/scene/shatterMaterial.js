import * as THREE from 'three'
import { SHATTER } from '../config.js'

/**
 * Patches a MeshStandardMaterial so the 700 merged shards shatter in the vertex
 * shader — one draw call for the whole shell (AGENTS.md §5c/§5f).
 *
 * The maths is transcribed from the Blender geometry-node graph and was verified
 * against a reference render (tools/verify_shatter.py):
 *
 *   d    = distance(shardCentroid, orbPos) - orbRadius
 *   f    = k / d
 *   ramp = clamp((rampBlack - f) / (rampBlack - rampWhite), 0, 1)   // 1 intact, 0 gone
 *   ang  = rotation * (1 - ramp)                                    // same on x, y, z
 *   pos  = centroid + rotXYZ(ang) * (pos - centroid) * ramp
 *
 * The geometry must carry `aShardC` (vec3 centroid) and `aShardR` (float random).
 * Both are already in Three.js Y-up space — the exporter pre-rotates the centroid,
 * because glTF's export_yup only converts POSITION/NORMAL and passes custom
 * attributes straight through in Blender's Z-up.
 */

const GLOBALS = /* glsl */ `
  attribute vec3 aShardC;
  attribute float aShardR;

  uniform vec3  uOrb;
  uniform mat3  uSpin;
  uniform float uK;
  uniform float uRampWhite;
  uniform float uRampBlack;
  uniform float uRotation;
  uniform float uOrbRadius;
  uniform float uBurst;

  // NOTE: GLSL mat3(...) takes COLUMNS.
  mat3 shatterRotXYZ(float a) {
    float c = cos(a), s = sin(a);
    mat3 rx = mat3(1.0, 0.0, 0.0,   0.0,  c,   s,    0.0, -s,   c);
    mat3 ry = mat3( c,  0.0, -s,    0.0, 1.0, 0.0,    s,  0.0,  c);
    mat3 rz = mat3( c,   s,  0.0,   -s,   c,  0.0,   0.0, 0.0, 1.0);
    return rz * ry * rx;
  }
`

// replaces `vec3 objectNormal = vec3( normal );`
const NORMAL_CHUNK = /* glsl */ `
  vec3 sCentroid = uSpin * aShardC;
  float sDist = max(distance(sCentroid, uOrb) - uOrbRadius, 1e-6);
  float sF = uK / sDist;
  float sRamp = clamp((uRampBlack - sF) / (uRampBlack - uRampWhite), 0.0, 1.0);
  float sAngle = uRotation * (1.0 - sRamp) + uBurst * aShardR * 2.4;
  mat3 sRot = shatterRotXYZ(sAngle);

  vec3 objectNormal = sRot * (uSpin * normal);
`

// replaces `vec3 transformed = vec3( position );`
const POSITION_CHUNK = /* glsl */ `
  vec3 sPos = uSpin * position;
  vec3 transformed = sCentroid + sRot * (sPos - sCentroid) * sRamp;

  // scroll-driven outward drift, on top of the orb's dissolve
  transformed += normalize(sCentroid) * uBurst * (0.35 + 0.65 * aShardR);
`

export function createShatterMaterial(source) {
  const material = source ? source.clone() : new THREE.MeshStandardMaterial()

  const uniforms = {
    uOrb: { value: new THREE.Vector3(0, 0.919, -0.669) },
    uSpin: { value: new THREE.Matrix3() },
    uK: { value: SHATTER.k },
    uRampWhite: { value: SHATTER.rampWhite },
    uRampBlack: { value: SHATTER.rampBlack },
    uRotation: { value: SHATTER.rotation },
    uOrbRadius: { value: SHATTER.orbRadius },
    uBurst: { value: 0 },
  }

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${GLOBALS}`)
      .replace('#include <beginnormal_vertex>', NORMAL_CHUNK)
      .replace('#include <begin_vertex>', POSITION_CHUNK)
  }
  // keep the patched program distinct from any unpatched clone of the same material
  material.customProgramCacheKey = () => 'shatter-v1'
  material.userData.uniforms = uniforms

  return { material, uniforms }
}

/**
 * The shell spin is authored as a Blender-space XYZ euler. A rotation does NOT carry
 * across a basis change by copying its components — it has to be conjugated:
 *
 *     R_three = M · R_blender · Mᵀ ,  where M maps (x, y, z)_blender -> (x, z, -y)_three
 *
 * Getting this wrong spins the shell about the wrong axis, which looks plausible
 * enough to miss by eye — hence doing it explicitly here.
 */
const BASIS = new THREE.Matrix4().set(
  1, 0, 0, 0,
  0, 0, 1, 0,
  0, -1, 0, 0,
  0, 0, 0, 1,
)
const BASIS_T = BASIS.clone().transpose()
const _m4 = new THREE.Matrix4()
const _euler = new THREE.Euler()

export function spinMatrix(target, from, to, t) {
  _euler.set(
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
    'XYZ',
  )
  _m4.makeRotationFromEuler(_euler)
  _m4.premultiply(BASIS).multiply(BASIS_T)
  return target.setFromMatrix4(_m4)
}
