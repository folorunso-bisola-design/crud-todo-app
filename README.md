# CRUD Todo App (Next.js + Prisma + MongoDB + Better Auth)

A full‑stack Todo/Notes application built with Next.js App Router, Prisma ORM, MongoDB (Atlas or local), Tailwind CSS, and Better Auth for email/password authentication. It features optimistic UI updates, toast notifications, and a simple API layer.

## Features

- Email/password auth via Better Auth (sessions, sign in/up, sign out)
- Notes/Todos CRUD backed by MongoDB via Prisma
- Optimistic toggle for completed state with graceful revert on failure
- Toast notifications for create/update/delete
- Tailwind CSS styling and lightweight UI components
- TypeScript types for Notes/Todos

## Tech stack

- Next.js 15 (App Router) and React 19
- Prisma 6 with MongoDB provider
- Better Auth with Prisma adapter
- Tailwind CSS v4
- Sonner (toasts)
- Zustand (local state util)

## Project structure

```text
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
README.md
tsconfig.json
app/
	globals.css
	layout.tsx
	page.tsx
	api/
		auth/[...all]/route.tsx     # Better Auth HTTP handler
		user/route.tsx              # GET user by email (+notes)
		note/route.tsx              # GET/POST notes by userId
		note/[slug]/route.tsx       # GET/PATCH/DELETE note by noteId
components/
	add-todo-form.tsx
	note-item.tsx
	todo-stats.tsx
lib/
	auth.tsx                      # Better Auth server config (Prisma adapter)
	auth-client.tsx               # Better Auth client (React)
	todo-store.ts                 # Zustand local store
prisma/
	schema.prisma                 # Prisma schema (MongoDB)
public/
types/
	todo.ts                       # Todo/Note types
```

Note: Prisma Client is generated to `./generated/prisma` (see `generator client.output` in `prisma/schema.prisma`). Import it as:

```ts
import { PrismaClient } from "@/generated/prisma";
```

## Prerequisites

- Node.js 18.17+ (Node 20 recommended)
- A MongoDB connection string (Atlas or local)

## Environment variables

Create a `.env` file at the project root. You can copy `.env.example`:

```bash
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority&appName=<appName>"
BETTER_AUTH_SECRET="<random-64-hex>"
BETTER_AUTH_URL="http://localhost:3000"        # Server base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"    # Client base URL (browser)
```

Generate a strong secret on Windows (cmd):

```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

In production, set both `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your public domain, e.g. `https://your-domain.com`.

## Database setup (MongoDB Atlas)

- Ensure your IP is allowed in Atlas (Network Access > Add IP Address)
- Verify username, password, and database name in `DATABASE_URL`
- If you change the Prisma schema, run the Prisma steps below

## Install, generate, and run locally

```cmd
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

## Authentication

Server config: `lib/auth.tsx` uses Better Auth with the Prisma adapter and the generated Prisma client. The HTTP handler is exposed from `app/api/auth/[...all]/route.tsx`.

Client usage: `lib/auth-client.tsx` creates a client with Better Auth React. Use the hook and helpers in components:

```tsx
import { authClient } from "@/lib/auth-client";

// Session in a client component
const { data: session, isPending, error } = authClient.useSession();

// Sign in / Sign up / Sign out (see actions/auth.js)
```

By default, sign-in/out are implemented in `actions/auth.js` and used from the UI (e.g., the Sign Out button on the home page).

## Notes/Todos API

All routes are implemented with the Next.js App Router API handlers and use the generated Prisma client.

- GET `/api/user?email=<email>` → Fetch a user and their notes
- GET `/api/note?userId=<userId>` → Fetch notes for a user
- POST `/api/note?userId=<userId>` → Create note; JSON body `{ content: string }`
- GET `/api/note/[id]?noteId=<id>` → Fetch a single note
- PATCH `/api/note/[id]?noteId=<id>` → Update note; JSON body `{ content?: string, completed?: boolean }`
- DELETE `/api/note/[id]?noteId=<id>` → Delete note

Model shape (see `prisma/schema.prisma`):

```prisma
model Note {
	id        String   @id @default(cuid()) @map("_id")
	title     String
	content   String
	completed Boolean  @default(false)
	status    String   @default("active")
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	userId    String
	user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Frontend behavior

- The home page (`app/page.tsx`) loads the session and redirects unauthenticated users to `/signin`
- `AddTodoForm` posts new notes to `/api/note?userId=...` and refreshes the list
- `NoteItem` supports edit, delete, and an optimistic completed toggle
- `TodoStats` summarizes the current list

## Common tasks

- Edit schema and regenerate client:

```cmd
npx prisma generate
npx prisma db push
```

- Lint:

```cmd
npm run lint
```

- Build and start:

```cmd
npm run build
npm start
```

## Troubleshooting

- Prisma Client not found or type errors
	- Ensure `npx prisma generate` ran successfully; imports use `@/generated/prisma`
- MongoDB connection issues (server selection, TLS, auth)
	- Allow your IP in Atlas; verify credentials and cluster SRV string
- 405 on hitting auth endpoints in the browser
	- Auth routes are primarily POST; use the UI or client helpers
- PowerShell/OneDrive issues on Windows
	- Use `cmd.exe` for Node/Prisma commands; pause OneDrive syncing if files are locked

## Deployment notes

- Set environment variables in your hosting provider:
	- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`
- Ensure `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` point to your production domain
- Run Prisma generate during build, and ensure the app has network access to MongoDB

## License

Add your preferred license (e.g., MIT) in a `LICENSE` file.

