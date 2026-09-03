'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Pencil } from 'lucide-react'

export function BudgetCard({ user, transactions, dict }: { user: any, transactions: any[], dict: Dictionary }) {
  const [budget, setBudget] = useState<number>(user?.user_metadata?.monthly_budget || 0)
  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(budget.toString())
  const [isSaving, setIsSaving] = useState(false)

  // Calculate current month's expense
  const now = new Date()
  const currentMonthStr = now.toISOString().substring(0, 7)
  const monthExpenses = transactions
    .filter(tx => tx.type === 'expense' && tx.date.startsWith(currentMonthStr))
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    const supabase = createClient()
    const parsedBudget = parseFloat(newBudget) || 0
    
    await supabase.auth.updateUser({
      data: { monthly_budget: parsedBudget }
    })
    
    setBudget(parsedBudget)
    setIsSaving(false)
    setIsEditing(false)
  }

  const percent = budget > 0 ? Math.min(100, (monthExpenses / budget) * 100) : 0
  const isOverBudget = budget > 0 && monthExpenses > budget
  const isNearBudget = budget > 0 && percent >= 85 && !isOverBudget

  const progressColor = isOverBudget 
    ? 'bg-rose-500' 
    : isNearBudget 
      ? 'bg-amber-500' 
      : 'bg-emerald-500'

  if (!user) return null // Hide budget if not logged in

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm w-full">
      <CardHeader className="px-0 md:px-6 pt-4 md:pt-6 flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm md:text-base font-medium">{dict.dashboard.budgetTitle || 'Monthly Budget'}</CardTitle>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger render={
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{dict.dashboard.setBudget || 'Set Monthly Budget'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input 
                  type="number" 
                  value={newBudget} 
                  onChange={(e) => setNewBudget(e.target.value)} 
                  placeholder="10000"
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="px-0 md:px-6 pb-6">
        {budget === 0 ? (
          <div className="text-sm text-muted-foreground">
            {dict.dashboard.noBudget || 'No budget set. Click the edit icon to set one.'}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                ฿{monthExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ฿{budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className={`font-medium ${isOverBudget ? 'text-rose-500' : isNearBudget ? 'text-amber-500' : 'text-emerald-500'}`}>
                {percent.toFixed(0)}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            {isOverBudget && (
              <p className="text-xs text-rose-500 font-medium">
                {dict.dashboard.overBudget || 'You have exceeded your monthly budget!'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
