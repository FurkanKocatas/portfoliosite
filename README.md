# Portfolio — Furkan Kocataş

A one-screen, magazine-style portfolio. React 19 + Vite + Tailwind v4 + Framer Motion. The whole thing is a single open "spread" that fits one viewport — no long scroll. Clicking a project card opens an animated detail overlay (shared-layout morph). Builds to a fully static `dist/` — no Node on the server.

## Develop

```bash
npm install
npm run dev
```

## Build & deploy to Hostinger

```bash
npm run build
```

Upload the **contents** of `dist/` (index.html + assets/) to `public_html/` via Hostinger File Manager or FTP. `base: './'` is set, so it works from any folder.

## Editing

- **All content** — projects, blurbs, highlights, stack, links, contact — lives in [`src/data.js`](src/data.js). Add a project to the `projects` array; give it an `illo` id.
- **Illustrations** — per-project editorial SVG art in [`src/Illustration.jsx`](src/Illustration.jsx). Add a new component and register it in the `MAP` at the bottom.
- **Layout / styling** — the one-sheet grid, cards and detail overlay are all plain CSS classes in [`src/index.css`](src/index.css). The grid areas (`hero huna sim / hero sound more`) control card placement.
- **Palette & fonts** — CSS variables at the top of `index.css` (paper / ink / green / red / blue / mustard) and the Fraunces + Courier Prime font links in `index.html`.

## Design language

Cream paper + print grain, Fraunces serif + Courier Prime mono, lowercase serif wordmarks, hand-drawn SVG doodles, folio lines, a dotted index, and a barcode footer — a printed magazine issue, not a web template.
