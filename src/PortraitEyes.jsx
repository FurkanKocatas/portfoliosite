import { useEffect, useRef } from 'react'

// The author's portrait, with live eyes — the same trick the cover owl plays, so the
// two pages rhyme. The plate ships with both irises hollowed to bare paper (see
// tools/, r9.5 at the measured centroids); this component redraws each iris in ink
// and rolls it toward the cursor, clipped to the socket so it never spills onto the
// engraving. Honours prefers-reduced-motion.
const NAT = { w: 640, h: 634 }          // the plate's natural size
const SOCKET = 9.5                       // radius of the hollowed disc, in plate units
const IRIS = 7.4
const TRAVEL = 2.6                       // how far the iris rolls inside the socket
const EYES = [
  { cx: 225.0, cy: 276.8 },
  { cx: 333.9, cy: 264.9 },
]
const INK = '#1d1b16'
const PAPER = '#f4efe3'

export default function PortraitEyes({ src, alt }) {
  const wrapRef = useRef(null)
  const irisRefs = [useRef(null), useRef(null)]

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const mouse = { x: 0, y: 0, has: false }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf
    const loop = () => {
      const el = wrapRef.current
      if (el && mouse.has) {
        const r = el.getBoundingClientRect()
        const sx = r.width / NAT.w, sy = r.height / NAT.h
        EYES.forEach((eye, i) => {
          const ex = r.left + eye.cx * sx
          const ey = r.top + eye.cy * sy
          let dx = mouse.x - ex, dy = mouse.y - ey
          const d = Math.hypot(dx, dy) || 1
          const m = Math.min(1, d / 220)          // ease off when the cursor is close
          dx = (dx / d) * TRAVEL * m
          dy = (dy / d) * TRAVEL * m
          irisRefs[i].current?.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
        })
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
        {EYES.map((e, i) => (
          <clipPath key={i} id={`socket-${i}`}>
            <circle cx={e.cx} cy={e.cy} r={SOCKET} />
          </clipPath>
        ))}
      </defs>

      <image href={src} x="0" y="0" width={NAT.w} height={NAT.h} />

      {EYES.map((e, i) => (
        <g key={i} clipPath={`url(#socket-${i})`}>
          <g ref={irisRefs[i]}>
            <circle cx={e.cx} cy={e.cy} r={IRIS} fill={INK} />
            <circle cx={e.cx - IRIS * 0.34} cy={e.cy - IRIS * 0.38} r={IRIS * 0.27} fill={PAPER} opacity="0.92" />
            <circle cx={e.cx + IRIS * 0.3} cy={e.cy + IRIS * 0.32} r={IRIS * 0.12} fill={PAPER} opacity="0.5" />
          </g>
        </g>
      ))}
    </svg>
  )
}
