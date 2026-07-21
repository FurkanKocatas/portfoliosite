# Portfolio — project guide for Claude

Personal portfolio site for **Furkan Kocataş**. Read this fully before changing anything:
this project went through many rejected design directions, and the constraints below are
hard-won. Repeating a rejected direction wastes the owner's time.

---

## 1. Who this is for

- **Furkan Kocataş — Computer Engineer** (NOT "software engineer" — he corrected this
  explicitly). Turkish, based in Türkiye. GitHub: `FurkanKocatas`.
- He speaks Turkish; the **site copy is English**.
- He gives fast, blunt feedback and iterates a lot. When a design choice is genuinely
  open, offer **2–3 concrete options to pick from** rather than building one blind — he
  has asked for this explicitly ("boşa efor vermemek için").

---

## 2. What the site is

A **one-screen magazine spread**. The entire portfolio — masthead, hero, project cards,
footer — fits in **exactly one viewport with no scrolling** on desktop. Clicking a project
card expands it into an animated full-screen "detail spread" (shared-layout morph).

It must read like a **printed magazine page**, not a web template.

### Two pages, one viewport each — a scroll-driven SLIDE-UP (2026-07-21)
The issue has **two pages**: the cover (page 1) and an **about** spread (page 2). Scrolling
**slides** the cover up and out the top while the about page slides up from below to take its
place — a way to add content **without** breaking the no-scroll rule (each page is one viewport;
you slide between them, never scroll a long page). (Earlier tries — a fold-down, a spine
page-turn, and a zoom-through — were all rejected; don't revive them.)
Mechanics: `.book` (`overflow: hidden`) holds two `.leaf`s (each 100vh). A `fold` **motion value
(0→1)** drives two things at once: the **cover** (`.leaf-front`, z-index 1) `scale 1→0.86` +
`opacity 1→0` — **zooms out and fades away**; and the **about page** (`.leaf-back`, z-index 2 —
*over* the cover) `y 100% → 0%` — **slides up from the bottom**, with a **top-edge drop shadow**
(`boxShadow` motion value, faded in from `fold 0.08`) so it reads as a sheet rising over the cover.

`fold` is **scrubbed by the mouse wheel** (a non-passive `wheel` listener on `.book` that
`preventDefault`s — no real scroll happens; guarded off ≤920px and while a detail is open) and
**settles** to 0/1 with a spring on idle; the "About ⌄" / "⌃ Cover" buttons call
`foldTo(1)`/`foldTo(0)`. About content lives in `about` in `data.js`. **If you add a page-3, keep
the slide-not-scroll rule.** Easy knobs: spring stiffness, wheel `* 0.0013`.

### Non-negotiables
- **Everything fits one viewport** — *both* pages. Verify each: `.leaf-front .sheet` and
  `.leaf-back .sheet` `scrollHeight <= window.innerHeight + 2`, and no `.mod` card clips.
- **No long scrolling page.** He rejected the endless-scroll version outright. A page *fold/turn*
  is fine (discrete, one viewport each); a scroll-down section is not.
- Mobile (<920px) is allowed to stack and scroll — that's the only exception.

---

## 3. Stack & commands

```bash
npm install
npm run dev      # vite dev server, port 5173
npm run build    # → dist/  (fully static)
npm run lint     # oxlint
```

- React 19 + Vite + **Tailwind v4** (via `@tailwindcss/vite`) + Framer Motion.
- **The cover mascot is now a pure-SVG technical plate** (`OwlPlate.jsx`) — no 3D. Main
  bundle stays ~110 KB gzip.
- **React Three Fiber + drei + three** are still in `package.json` but **no longer used by
  the app** — only the parked `src/ProjectScene.jsx` (dead code) references them. Safe to
  remove all three deps if `ProjectScene.jsx` is deleted too.
- `base: './'` in `vite.config.js` so the build works from any folder.

### Deploy
Static only — **no Node on the server**. `npm run build`, then upload the **contents of
`dist/`** (index.html + assets/ + owl.glb) to Hostinger `public_html/`.

---

## 4. File map

| File | Role |
|---|---|
| `src/data.js` | **All content.** meta, `projects[]`, `etcetera[]`. Edit copy here — never hardcode text in components. |
| `src/App.jsx` | Layout: masthead, grid, cards, footer + the detail overlay. |
| `src/Illustration.jsx` | Per-project SVG artwork (see §6). Also still exports an unused `Doodle` (old SVG robot owl) — dead code, safe to delete. |
| `src/OwlHero.jsx` | **Cover mascot** — vintage engraved owl #1 as a technical plate with live cursor-tracking eyes (see §8). |
| `public/owls/owl-1.webp` | The chosen engraved owl, bg removed, recoloured to one ink, **pupils hollowed** so the hero draws live eyes. Source + scripts in `owl-src/` (not shipped). |
| `src/index.css` | Design tokens + **all layout CSS** (grid, cards, detail overlay, responsive). |
| `src/ProjectScene.jsx` | **Dead code.** Old R3F per-project animated scenes — rejected, not imported, not bundled. Kept in case it's ever revived. |

### Project data shape (`src/data.js`)
```js
{
  id, name,            // name is the display wordmark, e.g. 'synapse.'
  no, kind, role, year,
  illo,                // key into Illustration.jsx MAP
  theme,               // plate colour class: paper|sage|teal|green|blue|mustard|red
  stamp,               // optional rotated stamp on the card
  blurb,               // short line on the card
  serifline,           // the big italic slogan in the detail (see §7)
  summary, highlights[], stack[], note, links[]
}
```

### Layout mechanics
- Grid areas in `index.css`: `"hero huna sim" / "hero sound more"`.
- Cards are `motion.button` with `layoutId={'mod-' + id}`; the detail overlay uses the
  **same layoutId** so it morphs. Card entrance animations are **opacity-only** —
  animating `y`/transform on a `layoutId` element fights the layout animation.
- `window.__openProject(id)` opens a detail (handy for testing from the console).
- Detail closes on ESC or backdrop click; body scroll is locked while open.

---

## 5. Design language (locked in — do not redesign)

- **Cream paper** `#f4efe3` + a print **grain** overlay (`.grain::after`).
- Type: **Fraunces** (serif, wordmarks/headings) + **Courier Prime** (mono, labels/body).
  Loaded from Google Fonts in `index.html`.
- Lowercase serif **wordmarks**, no trailing dot (the coloured full stops were tried then
  **removed** 2026-07-21 for a cleaner look). The three project titles share one size
  (`clamp(24px,2.8vw,40px)`). The masthead brand `Furkan Kocataş.` keeps its red dot.
- Magazine furniture: masthead rule, **folio lines** (`No. 01 — Principal work`),
  `fig. 0X` captions, dotted index rows, **crop/registration marks** in the paper corners,
  **barcode** in the footer.
- Palette (CSS vars in `index.css` `@theme`): paper `#f4efe3`, ink `#1d1b16`,
  green `#3e9433`, red `#c94f38`, blue `#34506b`, mustard `#d9a441`.
- Motion: staggered "print reveal" entrance, hard-shadow card hover, `prefers-reduced-motion`
  respected.

---

## 6. Project artwork — the rule that matters most

Each project's art is a **vintage engraving on a technical plate**: the engraving on a faint
grid with corner ticks and a **single `FIG.0X` caption**. The **labelled callouts** (`vLLM · 35B`,
`qdrant`, `WorkerW`, `GAZE ▸ CURSOR`…), crosshairs, and secondary tags were **removed 2026-07-21**
for a cleaner look — keep them gone unless asked. Dark ink line + one red accent, on paper.

Implementation: `Frame()` draws the grid + corner ticks, `Callout()` draws a leader line +
label, then each project component draws its own schematic. Palettes live in the `PAL`
object at the top of `Illustration.jsx`. Art is drawn on a **transparent** background —
the pastel comes from the plate/card CSS.

### ⚠️ ALL SIX projects now use vintage ENGRAVINGS, not drawn schematics (2026-07-21)
Furkan rejected the drawn schematics ("they look so bad") and asked for engraved art like the
owl. Every `Illustration.jsx` component now places a **public-domain engraving** inside the same
`Frame()` + `Callout()` furniture (grid, corner ticks, red crosshair, mono tags):
- **synapse** (`Huna`) → phrenology "mapped mind" head; callouts aim the stack (`vLLM · 35B`,
  `RAG`, `qdrant`, `openfga`) at brain regions.
- **soundscapes** → armillary sphere ("spin the world").
- **simtrader** → a **caduceus** (Mercury's staff — the classical symbol of trade/finance),
  isolated from a Mercury engraving, with a faint red uptrend line — see the note below; the
  candlesticks are backed up.
- **wallpapp** → a magic lantern (Kircher) projecting a living image (= live wallpaper).
- **dairymind** → a dairy **cow** etching in a pastoral field.
- **luminaft** → a **comet** (tone-inverted so the bright comet becomes ink).

The **about page** (page 2) also carries a faint colophon engraving — a **hand writing with a
quill** (`public/plates/quill.webp`, `.about-engraving`, opacity ~0.13, bottom-right, flipped so
the quill points at the content). Same pipeline (`owl-src/src5/`).

All files: `public/plates/<id>.webp`, single ink `#211d17`, bg removed via luminance→alpha.
Sources + `process2.py`/`process3.py` (crops, thresholds, masks) live in `owl-src/src2/` &
`owl-src/src3/` (not shipped). All PD → **no attribution required**.

### ⚠️ simtrader — candlesticks replaced by Mercury, but BACKED UP
He was on record loving the candlesticks, so before swapping them he asked for a backup. Motif
went: **bull** (read like dairymind's cow) → full **Mercury** statue (nude — inappropriate for
his Turkish audience) → the **caduceus alone** (cropped from that Mercury plate). The original
candlestick component is kept **in code** as
`SimTraderCandles()` (unused; oxlint warns — that's expected) and also as
`owl-src/SimTrader-candlesticks-BACKUP.jsx`. **To revert:** point `MAP.simtrader` back at
`SimTraderCandles`. Don't delete either backup without asking.

### Rejected art directions (do not go back to these)
1. **Dark / gradient / glassmorphism "AI template"** — the original v1. Rejected wholesale.
2. **Wobbly hand-drawn line art** — read as "çocuk çizmiş gibi" (a child drew it).
3. **Animated 3D scenes per project** (neural net, candles, globe…) — built with R3F, then
   rejected as "too simple". The code is still in `src/ProjectScene.jsx`, unused.
4. **Real product screenshots** — considered, then explicitly dropped: "içlerinden görüntü
   olmasına gerek yok, tasarım olacak yine".
5. **Dark blueprint** — right idea, too dark. Pastel version won.

The direction was picked from an A/B/C sample sheet; **C (technical plate) + pastel** won.

---

## 7. Copy rules

- Sloganlar (`serifline`) were **chosen by him from a shortlist** — don't rewrite without asking:
  - synapse: *"It knows everything on the network, and tells no one off it."*
  - simtrader: *"Signals, not orders. Conviction, not custody."*
- If a slogan needs changing, **offer 5 options and let him pick**.

### ⚠️ synapse = confidential employer work
`synapse.` is the portfolio name for an enterprise AI platform he works on professionally.
**All references to the client/employer (Konya Metropolitan Municipality) were deliberately
removed** — it must read as an independent, generic enterprise platform. Never re-add the
organisation name, and never publish internals, screenshots, code, or credentials from it.
The `note` field says the code stays private; keep it that way.

### simtrader is more complex than it looks
Two halves: (1) a Turkish-market advisory app (BIST equities, TEFAS funds, gram gold —
advisory only, never trades) and (2) a **US-equity day-trading ML simulation** over the
S&P 500 / Nasdaq, paper-only. 2.4M five-minute + 94k daily bars, Alpaca real-time + Yahoo
history, walk-forward train→trade windows, CUSUM + triple-barrier + fractional differentiation
+ LightGBM with purged K-fold CV, validated with **Probabilistic & Deflated Sharpe** (it
reports honestly when there is no edge). Postgres 16 + TimescaleDB + pgvector.
Source project lives at `../financeapp` (see its `docs/HANDOFF.md`).

---

## 8. Cover mascot — engraved owl with live eyes

`src/OwlHero.jsx` renders the mascot: **vintage engraved owl #1** (Furkan's pick from a
supplied set of four) wrapped in the technical-plate language — faint grid, corner + edge
ticks, "cut" (arc/dashed) rings, a red gaze reticle, an accent spot, and monospace tags
(`FIG.00 · STRIX Nº1`, `HORNED · A`, `PERCH · LEFT`, `Ø 1.00`). The owl is a transparent,
single-ink WebP; **the eyes are drawn by SVG and track the cursor**.

### How the live eyes work
Both eyes are **fully hollowed** in the shipped image (`owl1_body.py`, `RER=41`), and `OwlHero`
redraws each eye in SVG in the engraving's own idiom so they don't look pasted-on: a hatched
**radial-spoke iris** (`iris()`), faint concentric rings, an ink rim, and a textured pupil
(`#211d17`) with catchlights. The iris spokes + pupil are one **rolling eyeball group** (`eyeball()`, one `eyeRefs` per eye)
that sits on a fixed cream backing (sclera) and is clip-pathed to the socket circle. An rAF
loop then:
- **tracks the cursor** — the whole eyeball rolls toward the pointer (so the spokes travel
  *with* the pupil instead of the pupil sliding over static lines), clamped by `TRAVEL`, with a
  slow idle drift when the pointer is elsewhere; a thin backing crescent shows on the trailing
  side as it looks aside;
- **blinks every ~5s** — a feathered lid (`LID_PATH` + `LASH_PATH` + hatch), clip-pathed to the
  socket, sweeps down and back over `D` (≈0.6s, occasional double-blink). The rim is drawn on top
  of the clip so the socket outline always reads.

Respects `prefers-reduced-motion` (bails → static open eyes). Eye centres come from the owl's
natural pixel coords (`EYES = [map(96,139), map(209,139)]`) mapped into the 440×240 viewBox via
the fixed image rect `IMG`. If you re-place or swap the image, re-measure those **and** the
hollow centres/`RER` in `owl1_body.py` together.

### Image pipeline (`owl-src/`, not shipped)
Supplied as one engraving of four owls (`owl-src/…jpg`). `process.py` crops each, drops the
cream background via a luminance→alpha ramp (fine lines stay anti-aliased; RGB is set to the
ink everywhere so **no white halo** appears on any bg), recolours to one ink `#211d17`, trims,
downscales, writes transparent WebP. `owl1_body.py` then hollows owl #1's pupils. To change the
owl tint/pupils: edit those scripts, re-run (`cd owl-src && python3 process.py && python3
owl1_body.py`), copy `owl-1.webp` to `public/owls/`.

### History (why it's not 3D anymore)
Two earlier mascots were rejected/replaced on 2026-07-21: (1) `OwlCanvas.jsx` — a CC-BY glTF
owl (`public/owl.glb`, Poly by Google) via React Three Fiber; Furkan disliked it and it didn't
fit the frame. (2) `OwlPlate.jsx` — a pure-vector patent-diagram owl (interim). Both were
removed along with `owl.glb`, the three-owl chooser (`OwlSwitcher.jsx`/`OwlVintage.jsx`), the
unused owls, and the footer model credit. If a 3D owl is ever revived, restore a CC-BY/CC0
credit in the footer.

---

## 9. Working conventions

- **Content changes go in `src/data.js`**, not in components.
- **New illustration?** Add a component in `Illustration.jsx` and register it in `MAP`.
  Follow the technical-plate language (grid + rings + real labelled callouts).
- **New plate colour?** Add a `t-*` class in `index.css` *and* map the `theme` key in
  `App.jsx`'s `plateClass`. Note: the class names `t-sage` / `t-teal` are historical — both are
  now **white** `#fbf9f4` (synapse & soundscapes were green/clay, then whitened 2026-07-21 at his
  request), same as `t-paper` (simtrader). Their `PAL` `line` colours were also neutralised to
  warm charcoal `#3a352d` so the plates read truly white (no green/orange tint from the grid or
  callouts). When changing a project's colour, move all three together: the card bg (`.card-*`),
  the plate bg (`t-*`), and the `PAL` `line` colour.
- Keep dependencies lean. Three.js is lazy-loaded on purpose — don't import it into the
  main bundle.
- After any change, run `npm run build` and re-check the one-viewport fit.
- Note for whoever verifies: in some sandboxed browsers `requestAnimationFrame` is throttled
  when the tab is hidden (`document.visibilityState === 'hidden'`), which makes animations
  look frozen and canvases stay at their default 300×150. That's an artefact of the
  environment, not a bug.

---

## 10. Open TODOs

- [x] Mascot: chosen — vintage engraved owl #1 (`OwlHero.jsx`) with SVG cursor-tracking
      eyes over the hollowed engraving. (2026-07-21)
- [ ] He may still want the card faces pushed further into the technical-plate language
      (they currently show the schematic as a faint texture behind the label).
- [ ] Mobile pass — the responsive rules exist but have not been reviewed on a device.
- [ ] Deploy to Hostinger (`dist/` → `public_html/`).
- [ ] Optional: link a live demo for `soundscapes.` once it's hosted.
