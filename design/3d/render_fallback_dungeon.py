# Still of the dungeon tower for design 1's reduced-motion / no-WebGL fallback. Run headless:
#   blender -b design/3d/pg-tower.blend --python design/3d/render_fallback_dungeon.py -- public/images/tower-fallback-v1b.webp
import bpy, sys
from mathutils import Vector
out = sys.argv[sys.argv.index("--") + 1]
for sc in list(bpy.data.scenes):
    if sc.name != "PGTower":
        bpy.data.scenes.remove(sc)
SC = bpy.data.scenes["PGTower"]
cd = bpy.data.cameras.new("fallback_cam"); cd.lens = 30
cam = bpy.data.objects.new("fallback_cam", cd); SC.collection.objects.link(cam); SC.camera = cam
c, l = Vector((-28, -50, -8)), Vector((0, 0, -16))
cam.location = c; cam.rotation_euler = (l - c).to_track_quat('-Z', 'Y').to_euler()
for m in bpy.data.materials:      # fire, slits and lava glow as on the site
    if m.name in ("d_flame", "d_window", "d_lava") and m.node_tree:
        b = m.node_tree.nodes.get("Principled BSDF")
        b.inputs["Emission Color"].default_value = b.inputs["Base Color"].default_value
        b.inputs["Emission Strength"].default_value = 8
for i in range(8):                # torchlight inside each chamber
    t = bpy.data.objects[f"tgt_{i}"].location
    lt = bpy.data.lights.new(f"torch_{i}", 'POINT'); lt.energy = 3000; lt.color = (1, .6, .32)
    o = bpy.data.objects.new(f"torch_{i}", lt); o.location = (t.x, t.y, t.z + 2.5); SC.collection.objects.link(o)
w = bpy.data.worlds.new("fallback_world"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.09, 0.05, 0.035, 1)
SC.world = w
SC.render.engine = 'BLENDER_EEVEE'; SC.eevee.taa_render_samples = 32
SC.render.resolution_x = 1600; SC.render.resolution_y = 1000
SC.render.image_settings.file_format = 'WEBP'; SC.render.image_settings.quality = 78
SC.view_settings.view_transform = 'AgX'
SC.render.filepath = out
bpy.ops.render.render(write_still=True)
