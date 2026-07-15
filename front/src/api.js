// ---------------------------------------------------------------------------
// שכבת API משותפת לכל הפרונט (A = כרטיס ציטוט, B = רשימת מועדפים).
// כולם קוראים לשרת דרך הפונקציות כאן — לא עושים fetch ישירות בקומפוננטות.
//
// עד שהבאק אנד מוכן, רץ במצב MOCK (נתונים מדומים ב-localStorage) כדי שאפשר
// לפתח ולראות הכול עובד לוקלית. כשהבאק אנד מוכן: שנה ב-.env את
// VITE_USE_MOCK ל-false והגדר VITE_API_URL לכתובת השרת.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' // ברירת מחדל: mock

// ----------------------------- מצב MOCK ------------------------------------

const SEED_QUOTES = [
  { id: 1, text: 'הדרך הטובה ביותר לנבא את העתיד היא ליצור אותו.', author: 'פיטר דרוקר' },
  { id: 2, text: 'ההצלחה היא סכום של מאמצים קטנים שחוזרים על עצמם יום אחר יום.', author: 'רוברט קולייר' },
  { id: 3, text: 'אל תפחד לוותר על הטוב כדי להשיג את המצוין.', author: 'ג׳ון ד. רוקפלר' },
  { id: 4, text: 'מי שלא מסתכן — לא מרוויח.', author: 'פתגם' },
  { id: 5, text: 'כל מסע של אלף מייל מתחיל בצעד אחד.', author: 'לאו דזה' },
  { id: 6, text: 'לא הכישלון הוא הבעיה, אלא הפחד להתחיל.', author: 'אלמוני' },
]

const FAVORITES_KEY = 'qotd_favorites'
const CUSTOM_QUOTES_KEY = 'qotd_custom_quotes'

const readFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
  } catch {
    return []
  }
}

const writeFavorites = (list) =>
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list))

const readCustomQuotes = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_QUOTES_KEY)) || []
  } catch {
    return []
  }
}

const writeCustomQuotes = (list) =>
  localStorage.setItem(CUSTOM_QUOTES_KEY, JSON.stringify(list))

// דמיית השהיית רשת קטנה, כדי לראות מצבי טעינה אמיתיים
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

const mockApi = {
  async getRandomQuote() {
    await delay()
    const pool = [...SEED_QUOTES, ...readCustomQuotes()]
    const i = Math.floor(Math.random() * pool.length)
    return pool[i]
  },
  async addQuote({ text, author }) {
    await delay()
    const quote = { id: Date.now(), text, author }
    writeCustomQuotes([...readCustomQuotes(), quote])
    return quote
  },
  async getFavorites() {
    await delay()
    return readFavorites()
  },
  async addFavorite(quote) {
    await delay()
    const list = readFavorites()
    // מונע כפילויות של אותו ציטוט
    if (list.some((f) => f.quote_id === quote.id)) return list
    const favorite = { id: Date.now(), quote_id: quote.id, ...quote }
    const next = [favorite, ...list]
    writeFavorites(next)
    return favorite
  },
  async removeFavorite(favoriteId) {
    await delay()
    const next = readFavorites().filter((f) => f.id !== favoriteId)
    writeFavorites(next)
    return true
  },
}

// ----------------------------- מצב אמיתי -----------------------------------

const request = async (path, options) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`בקשה נכשלה: ${res.status}`)
  return res.status === 204 ? null : res.json()
}

const realApi = {
  getRandomQuote: () => request('/random'),
  getFavorites: () => request('/favorites'),
  addFavorite: (quote) =>
    request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ quote_id: quote.id }),
    }),
  removeFavorite: (favoriteId) =>
    request(`/favorites/${favoriteId}`, { method: 'DELETE' }),
  addQuote: ({ text, author }) =>
    request('/quotes', {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    }),
}

// ----------------------------- ייצוא ---------------------------------------

const api = USE_MOCK ? mockApi : realApi

export const { getRandomQuote, getFavorites, addFavorite, removeFavorite, addQuote } = api
export { USE_MOCK }
export default api
