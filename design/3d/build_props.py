# Section props for the PG site (scene PGProps, collection PGProps): one low-poly object per
# section, shown floating on the right of the page. Each sits under an empty named prop_<section>,
# centred on the origin and about 2.4 units tall. Export with export_props.py.
import bpy, bmesh, math
from mathutils import Vector, Matrix

exec(bpy.data.texts["pg_helpers"].as_string())

SC = bpy.data.scenes.get("PGProps") or bpy.data.scenes.new("PGProps")
root = bpy.data.collections.get("PGProps")
if root:
    for o in list(root.all_objects):
        bpy.data.objects.remove(o)
else:
    root = bpy.data.collections.new("PGProps")
    SC.collection.children.link(root)

M = lambda n, h, r=0.6, e=0.0: mat(n, h, r, emit=e)
IVORY = M("p_ivory", "#F2ECE1", 0.55)
NAVY = M("p_navy", "#24305E", 0.5)
DEEP = M("p_deep", "#151C3C", 0.5)
CORAL = M("p_coral", "#FF6946", 0.45)      # glow set in the web
GOLD = M("p_gold", "#F2C27B", 0.35)        # glow set in the web
GLOW = M("p_glow", "#FFE2B8", 0.4)

def poly(mb, m, verts, faces):
    b = mb.bm(m)
    vs = [b.verts.new(v) for v in verts]
    for f in faces:
        b.faces.new([vs[i] for i in f])

def extrude_outline(mb, m, outline, depth, y0=0.0):
    """closed outline in the XZ plane (list of (x, z)), extruded along Y"""
    n = len(outline)
    front = [(x, y0 - depth / 2, z) for x, z in outline]
    back = [(x, y0 + depth / 2, z) for x, z in outline]
    faces = [list(range(n))[::-1], [i + n for i in range(n)]]
    faces += [[i, (i + 1) % n, (i + 1) % n + n, i + n] for i in range(n)]
    poly(mb, m, front + back, faces)

def prop(name, build):
    holder = bpy.data.objects.new(f"prop_{name}", None)
    root.objects.link(holder)
    mb = MB(); build(mb)
    for o in mb.emit(f"prop_{name}", root):
        o.parent = holder
        for p in o.data.polygons: p.use_smooth = False

# about — the PG tower in miniature on a round plinth, coral beacon on top
def about(m):
    m.cyl(DEEP, (0, 0, -1.1), 1.15, 0.22, seg=24)
    m.cyl(GOLD, (0, 0, -0.98), 1.17, 0.03, seg=24)
    m.box(IVORY, (0, 0, -0.1), (0.9, 0.6, 1.8))
    m.box(IVORY, (0, 0, 0.98), (0.68, 0.46, 0.36))
    for k in range(9):
        z = -0.85 + k * 0.19
        m.box(NAVY, (0, -0.305, z), (0.78, 0.02, 0.08))
        m.box(NAVY, (0.455, 0, z), (0.02, 0.5, 0.08))
    for x in (-0.47, 0.47):
        m.box(DEEP, (x, -0.32, 0.0), (0.04, 0.04, 2.3))
    m.cyl(DEEP, (0.2, 0.08, 1.4), 0.015, 0.45, seg=5)
    m.box(CORAL, (0.2, 0.08, 1.66), (0.12, 0.12, 0.12))
prop("about", about)

# services — eight modules that click together; the two core products glow coral
def services(m):
    s, g = 0.56, 0.1
    for k in range(8):
        r, c = divmod(k, 4)
        x = (c - 1.5) * (s + g)
        z = (0.5 - r) * (s + g) + (0.12 if (r + c) % 2 else 0.0)
        mat_ = CORAL if k < 2 else (IVORY if (r + c) % 2 == 0 else NAVY)
        m.box(mat_, (x, 0, z), (s, s, s), bevel=0.04)
        if c < 3:
            m.box(GOLD, (x + (s + g) / 2, 0, z + 0.06), (g + 0.06, 0.12, 0.05))
prop("services", services)

# why — a shield with a coral check
def why(m):
    out = [(-0.85, 0.95), (0.85, 0.95), (0.85, 0.15), (0.55, -0.55), (0.0, -1.05), (-0.55, -0.55), (-0.85, 0.15)]
    extrude_outline(m, IVORY, out, 0.28)
    inner = [(x * 0.8, z * 0.8 + 0.02) for x, z in out]
    extrude_outline(m, NAVY, inner, 0.32)
    m.box(CORAL, (-0.2, -0.2, -0.05), (0.18, 0.16, 0.55), tilt=(0, -0.75))
    m.box(CORAL, (0.18, -0.2, 0.12), (0.18, 0.16, 0.95), tilt=(0, 0.6))
prop("why", why)

# ecosystem — four nodes in a loop, AI glowing coral
def eco(m):
    pts = []
    for k in range(4):
        a = math.pi / 2 - k * math.pi / 2
        pts.append(Vector((math.cos(a) * 1.05, 0, math.sin(a) * 1.05)))
    for k, p in enumerate(pts):
        if k == 2:
            m.ico(CORAL, tuple(p), 0.36, sub=1)
        else:
            m.ico(IVORY, tuple(p), 0.27, sub=1)
            m.cyl(NAVY, tuple(p), 0.3, 0.08, seg=12, rot=Matrix.Rotation(math.pi / 2, 4, 'X'))
    for k in range(4):
        a, b = pts[k], pts[(k + 1) % 4]
        mid = (a + b) / 2; d = b - a
        # cylinders run along Z; turn Z onto the segment direction in the XZ plane
        m.cyl(GOLD, tuple(mid), 0.035, d.length - 0.6, seg=6, rot=Matrix.Rotation(math.atan2(d.x, d.z), 4, 'Y'))
    m.ico(GLOW, (0, 0, 0), 0.12, sub=1)
prop("ecosystem", eco)

# process — five rising steps, the last one coral
def process(m):
    for k in range(5):
        h = 0.35 + k * 0.35
        x = (k - 2) * 0.46
        mat_ = CORAL if k == 4 else (IVORY if k % 2 == 0 else NAVY)
        m.box(mat_, (x, 0, -1.0 + h / 2), (0.42, 0.8, h), bevel=0.03)
        m.box(GOLD, (x, -0.41, -1.0 + h - 0.08), (0.3, 0.02, 0.05))
prop("process", process)

# use cases — results: bars rising, gold arrow going up
def cases(m):
    m.box(DEEP, (0, 0, -1.08), (2.1, 0.9, 0.12), bevel=0.03)
    for k, h in enumerate((0.55, 0.85, 1.25, 1.75)):
        x = (k - 1.5) * 0.48
        m.box(CORAL if k == 3 else (IVORY if k % 2 == 0 else NAVY), (x, 0, -1.02 + h / 2), (0.36, 0.5, h), bevel=0.03)
    lean = Matrix.Rotation(0.95, 4, 'Y')          # shaft leans up and to the right
    m.cyl(GOLD, (0.0, -0.4, 0.35), 0.04, 1.9, seg=6, rot=lean)
    m.cyl(GOLD, (0.8, -0.4, 0.92), 0.14, 0.32, seg=6, r2=0.0, rot=lean)
prop("cases", cases)

# contact — a folded paper plane
def contact(m):
    nose, tail_l, tail_r, keel = (1.2, 0, 0.1), (-0.9, -0.85, 0.25), (-0.9, 0.85, 0.25), (-0.9, 0, -0.25)
    mid = (-0.9, 0, 0.18)
    poly(m, CORAL, [nose, tail_l, mid], [[0, 1, 2]])
    poly(m, CORAL, [nose, mid, tail_r], [[0, 1, 2]])
    poly(m, IVORY, [nose, keel, mid], [[0, 1, 2]])
    poly(m, IVORY, [nose, mid, keel], [[0, 1, 2]])
    for k in range(3):
        m.box(GOLD, (-1.3 - k * 0.35, 0, 0.05 - k * 0.04), (0.18, 0.04, 0.04))
prop("contact", contact)

tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in root.all_objects if o.type == 'MESH')
print("PROPS", len([o for o in root.objects if o.type == 'EMPTY']), "TRIS", tris)
bpy.ops.wm.save_mainfile()
