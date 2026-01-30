'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface DailyCostCardProps {
  todayCost: number
  yesterdayCost: number
}

export function DailyCostCard({ todayCost, yesterdayCost }: DailyCostCardProps) {
  const difference = todayCost - yesterdayCost
  const percentChange = yesterdayCost > 0 
    ? Math.round((difference / yesterdayCost) * 100) 
    : 0
  const isIncrease = difference > 0
  
  // Generate sparkline data (simulate last 7 days ending with yesterday)
  const sparklineData = Array.from({ length: 6 }, () => Math.random() * yesterdayCost * 1.5)
  sparklineData.push(yesterdayCost)
  
  const maxVal = Math.max(...sparklineData, 0.01)
  const minVal = Math.min(...sparklineData, 0)
  const range = maxVal - minVal || 1
  
  const points = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * 100
    const y = 100 - ((val - minVal) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')
  
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          Today&apos;s Spend
        </CardTitle>
        <DollarSign className="h-4 w-4 text-cyan-400" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-slate-100">
            ${todayCost.toFixed(2)}
          </span>
          {percentChange !== 0 && (
            <span className={`flex items-center text-sm ${isIncrease ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isIncrease ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(percentChange)}%
            </span>
          )}
        </div>
        <div className="mt-4 h-12">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cyan-400/50"
              points={points}
            />
            <circle
              cx="100"
              cy={100 - ((yesterdayCost - minVal) / range) * 80 - 10}
              r="3"
              className="fill-cyan-400"
            />
          </svg>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          vs ${yesterdayCost.toFixed(2)} yesterday
        </p>
      </CardContent>
    </Card>
  )
}
