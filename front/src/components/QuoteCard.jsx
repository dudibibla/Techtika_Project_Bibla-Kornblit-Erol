// ⚠️ Placeholder זמני עבור פיצ'ר A (כרטיס הציטוט) — באחריות החבר לצוות.
// בניתי גרסה מינימלית ועובדת רק כדי שאפשר לבדוק את רשימת המועדפים (B)
// מקצה לקצה. מי שעובד על A מוזמן להחליף/לשפר את כל הקומפוננטה הזו.

import { useEffect, useState } from 'react'
import { getRandomQuote } from '../api'

function QuoteCard({ onSave }) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadQuote = async () => {
    setLoading(true)
    setSaved(false)
    try {
      setQuote(await getRandomQuote())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuote()
  }, [])

  const handleSave = () => {
    if (!quote) return
    onSave(quote)
    setSaved(true)
  }

  return (
    <section className="quote-card" aria-label="כרטיס ציטוט">
      <span className="quote-mark">”</span>

      {loading || !quote ? (
        <p className="quote-loading">טוען ציטוט…</p>
      ) : (
        <blockquote className="quote-body">
          <p className="quote-text">{quote.text}</p>
          <cite className="quote-author">{quote.author}</cite>
        </blockquote>
      )}

      <div className="quote-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleSave}
          disabled={loading || saved}
        >
          {saved ? '✓ נשמר' : '♥ שמור'}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadQuote}
          disabled={loading}
        >
          New
        </button>
      </div>
    </section>
  )
}

export default QuoteCard
