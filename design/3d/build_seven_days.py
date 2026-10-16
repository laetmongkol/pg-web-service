# Builds the "SevenDays_Academy" scene (slug: seven-days) in company.blend.
#
# 7Days Academy — a trading-education academy / studio. Black-anthracite and white volumes,
# generous glazing, neon-green (#00E64D) LED accents, a stepped auditorium wing, a rooftop
# terrace, an entrance canopy, landscape and a sign with the green paper-plane "7" logo.
#
# Same conventions as the other company scenes: collections SEV_Structure / _Glazing / _Interior /
# _Branding / _Landscape / _Lighting / _Camera under SevenDays_Academy_Building, every object
# parented to the SEV_Root empty, front (entrance + sign) facing Blender -Y, ground at z = 0, metres.
#
# Re-runnable: deletes the previous SevenDays_Academy scene and its SEV_* data first.
#   blender -b design/3d/company.blend --python design/3d/build_seven_days.py -- [--save]
import bpy, bmesh, math, random, sys
from mathutils import Vector

ARGV = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SCENE = "SevenDays_Academy"
P = "SEV_"

# ---------------------------------------------------------------- clean previous build
old = bpy.data.scenes.get(SCENE)
if old:
    for o in list(old.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.data.scenes.remove(old)
for c in list(bpy.data.collections):
    if c.name.startswith(P) or c.name == "SevenDays_Academy_Building":
        bpy.data.collections.remove(c)
for coll in (bpy.data.meshes, bpy.data.curves, bpy.data.lights, bpy.data.cameras):
    for d in list(coll):
        if d.users == 0:
            coll.remove(d)
for m in list(bpy.data.materials):
    if m.name.startswith(P):
        bpy.data.materials.remove(m)
if bpy.data.worlds.get(P + "Sky"):
    bpy.data.worlds.remove(bpy.data.worlds[P + "Sky"])

# ---------------------------------------------------------------- scene + render settings
SC = bpy.data.scenes.new(SCENE)
ref = bpy.data.scenes.get("Sriwilai")
SC.render.engine = "BLENDER_EEVEE"
if ref:
    SC.render.resolution_x, SC.render.resolution_y = ref.render.resolution_x, ref.render.resolution_y
    for k in ("taa_render_samples", "taa_samples", "use_raytracing", "ray_tracing_method", "use_shadows",
              "shadow_ray_count", "shadow_step_count"):
        setattr(SC.eevee, k, getattr(ref.eevee, k))
SC.view_settings.view_transform = "AgX"
SC.view_settings.look = "AgX - Medium High Contrast"
SC.view_settings.exposure = -0.4
SC.unit_settings.system = "METRIC"

src_world = bpy.data.worlds.get("PEV_DuskSky")
W = src_world.copy() if src_world else bpy.data.worlds.new("tmp")
W.name = P + "Sky"
SC.world = W
for n in W.node_tree.nodes:
    if n.bl_idname == "ShaderNodeValToRGB":
        cols = [(1.0, 0.56, 0.30, 1), (0.78, 0.60, 0.62, 1), (0.26, 0.34, 0.58, 1)]
        for el, c in zip(n.color_ramp.elements, cols):
            el.color = c
    if n.bl_idname == "ShaderNodeBackground":
        n.inputs["Strength"].default_value = 0.8

# ---------------------------------------------------------------- collections
TOP = bpy.data.collections.new("SevenDays_Academy_Building")
SC.collection.children.link(TOP)
COLS = {}
for k in ("Structure", "Glazing", "Interior", "Branding", "Landscape", "Lighting", "Camera"):
    c = bpy.data.collections.new(P + k)
    TOP.children.link(c)
    COLS[k] = c
ROOT = bpy.data.objects.new(P + "Root", None)
ROOT.empty_display_type = "PLAIN_AXES"
TOP.objects.link(ROOT)


# ---------------------------------------------------------------- materials
def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def mat(name, base, rough=0.5, metal=0.0, emit=None, strength=0.0, trans=0.0):
    m = bpy.data.materials.new(P + name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*base, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if trans:
        b.inputs["Transmission Weight"].default_value = trans
        b.inputs["IOR"].default_value = 1.45
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    m.diffuse_color = (*base, 1)
    return m


GREEN = srgb("#00E64D")
M = dict(
    white=mat("WhitePanel", (0.86, 0.86, 0.85), 0.35),
    anth=mat("Anthracite", (0.028, 0.030, 0.033), 0.45, 0.35),
    frame=mat("Frame_Black", (0.010, 0.010, 0.012), 0.35, 0.8),
    glass=mat("Glass", (0.72, 0.78, 0.80), 0.03, trans=1.0),
    led=mat("LED_Green", GREEN, 0.4, emit=GREEN, strength=7.0),
    logo=mat("Logo_Green", GREEN, 0.3, emit=GREEN, strength=2.2),
    logo_fold=mat("Logo_Green_Fold", tuple(c * 0.45 for c in GREEN), 0.35,
                  emit=tuple(c * 0.45 for c in GREEN), strength=1.4),
    letters=mat("Letters_White", (0.95, 0.95, 0.95), 0.3, emit=(1, 1, 1), strength=0.8),
    concrete=mat("Concrete", (0.56, 0.555, 0.54), 0.8),
    paving=mat("Paving", (0.46, 0.46, 0.45), 0.85),
    lawn=mat("Lawn", (0.06, 0.10, 0.04), 0.95),
    hedge=mat("Hedge", (0.04, 0.075, 0.03), 0.85),
    sedum=mat("Sedum", (0.09, 0.13, 0.05), 0.9),
    leaves=mat("Leaves", (0.065, 0.12, 0.045), 0.8),
    bark=mat("Bark", (0.12, 0.09, 0.06), 0.9),
    deck=mat("Wood_Deck", (0.30, 0.17, 0.08), 0.6),
    warm=mat("Interior_Warm", (0.80, 0.62, 0.42), 0.6, emit=(1.0, 0.70, 0.42), strength=1.4),
    ilight=mat("Interior_Light", (1.0, 0.92, 0.80), 0.5, emit=(1.0, 0.82, 0.60), strength=12.0),
    furn=mat("Interior_Furniture", (0.14, 0.13, 0.12), 0.6),
    screen=mat("Screen_Green", (0.01, 0.06, 0.03), 0.2, emit=(0.05, 0.75, 0.25), strength=1.6),
    bollard=mat("Bollard_Light", (1.0, 0.9, 0.75), 0.5, emit=(1.0, 0.80, 0.55), strength=8.0),
)


# ---------------------------------------------------------------- mesh builder
class Part:
    """Accumulates boxes / prisms into one bmesh, one material slot per material."""

    def __init__(self, name, col):
        self.name, self.col, self.bm, self.mats = name, COLS[col], bmesh.new(), []

    def mi(self, m):
        if m not in self.mats:
            self.mats.append(m)
        return self.mats.index(m)

    def box(self, x0, x1, y0, y1, z0, z1, m, faces=None):
        x0, x1 = sorted((x0, x1)); y0, y1 = sorted((y0, y1)); z0, z1 = sorted((z0, z1))
        b = self.bm
        v = [b.verts.new(p) for p in [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
                                       (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]]
        spec = {"-Z": (0, 3, 2, 1), "+Z": (4, 5, 6, 7), "-Y": (0, 1, 5, 4), "+Y": (2, 3, 7, 6),
                "-X": (3, 0, 4, 7), "+X": (1, 2, 6, 5)}
        for k, idx in spec.items():
            f = b.faces.new([v[i] for i in idx])
            f.material_index = self.mi((faces or {}).get(k, m))
        return self

    def prism_xz(self, outline, y0, y1, m):
        """closed outline (x, z) in the XZ plane, extruded along Y from y0 to y1"""
        b, n = self.bm, len(outline)
        a = [b.verts.new((x, y0, z)) for x, z in outline]
        c = [b.verts.new((x, y1, z)) for x, z in outline]
        i = self.mi(m)
        for f in [b.faces.new(a[::-1]), b.faces.new(c)] + \
                 [b.faces.new([a[k], a[(k + 1) % n], c[(k + 1) % n], c[k]]) for k in range(n)]:
            f.material_index = i
        return self

    def cyl(self, cx, cy, z0, z1, r, m, seg=8):
        b = self.bm
        lo = [b.verts.new((cx + r * math.cos(2 * math.pi * k / seg), cy + r * math.sin(2 * math.pi * k / seg), z0))
              for k in range(seg)]
        hi = [b.verts.new((v.co.x, v.co.y, z1)) for v in lo]
        i = self.mi(m)
        for f in [b.faces.new(lo[::-1]), b.faces.new(hi)] + \
                 [b.faces.new([lo[k], lo[(k + 1) % seg], hi[(k + 1) % seg], hi[k]]) for k in range(seg)]:
            f.material_index = i
        return self

    def blob(self, cx, cy, cz, r, m, seed, sub=2, squash=0.85):
        """low-poly tree crown: jittered icosphere"""
        tmp = bmesh.new()
        bmesh.ops.create_icosphere(tmp, subdivisions=sub, radius=r)
        rnd = random.Random(seed)
        i = self.mi(m)
        vmap = {}
        for v in tmp.verts:
            k = 1 + rnd.uniform(-0.13, 0.13)
            vmap[v] = self.bm.verts.new((v.co.x * k + cx, v.co.y * k + cy, v.co.z * k * squash + cz))
        for f in tmp.faces:
            nf = self.bm.faces.new([vmap[v] for v in f.verts])
            nf.material_index = i
        tmp.free()
        return self

    def finish(self, smooth=False):
        bmesh.ops.remove_doubles(self.bm, verts=self.bm.verts, dist=1e-5)
        bmesh.ops.recalc_face_normals(self.bm, faces=self.bm.faces)
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me); self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        for p in me.polygons:
            p.use_smooth = smooth
        o = bpy.data.objects.new(self.name, me)
        self.col.objects.link(o)
        o.parent = ROOT
        return o


def text(name, body, font, size, x, y, z, m, extrude=0.05, align="LEFT", col="Branding"):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.font = bpy.data.fonts.get(font) or bpy.data.fonts.load("C:/Windows/Fonts/arialbd.ttf")
    cu.size, cu.extrude, cu.resolution_u = size, extrude, 6
    cu.align_x = align
    o = bpy.data.objects.new(name, cu)
    o.data.materials.append(m)
    o.location = (x, y - extrude, z)
    o.rotation_euler = (math.pi / 2, 0, 0)     # letters face -Y
    COLS[col].objects.link(o)
    o.parent = ROOT
    return o


def fit_width(o, max_w):
    bpy.context.view_layer.update()
    w = o.dimensions.x
    if w > max_w:
        o.scale = (max_w / w,) * 3
    return o.dimensions.x * o.scale.x / max(o.scale.x, 1e-6)


# 7Days mark: a paper-plane / arrow shaped "7" (unit height, nose pointing up-right)
SEVEN = [(0.00, 1.00), (0.78, 1.00), (1.06, 1.12), (0.97, 0.84), (0.47, 0.00), (0.22, 0.00),
         (0.66, 0.80), (0.00, 0.80)]
SEVEN_FOLD = [(1.06, 1.12), (0.97, 0.84), (0.66, 0.80)]


def seven(name_prefix, ox, oz, s, y, depth=0.12):
    tr = lambda pts: [(ox + u * s, oz + v * s) for u, v in pts]
    Part(name_prefix + "_Plane", "Branding").prism_xz(tr(SEVEN), y - depth, y, M["logo"]).finish()
    Part(name_prefix + "_Fold", "Branding").prism_xz(tr(SEVEN_FOLD), y - depth - 0.03, y - depth + 0.01,
                                                     M["logo_fold"]).finish()


# ==================================================================== GEOMETRY
# Footprint: white volume x -26..4, auditorium wing x 4..24, y 0..30. Front = -Y.
GF0, GF1 = 0.4, 4.8          # ground floor (plinth top -> white volume underside)
L1, L1T = 5.6, 8.2           # level-1 ribbon window band
L2, L2T = 9.6, 12.0          # level-2 ribbon window band
ROOF = 12.8

# ---------------- structure
s = Part("Plinth", "Structure")
s.box(-28, 26, -2, 32, 0, GF0, M["concrete"])
s.box(-11, -1, -2.4, -2, 0, 0.27, M["concrete"])            # entrance steps
s.box(-11, -1, -2.8, -2.4, 0, 0.13, M["concrete"])
s.finish()

wv = Part("White_Volume", "Structure")
wv.box(-13, 4, 4, 26, GF1, ROOF, M["white"], faces={"-Y": M["warm"]})              # body, lit room back wall
for z0, z1 in ((GF1, L1), (L1T, L2), (L2T, ROOF)):                                  # floor slabs / fascia bands
    wv.box(-13, 3.4, 0, 4, z0, z1, M["white"])
wv.box(3.4, 4, 0, 4, GF1, ROOF, M["white"])                                         # east pier
wv.box(-13, 4, 25.6, 26, ROOF, ROOF + 0.9, M["white"])                              # parapets
wv.box(3.6, 4, 0, 26, ROOF, ROOF + 0.5, M["white"])
wv.box(-13, 3.6, 0, 0.4, ROOF, ROOF + 0.5, M["white"])
wv.finish()

gf = Part("GF_Shell", "Structure")
gf.box(-27, -23, -1.5, 26, GF0, GF1, M["anth"])                                     # west anchor of the black tower
gf.box(-26, 4, 25.6, 26, GF0, GF1, M["anth"])                                      # back wall
gf.box(-23, 3.4, 12, 12.4, GF0, GF1, M["anth"], faces={"-Y": M["warm"]})         # lobby back wall (lit)
gf.box(3.4, 4.4, 2, 3.2, GF0, GF1, M["anth"])                                      # corner pier
gf.finish()

# black tower: anthracite volume on the west, floating over the glass lobby, carries the sign
TW0, TW1, TY, TT = -27.0, -13.0, -1.5, 15.6
bb = Part("Black_Tower", "Structure")
bb.box(TW0, TW1, TY, 24, GF1, TT, M["anth"])
bb.box(TW1, TW1 + 0.6, TY, 0, GF1, TT, M["anth"])                                  # return to the white volume
bb.finish()
ts = Part("Tower_Slots", "Glazing")                                                 # vertical glass slots, west face
for yy in (4, 8, 12, 16, 20):
    ts.box(TW0 - 0.04, TW0, yy - 0.5, yy + 0.5, 5.6, 14.6, M["glass"], faces={"+X": M["warm"]})
ts.finish()

# auditorium wing: four steps rising to the back (stepped "classroom")
STEPS = [(3, 10, 5.4), (10, 16, 8.0), (16, 22, 10.6), (22, 30, 13.2)]
aw = Part("Auditorium_Wing", "Structure")
gz = Part("Auditorium_Glass", "Glazing")
fr = Part("Auditorium_Frames", "Glazing")
prev_top = GF0
for i, (y0, y1, top) in enumerate(STEPS):
    bot = GF0 if i == 0 else prev_top
    aw.box(4, 24, y0 + 0.5, y1, GF0, top, M["anth"], faces={"-Y": M["warm"]})      # mass, recessed lit front
    aw.box(4, 24, y0, y0 + 0.5, top - 0.45, top, M["anth"])                       # head lip
    aw.box(4, 24, y0, y0 + 0.5, bot, bot + 0.4, M["anth"])                        # sill
    aw.box(4, 5, y0, y0 + 0.5, bot, top, M["anth"])                                # jambs
    aw.box(23, 24, y0, y0 + 0.5, bot, top, M["anth"])
    if i < 3:                                                                     # sedum roof on the step
        aw.box(4.6, 23.4, y0 + 0.6, y1 - 0.1, top, top + 0.12, M["sedum"])
    zg0, zg1 = bot + 0.4, top - 0.45
    gz.box(5, 23, y0 + 0.24, y0 + 0.28, zg0, zg1, M["glass"])
    for k in range(1, 9):
        x = 5 + k * 2.0
        fr.box(x - 0.05, x + 0.05, y0 + 0.18, y0 + 0.32, zg0, zg1, M["frame"])
    prev_top = top
aw.box(4, 24, 29.6, 30, GF0, 13.2, M["anth"])
for yy, top in ((6.5, 5.4), (13, 8.0), (19, 10.6), (26, 13.2)):                       # east-face glass slots
    gz.box(24.0, 24.04, yy - 0.6, yy + 0.6, 1.2, top - 0.9, M["glass"], faces={"-X": M["warm"]})
    fr.box(24.0, 24.12, yy - 0.7, yy - 0.6, 1.2, top - 0.9, M["frame"])
    fr.box(24.0, 24.12, yy + 0.6, yy + 0.7, 1.2, top - 0.9, M["frame"])
aw.finish(); gz.finish(); fr.finish()

# ---------------- glazing
g = Part("GF_Glass", "Glazing")
g.box(-23, 3.4, 1.98, 2.02, GF0, GF1, M["glass"])
g.finish()
f = Part("GF_Mullions", "Glazing")
f.box(-23, 3.4, 1.92, 2.08, GF0, GF0 + 0.12, M["frame"])
f.box(-23, 3.4, 1.92, 2.08, GF1 - 0.15, GF1, M["frame"])
f.box(-23, 3.4, 1.92, 2.08, 3.85, 3.95, M["frame"])
x = -23.0
while x < 3.4:
    f.box(x - 0.06, x + 0.06, 1.9, 2.1, GF0, GF1, M["frame"])
    x += 2.4
for xd in (-7.2, -5.5, -3.8):                                                         # entrance door frames
    f.box(xd - 0.08, xd + 0.08, 1.85, 2.15, GF0, 3.85, M["frame"])
f.finish()

bg = Part("Band_Glass", "Glazing")
bmu = Part("Band_Mullions", "Glazing")
for z0, z1 in ((L1, L1T), (L2, L2T)):
    bg.box(-12.4, 3.4, 0.33, 0.37, z0, z1, M["glass"])
    bmu.box(-12.4, 3.4, 0.25, 0.45, z0, z0 + 0.1, M["frame"])
    bmu.box(-12.4, 3.4, 0.25, 0.45, z1 - 0.1, z1, M["frame"])
    x = -12.4 + 1.6
    while x < 3.4:
        bmu.box(x - 0.05, x + 0.05, 0.22, 0.45, z0, z1, M["frame"])               # slim black fins
        x += 1.6
bg.finish(); bmu.finish()

rb = Part("Roof_Balustrade_Glass", "Glazing")                                     # rooftop glass balustrade
rb.box(-12.4, 3.6, 0.18, 0.22, ROOF + 0.5, ROOF + 1.5, M["glass"])
rb.box(3.78, 3.82, 0.4, 14, ROOF + 0.5, ROOF + 1.5, M["glass"])
rb.finish()
rr = Part("Roof_Balustrade_Rail", "Glazing")
rr.box(-12.4, 3.6, 0.12, 0.28, ROOF + 1.5, ROOF + 1.56, M["frame"])
rr.box(3.72, 3.88, 0.4, 14, ROOF + 1.5, ROOF + 1.56, M["frame"])
rr.finish()

# ---------------- entrance canopy
cp = Part("Entrance_Canopy", "Structure")
cp.box(-10.5, -0.5, -5.0, 2.0, 3.9, 4.2, M["anth"])
cp.cyl(-9.8, -4.4, GF0, 3.9, 0.14, M["frame"])
cp.cyl(-1.2, -4.4, GF0, 3.9, 0.14, M["frame"])
cp.finish()

# ---------------- rooftop terrace
rt = Part("Roof_Terrace", "Structure")
rt.box(-12.4, 3.4, 0.5, 14, ROOF, ROOF + 0.12, M["deck"])
rt.box(-12.4, -7.0, 17, 23, ROOF, 16.4, M["anth"], faces={"-Y": M["warm"]})         # stair / lift core
rt.box(-4, 1, 19, 23.5, ROOF, ROOF + 1.4, M["concrete"])                            # AHU
for xp in (-6, 3):                                                                # pergola posts + beams
    for yp in (6, 13):
        rt.box(xp - 0.1, xp + 0.1, yp - 0.1, yp + 0.1, ROOF, ROOF + 3.0, M["frame"])
for yp in (6, 13):
    rt.box(-6.1, 3.1, yp - 0.1, yp + 0.1, ROOF + 2.8, ROOF + 3.0, M["frame"])
for k in range(12):
    yl = 6.3 + k * 0.6
    rt.box(-6.2, 3.2, yl - 0.05, yl + 0.05, ROOF + 3.0, ROOF + 3.15, M["frame"])
for xp in (-10.5, -8.5, -4.5, -2.5, 0.0, 2.0):                                    # lounge seats
    rt.box(xp - 0.6, xp + 0.6, 9.0, 10.2, ROOF + 0.12, ROOF + 0.55, M["white"])
rt.box(-11.4, -6.5, 14, 15, ROOF + 0.12, ROOF + 0.8, M["concrete"])               # planters
rt.box(-4, 3.3, 14, 15, ROOF + 0.12, ROOF + 0.8, M["concrete"])
rt.box(-11.3, -6.6, 14.1, 14.9, ROOF + 0.8, ROOF + 1.3, M["hedge"])
rt.box(-3.9, 3.2, 14.1, 14.9, ROOF + 0.8, ROOF + 1.3, M["hedge"])
rt.finish()
cg = Part("Core_Door_Glass", "Glazing")
cg.box(-11.2, -8.2, 16.96, 17.0, ROOF, ROOF + 2.4, M["glass"])
cg.finish()

# ---------------- neon green LED accents
led = Part("LED_Strips", "Structure")
led.box(-12.4, 4, -0.05, 0.0, GF1 + 0.05, GF1 + 0.15, M["led"])                    # underside of white volume front
led.box(-12.4, 3.6, -0.05, 0.0, ROOF + 0.4, ROOF + 0.48, M["led"])                  # roof edge
led.box(TW0 + 0.4, TW1 - 0.4, TY - 0.05, TY, TT - 0.6, TT - 0.52, M["led"])          # tower sign frame
led.box(TW0 + 0.4, TW1 - 0.4, TY - 0.05, TY, 7.4, 7.48, M["led"])
led.box(TW0 + 0.4, TW0 + 0.48, TY - 0.05, TY, 7.4, TT - 0.52, M["led"])
led.box(TW1 - 0.48, TW1 - 0.4, TY - 0.05, TY, 7.4, TT - 0.52, M["led"])
led.box(TW0, TW1 + 0.6, TY - 0.05, TY, GF1 + 0.02, GF1 + 0.1, M["led"])            # tower underside line
for i, (y0, y1, top) in enumerate(STEPS):                                          # stepped wing edges
    led.box(4, 24, y0 - 0.05, y0, top - 0.16, top - 0.08, M["led"])
    led.box(24, 24.05, y0, y1, top - 0.16, top - 0.08, M["led"])
led.box(-10.5, -0.5, -5.05, -5.0, 3.95, 4.15, M["led"])                             # canopy fascia
led.box(-10.55, -10.5, -5.0, 2.0, 3.95, 4.15, M["led"])
led.box(-0.5, -0.45, -5.0, 2.0, 3.95, 4.15, M["led"])
led.box(-11.2, -8.2, 16.95, 17.0, ROOF + 2.5, ROOF + 2.58, M["led"])                 # core door head
led.box(-6.2, 3.2, 12.9, 13.05, ROOF + 2.78, ROOF + 2.82, M["led"])                 # pergola
led.finish()

# ---------------- interior (seen through the glazing)
it = Part("Interior_Rooms", "Interior")
for z in (L1, L2):                                                                # trading classrooms
    for yr in (1.6, 2.9):
        it.box(-12.2, 3.0, yr - 0.35, yr + 0.35, z, z + 0.75, M["furn"])
        x = -11.8
        while x < 2.8:
            it.box(x, x + 0.6, yr - 0.08, yr - 0.03, z + 0.8, z + 1.2, M["furn"], faces={"-Y": M["screen"]})
            x += 1.2
it.box(-6, -2, 6, 7, GF0, GF0 + 1.1, M["white"], faces={"-Y": M["led"]})            # reception desk
it.box(-18, -10, 11.94, 12.0, 1.4, 3.9, M["screen"])                                # lobby video wall
for xs in (-21, -19, -15, 0, 2):
    it.box(xs - 0.7, xs + 0.7, 7, 8.4, GF0, GF0 + 0.45, M["furn"])
it.finish()
il = Part("Interior_LinearLights", "Interior")
for y in (4, 7, 10):
    il.box(-22.5, 3, y - 0.08, y + 0.08, GF1 - 0.08, GF1 - 0.02, M["ilight"])
for z in (L1T, L2T):
    for y in (1.3, 3.0):
        il.box(-12.2, 3.0, y - 0.06, y + 0.06, z - 0.06, z - 0.02, M["ilight"])
for x in (-9.5, -7.5, -5.5, -3.5, -1.5):
    il.box(x - 0.2, x + 0.2, -4.4, -4.0, 3.88, 3.9, M["ilight"])                      # canopy downlights
    il.box(x - 0.2, x + 0.2, -1.4, -1.0, 3.88, 3.9, M["ilight"])
il.finish()

# ---------------- branding
seven("Logo_7", -25.9, 8.6, 5.0, TY)
t1 = text("Sign_7DAYS", "7DAYS", "Arial Black", 2.2, -19.9, TY, 11.4, M["letters"], 0.06)
t2 = text("Sign_ACADEMY", "ACADEMY", "Arial Bold", 1.3, -19.8, TY, 9.1, M["logo"], 0.05)
fit_width(t1, 6.3); fit_width(t2, 6.0)
mo = Part("Sign_Monument_Wall", "Branding")                                        # monument sign on the plaza
MX = -31.0
mo.box(MX, MX + 12, -15.2, -14.4, 0, 2.4, M["anth"])
mo.box(MX - 0.4, MX + 12.4, -15.4, -14.2, 0, 0.18, M["concrete"])
mo.box(MX, MX + 12, -15.25, -15.2, 0.22, 0.28, M["led"])
mo.finish()
seven("Logo_7_Monument", MX + 0.6, 0.55, 1.45, -15.2, depth=0.06)
t3 = text("Sign_Monument_Text", "7DAYS ACADEMY", "Arial Black", 0.78, MX + 2.5, -15.2, 1.0, M["letters"], 0.03)
fit_width(t3, 9.0)

# ---------------- landscape
la = Part("Ground_Lawn", "Landscape")
la.box(-150, 150, -80, 150, -0.12, -0.06, M["lawn"])
la.finish()
pv = Part("Ground_Plaza", "Landscape")
pv.box(-36, 34, -20, 40, -0.06, 0.0, M["paving"])
pv.finish()
lb = Part("Lawn_Beds", "Landscape")
lb.box(-34, -14, -18, -6, 0, 0.08, M["lawn"])
lb.box(4, 32, -18, -6, 0, 0.08, M["lawn"])
lb.box(26.5, 32, -4, 34, 0, 0.08, M["lawn"])
lb.box(-34, -29.5, -4, 34, 0, 0.08, M["lawn"])
lb.finish()
pl = Part("Planters", "Landscape")
pl.box(5, 23, -1.6, -0.3, GF0, GF0 + 0.7, M["concrete"])                            # planter along the wing
pl.box(5.1, 22.9, -1.5, -0.4, GF0 + 0.7, GF0 + 1.25, M["hedge"])
pl.box(-12.8, -11.4, -4.6, -3.0, 0, 0.8, M["concrete"])                             # flanking the entrance
pl.box(-12.7, -11.5, -4.5, -3.1, 0.8, 1.35, M["hedge"])
pl.box(0.0, 1.4, -4.6, -3.0, 0, 0.8, M["concrete"])
pl.box(0.1, 1.3, -4.5, -3.1, 0.8, 1.35, M["hedge"])
pl.finish()
fu = Part("Plaza_Benches", "Landscape")
for x in (-26, -20, 18, 24):
    fu.box(x - 1.4, x + 1.4, -5.2, -4.4, 0, 0.45, M["concrete"])
    fu.box(x - 1.3, x + 1.3, -5.15, -4.45, 0.45, 0.5, M["deck"])
fu.finish()
bo = Part("Bollards", "Landscape")
bl = Part("Bollard_Lights", "Landscape")
for x in (-13.5, 2.5):
    for y in (-17, -13, -9):
        bo.cyl(x, y, 0, 0.8, 0.1, M["frame"], seg=6)
        bl.cyl(x, y, 0.8, 0.95, 0.1, M["bollard"], seg=6)
bo.finish(); bl.finish()

TREES = [(-35, -8, 5.2, 2.6), (-16.5, -11, 4.6, 2.2), (14, -9, 4.4, 2.1), (28, -12, 5.4, 2.7),
         (29.5, 12, 5.0, 2.5), (-31.5, 14, 5.2, 2.6), (-8, 36, 5.6, 2.8), (16, 36, 5.0, 2.4)]
for i, (tx, ty, h, r) in enumerate(TREES):
    Part(f"Tree_{i}_Trunk", "Landscape").cyl(tx, ty, 0, h, 0.18, M["bark"], seg=6).finish()
    c = Part(f"Tree_{i}_Crown", "Landscape")
    rnd = random.Random(i)
    c.blob(tx, ty, h + r * 0.35, r, M["leaves"], seed=i * 7)
    c.blob(tx + r * 0.55, ty + rnd.uniform(-0.6, 0.6), h - r * 0.05, r * 0.68, M["leaves"], seed=i * 7 + 1)
    c.blob(tx - r * 0.5, ty + rnd.uniform(-0.6, 0.6), h + r * 0.05, r * 0.7, M["leaves"], seed=i * 7 + 2)
    c.finish()


# ---------------- lights
def light(name, kind, loc, energy, color=(1, 1, 1), rot=(0, 0, 0), size=None, spot=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy, ld.color = energy, color
    if size is not None:
        ld.shadow_soft_size = size if kind != "AREA" else 0.25
        if kind == "AREA":
            ld.size = size
    if spot is not None:
        ld.spot_size = spot
        ld.spot_blend = 0.6
    o = bpy.data.objects.new(name, ld)
    o.location, o.rotation_euler = loc, rot
    COLS["Lighting"].objects.link(o)
    o.parent = ROOT
    return o


sun = light(P + "Sun_Dusk", "SUN", (0, 0, 0), 3.0, (1.0, 0.78, 0.55), rot=(1.22, 0.0, -0.62))
sun.data.angle = math.radians(3)
for i, (x, y, z) in enumerate([(-17, 7, 4.4), (-6, 7, 4.4), (-4, 2.2, 8.0), (-4, 2.2, 11.9), (14, 6, 5.0),
                               (14, 12, 7.6), (14, 18, 10.2)]):
    light(f"{P}Interior_{i}", "AREA", (x, y, z), 700, (1.0, 0.78, 0.55), size=4)
for i, x in enumerate((-25.5, -20, -14.5)):
    light(f"{P}Up_Brand_{i}", "SPOT", (x, -2.6, GF0 + 0.1), 260, (1.0, 0.85, 0.7),
          rot=(math.radians(172), 0, 0), spot=math.radians(50))
for i, x in enumerate((-24.5, -21.5, -17.0)):
    light(f"{P}LogoGlow_{i}", "POINT", (x, -4.5, 11.0), 30, GREEN, size=1.0)
light(P + "Canopy_Spot", "SPOT", (-5.5, -2.0, 3.8), 300, (1.0, 0.82, 0.6), spot=math.radians(110))

# ---------------- camera
cd = bpy.data.cameras.new(P + "Camera")
cd.lens = 32
cam = bpy.data.objects.new(P + "Camera", cd)
COLS["Camera"].objects.link(cam)
cam.location = (36.0, -44.0, 6.5)
tgt = Vector((-4.0, 6.0, 6.5))
cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler()
cam.parent = ROOT
SC.camera = cam

bpy.context.window.scene = SC
bpy.context.view_layer.update()

# ---------------- report
dg = bpy.context.evaluated_depsgraph_get()
tris = 0
for o in SC.objects:
    if o.type in ("MESH", "FONT"):
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
        tris += sum(len(p.vertices) - 2 for p in me.polygons)
        ev.to_mesh_clear()
print(f"[seven-days] objects={len(SC.objects)} tris={tris}")

if "--save" in ARGV:
    bpy.ops.wm.save_mainfile()
    print("[seven-days] saved", bpy.data.filepath)
