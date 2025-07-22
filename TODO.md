# Live-Vibe Coding — Snippet Manager Roadmap

> Goal: Build a realistic full-stack starter that can be extended live on-stream. Stack = React SPA (plain CSS), Express + Apollo GraphQL API, SQLite storage.

---

## 0. Tech Decisions (locked in) ✅

- **Package manager:** npm
- **Repo layout:** separate `client/` and `server/` directories
- **Language:** TypeScript on both front- and back-end
- **DB access:** raw SQL via `better-sqlite3` + `sql-template-tag`
- **Auth:** none (single-user mode)

---

## App Functional Specs 🎯

- The app manages reusable code snippets you can quickly copy into projects.
- CRUD operations: users can create, read, update, and delete snippets.
- Snippet model fields: `id`, `title`, `language`, `code`, `description`, `createdAt`, `updatedAt`.
- **List View**
  - Display snippets ordered by newest first.
  - Filter by `language`.
  - Full-text search across `title` and `code`.
- **Detail View**
  - Show formatted code with syntax highlighting (client-side only for now).
  - “Copy to clipboard” button.
  - Edit & Delete actions (confirm before delete).
- **Form View**
  - Shared create/edit form with client-side required-field validation.
- **GraphQL API**
  - `type Snippet { id: ID!, title: String!, language: String, code: String!, description: String, createdAt: String!, updatedAt: String! }`
  - `Query { snippets(search: String, language: String): [Snippet!]!, snippet(id: ID!): Snippet }`
  - `Mutation { createSnippet(input: CreateSnippetInput!): Snippet, updateSnippet(id: ID!, input: UpdateSnippetInput!): Snippet, deleteSnippet(id: ID!): Boolean }`
- Apollo Client handles optimistic UI updates & cache invalidation.
- Responsive layout: list compresses to a single column on mobile.

---

## 1. Repo Bootstrap

- [x] Initialise Git (already done) & set default branch `main`.
- [x] Add global `.gitignore` (node_modules, dist, etc.).
- [x] Add MIT `LICENSE` (already present).

---

## 2. Server – Express + Apollo + SQLite

1. **Scaffold**
   - [x] `mkdir server && cd server && npm init -y`
   - [x] Install deps: `express`, `@apollo/server` (+ `@as-integrations/express5`), `graphql`, `cors`, `dotenv`, `better-sqlite3`, `sql-template-tag`.
   - [x] Dev deps: `typescript`, `ts-node-dev`, `@types/express`, `@types/node`, `@types/cors`.
2. **Database**
   - [x] Create SQLite file (`db.sqlite`) in `server/data`.
   - [x] Define `snippets` table: `id`, `title`, `code`, `language`, `description`, `createdAt`, `updatedAt`.
   - [x] Provide seed script with a few sample snippets.
3. **Apollo Setup**
   - [x] Define GraphQL schema (SDL) for `Snippet` type + `Query`/`Mutation` CRUD.
   - [x] Implement resolvers using DB helper functions.
   - [x] Mount Apollo middleware at `/graphql` on Express.
4. **Dev UX**
   - [x] Add `ts-node-dev` watch script for hot-reload.
   - [x] Add HTTP logging (morgan) & basic error handler.

---

## 3. Client – React SPA

1. **Scaffold**
   - [x] `mkdir client && cd client && npm create vite@latest -- --template react-ts`.
   - [x] Install deps: `@apollo/client`, `graphql`, `cross-env`, `react-router-dom`.
2. **App Skeleton**
   - [x] Global ApolloProvider pointing to `/graphql`.
   - [x] Pages/components: `SnippetList`, `SnippetForm`, `SnippetDetail`.
   - [x] Routing via React Router with Layout component.
   - [x] Plain CSS: create `src/styles/` with global + component styles.
3. **Queries & Mutations**
   - [x] Fetch list of snippets with search/filter functionality.
   - [x] Create new snippet with form validation.
   - [x] Update & delete snippet with cache updates.
4. **Dev UX**
   - [x] Configure proxy so Vite dev server forwards `/graphql` to Express to avoid CORS.

---

## 4. Scripts & Tooling ✅

- [x] Root `package.json` with workspaces + scripts:
  - `dev`: concurrently run client & server watchers.
  - `build`: build React & (optionally) bundle server.
  - `start`: start server in prod + serve static build.
- [x] ESLint + Prettier base configs.
- [x] Husky + lint-staged (optional).

---

## 5. Documentation

- [ ] Update `README.md` with stack, setup instructions, and contribution guide.
- [ ] Add ER diagram / schema diagram if helpful.

---

## 6. Nice-to-Have (post-MVP)

- [ ] Syntax highlighting in code snippets (PrismJS).
- [ ] Tagging / search.
- [ ] Authentication.
- [ ] Dark mode toggle.
- [ ] Deploy scripts (Railway / Render / Vercel + Fly.io sidecar).

---

Ready to start scaffolding! 🚀
