# Session Costs Dashboard

Track and visualize your AI session spending.

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run the SQL in `schema.sql` in your Supabase SQL editor.

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
vercel --prod
```
