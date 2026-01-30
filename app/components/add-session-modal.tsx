'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { addSession } from '@/lib/queries'

const MODELS = [
  { value: 'opus', label: 'Opus (Claude)' },
  { value: 'sonnet', label: 'Sonnet (Claude)' },
  { value: 'kimi', label: 'Kimi' },
  { value: 'grok', label: 'Grok' },
  { value: 'grok-fast', label: 'Grok Fast' },
]

interface AddSessionModalProps {
  onSessionAdded: () => void
}

export function AddSessionModal({ onSessionAdded }: AddSessionModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    model: '',
    tokens_in: '',
    tokens_out: '',
    cost_usd: '',
    label: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await addSession({
        date: formData.date,
        model: formData.model,
        tokens_in: parseInt(formData.tokens_in) || 0,
        tokens_out: parseInt(formData.tokens_out) || 0,
        cost_usd: parseFloat(formData.cost_usd) || 0,
        label: formData.label || undefined,
      })
      
      setOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        model: '',
        tokens_in: '',
        tokens_out: '',
        cost_usd: '',
        label: '',
      })
      onSessionAdded()
    } catch (error) {
      console.error('Failed to add session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
          <DialogDescription className="text-slate-400">
            Log a new AI session with cost details.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-300">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 focus:border-cyan-500/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model" className="text-slate-300">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {MODELS.map((model) => (
                    <SelectItem 
                      key={model.value} 
                      value={model.value}
                      className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
                    >
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tokens_in" className="text-slate-300">Tokens In</Label>
              <Input
                id="tokens_in"
                type="number"
                min="0"
                placeholder="0"
                value={formData.tokens_in}
                onChange={(e) => setFormData({ ...formData, tokens_in: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 focus:border-cyan-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokens_out" className="text-slate-300">Tokens Out</Label>
              <Input
                id="tokens_out"
                type="number"
                min="0"
                placeholder="0"
                value={formData.tokens_out}
                onChange={(e) => setFormData({ ...formData, tokens_out: e.target.value })}
                className="bg-slate-950 border-slate-800 text-slate-100 focus:border-cyan-500/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost_usd" className="text-slate-300">Cost (USD)</Label>
            <Input
              id="cost_usd"
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.00"
              value={formData.cost_usd}
              onChange={(e) => setFormData({ ...formData, cost_usd: e.target.value })}
              className="bg-slate-950 border-slate-800 text-slate-100 focus:border-cyan-500/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="label" className="text-slate-300">Label (optional)</Label>
            <Input
              id="label"
              placeholder="e.g., Code review, Chat, etc."
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="bg-slate-950 border-slate-800 text-slate-100 focus:border-cyan-500/50"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.model || !formData.cost_usd}
              className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
            >
              {loading ? 'Adding...' : 'Add Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
