# Nandani Boutique Backend

Express + MongoDB API for the Nandani Boutique website.

## Setup

```bash
cd backend
npm install
copy .env.example .env
```

Fill in real values in `backend/.env`.

## Example env

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/nandani_boutique_dev
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@nandani.local
ADMIN_PASSWORD=replace-with-a-strong-password
TRUST_PROXY=0
CORS_ORIGIN=http://localhost:5173
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=8
PUBLIC_RATE_LIMIT_WINDOW_MS=900000
PUBLIC_RATE_LIMIT_MAX=10
UPLOAD_RATE_LIMIT_WINDOW_MS=600000
UPLOAD_RATE_LIMIT_MAX=20
```

## Run

Start MongoDB, then:

```bash
npm run seed
npm run dev
```

Health check:

- `GET http://localhost:3000/api/health`

## Security

- never commit `backend/.env`
- use a strong `JWT_SECRET`
- use a strong admin password
- only set `TRUST_PROXY` when you are actually behind a trusted reverse proxy
- keep `CORS_ORIGIN` restricted to your frontend
