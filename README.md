# Notation — Next.js 16 + Prisma 7 + PostgreSQL

This version keeps the original Notation visual design and moves blog data, search, category filters, tag filters, sorting, and article lookup to PostgreSQL through Prisma 7.

## Requirements

- Node.js 20.9+
- PostgreSQL running locally
- A PostgreSQL database named `notation` (or change `DATABASE_URL`)

## 1. Install

```bash
npm install
```

## 2. Configure PostgreSQL

Copy `.env.example` to `.env` and set your local PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/next16_prisma_blog"
```

## 3. Create the database schema

For a new local database:

```bash
npx prisma migrate dev --name init
```

This creates the migration and database tables.

## 4. Generate Prisma Client

```bash
npm run prisma:generate
```

## 5. Seed the blog

```bash
npm run prisma:seed
```

Prisma 7 uses the seed command configured in `prisma.config.ts`.

## 6. Run

```bash
npm run dev
```

Open http://localhost:3000

## What is database-backed

- `/` loads published posts from PostgreSQL.
- Search uses PostgreSQL full-text search for title/excerpt/content and case-insensitive matching for author/category/tags.
- Category buttons come from the `Category` table.
- Tags come from the `Tag` table.
- Sorting is performed by Prisma/PostgreSQL.
- `/[slug]` loads the article by slug from PostgreSQL.
- The search dropdown also uses posts loaded from PostgreSQL.
- The original local `src/data/posts.ts` remains as seed data only.

## Resetting the local database

If you want to start over during development:

```bash
npx prisma migrate reset
npm run prisma:seed
```

## Useful commands

```bash
npm run dev
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```
