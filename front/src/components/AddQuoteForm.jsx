import { useState } from 'react'
import { addQuote } from '../api'

function AddQuoteForm() {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState('idle') // idle | saving | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedText = text.trim()
    const trimmedAuthor = author.trim()
    if (!trimmedText || !trimmedAuthor) return

    setStatus('saving')
    try {
      await addQuote({ text: trimmedText, author: trimmedAuthor })
      setText('')
      setAuthor('')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="add-quote" onSubmit={handleSubmit}>
      <h2>הוספת ציטוט</h2>

      <label className="add-quote-field">
        <span>טקסט הציטוט</span>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setStatus('idle')
          }}
          placeholder="כתוב כאן את הציטוט..."
          rows={3}
          required
        />
      </label>

      <label className="add-quote-field">
        <span>מחבר</span>
        <input
          type="text"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value)
            setStatus('idle')
          }}
          placeholder="שם המחבר"
          required
        />
      </label>

      <div className="add-quote-actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'שומר…' : 'הוסף ציטוט'}
        </button>
        {status === 'success' && (
          <span className="add-quote-status add-quote-success">✓ נוסף בהצלחה</span>
        )}
        {status === 'error' && (
          <span className="add-quote-status add-quote-error">שגיאה בשמירה, נסה שוב</span>
        )}
      </div>
    </form>
  )
}

export default AddQuoteForm
