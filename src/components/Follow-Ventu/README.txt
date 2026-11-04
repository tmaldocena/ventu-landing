Masko Follow cursor

Open preview.html to test. Review all nine gaze directions and alignment before using the character.

For React/Next.js: copy frames/ to public/mascot/frames/. Copy CursorFollower.tsx, cursor-follower.js, and cursor-follower.d.ts together into your components directory. Import and render <CursorFollower />. To use Masko CDN hosting instead, open Get Links, enable hosting, and pass an interaction from the exported JSON as <CursorFollower config={interaction} />. Its frames contain all nine CDN URLs.

For other websites: copy cursor-follower.js and frames/ to your site. Import mountCursorFollower from the module, then pass a container element and a frames map using your hosted URLs. preview.html is a standalone example.

Originals are 1024x1024 PNGs. Playback files are lossless WebP at the same resolution. No API key or Masko connection is needed. Cursor tracking is off on touch devices and when reduced motion is requested. No click reactions are included.
