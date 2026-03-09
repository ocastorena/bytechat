# ByteChat

A minimalistic social feed app with a cyberpunk theme. Share posts, browse a real-time feed, and discover other users.

## Tech Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth.js v5** (Credentials + JWT)
- **Tailwind CSS** + **Shadcn/ui**
- **SWR** (infinite scroll) + **React Hook Form** + **Zod**
- **Jest** + **React Testing Library**

## Prerequisites

- Node.js 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Getting Started

1. **Clone and install**

   ```bash
   git clone https://github.com/yourusername/bytechat.git
   cd bytechat
   npm install
   ```

2. **Set up environment**

   ```bash
   cp .env.example .env
   ```

   Add a `NEXTAUTH_SECRET` to `.env` (the rest works out of the box):

   ```bash
   openssl rand -base64 32
   ```

3. **Start developing**

   ```bash
   npm run dev
   ```

   This single command starts the PostgreSQL Docker container, pushes the database schema, and launches the Next.js dev server on [http://localhost:3000](http://localhost:3000).

4. **Seed the database** (first time only)

   ```bash
   npm run db:seed
   ```

   This creates a dev account and 70 sample posts with images.

   **Dev login:** `dev@bytechat.io` / `password`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Docker DB + push schema + launch dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Deploy migrations (CI/production) |
| `npm run db:seed` | Seed database with sample data |

## Project Structure

```
src/
├── app/
│   ├── (protected)/        # Auth-required routes (home, profile)
│   ├── api/                # API routes (posts, signup, auth)
│   ├── login/              # Login page
│   └── signup/             # Signup page
├── components/
│   ├── ui/                 # Shadcn/ui primitives
│   ├── feed.tsx            # Infinite scroll feed
│   ├── post-card.tsx       # Single post card
│   ├── trending-sidebar.tsx
│   └── suggested-users-sidebar.tsx
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma client
│   ├── validations.ts      # Zod schemas
│   ├── password.ts         # Hashing utilities
│   └── utils.ts            # Helpers (cn, formatDate, getInitials)
├── types/                  # Shared TypeScript types
└── middleware.ts            # Route protection

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed script
```

## Deployment

The project includes a `Dockerfile` and `docker-compose.yml`. For production, deploy to [Railway](https://railway.app) with a PostgreSQL service. Required env vars:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — random secret (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — your production URL

## License

MIT
