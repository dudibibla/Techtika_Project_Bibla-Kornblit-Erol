// פיצ'ר B — רשימת המועדפים.
// מקבל את המועדפים ופעולת הסרה מלמעלה (App), כדי שהרשימה תתעדכן
// אוטומטית כשכרטיס הציטוט (A) מוסיף מועדף חדש.

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
          <small>לחצו על "שמור" בכרטיס הציטוט כדי להוסיף לכאן</small>
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
