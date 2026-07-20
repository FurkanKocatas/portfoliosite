import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { meta, projects, etcetera } from './data.js'
import Illustration from './Illustration.jsx'

const OwlCanvas = lazy(() => import('./OwlCanvas.jsx'))

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
            {p.name.replace('.', '')}<span className="dot">.</span>
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

export default function App() {
  const [active, setActive] = useState(null)
  useEffect(() => {
    window.__openProject = (id) => setActive(id)
  }, [])

  return (
    <div className="grain">
      <div className="sheet">
        <div className="paper">
          {/* print registration / crop marks */}
          <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />

          {/* masthead */}
          <motion.div className="masthead" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <span className="brand">{meta.name}<span className="dot">.</span></span>
            <span className="mid">{meta.role} · {meta.location} · {meta.issue}</span>
            <nav>
              <a href={`mailto:${meta.email}`}>Email</a>
              <a href={meta.github} target="_blank" rel="noreferrer">GitHub</a>
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
              <div className="doodlewrap"><Suspense fallback={null}><OwlCanvas /></Suspense></div>
              <div className="quip">// {meta.quip}<span className="cursor" /></div>
            </motion.div>

            {/* huna */}
            <Card p={byId.huna} className="card-huna">
              <div className="bg"><Illustration id="huna" /></div>
              <div className="front">
                <div className="no">{byId.huna.no} — {byId.huna.kind}</div>
                <div className="cardname">{byId.huna.name}</div>
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
                <div className="cardname">simtrader<span className="dot">.</span></div>
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
                <div className="cardname">{byId.soundscapes.name}</div>
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
                <div className="cardname" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>et cetera.</div>
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
              <a href="https://poly.pizza/m/fNkq9CwSG6d" target="_blank" rel="noreferrer" className="credit">Owl · Poly by Google (CC BY)</a>
              <a href={meta.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={meta.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <span className="barcode">{Array.from({ length: 16 }).map((_, i) => <i key={i} />)}</span>
            </span>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {active && <Detail p={byId[active]} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  )
}
