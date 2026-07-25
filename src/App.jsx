import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { meta, projects, about, contact } from './data.js'
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

// Contents strip — the three leaves of the issue, on every masthead.
const PAGES = ['Cover', 'About', 'Contact']
function PageNav({ current, onGo }) {
  return (
    <nav className="pagenav">
      {PAGES.map((label, i) => (
        <button
          key={label}
          className={`pagenav-item ${i === current ? 'is-current' : ''}`}
          onClick={() => onGo(i)}
          aria-current={i === current ? 'page' : undefined}
        >
          <span className="pagenav-no">{String(i + 1).padStart(2, '0')}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}

// The letter is sealed once it is sent: a wax stamp drops onto the page, settles,
// and the confirmation reads out beside it.
function WaxSeal() {
  const ridges = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2
    return (
      <line
        key={i}
        x1={30 + Math.cos(a) * 20} y1={30 + Math.sin(a) * 20}
        x2={30 + Math.cos(a) * 26} y2={30 + Math.sin(a) * 26}
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.85"
      />
    )
  })
  return (
    <span className="sealwrap">
      <motion.span
        className="seal"
        initial={{ scale: 2.4, opacity: 0, rotate: -18 }}
        animate={{ scale: [2.4, 0.94, 1], opacity: [0, 1, 1], rotate: [-18, 4, 0] }}
        transition={{ duration: 0.55, times: [0, 0.62, 1], ease: ['easeIn', 'easeOut'] }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 60">
          {ridges}
          <circle cx="30" cy="30" r="21" fill="currentColor" />
          <circle cx="30" cy="30" r="16.5" fill="none" stroke="#f4efe3" strokeWidth="1" opacity="0.45" />
          <text
            x="30" y="30" textAnchor="middle" dominantBaseline="central"
            fontFamily="'Fraunces', serif" fontWeight="700" fontSize="19" fill="#f4efe3"
          >FK</text>
        </svg>
      </motion.span>
      <motion.span
        className="cf-note ok"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.3 }}
      >
        Sealed and sent — I'll be in touch.
      </motion.span>
    </span>
  )
}

// The foot of page 2 — where people can actually write.
function ContactSection({ onGo }) {
  const [state, setState] = useState('idle') // idle | sending | sent | error
  // the engraved hand behind the form writes while you do
  const [writing, setWriting] = useState(false)
  const stopRef = useRef(null)
  const onKeystroke = () => {
    setWriting(true)
    clearTimeout(stopRef.current)
    stopRef.current = setTimeout(() => setWriting(false), 700)
  }
  useEffect(() => () => clearTimeout(stopRef.current), [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    // Without a form endpoint a static page cannot deliver mail itself, so hand
    // the composed message to the visitor's mail client instead of failing.
    if (!contact.accessKey) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`
      window.location.href =
        `mailto:${meta.email}?subject=${encodeURIComponent(data.subject || 'Hello from your site')}&body=${encodeURIComponent(body)}`
      return
    }

    setState('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: contact.accessKey, ...data }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('sent')
      form.reset()
    } catch {
      setState('error')
    }
  }

  return (
    <div className="sheet" id="contact">
      <div className="paper contact-paper">
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
        <img
          className={`about-engraving ${writing ? 'is-writing' : ''}`}
          src={`${import.meta.env.BASE_URL}plates/quill.webp`}
          alt=""
          aria-hidden="true"
        />

        <div className="masthead">
          <span className="brand">{meta.name}<span className="dot">.</span></span>
          <PageNav current={2} onGo={onGo} />
        </div>

        <div className="contact-body">
          <div className="contact-main">
            <h1 className="about-h">{contact.heading}</h1>
            <p className="about-lead">{contact.lead}</p>

            <form className="contact-form" onSubmit={onSubmit}>
              <div className="cf-row">
                <label className="cf-field">
                  <span>Name</span>
                  <input name="name" type="text" required autoComplete="name" onChange={onKeystroke} />
                </label>
                <label className="cf-field">
                  <span>Email</span>
                  <input name="email" type="email" required autoComplete="email" onChange={onKeystroke} />
                </label>
              </div>
              <label className="cf-field">
                <span>Subject</span>
                <input name="subject" type="text" onChange={onKeystroke} />
              </label>
              <label className="cf-field">
                <span>Message</span>
                <textarea name="message" rows="4" required onChange={onKeystroke} />
              </label>
              <div className="cf-actions">
                <button type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending…' : 'Send'}
                </button>
                {state === 'sent' && <WaxSeal />}
                {state === 'error' && (
                  <span className="cf-note bad">That didn't go through. Write to {meta.email} instead.</span>
                )}
              </div>
            </form>
          </div>

          <aside className="contact-side">
            <div className="folio"><span>Page 03</span><span>Details</span></div>
            <dl className="contact-details">
              {contact.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.href ? <a href={d.href} target="_blank" rel="noreferrer">{d.value}</a> : d.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <a className="studio" href={contact.studio.href} target="_blank" rel="noreferrer">
          <span className="studio-mark">{contact.studio.name}</span>
          <span className="studio-tag">{contact.studio.tagline}</span>
          <span className="studio-body">{contact.studio.body}</span>
          <span className="studio-go">Visit ↗</span>
        </a>

        <div className="footstrip">
          <span />
          <span className="social">
            <span className="barcode">{Array.from({ length: 16 }).map((_, i) => <i key={i} />)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Page 2 — the "about" spread revealed by folding the cover down.
function AboutPage({ onGo, onContact }) {
  return (
    <div className="sheet">
      <div className="paper about">
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />

        <div className="masthead">
          <span className="brand">{meta.name}<span className="dot">.</span></span>
          <PageNav current={1} onGo={onGo} />
        </div>

        <div className="about-body">
          <div className="about-main">
            <h1 className="about-h">{about.heading}</h1>
            <p className="about-lead">{about.lead}</p>
            {about.body.map((t) => <p className="about-p" key={t}>{t}</p>)}
          </div>
          <aside className="about-side">
            <figure className="about-portrait">
              <img src={`${import.meta.env.BASE_URL}img/portrait.webp`} alt="Engraved portrait of Furkan Kocataş" />
              <figcaption>fig. — the author</figcaption>
            </figure>
            <div className="folio"><span>Page 02</span><span>Specimen</span></div>
            <dl className="about-specimen">
              {about.specimen.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="footstrip">
          <span />
          <span className="social">
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

  // Night mode — a full colour inversion: white drawings on black paper.
  // Parked for now: the machinery and all `body.night` styles stay, but the site
  // ships light-only. Flip NIGHT_MODE_ENABLED to bring the arch toggle back.
  const NIGHT_MODE_ENABLED = false
  const [night, setNight] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('night', NIGHT_MODE_ENABLED && night)
  }, [NIGHT_MODE_ENABLED, night])
  const toggleNight = () => setNight((n) => !n)

  // ── the issue turns page by page ──
  // page 0 = cover, 1 = about, 2 = correspondence. Every turn is the same gesture:
  // the leaf you are leaving zooms out and fades, the next slides up over it.
  const bookRef = useRef(null)
  const page = useMotionValue(0)
  const [stage, setStage] = useState(0)
  const animRef = useRef(null)
  const wheelLock = useRef(false)

  const RISE = ['100%', '0%']
  const SHADOW = ['0px -14px 40px -14px rgba(12,9,6,0)', '0px -14px 40px -14px rgba(12,9,6,0.42)']

  // leaf 0 — the cover: only ever leaves
  const coverScale = useTransform(page, [0, 1], [1, 0.58])
  const coverOpacity = useTransform(page, [0, 0.85], [1, 0])
  // leaf 1 — about: rises over the cover, then leaves the same way the cover did
  const aboutY = useTransform(page, [0, 1], RISE)
  const aboutShadow = useTransform(page, [0, 0.08], SHADOW)
  const aboutScale = useTransform(page, [1, 2], [1, 0.58])
  const aboutOpacity = useTransform(page, [1, 1.85], [1, 0])
  // leaf 2 — correspondence: rises over about
  const contactY = useTransform(page, [1, 2], RISE)
  const contactShadow = useTransform(page, [1, 1.08], SHADOW)

  useEffect(() => page.on('change', (v) => setStage(Math.round(v))), [page])

  // one decisive scroll (or a button) turns a whole page; momentum wheel events
  // during the animation are locked out so it never over-shoots or double-turns.
  const goTo = (v) => {
    wheelLock.current = true
    animRef.current?.stop()
    animRef.current = animate(page, v, {
      type: 'spring', stiffness: 100, damping: 20,
      onComplete: () => { wheelLock.current = false },
    })
    setTimeout(() => { wheelLock.current = false }, 750) // safety unlock
  }
  const goToContact = () => goTo(2)

  useEffect(() => {
    const el = bookRef.current
    if (!el) return
    const onWheel = (e) => {
      if (window.innerWidth <= 920 || active) return // mobile scrolls; don't turn behind a detail
      e.preventDefault()
      if (wheelLock.current) return
      const dir = e.deltaY > 6 ? 1 : e.deltaY < -6 ? -1 : 0
      if (!dir) return
      const cur = Math.round(page.get())
      const next = Math.min(2, Math.max(0, cur + dir))
      if (next !== cur) goTo(next)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [page, active])

  return (
    <div className="grain">
      {NIGHT_MODE_ENABLED && <DayNightArch onToggle={toggleNight} onSet={setNight} />}
      <div ref={bookRef} className="book">

        {/* PAGE 3 — correspondence, rises over the about page */}
        <motion.div
          className="leaf leaf-3"
          aria-hidden={stage !== 2}
          style={{ y: contactY, boxShadow: contactShadow, pointerEvents: stage === 2 ? 'auto' : 'none' }}
        >
          <ContactSection onGo={goTo} />
        </motion.div>

        {/* PAGE 2 — about, rises over the cover, then leaves the same way */}
        <motion.div
          className="leaf leaf-back"
          aria-hidden={stage !== 1}
          style={{ y: aboutY, scale: aboutScale, opacity: aboutOpacity, boxShadow: aboutShadow, pointerEvents: stage === 1 ? 'auto' : 'none' }}
        >
          <AboutPage onGo={goTo} onContact={goToContact} />
        </motion.div>

        {/* PAGE 1 — the cover zooms out + fades away */}
        <motion.div
          className="leaf leaf-front"
          style={{ scale: coverScale, opacity: coverOpacity, pointerEvents: stage === 0 ? 'auto' : 'none' }}
        >
        <div className="sheet">
        <div className="paper">
          {/* print registration / crop marks */}
          <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />

          {/* masthead */}
          <motion.div className="masthead" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <span className="brand">{meta.name}<span className="dot">.</span></span>
            <PageNav current={0} onGo={goTo} />
          </motion.div>

          {/* grid */}
          <motion.div className="grid" variants={gridStagger} initial="hidden" animate="show">
            {/* hero */}
            <motion.div className="mod hero" variants={riseItem}>
              <div>
                <h1>Everything here began as a <em>question</em>. Some of them <em>answered back</em>.</h1>
                <p className="lead">Firmware on a microcontroller, a Rust app that redraws your desktop, market research that argues with itself, a globe you can listen to. Everything here shipped, runs, or taught me something worth keeping.</p>
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
            <span />
            <span className="social">
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
