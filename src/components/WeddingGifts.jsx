import Flourish from './Flourish.jsx'
import './WeddingGifts.css'

export default function WeddingGifts() {
  return <section className="gifts-section section" id="gifts" aria-labelledby="gifts-title">
    <h2 id="gifts-title">Gifts</h2>
    <Flourish />
    <p className="gifts-copy">Your presence is the most meaningful gift of all. But if you'd like to give something extra, we kindly prefer cash gifts to help us begin our next chapter together.</p>
    <p className="gifts-transfer-intro">If Bank Transfer is easiest for you, please use the bank details below:</p>
    <dl className="gifts-bank-details" aria-label="Bank transfer details">
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
