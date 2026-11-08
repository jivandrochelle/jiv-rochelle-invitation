import { useState } from 'react'
import Flourish from './Flourish.jsx'
import floralFountain from '../assets/transitions/floral-fountain-transparent.webp'
import './WeddingGifts.css'

export default function WeddingGifts() {
  const [showBankDetails, setShowBankDetails] = useState(false)
  return <section className="gifts-section section" id="gifts" aria-labelledby="gifts-title">
    <img className="gifts-decoration" src={floralFountain} width="640" height="701" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <h2 id="gifts-title">Gifts</h2>
    <Flourish />
    <p className="gifts-copy">Your presence is the most meaningful gift of all. But if you'd like to give something extra, we kindly prefer cash gifts to help us begin our next chapter together.</p>
    <p className="gifts-transfer-intro">If Bank Transfer is easiest for you, please use the bank details below:</p>
    <button className="gifts-details-button" type="button" aria-expanded={showBankDetails} aria-controls="gifts-bank-details" onClick={() => setShowBankDetails(visible => !visible)}>
      {showBankDetails ? 'Hide bank details' : 'View bank details'}
      <span aria-hidden="true">{showBankDetails ? '−' : '+'}</span>
    </button>
    <dl className="gifts-bank-details" id="gifts-bank-details" aria-label="Bank transfer details" hidden={!showBankDetails}>
      <div>
        <dt>Bank</dt>
        <dd>Eastwest</dd>
      </div>
      <div>
        <dt>Account name</dt>
        <dd>Jiv Stevens Gonzales</dd>
      </div>
      <div>
        <dt>Account number</dt>
        <dd className="gifts-account-number">200065071443</dd>
      </div>
    </dl>
    <Flourish />
  </section>
}
