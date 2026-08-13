"""
Export the Studio One.Zero hero from 22.blend -> hero.glb

Strategy (AGENTS.md 5c): the 700 shards of collection `cell.003` are merged into ONE
mesh carrying per-shard attributes, so the shatter runs in a vertex shader from a
single draw call. The Blender geometry-node graph is NOT exported; it is reproduced
in JS, and its parameters are dumped to hero.meta.json.

Shading note: only the shards are rebuilt from raw arrays (they must be flat — they
are fracture pieces). core / orb / wire_cage are copied via new_from_object so their
smooth shading and custom split normals survive intact.

NEVER saves over 22.blend.
"""
import bpy, json, os
import numpy as np

OUT_DIR = r"C:\Users\PrimeMike\OneDrive\Desktop\3D website\3D website\export"
os.makedirs(OUT_DIR, exist_ok=True)
GLB = os.path.join(OUT_DIR, "hero.glb")
GLB_DRACO = os.path.join(OUT_DIR, "hero.draco.glb")
META = os.path.join(OUT_DIR, "hero.meta.json")

scene = bpy.data.scenes['Scene']
bpy.context.window.scene = scene
report = {}


# ---------------------------------------------------------------- helpers
def eval_arrays(obj):
    """Raw (verts_world Nx3, tris Mx3) — used only for the shards."""
    dgl = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dgl)
    me = ev.to_mesh()
    me.calc_loop_triangles()
    v = np.empty(len(me.vertices) * 3, dtype=np.float32)
    me.vertices.foreach_get('co', v)
    v = v.reshape(-1, 3)
    t = np.empty(len(me.loop_triangles) * 3, dtype=np.int32)
    me.loop_triangles.foreach_get('vertices', t)
    t = t.reshape(-1, 3)
    ev.to_mesh_clear()
    M = np.array(obj.matrix_world.to_4x4(), dtype=np.float32)
    return v @ M[:3, :3].T + M[:3, 3], t


def bake_object(src, name, material=None, skip_geonodes=False, drop_translation=False):
    """Copy src with modifiers applied, PRESERVING shading. Returns a new object."""
    saved = []
    if skip_geonodes:
        for m in src.modifiers:
            if m.type == 'NODES' and m.node_group and m.node_group.name.startswith('Geometry Nodes'):
                saved.append((m, m.show_viewport, m.show_render))
                m.show_viewport = m.show_render = False

    dgl = bpy.context.evaluated_depsgraph_get()
    ev = src.evaluated_get(dgl)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dgl)
    me.name = name

    for m, sv, sr in saved:
        m.show_viewport, m.show_render = sv, sr

    ob = bpy.data.objects.new(name, me)
    if ob.name != name:
        raise RuntimeError(f"name collision: asked for '{name}', Blender gave '{ob.name}'. "
                           f"glTF would sanitise this and the JS lookup by node name would fail.")
    ob.matrix_world = src.matrix_world.copy()
    if drop_translation:
        ob.matrix_world.translation = (0.0, 0.0, 0.0)
    if material:
        me.materials.clear()
        me.materials.append(material)

    smooth = sum(1 for p in me.polygons if p.use_smooth)
    print(f"[bake]  {name:10s} verts={len(me.vertices):6d} polys={len(me.polygons):6d} "
          f"smooth_faces={smooth}/{len(me.polygons)}")
    return ob, len(me.vertices), len(me.polygons)


def make_shard_mesh(name, verts, tris, material, attrs):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts.tolist(), [], tris.tolist())
    me.update()
    me.validate()
    for aname, (atype, data) in attrs.items():
        a = me.attributes.new(name=aname, type=atype, domain='POINT')
        a.data.foreach_set('vector' if atype == 'FLOAT_VECTOR' else 'value',
                           np.asarray(data, dtype=np.float32).ravel())
    me.shade_flat()          # fracture pieces must stay faceted
    me.materials.append(material)
    return bpy.data.objects.new(name, me)


# ---------------------------------------------------------------- 1. merge the 700 shards
shard_objs = sorted(bpy.data.collections['cell.003'].objects, key=lambda o: o.name)
print(f"[shards] merging {len(shard_objs)} objects from cell.003")

all_v, all_t, all_c, all_r = [], [], [], []
offset = 0
rng = np.random.default_rng(1337)
for o in shard_objs:
    v, t = eval_arrays(o)
    if len(v) == 0 or len(t) == 0:
        continue
    centroid = (v.min(axis=0) + v.max(axis=0)) * 0.5
    all_v.append(v)
    all_t.append(t + offset)
    all_c.append(np.repeat(centroid[None, :], len(v), axis=0))
    all_r.append(np.full(len(v), rng.random(), dtype=np.float32))
    offset += len(v)

V = np.concatenate(all_v).astype(np.float32)
T = np.concatenate(all_t).astype(np.int32)
C = np.concatenate(all_c).astype(np.float32)
R = np.concatenate(all_r).astype(np.float32)

# ⚠️ The glTF exporter rotates POSITION/NORMAL into Y-up (export_yup=True) but passes
# CUSTOM attributes straight through in Blender's Z-up. Pre-convert the centroid here so
# it lands in the same space as POSITION:  three(x, y, z) = blender(x, z, -y)
C = np.stack([C[:, 0], C[:, 2], -C[:, 1]], axis=1).astype(np.float32)
print("[shards] _shardc pre-rotated to Y-up to match POSITION")
print(f"[shards] merged -> {len(V)} verts, {len(T)} tris")
report['shards'] = {'count': len(shard_objs), 'verts': int(len(V)), 'tris': int(len(T)),
                    'centroid_radius_min': float(np.linalg.norm(C, axis=1).min()),
                    'centroid_radius_max': float(np.linalg.norm(C, axis=1).max())}

# ⚠️ Names are prefixed `hero_` on purpose. Blender's object namespace is global, so
# reusing an existing name (`core`, `fly`, `Sphere`) silently produces `core.002`, which
# glTF then sanitises to `core002` — and the JS lookup by name comes back undefined.
pieces = [make_shard_mesh('hero_shards', V, T, bpy.data.materials['cell'],
                          {'_shardc': ('FLOAT_VECTOR', C), '_shardr': ('FLOAT', R)})]

# ---------------------------------------------------------------- 2. the other pieces
cage, cv, cp = bake_object(bpy.data.objects['Sphere'], 'hero_cage',
                           bpy.data.materials['lines'], skip_geonodes=True)
core, ov, op = bake_object(bpy.data.objects['core'], 'hero_core', bpy.data.materials['Material.001'])
orb,  bv, bp = bake_object(bpy.data.objects['fly'], 'hero_orb', bpy.data.materials['fly'],
                           drop_translation=True)
pieces += [cage, core, orb]
report['cage'] = {'verts': cv, 'polys': cp}
report['core'] = {'verts': ov, 'polys': op}
report['orb'] = {'verts': bv, 'polys': bp,
                 'world_pos_frame1': [round(v, 5) for v in bpy.data.objects['fly'].matrix_world.translation]}

# ---------------------------------------------------------------- 3. export
export_scene = bpy.data.scenes.new('EXPORT')
for p in pieces:
    export_scene.collection.objects.link(p)
bpy.context.window.scene = export_scene

report['draw_calls'] = len(pieces)
common = dict(export_format='GLB', use_active_scene=True, export_apply=False,
              export_attributes=True, export_normals=True, export_tangents=False,
              export_materials='EXPORT', export_cameras=False, export_lights=False,
              export_yup=True)

bpy.ops.export_scene.gltf(filepath=GLB, export_draco_mesh_compression_enable=False, **common)
print(f"[export] {GLB}  {os.path.getsize(GLB)/1e6:.2f} MB  (uncompressed fallback)")

bpy.ops.export_scene.gltf(filepath=GLB_DRACO, export_draco_mesh_compression_enable=True,
                          export_draco_mesh_compression_level=6,
                          export_draco_position_quantization=14,
                          export_draco_normal_quantization=10,
                          export_draco_generic_quantization=14, **common)
print(f"[export] {GLB_DRACO}  {os.path.getsize(GLB_DRACO)/1e6:.2f} MB  (draco)")
report['size_mb'] = {'uncompressed': round(os.path.getsize(GLB)/1e6, 3),
                     'draco': round(os.path.getsize(GLB_DRACO)/1e6, 3)}

# ---------------------------------------------------------------- 4. metadata for the JS side
bpy.context.window.scene = scene

# basis change: v_three = M @ v_blender   (x, y, z) -> (x, z, -y)
M = np.array([[1., 0., 0.], [0., 0., 1.], [0., -1., 0.]])

def to_three(v):
    return [round(float(x), 5) for x in (M @ np.asarray(v, dtype=np.float64))]

orbit = []
for f in range(1, 251, 5):
    scene.frame_set(f)
    dgl = bpy.context.evaluated_depsgraph_get()
    p = bpy.data.objects['fly'].evaluated_get(dgl).matrix_world.translation
    orbit.append([f] + to_three(p))
scene.frame_set(1)

# the shell spin, conjugated into three space: R_three = M @ R_blender @ M.T
from mathutils import Euler
def spin_three(e):
    Rb = np.array(Euler(e, 'XYZ').to_matrix())
    Rt = M @ Rb @ M.T
    return [[round(float(x), 6) for x in row] for row in Rt]

cam = bpy.data.objects['Camera']
cam_fwd = np.array(cam.matrix_world.to_3x3() @ __import__('mathutils').Vector((0, 0, -1)))
cam_pos = np.array(cam.matrix_world.translation)
report['camera'] = {
    'blender_location': [round(v, 5) for v in cam.location],
    'blender_rotation_euler': [round(v, 5) for v in cam.rotation_euler],
    'three_position': to_three(cam_pos),
    'three_look_at': to_three(cam_pos + cam_fwd * float(np.linalg.norm(cam_pos))),
    'lens_mm': cam.data.lens, 'sensor_mm': cam.data.sensor_width,
    'sensor_fit': cam.data.sensor_fit,
    'render': [scene.render.resolution_x, scene.render.resolution_y],
    'horizontal_fov_deg': round(float(np.degrees(2 * np.arctan(cam.data.sensor_width / (2 * cam.data.lens)))), 4),
    'vertical_fov_deg_at_1600x1000': round(float(np.degrees(2 * np.arctan(
        (cam.data.sensor_width / (2 * cam.data.lens)) * (1000 / 1600)))), 4),
    'note': 'three_* values are already in Three.js Y-up space. Blender sensor_fit AUTO fits the '
            'LARGER image dimension, so 36mm maps to the HORIZONTAL fov at 1600x1000.',
}
report['orbit'] = {
    'radius': 1.13806,
    'plane_three': 'circle in the Three.js Y/Z plane (x = 0)',
    'formula_three': 'orb = vec3(0, R*sin(t), -R*cos(t)); t starts at 0.941 rad for frame 1',
    'path_duration_frames': 100,
    'samples_frame_xyz_three': orbit,
}
report['shell_spin_three'] = {
    'frame1_matrix3': spin_three((0.0, -0.0332, -0.733)),
    'frame250_matrix3': spin_three((0.0, -0.9547, -0.733)),
    'note': 'row-major 3x3 in Three.js space; feed as the uSpin uniform (THREE.Matrix3.fromArray '
            'expects column-major, so transpose or set elements directly).',
}
report['shatter'] = {
    'note': 'reproduce in the vertex shader against the orb position',
    'f': 'f = 0.2 / distance(shardCentroid, orbPos)',
    'ramp': 'ramp = clamp((0.8068 - f) / (0.8068 - 0.3955), 0, 1)',
    'scale': 'shardScale = ramp   (1 = intact, 0 = vanished)',
    'rotation_rad': 'angle = 14.1 * (1.0 - ramp), applied equally to x/y/z',
    'distance_thresholds': {'fully_gone_below': round(0.2/0.8068, 4), 'intact_above': round(0.2/0.3955, 4)},
    'shell_spin_euler_frame1': [0.0, -0.0332, -0.733],
    'shell_spin_euler_frame250': [0.0, -0.9547, -0.733],
    'orb_radius': 0.1558,
}
report['materials'] = {
    'cell': {'base_color_linear': [0.839, 0.048, 0.017], 'metallic': 0.709, 'roughness': 0.595},
    'fly': {'base_color_linear': [0.010, 0.010, 0.010], 'metallic': 0.0, 'roughness': 0.0},
    'lines': {'base_color_linear': [0.831, 0.058, 0.000], 'metallic': 0.682, 'roughness': 0.843},
    'Material.001': {'emission_linear': [1.0, 0.271, 0.144], 'strength': 10.0},
}
report['attributes'] = {'_SHARDC': 'vec3 shard centroid, rest pose, PRE-ROTATED TO Y-UP to match POSITION',
                        '_SHARDR': 'float 0..1 stable per-shard random',
                        'three_js_names': ['_shardc', '_shardr'],
                        'warning': 'glTF export_yup only converts POSITION/NORMAL; custom attributes '
                                   'pass through in Blender Z-up. The exporter compensates for _SHARDC.'}

with open(META, 'w', encoding='utf-8') as fh:
    json.dump(report, fh, indent=2)
print(f"[export] {META}")
print("\n--- SUMMARY ---")
print(json.dumps({k: report[k] for k in ('shards','cage','core','orb','draw_calls','size_mb')}, indent=2))
