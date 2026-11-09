import { useEffect, useRef, useState } from 'react'
import { ATTIRE_PALETTES, chooseGuestColor } from '../attire.js'
import { preloadGuestColor } from '../attireArtwork.js'
import GuestCelebration from './GuestCelebration.jsx'

export default function GuestPalette({ children }) {
  const [message, setMessage] = useState('')
  const [hasTriedColor, setHasTriedColor] = useState(false)
  const paletteRef = useRef(null)
  const [choice, setChoice] = useState(() => chooseGuestColor('Blue', 'Misty'))
  const requests = useRef(0)
  useEffect(() => () => { requests.current++ }, [])
  useEffect(() => {
    const palette = paletteRef.current
    if (hasTriedColor) { palette.removeAttribute('data-discovery-ready'); return }
    if (typeof IntersectionObserver !== 'function') { palette.setAttribute('data-discovery-ready', ''); return }
    let disposed = false
    const observer = new IntersectionObserver(([entry]) => {
      if (disposed || !entry.isIntersecting) return
      palette.setAttribute('data-discovery-ready', '')
      observer.disconnect()
    }, { threshold: .4 })
    observer.observe(palette)
    return () => { disposed = true; observer.disconnect() }
  }, [hasTriedColor])
  const prepare = (family, name) => preloadGuestColor(chooseGuestColor(family, name))
  const pick = async (family, name) => {
    setHasTriedColor(true)
    const request = ++requests.current
    const next = chooseGuestColor(family, name)
    setMessage('')
    try {
      await preloadGuestColor(next)
      if (requests.current !== request) return
      setChoice(next)
    } catch {
      if (requests.current === request) setMessage('That outfit preview could not load. Please try the shade again.')
    }
  }

  return <section className="dress-section section" id="dress" aria-labelledby="dress-title">
    <p className="eyebrow">A little inspiration</p>
    <h2 id="dress-title">Dressed <em>for love</em></h2>
    <p className="dress-code">Formal attire</p>
    <p className="body-copy">Everyone is welcome to wear shades of blue or pink.</p>
    <div className="palettes" ref={paletteRef}>
      {ATTIRE_PALETTES.map(palette => <div className="palette-group" key={palette.title} role="group" aria-labelledby={`palette-${palette.family}`}>
        <h3 id={`palette-${palette.family}`}>{palette.title}</h3>
        <div className="swatches">{palette.colors.map(([name, color]) => <button type="button" className="swatch" key={name} aria-label={`${name} ${palette.family}`} aria-controls="celebration-guests" aria-pressed={choice?.color === color} onPointerEnter={() => { prepare(palette.family, name).catch(() => {}) }} onFocus={() => { prepare(palette.family, name).catch(() => {}) }} onClick={() => pick(palette.family, name)}>
          <span className="swatch-color" style={{ '--swatch': color }} aria-hidden="true" />
          <span>{name}</span>
        </button>)}</div>
      </div>)}
      <span className="palette-invitation" id="palette-invitation" aria-hidden={hasTriedColor}>
        <svg viewBox="0 0 44 28" aria-hidden="true" focusable="false"><path d="M40 23C18 26 10 15 15 4" strokeDasharray="2 3" /><path d="m10 8 5-5 4 6" /></svg>
        <span>Try a shade on</span>
      </span>
    </div>
    <GuestCelebration choice={choice} />
    <div className={message ? 'palette-status' : 'sr-only'} role="status">{message}</div>
    {children}
  </section>
}
