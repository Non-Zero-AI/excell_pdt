Assets for the Excell PDT frontend.

Structure (recommended):

- `icons/` - SVGs and raster icons used in the UI
- `images/` - General imagery (photos, illustrations, backgrounds)
- `video/` - Marketing or course-related videos that are bundled with the app
- `docs/` - Static documents that need to be imported/bundled (non-course-authoring docs)

Notes:
- Prefer putting **imported** assets here (things referenced directly from React via `import`).
- Larger or externally-managed files (e.g., Supabase Storage, CDN, or downloadable PDFs) can stay in `public/` or in backend storage.


