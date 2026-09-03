'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DashboardSummary({ dict, user, transactions }: { dict: Dictionary, user: any, transactions: any[] }) {
  if (!user) return null

  const calculateStats = (txs: any[]) => {
    let income = 0
    let expense = 0
    txs.forEach(tx => {
      if (tx.type === 'income') income += Number(tx.amount)
      else if (tx.type === 'expense') expense += Number(tx.amount)
    })
    return { income, expense, balance: income - expense }
  }

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentMonthStr = todayStr.substring(0, 7) // yyyy-MM
  const currentYearStr = todayStr.substring(0, 4) // yyyy

  const todayStats = calculateStats(transactions.filter(tx => tx.date === todayStr))
  const monthStats = calculateStats(transactions.filter(tx => tx.date.startsWith(currentMonthStr)))
  const yearStats = calculateStats(transactions.filter(tx => tx.date.startsWith(currentYearStr)))
  const allTimeStats = calculateStats(transactions)

  const renderCards = (stats: { income: number, expense: number, balance: number }) => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dict.dashboard.balance}</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-foreground' : 'text-red-600'}`}>
            {stats.balance < 0 ? '-' : ''}฿{Math.abs(stats.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dict.dashboard.income}</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">฿{stats.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dict.dashboard.expense}</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">฿{stats.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Tabs defaultValue="month" className="w-full">
      <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <TabsList className="w-max sm:w-auto inline-flex">
          <TabsTrigger value="day">{dict.dashboard.today}</TabsTrigger>
          <TabsTrigger value="month">{dict.dashboard.thisMonth}</TabsTrigger>
          <TabsTrigger value="year">{dict.dashboard.thisYear}</TabsTrigger>
          <TabsTrigger value="all">{dict.dashboard.allTime}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="day">{renderCards(todayStats)}</TabsContent>
      <TabsContent value="month">{renderCards(monthStats)}</TabsContent>
      <TabsContent value="year">{renderCards(yearStats)}</TabsContent>
      <TabsContent value="all">{renderCards(allTimeStats)}</TabsContent>
    </Tabs>
  )
}
