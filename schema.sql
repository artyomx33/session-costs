-- Database schema for Session Costs Dashboard
-- Supabase Project: tgqitfxzwrstxxgarerx

-- Sessions table
CREATE TABLE IF NOT EXISTS costs_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  date date NOT NULL,
  model text NOT NULL,
  tokens_in integer DEFAULT 0,
  tokens_out integer DEFAULT 0,
  cost_usd decimal(10, 4) NOT NULL,
  label text,
  session_id text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_costs_sessions_date ON costs_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_costs_sessions_model ON costs_sessions(model);
CREATE INDEX IF NOT EXISTS idx_costs_sessions_created ON costs_sessions(created_at DESC);

-- Settings table
CREATE TABLE IF NOT EXISTS costs_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  monthly_budget decimal(10, 2) DEFAULT 100.00,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO costs_settings (monthly_budget) 
VALUES (100.00)
ON CONFLICT DO NOTHING;
