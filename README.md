# Blog Tech — Next.js 16 + Tailwind 4 + Prisma 7 + PostgreSQL + Markdown

Blog Tech are fullstack application in NextJS 16 App Router and contains blog data (markdown), search, category filters, tag filters, sorting, and article lookup to PostgreSQL through Prisma 7.
For Full text Search I have used the PostgreSQL database with Prisma 7 with the fullTextSearchPostgres preview feature, instead of Virutal Tables. Because this is just a small blog application.
In a real world application with thousand of blog posts, I would have used Virutal Tables.
The blog is styles with Tailwind 4.

![img.png](img.png)

## Requirements

- Node.js 20.9+
- NextJS 16 App Router
- PostgreSQL running locally
- Prisma 7 with PostgreSQL adapter and fullTextSearchPostgres preview feature.
- A PostgreSQL database named `next16_prisma_blog` (or change `DATABASE_URL`)

## Sample Data
Are located in `/src/data/posts.ts` and the content is in Markdown format. 
This sample data needs to be seeded to the PostgreSQL database before running the application.

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
