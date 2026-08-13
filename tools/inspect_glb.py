import json, struct, sys, collections, os

path = sys.argv[1]
with open(path, 'rb') as f:
    magic, ver, length = struct.unpack('<III', f.read(12))
    assert magic == 0x46546C67, "not a glb"
    chunks = {}
    while f.tell() < length:
        clen, ctype = struct.unpack('<II', f.read(8))
        data = f.read(clen)
        chunks[ctype] = data
J = json.loads(chunks[0x4E4F534A].decode('utf-8'))
BIN = chunks.get(0x004E4942, b'')

print(f"file: {os.path.basename(path)}  {length/1e6:.2f} MB   JSON={len(chunks[0x4E4F534A])/1024:.0f} KB  BIN={len(BIN)/1e6:.2f} MB")
print("extensionsUsed:", J.get('extensionsUsed'))

CT = {5120:'i8',5121:'u8',5122:'i16',5123:'u16',5125:'u32',5126:'f32'}
NC = {'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
SZ = {5120:1,5121:1,5122:2,5123:2,5125:4,5126:4}

print("\n=== NODES ===")
for n in J.get('nodes', []):
    print(f"  {n.get('name'):14s} mesh={n.get('mesh')} T={n.get('translation')} R={n.get('rotation')} S={n.get('scale')}")

total_by_attr = collections.Counter()
print("\n=== MESHES / PRIMITIVES ===")
for m in J['meshes']:
    for p in m['primitives']:
        attrs = p['attributes']
        idx = J['accessors'][p['indices']]
        pos = J['accessors'][attrs['POSITION']]
        print(f"\n  {m['name']:12s} verts={pos['count']:7d} indices={idx['count']:7d} tris={idx['count']//3:7d} mat={J['materials'][p['material']]['name'] if 'material' in p else None}")
        for a, ai in sorted(attrs.items()):
            acc = J['accessors'][ai]
            nbytes = acc['count'] * NC[acc['type']] * SZ[acc['componentType']]
            total_by_attr[a] += nbytes
            extra = ''
            if a.startswith('_'):
                extra = f"  min={acc.get('min')} max={acc.get('max')}"
            print(f"      {a:12s} {acc['type']:7s} {CT[acc['componentType']]:4s} count={acc['count']:7d} {nbytes/1e6:6.2f} MB{extra}")
        ib = idx['count'] * SZ[idx['componentType']]
        total_by_attr['INDICES'] += ib
        print(f"      {'INDICES':12s} {idx['type']:7s} {CT[idx['componentType']]:4s} count={idx['count']:7d} {ib/1e6:6.2f} MB")

print("\n=== BUFFER BUDGET BY ATTRIBUTE ===")
for k, v in total_by_attr.most_common():
    print(f"  {k:12s} {v/1e6:6.2f} MB  ({100*v/max(len(BIN),1):4.1f}%)")

print("\n=== MATERIALS ===")
for mt in J['materials']:
    pbr = mt.get('pbrMetallicRoughness', {})
    print(f"  {mt['name']:14s} base={pbr.get('baseColorFactor')} metal={pbr.get('metallicFactor')} rough={pbr.get('roughnessFactor')} emissive={mt.get('emissiveFactor')} ext={list(mt.get('extensions',{}).keys())}")

print("\n=== CUSTOM ATTRIBUTE NAMES (what three.js will see) ===")
seen = set()
for m in J['meshes']:
    for p in m['primitives']:
        for a in p['attributes']:
            if a.startswith('_'):
                seen.add(a)
for a in sorted(seen):
    print(f"  glTF '{a}'  ->  three.js geometry.attributes['{a.lower()}']")
if not seen:
    print("  !! NONE — the custom shard attributes did NOT export")
