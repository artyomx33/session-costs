'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp } from 'lucide-react'

interface BudgetProgressProps {
  currentSpend: number
  budget: number
}

export function BudgetProgress({ currentSpend, budget }: BudgetProgressProps) {
  const percentage = Math.min((currentSpend / budget) * 100, 100)
  const remaining = Math.max(budget - currentSpend, 0)
  
  let progressColor = 'bg-emerald-500'
  if (percentage > 75) progressColor = 'bg-amber-500'
  if (percentage >= 100) progressColor = 'bg-rose-500'
  
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          Monthly Budget
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-cyan-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-100">
              ${currentSpend.toFixed(2)}
            </span>
            <span className="text-sm text-slate-400">
              of ${budget.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-2 bg-slate-800"
            
            />
            <div className="flex justify-between text-xs">
              <span className={`font-medium ${
                percentage >= 100 ? 'text-rose-400' : 
                percentage > 75 ? 'text-amber-400' : 
                'text-emerald-400'
              }`}>
                {percentage.toFixed(0)}% used
              </span>
              <span className="text-slate-500">
                ${remaining.toFixed(2)} remaining
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
