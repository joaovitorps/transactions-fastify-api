# Fastify Transactions API

Simple REST API for managing financial transactions, built during the Rocketseat Node.js course using Fastify, Knex and SQLite.

## Features (RF – What the user can do)

- [x] User must be able to create a new transaction
- [x] User must be able to get a summary of their account
- [x] User must be able to list all transactions that have occurred
- [x] User must be able to view a single transaction

## Business Rules (RN)

- [x] Transaction can be of type **credit** (adds to the total) or **debit** (subtracts from the total)
- [x] It must be possible to identify users between requests
- [x] User can only view transactions that they created

## Tech Stack

- **Runtime**: Node.js - https://nodejs.org/
- **Framework**: Fastify - https://fastify.dev/
- **Database**: SQLite (dev) PostgreSQL (prod) (via Knex) - https://knexjs.org/
- **Language**: TypeScript - https://www.typescriptlang.org/
- **Validation**: Zod - https://zod.dev/
- **Environment**: dotenv - https://www.npmjs.com/package/dotenv
- **Test**: Vitest (with `supertest` for mock requests) - https://vitest.dev/ (https://www.npmjs.com/package/supertest)
- **Build**: tsup - https://tsup.egoist.dev/

## Getting Started

- **Install dependencies**

```bash
npm install
```

- **Configure environment**

Create a `.env` file (see `.env.example`). You can set custom values for: `DATABASE_URL` and `PORT`

- **Run database migrations**

```bash
npm run knex -- migrate:latest
```

- **Start the dev server** (by default at port 8000)

```bash
npm run dev
```

The API will be available on the port configured in `src/environment.ts`.

## Build & Production

- **Build the project with tsup**

```bash
npm run build
```

This will generate compiled `minified` JavaScript in the `dist` directory configured in `package.json`.

- **Start the built app (example)**

```bash
node dist/server.js
```

## Useful Endpoints

All routes are prefixed with `/transactions` (see `src/server.ts`).

- **Create transaction**
  - `POST /transactions`
  - Body:

```json
{
  "title": "Salary",
  "amount": 5000,
  "type": "credit"
}
```

- **List all transactions**
  - `GET /transactions`

- **Get single transaction**
  - `GET /transactions/:id`

- **Get summary**
  - `GET /transactions/summary`

- **Run migrations**
  - `POST /transactions/migrations`

Some endpoints rely on a `sessionId` cookie to associate transactions with a user/session. The cookie is created automatically on the first `POST /transactions` request.
