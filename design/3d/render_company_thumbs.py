# Render the design-picker thumbnails for the company buildings in company.blend.
#
#   blender -b design/3d/company.blend --python design/3d/render_company_thumbs.py -- [Scene:slug ...]
#       [--out public/images/company] [--samples 32] [--quality 82]
#
# One 1200x750 WebP per building (public/images/company/<slug>.webp): Eevee, 3/4 front view from the
# front-right, golden-hour sun from the front-left, soft dusk gradient sky (no transparency).
# The scene's own suns are muted for the shot, its other lights (interiors, uplights) stay on.
# The camera is auto-framed on the building (collections *Structure/*Massing/*Shells/*Glazing/...).
# Nothing is saved back to the .blend. PNG -> WebP conversion uses Pillow (Blender's Python if it has
# it, otherwise the system `python`).
import bpy, math, os, re, subprocess, sys, tempfile
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
DEFAULT = ["PIP_Group_HQ:pip-group", "Sriwilai:sriwilai", "DMS_Infinite:dms", "PIP_Evolution:pip-evolution",
           "PG_Concrete:pg-solution", "X_Tower:sabaidee-finx", "SevenDays_Academy:seven-days"]
pairs = [a for a in argv if re.fullmatch(r"[A-Za-z_]\w*:[a-z0-9-]+", a)] or DEFAULT


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


HERE = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.path.dirname(bpy.data.filepath)
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.abspath(opt("--out", os.path.join(REPO, "public", "images", "company")))
SAMPLES = int(opt("--samples", "32"))
QUALITY = int(opt("--quality", "82"))
BUILDING_KEYS = ("Structure", "Massing", "Shells", "Glazing", "Windows", "Facade")
# every company scene is modelled with its front (entrance / logo) facing -Y; see export_company.py
FRONT = {}
# per-scene framing tweaks: (azimuth from the front in degrees, +ve = from the right; elevation deg;
# exposure; extra zoom (<1 = closer))
TWEAK = {
    "X_Tower": (32, 7, -0.1, 1.0),
    "Sriwilai": (28, 6, -0.1, 1.0),
    "PG_Concrete": (34, 6, -0.1, 1.0),
    "SevenDays_Academy": (35, 7, -0.1, 0.9),
}

TMP = tempfile.mkdtemp(prefix="company_thumbs_")
os.makedirs(OUT, exist_ok=True)


def thumb_world():
    w = bpy.data.worlds.get("THUMB_DuskSky") or bpy.data.worlds.new("THUMB_DuskSky")
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    bg = nt.nodes.new("ShaderNodeBackground")
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    nt.links.new(bg.outputs[0], out.inputs[0])
    els = ramp.color_ramp.elements
    # Generated Z of the world is the view direction: 0 at the horizon (below is clamped), 1 at zenith
    els[0].position, els[0].color = 0.0, (1.0, 0.52, 0.26, 1)       # warm horizon glow
    els[1].position, els[1].color = 1.0, (0.08, 0.13, 0.34, 1)       # zenith
    for pos, col in ((0.06, (1.0, 0.62, 0.42, 1)),
                     (0.16, (0.82, 0.58, 0.62, 1)),                 # dusky rose
                     (0.34, (0.38, 0.45, 0.74, 1))):                # evening blue
        e = els.new(pos)
        e.color = col
    bg.inputs["Strength"].default_value = 0.8
    return w


def building_bounds(sc, dg):
    lo, hi = Vector((1e9,) * 3), Vector((-1e9,) * 3)
    for o in sc.objects:
        if o.type not in ("MESH", "FONT", "CURVE") or o.hide_render:
            continue
        cols = [c.name for c in o.users_collection]
        if "Cutter" in "".join(cols) or not any(k in c for c in cols for k in BUILDING_KEYS + ("Branding",)):
            continue
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
        for v in me.vertices:
            w = ev.matrix_world @ v.co
            for i in range(3):
                lo[i], hi[i] = min(lo[i], w[i]), max(hi[i], w[i])
        ev.to_mesh_clear()
    return lo, hi


def render(scene_name, slug):
    sc = bpy.data.scenes[scene_name]
    bpy.context.window.scene = sc
    dg = bpy.context.evaluated_depsgraph_get()
    lo, hi = building_bounds(sc, dg)
    c = (lo + hi) / 2
    size = hi - lo
    az, el, expo, zoom = TWEAK.get(scene_name, (35, 7, -0.1, 1.0))
    front = Vector({"-Y": (0, -1, 0), "+Y": (0, 1, 0), "-X": (-1, 0, 0), "+X": (1, 0, 0)}[FRONT.get(scene_name, "-Y")])
    right = Vector((-front.y, front.x, 0))            # viewer's right when facing the building
    a = math.radians(az)
    dirv = (front * math.cos(a) + right * math.sin(a)).normalized()

    # ---- camera
    cd = bpy.data.cameras.new("THUMB_cam")
    cd.lens = 35
    cd.clip_end = 3000
    cam = bpy.data.objects.new("THUMB_cam", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1200, 750, 100
    target = Vector((c.x, c.y, lo.z + size.z * 0.45))
    corners = [Vector((x, y, z)) for x in (lo.x, hi.x) for y in (lo.y, hi.y) for z in (max(lo.z, 0), hi.z)]

    def place(dist):
        cam.location = target + dirv * dist * math.cos(math.radians(el)) + Vector((0, 0, dist * math.sin(math.radians(el))))
        cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
        bpy.context.view_layer.update()

    dist = max(size.x, size.y) * 0.6
    for _ in range(80):                                # back off until the building fits with margins
        place(dist)
        pts = [world_to_camera_view(sc, cam, p) for p in corners]
        if all(0.06 <= p.x <= 0.94 and 0.08 <= p.y <= 0.80 and p.z > 0 for p in pts):
            break
        dist *= 1.05
    place(dist * zoom)

    # ---- light + sky
    muted = []
    for o in sc.objects:
        if o.type == "LIGHT" and o.data.type == "SUN" and not o.hide_render:
            o.hide_render = True
            muted.append(o)
    sd = bpy.data.lights.new("THUMB_sun", "SUN")
    sd.energy, sd.color, sd.angle = 5.0, (1.0, 0.64, 0.38), math.radians(2.5)
    sun = bpy.data.objects.new("THUMB_sun", sd)
    sc.collection.objects.link(sun)
    sun_from = (front * math.cos(math.radians(-55)) + right * math.sin(math.radians(-55))).normalized()
    sun_dir = -(sun_from * math.cos(math.radians(11)) + Vector((0, 0, math.sin(math.radians(11)))))
    sun.rotation_euler = sun_dir.to_track_quat("-Z", "Y").to_euler()
    old_world = sc.world
    sc.world = thumb_world()

    sc.render.engine = "BLENDER_EEVEE"
    sc.eevee.taa_render_samples = SAMPLES
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    old_expo = sc.view_settings.exposure
    sc.view_settings.exposure = expo
    sc.render.image_settings.file_format = "PNG"
    png = os.path.join(TMP, slug + ".png")
    sc.render.filepath = png
    bpy.ops.render.render(write_still=True)

    # restore (in memory only)
    sc.view_settings.exposure = old_expo
    sc.world = old_world
    for o in muted:
        o.hide_render = False
    bpy.data.objects.remove(sun)
    bpy.data.objects.remove(cam)
    return png


def to_webp(png, dst):
    try:
        from PIL import Image
        Image.open(png).convert("RGB").save(dst, "WEBP", quality=QUALITY, method=6)
    except ImportError:
        code = ("import sys; from PIL import Image; "
                "Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'WEBP', quality=int(sys.argv[3]), method=6)")
        subprocess.check_call(["python", "-c", code, png, dst, str(QUALITY)])


for p in pairs:
    scene_name, slug = p.split(":", 1)
    png = render(scene_name, slug)
    dst = os.path.join(OUT, slug + ".webp")
    to_webp(png, dst)
    print(f"[thumb] {scene_name} -> {dst} ({os.path.getsize(dst) / 1024:.0f} KB)")
