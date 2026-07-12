# 👗 Clothing Wishlist

An aesthetic, smart clothing wishlist app built with:

- **Next.js 15** (App Router)
- **Supabase** (Auth + Postgres + RLS)
- **Tailwind CSS**
- **dnd-kit** (drag-and-drop Kanban)

## Features

- 🖼️ **Gallery view** — masonry grid with hover quick-actions
- 📌 **Board view** — drag-and-drop Kanban by status
- 📄 **List view** — inline-editable table
- 🔗 **URL extraction** — paste any product URL to auto-fill title, image, price
- 🔐 **Google OAuth** via Supabase
- 🛡️ **Row Level Security** — every query scoped to the authenticated user

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
4. Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor
5. Enable Google Auth in Supabase → Authentication → Providers
6. `npm run dev`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Cinnameldehyde/clothing-wishlist)

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables.
