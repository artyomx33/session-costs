'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Session } from '@/lib/supabase'

interface SessionsTableProps {
  sessions: Session[]
}

const MODEL_COLORS: Record<string, string> = {
  'opus': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'sonnet': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'kimi': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'grok': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'grok-fast': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

function getModelBadgeClass(model: string): string {
  const lowerModel = model.toLowerCase()
  for (const [key, className] of Object.entries(MODEL_COLORS)) {
    if (lowerModel.includes(key)) return className
  }
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 font-medium">Date</TableHead>
                <TableHead className="text-slate-500 font-medium">Model</TableHead>
                <TableHead className="text-slate-500 font-medium text-right">Tokens</TableHead>
                <TableHead className="text-slate-500 font-medium text-right">Cost</TableHead>
                <TableHead className="text-slate-500 font-medium">Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-slate-300">{formatDate(session.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getModelBadgeClass(session.model)}>
                      {session.model}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-right">
                    {(session.tokens_in + session.tokens_out).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-200 font-medium text-right">
                    ${Number(session.cost_usd).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-400 max-w-[200px] truncate">
                    {session.label || '-'}
                  </TableCell>
                </TableRow>
              ))}
              
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No sessions yet. Add your first session to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
