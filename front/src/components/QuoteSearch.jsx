// סקשן חיפוש — מחפש בכל הציטוטים במאגר (דרך הבאק אנד), נפרד ממועדפים.
// כל תוצאה ניתנת להוספה למועדפים (onAddFavorite). ציטוט שכבר במועדפים
// מסומן ב-✓ ולא ניתן להוספה כפולה.
//
// החיפוש "זורם" עם debounce של 300ms — מחכה שתפסיק להקליד לפני שמחפש,
// כדי לא לשלוח בקשה על כל הקלדה בודדת (כמו יוטיוב).

import { useEffect, useMemo, useState } from 'react'
import { searchQuotes } from '../api'

const DEBOUNCE_MS = 300

function QuoteSearch({ favorites, onAddFavorite }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(false)

  // debounce — מעדכן את מונח החיפוש רק אחרי הפסקת הקלדה
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  // מביא תוצאות מכל הציטוטים בכל שינוי של מונח החיפוש
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setError(false)
      return
    }
    let active = true
    setSearching(true)
    setError(false)
    searchQuotes(debouncedQuery)
      .then((data) => active && setResults(data))
      .catch(() => active && setError(true))
      .finally(() => active && setSearching(false))
    return () => {
      active = false // מבטל תוצאה של חיפוש ישן שחזר מאוחר
    }
  }, [debouncedQuery])

  const isSearching = debouncedQuery.length > 0

  // אילו ציטוטים כבר במועדפים (לפי quote_id) — לסימון ✓
  const favoritedIds = useMemo(
    () => new Set(favorites.map((f) => f.quote_id)),
    [favorites]
  )

  return (
    <section className="search-panel" aria-label="חיפוש ציטוטים">
      <div className="favorites-head">
        <h2>חיפוש ציטוטים</h2>
        {isSearching && results.length > 0 && (
          <span className="favorites-count">{results.length}</span>
        )}
      </div>

      <div className="favorites-search">
        <span className="favorites-search-icon">🔍</span>
        <input
          type="search"
          className="favorites-search-input"
          placeholder="חיפוש בכל הציטוטים…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="חיפוש בכל הציטוטים"
        />
        {query && (
          <button
            type="button"
            className="favorites-search-clear"
            onClick={() => setQuery('')}
            aria-label="נקה חיפוש"
            title="נקה חיפוש"
          >
            ✕
          </button>
        )}
      </div>

      {!isSearching && (
        <p className="favorites-status search-hint">
          הקלידו כדי לחפש בכל הציטוטים במאגר
        </p>
      )}

      {isSearching && searching && <p className="favorites-status">מחפש…</p>}

      {isSearching && error && (
        <p className="favorites-status favorites-error">שגיאה בחיפוש 😕</p>
      )}

      {isSearching && !searching && !error && results.length === 0 && (
        <p className="favorites-status">לא נמצאו ציטוטים ל־"{debouncedQuery}"</p>
      )}

      {isSearching && !searching && !error && results.length > 0 && (
        <ul className="favorites-items">
          {results.map((quote) => {
            const alreadyFav = favoritedIds.has(quote.id)
            return (
              <li key={quote.id} className="favorite-item">
                <div className="favorite-text">
                  <p>{quote.text}</p>
                  {quote.author && (
                    <span className="favorite-author">— {quote.author}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="favorite-add"
                  onClick={() => onAddFavorite(quote)}
                  disabled={alreadyFav}
                  aria-label={alreadyFav ? 'כבר במועדפים' : 'הוסף למועדפים'}
                  title={alreadyFav ? 'כבר במועדפים' : 'הוסף למועדפים'}
                >
                  {alreadyFav ? '✓' : '♥'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default QuoteSearch
