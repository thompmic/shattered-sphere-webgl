"""
Apply the TRANSCRIBED shatter math (from hero.meta.json) to the merged shard mesh in
numpy — exactly what the vertex shader will do — and render it. If this matches
check_A_original.png, the shader math is correct.
"""
import bpy, os, numpy as np
from mathutils import Euler

OUT = r"C:\Users\PrimeMike\OneDrive\Desktop\3D website\3D website\export"
scene = bpy.data.scenes['Scene']
bpy.context.window.scene = scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x, scene.render.resolution_y = 800, 500
scene.frame_set(1)

# ---- rebuild merged shards, keeping per-shard grouping
def eval_arrays(obj):
    dgl = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dgl)
    me = ev.to_mesh(); me.calc_loop_triangles()
    v = np.empty(len(me.vertices)*3, dtype=np.float64); me.vertices.foreach_get('co', v)
    t = np.empty(len(me.loop_triangles)*3, dtype=np.int32); me.loop_triangles.foreach_get('vertices', t)
    v = v.reshape(-1,3); t = t.reshape(-1,3)
    ev.to_mesh_clear()
    M = np.array(obj.matrix_world.to_4x4(), dtype=np.float64)
    return v @ M[:3,:3].T + M[:3,3], t

shard_objs = sorted(bpy.data.collections['cell.003'].objects, key=lambda o: o.name)
all_v, all_t, all_c, off = [], [], [], 0
for o in shard_objs:
    v, t = eval_arrays(o)
    if not len(v) or not len(t): continue
    c = (v.min(axis=0) + v.max(axis=0)) * 0.5
    all_v.append(v); all_t.append(t + off); all_c.append(np.repeat(c[None,:], len(v), axis=0))
    off += len(v)
V = np.concatenate(all_v); T = np.concatenate(all_t); C = np.concatenate(all_c)

# ---- the shell spin the geo-node graph applies before anything else
spin = np.array(Euler((0.0, -0.0332, -0.733), 'XYZ').to_matrix(), dtype=np.float64)
V = V @ spin.T
C = C @ spin.T

# ---- the shatter, per the transcription
orb_center = np.array(bpy.data.objects['fly'].matrix_world.translation, dtype=np.float64)
ORB_R = 0.1558
K, WHITE, BLACK, ROT = 0.2, 0.3955, 0.8068, 14.1

d = np.maximum(np.linalg.norm(C - orb_center, axis=1) - ORB_R, 1e-6)   # distance to orb SURFACE
f = K / d
ramp = np.clip((BLACK - f) / (BLACK - WHITE), 0.0, 1.0)
angle = ROT * (1.0 - ramp)

print(f"shards fully gone (ramp==0): {(ramp <= 0.001).sum() / 3:.0f}-ish verts")
print(f"ramp: min={ramp.min():.3f} max={ramp.max():.3f}  partial={(0.001 < ramp).sum() and ((ramp>0.001)&(ramp<0.999)).sum()}")

# rotate about each shard's own centroid by `angle` on all 3 axes, then scale by ramp
local = V - C
ca, sa = np.cos(angle), np.sin(angle)
# equal-angle XYZ euler, built per-vertex
def rot_apply(p, a):
    c, s = np.cos(a), np.sin(a)
    x, y, z = p[:,0], p[:,1], p[:,2]
    # Rx
    y, z = y*c - z*s, y*s + z*c
    # Ry
    x, z = x*c + z*s, -x*s + z*c
    # Rz
    x, y = x*c - y*s, x*s + y*c
    return np.stack([x, y, z], axis=1)

local = rot_apply(local, angle)
V2 = C + local * ramp[:, None]

me = bpy.data.meshes.new('shatter_test')
me.from_pydata(V2.tolist(), [], T.tolist()); me.update(); me.validate(); me.shade_flat()
me.materials.append(bpy.data.materials['cell'])
ob = bpy.data.objects.new('shatter_test', me)
scene.collection.objects.link(ob)

# hide originals except the cage / core / orb, which we rebuild unchanged
def bake(src, name, mat, skip_gn=False):
    saved = []
    if skip_gn:
        for m in src.modifiers:
            if m.type == 'NODES' and m.node_group and m.node_group.name.startswith('Geometry Nodes'):
                saved.append((m, m.show_viewport, m.show_render)); m.show_viewport = m.show_render = False
    dgl = bpy.context.evaluated_depsgraph_get()
    nm = bpy.data.meshes.new_from_object(src.evaluated_get(dgl), preserve_all_data_layers=True, depsgraph=dgl)
    for m, sv, sr in saved: m.show_viewport, m.show_render = sv, sr
    nm.materials.clear(); nm.materials.append(mat)
    o2 = bpy.data.objects.new(name, nm); o2.matrix_world = src.matrix_world.copy()
    scene.collection.objects.link(o2); return o2

bake(bpy.data.objects['Sphere'], 'cage_x', bpy.data.materials['lines'], skip_gn=True)
bake(bpy.data.objects['core'], 'core_x', bpy.data.materials['Material.001'])
bake(bpy.data.objects['fly'], 'orb_x', bpy.data.materials['fly'])

for o in list(scene.objects):
    if o.name in ('shatter_test','cage_x','core_x','orb_x'): continue
    if o.type == 'MESH' or o.name.startswith('cell'):
        o.hide_render = True

scene.render.filepath = os.path.join(OUT, "check_C_shatter_math.png")
bpy.ops.render.render(write_still=True)
print("wrote C")
