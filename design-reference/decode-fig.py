import struct, sys, json, zstandard, zlib

class R:
    def __init__(s, d): s.d=d; s.i=0; s.bit=0
    def byte(s):
        b=s.d[s.i]; s.i+=1; return b
    def bool(s): return s.byte()!=0
    def varu(s):
        v=0; sh=0
        while True:
            b=s.byte(); v |= (b&0x7f)<<sh; sh+=7
            if not (b&0x80): break
        return v
    def vari(s):
        v=s.varu()
        return (v>>1) if not (v&1) else (~(v>>1))
    def u32(s):
        v=struct.unpack_from('<I',s.d,s.i)[0]; s.i+=4; return v
    def f32(s):
        # kiwi float encoding
        first=s.d[s.i]
        if first==0: s.i+=1; return 0.0
        b=s.d[s.i:s.i+4]; s.i+=4
        bits=struct.unpack('<I',b)[0]
        bits=((bits<<23)|(bits>>9))&0xffffffff
        return struct.unpack('<f',struct.pack('<I',bits))[0]
    def string(s):
        out=bytearray()
        while True:
            b=s.byte()
            if b==0: break
            out.append(b)
        return out.decode('utf-8','replace')

TYPE_BOOL=-1; TYPE_BYTE=-2; TYPE_INT=-3; TYPE_UINT=-4; TYPE_FLOAT=-5; TYPE_STRING=-6; TYPE_INT64=-7; TYPE_UINT64=-8

def parse_schema(d):
    r=R(d); n=r.varu(); defs=[]
    for _ in range(n):
        name=r.string(); kind=r.byte(); fc=r.varu(); fields=[]
        for _ in range(fc):
            fn=r.string(); ft=r.vari(); arr=r.bool(); val=r.varu()
            fields.append({'name':fn,'type':ft,'array':arr,'value':val})
        defs.append({'name':name,'kind':kind,'fields':fields})
    return defs

def decode(r, defs, idx, depth=0):
    if depth>60: return '...'
    d=defs[idx]
    if d['kind']==0:  # enum
        v=r.varu()
        for f in d['fields']:
            if f['value']==v: return f['name']
        return v
    if d['kind']==1:  # struct
        return {f['name']: read_field(r,defs,f,depth) for f in d['fields']}
    out={}
    while True:
        t=r.varu()
        if t==0: break
        f=next((x for x in d['fields'] if x['value']==t), None)
        if f is None: raise ValueError('unknown field %d in %s'%(t,d['name']))
        out[f['name']]=read_field(r,defs,f,depth)
    return out

def read_field(r, defs, f, depth):
    def one():
        t=f['type']
        if t==TYPE_BOOL: return r.bool()
        if t==TYPE_BYTE: return r.byte()
        if t==TYPE_INT: return r.vari()
        if t==TYPE_UINT: return r.varu()
        if t==TYPE_FLOAT: return r.f32()
        if t==TYPE_STRING: return r.string()
        if t in (TYPE_INT64,TYPE_UINT64): return r.varu()
        return decode(r,defs,t,depth+1)
    if f['array']:
        n=r.varu(); return [one() for _ in range(n)]
    return one()

raw=open(sys.argv[1],'rb').read()
pos=12; blocks=[]
while pos+4<=len(raw):
    ln=struct.unpack_from('<I',raw,pos)[0]; pos+=4; blocks.append(raw[pos:pos+ln]); pos+=ln
schema=zlib.decompressobj(-15).decompress(blocks[0])
data=zstandard.ZstdDecompressor().decompressobj().decompress(blocks[1])
defs=parse_schema(schema)
names={d['name']:i for i,d in enumerate(defs)}
r=R(data)
msg_idx=names.get('Message')
root=decode(r,defs,msg_idx)
json.dump(root, open(sys.argv[2],'w'), indent=1, default=str)
print('nodes', len(root.get('nodeChanges',[])))
