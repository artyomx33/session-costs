'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface ModelBreakdownProps {
  data: Array<{
    model: string
    cost: number
    percentage: number
  }>
}

const MODEL_COLORS: Record<string, string> = {
  'opus': '#a855f7',      // purple-500
  'sonnet': '#3b82f6',    // blue-500
  'kimi': '#10b981',      // emerald-500
  'grok': '#f97316',      // orange-500
  'grok-fast': '#f59e0b', // amber-500
  'default': '#64748b',   // slate-500
}

function getModelColor(model: string): string {
  const lowerModel = model.toLowerCase()
  for (const [key, color] of Object.entries(MODEL_COLORS)) {
    if (lowerModel.includes(key)) return color
  }
  return MODEL_COLORS.default
}

export function ModelBreakdown({ data }: ModelBreakdownProps) {
  const chartData = data.map(item => ({
    ...item,
    color: getModelColor(item.model)
  }))
  
  const total = data.reduce((sum, item) => sum + item.cost, 0)
  
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">
          By Model
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="cost"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-slate-200 text-sm font-medium">{data.model}</p>
                          <p className="text-slate-400 text-xs">${data.cost.toFixed(2)} ({data.percentage}%)</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full mt-4 space-y-2">
            {chartData.map((item) => (
              <div key={item.model} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 capitalize">{item.model}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{item.percentage}%</span>
                  <span className="text-slate-200 font-medium w-16 text-right">${item.cost.toFixed(2)}</span>
                </div>
              </div>
            ))}
            
            {chartData.length === 0 && (
              <p className="text-slate-500 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
