import bpy, sys, os, json, struct
out = sys.argv[sys.argv.index("--") + 1]
keep = set(bpy.data.collections["PGT2"].all_objects)
for sc in list(bpy.data.scenes):
    if sc.name != "PGTowerV2":
        bpy.data.scenes.remove(sc)
for o in list(bpy.data.objects):
    if o not in keep:
        bpy.data.objects.remove(o)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14, export_cameras=False, export_lights=False, export_yup=True)
b = open(out, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
names = [x.get('name') for x in j['nodes']]
print("RESULT", os.path.getsize(out), [x for x in names if not x.startswith('stop_')], sum(1 for x in names if x.startswith('stop_')))
