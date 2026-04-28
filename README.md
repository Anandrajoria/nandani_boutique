# Nandani Boutique Website

Frontend and backend source for the Nandani Boutique website.

## Tech stack

- React 18
- Vite
- Framer Motion
- Express 5
- MongoDB + Mongoose

## Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Optional frontend env:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_EMAIL=admin@nandani.local
```

## Backend

```bash
cd backend
npm install
copy .env.example .env
```

Set real secrets in `backend/.env`, then:

```bash
npm run seed
npm run dev
```

Runs on `http://localhost:3000`.

## GitHub safety

- keep real secrets only in `backend/.env`
- do not commit `dist/`, logs, or `backend/uploads/`
- use `.env.example` files as safe templates
- rotate `JWT_SECRET` and admin credentials before production deploys

