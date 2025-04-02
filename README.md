# Myanmar Aid Platform

## Setup Guide

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then update the `.env` file with your configuration.

3. Generate Prisma client:
   ```bash
   pnpm prisma generate
   ```

4. Apply database migrations:
   ```bash
   pnpm migrate apply
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```


## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite database at the edge
- [Better Auth](https://www.better-auth.com/) - Authentication solution
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable UI components


## Deployment

This project is deployed on Cloudflare Pages with D1 database.
