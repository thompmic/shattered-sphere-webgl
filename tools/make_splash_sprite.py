# -*- coding: utf-8 -*-
"""Mascot build-loop. Chibi proportions: head is ~half the height."""
from PIL import Image
import sys

PAL = {
    '.': None,
    'K': (30, 20, 38),      # dreads / outline
    'S': (186, 124, 72),    # skin
    'E': (24, 16, 28),      # eye
    'P': (255, 122, 162),   # headphone cans
    'A': (226, 92, 130),    # headphone shadow
    'T': (48, 184, 163),    # puffer teal
    'O': (243, 149, 60),    # puffer orange
    'U': (120, 92, 208),    # trousers
    'W': (244, 238, 232),   # trainers
    'H': (168, 176, 190),   # hammer head
    'B': (150, 98, 54),     # hammer handle
    'R': (240, 80, 74),     # block  --accent
    'G': (139, 0, 0),       # block shade --accent-deep
    'Y': (255, 233, 168),   # spark
}

# Everything except the swinging arm + hammer + sparks is shared.
BODY = [
    "..........................",
    ".....KKKKKKKK.............",
    "....KKKKKKKKKK............",
    "...KKKKKKKKKKKK...........",
    "..PPKKKKKKKKKKPP..........",
    "..PAKSSSSSSSSKAP..........",
    "..PASSSSSSSSSSAP..........",
    "..PASSEESSEESSAP..........",
    "..PASSEESSEESSAP..........",
    "..PASSSSSSSSSSAP..........",
    "...KSSSSKKSSSSK...........",
    "....SSSSSSSSSS............",
    ".....KKKKKKKK.............",
    "....TTTTTTTTTT............",
    "...TTTTTOOTTTTT...........",
    "...TTTTOOOOTTTT...........",
    "...TTTTTOOTTTTT...........",
    "....TTTTTTTTTT............",
    ".....UUUUUUUU.............",
    ".....UU....UU.............",
    ".....UU....UU.............",
    "....WWW....WWW............",
    "..........................",
    "..........................",
]

# per-frame overlay: (row, col, char)
def overlay(base, cells):
    g = [list(r) for r in base]
    for y, x, ch in cells:
        if 0 <= y < len(g) and 0 <= x < len(g[0]):
            g[y][x] = ch
    return [''.join(r) for r in g]

ANVIL = [(19, c, 'R') for c in range(17, 23)] +         [(20, c, 'R') for c in range(17, 23)] +         [(21, c, 'G') for c in range(17, 23)]

def thick(pts, ch):
    """2px-wide limb: a single-pixel diagonal reads as wire, not as an arm."""
    out = []
    for y, x in pts:
        out += [(y, x, ch), (y + 1, x, ch)]
    return out

def head(x0, y0, w=4, h=3):
    return [(y0 + dy, x0 + dx, 'H') for dy in range(h) for dx in range(w)]

# F0 hammer high, F1 mid, F2 struck (+sparks), F3 mid (recover)
F0 = overlay(BODY, ANVIL
             + thick([(13, 15), (12, 16), (11, 17)], 'S')
             + thick([(10, 18), (9, 19)], 'B')
             + head(18, 6))
F1 = overlay(BODY, ANVIL
             + thick([(14, 15), (14, 16), (13, 17)], 'S')
             + thick([(13, 18), (12, 19)], 'B')
             + head(19, 10))
F2 = overlay(BODY, ANVIL
             + thick([(14, 15), (15, 16), (15, 17)], 'S')
             + thick([(16, 18), (16, 19)], 'B')
             + head(18, 16)
             + [(18, 15, 'Y'), (17, 16, 'Y'), (18, 23, 'Y'), (17, 22, 'Y')])
F3 = F1

FRAMES = [F0, F1, F2, F3]
W, H = len(BODY[0]), len(BODY)
sheet = Image.new('RGBA', (W*len(FRAMES), H), (0,0,0,0))
for n, f in enumerate(FRAMES):
    assert len(f) == H and all(len(r) == W for r in f), "frame %d ragged" % n
    for y, row in enumerate(f):
        for x, ch in enumerate(row):
            c = PAL[ch]
            if c: sheet.putpixel((n*W+x, y), c+(255,))

out = sys.argv[1]
sheet.save(out+'/build-sprite.png', optimize=True)
print("sheet %dx%d  %d frames of %dx%d  %d B" % (sheet.size+(len(FRAMES),W,H,len(open(out+'/build-sprite.png','rb').read()))))
Z = 10
prev = Image.new('RGB', (len(FRAMES)*(W+2)*Z, H*Z), (10,8,14))
for n in range(len(FRAMES)):
    fr = sheet.crop((n*W,0,(n+1)*W,H)).resize((W*Z,H*Z), Image.NEAREST)
    prev.paste(fr, (n*(W+2)*Z, 0), fr)
prev.save(out+'/preview.png')
