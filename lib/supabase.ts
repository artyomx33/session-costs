import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Session {
  id: string
  created_at: string
  date: string
  model: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  label: string | null
  session_id: string | null
}

export interface Settings {
  id: string
  monthly_budget: number
  created_at: string
  updated_at: string
}
