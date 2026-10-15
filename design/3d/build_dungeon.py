# Design 1 — the stone dungeon tower (scene PGTower, collection PGTower), rebuilt with more detail:
# irregular stones with moss, arched doorways, glowing window slits, torches, and a furnished
# chamber per page section. Same chamber layout and camera empties (cam_i / tgt_i) as the first
# version, so src/designs/v1/tower reads it unchanged.
#
#   blender -b design/3d/pg-tower.blend --python design/3d/build_dungeon.py
#   blender -b design/3d/pg-tower.blend --python design/3d/export_dungeon.py -- public/models/pg-tower-v1b.glb
import bpy, math, random
from mathutils import Vector, Matrix

exec(bpy.data.texts["pg_helpers"].as_string())

SC = bpy.data.scenes.get("PGTower") or bpy.data.scenes.new("PGTower")
root = bpy.data.collections.get("PGTower")
if root:
    for o in list(root.all_objects):
        bpy.data.objects.remove(o)
    for c in list(root.children_recursive):
        bpy.data.collections.remove(c)
else:
    root = bpy.data.collections.new("PGTower")
    SC.collection.children.link(root)

M = lambda n, h, r=0.9, e=0.0: mat(n, h, r, emit=e)
STONE_A = M("d_stone_a", "#4A3D33"); STONE_B = M("d_stone_b", "#3B312A"); STONE_C = M("d_stone_c", "#5A4A3D")
DARK = M("d_dark", "#1F1915"); WOOD = M("d_wood", "#5E3D24", 0.8); IRON = M("d_iron", "#2C2724", 0.5)
MOSS = M("d_moss", "#4A5636"); CLOTH = M("d_cloth", "#7E2A20", 0.85); PARCH = M("d_parch", "#E3CFA6", 0.85)
GOLD = M("d_gold", "#D9A044", 0.35)
FLAME = M("d_flame", "#FF8A3D", 0.5)        # emissive + flicker set in the web
WINDOW = M("d_window", "#FF9A4A", 0.5)      # emissive set in the web
LAVA = M("d_lava", "#FF5A1F", 0.5)          # emissive set in the web
STONES = [STONE_A, STONE_B, STONE_C]

CH = [0, -10, -20, -30, -40, -50, -60, -70]
R = 6.0
def theta(i): return math.radians(22.5 + 45 * i)

def frame(i):
    """local frame of chamber i: r = right, u = towards its doorway/camera, f = floor height"""
    a = theta(i); u = Vector((math.cos(a), math.sin(a), 0)); r = Vector((-math.sin(a), math.cos(a), 0))
    f = CH[i] - 3.7
    def P(x, y, z): return tuple(r * x + u * y + Vector((0, 0, f + z)))
    return a, P, f

# ---------- walls ----------
def stone_wall(mb, zc, H, opening, f, seed):
    rnd = random.Random(seed)
    for side in range(8):
        a0 = side * math.pi / 4; a1 = a0 + math.pi / 4
        p0 = Vector((R * math.cos(a0), R * math.sin(a0), 0)); p1 = Vector((R * math.cos(a1), R * math.sin(a1), 0))
        L = (p1 - p0).length; d = (p1 - p0).normalized(); ang = math.atan2(d.y, d.x)
        mid = (a0 + a1) / 2; n = Vector((math.cos(mid), math.sin(mid), 0))
        door = abs((mid - opening + math.pi) % (2 * math.pi) - math.pi) < 0.3
        slit = (not door) and side % 2 == 0
        hw, spring = 1.55, f + 3.0                     # doorway half-width, arch spring height
        z = zc - H / 2
        while z < zc + H / 2 - 0.05:
            bh = min(rnd.uniform(0.5, 0.75), zc + H / 2 - z)
            t = -rnd.uniform(0, 0.5)
            while t < L:
                w = rnd.uniform(0.6, 1.4)
                t0, t1 = max(0.0, t), min(L, t + w)
                t += w
                if t1 - t0 < 0.15:
                    continue
                xl = (t0 + t1) / 2 - L / 2               # local x along the side, 0 at its middle
                zm = z + bh / 2
                if door and abs(xl) < hw + 0.1 and zm > f - 0.1:
                    top = spring + math.sqrt(max(0.0, hw * hw - min(abs(xl), hw) ** 2))
                    if zm < top + 0.2:
                        continue
                if slit and abs(xl) < 0.32 and f + 1.6 < zm < f + 3.6:
                    continue
                c = p0 + d * ((t0 + t1) / 2) + n * rnd.uniform(-0.05, 0.08)
                m = MOSS if (rnd.random() < 0.05 and zm < f + 1.2) else rnd.choice(STONES)
                mb.box(m, (c.x, c.y, zm + rnd.uniform(-0.03, 0.03)), (t1 - t0 - 0.07, rnd.uniform(0.9, 1.15), bh - 0.07),
                       rotz=ang + rnd.uniform(-0.03, 0.03), bevel=0.06 if rnd.random() < 0.2 else 0.0, tilt=(rnd.uniform(-0.03, 0.03), 0))
                # (bevelling every stone quadruples the triangle count; a fifth is enough to read as hand-cut)
            z += bh
        cm = (p0 + p1) / 2
        if door:   # arch voussoirs + keystone
            for k in range(11):
                phi = math.pi * k / 10
                xl = math.cos(phi) * (hw + 0.25); zz = spring + math.sin(phi) * (hw + 0.25)
                c = cm + d * xl + n * 0.12
                mb.box(STONE_C if k != 5 else STONE_A, (c.x, c.y, zz), (0.42, 1.25, 0.55), rotz=ang, tilt=(0, -(phi - math.pi / 2)), bevel=0.05)
            for s in (-1, 1):   # door jambs
                c = cm + d * (s * (hw + 0.2)) + n * 0.12
                mb.box(STONE_C, (c.x, c.y, (f + spring) / 2), (0.4, 1.25, spring - f), rotz=ang, bevel=0.05)
        if slit:
            c = cm + n * 0.2
            mb.box(WINDOW, (c.x, c.y, f + 2.6), (0.5, 0.6, 1.9), rotz=ang)
            c = cm + n * 0.55
            mb.box(STONE_C, (c.x, c.y, f + 1.55), (0.9, 0.5, 0.18), rotz=ang)
    for side in range(8):     # buttresses, stepped
        a = side * math.pi / 4
        mb.box(DARK, (R * 1.03 * math.cos(a), R * 1.03 * math.sin(a), zc), (1.15, 1.15, H + 0.2), rotz=a, bevel=0.08)
        mb.box(STONE_B, (R * 1.12 * math.cos(a), R * 1.12 * math.sin(a), zc - H / 2 + 1.2), (1.3, 1.3, 2.4), rotz=a, bevel=0.1)

def torch(mb, pos, facing):
    """wall sconce: iron bracket, wooden stick, flame"""
    x, y, z = pos; dx, dy = math.cos(facing), math.sin(facing)
    mb.box(IRON, (x, y, z - 0.15), (0.18, 0.18, 0.35), rotz=facing)
    mb.cyl(WOOD, (x + dx * 0.18, y + dy * 0.18, z + 0.15), 0.06, 0.6, seg=6)
    mb.cyl(IRON, (x + dx * 0.18, y + dy * 0.18, z + 0.45), 0.13, 0.14, seg=6, r2=0.17)
    mb.ico(FLAME, (x + dx * 0.18, y + dy * 0.18, z + 0.68), 0.16, sub=1, scale=(1, 1, 1.7))

def banner(mb, P, x, y, z, h=2.2, rz=0.0):
    mb.box(IRON, P(x, y, z + h / 2 + 0.05), (1.0, 0.06, 0.06), rotz=rz)
    mb.box(CLOTH, P(x, y, z), (0.8, 0.04, h), rotz=rz)
    mb.box(GOLD, P(x, y - 0.03, z + 0.2), (0.3, 0.02, 0.3), rotz=rz + 0.785)

def candle(mb, p):
    mb.cyl(PARCH, (p[0], p[1], p[2] + 0.12), 0.04, 0.24, seg=6)
    mb.ico(FLAME, (p[0], p[1], p[2] + 0.3), 0.04, sub=1, scale=(1, 1, 1.8))

cams = bpy.data.collections.new("PGCams"); root.children.link(cams)
for i, zc in enumerate(CH):
    c = bpy.data.collections.new(f"Ch{i}"); root.children.link(c)
    mb = MB(); a, P, f = frame(i); rz = a + math.pi / 2     # rz: boxes facing the doorway
    stone_wall(mb, zc - 0.5, 10.0, a, f, seed=i)
    mb.cyl(STONE_B, (0, 0, f - 0.3), 6.5, 0.6, seg=8)
    for k in range(14):     # flagstones
        rr = random.Random(50 + i * 20 + k)
        ang = rr.uniform(0, 2 * math.pi); dist = rr.uniform(0, 5)
        mb.box(rr.choice(STONES), (dist * math.cos(ang), dist * math.sin(ang), f + 0.01), (rr.uniform(0.8, 1.5), rr.uniform(0.6, 1.2), 0.06), rotz=rr.uniform(0, 3))
    mb.cyl(STONE_C, (0, 0, zc + 4.5), 6.85, 0.4, seg=8)
    mb.box(STONE_C, (7.3 * math.cos(a), 7.3 * math.sin(a), f - 0.15), (2.4, 4.2, 0.3), rotz=a, bevel=0.05)
    for s in (-1, 1):       # torches either side of the doorway, outside and inside
        q = Vector(P(s * 2.3, 6.15, 3.3)); torch(mb, tuple(q), a)
        q = Vector(P(s * 2.2, 5.0, 3.3)); torch(mb, tuple(q), a + math.pi)
    random.seed(100 + i)
    if i == 0:      # spire: crenellations, brazier, banners, spire with beacon
        for k in range(16):
            ang = k * math.pi / 8
            if k % 2 == 0:
                mb.box(STONE_A, (6.0 * math.cos(ang), 6.0 * math.sin(ang), zc + 5.4), (1.3, 1.0, 1.5), rotz=ang + math.pi / 2, bevel=0.07)
        mb.cyl(STONE_C, P(0, -0.5, 0.5), 1.4, 1.0, seg=8)
        mb.cyl(IRON, P(0, -0.5, 1.35), 0.6, 0.7, seg=10, r2=1.0)
        mb.ico(FLAME, P(0, -0.5, 2.1), 0.75, sub=1, scale=(1, 1, 1.6), jitter=0.05)
        banner(mb, P, -3.5, -3.6, 3.2, 2.6, rz); banner(mb, P, 3.5, -3.6, 3.2, 2.6, rz)
        mb.cyl(DARK, P(0, -3.2, 9.0), 1.4, 8.0, seg=8, r2=0.15)
        mb.ico(FLAME, P(0, -3.2, 13.6), 0.35, sub=1, scale=(1, 1, 1.6))
    elif i == 1:    # about: library — shelves of books, map table, candles
        for x in (-2.6, 0, 2.6):
            mb.box(WOOD, P(x, -4.2, 1.6), (2.2, 0.6, 3.2))
            for row in range(4):
                for b in range(7):
                    rr = random.random()
                    mb.box(CLOTH if rr < 0.33 else (PARCH if rr < 0.6 else MOSS), P(x - 0.85 + b * 0.27, -3.95, 0.35 + row * 0.75), (0.2, 0.42, random.uniform(0.45, 0.6)), rotz=rz)
        mb.box(WOOD, P(0, -0.6, 0.85), (2.6, 1.4, 0.12)); mb.box(WOOD, P(0, -0.6, 0.4), (2.2, 1.0, 0.8))
        mb.box(PARCH, P(-0.2, -0.6, 0.93), (1.6, 1.0, 0.02), rotz=rz + 0.08)
        mb.box(CLOTH, P(0.5, -0.4, 0.95), (0.18, 0.18, 0.02))
        for x in (-1.1, 1.1): candle(mb, P(x, -0.9, 0.92))
        mb.box(WOOD, P(1.8, 0.8, 0.5), (0.6, 0.6, 1.0))
    elif i == 2:    # services: 8 rune pillars with banners
        for k in range(8):
            ang = k * math.pi / 4 + theta(i) + math.pi / 8
            pos = Vector((3.5 * math.cos(ang), 3.5 * math.sin(ang), f + 2.6))
            mb.cyl(STONE_C if k in (3, 4) else STONE_A, tuple(pos), 0.45, 5.2, seg=8)
            mb.box(STONE_B, (pos.x, pos.y, f + 0.2), (1.2, 1.2, 0.4), rotz=ang, bevel=0.04)
            mb.box(STONE_B, (pos.x, pos.y, f + 5.1), (1.1, 1.1, 0.3), rotz=ang, bevel=0.04)
            inward = -Vector((math.cos(ang), math.sin(ang), 0)) * 0.47
            mb.box(FLAME, (pos.x + inward.x, pos.y + inward.y, f + 3.2), (0.22, 0.22, 0.22), rotz=ang)
        mb.cyl(STONE_C, (0, 0, f + 5.4), 4.2, 0.3, seg=8)
        mb.cyl(IRON, (0, 0, f + 3.9), 0.9, 0.08, seg=12)
        for k in range(6):
            ang = k * math.pi / 3
            candle(mb, (0.8 * math.cos(ang), 0.8 * math.sin(ang), f + 3.95))
    elif i == 3:    # why: armory — shields on the wall, weapon rack, trophy
        for k, x in enumerate((-2.6, 0, 2.6)):
            shield = Matrix.Rotation(math.pi / 2, 4, 'X')
            mb.cyl(GOLD, P(x, -4.15, 2.6), 0.85, 0.12, seg=8, rotz=a, rot=shield)
            mb.cyl(CLOTH if k != 1 else IRON, P(x, -4.05, 2.6), 0.72, 0.14, seg=8, rotz=a, rot=shield)
            mb.box(GOLD, P(x, -3.96, 2.6), (0.18, 0.04, 0.9), rotz=rz); mb.box(GOLD, P(x, -3.96, 2.75), (0.7, 0.04, 0.16), rotz=rz)
        for k in range(5):
            mb.cyl(WOOD, P(-3.2 + k * 0.25, -2.6, 1.1), 0.04, 2.2, seg=5)
        mb.box(WOOD, P(-2.7, -2.6, 0.6), (1.6, 0.3, 0.12), rotz=rz)
        mb.cyl(STONE_C, P(1.6, -1.2, 0.5), 0.6, 1.0, seg=8)
        mb.cyl(GOLD, P(1.6, -1.2, 1.2), 0.12, 0.4, seg=8); mb.cyl(GOLD, P(1.6, -1.2, 1.55), 0.35, 0.35, seg=10, r2=0.15)
    elif i == 4:    # ecosystem: alchemy — four vessels piped into a glowing cauldron
        node = [(-2.6, -2.0), (-0.9, -3.2), (0.9, -3.2), (2.6, -2.0)]
        for k, (x, y) in enumerate(node):
            if k == 2:
                mb.cyl(IRON, P(x, y, 0.55), 0.95, 1.1, seg=10, r2=0.75)
                mb.ico(LAVA, P(x, y, 1.12), 0.72, sub=1, scale=(1, 1, 0.25))
            else:
                mb.cyl(IRON, P(x, y, 0.6), 0.45, 1.2, seg=8)
                mb.ico(GOLD, P(x, y, 1.45), 0.42, sub=1, scale=(1, 1, 0.8))
            mb.cyl(IRON, P(x, y, 3.2), 0.06, 3.6, seg=6)
        for k in range(3):
            (x0, y0), (x1, y1) = node[k], node[k + 1]
            v = Vector(P(x1, y1, 2.2)) - Vector(P(x0, y0, 2.2))
            mb.cyl(GOLD, tuple((Vector(P(x0, y0, 2.2)) + Vector(P(x1, y1, 2.2))) / 2), 0.08, v.length, seg=6,
                   rot=Matrix.Rotation(math.atan2(v.y, v.x), 4, 'Z') @ Matrix.Rotation(math.pi / 2, 4, 'Y'))
        mb.box(WOOD, P(0, 0.6, 0.45), (2.4, 0.9, 0.9))
        for k in range(5): mb.cyl(PARCH, P(-0.9 + k * 0.45, 0.6, 1.02), 0.08, 0.25, seg=6)
    elif i == 5:    # process: spiral stair, five landings with plaques and torches
        mb.cyl(STONE_C, (0, 0, f + 3.2), 0.7, 6.6, seg=10)
        steps = 25
        for k in range(steps):
            ang = theta(i) + math.pi * 0.5 + k * (2 * math.pi * 1.1 / steps)
            z = f + 6.0 - k * 0.24
            landing = (k % 5 == 2)
            w = 2.8; dd = 1.3 if landing else 0.75
            midv = Vector((math.cos(ang), math.sin(ang), 0)) * (0.7 + w / 2)
            mb.box(PARCH if landing else STONE_A, (midv.x, midv.y, z), (w, dd, 0.22), rotz=ang, bevel=0.03)
            if landing:
                tip = Vector((math.cos(ang), math.sin(ang), 0)) * (0.7 + w - 0.25)
                torch(mb, (tip.x, tip.y, z + 0.6), ang)
    elif i == 6:    # use cases: treasury — chests, gold, display pedestals
        for k, x in enumerate((-2.4, 0, 2.4)):
            mb.box(WOOD, P(x, -3.4, 0.45), (1.4, 0.9, 0.9), bevel=0.04)
            mb.cyl(WOOD, P(x, -3.4, 0.9), 0.45, 1.4, seg=8, rotz=a, rot=Matrix.Rotation(math.pi / 2, 4, 'Y'))
            for s in (-0.45, 0.45): mb.box(GOLD, P(x + s, -3.4, 0.6), (0.08, 0.95, 1.2), rotz=rz)
            mb.ico(GOLD, P(x + 0.9, -2.4, 0.15), 0.55, sub=1, scale=(1, 1, 0.35), jitter=0.06)
        for x in (-1.2, 1.2):
            mb.cyl(STONE_C, P(x, -0.6, 0.5), 0.4, 1.0, seg=8)
            mb.cyl(GOLD, P(x, -0.6, 1.15), 0.08, 0.3, seg=6); mb.cyl(GOLD, P(x, -0.6, 1.4), 0.2, 0.25, seg=8, r2=0.1)
    elif i == 7:    # contact: forge — hearth, anvil, lava, embers
        mb.cyl(DARK, P(0, -0.8, 0.3), 3.2, 0.6, seg=10)
        mb.cyl(LAVA, P(0, -0.8, 0.62), 2.6, 0.08, seg=16)
        mb.box(IRON, P(0, -0.8, 1.4), (2.0, 0.9, 1.0), bevel=0.05); mb.box(IRON, P(0, -0.8, 2.0), (2.8, 1.1, 0.35), bevel=0.05)
        mb.box(IRON, P(1.6, -0.8, 2.0), (0.8, 0.5, 0.25), bevel=0.04)
        mb.box(WOOD, P(-0.4, -0.5, 2.3), (0.08, 0.9, 0.08), rotz=rz + 0.4); mb.box(IRON, P(-0.4, -0.95, 2.32), (0.3, 0.18, 0.18), rotz=rz + 0.4)
        mb.box(STONE_B, P(0, -4.0, 1.6), (3.2, 1.4, 3.2), bevel=0.08); mb.box(LAVA, P(0, -3.3, 1.1), (1.6, 0.1, 0.9))
        for k in range(14):
            ang = random.uniform(0, 2 * math.pi); rr = random.uniform(3.6, 5.0)
            mb.box(LAVA, (rr * math.cos(ang), rr * math.sin(ang), f + 0.02), (random.uniform(0.6, 1.4), 0.08, 0.03), rotz=ang + random.uniform(-0.6, 0.6))
    mb.emit(f"Ch{i}", c)
    empty(f"cam_{i}", (10.5 * math.cos(a), 10.5 * math.sin(a), f + 3.0), cams)
    empty(f"tgt_{i}", (0, 0, f + 1.8), cams)

# ---------- ground + shaft ----------
env = bpy.data.collections.new("Env"); root.children.link(env); mb = MB(); random.seed(7)
G = -44.0
for k in range(80):
    ang = random.uniform(0, 2 * math.pi); rr = random.uniform(18, 50)
    mb.ico(random.choice([DARK, STONE_B, MOSS]), (rr * math.cos(ang), rr * math.sin(ang), G + random.uniform(-1.2, 0.2)), random.uniform(2.5, 5.5), sub=1, jitter=0.6, scale=(1, 1, 0.45))
for ring in range(12):
    z = G - 2 - ring * 3.0
    for k in range(14):
        ang = k * 2 * math.pi / 14 + random.uniform(-0.12, 0.12) + ring * 0.2
        rr = random.uniform(17.5, 20)
        mb.ico(DARK if random.random() < 0.7 else STONE_B, (rr * math.cos(ang), rr * math.sin(ang), z), random.uniform(3.2, 4.6), sub=1, jitter=0.5)
    if ring % 3 == 1:   # glowing veins in the shaft
        ang = random.uniform(0, 2 * math.pi)
        mb.box(LAVA, (15.8 * math.cos(ang), 15.8 * math.sin(ang), z), (0.15, 2.5, 0.12), rotz=ang + 0.4)
mb.cyl(DARK, (0, 0, -79), 22, 2, seg=12)
for k in range(22):
    ang = random.uniform(0, 2 * math.pi); rr = random.uniform(8, 15)
    mb.box(LAVA, (rr * math.cos(ang), rr * math.sin(ang), -77.95), (random.uniform(1, 3), 0.14, 0.05), rotz=ang + random.uniform(-0.8, 0.8))
mb.cyl(DARK, (0, 0, -76.5), 7.5, 3, seg=8)
mb.emit("Env", env)

tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in root.all_objects if o.type == 'MESH')
print("DUNGEON TRIS", tris)
bpy.ops.wm.save_mainfile()
