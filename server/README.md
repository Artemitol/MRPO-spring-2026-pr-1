# Server (Express + TypeScript)

## Start

1. Copy `.env.example` to `.env`
2. Start PostgreSQL from the project root:

```bash
docker compose up -d
```

1. Apply SQL scripts in order:
   - `sql/01_schema.sql`
   - `sql/02_seed.sql`
2. Install and run:

```bash
npm install
npm run dev
```

## Test users

Password for all test users: `123456`

- client / 123456
- manager / 123456
- admin / 123456

## Scripts

- `npm run dev` - start dev server
- `npm run build` - compile TypeScript
- `npm run start` - run compiled server
- `npm run lint` - run ESLint
- `npm run db:seed` - apply schema and seed SQL from code
- `npm run db:reset-seed` - reset schema, then apply schema and seed SQL
