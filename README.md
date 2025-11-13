# Fullstack Cafe & Employee Manager

A small fullstack sample app (Express + Postgres backend, React + Vite frontend) for managing cafes and employees. The repo contains separate `backend/` and `frontend/` apps and a small SQL initializer in `backend/db_init`.

## Tech stack

- Backend: Node.js, Express, pg (Postgres), Joi (validation)
- Frontend: React (Vite), Ant Design, Axios
- Dev: nodemon (backend), Vite dev server (frontend), Tailwind (optional)

## Repo layout

- `backend/` — Express server, routes, controllers, database utility
- `frontend/` — Vite React app (components, pages, API client)
- `backend/db_init` — SQL used to create tables and seed example data

## Prerequisites

- Node.js (LTS recommended)
- npm or pnpm
- PostgreSQL (local or remote)
- Git (To clone repo)

## Quick setup (macOS / zsh)

1. Clone the Repository
```bash
git clone hhttps://github.com/Engulfy/fullstack_app.git
cd fullstack_app
```

2. Install dependencies for both projects

```bash
# from repository root
cd backend
npm install

cd ../frontend
npm install
```

3. Configure environment variables

- Backend: create `backend/.env` (do NOT commit). Example values:

```env
# backend/.env (example)
PORT = 5001
DB_HOST = localhost
DB_PORT = 5432
DB_USER = your_db_user
DB_PASSWORD = your_db_password
DB_DATABASE = cafedb
```

- Frontend: create `frontend/.env.development` (or use the provided file). Example:

```env
VITE_API_URL=http://localhost:5001
```

4. Initialize the database (one-time)
Create a PostgreSQL database, e.g.:
```bash
CREATE DATABASE cafe_employee_db;
```
Run the SQL scripts in backend/db_init using your preferred PostgreSQL client (e.g., psql, PgAdmin, DBeaver). This will:
- Create the necessary tables (cafes and employees)
- Seed example data

5. Start the apps (in separate terminals)

```bash
# Backend (development)
cd backend
npm run dev

# Frontend (Vite)
cd frontend
npm run dev
# open http://localhost:5173 (Vite default)
```

Note: Default backend port used by this project is 5001 (check `backend/.env` or `backend/src/index.js`). The frontend reads `VITE_API_URL` to determine where to call the API.
