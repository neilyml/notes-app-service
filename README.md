# Secure Notes API

## Project Description

A secure REST API for a note-taking application with JWT authentication, role-based authorization, notes, users, public posts, and MongoDB aggregations.

## Tech Stack

Node.js | TypeScript | Express | MongoDB | Mongoose | Zod | bcrypt | JWT | Vitest | Supertest | MongoDB Memory Server

## Local Setup

```bash
npm install
cp .env.example .env
```

Populate the required `MONGODB_URI` and `JWT_SECRET` values in `.env`, then start the development server:

```bash
npm run dev
```

Useful development commands:

```bash
npm test
npm run typecheck
npm run openapi:generate
```

## OpenAPI Specification

`openapi.json` contains the generated REST API specification. Regenerate it manually with:

```bash
npm run openapi:generate
```

The Husky pre-commit hook automatically regenerates and stages `openapi.json`.

## MongoDB Indexes

`User: { email: 1 } — unique`

Enforces unique email addresses and supports registration, login, and email-ordered user queries.

`Note: { userId: 1, createdAt: -1, _id: -1 }`

Supports listing a user's notes in deterministic newest-first order.

`Note: { createdAt: -1, _id: -1 }`

Supports the admin view of all notes in deterministic newest-first order.

`Post: { userId: 1, createdAt: -1, _id: -1 }`

Supports retrieving a user's posts through the `$lookup` aggregation in deterministic newest-first order.

`Post: { createdAt: -1, _id: -1 }`

Supports the public posts list in deterministic newest-first order.
