# library-management-system

## Schema Decisions

Books reference genres through `genreId` instead of embedding genre details in
each book. A genre is shared by many books, so storing it once avoids duplicated
names and descriptions and keeps updates consistent. The foreign-key relation
also lets the database enforce that every book belongs to an existing genre.

## Prisma vs. Document Databases

What felt different is that Prisma models relationships explicitly through
foreign keys and relations between separate tables. In a document database, I
might instead embed a genre snapshot inside each book document; with Prisma, a
book references one shared genre record, so joins and referential integrity are
handled by the relational database.

## Database Setup

Copy `api/.env.example` to `api/.env`, set `DATABASE_URL` to your PostgreSQL
connection string, and set `JWT_SECRET` to a long, unique random value. For
Supabase, copy the PostgreSQL URI from the Dashboard's **Connect** panel;
`SUPABASE_URL` and `SUPABASE_ANON_KEY` are not database connection strings. Use
the direct connection or session pooler URI, not the transaction pooler URI,
for migrations.

The API provides public genre and book reads, genre CRUD, librarian-only book
writes, `/auth/register` and `/auth/login`, and a bearer-token-protected
`/users/profile` endpoint. Registration creates patron accounts and returns an
access token; provision librarian roles through trusted database administration.
Login is limited to five attempts per minute per client IP.

Install dependencies from the repository root and API folder, then generate the
client, create the schema, and load the sample data:

```bash
npm install
npm install --prefix api
npm run db:generate
npm run db:migrate
npm run db:seed
```

`db:migrate` safely applies checked-in migrations without resetting the
database. Use `npm run db:migrate:dev` only with a development database to
create new migrations.
