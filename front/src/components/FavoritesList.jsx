// פיצ'ר B — רשימת המועדפים.
// פאנל נפרד שמציג את הציטוטים השמורים בלבד. ההוספה מגיעה משני מקומות:
// כרטיס הציטוט (A) וסקשן החיפוש (QuoteSearch) — שניהם דרך state משותף ב-App.

function FavoritesList({ favorites, loading, error, onRemove }) {
  return (
    <section className="favorites" aria-label="רשימת המועדפים">
      <div className="favorites-head">
        <h2>המועדפים שלי</h2>
        {favorites.length > 0 && (
          <span className="favorites-count">{favorites.length}</span>
        )}
      </div>

      {loading && <p className="favorites-status">טוען מועדפים…</p>}

      {error && (
        <p className="favorites-status favorites-error">
          שגיאה בטעינת המועדפים 😕
        </p>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="favorites-empty">
          <span className="favorites-empty-icon">❤</span>
          <p>עדיין אין מועדפים</p>
          <small>חפשו ציטוט למעלה או לחצו "שמור" בכרטיס כדי להוסיף לכאן</small>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <ul className="favorites-items">
          {favorites.map((fav) => (
            <li key={fav.id} className="favorite-item">
              <div className="favorite-text">
                <p>{fav.text}</p>
                {fav.author && <span className="favorite-author">— {fav.author}</span>}
              </div>
              <button
                type="button"
                className="favorite-remove"
                onClick={() => onRemove(fav.id)}
                aria-label="הסר ממועדפים"
                title="הסר ממועדפים"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoritesList
