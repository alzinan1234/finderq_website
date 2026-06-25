# FinderQ - Next.js 15 + Tailwind CSS v4 + GSAP + Framer Motion

## Setup

```bash
npm install
npm run dev
```

## Environment Variables
Copy `.env.local` and fill in your keys:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key  
- `NEXT_PUBLIC_RIOT_API_KEY` - Your Riot Games API key (free at developer.riotgames.com)

## Test Accounts (all pre-seeded)

| Username | Email | Password | Role |
|---|---|---|---|
| AdminUser | admin@finderq.gg | admin123 | Admin |
| ModUser | mod@finderq.gg | mod123 | Moderator |
| evt | evt@finderq.gg | evt123 | Owner |
| evx | evx@finderq.gg | evx123 | Owner |

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** (animations, page transitions)
- **GSAP** (hero animations)
- **Zustand** (global state)
- **Supabase** (backend / auth ready)
- **shadcn/ui** (48 UI components)
- **Sonner** (toasts)
- **TypeScript**
