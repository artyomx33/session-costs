import { supabase } from './supabase'

// Get today's total cost
export async function getDailyCost(date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('costs_sessions')
    .select('cost_usd')
    .eq('date', date)
  
  if (error) throw error
  
  const total = data?.reduce((sum, session) => sum + Number(session.cost_usd), 0) || 0
  return total
}

// Get spending trend for last N days
export async function getSpendingTrend(days: number = 7) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days + 1)
  
  const { data, error } = await supabase
    .from('costs_sessions')
    .select('date, cost_usd')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true })
  
  if (error) throw error
  
  // Group by date
  const grouped = data?.reduce((acc, session) => {
    const date = session.date
    if (!acc[date]) acc[date] = 0
    acc[date] += Number(session.cost_usd)
    return acc
  }, {} as Record<string, number>) || {}
  
  // Fill in missing dates with 0
  const result = []
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    result.push({
      date: dateStr,
      cost: grouped[dateStr] || 0,
      displayDate: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    })
  }
  
  return result
}

// Get model breakdown
export async function getModelBreakdown(days: number = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('costs_sessions')
    .select('model, cost_usd')
    .gte('date', startDate.toISOString().split('T')[0])
  
  if (error) throw error
  
  const grouped = data?.reduce((acc, session) => {
    if (!acc[session.model]) acc[session.model] = 0
    acc[session.model] += Number(session.cost_usd)
    return acc
  }, {} as Record<string, number>) || {}
  
  const total = Object.values(grouped).reduce((sum, cost) => sum + cost, 0)
  
  return Object.entries(grouped)
    .map(([model, cost]) => ({
      model,
      cost,
      percentage: total > 0 ? Math.round((cost / total) * 100) : 0
    }))
    .sort((a, b) => b.cost - a.cost)
}

// Get recent sessions
export async function getRecentSessions(limit: number = 20) {
  const { data, error } = await supabase
    .from('costs_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// Add new session
export async function addSession(session: {
  date: string
  model: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  label?: string
}) {
  const { data, error } = await supabase
    .from('costs_sessions')
    .insert([session])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get monthly total
export async function getMonthlyTotal(year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = month === 12 
    ? `${year + 1}-01-01` 
    : `${year}-${String(month + 1).padStart(2, '0')}-01`
  
  const { data, error } = await supabase
    .from('costs_sessions')
    .select('cost_usd')
    .gte('date', startDate)
    .lt('date', endDate)
  
  if (error) throw error
  
  return data?.reduce((sum, session) => sum + Number(session.cost_usd), 0) || 0
}

// Get settings
export async function getSettings() {
  const { data, error } = await supabase
    .from('costs_settings')
    .select('*')
    .single()
  
  if (error) throw error
  return data
}

// Update budget
export async function updateBudget(budget: number) {
  const { data, error } = await supabase
    .from('costs_settings')
    .update({ monthly_budget: budget, updated_at: new Date().toISOString() })
    .eq('id', (await getSettings()).id)
    .select()
    .single()
  
  if (error) throw error
  return data
}
