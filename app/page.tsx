import { 
  getDailyCost, 
  getSpendingTrend, 
  getModelBreakdown, 
  getRecentSessions,
  getMonthlyTotal,
  getSettings
} from '@/lib/queries'
import { DailyCostCard } from './components/daily-cost-card'
import { SpendingChart } from './components/spending-chart'
import { ModelBreakdown } from './components/model-breakdown'
import { SessionsTable } from './components/sessions-table'
import { BudgetProgress } from './components/budget-progress'
import { AddSessionModal } from './components/add-session-modal'
import { DollarSign, BarChart3, PieChart, List } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  
  const [
    todayCost,
    yesterdayCost,
    spendingTrend,
    modelBreakdown,
    recentSessions,
    monthlyTotal,
    settings
  ] = await Promise.all([
    getDailyCost(today),
    getDailyCost(yesterday),
    getSpendingTrend(7),
    getModelBreakdown(30),
    getRecentSessions(10),
    getMonthlyTotal(),
    getSettings()
  ])
  
  return {
    todayCost,
    yesterdayCost,
    spendingTrend,
    modelBreakdown,
    recentSessions,
    monthlyTotal,
    budget: settings?.monthly_budget || 100
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-cyan-400" />
              Session Costs
            </h1>
            <p className="text-slate-400 mt-1">Track and visualize your AI spending</p>
          </div>
          <AddSessionModal onSessionAdded={() => {}} />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DailyCostCard 
            todayCost={data.todayCost} 
            yesterdayCost={data.yesterdayCost} 
          />
          <BudgetProgress 
            currentSpend={data.monthlyTotal} 
            budget={data.budget} 
          />
          
          <div className="bg-slate-900/50 border border-slate-800 backdrop-blur rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-400">7-Day Total</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">
              ${data.spendingTrend.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 backdrop-blur rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <List className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-400">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {data.recentSessions.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">Last 10 shown</div>
          </div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingChart data={data.spendingTrend} />
          <ModelBreakdown data={data.modelBreakdown} />
        </div>
        
        {/* Sessions Table */}
        <SessionsTable sessions={data.recentSessions} />
        
        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Session Costs Dashboard • Built with Next.js + Supabase</p>
        </footer>
      </div>
    </div>
  )
}
