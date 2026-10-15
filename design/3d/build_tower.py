# Rebuild the PG tower (scene PGTowerV2, collection PGT2) for the top-down tour (v4: props,
# people, street and cars; scenes hold several labels):
# roof (hero) -> showroom/services -> trading/capability -> lounge/principles -> stair/process
# -> systems/ecosystem -> gallery/use cases (ground) -> plaza (contact).
import bpy, math, random
from mathutils import Vector, Matrix

exec(bpy.data.texts["pg_helpers"].as_string())
SC = bpy.data.scenes["PGTowerV2"]

root = bpy.data.collections.get("PGT2")
if root:
    for o in list(root.all_objects):
        bpy.data.objects.remove(o)
    for c in list(root.children_recursive):
        bpy.data.collections.remove(c)
else:
    root = bpy.data.collections.new("PGT2")
    SC.collection.children.link(root)
stops_coll = bpy.data.collections.new("T2Stops")
root.children.link(stops_coll)

M = lambda n, h, r=0.85, e=0.0: mat(n, h, r, emit=e)
IVORY = M("t_ivory", "#EDE6DA"); STONE = M("t_stone", "#D9CFC0"); INK = M("t_ink", "#2A2725", 0.6)
MUTED = M("t_muted", "#6B645B"); CORAL = M("t_coral", "#FF6946", 0.5, 2.0); SAND = M("t_sand", "#C9AE8C")
GLASS = M("t_window", "#3B3A44", 0.25); FLOOR = M("t_floor", "#E3D9CA", 0.4); CITY = M("t_city", "#7E716A", 0.95)
GROUND = M("t_ground", "#5A4E48", 1.0); LEAF = M("t_leaf", "#7A7A5C", 0.9); PAPER = M("t_paper", "#F7F2E9", 0.9)

W, D = 14.0, 9.0
# floor name, bottom z, height — bottom to top
FLOORS = [("gallery", 0, 6.5), ("eco", 6.5, 6), ("atrium", 12.5, 12), ("lounge", 24.5, 6), ("trade", 30.5, 6), ("show", 36.5, 7)]
Z = {n: z for n, z, h in FLOORS}
TOP = 43.5
SETBACK = 55.0
ROOF = 66.0
C = (7.0, 3.0)       # stair column
HOLE = (2.0, 12.0, -2.0, 8.0)

mb = MB()

def slab(z, hx=W, hy=D, th=0.5, hole=None, m=STONE):
    if not hole:
        mb.box(m, (0, 0, z - th / 2), (2 * hx + 0.6, 2 * hy + 0.6, th)); return
    x0, x1, y0, y1 = hole
    mb.box(m, ((-hx - 0.3 + x0) / 2, 0, z - th / 2), (x0 + hx + 0.3, 2 * hy + 0.6, th))
    mb.box(m, ((x1 + hx + 0.3) / 2, 0, z - th / 2), (hx + 0.3 - x1, 2 * hy + 0.6, th))
    mb.box(m, ((x0 + x1) / 2, (-hy - 0.3 + y0) / 2, z - th / 2), (x1 - x0, y0 + hy + 0.3, th))
    mb.box(m, ((x0 + x1) / 2, (y1 + hy + 0.3) / 2, z - th / 2), (x1 - x0, hy + 0.3 - y1, th))

def solid_wall(axis, pos, a0, a1, z0, h, bay=3.0):
    n = max(1, int((a1 - a0) / bay)); step = (a1 - a0) / n
    for k in range(n + 1):
        a = a0 + k * step
        c = (a, pos, z0 + h / 2) if axis == 'x' else (pos, a, z0 + h / 2)
        mb.box(IVORY, c, (0.7, 0.9, h) if axis == 'x' else (0.9, 0.7, h))
    for k in range(n):
        a = a0 + (k + 0.5) * step
        c = (a, pos, z0 + h / 2 + 0.2) if axis == 'x' else (pos, a, z0 + h / 2 + 0.2)
        mb.box(GLASS, c, (step - 0.7, 0.25, h - 1.6) if axis == 'x' else (0.25, step - 0.7, h - 1.6))
        c2 = (a, pos, z0 + 0.5) if axis == 'x' else (pos, a, z0 + 0.5)
        mb.box(IVORY, c2, (step - 0.7, 0.8, 1.0) if axis == 'x' else (0.8, step - 0.7, 1.0))

for name, z0, h in FLOORS:
    slab(z0, hole=HOLE if name == "lounge" else None)
    if name != "lounge":
        mb.box(FLOOR, (0, 0, z0 + 0.02), (2 * W - 1.2, 2 * D - 1.2, 0.04))
    for k in range(8):
        mb.box(INK, (-W + k * 4.0, -D - 0.1, z0 + h / 2), (0.22, 0.35, h))
    mb.box(IVORY, (0, -D - 0.15, z0 + 0.25), (2 * W + 0.6, 0.5, 0.5))
    solid_wall('x', D, -W, W, z0, h)
    solid_wall('y', -W, -D, D, z0, h)
    solid_wall('y', W, -D, D, z0, h)

def tower_block(z0, z1, hx, hy, floor_h=3.6):
    zz = z0
    while zz < z1 - 0.1:
        hh = min(floor_h, z1 - zz)
        solid_wall('x', -hy, -hx, hx, zz, hh); solid_wall('x', hy, -hx, hx, zz, hh)
        solid_wall('y', -hx, -hy, hy, zz, hh); solid_wall('y', hx, -hy, hy, zz, hh)
        mb.box(STONE, (0, 0, zz), (2 * hx + 0.8, 2 * hy + 0.8, 0.35))
        zz += hh
    mb.box(STONE, (0, 0, z1), (2 * hx + 1.0, 2 * hy + 1.0, 0.6))

tower_block(TOP, SETBACK, W, D)
tower_block(SETBACK, ROOF, 11, 7)
for x in (-W - 0.5, W + 0.5):
    mb.box(INK, (x, -D - 0.4, ROOF / 2), (0.6, 0.8, ROOF))

# roof terrace
R = ROOF
mb.box(SAND, (0, 0, R + 0.35), (21.6, 13.6, 0.1))
for x in (-11, 11):
    mb.box(INK, (x, 0, R + 1.25), (0.08, 14.2, 0.08)); mb.box(INK, (x, 0, R + 0.7), (0.06, 14.2, 0.06))
for y in (-7, 7):
    mb.box(INK, (0, y, R + 1.25), (22.2, 0.08, 0.08)); mb.box(INK, (0, y, R + 0.7), (22.2, 0.06, 0.06))
for k in range(12):
    x = -11 + k * 2.0
    mb.box(INK, (x, -7, R + 0.8), (0.06, 0.06, 0.9)); mb.box(INK, (x, 7, R + 0.8), (0.06, 0.06, 0.9))
for x in (-8, -3, 3):
    mb.box(INK, (x, 4.5, R + 0.9), (3.2, 1.2, 1.0)); mb.ico(LEAF, (x, 4.5, R + 1.8), 0.9, sub=1, scale=(1.6, 0.7, 0.8))
mb.box(INK, (6, 3, R + 1.6), (4, 2.4, 2.2))
mb.cyl(INK, (8.5, 4.5, R + 4), 0.12, 8, seg=6)
mb.box(CORAL, (8.5, 4.5, R + 8.3), (0.9, 0.9, 0.9))
mb.box(STONE, (-4, -2, R + 0.8), (2.4, 0.9, 0.5)); mb.box(STONE, (-4, -2.35, R + 1.3), (2.4, 0.2, 0.6))
mb.box(STONE, (1, -2, R + 0.8), (2.4, 0.9, 0.5)); mb.box(STONE, (1, -2.35, R + 1.3), (2.4, 0.2, 0.6))

random.seed(4)
# showroom (services): 8 plinths in an arc + desk
z = Z["show"]; plinths = []
for k in range(8):
    x = -10.5 + k * 3.0; y = 1.5 + 0.06 * (x * x) / 10
    plinths.append((x, y))
    core = k < 2
    mb.box(INK if core else IVORY, (x, y, z + 0.6), (1.1, 1.1, 1.2))
    m = CORAL if core else INK; top = z + 1.2; shape = k % 4
    if shape == 0: mb.box(m, (x, y, top + 0.35), (0.6, 0.6, 0.6), rotz=0.6)
    elif shape == 1: mb.ico(m, (x, y, top + 0.4), 0.38, sub=1)
    elif shape == 2: mb.cyl(m, (x, y, top + 0.45), 0.3, 0.9, seg=6)
    else: mb.cyl(m, (x, y, top + 0.45), 0.42, 0.9, seg=4, r2=0.02)
mb.box(INK, (0, 6.8, z + 0.55), (8, 1.0, 1.1)); mb.box(STONE, (0, 6.8, z + 1.15), (8.4, 1.2, 0.1))

# trading (capability)
z = Z["trade"]
mb.box(INK, (-7, 8.2, z + 3.2), (9, 0.3, 4.2))
pts = [(-11 + i * 0.5, z + 2.0 + 1.1 * math.sin(i * 0.55) + 0.06 * i) for i in range(17)]
for (x1, z1), (x2, z2) in zip(pts, pts[1:]):
    L = math.hypot(x2 - x1, z2 - z1); ang = math.atan2(z2 - z1, x2 - x1)
    mb.box(CORAL, ((x1 + x2) / 2, 8.0, (z1 + z2) / 2), (L, 0.08, 0.1), tilt=(0, -ang))
for i in range(4):
    mb.box(CORAL if i == 2 else PAPER, (-10.2 + i * 2.2, 8.0, z + 1.6), (1.8, 0.08, 0.5))
mb.box(INK, (-7, 4.5, z + 0.75), (5, 1.4, 0.08))
for i in range(3): mb.box(INK, (-8.6 + i * 1.6, 4.9, z + 1.25), (1.3, 0.08, 0.8))
mb.box(INK, (-7, 4.5, z + 0.38), (4.6, 1.0, 0.75))
for i in range(4):
    mb.box(CORAL if i == 2 else PAPER, (7, 4.0, z + 0.9 + i * 0.75), (3.2, 0.12, 0.62), rotz=0.05 * (i - 1.5))
mb.box(INK, (7, 4.15, z + 1.7), (0.12, 0.2, 3.4))
mb.box(SAND, (7, 1.0, z + 0.75), (3.6, 1.6, 0.08)); mb.box(INK, (7, 1.0, z + 0.37), (3.2, 1.2, 0.72))

# lounge (principles) — stair hole sits behind the sculptures on the right
z = Z["lounge"]
mb.box(SAND, (-6.5, -1, z + 0.03), (14, 6, 0.04))
for x in (-11, -6.5, -2):
    mb.box(STONE, (x, -0.5, z + 0.5), (1.6, 1.6, 1.0))
mb.box(INK, (-11, -0.5, z + 2.2), (0.55, 0.55, 2.4)); mb.box(PAPER, (-11, -0.5, z + 3.75), (0.8, 0.8, 0.8), rotz=0.785)
for k in range(4):
    mb.box(PAPER if k % 2 else INK, (-6.5 + 0.12 * (k % 2) - 0.06, -0.5, z + 1.3 + k * 0.55), (1.2 - 0.15 * k, 1.0 - 0.12 * k, 0.5), rotz=0.14 * k)
for k in range(4):
    mb.box(INK, (-2.8 + 0.45 * k, -0.5, z + 1.15 + k * 0.35), (0.45, 1.0, 0.3 + k * 0.7))
mb.box(CORAL, (-1.3, -0.5, z + 2.9), (0.4, 0.4, 0.4))
for x in (-10, -4):   # glass balustrade around the hole edge
    pass
mb.box(INK, (2.0, 3.0, z + 0.55), (0.06, 10, 0.06)); mb.box(INK, (7.0, -2.0, z + 0.55), (10, 0.06, 0.06))

# atrium (process): spiral stair from the atrium floor up to the lounge hole
z0 = Z["atrium"]
mb.cyl(STONE, (C[0], C[1], z0 + 6), 0.7, 12, seg=12)
STEPS = 40; landing_steps = [36, 28, 20, 12, 4]   # step 1 of the process is the top landing
landing = {}
for s in range(STEPS):
    th = math.radians(-90) + s * (2 * math.pi * 1.25 / STEPS)
    zz = z0 + 0.3 * (s + 1)
    big = s in landing_steps
    r_in, r_out = 0.7, 3.8; mid = (r_in + r_out) / 2
    mb.box(PAPER if big else IVORY, (C[0] + math.cos(th) * mid, C[1] + math.sin(th) * mid, zz - 0.08),
           (r_out - r_in, 1.6 if big else 0.62, 0.16), rotz=th)
    mb.box(INK, (C[0] + math.cos(th) * (r_out - 0.05), C[1] + math.sin(th) * (r_out - 0.05), zz + 0.5), (0.06, 0.06, 1.0))
    if big:
        pth = th + 0.12
        px, py = C[0] + math.cos(pth) * 5.0, C[1] + math.sin(pth) * 5.0
        mb.box(INK, (px, py, zz + 0.6), (0.12, 0.12, 1.2))
        mb.box(PAPER, (px, py, zz + 1.35), (1.1, 0.08, 0.7), rotz=pth + math.pi / 2)
        mb.box(CORAL, (px, py, zz + 1.85), (0.18, 0.18, 0.18), rotz=th)
        landing[s] = (pth, Vector((px, py, zz + 1.35)))

# systems room (ecosystem)
z = Z["eco"]; node_x = [-10, -6, -2, 2]
for i, x in enumerate(node_x):
    if i == 2:
        mb.cyl(INK, (x, 2, z + 0.5), 0.8, 1.0, seg=8); mb.ico(CORAL, (x, 2, z + 1.9), 0.85, sub=1)
    else:
        mb.box(IVORY, (x, 2, z + 1.4), (1.4, 1.4, 2.8))
        for k in range(4): mb.box(INK, (x, 1.28, z + 0.6 + k * 0.6), (1.0, 0.05, 0.12))
    if i < 3:
        mb.cyl(MUTED, ((x + node_x[i + 1]) / 2, 2, z + 2.2), 0.14, 3.0, seg=6, rot=Matrix.Rotation(math.pi / 2, 4, 'Y'))
mb.box(INK, (-4, 2, z + 5.3), (15, 0.4, 0.4))
for x in node_x: mb.cyl(MUTED, (x, 2, z + 4.2), 0.1, 2.0, seg=6)

# gallery (use cases) — ground floor with the entrance
z = Z["gallery"]; gal_x = [-9, -3, 3, 9]
for x in gal_x:
    mb.box(INK, (x, 8.0, z + 2.3), (3.2, 0.2, 2.6)); mb.box(PAPER, (x, 7.85, z + 2.3), (2.8, 0.1, 2.2))
    mb.box(CORAL, (x - 1.15, 7.78, z + 3.2), (0.22, 0.04, 0.22))
    mb.box(STONE, (x, 5.6, z + 0.25), (2.4, 0.6, 0.5))
mb.box(INK, (0, -D - 1.6, 4.6), (10, 3.2, 0.3))   # entrance canopy

# plaza, ground, city
mb.box(GROUND, (0, 0, -0.3), (700, 700, 0.4))
mb.box(STONE, (0, -22, -0.05), (46, 26, 0.12))
for x in (-16, -8, 8, 16):
    mb.box(INK, (x, -24, 0.4), (2.4, 2.4, 0.8)); mb.ico(LEAF, (x, -24, 2.0), 1.2, sub=1, jitter=0.15)
for x in (-12, 12):
    mb.cyl(INK, (x, -30, 2.2), 0.08, 4.4, seg=6); mb.box(PAPER, (x, -30, 4.5), (0.5, 0.5, 0.3))
random.seed(11)
for k in range(140):
    ang = random.uniform(0, 2 * math.pi); rr = random.uniform(55, 260)
    x, y = rr * math.cos(ang), rr * math.sin(ang)
    hgt = random.uniform(8, 48) * (1.4 if rr < 120 else 1.0) * 0.5
    w = random.uniform(8, 18); d = random.uniform(8, 18)
    if y < -28 and -120 < x < 50: continue
    if -66 < x < 66 and -60 < y < 48: continue      # keep the street ring clear
    mb.box(CITY, (x, y, hgt / 2), (w, d, hgt), rotz=random.uniform(-0.3, 0.3))
    for j in range(int(hgt / 3)):
        if random.random() < 0.45: mb.box(GLASS, (x, y, 1.5 + j * 2.75), (w + 0.1, d + 0.1, 0.45))

# ===================== props: low-poly furniture, people, art, street =====================
LIGHT = M("t_light", "#FFD9A8", 0.4, 0.0)     # lamps/headlights — the web turns them up at dusk
ROAD = M("t_road", "#4A4440", 0.95)
SHIRTS = [INK, STONE, IVORY, MUTED, CORAL, SAND]

def rot2(lx, ly, r):
    c, s = math.cos(r), math.sin(r)
    return lx * c - ly * s, lx * s + ly * c

class Put:
    """place parts in local coordinates around (x, y, z) rotated by r (radians about Z)"""
    def __init__(self, m, x, y, z, r=0.0):
        self.m, self.x, self.y, self.z, self.r = m, x, y, z, r
    def w(self, lx, ly, lz):
        dx, dy = rot2(lx, ly, self.r)
        return (self.x + dx, self.y + dy, self.z + lz)
    def box(self, mat_, l, size, rz=0.0, tilt=(0, 0), bevel=0.0):
        self.m.box(mat_, self.w(*l), size, rotz=self.r + rz, tilt=tilt, bevel=bevel)
    def cyl(self, mat_, l, r, h, seg=8, r2=None):
        self.m.cyl(mat_, self.w(*l), r, h, seg=seg, r2=r2, rotz=self.r)
    def ico(self, mat_, l, r, sub=1, scale=(1, 1, 1), jitter=0.0):
        self.m.ico(mat_, self.w(*l), r, sub=sub, scale=scale, jitter=jitter)

def person(m, x, y, z, r=0.0, pose="stand", shirt=None, seed=0):
    """Placeholder spots from the people pass, now dressed with objects instead of figures:
    display kiosks, sculptures, tall planters and lamps. Seated spots stay empty (the chair
    is already there)."""
    if pose == "sit":
        return
    rnd = random.Random(seed)
    kind = rnd.choice(["kiosk", "sculpture", "planter", "lamp", "kiosk"])
    p = Put(m, x, y, z, r)
    if kind == "kiosk":
        p.box(INK, (0, 0, 0.55), (0.5, 0.4, 1.1))
        p.box(INK, (0, 0, 1.45), (0.9, 0.08, 0.6), tilt=(-0.25, 0))
        p.box(CORAL if rnd.random() < 0.35 else LIGHT, (0, -0.06, 1.45), (0.8, 0.02, 0.5), tilt=(-0.25, 0))
    elif kind == "sculpture":
        p.box(STONE, (0, 0, 0.45), (0.7, 0.7, 0.9))
        p.box(shirt or rnd.choice([INK, CORAL, PAPER]), (0, 0, 1.25), (0.45, 0.45, 0.7), rz=0.6)
        p.ico(PAPER, (0, 0, 1.85), 0.22, sub=1)
    elif kind == "planter":
        plant(m, x, y, z, big=True, seed=seed)
    else:
        floor_lamp(m, x, y, z)

def chair(m, x, y, z, r=0.0):
    p = Put(m, x, y, z, r)
    p.box(INK, (0, 0, 0.46), (0.5, 0.5, 0.08)); p.box(INK, (0, 0.23, 0.78), (0.5, 0.06, 0.56))
    p.cyl(MUTED, (0, 0, 0.22), 0.04, 0.44, seg=5); p.box(MUTED, (0, 0, 0.03), (0.55, 0.08, 0.04)); p.box(MUTED, (0, 0, 0.03), (0.08, 0.55, 0.04))

def desk(m, x, y, z, r=0.0, screens=1):
    p = Put(m, x, y, z, r)
    p.box(SAND, (0, 0, 0.74), (1.6, 0.8, 0.05))
    for sx in (-0.75, 0.75): p.box(INK, (sx, 0, 0.36), (0.05, 0.7, 0.72))
    for k in range(screens):
        sx = (k - (screens - 1) / 2) * 0.62
        p.box(INK, (sx, 0.22, 1.03), (0.56, 0.04, 0.34)); p.box(INK, (sx, 0.24, 0.8), (0.06, 0.06, 0.12))
    p.box(PAPER, (0.45, -0.15, 0.78), (0.3, 0.22, 0.02))

def sofa(m, x, y, z, r=0.0, w=2.0, mat_=None):
    mat_ = mat_ or STONE; p = Put(m, x, y, z, r)
    p.box(mat_, (0, 0, 0.22), (w, 0.85, 0.44), bevel=0.04); p.box(mat_, (0, 0.33, 0.6), (w, 0.2, 0.5), bevel=0.04)
    for sx in (-w / 2 + 0.1, w / 2 - 0.1): p.box(mat_, (sx, 0, 0.5), (0.2, 0.85, 0.3), bevel=0.03)

def armchair(m, x, y, z, r=0.0, mat_=None):
    sofa(m, x, y, z, r, w=0.9, mat_=mat_ or INK)

def table(m, x, y, z, r=0.0, w=1.0, d=0.6, h=0.42, top=None):
    p = Put(m, x, y, z, r)
    p.box(top or SAND, (0, 0, h), (w, d, 0.05))
    p.cyl(INK, (0, 0, h / 2), 0.05, h, seg=5)

def plant(m, x, y, z, big=False, seed=0):
    s = 1.5 if big else 1.0
    m.cyl(INK, (x, y, z + 0.25 * s), 0.22 * s, 0.5 * s, seg=7, r2=0.17 * s)
    m.ico(LEAF, (x, y, z + 0.85 * s), 0.42 * s, sub=1, jitter=0.06, scale=(1, 1, 1.25))

def floor_lamp(m, x, y, z):
    m.cyl(INK, (x, y, z + 0.8), 0.025, 1.6, seg=5); m.cyl(LIGHT, (x, y, z + 1.65), 0.2, 0.25, seg=8, r2=0.12)

def pendant(m, x, y, z):
    m.cyl(INK, (x, y, z - 0.6), 0.01, 1.2, seg=4); m.cyl(LIGHT, (x, y, z - 1.3), 0.32, 0.22, seg=10, r2=0.05)

ART = [(CORAL, INK, PAPER), (INK, STONE, CORAL), (SAND, PAPER, INK), (MUTED, PAPER, CORAL)]
def artwork(m, x, y, z, w=1.6, h=1.1, facing=-1, style=0):
    """frame on a wall parallel to X; facing -1 = facing -Y (towards the front)"""
    a, b, c = ART[style % len(ART)]
    dy = 0.05 * facing
    m.box(INK, (x, y, z), (w + 0.1, 0.05, h + 0.1))
    m.box(PAPER, (x, y + dy, z), (w, 0.04, h))
    m.box(a, (x - w * 0.18, y + dy * 2, z + h * 0.1), (w * 0.42, 0.03, h * 0.6))
    m.box(b, (x + w * 0.2, y + dy * 2, z - h * 0.15), (w * 0.3, 0.03, h * 0.4))
    m.box(c, (x + w * 0.28, y + dy * 2.5, z + h * 0.25), (w * 0.12, 0.03, w * 0.12))

def rug(m, x, y, z, w, d, mat_=None):
    m.box(mat_ or SAND, (x, y, z + 0.015), (w, d, 0.03))

def bookshelf(m, x, y, z, r=0.0):
    p = Put(m, x, y, z, r)
    p.box(INK, (0, 0, 1.0), (1.6, 0.4, 2.0))
    for k in range(4):
        p.box(PAPER if k % 2 else STONE, (-0.3 + 0.2 * k, -0.05, 0.4 + 0.45 * k), (0.6, 0.32, 0.3))

def bench(m, x, y, z, r=0.0, l=2.0):
    p = Put(m, x, y, z, r)
    p.box(SAND, (0, 0, 0.44), (l, 0.5, 0.06))
    for sx in (-l / 2 + 0.15, l / 2 - 0.15): p.box(INK, (sx, 0, 0.21), (0.08, 0.45, 0.42))

def tree(m, x, y, z=0.0, seed=0):
    rnd = random.Random(seed); hgt = rnd.uniform(3.5, 5.0)
    m.cyl(MUTED, (x, y, z + hgt / 2), 0.14, hgt, seg=6)
    m.ico(LEAF, (x, y, z + hgt + 0.6), rnd.uniform(1.4, 1.9), sub=1, jitter=0.25, scale=(1, 1, 1.15))

def lamp_post(m, x, y, z=0.0):
    m.cyl(INK, (x, y, z + 2.6), 0.07, 5.2, seg=6); m.box(INK, (x + 0.4, y, z + 5.15), (0.9, 0.12, 0.1))
    m.box(LIGHT, (x + 0.75, y, z + 5.05), (0.35, 0.22, 0.08))

def lounger(m, x, y, z, r=0.0):
    p = Put(m, x, y, z, r)
    p.box(PAPER, (0, 0, 0.32), (0.7, 1.8, 0.1)); p.box(PAPER, (0, 0.75, 0.55), (0.7, 0.5, 0.08), tilt=(-0.7, 0))
    p.box(INK, (0, -0.7, 0.14), (0.66, 0.06, 0.28)); p.box(INK, (0, 0.6, 0.14), (0.66, 0.06, 0.28))

def umbrella(m, x, y, z):
    m.cyl(INK, (x, y, z + 1.2), 0.04, 2.4, seg=5); m.cyl(IVORY, (x, y, z + 2.45), 1.4, 0.45, seg=8, r2=0.05)

# ---- showroom (services)
z = Z["show"]
rug(mb, 0, 1.8, z, 24, 4.5, STONE)
for i, (x, y) in enumerate(plinths):
    pendant(mb, x, y, z + 7.0)
for k, (x, y, r, pose) in enumerate([(-9.0, -1.5, 0.3, "stand"), (-5.8, -2.4, -0.2, "talk"), (-5.2, -2.6, 2.9, "stand"),
                                     (0.2, -1.8, 0.0, "stand"), (3.2, -2.8, 0.5, "walk"), (9.2, -1.6, -0.4, "stand"),
                                     (2.0, 5.6, 3.14, "stand")]):
    person(mb, x, y, z, r, pose, seed=100 + k)
sofa(mb, -4, 4.4, z, 0, 2.6); sofa(mb, 4, 4.4, z, 0, 2.6, INK)
table(mb, -4, 3.4, z, 0, 1.2, 0.6); table(mb, 4, 3.4, z, 0, 1.2, 0.6)
for x in (-12.5, 12.5): plant(mb, x, 7.0, z, big=True, seed=x)
for k, x in enumerate((-9, -4.5, 4.5, 9)): artwork(mb, x, 8.45, z + 3.6, 2.4, 1.6, -1, k)

# ---- trading floor (capability)
z = Z["trade"]
for k, (x, y) in enumerate([(-9.5, 1.2), (-5.5, 1.2), (3.0, 0.8)]):
    desk(mb, x, y, z, 0, screens=2 if k < 2 else 1); chair(mb, x, y - 0.7, z, math.pi)
    person(mb, x, y - 0.7, z, math.pi, "sit", seed=200 + k)
person(mb, -8.6, 6.6, z, math.pi, "talk", seed=210); person(mb, -6.0, 6.4, z, math.pi - 0.3, "stand", seed=211)
person(mb, 6.0, 2.3, z, 0.4, "stand", shirt=CORAL, seed=212)
for x in (-12.6, 12.6): plant(mb, x, -7.5, z, seed=x)
pendant(mb, -7, 4.5, z + 6.0); pendant(mb, 7, 2.5, z + 6.0); pendant(mb, 0, 1, z + 6.0)
artwork(mb, 11.0, 8.45, z + 3.2, 2.0, 1.3, -1, 1)

# ---- lounge (principles)
z = Z["lounge"]
mb.box(INK, (-8.0, 7.6, z + 0.55), (6, 0.9, 1.1)); mb.box(STONE, (-8.0, 7.6, z + 1.15), (6.2, 1.0, 0.08))
for k in range(4): mb.cyl(INK, (-10 + k * 1.3, 6.6, z + 0.38), 0.18, 0.76, seg=6)
person(mb, -9.4, 6.3, z, 0.2, "talk", seed=300); person(mb, -8.3, 6.2, z, -0.3, "stand", shirt=CORAL, seed=301)
sofa(mb, -6.5, -5.6, z, math.pi, 3.0); armchair(mb, -10.0, -4.6, z, math.pi + 0.5); armchair(mb, -3.0, -4.6, z, math.pi - 0.5, STONE)
table(mb, -6.5, -4.2, z, 0, 1.4, 0.7)
person(mb, -6.0, -5.4, z, math.pi, "sit", seed=302)
bookshelf(mb, -13.3, 2.0, z, math.pi / 2)
floor_lamp(mb, -12.5, -6.5, z); floor_lamp(mb, -0.5, -6.5, z)
plant(mb, -0.2, 6.8, z, big=True, seed=3); plant(mb, -13.0, -7.5, z, seed=4)
for k, x in enumerate((-11, -6.5, -2)): artwork(mb, x, 8.45, z + 3.4, 1.8, 1.2, -1, k + 1)

# ---- atrium (process)
z = Z["atrium"]
plant(mb, 1.5, 6.5, z, big=True, seed=5); plant(mb, 12.5, -6.5, z, big=True, seed=6); plant(mb, -10, 6.5, z, seed=7)
person(mb, 3.6, -1.5, z, 0.8, "stand", seed=400); person(mb, 4.4, -2.1, z, 3.6, "talk", shirt=CORAL, seed=401)
bench(mb, -6, -4, z, 0, 3.0); person(mb, -6.4, -4.1, z + 0.0, 0, "sit", seed=402)
for k, x in enumerate((-10, -4)): artwork(mb, x, 8.45, z + 4.5, 3.4, 2.4, -1, k + 2)

# ---- systems room (ecosystem)
z = Z["eco"]
for k, (x, r) in enumerate([(-8.0, math.pi), (0.0, math.pi)]):
    desk(mb, x, -3.0, z, 0, screens=3); chair(mb, x, -3.7, z, math.pi); person(mb, x, -3.7, z, math.pi, "sit", seed=500 + k)
person(mb, -3.6, 0.0, z, -0.6, "stand", shirt=CORAL, seed=510); person(mb, 3.9, 1.2, z, 0.9, "talk", seed=511)
for x in (-12.6, 12.6): plant(mb, x, 7.4, z, seed=x + 1)
artwork(mb, 9.0, 8.45, z + 3.2, 2.2, 1.4, -1, 3)

# ---- gallery (use cases), ground floor
z = Z["gallery"]
for k, (x, y, r, pose) in enumerate([(-9.6, 4.4, 0.2, "stand"), (-8.4, 4.6, -0.3, "talk"), (-3.0, 4.2, 0, "stand"),
                                     (2.6, 4.5, 0.1, "stand"), (3.7, 4.4, -0.4, "talk"), (9.3, 4.3, 0.2, "stand"),
                                     (0.0, -3.5, 1.6, "walk")]):
    person(mb, x, y, z, r, pose, seed=600 + k)
for x in (-12.6, 12.6): plant(mb, x, -7.2, z, big=True, seed=x + 2)
pendant(mb, -6, 5, z + 6.5); pendant(mb, 0, 5, z + 6.5); pendant(mb, 6, 5, z + 6.5)

# ---- roof terrace (hero)
for k, x in enumerate((-9.0, -7.4, -5.8)):
    lounger(mb, x, -4.6, R + 0.4, 0.0)
umbrella(mb, -7.4, -2.6, R + 0.4)
table(mb, 2.5, -4.5, R + 0.4, 0, 0.8, 0.8, 0.72, PAPER)
for k, (x, y, r, pose) in enumerate([(1.6, -4.4, 1.6, "talk"), (3.4, -4.6, -1.5, "stand"), (-7.4, -4.6, 0, "sit"), (-1.8, 1.5, 2.4, "walk")]):
    person(mb, x, y, R + 0.4, r, pose, shirt=CORAL if k == 1 else None, seed=700 + k)

# ---- street ring + plaza dressing (cars drive on the ring: x = ±ROAD_X, y = ROAD_Y0..ROAD_Y1)
ROAD_X, ROAD_Y0, ROAD_Y1, ROAD_W = 52.0, -46.0, 34.0, 9.0
def road(x0, y0, x1, y1):
    mb.box(ROAD, ((x0 + x1) / 2, (y0 + y1) / 2, 0.02), (abs(x1 - x0) or ROAD_W, abs(y1 - y0) or ROAD_W, 0.06))
road(-ROAD_X - ROAD_W / 2, ROAD_Y0, ROAD_X + ROAD_W / 2, ROAD_Y0)
road(-ROAD_X - ROAD_W / 2, ROAD_Y1, ROAD_X + ROAD_W / 2, ROAD_Y1)
road(-ROAD_X, ROAD_Y0, -ROAD_X, ROAD_Y1)
road(ROAD_X, ROAD_Y0, ROAD_X, ROAD_Y1)
for k in range(22):     # lane dashes
    t = -ROAD_X + 5 + k * (2 * ROAD_X - 10) / 21
    mb.box(PAPER, (t, ROAD_Y0, 0.06), (2.0, 0.18, 0.02)); mb.box(PAPER, (t, ROAD_Y1, 0.06), (2.0, 0.18, 0.02))
for k in range(16):
    t = ROAD_Y0 + 5 + k * (ROAD_Y1 - ROAD_Y0 - 10) / 15
    mb.box(PAPER, (-ROAD_X, t, 0.06), (0.18, 2.0, 0.02)); mb.box(PAPER, (ROAD_X, t, 0.06), (0.18, 2.0, 0.02))
for k in range(9):      # crossing in front of the plaza
    mb.box(PAPER, (-6 + k * 1.5, ROAD_Y0, 0.07), (0.8, ROAD_W - 1, 0.02))
for k in range(10):
    x = -44 + k * 9.8
    if abs(x) > 6: lamp_post(mb, x, ROAD_Y0 + ROAD_W / 2 + 1.0)
    tree(mb, x + 4.5, ROAD_Y0 + ROAD_W / 2 + 2.6, seed=k)
for k in range(7):
    y = ROAD_Y0 + 10 + k * 11
    tree(mb, -ROAD_X + ROAD_W / 2 + 2.4, y, seed=20 + k); tree(mb, ROAD_X - ROAD_W / 2 - 2.4, y, seed=40 + k)
mb.box(STONE, (0, ROAD_Y0 + ROAD_W / 2 + 2.2, 0.05), (2 * ROAD_X, 3.6, 0.12))      # sidewalk
bench(mb, -18, -36.5, 0, 0, 2.4); bench(mb, 18, -36.5, 0, 0, 2.4)
# bus shelter
mb.box(INK, (26, -38.5, 1.3), (5, 0.1, 2.6)); mb.box(INK, (26, -37.6, 2.65), (5.2, 2.0, 0.1)); bench(mb, 26, -38.0, 0, math.pi, 3.5)
for k, (x, y, r, pose) in enumerate([(-3.5, -12.5, 0.2, "stand"), (-2.4, -12.9, 2.9, "talk"), (6.5, -15.0, 1.2, "stand"),
                                     (-18.2, -36.6, math.pi, "sit"), (25.0, -38.0, math.pi, "sit"), (27.2, -37.4, 0.3, "stand")]):
    person(mb, x, y, 0.0, r, pose, shirt=CORAL if k == 2 else None, seed=800 + k)

objs = mb.emit("T2", root)
tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)

# ===================== movers: templates the web clones and drives =====================
movers = bpy.data.collections.new("T2Movers"); root.children.link(movers)
def template(name, build, parent_loc=(0, -200, 0)):
    holder = bpy.data.objects.new(name, None); holder.location = parent_loc; movers.objects.link(holder)
    mm = MB(); build(mm)
    for o in mm.emit(name, movers):
        o.parent = holder
    return holder

def car(body):
    def build(m):
        m.box(body, (0, 0, 0.62), (4.3, 1.8, 0.62), bevel=0.06)
        m.box(GLASS, (-0.15, 0, 1.18), (2.3, 1.62, 0.55), bevel=0.05)
        m.box(body, (-0.15, 0, 1.47), (2.2, 1.55, 0.06))
        for wx in (-1.35, 1.35):
            for wy in (-0.86, 0.86):
                m.cyl(INK, (wx, wy, 0.33), 0.33, 0.24, seg=8, rot=Matrix.Rotation(math.pi / 2, 4, 'X'))
        for wy in (-0.6, 0.6):
            m.box(LIGHT, (2.16, wy, 0.72), (0.04, 0.32, 0.14))
            m.box(CORAL, (-2.16, wy, 0.72), (0.04, 0.3, 0.12))
    return build
template("car_sedan", car(IVORY)); template("car_suv", car(INK)); template("car_taxi", car(CORAL)); template("car_stone", car(STONE))

# ===================== tour scenes (order = STOPS in src/features/tower/tour.ts) =====================
idx = [0]
def scene(cam, look, pins=()):
    i = idx[0]; idx[0] += 1
    empty(f"stop_{i:02d}_cam", cam, stops_coll); empty(f"stop_{i:02d}_look", look, stops_coll)
    for k, p in enumerate(pins):
        empty(f"stop_{i:02d}_pin_{k}", p, stops_coll, 'SPHERE')
def ext(zmid, x=0.0):
    scene((x, -30, zmid + 1), (x * 0.3, 0, zmid))

# One camera pose per web section (order = SCENES in src/features/tower/scenes.ts). The page reads
# top to bottom, so the floors do too: every move goes one floor down — never back up — and each
# pose sits outside the open front facade, so the camera glides down the building between them.
OUT = -16.0
za = Z["atrium"]
scene((-30, -62, 58), (2, 0, 46))                                                    # 0 hero: the tower top at blue hour
scene((-0.5, OUT - 1.5, Z["show"] + 3.7), (0.3, 2.0, Z["show"] + 1.8))               # 1 about: showroom (L7)
scene((0.0, OUT - 0.5, Z["trade"] + 3.5), (0.6, 5.0, Z["trade"] + 2.4))              # 2 services: trading room (L6)
scene((-6.0, OUT, Z["lounge"] + 3.4), (-5.4, 0.0, Z["lounge"] + 2.2))                # 3 why PG: lounge (L5)
scene((5.5, OUT - 3.0, za + 7.5), (7.0, 3.0, za + 6.5))                              # 4 ecosystem: spiral stair (L4)
scene((-4.0, OUT, Z["eco"] + 3.4), (-3.6, 2.0, Z["eco"] + 1.9))                      # 5 process: systems room (L2)
scene((0.0, OUT, Z["gallery"] + 3.2), (0.0, 8.0, Z["gallery"] + 2.3))                # 6 use cases: gallery (L)
scene((-16, -48, 2.2), (2, 0, 9))                                                    # 7 contact: the plaza at night
print("STOPS", idx[0], "TRIS", tris)
bpy.ops.wm.save_mainfile()
