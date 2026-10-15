import bpy, sys
out = sys.argv[sys.argv.index("--") + 1]
for sc in list(bpy.data.scenes):
    if sc.name != "PGTowerV2": bpy.data.scenes.remove(sc)
SC = bpy.data.scenes["PGTowerV2"]
cam = bpy.data.objects["t2_cam"]; SC.camera = cam; cam.data.lens = 30
from mathutils import Vector; c = Vector((-44, -124, 4)); l = Vector((0, 0, 34))
cam.location = c; cam.rotation_euler = (l - c).to_track_quat('-Z', 'Y').to_euler()
w = SC.world; bg = w.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.11, 0.15, 0.34, 1); bg.inputs[1].default_value = 1.0
SC.render.engine = 'BLENDER_EEVEE'; SC.eevee.taa_render_samples = 32
SC.render.resolution_x = 1600; SC.render.resolution_y = 1000
SC.render.image_settings.file_format = 'WEBP'; SC.render.image_settings.quality = 78
SC.view_settings.view_transform = 'AgX'
SC.render.filepath = out
bpy.ops.render.render(write_still=True)
