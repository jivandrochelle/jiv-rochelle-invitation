import Flourish from './Flourish.jsx'
import './WeddingEntourage.css'

const PRINCIPAL_SPONSORS = [
  ['Atty. Paulino Labrado', 'Ms. Emilyn Gonzales'],
  ['Atty. Allan Frederick Blanco', 'Mrs. Denise Blanco'],
  ['Mr. Roche Altizo', 'Mrs. Cordelie Altizo'],
  ['Mr. Aldwin Go', 'Mrs. Shiryll Go'],
  ['Mr. Ronald Abejo', 'Mrs. Princess Abejo'],
]

const WEDDING_PARTY = [
  { title: 'Groomsmen', names: ['Mr. Colin Royce Ang', 'Mr. Erick Paul Domingo', 'Atty. Alreza Jan Icalina', 'Ms. Maica Carmel Shirl Dizon'] },
  { title: 'Bridesmaids', names: ['Atty. Shaira Vea Emmanuelle Olarte', 'Atty. Zaidaronica Kho', 'Ms. Arvie Pepito', 'Mr. Reynald Lagang'] },
]

const SECONDARY_SPONSORS = [
  { title: 'Candle sponsors', names: ['Mr. Allan Arguelles', 'Mrs. Kazumi Arguelles'] },
  { title: 'Veil sponsors', names: ['Mr. Noel Anthony Arandilla', 'Mrs. Angelica Lao Arandilla'] },
  { title: 'Cord sponsors', names: ['Mrs. Ginnelle Anne Gevara', 'Mr. Ash Gevara'] },
]

const BEARERS = [
  { title: 'Ring bearer', name: 'Ms. Rhusell Catriona Tiu' },
  { title: 'Bible bearer', name: 'Mr. Kim Bryan Reyes' },
  { title: 'Coin bearer', name: 'Engr. Judd Sydney Gonzales' },
]

function NameGroup({ title, names }) {
  return <div className="entourage-group">
    <h4>{title}</h4>
    <ul className="entourage-names">{names.map(name => <li key={name}>{name}</li>)}</ul>
  </div>
}

export default function WeddingEntourage() {
  return <section className="entourage-section section" id="entourage" aria-labelledby="entourage-title">
    <p className="eyebrow">With us, as we begin forever</p>
    <h2 id="entourage-title">Our <em>Entourage</em></h2>
    <Flourish />
    <p className="section-intro">The cherished people standing beside us on our wedding day.</p>

    <div className="entourage-content">
      <div className="entourage-block">
        <h3>Principal sponsors</h3>
        <div className="entourage-columns">
          <NameGroup title="Male principal sponsors" names={PRINCIPAL_SPONSORS.map(([name]) => name)} />
          <NameGroup title="Female principal sponsors" names={PRINCIPAL_SPONSORS.map(([, name]) => name)} />
        </div>
      </div>

      <div className="entourage-block">
        <h3 className="sr-only">Wedding party</h3>
        <div className="entourage-columns entourage-honors">
          <NameGroup title="Best man" names={['Dr. Jaques Simon Gonzales']} />
          <NameGroup title="Maid of honor" names={['Ms. Kyla Marie Reyes']} />
        </div>
        <div className="entourage-columns">
          {WEDDING_PARTY.map(group => <NameGroup key={group.title} {...group} />)}
        </div>
      </div>

      <div className="entourage-block">
        <h3>Secondary sponsors</h3>
        <div className="entourage-columns entourage-trio">
          {SECONDARY_SPONSORS.map(group => <NameGroup key={group.title} {...group} />)}
        </div>
      </div>

      <div className="entourage-block">
        <h3>Bearers</h3>
        <div className="entourage-columns entourage-trio">
          {BEARERS.map(({ title, name }) => <NameGroup key={title} title={title} names={[name]} />)}
        </div>
        <div className="entourage-flower-girls">
          <NameGroup title="Flower girls" names={['Ms. Samantha Jezaine Madalura']} />
        </div>
      </div>
    </div>
    <Flourish />
  </section>
}
