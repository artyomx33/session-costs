'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SpendingChartProps {
  data: Array<{
    date: string
    cost: number
    displayDate: string
  }>
}

export function SpendingChart({ data }: SpendingChartProps) {
  const maxCost = Math.max(...data.map(d => d.cost), 0.01)
  
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">
          7-Day Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-slate-200 text-sm">{payload[0].payload.displayDate}</p>
                        <p className="text-cyan-400 font-semibold">${Number(payload[0].value).toFixed(2)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.cost === maxCost ? '#22d3ee' : '#0e7490'}
                    className="hover:fill-cyan-400 transition-colors"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
