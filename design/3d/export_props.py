# Export only the section props (collection PGProps) to a GLB. Run headless:
#   blender -b design/3d/pg-tower.blend --python design/3d/export_props.py -- public/models/pg-props-v1.glb
import bpy, sys, os, json, struct
out = sys.argv[sys.argv.index("--") + 1]
keep = set(bpy.data.collections["PGProps"].all_objects)
for sc in list(bpy.data.scenes):
    if sc.name != "PGProps":
        bpy.data.scenes.remove(sc)
for o in list(bpy.data.objects):
    if o not in keep:
        bpy.data.objects.remove(o)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_cameras=False, export_lights=False, export_yup=True)
b = open(out, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
print("RESULT", os.path.getsize(out), sorted(x.get('name') for x in j['nodes'] if x.get('name', '').count('_') == 1))
