'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from 'lucide-react'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseChart } from './expense-chart'
import { BudgetCard } from './budget-card'
import { useState } from 'react'

import { isSameWeek } from 'date-fns'

export function DashboardSummary({ dict, user, transactions }: { dict: Dictionary, user: any, transactions: any[] }) {
  const calculateStats = (txs: any[]) => {
    let income = 0
    let expense = 0
    let saving = 0
    txs.forEach(tx => {
      if (tx.type === 'income') income += Number(tx.amount)
      else if (tx.type === 'expense') expense += Number(tx.amount)
      else if (tx.type === 'saving') saving += Number(tx.amount)
    })
    return { income, expense, saving, balance: income - expense - saving }
  }

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentMonthStr = todayStr.substring(0, 7) // yyyy-MM
  const currentYearStr = todayStr.substring(0, 4) // yyyy

  const todayStats = calculateStats(transactions.filter(tx => tx.date === todayStr))
  const weekStats = calculateStats(transactions.filter(tx => isSameWeek(new Date(tx.date), now, { weekStartsOn: 1 })))
  const monthStats = calculateStats(transactions.filter(tx => tx.date.startsWith(currentMonthStr)))
  const yearStats = calculateStats(transactions.filter(tx => tx.date.startsWith(currentYearStr)))
  const allTimeStats = calculateStats(transactions)

  const renderCards = (stats: { income: number, expense: number, saving: number, balance: number }) => (
    <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.balance}</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent>
          <div className={`text-lg sm:text-2xl font-bold ${stats.balance >= 0 ? 'text-foreground' : 'text-rose-600'}`}>
            {stats.balance < 0 ? '-' : ''}฿{Math.abs(stats.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.income}</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-emerald-600 hidden sm:block" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-emerald-600">฿{stats.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.expense}</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-rose-600 hidden sm:block" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-rose-600">฿{stats.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.saving}</CardTitle>
          <PiggyBankIcon className="h-4 w-4 text-indigo-600 hidden sm:block" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold text-indigo-600">฿{stats.saving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
    </div>
  )

  const [activeTab, setActiveTab] = useState('month')
  
  const getActiveTransactions = () => {
    switch(activeTab) {
      case 'day': return transactions.filter(tx => tx.date === todayStr)
      case 'week': return transactions.filter(tx => isSameWeek(new Date(tx.date), now, { weekStartsOn: 1 }))
      case 'month': return transactions.filter(tx => tx.date.startsWith(currentMonthStr))
      case 'year': return transactions.filter(tx => tx.date.startsWith(currentYearStr))
      default: return transactions
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="month" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="w-max sm:w-auto inline-flex">
            <TabsTrigger value="day">{dict.dashboard.today}</TabsTrigger>
            <TabsTrigger value="week">{dict.dashboard.thisWeek}</TabsTrigger>
            <TabsTrigger value="month">{dict.dashboard.thisMonth}</TabsTrigger>
            <TabsTrigger value="year">{dict.dashboard.thisYear}</TabsTrigger>
            <TabsTrigger value="all">{dict.dashboard.allTime}</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="day">{renderCards(todayStats)}</TabsContent>
        <TabsContent value="week">{renderCards(weekStats)}</TabsContent>
        <TabsContent value="month">{renderCards(monthStats)}</TabsContent>
        <TabsContent value="year">{renderCards(yearStats)}</TabsContent>
        <TabsContent value="all">{renderCards(allTimeStats)}</TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetCard user={user} transactions={transactions} dict={dict} />
        <ExpenseChart transactions={getActiveTransactions()} dict={dict} />
      </div>
    </div>
  )
}
