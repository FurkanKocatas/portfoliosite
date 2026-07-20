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

### Non-negotiables
- **Everything fits one viewport.** After any layout change, verify:
  `document.querySelector('.sheet').scrollHeight <= window.innerHeight + 2`, and that no
  `.mod` card clips its content (`scrollHeight > clientHeight`).
- **No long scrolling page.** He rejected the endless-scroll version outright.
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
- **React Three Fiber + drei + three** — used *only* for the cover owl (`OwlCanvas.jsx`),
  lazy-loaded so the main bundle stays ~109 KB gzip.
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
| `src/OwlCanvas.jsx` | R3F cover mascot (glTF owl, cursor-follow). |
| `src/index.css` | Design tokens + **all layout CSS** (grid, cards, detail overlay, responsive). |
| `public/owl.glb` | Owl model, 1.47 MB, CC-BY (see §8). |
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
- Lowercase serif **wordmarks** with a coloured full stop: `synapse.` `simtrader.`
- Magazine furniture: masthead rule, **folio lines** (`No. 01 — Principal work`),
  `fig. 0X` captions, dotted index rows, **crop/registration marks** in the paper corners,
  **barcode** in the footer.
- Palette (CSS vars in `index.css` `@theme`): paper `#f4efe3`, ink `#1d1b16`,
  green `#3e9433`, red `#c94f38`, blue `#34506b`, mustard `#d9a441`.
- Motion: staggered "print reveal" entrance, hard-shadow card hover, `prefers-reduced-motion`
  respected.

---

## 6. Project artwork — the rule that matters most

Each project's art is a **technical plate / patent-diagram schematic on pastel paper**:
fine dense engraved linework, a faint grid, concentric rings/axes, radial spokes,
**labelled callouts with real terms** (`vLLM · 35B`, `qdrant`, `WorkerW`, `R3F · GLSL`),
crosshairs, corner ticks. Dark tonal ink line colour + one red accent, on that project's
pastel tone.

Implementation: `Frame()` draws the grid + corner ticks, `Callout()` draws a leader line +
label, then each project component draws its own schematic. Palettes live in the `PAL`
object at the top of `Illustration.jsx`. Art is drawn on a **transparent** background —
the pastel comes from the plate/card CSS.

### ⚠️ simtrader is a permanent exception
`simtrader` **keeps its original artwork**: chunky **red `#c94f38` + black `#1d1b16`
candlesticks** with a red dashed trend line on clean cream `#fbf9f4`. **No `Frame()`, no
grid, no axes, no callouts, and no green candles.** He loves this one and rejected every
attempt to change it. Do not "harmonise" it with the other plates.

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

## 8. Cover mascot (open item)

`src/OwlCanvas.jsx` renders `public/owl.glb` — a low-poly **Great horned owl**.

- **Static mesh: no skeleton, no morph targets, no animations.** So real blinking and
  eye-only cursor tracking are **impossible** with this file. Currently the *whole owl*
  turns toward the cursor, plus a gentle idle bob.
- Auto-framed to its **bounding sphere** (radius normalised to 1, camera distance computed
  from fov + aspect each frame). This is deliberate: the sphere is rotation-invariant, so
  the owl can never be clipped as it turns. An earlier fixed-scale version put the owl
  off-frame ("sadece ayağı görünüyor").
- Tuning knobs at the top of the file: `BASE_Y` (resting facing direction), `BASE_X`,
  `MARGIN` (lower = fills more of the frame).
- **Status: he is not happy with the owl yet** ("baykuş kötü de dursun şu an") — parked, not
  finished. If he wants real blink + eye tracking, a **rigged/animated** model is required
  (Sketchfab "Animated" models; downloads there are login-gated).

### Attribution — must stay
The model is **CC-BY: "Owl · Poly by Google"**, credited in the footer with a link to
`https://poly.pizza/m/fNkq9CwSG6d`. If you swap the model, update or remove that credit
accordingly and keep the new model's licence satisfied.

Good free sources: [Poly Pizza](https://poly.pizza) (direct `.glb` links, mostly CC-BY/CC0),
[Quaternius](https://quaternius.com) (CC0, animated packs), Sketchfab (biggest, but
login-gated downloads).

---

## 9. Working conventions

- **Content changes go in `src/data.js`**, not in components.
- **New illustration?** Add a component in `Illustration.jsx` and register it in `MAP`.
  Follow the technical-plate language (grid + rings + real labelled callouts).
- **New plate colour?** Add a `t-*` class in `index.css` *and* map the `theme` key in
  `App.jsx`'s `plateClass`. Note: the class names `t-sage` / `t-teal` are historical —
  `t-sage` is now periwinkle (synapse) and `t-teal` is pale blue (soundscapes).
- Keep dependencies lean. Three.js is lazy-loaded on purpose — don't import it into the
  main bundle.
- After any change, run `npm run build` and re-check the one-viewport fit.
- Note for whoever verifies: in some sandboxed browsers `requestAnimationFrame` is throttled
  when the tab is hidden (`document.visibilityState === 'hidden'`), which makes animations
  look frozen and canvases stay at their default 300×150. That's an artefact of the
  environment, not a bug.

---

## 10. Open TODOs

- [ ] Mascot: he doesn't like the current owl. Either find a **rigged** owl (real blink +
      eye tracking) or rework the presentation.
- [ ] He may still want the card faces pushed further into the technical-plate language
      (they currently show the schematic as a faint texture behind the label).
- [ ] Mobile pass — the responsive rules exist but have not been reviewed on a device.
- [ ] Deploy to Hostinger (`dist/` → `public_html/`).
- [ ] Optional: link a live demo for `soundscapes.` once it's hosted.
