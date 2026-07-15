import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "quotes.db")
JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "emily_dickinson_365_quotes.json")

# Fallback paths to search for the JSON if not in backend/
ALTERNATIVE_JSON_PATHS = [
    JSON_PATH,
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "emily_dickinson_365_quotes.json"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "emily_dickinson_365_quotes.json"),
]

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create quotes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            author TEXT NOT NULL
        )
    """)
    
    # Create favorites table (quote_id is unique so a quote can only be favorited once)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote_id INTEGER UNIQUE NOT NULL,
            FOREIGN KEY (quote_id) REFERENCES quotes (id) ON DELETE CASCADE
        )
    """)
    
    conn.commit()
    
    # Seed quotes if empty
    cursor.execute("SELECT COUNT(*) FROM quotes")
    if cursor.fetchone()[0] == 0:
        print("Database empty. Seeding quotes...")
        json_file_used = None
        for path in ALTERNATIVE_JSON_PATHS:
            if os.path.exists(path):
                json_file_used = path
                break
        
        if json_file_used:
            with open(json_file_used, "r", encoding="utf-8") as f:
                data = json.load(f)
                quotes = data.get("quotes", [])
                for q in quotes:
                    cursor.execute(
                        "INSERT OR IGNORE INTO quotes (id, text, author) VALUES (?, ?, ?)",
                        (q["id"], q["text"], q["author"])
                    )
                conn.commit()
                print(f"Seeded {len(quotes)} quotes successfully from {os.path.basename(json_file_used)}.")
        else:
            print("Warning: emily_dickinson_365_quotes.json not found. No quotes seeded.")
            
    conn.close()

if __name__ == "__main__":
    init_db()
