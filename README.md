# SEA Catering

SEA Catering is a web application for a catering business. Submitted for [COMPFEST 17 Software Engineering Academy](https://compfest.id/academy/sea). Built with Next.js.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ausathdzil/sea-catering.git
cd sea-catering
```

### 2. Install dependencies

```bash
pnpm install
# or
yarn install
# or
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
BETTER_AUTH_SECRET=<random generated string e.g. o2jxuS8laaDHheiEDXFLLSnBfnCFj8e1>
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run database migrations

```bash
npx drizzle-kit push
```

### 5. Start the development server

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

| Name               | Description                      | Example Value                                  |
|--------------------|----------------------------------|------------------------------------------------|
| DATABASE_URL       | PostgreSQL connection string     | postgres://user:password@localhost:5432/db     |
| BETTER_AUTH_SECRET | Random generated string          | o2jxuS8laaDHheiEDXFLLSnBfnCFj8e1               |
| BETTER_AUTH_URL    | Base URL for Better Auth service | [http://localhost:3000](http://localhost:3000) |

1. Database URL: create a new database with [Neon](https://neon.new)
2. Generate a random string with this command: `openssl rand -base64 32`, or go to [Better-Auth](https://www.better-auth.com/docs/installation#:~:text=BETTER_AUTH_SECRET%3D-,Generate%20Secret,-Set%20Base%20URL) installation docs
3. Base URL of your app

## Creating an Admin Account

1. **Register a new user** via the sign up page
2. Update the user's role in Neon database dashboard to 'admin'
3. Or in the SQL editor: `UPDATE "user" SET "role" = 'admin' WHERE "email" = '<your-admin-email>';`

Alternative method:

1. **Register a new user** via the sign up page
2. Sign out
3. Sign in as an existing admin
4. Go to the dashboard's Users section, and change the user's role to "admin" using the UI

## Tech Stack

- [Next.js](https://github.com/vercel/next.js) – React framework for server-side rendering and fullstack apps
- [React](https://github.com/facebook/react) – UI library
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) – Utility-first CSS framework
- [TypeScript](https://github.com/microsoft/typescript) – Static typing for JavaScript
- [shadcn/ui](https://github.com/shadcn/ui) – Accessible UI components
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) – Type-safe ORM for SQL databases
- [Neon](https://github.com/neondatabase/neon) – Serverless Postgres database
- [Better Auth](https://github.com/better-auth/better-auth) – Authentication solution
- [Zod](https://github.com/colinhacks/zod) – TypeScript-first schema validation
