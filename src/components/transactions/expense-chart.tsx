'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ExpenseChart({ transactions, dict }: { transactions: any[], dict: Dictionary }) {
  const [view, setView] = useState<'expense' | 'income'>('expense')

  const getCategoryLabel = (type: string, key: string) => {
    const lowerKey = key ? key.toLowerCase() : ''
    if (type === 'expense') return (dict.transaction.categories.expense as any)[lowerKey] || key
    if (type === 'income') return (dict.transaction.categories.income as any)[lowerKey] || key
    if (type === 'saving') return (dict.transaction.categories.saving as any)[lowerKey] || key
    return key
  }

  // Aggregate data based on current view
  const filteredTxs = transactions.filter(tx => tx.type === view)
  
  const aggregated = filteredTxs.reduce((acc, tx) => {
    const label = getCategoryLabel(tx.type, tx.category)
    if (!acc[label]) acc[label] = 0
    acc[label] += Number(tx.amount)
    return acc
  }, {} as Record<string, number>)

  const data = Object.keys(aggregated)
    .map(key => ({ name: key, value: aggregated[key] }))
    .sort((a, b) => b.value - a.value)

  // Modern Chart Colors
  const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#10b981', '#64748b']

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm w-full h-full flex flex-col">
      <CardHeader className="px-0 md:px-6 pt-4 md:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <CardTitle className="text-sm md:text-base font-medium">{dict.dashboard.analytics || 'Analytics'}</CardTitle>
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">{dict.transaction.expense}</TabsTrigger>
            <TabsTrigger value="income">{dict.transaction.income}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-0 md:px-6 pb-6 flex-1">
        {data.length === 0 ? (
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/20">
            {dict.transaction.empty}
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `฿${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
