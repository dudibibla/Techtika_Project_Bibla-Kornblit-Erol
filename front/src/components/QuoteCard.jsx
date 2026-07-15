// ⚠️ Placeholder זמני עבור פיצ'ר A (כרטיס הציטוט) — באחריות החבר לצוות.
// בניתי גרסה מינימלית ועובדת רק כדי שאפשר לבדוק את רשימת המועדפים (B)
// מקצה לקצה. מי שעובד על A מוזמן להחליף/לשפר את כל הקומפוננטה הזו.

import { useEffect, useRef, useState } from 'react'
import { getRandomQuote } from '../api'

const FLIP_MS = 220 // חייב להתאים למשך המעבר של .quote-body ב-App.css

function QuoteCard({ onSave }) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const isFirstLoad = useRef(true)

  const loadQuote = async () => {
    setSaved(false)

    // בטעינה הראשונה אין כרטיס קיים להפוך ממנו - פשוט מציגים טעינה
    if (isFirstLoad.current) {
      setLoading(true)
      try {
        setQuote(await getRandomQuote())
      } finally {
        setLoading(false)
        isFirstLoad.current = false
      }
      return
    }

    setLoading(true)
    const next = await getRandomQuote()
    setLoading(false)

    // הופכים את הכרטיס (0deg -> 90deg), מחליפים ציטוט בחצי הסיבוב, וממשיכים
    // (90deg -> 0deg) עם התוכן החדש
    setFlipping(true)
    window.setTimeout(() => {
      setQuote(next)
      setFlipping(false)
    }, FLIP_MS)
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
        <blockquote className={`quote-body${flipping ? ' is-flipping' : ''}`}>
          <p className="quote-text">{quote.text}</p>
          <cite className="quote-author">{quote.author}</cite>
        </blockquote>
      )}

      <div className="quote-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleSave}
          disabled={loading || flipping || saved}
        >
          {saved ? '✓ נשמר' : '♥ שמור'}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadQuote}
          disabled={loading || flipping}
        >
          New
        </button>
      </div>
    </section>
  )
}

export default QuoteCard
