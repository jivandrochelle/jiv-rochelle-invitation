import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollFrame } from '../useScrollFrame.js'
import Ampersand from './Ampersand.jsx'
import progressBow from '../assets/bow-cream.png'
import './WeddingNavigation.css'

const LINKS = [
  ['countdown', 'The countdown'],
  ['timeline', 'The day'],
  ['details', 'The details'],
  ['story', 'Our story'],
  ['entourage', 'Entourage'],
  ['moments', 'Our moments'],
  ['dress', 'Attire'],
  ['gifts', 'Gifts'],
  ['questions', 'Questions'],
  ['rsvp', 'RSVP'],
]

export default function WeddingNavigation({ enabled }) {
  const [current, setCurrent] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const header = useRef(null)
  const menuToggle = useRef(null)
  const thread = useRef(null)
  useEffect(() => {
    if (!enabled || !menuOpen) return
    const onKeyDown = event => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuToggle.current?.focus()
    }
    const onPointerDown = event => {
      if (!header.current?.contains(event.target)) setMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 1200) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled, menuOpen])
  const selectSection = id => {
    setMenuOpen(false)
    const section = document.getElementById(id)
    const heading = section?.querySelector('h1, h2') ?? section
    heading?.setAttribute('tabindex', '-1')
    heading?.focus({ preventScroll: true })
  }
  const measure = useCallback(() => {
    const height = document.documentElement.scrollHeight - window.innerHeight
    const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
    thread.current?.style.setProperty('--reading-progress', progress)
    const readingLine = Math.min(window.innerHeight * 0.3, 200)
    const visible = LINKS.find(([id]) => {
      const bounds = document.getElementById(id)?.getBoundingClientRect()
      return bounds && bounds.top <= readingLine && bounds.bottom > readingLine
    })
    setCurrent(visible?.[0] ?? '')
  }, [])
  useScrollFrame(enabled, measure)

  return <header className="site-header" ref={header}>
    <a className="header-monogram" href="#invitation" aria-label="Back to invitation" onClick={() => selectSection('invitation')}>
      <span className="monogram small" aria-label="Jiv and Rochelle">J<Ampersand />R</span>
    </a>
    <nav className="header-desktop-nav" aria-label="Wedding invitation">
      {LINKS.map(([id, label], index) => <a key={id} href={`#${id}`} className={id === 'rsvp' ? 'rsvp-nav' : index > 2 ? 'secondary-nav' : undefined} aria-current={current === id ? 'location' : undefined}>{label}</a>)}
    </nav>
    <time className="header-date" dateTime="2027-02-07">7 Feb 2027</time>
    <div className="header-mobile-actions">
      <a className="header-rsvp-shortcut" href="#rsvp" onClick={() => selectSection('rsvp')}>RSVP</a>
      <button ref={menuToggle} className="header-menu-toggle" type="button" aria-expanded={enabled && menuOpen} aria-controls="wedding-mobile-menu" onClick={() => setMenuOpen(open => !open)}>
        {menuOpen ? 'Close' : 'Menu'}
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
          {menuOpen ? <path d="m5 5 10 10M5 15 15 5" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
    </div>
    <nav className="header-mobile-menu" id="wedding-mobile-menu" aria-label="Wedding sections" hidden={!enabled || !menuOpen}>
      {LINKS.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined} onClick={() => selectSection(id)}>{label}</a>)}
    </nav>
    <div className="reading-thread" ref={thread} aria-hidden="true">
      <span className="reading-ribbon" />
      <img className="reading-thread-bow" src={progressBow} width="141" height="161" alt="" decoding="async" draggable="false" />
    </div>
  </header>
}
