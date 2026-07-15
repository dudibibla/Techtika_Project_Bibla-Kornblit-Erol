# Quote of the Day 📜

A full-stack learning project — a "Quote of the Day" web app built by a small team as an introduction to Git collaboration, React, and FastAPI.

Users get a random quote, can flip to a new one, add their own quotes, and save favorites.

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **Backend:** FastAPI (Python) + SQLite

## Features

- 🔀 Random quote card with a flip transition
- ➕ Add a new quote (text + author)
- ⭐ Save / remove favorite quotes

## Project Structure

```text
.
├── front/     # React + Vite frontend
└── backend/   # FastAPI backend + SQLite database
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.10+](https://www.python.org/) (for the backend)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd front
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or the next free port).

Copy `front/.env.example` to `front/.env` to configure the API connection:

```env
VITE_USE_MOCK=true                      # false to use the real backend
VITE_API_URL=http://localhost:8000
```

## API Endpoints

| Method | Endpoint            | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/random`             | Get a random quote       |
| POST   | `/quotes`              | Add a new quote          |
| GET    | `/favorites`           | List favorite quotes     |
| POST   | `/favorites`           | Add a favorite           |
| DELETE | `/favorites/{fav_id}`  | Remove a favorite        |

## Branching Strategy

- `Develop` — main working branch; all feature branches are created from here.
- `main` — kept clean, holding only project documentation.
- Feature branches: `feature/<name>`.
