import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { meta, projects, about } from './data.js'
import Illustration from './Illustration.jsx'
import OwlHero from './OwlHero.jsx'

const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const swatch = { wallpapp: 'var(--color-blue)', dairymind: 'var(--color-mustard)', luminaft: 'var(--color-red)' }

// entrance variants — cards fade only (opacity is safe alongside layoutId morph)
const gridStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }
const fadeItem = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } } }
const riseItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

function Card({ p, className, children }) {
  return (
    <motion.button
      layoutId={`mod-${p.id}`}
      variants={fadeItem}
      onClick={() => window.__openProject(p.id)}
      className={`mod ${className}`}
      whileHover={{ x: -2, y: -2, boxShadow: '5px 5px 0 var(--color-ink)' }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
    >
      {children}
    </motion.button>
  )
}

function Detail({ p, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const plateClass = { paper: 't-paper', sage: 't-sage', teal: 't-teal', green: 't-green', 'green-deep': '', blue: 't-blue', mustard: 't-mustard', red: 't-red' }[p.theme] || ''

  return (
    <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.article
        layoutId={`mod-${p.id}`}
        className="detail"
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <button className="close" onClick={onClose} aria-label="Close">✕</button>

        <div className={`plate ${plateClass}`}>
          <div className="plate-art"><Illustration id={p.id} /></div>
          <div className="plate-scrim" />
          <div className="platemark">
            {p.name.replace('.', '')}
          </div>
          <span className="plate-fig">fig. {p.no.replace('No. ', '')}</span>
        </div>

        <motion.div className="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.14, duration: 0.35 }}>
          <div className="folio">
            <span>{p.no} — {p.kind}</span>
            <span>{p.year}</span>
          </div>
          <p className="serifline">{p.serifline}</p>
          <p className="summary">{p.summary}</p>

          <h4>What's under the hood</h4>
          <motion.ul className="hi" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}>
            {p.highlights.map((h) => (
              <motion.li key={h} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}>{h}</motion.li>
            ))}
          </motion.ul>

          <h4>Stack</h4>
          <div className="stackrow">
            {p.stack.map((s) => (<span className="chip" key={s}>{s}</span>))}
          </div>

          {p.links.length > 0 && (
            <div className="dlinks">
              {p.links.map((l) => (<a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>))}
            </div>
          )}

          <p className="note">{p.note}</p>
        </motion.div>
      </motion.article>
    </motion.div>
  )
}

// Day/night control — an engraved sun and moon at the ends of an arch, with an orb that
// slides along the arch (CSS offset-path). Sun side = day, moon side = night.
function DayNightArch({ onToggle, onSet }) {
  const SX = 25, SY = 43
  const MX = 197, MY = 43, MR = 13 // engraved moon centre + radius
  // faceless engraved sunburst — alternating long/short tapered rays + a hatched disc
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2, r1 = 7.6, r2 = i % 2 === 0 ? 12.4 : 10
    return <line key={`r${i}`} x1={SX + Math.cos(a) * r1} y1={SY + Math.sin(a) * r1}
      x2={SX + Math.cos(a) * r2} y2={SY + Math.sin(a) * r2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  })
  const hatch = Array.from({ length: 12 }, (_, i) => {
    const a = ((i + 0.5) / 12) * Math.PI * 2
    return <line key={`h${i}`} x1={SX + Math.cos(a) * 1.7} y1={SY + Math.sin(a) * 1.7}
      x2={SX + Math.cos(a) * 4.7} y2={SY + Math.sin(a) * 4.7} stroke="currentColor" strokeWidth="0.55" opacity="0.6" />
  })
  // engraved full moon: disc + craters + limb hatching for volume (drawn, no image)
  const craters = [[-4, -5, 2.6], [3.5, 2, 3.3], [-3, 4.5, 1.6], [5, -4, 1.4], [1, 0, 0.9]]
  const moonLimb = Array.from({ length: 9 }, (_, i) => {
    const a = ((-58 + i * 15) * Math.PI) / 180
    return <line key={`ml${i}`} x1={MX + Math.cos(a) * (MR - 0.7)} y1={MY + Math.sin(a) * (MR - 0.7)}
      x2={MX + Math.cos(a) * (MR - 3.6)} y2={MY + Math.sin(a) * (MR - 3.6)} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
  })
  return (
    <div className="daynight" role="button" tabIndex={0} aria-label="Toggle day and night"
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}>
      <svg className="dn-svg" viewBox="0 0 220 60" aria-hidden="true">
        {/* the sky arch (also the orb's track) */}
        <path d="M 40 46 A 70 34 0 0 1 180 46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 4" opacity="0.5" />
        {/* sun (day) — faceless sunburst */}
        <g className="dn-sun" onClick={(e) => { e.stopPropagation(); onSet(false) }}>
          {rays}
          <circle cx={SX} cy={SY} r="6.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {hatch}
        </g>
        {/* moon (night) — faceless engraved full moon, drawn to match the sun */}
        <g className="dn-moon" onClick={(e) => { e.stopPropagation(); onSet(true) }}>
          <circle cx={MX} cy={MY} r={MR} fill="none" stroke="currentColor" strokeWidth="1.2" />
          {moonLimb}
          {craters.map(([dx, dy, r], i) => (
            <circle key={`c${i}`} cx={MX + dx} cy={MY + dy} r={r} fill="none" stroke="currentColor" strokeWidth="0.65" opacity="0.85" />
          ))}
        </g>
      </svg>
      <span className="dn-orb" aria-hidden="true" />
    </div>
  )
}

// Page 2 — the "about" spread revealed by folding the cover down.
function AboutPage({ onBack }) {
  return (
    <div className="sheet">
      <div className="paper about">
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
        <img className="about-engraving" src={`${import.meta.env.BASE_URL}plates/quill.webp`} alt="" aria-hidden="true" />

        <div className="masthead">
          <span className="brand">{meta.name}<span className="dot">.</span></span>
          <nav>
            <button className="pageflip" onClick={onBack}>⌃ Cover</button>
          </nav>
        </div>

        <div className="about-body">
          <div className="about-main">
            <div className="kick">{about.kicker}</div>
            <h1 className="about-h">{about.heading}</h1>
            <p className="about-lead">{about.lead}</p>
            {about.body.map((t) => <p className="about-p" key={t}>{t}</p>)}
          </div>
          <aside className="about-side">
            <div className="folio"><span>Page 02</span><span>Find me</span></div>
            <ul className="about-links">
              <li><a href={meta.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></li>
              <li><a href={meta.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a></li>
              <li><a href={`mailto:${meta.email}`}>Email <span>↗</span></a></li>
            </ul>
            <p className="about-note">{about.note}</p>
          </aside>
        </div>

        <div className="footstrip">
          <span className="cta">Have something worth building? <a href={`mailto:${meta.email}`}>Write to me.</a></span>
          <span className="social">
            <button className="pageflip" onClick={onBack}>Back to the cover ⌃</button>
            <span className="barcode">{Array.from({ length: 16 }).map((_, i) => <i key={i} />)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    window.__openProject = (id) => setActive(id)
  }, [])

  // night mode — a full colour inversion: white drawings on black paper
  const [night, setNight] = useState(() => {
    try { return localStorage.getItem('night') === '1' } catch { return false }
  })
  useEffect(() => {
    document.body.classList.toggle('night', night)
    try { localStorage.setItem('night', night ? '1' : '0') } catch { /* ignore */ }
  }, [night])
  const toggleNight = () => setNight((n) => !n)

  // ── page fold: the cover turns around its spine to reveal the about page ──
  // fold 0 = cover, 1 = folded away (about shown). Scrubbed by wheel, or driven by the buttons.
  const bookRef = useRef(null)
  const fold = useMotionValue(0)
  // The cover zooms out + fades away while the about page slides up from the bottom (over it),
  // casting a drop shadow from its leading (top) edge as it rises.
  const coverScale = useTransform(fold, [0, 1], [1, 0.58]) // dramatic zoom-out
  const coverOpacity = useTransform(fold, [0, 0.85], [1, 0])
  const aboutY = useTransform(fold, [0, 1], ['100%', '0%'])
  const aboutShadow = useTransform(
    fold, [0, 0.08],
    ['0px -14px 40px -14px rgba(12,9,6,0)', '0px -14px 40px -14px rgba(12,9,6,0.42)']
  )
  const [folded, setFolded] = useState(false)
  const animRef = useRef(null)
  const wheelLock = useRef(false)

  useEffect(() => fold.on('change', (v) => setFolded(v > 0.5)), [fold])

  // one decisive scroll (or a button) turns the whole page; momentum wheel events
  // during the animation are locked out so it never over-shoots or double-turns.
  const foldTo = (v) => {
    wheelLock.current = true
    animRef.current?.stop()
    animRef.current = animate(fold, v, {
      type: 'spring', stiffness: 100, damping: 20,
      onComplete: () => { wheelLock.current = false },
    })
    setTimeout(() => { wheelLock.current = false }, 750) // safety unlock
  }

  useEffect(() => {
    const el = bookRef.current
    if (!el) return
    const onWheel = (e) => {
      if (window.innerWidth <= 920 || active) return // mobile scrolls; don't fold behind a detail
      e.preventDefault()
      if (wheelLock.current) return
      const dir = e.deltaY > 6 ? 1 : e.deltaY < -6 ? -1 : 0
      if (!dir) return
      const cur = fold.get()
      if (dir > 0 && cur < 0.5) foldTo(1)      // scroll down on the cover → about
      else if (dir < 0 && cur > 0.5) foldTo(0) // scroll up on the about page → cover
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [fold, active])

  return (
    <div className="grain">
      <DayNightArch onToggle={toggleNight} onSet={setNight} />
      <div ref={bookRef} className={`book ${folded ? 'folded' : ''}`}>

        {/* PAGE 2 — slides up from the bottom, OVER the cover, with a top-edge drop shadow */}
        <motion.div className="leaf leaf-back" aria-hidden={!folded} style={{ y: aboutY, boxShadow: aboutShadow }}>
          <AboutPage onBack={() => foldTo(0)} />
        </motion.div>

        {/* PAGE 1 — the cover zooms out + fades away */}
        <motion.div
          className="leaf leaf-front"
          style={{ scale: coverScale, opacity: coverOpacity, pointerEvents: folded ? 'none' : 'auto' }}
        >
        <div className="sheet">
        <div className="paper">
          {/* print registration / crop marks */}
          <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />

          {/* masthead */}
          <motion.div className="masthead" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <span className="brand">{meta.name}<span className="dot">.</span></span>
            <nav>
              <a href={`mailto:${meta.email}`}>Email</a>
              <a href={meta.github} target="_blank" rel="noreferrer">GitHub</a>
              <button className="pageflip" onClick={() => foldTo(1)}>About ⌄</button>
            </nav>
          </motion.div>

          {/* grid */}
          <motion.div className="grid" variants={gridStagger} initial="hidden" animate="show">
            {/* hero */}
            <motion.div className="mod hero" variants={riseItem}>
              <div>
                <div className="kick">Portfolio · Selected Works</div>
                <h1>An engineer who builds things that <em>think</em> — and things that <em>delight</em>.</h1>
                <p className="lead">From air-gapped municipal AI to quant tools, Rust desktop apps and playful web toys. Everything here shipped, runs, or taught me something worth keeping.</p>
              </div>
              <div className="doodlewrap"><OwlHero /></div>
              <div className="quip">// {meta.quip}<span className="cursor" /></div>
            </motion.div>

            {/* huna */}
            <Card p={byId.huna} className="card-huna">
              <div className="bg"><Illustration id="huna" /></div>
              <div className="front">
                <div className="no">{byId.huna.no} — {byId.huna.kind}</div>
                <div className="cardname">{byId.huna.name.replace('.', '')}</div>
                <div className="role">{byId.huna.role}</div>
              </div>
              <div className="front">
                <div className="blurb">{byId.huna.blurb}</div>
                <div className="tags">{byId.huna.stack.slice(0, 4).join(' · ')}</div>
              </div>
            </Card>

            {/* simtrader */}
            <Card p={byId.simtrader} className="card-simtrader">
              <span className="stamp">{byId.simtrader.stamp}</span>
              <div className="bg" style={{ opacity: 0.85 }}><Illustration id="simtrader" /></div>
              <div className="front">
                <div className="no">{byId.simtrader.no} — {byId.simtrader.kind}</div>
                <div className="cardname">simtrader</div>
                <div className="role">{byId.simtrader.role}</div>
              </div>
              <div className="front">
                <div className="blurb">{byId.simtrader.blurb}</div>
                <div className="tags">{byId.simtrader.stack.slice(0, 3).join(' · ')}</div>
              </div>
            </Card>

            {/* soundscapes */}
            <Card p={byId.soundscapes} className="card-soundscapes">
              <div className="bg"><Illustration id="soundscapes" /></div>
              <div className="front">
                <div className="no">{byId.soundscapes.no}</div>
                <div className="cardname">{byId.soundscapes.name.replace('.', '')}</div>
              </div>
              <div className="front">
                <div className="blurb">{byId.soundscapes.blurb}</div>
                <div className="tags">{byId.soundscapes.stack.slice(0, 2).join(' · ')}</div>
              </div>
            </Card>

            {/* more / index */}
            <motion.div className="mod card-more" variants={fadeItem}>
              <div>
                <div className="no">Also in this issue</div>
                <div className="cardname" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>et cetera</div>
              </div>
              <ul>
                {['wallpapp', 'dairymind', 'luminaft'].map((id) => (
                  <li key={id}>
                    <span className="sw" style={{ background: swatch[id] }} />
                    <button className="etc-link" onClick={() => setActive(id)}>{byId[id].name.replace('.', '')}</button>
                    <span className="gh">{byId[id].stack.slice(0, 2).join(' · ')}</span>
                  </li>
                ))}
                <li>
                  <span className="sw" style={{ background: '#8a8a8a' }} />
                  <a href={meta.github} target="_blank" rel="noreferrer" className="etc-link">+ more on GitHub</a>
                  <span className="gh">↗</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* footer */}
          <motion.div className="footstrip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}>
            <span className="cta">Have something worth building? <a href={`mailto:${meta.email}`}>Write to me.</a></span>
            <span className="social">
              <a href={meta.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={meta.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <span className="barcode">{Array.from({ length: 16 }).map((_, i) => <i key={i} />)}</span>
            </span>
          </motion.div>
        </div>
        </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && <Detail p={byId[active]} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}
