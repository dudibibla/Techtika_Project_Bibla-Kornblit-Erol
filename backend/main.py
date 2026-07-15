from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from database import get_db_connection, init_db

# Initialize database tables and seed quotes on startup
init_db()

app = FastAPI(title="Quote of the Day API")

# Enable CORS for React frontend (running on Vite, e.g., http://localhost:5173 or other local development ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FavoriteRequest(BaseModel):
    quote_id: int

@app.get("/random")
def get_random_quote():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, text, author FROM quotes ORDER BY RANDOM() LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No quotes found in the database. Please ensure it is seeded."
        )
    return {"id": row["id"], "text": row["text"], "author": row["author"]}

@app.get("/favorites")
def get_favorites():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.id, f.quote_id, q.text, q.author 
        FROM favorites f
        JOIN quotes q ON f.quote_id = q.id
        ORDER BY f.id DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {"id": row["id"], "quote_id": row["quote_id"], "text": row["text"], "author": row["author"]}
        for row in rows
    ]

@app.post("/favorites", status_code=status.HTTP_201_CREATED)
def add_favorite(fav_req: FavoriteRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Verify the quote exists
    cursor.execute("SELECT id, text, author FROM quotes WHERE id = ?", (fav_req.quote_id,))
    quote_row = cursor.fetchone()
    if not quote_row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quote with id {fav_req.quote_id} not found."
        )
        
    # 2. Check if already favorited
    cursor.execute("SELECT id FROM favorites WHERE quote_id = ?", (fav_req.quote_id,))
    existing = cursor.fetchone()
    
    if existing:
        favorite_id = existing["id"]
    else:
        try:
            cursor.execute("INSERT INTO favorites (quote_id) VALUES (?)", (fav_req.quote_id,))
            conn.commit()
            favorite_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not save favorite."
            )
            
    conn.close()
    
    return {
        "id": favorite_id,
        "quote_id": quote_row["id"],
        "text": quote_row["text"],
        "author": quote_row["author"]
    }

@app.delete("/favorites/{fav_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(fav_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if exists
    cursor.execute("SELECT id FROM favorites WHERE id = ?", (fav_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Favorite with id {fav_id} not found."
        )
        
    cursor.execute("DELETE FROM favorites WHERE id = ?", (fav_id,))
    conn.commit()
    conn.close()
    return None
