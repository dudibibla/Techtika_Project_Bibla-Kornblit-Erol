// ⚠️ Placeholder זמני עבור פיצ'ר A (כרטיס הציטוט) — באחריות החבר לצוות.
// בניתי גרסה מינימלית ועובדת רק כדי שאפשר לבדוק את רשימת המועדפים (B)
// מקצה לקצה. מי שעובד על A מוזמן להחליף/לשפר את כל הקומפוננטה הזו.

import { useEffect, useRef, useState } from 'react'
import { getRandomQuote } from '../api'

const FLIP_MS = 220 // חייב להתאים למשך המעבר של .quote-body ב-App.css

function QuoteCard({ onSave, favorites = [] }) {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [flipping, setFlipping] = useState(false)
  const isFirstLoad = useRef(true)

  // "נשמר" נגזר מרשימת המועדפים האמיתית (App) ולא ממצב מקומי, כדי שהכרטיס
  // ישקף מיד גם מחיקה שבוצעה דרך רשימת המועדפים (B)
  const isSaved = !!quote && favorites.some((f) => f.quote_id === quote.id)

  const loadQuote = async () => {
    setSaveError(false)

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

  const handleSave = async () => {
    if (!quote || isSaved || saving) return
    setSaving(true)
    setSaveError(false)
    try {
      await onSave(quote)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
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
          disabled={loading || flipping || saving || isSaved}
        >
          {isSaved ? '✓ נשמר' : saving ? 'שומר…' : saveError ? '⚠ שגיאה, נסה שוב' : '♥ שמור'}
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
