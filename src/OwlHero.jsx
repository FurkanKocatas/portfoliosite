import { useEffect, useRef } from 'react'

// Cover mascot (chosen): vintage engraved owl #1 as a technical plate with LIVE EYES.
// The image ships with its eyes fully hollowed (owl1_body.py, r41); this component redraws
// each eye in the engraving's own idiom — a hatched radial-spoke iris, an ink rim, and a
// textured pupil. The whole iris+pupil moves as one "eyeball" so the spokes travel with the
// pupil (clipped to the fixed rim), it tracks the cursor, and it blinks a feathered lid
// every ~5s. Respects prefers-reduced-motion.

const MONO = "'Courier Prime', monospace"
const LINE = '#33475a'
const ACCENT = '#c9503a'
const INK = '#211d17'
const IRIS = '#efe7d6'
const LID = '#d8ccb4'

// owl-1 natural 469x620, placed in this 440x240 viewBox
const IMG = { x: 150, y: 21, w: 150, h: 198, nw: 469, nh: 620 }
const SC = IMG.w / IMG.nw
const map = (px, py) => [IMG.x + (px / IMG.nw) * IMG.w, IMG.y + (py / IMG.nh) * IMG.h]

const EYES = [map(96, 139), map(209, 139)] // eye centres in viewBox units
const R = 41 * SC              // eye (socket) radius
const RPUP = R * 0.40          // pupil radius
const TRAVEL = R * 0.26        // how far the eyeball rolls inside the socket
const HW = R + 1.2             // lid half-width
const LID_OPEN = (cy) => cy - R - 3
const LID_SHUT = (cy) => cy + R

// the moving eyeball — radial-spoke iris + concentric rings + pupil, all centred on (cx,cy)
// so they roll together. Sits on the fixed cream backing (drawn separately) and is clipped
// to the socket circle, so a thin backing crescent shows on the trailing side as it looks aside.
function eyeball(cx, cy) {
  const spokes = []
  const N = 66
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    // start just under the pupil edge, overfill past the socket (clipped by the rim) so no
    // cream backing crescent shows as the eyeball rolls. Kept light + thin so the iris still
    // reads as a pale engraved iris, not a solid dark disc.
    const r0 = RPUP * 0.94
    const r1 = R * (1.3 + 0.12 * ((i * 7) % 3) / 2)
    spokes.push(
      <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0}
        x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1}
        stroke={INK} strokeWidth="0.3" opacity="0.5" />
    )
  }
  return (
    <>
      {spokes}
      <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke={INK} strokeWidth="0.3" opacity="0.25" />
      {/* pupil + catchlights (drawn last, covers the spoke inner tips) */}
      <circle cx={cx} cy={cy} r={RPUP} fill={INK} />
      <circle cx={cx - RPUP * 0.42} cy={cy - RPUP * 0.5} r={RPUP * 0.3} fill={IRIS} opacity="0.95" />
      <circle cx={cx + RPUP * 0.3} cy={cy + RPUP * 0.35} r={RPUP * 0.13} fill={IRIS} opacity="0.6" />
    </>
  )
}

const LID_PATH = `M ${-HW} ${-2 * R} H ${HW} V 0 Q 0 5 ${-HW} 0 Z`
const LASH_PATH = `M ${-HW} 0 Q 0 5 ${HW} 0`

export default function OwlHero() {
  const url = `${import.meta.env.BASE_URL}owls/owl-1.webp`
  const svgRef = useRef(null)
  const eyeRefs = [useRef(null), useRef(null)]
  const lidRefs = [useRef(null), useRef(null)]

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const mouse = { x: 0, y: 0, has: false }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf, t0, prev
    let blinkT = -1, nextBlink = 2.6, pending = 0
    const D = 0.6 // blink duration (close+open) — slower
    const loop = (ts) => {
      if (t0 === undefined) { t0 = ts; prev = ts }
      const t = (ts - t0) / 1000
      const dt = Math.min(0.05, (ts - prev) / 1000); prev = ts
      const svg = svgRef.current
      if (svg) {
        const r = svg.getBoundingClientRect()
        const sx = r.width / 440, sy = r.height / 240
        // eyeball roll (iris + pupil move together)
        EYES.forEach(([ex, ey], i) => {
          let dx, dy
          if (mouse.has) {
            const vx = mouse.x - (r.left + ex * sx), vy = mouse.y - (r.top + ey * sy)
            const d = Math.hypot(vx, vy) || 1, m = Math.min(1, d / 150)
            dx = (vx / d) * TRAVEL * m; dy = (vy / d) * TRAVEL * m * 0.85
          } else {
            dx = Math.cos(t * 0.7) * TRAVEL * 0.5; dy = Math.sin(t * 0.9) * TRAVEL * 0.4
          }
          eyeRefs[i].current?.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
        })
        // blink every ~5s (occasional double)
        if (blinkT < 0 && t > nextBlink) {
          blinkT = 0
          if (Math.random() < 0.2) pending = 1
          nextBlink = t + 4.7 + Math.random() * 0.6
        }
        let k = 0
        if (blinkT >= 0) {
          blinkT += dt
          k = Math.sin(Math.min(1, blinkT / D) * Math.PI)
          if (blinkT >= D) { blinkT = -1; if (pending > 0) { pending--; nextBlink = t + 0.22 } }
        }
        EYES.forEach(([cx, cy], i) => {
          const ly = LID_OPEN(cy) + (LID_SHUT(cy) - LID_OPEN(cy)) * k
          lidRefs[i].current?.setAttribute('transform', `translate(${cx} ${ly.toFixed(2)})`)
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  const edgeTicks = Array.from({ length: 18 }, (_, i) => {
    const x = 22 + i * 22
    return <line key={i} x1={x} y1={12} x2={x} y2={i % 3 === 0 ? 22 : 18} stroke={LINE} strokeWidth="0.6" opacity="0.4" />
  })

  return (
    <svg ref={svgRef} viewBox="0 0 440 240" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <defs>
        <pattern id="ohgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke={LINE} strokeWidth="0.5" opacity="0.13" />
        </pattern>
        {EYES.map(([cx, cy], i) => (
          <clipPath key={i} id={`eyeclip-${i}`}><circle cx={cx} cy={cy} r={R} /></clipPath>
        ))}
      </defs>
      <rect x="0" y="0" width="440" height="240" fill="url(#ohgrid)" />
      {edgeTicks}

      {/* corner ticks */}
      <g stroke={LINE} strokeWidth="1" opacity="0.5" fill="none">
        <path d="M12 12 h14 M12 12 v14" /><path d="M428 12 h-14 M428 12 v14" />
        <path d="M12 228 h14 M12 228 v-14" /><path d="M428 228 h-14 M428 228 v-14" />
      </g>

      {/* cut rings behind the owl */}
      <circle cx="205" cy="112" r="112" fill="none" stroke={LINE} strokeWidth="0.8" strokeDasharray="2 6" opacity="0.4" />
      <path d="M 145 24 A 100 100 0 0 1 293 40 M 117 184 A 100 100 0 0 1 265 200"
        transform="translate(-8 0)" fill="none" stroke={LINE} strokeWidth="1" opacity="0.5" />

      {/* the engraved owl (eyes hollowed) */}
      <image href={url} x={IMG.x} y={IMG.y} width={IMG.w} height={IMG.h} preserveAspectRatio="xMidYMid meet" />

      {/* live engraved eyes */}
      {EYES.map(([cx, cy], i) => (
        <g key={i}>
          <g clipPath={`url(#eyeclip-${i})`}>
            {/* fixed cream backing (sclera) */}
            <circle cx={cx} cy={cy} r={R} fill={IRIS} />
            {/* rolling eyeball: iris spokes + pupil move as one */}
            <g ref={eyeRefs[i]}>{eyeball(cx, cy)}</g>
            {/* feathered blink lid */}
            <g ref={lidRefs[i]} transform={`translate(${cx} ${LID_OPEN(cy)})`}>
              <path d={LID_PATH} fill={LID} />
              {Array.from({ length: 9 }, (_, j) => {
                const x = -HW + 2.5 + j * ((2 * HW - 5) / 8)
                return <line key={j} x1={x} y1={-2 * R + 2} x2={x} y2={-1.5} stroke={INK} strokeWidth="0.35" opacity="0.28" />
              })}
              <path d={LASH_PATH} fill="none" stroke={INK} strokeWidth="1.6" />
            </g>
          </g>
          {/* rim on top so the socket outline always reads */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth="1.4" />
        </g>
      ))}

      {/* small cut circle + accent */}
      <g>
        <circle cx="352" cy="176" r="20" fill="none" stroke={LINE} strokeWidth="0.9" strokeDasharray="3 4" opacity="0.6" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <line key={i} x1={352 + Math.cos(a) * 20} y1={176 + Math.sin(a) * 20} x2={352 + Math.cos(a) * 24} y2={176 + Math.sin(a) * 24} stroke={LINE} strokeWidth="0.6" opacity="0.5" />
        })}
        <circle cx="352" cy="176" r="3" fill={ACCENT} />
      </g>

      {/* single caption */}
      <text x="16" y="34" fontFamily={MONO} fontSize="9" letterSpacing="1.5" fill={LINE} opacity="0.75">FIG.00 · STRIX Nº1</text>
    </svg>
  )
}
