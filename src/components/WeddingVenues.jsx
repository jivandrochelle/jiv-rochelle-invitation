import { useEffect, useRef } from 'react'
import { WEDDING_EVENTS } from '../calendar.js'
import { WEDDING_DATE } from '../wedding.js'
import church from '../assets/venues/ceremony-church.webp'
import reception from '../assets/venues/reception-table.webp'
import './WeddingVenues.css'

const VENUE_ARTWORK = { ceremony: church, reception }

function Venue({ event, index }) {
  return <article className="venue">
    <span className="venue-number">0{index + 1}</span>
    <div className={`venue-artwork venue-artwork-${event.id}`} aria-hidden="true">
      <img src={VENUE_ARTWORK[event.id]} width="640" height="640" alt="" loading="lazy" decoding="async" />
    </div>
    <p className="eyebrow">{event.label} · {event.time}</p>
    <h3>{event.id === 'ceremony' ? <>The Archdiocesan Shrine<br />of the Most Sacred<br />Heart of Jesus</> : <>Marco Polo<br />Plaza Cebu</>}</h3>
    <div className="venue-actions">
      <a className="text-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`} target="_blank" rel="noreferrer">Find your way <span aria-hidden="true">↗</span></a>
    </div>
  </article>
}

export default function WeddingVenues({ children, enabled = true }) {
  const venuesRef = useRef(null)
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver !== 'function'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const venues = [...venuesRef.current.querySelectorAll('.venue')]
    let disposed = false
    const observer = new IntersectionObserver(entries => {
      if (disposed) return
      entries.forEach(({ target, isIntersecting }) => target.toggleAttribute('data-in-view', isIntersecting))
    }, { threshold: .35, rootMargin: '0px 0px -8% 0px' })
    venues.forEach(venue => observer.observe(venue))
    return () => {
      disposed = true
      observer.disconnect()
      venues.forEach(venue => venue.removeAttribute('data-in-view'))
    }
  }, [enabled])
  return <section className="venues-section section" id="details" aria-labelledby="venues-title">
    {children}
    <p className="eyebrow">Two places. One beautiful day.</p>
    <h2 id="venues-title">Meet us <em>here</em></h2>
    <time className="venues-date" dateTime={WEDDING_DATE.slice(0, 10)}>Sunday, 07 February 2027</time>
    <div className="venue-list" ref={venuesRef}>{WEDDING_EVENTS.map((event, index) => <Venue key={event.id} event={event} index={index} />)}</div>
  </section>
}
