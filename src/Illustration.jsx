import { useEffect, useRef } from 'react'

// Technical-plate illustrations — a vintage engraving on a faint grid with corner ticks and a
// single FIG caption. Labelled callouts / crosshairs were removed for a cleaner look
// (2026-07-21). Transparent background — the plate/card supplies the paper tone.

const MONO = "'Courier Prime', monospace"

const PAL = {
  huna: { line: '#3a352d', accent: '#c9503a' },
  simtrader: { line: '#1d1b16', accent: '#c9503a', up: '#2f7d27' },
  soundscapes: { line: '#3a352d', accent: '#c9503a' },
  wallpapp: { line: '#2f4b63', accent: '#c9503a' },
  dairymind: { line: '#6b551f', accent: '#c9503a' },
  luminaft: { line: '#7a3f34', accent: '#c95a3f' },
}

function Frame({ id, line, children }) {
  const gid = `grid-${id}`
  return (
    <svg viewBox="0 0 400 448" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <pattern id={gid} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0 H0 V22" fill="none" stroke={line} strokeWidth="0.5" opacity="0.16" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="400" height="448" fill={`url(#${gid})`} />
      {children}
      <g stroke={line} strokeWidth="1" opacity="0.55" fill="none">
        <path d="M18 18 h18 M18 18 v18" /><path d="M382 18 h-18 M382 18 v18" />
        <path d="M18 430 h18 M18 430 v-18" /><path d="M382 430 h-18 M382 430 v-18" />
      </g>
    </svg>
  )
}

/* ---------- SYNAPSE — engraved "mapped mind" plate ---------- */
// Vintage phrenology head (public domain, Wellcome Collection) — bg removed, single ink —
// as the platform's "mapped mind".
function Huna() {
  const { line } = PAL.huna
  const src = `${import.meta.env.BASE_URL}plates/synapse.webp`
  return (
    <Frame id="huna" line={line}>
      <image href={src} x="72" y="18" width="256" height="408" preserveAspectRatio="xMidYMid meet" />
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.01 · 26 SERVICES</text>
    </Frame>
  )
}

/* ---------- SIMTRADER — engraved caduceus (symbol of commerce) plate ---------- */
// The caduceus — Mercury's staff, the classical symbol of trade/finance — isolated from a
// Mercury engraving (no figure). Chosen over a bull (read like dairymind's cow) and over the
// full Mercury statue (nude). The beloved candlestick version is preserved below as
// SimTraderCandles (unused). To revert: point MAP.simtrader back at SimTraderCandles.
function SimTrader() {
  const { line, accent } = PAL.simtrader
  const src = `${import.meta.env.BASE_URL}plates/simtrader.webp`
  return (
    <Frame id="simtrader" line={line}>
      {/* faint red uptrend behind the caduceus — a nod to the original candlesticks */}
      <path d="M34 392 C 150 350 250 208 388 92" stroke={accent} strokeWidth="1.3" fill="none" strokeDasharray="1 9" strokeLinecap="round" opacity="0.4" />
      <image href={src} x="125" y="28" width="150" height="392" preserveAspectRatio="xMidYMid meet" />
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.02 · PAPER ONLY</text>
    </Frame>
  )
}

// Backup — original candlestick artwork (kept for easy revert; see note above).
function SimTraderCandles() {
  const ink = '#1d1b16'
  return (
    <svg viewBox="0 0 700 460" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
      <g stroke={ink} strokeWidth="2">
        <line x1="70" y1="150" x2="70" y2="380" /><rect x="52" y="210" width="36" height="110" fill={ink} />
        <line x1="160" y1="190" x2="160" y2="360" /><rect x="142" y="210" width="36" height="90" fill="none" />
        <line x1="250" y1="110" x2="250" y2="340" /><rect x="232" y="150" width="36" height="130" fill={ink} />
        <line x1="340" y1="90" x2="340" y2="290" /><rect x="322" y="120" width="36" height="120" fill="#c94f38" />
        <line x1="430" y1="130" x2="430" y2="320" /><rect x="412" y="160" width="36" height="100" fill="none" />
        <line x1="520" y1="80" x2="520" y2="280" /><rect x="502" y="110" width="36" height="100" fill={ink} />
        <line x1="610" y1="120" x2="610" y2="310" /><rect x="592" y="150" width="36" height="90" fill="none" />
      </g>
      <path d="M50 400 C 250 360, 400 200, 640 90" stroke="#c94f38" strokeWidth="4" fill="none" strokeDasharray="1 10" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- SOUNDSCAPES — engraved armillary sphere plate ---------- */
// Vintage armillary sphere (public domain) — bg removed, single ink — "spin the world".
function Soundscapes() {
  const { line, accent } = PAL.soundscapes
  const src = `${import.meta.env.BASE_URL}plates/soundscapes.webp`
  return (
    <Frame id="soundscapes" line={line}>
      <image href={src} x="16" y="86" width="368" height="280" preserveAspectRatio="xMidYMid meet" />
      {/* sound rings on the central earth */}
      <g fill="none" stroke={accent}>
        <circle cx="200" cy="224" r="20" strokeWidth="1.2" strokeDasharray="2 4" />
        <circle cx="200" cy="224" r="34" strokeWidth="1" strokeDasharray="2 5" opacity="0.7" />
      </g>
      <circle cx="200" cy="224" r="4" fill={accent} />
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.03 · 186 COUNTRIES</text>
    </Frame>
  )
}

/* ---------- WALLPAPP — engraved magic-lantern plate ---------- */
// Vintage magic lantern (Kircher, public domain) — projecting a living image, like a
// live wallpaper behind the desktop.
function Wallpapp() {
  const { line } = PAL.wallpapp
  const src = `${import.meta.env.BASE_URL}plates/wallpapp.webp`
  return (
    <Frame id="wallpapp" line={line}>
      <image href={src} x="16" y="122" width="368" height="208" preserveAspectRatio="xMidYMid meet" />
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.04 · ~40 MB</text>
    </Frame>
  )
}

/* ---------- DAIRYMIND — engraved dairy-cow plate ---------- */
// Vintage cow etching (public domain) — the farm the digital twin models.
function DairyMind() {
  const { line } = PAL.dairymind
  const src = `${import.meta.env.BASE_URL}plates/dairymind.webp`
  return (
    <Frame id="dairymind" line={line}>
      <image href={src} x="20" y="104" width="360" height="244" preserveAspectRatio="xMidYMid meet" />
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.05 · 261 PARAMS</text>
    </Frame>
  )
}

/* ---------- LUMINAFT — engraved comet plate ---------- */
// Vintage comet (public domain, tone-inverted so the bright comet becomes ink) —
// deep-space WebGL, "engineered to illuminate".
function Luminaft() {
  const { line } = PAL.luminaft
  const src = `${import.meta.env.BASE_URL}plates/luminaft.webp`
  return (
    <Frame id="luminaft" line={line}>
      <image href={src} x="12" y="150" width="376" height="150" preserveAspectRatio="xMidYMid meet" />
      {/* stars */}
      <g stroke={line} strokeWidth="1" opacity="0.6">
        <path d="M96 108 l 0 12 M90 114 l 12 0" /><path d="M328 328 l 0 10 M323 333 l 10 0" /><path d="M300 120 l 0 8 M296 124 l 8 0" />
      </g>
      <text x="30" y="58" fontFamily={MONO} fontSize="9.5" letterSpacing="2" fill={line} opacity="0.7">FIG.06 · SHADERS</text>
    </Frame>
  )
}

const MAP = { huna: Huna, simtrader: SimTrader, soundscapes: Soundscapes, wallpapp: Wallpapp, dairymind: DairyMind, luminaft: Luminaft }

export default function Illustration({ id }) {
  const C = MAP[id]
  return C ? <C /> : null
}

// Cover mascot — a detailed, mature robot owl. Pupils track the cursor; the eyes
// give a slow, owl-like blink. Feathered facial disc, breast scaling, wing primaries,
// amber eyes — with quiet robot cues (lens apertures, antenna, rivets).
export function Doodle() {
  const ink = '#17150f', lime = '#a7cf3b', dim = '#6f8a34', iris = '#f2b53c', irisDk = '#c98524', cream = '#f4efe1'
  const CY = 206, LENS = 46, VB = 520
  const eyes = [208, 312]
  const svgRef = useRef(null)
  const pupils = [useRef(null), useRef(null)]
  const lids = [useRef(null), useRef(null)]

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const mouse = { x: 0, y: 0, has: false }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true }
    window.addEventListener('pointermove', onMove, { passive: true })
    const top = CY - LENS
    let raf, t0, prev, blinkT = -1, D = 0.6, nextBlink = 1.8, pending = 0
    const loop = (ts) => {
      if (t0 === undefined) { t0 = ts; prev = ts }
      const time = (ts - t0) / 1000, dt = Math.min(0.05, (ts - prev) / 1000); prev = ts
      const svg = svgRef.current
      if (svg) {
        const r = svg.getBoundingClientRect(), sx = r.width / VB, sy = r.height / VB
        eyes.forEach((ex0, i) => {
          const ex = r.left + ex0 * sx, ey = r.top + CY * sy
          let dx = 0, dy = 0
          if (mouse.has) {
            dx = mouse.x - ex; dy = mouse.y - ey
            const d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 180)
            dx = (dx / d) * 11 * m; dy = (dy / d) * 8.5 * m
          }
          pupils[i].current?.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`)
        })
        // slow, owl-like blink at randomised intervals, occasionally a double
        if (blinkT < 0 && time > nextBlink) { blinkT = 0; D = 0.5 + Math.random() * 0.3; if (Math.random() < 0.18) pending = 1; nextBlink = time + 2.6 + Math.random() * 3.4 }
        let k = 0
        if (blinkT >= 0) {
          blinkT += dt
          k = Math.sin(Math.min(1, blinkT / D) * Math.PI)
          if (blinkT >= D) { blinkT = -1; if (pending > 0) { pending--; nextBlink = time + 0.18 } }
        }
        lids.forEach((l) => l.current?.setAttribute('transform', `translate(0 ${top}) scale(1 ${k.toFixed(3)}) translate(0 ${-top})`))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  // breast feather scallops (rows, staggered)
  const scallops = []
  ;[300, 324, 348, 372, 396].forEach((y, r) => {
    const off = r % 2 ? 13 : 0
    for (let x = 182 + off; x <= 338; x += 26) scallops.push(`M${x - 12} ${y} q 12 15 24 0`)
  })

  const Foot = ({ x }) => (
    <g stroke={lime} strokeWidth="2.6" strokeLinecap="round" fill="none">
      <path d={`M${x} 436 C ${x - 16} 452 ${x - 18} 460 ${x - 20} 470`} />
      <path d={`M${x} 436 C ${x - 4} 454 ${x - 4} 462 ${x - 5} 472`} />
      <path d={`M${x} 436 C ${x + 12} 452 ${x + 16} 460 ${x + 18} 470`} />
    </g>
  )

  return (
    <svg ref={svgRef} viewBox="0 0 520 520" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* branch + talons */}
      <line x1="150" y1="462" x2="370" y2="462" stroke={lime} strokeWidth="4" strokeLinecap="round" />
      <g stroke={dim} strokeWidth="1.5" opacity="0.6"><line x1="182" y1="462" x2="177" y2="470" /><line x1="330" y1="462" x2="335" y2="470" /></g>
      <Foot x="222" /><Foot x="298" />

      {/* ear tufts (feathered) */}
      <path d="M190 128 L160 72 L236 118 Z" fill={ink} />
      <path d="M330 128 L360 72 L284 118 Z" fill={ink} />
      <g stroke={dim} strokeWidth="1.6" fill="none" opacity="0.7">
        <path d="M186 118 L170 82" /><path d="M200 120 L192 80" /><path d="M214 118 L214 86" />
        <path d="M334 118 L350 82" /><path d="M320 120 L328 80" /><path d="M306 118 L306 86" />
      </g>

      {/* body */}
      <path d="M130 245 C 114 162 186 116 260 114 C 334 116 406 162 390 245 C 404 322 386 412 320 440 C 292 454 228 454 200 440 C 134 412 116 322 130 245 Z" fill={ink} />

      {/* folded wings + primaries */}
      <g stroke={lime} fill="none">
        <path d="M150 256 C 136 322 150 386 188 424" strokeWidth="2" opacity="0.5" />
        <path d="M370 256 C 384 322 370 386 332 424" strokeWidth="2" opacity="0.5" />
      </g>
      <g stroke={dim} strokeWidth="1.5" fill="none" opacity="0.5">
        <path d="M156 300 L184 322" /><path d="M154 332 L184 356" /><path d="M158 364 L186 388" />
        <path d="M364 300 L336 322" /><path d="M366 332 L336 356" /><path d="M362 364 L334 388" />
      </g>

      {/* breast scallops + belly streaks */}
      <g stroke={dim} strokeWidth="1.5" fill="none" opacity="0.55">{scallops.map((d, i) => <path key={i} d={d} />)}</g>
      <g stroke={dim} strokeWidth="1.4" opacity="0.35">
        <line x1="240" y1="300" x2="240" y2="404" /><line x1="260" y1="296" x2="260" y2="410" /><line x1="280" y1="300" x2="280" y2="404" />
      </g>

      {/* facial disc + brows + cheeks */}
      <path d="M172 158 C 154 232 180 300 235 316 Q 260 324 285 316 C 340 300 366 232 348 158" fill="none" stroke={lime} strokeWidth="1.8" opacity="0.6" />
      <path d="M170 166 Q 208 142 246 164" fill="none" stroke={lime} strokeWidth="2.4" opacity="0.8" />
      <path d="M274 164 Q 312 142 350 166" fill="none" stroke={lime} strokeWidth="2.4" opacity="0.8" />
      <path d="M232 176 Q 260 198 288 176" fill="none" stroke={lime} strokeWidth="1.8" opacity="0.65" />
      <g stroke={dim} strokeWidth="1.3" fill="none" opacity="0.5">
        <path d="M175 214 Q 190 232 196 258" /><path d="M182 250 Q 196 266 200 286" />
        <path d="M345 214 Q 330 232 324 258" /><path d="M338 250 Q 324 266 320 286" />
      </g>
      <circle cx="150" cy="250" r="3" fill={dim} /><circle cx="370" cy="250" r="3" fill={dim} />

      {/* eyes */}
      {eyes.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={CY} r={LENS} fill={cream} />
          <circle cx={cx} cy={CY} r={LENS} fill="none" stroke={lime} strokeWidth="3" />
          <circle cx={cx} cy={CY} r="39" fill="none" stroke={lime} strokeWidth="1" opacity="0.45" />
          {Array.from({ length: 8 }, (_, t) => { const a = (t / 8) * Math.PI * 2; return <line key={t} x1={cx + Math.cos(a) * 42} y1={CY + Math.sin(a) * 42} x2={cx + Math.cos(a) * 46} y2={CY + Math.sin(a) * 46} stroke={lime} strokeWidth="1" opacity="0.5" /> })}
          <circle cx={cx} cy={CY} r="29" fill={iris} />
          {Array.from({ length: 14 }, (_, t) => { const a = (t / 14) * Math.PI * 2; return <line key={t} x1={cx + Math.cos(a) * 15} y1={CY + Math.sin(a) * 15} x2={cx + Math.cos(a) * 28} y2={CY + Math.sin(a) * 28} stroke={irisDk} strokeWidth="1" opacity="0.35" /> })}
          <circle cx={cx} cy={CY} r="29" fill="none" stroke={irisDk} strokeWidth="1.3" opacity="0.7" />
          <g ref={pupils[i]}>
            <circle cx={cx} cy={CY} r="13" fill={ink} />
            <circle cx={cx - 5} cy={CY - 6} r="5" fill={cream} />
            <circle cx={cx + 4} cy={CY + 5} r="2" fill={cream} opacity="0.6" />
          </g>
          {/* eyelid — slow blink */}
          <g ref={lids[i]} transform={`translate(0 ${CY - LENS}) scale(1 0) translate(0 ${-(CY - LENS)})`}>
            <circle cx={cx} cy={CY} r={LENS - 1} fill={ink} />
            <path d={`M${cx - 32} ${CY} q 32 10 64 0`} stroke={lime} strokeWidth="2" fill="none" opacity="0.8" />
          </g>
        </g>
      ))}

      {/* hooked beak */}
      <path d="M248 240 Q 260 232 272 240 L266 258 Q 260 272 254 258 Z" fill={iris} />
      <path d="M248 240 Q 260 246 272 240" stroke={irisDk} strokeWidth="1.2" fill="none" />

      {/* antenna sensor (robot cue) */}
      <line x1="260" y1="114" x2="260" y2="82" stroke={lime} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M244 72 q 16 -11 32 0" fill="none" stroke={lime} strokeWidth="1.8" opacity="0.6" />
      <circle className="float f1" cx="260" cy="78" r="6" fill={iris} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  )
}
