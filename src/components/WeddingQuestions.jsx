import { WEDDING_QUESTIONS } from '../weddingQuestions.js'
import Flourish from './Flourish.jsx'
import './WeddingQuestions.css'

export default function WeddingQuestions() {
  return <section className="faq-section section" id="questions" aria-labelledby="questions-title">
    <h2 id="questions-title">Your questions,<br /><em>answered</em></h2>
    <p className="section-intro">Everything you need to know about our wedding day!</p>
    <Flourish />
    <div className="faq-list">
      {WEDDING_QUESTIONS.map(({ question, paragraphs }) => <details className="faq-item" key={question}>
        <summary>
          <span>{question}</span>
          <span className="faq-toggle" aria-hidden="true" />
        </summary>
        <div className="faq-answer">{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      </details>)}
    </div>
    <Flourish />
  </section>
}
