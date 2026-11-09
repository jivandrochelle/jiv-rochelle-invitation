import { useEffect, useRef, useState } from 'react'
import Flourish from './Flourish.jsx'
import floralFountain from '../assets/transitions/floral-fountain-transparent.webp'
import './WeddingGifts.css'

const BANK = { name: 'Eastwest', accountName: 'Jiv Stevens Gonzales', accountNumber: '200065071443' }

export default function WeddingGifts() {
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [copyState, setCopyState] = useState('idle')
  const accountNumber = useRef(null)
  const copyRequest = useRef(0)
  useEffect(() => () => { copyRequest.current += 1 }, [])
  const toggleDetails = () => {
    copyRequest.current += 1
    setCopyState('idle')
    setShowBankDetails(visible => !visible)
  }
  const copyAccountNumber = async () => {
    const request = ++copyRequest.current
    setCopyState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(BANK.accountNumber)
      if (request === copyRequest.current) setCopyState('copied')
    } catch {
      if (request !== copyRequest.current) return
      const selection = window.getSelection()
      if (selection && accountNumber.current) {
        const range = document.createRange()
        range.selectNodeContents(accountNumber.current)
        selection.removeAllRanges()
        selection.addRange(range)
        setCopyState('selected')
      } else setCopyState('unavailable')
    }
  }
  return <section className="gifts-section section" id="gifts" aria-labelledby="gifts-title">
    <img className="gifts-decoration" src={floralFountain} width="640" height="701" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <h2 id="gifts-title">Gifts</h2>
    <Flourish />
    <p className="gifts-copy">Your presence is the most meaningful gift of all. But if you'd like to give something extra, we kindly prefer cash gifts to help us begin our next chapter together.</p>
    <p className="gifts-transfer-intro">If Bank Transfer is easiest for you, please use the bank details below:</p>
    <button className="gifts-details-button" type="button" aria-expanded={showBankDetails} aria-controls="gifts-bank-details" onClick={toggleDetails}>
      {showBankDetails ? 'Hide bank details' : 'View bank details'}
      <span aria-hidden="true">{showBankDetails ? '−' : '+'}</span>
    </button>
    <div className="gifts-bank-details" id="gifts-bank-details" role="region" aria-label="Bank transfer details" hidden={!showBankDetails}>
      <dl>
        <div>
          <dt>Bank</dt>
          <dd>{BANK.name}</dd>
        </div>
        <div>
          <dt>Account name</dt>
          <dd>{BANK.accountName}</dd>
        </div>
        <div>
          <dt>Account number</dt>
          <dd className="gifts-account-number"><span ref={accountNumber}>{BANK.accountNumber}</span></dd>
        </div>
      </dl>
      <button className="gifts-copy-button" type="button" onClick={copyAccountNumber} disabled={copyState === 'copying'}>
        {copyState === 'copying' ? 'Copying…' : copyState === 'copied' ? 'Copied ✓' : 'Copy account number'}
      </button>
      <p className="gifts-copy-status" role="status">
        {copyState === 'copied' ? 'Account number copied.' : copyState === 'selected' ? 'Account number selected. You can copy it manually.' : copyState === 'unavailable' ? 'Please select and copy the account number above.' : ''}
      </p>
    </div>
    <Flourish />
  </section>
}
