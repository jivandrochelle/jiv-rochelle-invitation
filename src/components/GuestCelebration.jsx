import { useEffect, useState } from 'react'
import { ATTIRE_GUESTS, getGuestColorName, getGuestOutfit } from '../attire.js'
import { guestOutfitSource } from '../attireArtwork.js'
import GuestOutfit from './GuestOutfit.jsx'
import './GuestCelebration.css'

function OutfitImage({ outfit, guest }) {
  const [images, setImages] = useState({ current: outfit, previous: null })
  // Finish an in-flight fade before showing the latest requested source, so a
  // quick second click cannot promote a half-visible layer back to full opacity.
  if (images.current.key !== outfit.key && !images.previous) setImages({ current: outfit, previous: images.current })
  useEffect(() => {
    if (!images.previous) return
    const timer = window.setTimeout(() => setImages(current => ({ ...current, previous: null })), 650)
    return () => window.clearTimeout(timer)
  }, [images.current, images.previous])
  return <>
    {images.previous && <span key={`previous-${images.previous.key}`} className="guest-outfit-previous" aria-hidden="true"><GuestOutfit guest={guest} outfit={images.previous} decorative /></span>}
    <span key={images.current.key} className={`guest-outfit-current ${images.previous ? 'is-changing' : ''}`}><GuestOutfit guest={guest} outfit={images.current} /></span>
  </>
}

export default function GuestCelebration({ choice }) {
  return <figure className="guest-celebration" id="celebration-guests" aria-label="An embroidered group of six wedding guests">
    <div className="guest-celebration-scene">
      {ATTIRE_GUESTS.map(guest => <span className={`celebration-person is-${guest.gender}`} key={guest.id} data-guest={guest.id} style={{ '--guest-x': `${guest.x}%`, '--guest-depth': guest.depth, '--guest-size': `${guest.size}%`, '--guest-ratio': (guest.width ?? 640) / 960 }}>
        <OutfitImage outfit={{ source: guestOutfitSource(getGuestOutfit(guest, choice)), choice, key: `${getGuestOutfit(guest, choice)}-${choice?.name ?? 'default'}` }} guest={guest} />
      </span>)}
    </div>
    <figcaption className="sr-only" aria-live="polite" aria-atomic="true">
      <span><small>Gentlemen</small>{getGuestColorName(choice, 'male')}</span>
      <i aria-hidden="true">&amp;</i>
      <span><small>Ladies</small>{getGuestColorName(choice, 'female')}</span>
    </figcaption>
  </figure>
}
