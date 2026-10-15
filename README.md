# PG Solution — corporate website

A single-page site (TH/EN) that scrolls down a 3D tower: 8 chambers, from the spire to the forge, one chapter per chamber.
It's a static page only — no backend, CMS or API.

```bash
pnpm install
pnpm dev        # http://localhost:3008
```

## Structure

| Path | Contents |
|---|---|
| `src/messages/{th,en}.json` | All copy on the page (from the PG Solution corporate website PDF) |
| `src/app/[locale]/page.tsx` | The one page: Navbar → TowerStage → 8 chapters → Footer |
| `src/features/story/` | Each chapter's content (HTML over the 3D) |
| `src/features/tower/` | The 3D scene (R3F), the scroll → camera path, the depth gauge, the fallback image |
| `src/app/globals.css` | Tokens from the design system v1.1 (Ink / Ivory / Coral / Stone / Muted / Rust) |
| `public/models/pg-tower.glb` | The 3D model (Draco) exported from `design/3d/pg-tower.blend` |

## Editing the 3D

1. Open `design/3d/pg-tower.blend` (scene `PGTower`).
2. Keep the names of the empties `cam_0…cam_7` and `tgt_0…tgt_7`; the web reads them as camera positions.
3. Export glTF Binary with Draco to `public/models/pg-tower.glb`.

## Notes

- The contact form is UI only; it isn't connected to any system yet (see `src/features/story/contact-form.tsx`).
- With reduced motion or no WebGL, the page shows `public/images/tower-fallback.webp` instead of the 3D.
