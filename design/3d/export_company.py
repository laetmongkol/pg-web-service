# Export one company building scene from company.blend to a web-ready GLB.
#
#   blender -b design/3d/company.blend --python design/3d/export_company.py -- <Scene> <slug>
#       [--front auto|-Y|+Y|-X|+X] [--keep 1.6] [--out public/models/company] [--version v1] [--no-verify]
#
# What it does (nothing is saved back to the .blend):
#   * takes only that scene's renderable geometry (meshes, text, curves) with modifiers applied;
#     cameras, lights, empties and boolean cutters are left out;
#   * finds the building (collections *Structure/*Massing/*Shells/*Glazing/*Windows/*Facade) and
#     the FRONT = the side the Logo_* / Sign_* (Branding) objects face, found by ray casting;
#   * rotates the scene about Z so the front faces Blender -Y (= +Z in three.js / glTF), centres the
#     building footprint on the origin, ground stays at z = 0;
#   * drops huge ground / context pieces: landscape objects are kept only when their centre lies
#     within keep x the building's half-extent from its centre and they are not much bigger than that;
#   * joins everything per material (object "M_<material>"), keeps Branding objects separate and
#     named Logo_* / Sign_*, glass chunks keep "Glass" in the name; triangulates;
#   * exports GLB (+Y up, Draco level 6, no cameras / lights / animations, no UVs) and merges an
#     entry into public/models/company/manifest.json;
#   * re-imports the GLB to verify it opens and reports size / tris / bbox.
import bpy, bmesh, json, math, os, sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("usage: -- <SceneName> <slug> [--front auto] [--keep 1.6] [--out dir] [--version v1]")
SCENE, SLUG = argv[0], argv[1]


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


FRONT = opt("--front", "auto")
KEEP = float(opt("--keep", "1.6"))
VERSION = opt("--version", "v1")
HERE = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.path.dirname(bpy.data.filepath)
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.abspath(opt("--out", os.path.join(REPO, "public", "models", "company")))
VERIFY = "--no-verify" not in argv
BUILDING_KEYS = ("Structure", "Massing", "Shells", "Glazing", "Windows", "Facade")
GEOM = {"MESH", "CURVE", "FONT", "SURFACE", "META"}

sc = bpy.data.scenes[SCENE]
bpy.context.window.scene = sc
vl = sc.view_layers[0]
dg = bpy.context.evaluated_depsgraph_get()


def layer_excluded(coll):
    def find(lc):
        if lc.collection == coll:
            return lc
        for ch in lc.children:
            r = find(ch)
            if r:
                return r
    lc = find(vl.layer_collection)
    return lc is None or lc.exclude


def skip_reason(o):
    if o.type not in GEOM:
        return "type"
    if o.hide_render:
        return "hide_render"
    if o.display_type in ("WIRE", "BOUNDS"):
        return "display"
    for c in o.users_collection:
        if "Cutter" in c.name or c.hide_render:
            return "collection"
        if c != sc.collection and layer_excluded(c):
            return "excluded"
    return None


# ------------------------------------------------------------------ 1. evaluated copies in world space
recs, skipped = [], {}
for o in sc.objects:
    r = skip_reason(o)
    if r:
        skipped[r] = skipped.get(r, 0) + 1
        continue
    ev = o.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=False, depsgraph=dg)
    if me is None or not me.polygons:
        if me:
            bpy.data.meshes.remove(me)
        continue
    me.transform(ev.matrix_world)
    if ev.matrix_world.determinant() < 0:
        me.flip_normals()
    cols = [c.name for c in o.users_collection]
    recs.append(dict(name=o.name, cols=cols, me=me,
                     building=any(k in c for c in cols for k in BUILDING_KEYS),
                     brand=any("Branding" in c for c in cols) or o.name.startswith(("Logo_", "Sign_"))))


def bounds(me):
    xs = [v.co for v in me.vertices]
    return (Vector((min(v.x for v in xs), min(v.y for v in xs), min(v.z for v in xs))),
            Vector((max(v.x for v in xs), max(v.y for v in xs), max(v.z for v in xs))))


def union(rs):
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for r in rs:
        a, b = bounds(r["me"])
        for i in range(3):
            lo[i], hi[i] = min(lo[i], a[i]), max(hi[i], b[i])
    return lo, hi


bld = [r for r in recs if r["building"]] or recs
blo, bhi = union(bld)
centre = Vector(((blo.x + bhi.x) / 2, (blo.y + bhi.y) / 2, 0))

# ------------------------------------------------------------------ 2. front detection
AXES = {"-Y": Vector((0, -1, 0)), "+Y": Vector((0, 1, 0)), "-X": Vector((-1, 0, 0)), "+X": Vector((1, 0, 0))}


def detect_front():
    logos = [r for r in recs if r["brand"]]
    named = [r for r in logos if r["name"].startswith(("Logo_", "Sign_"))]
    logos = named or logos
    if not logos:
        return "-Y", "no branding objects"
    others = [r for r in recs if not r["brand"]]
    verts, polys = [], []
    for r in others:
        off = len(verts)
        verts += [v.co.copy() for v in r["me"].vertices]
        polys += [[off + i for i in p.vertices] for p in r["me"].polygons]
    tree = BVHTree.FromPolygons(verts, polys)
    votes = {k: 0.0 for k in AXES}
    for r in logos:
        me = r["me"]
        ax = {"X": 0.0, "Y": 0.0}
        cen, area = Vector(), 0.0
        for p in me.polygons:
            n = p.normal
            if abs(n.x) > abs(n.y) and abs(n.x) > abs(n.z):
                ax["X"] += p.area
            elif abs(n.y) > abs(n.z):
                ax["Y"] += p.area
            cen += p.center * p.area
            area += p.area
        if area == 0:
            continue
        cen /= area
        a = max(ax, key=ax.get)
        lo, hi = bounds(me)
        half = (hi - lo) / 2
        res = {}
        for sgn in "-+":
            d = AXES[sgn + a]
            start = cen + d * (abs(half.x if a == "X" else half.y) + 0.05)
            hit = tree.ray_cast(start, d, 300.0)
            res[sgn] = hit[0] is None
        if res["-"] != res["+"]:
            side = "-" if res["-"] else "+"
        else:                                   # both open / blocked: use offset from the building centre
            off = (cen.x - centre.x) if a == "X" else (cen.y - centre.y)
            side = "-" if off < 0 else "+"
        votes[side + a] += area
    best = max(votes, key=votes.get)
    return best, {k: round(v, 2) for k, v in votes.items() if v}


if FRONT == "auto":
    front, why = detect_front()
else:
    front, why = FRONT, "forced"
f = AXES[front]
theta = math.atan2(-1, 0) - math.atan2(f.y, f.x)
theta = (theta + math.pi) % (2 * math.pi) - math.pi
XF = Matrix.Rotation(theta, 4, "Z") @ Matrix.Translation(-centre)
for r in recs:
    r["me"].transform(XF)

blo, bhi = union(bld)
hx, hy = (bhi.x - blo.x) / 2, (bhi.y - blo.y) / 2
R = KEEP * max(hx, hy)

# ------------------------------------------------------------------ 3. keep / drop
kept, dropped = [], []
for r in recs:
    lo, hi = bounds(r["me"])
    c = (lo + hi) / 2
    big = max(hi.x - lo.x, hi.y - lo.y)
    inside = abs(c.x) <= R and abs(c.y) <= R
    if r["building"] or r["brand"] or (inside and big <= 2.3 * R):
        kept.append(r)
    else:
        dropped.append(r["name"])
        bpy.data.meshes.remove(r["me"])


# ------------------------------------------------------------------ 4. glTF-friendly materials
def flat_color(sock, depth=0):
    """approximate colour of a (possibly procedurally driven) colour socket"""
    if not sock.is_linked or depth > 6:
        v = sock.default_value
        return list(v)[:3] if hasattr(v, "__len__") else [v] * 3
    n = sock.links[0].from_node
    t = n.bl_idname
    if t == "ShaderNodeTexBrick":
        return flat_color(n.inputs["Color1"], depth + 1)
    if t == "ShaderNodeValToRGB":
        els = n.color_ramp.elements
        return [sum(e.color[i] for e in els) / len(els) for i in range(3)]
    if t in ("ShaderNodeMix", "ShaderNodeMixRGB"):
        cs = [s for s in n.inputs if s.type == "RGBA"]
        if len(cs) >= 2:
            a, b = flat_color(cs[0], depth + 1), flat_color(cs[1], depth + 1)
            return [(x + y) / 2 for x, y in zip(a, b)]
    if t == "ShaderNodeRGB":
        return list(n.outputs[0].default_value)[:3]
    for s in n.inputs:                          # first colour input of anything else
        if s.type == "RGBA":
            return flat_color(s, depth + 1)
    v = sock.default_value
    return list(v)[:3]


used = {m for r in kept for m in r["me"].materials if m}
for m in used:
    if not m.use_nodes:
        continue
    nt = m.node_tree
    for b in [n for n in nt.nodes if n.bl_idname == "ShaderNodeBsdfPrincipled"]:
        for key in ("Base Color", "Emission Color"):
            s = b.inputs[key]
            if s.is_linked:
                col = flat_color(s)
                for l in list(s.links):
                    nt.links.remove(l)
                s.default_value = (*col, 1)
        for key in ("Roughness", "Metallic", "Normal"):
            s = b.inputs[key]
            for l in list(s.links):
                nt.links.remove(l)


def is_glass(m):
    if m is None:
        return False
    if "glass" in m.name.lower():
        return True
    b = m.node_tree.nodes.get("Principled BSDF") if m.use_nodes else None
    return bool(b and b.inputs["Transmission Weight"].default_value >= 0.5)


# ------------------------------------------------------------------ 5. build export objects
# free the original names (in memory only, the .blend is never saved) so Logo_*/Sign_* stay exact
for o in list(bpy.data.objects):
    o.name = "__src__" + o.name
for m in list(bpy.data.meshes):
    if not m.name.startswith("__"):
        m.name = "__src__" + m.name
ex = bpy.data.scenes.get("__export__") or bpy.data.scenes.new("__export__")
for o in list(ex.objects):
    bpy.data.objects.remove(o)
bpy.context.window.scene = ex


def clean_name(n):
    base = n.rsplit(".", 1)[0] if len(n) > 4 and n[-4] == "." and n[-3:].isdigit() else n
    return base


def finalize(me):
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    while me.uv_layers:
        me.uv_layers.remove(me.uv_layers[0])
    for a in list(me.color_attributes):
        me.color_attributes.remove(a)
    return len(me.polygons)


out_objs = []
for r in [r for r in kept if r["brand"]]:
    n = clean_name(r["name"])
    if not n.startswith(("Logo_", "Sign_")):
        n = "Sign_" + n
    o = bpy.data.objects.new(n, r["me"])
    r["me"].name = n
    ex.collection.objects.link(o)
    out_objs.append(o)

rest = [r for r in kept if not r["brand"]]
if rest:
    tmp = []
    for r in rest:
        o = bpy.data.objects.new("tmp_" + r["name"], r["me"])
        ex.collection.objects.link(o)
        tmp.append(o)
    with bpy.context.temp_override(active_object=tmp[0], object=tmp[0], selected_objects=tmp,
                                   selected_editable_objects=tmp, scene=ex, view_layer=ex.view_layers[0]):
        bpy.ops.object.join()
    joined = tmp[0]
    jm = joined.data
    for idx, m in enumerate(list(jm.materials) or [None]):
        bm = bmesh.new()
        bm.from_mesh(jm)
        bmesh.ops.delete(bm, geom=[fa for fa in bm.faces if fa.material_index != idx], context="FACES")
        if not bm.faces:
            bm.free()
            continue
        for fa in bm.faces:
            fa.material_index = 0
        name = "M_" + (m.name if m else "None")
        if is_glass(m) and "glass" not in name.lower():
            name = "Glass_" + name
        me = bpy.data.meshes.new(name)
        bm.to_mesh(me)
        bm.free()
        me.materials.clear()
        me.materials.append(m)
        o = bpy.data.objects.new(name, me)
        ex.collection.objects.link(o)
        out_objs.append(o)
    bpy.data.objects.remove(joined)

# collapse material slots on branding meshes that use several materials? keep as-is (one object, n primitives)
tris = sum(finalize(o.data) for o in out_objs)


def world_bounds(objs):
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for o in objs:
        for v in o.data.vertices:
            for i in range(3):
                lo[i], hi[i] = min(lo[i], v.co[i]), max(hi[i], v.co[i])
    return lo, hi


lo, hi = world_bounds(out_objs)
size = [round(hi.x - lo.x, 2), round(hi.z - lo.z, 2), round(hi.y - lo.y, 2)]  # three.js x, y, z
bsize = [round(bhi.x - blo.x, 2), round(bhi.z - blo.z, 2), round(bhi.y - blo.y, 2)]

# hero target: between the building centre and the main logo, a little below it, on the front face
logos = [o for o in out_objs if o.name.startswith("Logo_")] or [o for o in out_objs if o.name.startswith("Sign_")]
if logos:
    c, a = Vector(), 0.0
    for o in logos:
        for p in o.data.polygons:
            c += p.center * p.area
            a += p.area
    c = c / a if a else Vector()
    hero_b = Vector((c.x * 0.5, c.y, max(3.0, min(c.z * 0.65, 25.0))))
else:
    hero_b = Vector((0, blo.y, (bhi.z - blo.z) * 0.4))
hero = [round(hero_b.x, 2), round(hero_b.z, 2), round(-hero_b.y, 2)]

# ------------------------------------------------------------------ 6. export
os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, f"{SLUG}-{VERSION}.glb")
bpy.context.window.scene = ex
kw = dict(filepath=path, export_format="GLB", use_active_scene=True, use_selection=False, export_cameras=False, export_lights=False,
          export_animations=False, export_yup=True, export_apply=False, export_texcoords=False,
          export_normals=True, export_materials="EXPORT", export_extras=False,
          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
          export_draco_position_quantization=14, export_draco_normal_quantization=10)
try:
    bpy.ops.export_scene.gltf(**kw, export_vertex_color="NONE")
except TypeError:
    bpy.ops.export_scene.gltf(**kw)
kb = os.path.getsize(path) / 1024

man_path = os.path.join(OUT, "manifest.json")
man = {}
if os.path.exists(man_path):
    with open(man_path, encoding="utf-8") as fh:
        man = json.load(fh)
man[SLUG] = {"file": f"/models/company/{SLUG}-{VERSION}.glb", "size": size, "heroTarget": hero, "tris": tris,
             "buildingSize": bsize}
with open(man_path, "w", encoding="utf-8") as fh:
    json.dump(man, fh, indent=2)
    fh.write("\n")

print(f"[export] {SCENE} -> {path}")
print(f"[export] front={front} ({why}) rot={math.degrees(theta):.0f}deg centre=({centre.x:.2f},{centre.y:.2f}) keepR={R:.1f}")
print(f"[export] objects={len(out_objs)} tris={tris} kb={kb:.0f} size={size} building={bsize} hero={hero}")
print(f"[export] skipped={skipped} dropped={dropped}")
print(f"[export] names={sorted(o.name for o in out_objs)}")

# ------------------------------------------------------------------ 7. verify by re-import
if VERIFY:
    vs = bpy.data.scenes.new("__verify__")
    bpy.context.window.scene = vs
    bpy.ops.import_scene.gltf(filepath=path)
    objs = [o for o in vs.objects if o.type == "MESH"]
    dg2 = bpy.context.evaluated_depsgraph_get()
    t2, lo2, hi2 = 0, Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for o in objs:
        me = o.data
        t2 += sum(len(p.vertices) - 2 for p in me.polygons)
        for v in me.vertices:
            w = o.matrix_world @ v.co
            for i in range(3):
                lo2[i], hi2[i] = min(lo2[i], w[i]), max(hi2[i], w[i])
    kinds = sorted({o.type for o in vs.objects})
    print(f"[verify] {os.path.basename(path)} meshes={len(objs)} types={kinds} tris={t2} "
          f"bbox_blender=({lo2.x:.1f},{lo2.y:.1f},{lo2.z:.1f})..({hi2.x:.1f},{hi2.y:.1f},{hi2.z:.1f}) "
          f"materials={len({s.material.name for o in objs for s in o.material_slots if s.material})}")
