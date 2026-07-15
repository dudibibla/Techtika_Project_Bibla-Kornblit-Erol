import { useEffect, useState } from 'react'
import QuoteCard from './components/QuoteCard'
import AddQuoteForm from './components/AddQuoteForm'
import QuoteSearch from './components/QuoteSearch'
import FavoritesList from './components/FavoritesList'
import { getFavorites, addFavorite, removeFavorite, USE_MOCK } from './api'
import './App.css'

function App() {
  // ה-state של המועדפים חי כאן (באב) כדי ששני הפיצ'רים ישתפו אותו:
  // A מוסיף מועדף → B מתעדכן אוטומטית.
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (quote) => {
    const favorite = await addFavorite(quote)
    // אם השרת החזיר מועדף חדש (ולא רשימה קיימת) — נוסיף אותו לראש
    if (favorite && favorite.id && !favorites.some((f) => f.id === favorite.id)) {
      setFavorites((prev) => [favorite, ...prev])
    }
  }

  const handleRemove = async (favoriteId) => {
    await removeFavorite(favoriteId)
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
  }

  return (
    <div className="app" dir="rtl">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">tectika</span>
        </div>
        <h1>
          ציטוט היום <span className="brand-en">Quote of the Day</span>
        </h1>
        {USE_MOCK && (
          <p className="mock-badge">
            מצב הדגמה (mock) — הנתונים נשמרים מקומית עד שהבאק אנד מחובר
          </p>
        )}
      </header>

      <main className="app-main">
        <div className="quote-column">
          <QuoteCard onSave={handleSave} favorites={favorites} />
          <AddQuoteForm />
        </div>
        <div className="side-column">
          <QuoteSearch favorites={favorites} onAddFavorite={handleSave} />
          <FavoritesList
            favorites={favorites}
            loading={loading}
            error={error}
            onRemove={handleRemove}
          />
        </div>
      </main>
    </div>
  )
}

export default App
