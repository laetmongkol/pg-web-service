# design/3d

## Company buildings (`company.blend`)

One scene per company building. Each scene has collections `<PFX>_Structure/_Glazing/_Interior/_Branding/_Landscape/_Lighting/_Camera`
(older scenes use variants such as `_Massing`, `_Shells`, `_Windows`), every object parented to a `<PFX>_Root` empty, plus lights and a camera.

| Scene | Slug | Notes |
|---|---|---|
| `PIP_Group_HQ` | `pip-group` | |
| `Sriwilai` | `sriwilai` | heaviest model (~97k tris after modifiers) |
| `DMS_Infinite` | `dms` | |
| `PIP_Evolution` | `pip-evolution` | scene camera points away from the building; the true front (logo) faces -Y |
| `PG_Concrete` | `pg-solution` | |
| `X_Tower` | `sabaidee-finx` | river / far shore / city context out to ±600 m (dropped on export) |
| `SevenDays_Academy` | `seven-days` | built by `build_seven_days.py` (prefix `SEV_`) |
| `Scene` | — | empty, ignore |

`company.backup.blend` is a local safety copy (git-ignored).

### Scripts

```bash
B="/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"

# (re)build the 7Days Academy scene and save it into company.blend
"$B" -b design/3d/company.blend --python design/3d/build_seven_days.py -- --save

# export one building -> public/models/company/<slug>-v1.glb (+ merges manifest.json)
"$B" -b design/3d/company.blend --python design/3d/export_company.py -- <Scene> <slug> [--front auto|-Y|+Y|-X|+X] [--keep 1.6] [--version v1]

# thumbnails -> public/images/company/<slug>.webp (1200x750, all buildings by default)
"$B" -b design/3d/company.blend --python design/3d/render_company_thumbs.py -- [Scene:slug ...]
```

`export_company.py` never saves the .blend. It applies modifiers, converts text/curves to meshes, drops cameras/lights/cutters,
drops ground/context pieces outside ~1.6x the building's half-extent (huge lawns, roads, river, far city), joins the rest per
material, triangulates, strips UVs (no textures are used) and writes Draco-compressed GLB (+Y up). It re-imports the file to
verify it and prints size / tris / bbox. Procedural colours (brick, ramps) are flattened to a single base colour for glTF.

### Naming contract for the web

- **Front**: the building's front (main entrance / logo sign) faces Blender **-Y**, which is **+Z in three.js / glTF**.
  The exporter detects the front from the Branding objects (ray cast) and rotates the scene about Z if needed.
- **Origin**: building footprint centred on the origin, ground at y = 0 (three.js), metres.
- **Logo / sign** meshes are separate nodes named `Logo_*` / `Sign_*` (e.g. `Logo_7_Plane`, `Sign_7DAYS`).
- **Glass** meshes are separate and their names contain `Glass` (e.g. `M_SEV_Glass`); everything else is one node per
  material, `M_<material name>`. Material names are kept from the .blend; emissive materials (LED strips, logos, interior
  glow) keep their emission + `KHR_materials_emissive_strength`.
- `public/models/company/manifest.json`: per slug `file`, `size` [w, h, d] (three.js x, y, z, whole model), `heroTarget`
  [x, y, z] (look-at point near the logo / entrance), `tris`, and `buildingSize` (building only).
