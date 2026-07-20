// All portfolio content lives here. Edit text/links without touching components.

export const meta = {
  name: 'Furkan Kocataş',
  role: 'Computer Engineer — AI Systems',
  location: 'Türkiye',
  issue: 'Issue 01 · 2026',
  email: 'furkankocatas@gmail.com',
  github: 'https://github.com/FurkanKocatas',
  linkedin: 'https://www.linkedin.com/in/furkan-kocatas',
  quip: "I'm not overengineering, I'm just 26 microservices deep.",
}

// Every openable project. `illo` picks the SVG in Illustration.jsx.
export const projects = [
  {
    id: 'huna',
    name: 'synapse.',
    no: 'No. 01',
    kind: 'Principal work',
    role: 'Air-gapped Enterprise AI Platform',
    year: '2025 → now',
    illo: 'huna',
    theme: 'sage',
    stamp: null,
    blurb:
      'Air-gapped, fully offline AI platform: RAG document Q&A, report / slide / infographic generation, OCR — 26 microservices on self-hosted GPUs.',
    serifline:
      'It knows everything on the network, and tells no one off it.',
    summary:
      'A large-scale enterprise AI platform that runs entirely on-premise and fully offline. It answers questions over an organization’s own documents and can generate media from them — full reports, slide decks and infographics — alongside OCR and translation, all without a single byte leaving the network.',
    highlights: [
      'Generates finished deliverables from the corpus — reports, presentations and infographics — not just chat answers',
      '26 microservices across ~60 containers, orchestrated with Docker and Traefik',
      'Self-hosted LLM serving with vLLM — a quantized 35B chat model plus dedicated embedding, reranking and guard models, routed across separate GPU hosts',
      'Qdrant vector search, OpenFGA fine-grained authorization, immudb audit trail, Patroni HA PostgreSQL',
      'Full observability: Prometheus, Grafana, Loki, Tempo, OpenTelemetry',
    ],
    stack: ['vLLM', 'RAG', 'Qdrant', 'OpenFGA', 'Next.js', 'FastAPI', 'Go', 'Docker'],
    note: 'Enterprise work — architecture described here, code stays private.',
    links: [],
  },
  {
    id: 'simtrader',
    name: 'simtrader.',
    no: 'No. 02',
    kind: 'Personal work',
    role: 'Quant research · US day-trading + Turkish markets',
    year: '2026',
    illo: 'simtrader',
    theme: 'paper',
    stamp: 'Paper trading only',
    blurb:
      'A two-market quant platform: Turkish-market advisory + a US-equity (S&P 500 / Nasdaq) day-trading ML simulator. Paper-only — it never places an order.',
    serifline:
      'Signals, not orders. Conviction, not custody.',
    summary:
      'A quantitative platform with two halves. One is an advisory app for the Turkish markets — BIST equities, TEFAS funds and gram gold, with portfolio tracking, news and an advisory-only AI analyst. The other is a US-equity day-trading simulator running a full research loop over millions of intraday and daily bars across the S&P 500 and Nasdaq. Both are paper-only: nothing here ever places an order.',
    highlights: [
      'Day-trading simulation over 2.4M five-minute + 94k daily bars (Alpaca real-time + Yahoo history), with regular-hours filtering and walk-forward train → trade windows',
      'Python ML sidecar: CUSUM event sampling, triple-barrier labeling, fractional differentiation and LightGBM with purged K-fold CV — validated with Probabilistic & Deflated Sharpe, so it reports honestly when there is no edge',
      'PostgreSQL 16 + TimescaleDB hypertables + pgvector for regime/pattern similarity; Next.js 16 frontend; switchable Gemini / local Ollama advisory',
    ],
    stack: ['Next.js', 'TimescaleDB', 'pgvector', 'LightGBM', 'Alpaca', 'Python'],
    note: 'Active build.',
    links: [],
  },
  {
    id: 'soundscapes',
    name: 'soundscapes.',
    no: 'No. 03',
    kind: 'Personal work',
    role: 'Interactive audio · 3D',
    year: '2026',
    illo: 'soundscapes',
    theme: 'teal',
    stamp: null,
    blurb: "A globe you orbit — click any country, hear its music, live from the charts.",
    serifline: 'Spin the world. Wherever you stop, it starts to sing.',
    summary:
      "An interactive 3D globe you can orbit with the mouse. Click any country and it plays that place's signature sound — pulled live from country music charts, with a cross-fading Web Audio engine so tracks never click when they switch.",
    highlights: [
      'Next.js 15 + react-globe.gl (three.js / WebGL) with a 186-country query map',
      'Dual-slot cross-fade AudioEngine on the Web Audio API + a live analyser visualizer',
      'Keyless: streams from the iTunes Search API and Apple RSS country charts',
    ],
    stack: ['Next.js', 'Three.js', 'Web Audio API', 'TypeScript'],
    note: 'Deploy-ready.',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/FurkanKocatas/soundscapesofearth' }],
  },
  {
    id: 'wallpapp',
    name: 'wallpapp.',
    no: 'No. 04',
    kind: 'Personal work',
    role: 'Desktop · Rust',
    year: '2026',
    illo: 'wallpapp',
    theme: 'blue',
    stamp: null,
    blurb: 'A featherweight live-wallpaper engine for Windows, built with Rust and Tauri.',
    serifline: 'Your desktop, quietly alive — for about forty megabytes of memory.',
    summary:
      'A lightweight live-wallpaper engine for Windows — an animated image and a clock living behind your desktop icons. No Steam, no bloat: ~10 MB bundle, ~40 MB RAM. Comes with a control panel and a "Lab" to build your own wallpapers.',
    highlights: [
      'Tauri 2 (Rust core + OS WebView) with a vanilla JS/HTML/CSS renderer',
      'Windows WorkerW + SetParent trick to render behind desktop icons — no fake fullscreen window',
      'System tray, multi-monitor, launch-at-startup; plus a Cloudflare Workers + D1 community backend',
    ],
    stack: ['Rust', 'Tauri 2', 'Windows internals', 'Cloudflare D1'],
    note: 'v0.1.0 prototype.',
    links: [],
  },
  {
    id: 'dairymind',
    name: 'dairymind.',
    no: 'No. 05',
    kind: 'Personal work',
    role: 'AgTech · Digital twin',
    year: '2026',
    illo: 'dairymind',
    theme: 'mustard',
    stamp: null,
    blurb: 'A digital-twin intake platform for dairy farms that draws the farm as you answer.',
    serifline: 'Two hundred questions in — and the farm draws itself.',
    summary:
      'A digital-twin intake platform for small and mid-size Turkish dairy farms. A 261-question survey builds a live, animated picture of the farm as the farmer answers, then exports clean JSON to feed a downstream digital-twin product. Built for real field use.',
    highlights: [
      'Node 22 + Express with native node:sqlite (WAL); Alpine.js frontend + a Vue 3 farm-scene web component',
      'KVKK (Turkish GDPR) consent gating, per-submission access tokens, timing-safe compare, rate limiting',
      'CSV formula-injection neutralization, CSP/HSTS headers, verified round-trip data integrity',
    ],
    stack: ['Node.js', 'SQLite', 'Vue 3', 'Alpine.js'],
    note: 'Field prototype.',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/FurkanKocatas/DairyMind' }],
  },
  {
    id: 'luminaft',
    name: 'luminaft.',
    no: 'No. 06',
    kind: 'Client work',
    role: 'WebGL · Brand site',
    year: '2025',
    illo: 'luminaft',
    theme: 'red',
    stamp: null,
    blurb: 'A deep-space themed site for an engineering collective — custom shaders and particles.',
    serifline: 'Engineered to illuminate — one shader at a time.',
    summary:
      'A deep-space, art-directed marketing site for an engineering collective. Custom GLSL shaders, particle fields, shooting stars and a postprocessing bloom pipeline, all in React Three Fiber — proof that the visual side is as much fun as the systems side.',
    highlights: [
      'React 18 + Vite with @react-three/fiber, drei and postprocessing',
      'Hand-written GLSL shaders, particle geometry and an environment-sync bloom pipeline',
      'Framer Motion transitions; ships a built, deployable bundle',
    ],
    stack: ['React', 'R3F', 'GLSL', 'Framer Motion'],
    note: 'Shipped.',
    links: [],
  },
]

// Small line items in the "et cetera" list that don't get a full detail spread.
export const etcetera = [
  { label: 'medical-triage', tag: 'Python · ML', href: 'https://github.com/FurkanKocatas/medical-triage' },
  { label: 'Law-firm & client sites', tag: 'TypeScript', href: 'https://github.com/FurkanKocatas?tab=repositories' },
  { label: 'BandwidthLimiter · ESP32 pump', tag: 'C++ · Embedded', href: 'https://github.com/FurkanKocatas?tab=repositories' },
]
