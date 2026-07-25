import { useEffect, useRef } from 'react'

// The author's portrait, with live eyes — the cover owl's trick, played on page 2.
//
// The owl's eyes were hollowed and redrawn, but that fails here: at this size any
// iris I draw reads as a cartoon against a master engraving, however carefully it
// is shaped. So nothing is drawn and nothing is removed. A soft-masked copy of the
// plate's own iris pixels is laid over the original and nudged toward the cursor,
// which keeps the engraving's exact texture and reads as a glance rather than a
// googly eye. Honours prefers-reduced-motion.
const NAT = { w: 640, h: 634 }   // the plate's natural size
const EYES = [
  { cx: 224, cy: 276 },          // measured from the ink centroid, not by eye
  { cx: 332, cy: 265 },
]
const LIFT = 7.5                 // radius of the lifted iris patch, in plate units
const TRAVEL = 2.6               // how far the glance carries

export default function PortraitEyes({ src, alt }) {
  const wrapRef = useRef(null)
  const glanceRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const mouse = { x: 0, y: 0, has: false }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf
    const loop = () => {
      const el = wrapRef.current
      if (el && mouse.has && glanceRef.current) {
        const r = el.getBoundingClientRect()
        // aim from the midpoint between the eyes, so both travel together
        const mid = {
          x: r.left + ((EYES[0].cx + EYES[1].cx) / 2 / NAT.w) * r.width,
          y: r.top + ((EYES[0].cy + EYES[1].cy) / 2 / NAT.h) * r.height,
        }
        let dx = mouse.x - mid.x, dy = mouse.y - mid.y
        const d = Math.hypot(dx, dy) || 1
        const m = Math.min(1, d / 240)          // ease off when the cursor is close
        dx = (dx / d) * TRAVEL * m
        dy = (dy / d) * TRAVEL * m * 0.55       // eyes roll further sideways than up
        glanceRef.current.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <svg
      ref={wrapRef}
      viewBox={`0 0 ${NAT.w} ${NAT.h}`}
      width="100%"
      height="auto"
      role="img"
      aria-label={alt}
      style={{ display: 'block' }}
    >
      <defs>
        {/* feathered so the lifted patch has no cut edge */}
        <radialGradient id="irisFade">
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="irisMask">
          {EYES.map((e, i) => (
            <circle key={i} cx={e.cx} cy={e.cy} r={LIFT} fill="url(#irisFade)" />
          ))}
        </mask>
      </defs>

      <image href={src} x="0" y="0" width={NAT.w} height={NAT.h} />

      {/* the same plate again, but only where the irises are — and it moves */}
      <g ref={glanceRef}>
        <g mask="url(#irisMask)">
          <image href={src} x="0" y="0" width={NAT.w} height={NAT.h} />
        </g>
      </g>
    </svg>
  )
}
