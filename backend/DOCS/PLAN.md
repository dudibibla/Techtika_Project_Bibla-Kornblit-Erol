# תוכנית עבודה לפרויקט: Quote of the Day 📜

תוכנית עבודה מפורטת לפיתוח צד השרת (Backend) ומסד הנתונים, בחלוקה בין שני מפתחי ה-Backend (שותף ה-GET ושותף ה-POST).

---

## 🏗️ ארכיטקטורה ומבנה התיקיות (Folder Structure)
כדי למנוע התנגשויות (Conflicts) ב-Git ולעבוד בצורה מסודרת, התיקייה הראשית תהיה `backend/` ותכיל את המבנה הבא:

```text
backend/
├── .gitignore          # קובץ התעלמות מקבצים מקומיים (בסיס נתונים וסביבה וירטואלית)
├── constants.py        # קובץ קבועים והגדרות מערכת (Database name, Host, Port)
├── database.db         # קובץ מסד הנתונים SQLite (מקומי בלבד - לא עולה ל-Git!)
├── db_helper.py        # פונקציות עזר לעבודה מול ה-DB (יצירת טבלאות וחיבורים)
├── main.py             # קובץ השרת הראשי (FastAPI / Flask) עם ה-Endpoints
└── PLAN.md             # קובץ תוכנית עבודה זה
```

---

## 🗄️ מבנה מסד הנתונים (Database Schema)

אנו משתמשים ב-**SQLite** לצורך פשטות ומהירות עבודה מקומית.

### 1. טבלת `quotes` (ציטוטים קיימים במערכת)
| שם העמודה | סוג נתונים | הגדרות נוספות | תפקיד |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | PRIMARY KEY AUTOINCREMENT | מזהה ייחודי לכל ציטוט |
| `text` | `TEXT` | NOT NULL | תוכן הציטוט |
| `author` | `TEXT` | NOT NULL | שם כותב הציטוט |

### 2. טבלת `favorites` (ציטוטים מועדפים של המשתמש)
| שם העמודה | סוג נתונים | הגדרות נוספות | תפקיד |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | PRIMARY KEY AUTOINCREMENT | מזהה ייחודי לרשומת המועדף |
| `quote_id` | `INTEGER` | FOREIGN KEY (`quotes.id`) | מזהה הציטוט שנשמר |

---

## 🛠️ חלוקת המשימות לפיתוח (Team Task Division)

### 👥 שותף א' (עובד על נתיב ה-`GET` ותשתית ה-DB)
* **ענף בגיט:** `feature/backend-get`
1. **הקמת ה-DB:** כתיבת סקריפט ב-`db_helper.py` שמייצר את שתי הטבלאות (`quotes` ו-`favorites`) במידה והן לא קיימות, ומכניס 5-10 ציטוטים ראשוניים לטבלת הציטוטים.
2. **הקמת השרת:** יצירת שלד השרת ב-`main.py` והגדרת ה-CORS על מנת לאפשר לפרונטנד לגשת לשרת.
3. **בניית ה-GET Endpoint:**
   * נתיב: `GET /random`
   * תפקיד: שליפת שורה אקראית מטבלת `quotes` (למשל בעזרת `ORDER BY RANDOM() LIMIT 1`) והחזרתה כ-JSON.

### 👥 שותף ב' (אתה - עובד על נתיב ה-`POST` ושמירת מועדפים)
* **ענף בגיט:** `feature/backend-post`
1. **משיכת השינויים (Pull):** לאחר ששותף א' ממזג את עבודתו ל-`main`, תמשוך את הקוד המעודכן ותפתח את הענף שלך.
2. **בניית ה-POST Endpoint:**
   * נתיב: `POST /favorites`
   * קלט (Request Body):
     ```json
     {
       "quote_id": 5
     }
     ```
   * תפקיד: בדיקה שה-`quote_id` שנשלח אכן קיים בטבלת `quotes`, ולאחר מכן הכנסת שורה חדשה לטבלת `favorites`.
   * פלט (Response): החזרת הודעת הצלחה/שגיאה בהתאם לקבועים המוגדרים ב-`constants.py`.

---

## 🔄 תהליך עבודה ב-Git (Git Flow)

כדי לעבוד חלק ובלי תקלות, עקבו אחר השלבים הבאים:

1. **צעד ראשון של שותף א':**
   ```bash
   git checkout -b feature/backend-get
   # פיתוח הקוד...
   git add .
   git commit -m "feat: setup database, main server, and GET /random endpoint"
   git push origin feature/backend-get
   ```
   *לאחר מכן פתיחת Pull Request ב-GitHub, ביצוע Code Review ומיזוג (Merge) ל-`main`.*

2. **הצעד שלך (שותף ב'):**
   ```bash
   # מעבר לענף הראשי ומשיכת הקוד המעודכן של שותף א'
   git checkout main
   git pull origin main
   
   # יצירת הענף שלך עבור ה-POST
   git checkout -b feature/backend-post
   # פיתוח קוד ה-POST...
   git add .
   git commit -m "feat: implement POST /favorites endpoint using constants"
   git push origin feature/backend-post
   ```
   *פתיחת Pull Request, שותף א' בודק ומאשר, ומיזוג ל-`main`.*

---

## 🚫 תכולת קובץ ה-`.gitignore` הנדרש
כדי למנוע דריסה של קובץ בסיס הנתונים המקומי של כל אחד מכם, הקובץ `.gitignore` בתיקייה הראשית חייב להכיל:
```text
# Database
*.db
*.sqlite

# Python Virtual Environment
venv/
.venv/
__pycache__/
*.pyc
```
