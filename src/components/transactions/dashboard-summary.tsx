'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, ArrowDownIcon, ArrowUpIcon, PiggyBankIcon } from 'lucide-react'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { ExpenseChart } from './expense-chart'
import { BudgetCard } from './budget-card'
import { TopUpDialog } from './top-up-dialog'

export function DashboardSummary({ dict, user, allTransactions, filteredTransactions }: { dict: Dictionary, user: any, allTransactions: any[], filteredTransactions: any[] }) {
  const calculateStats = (txs: any[]) => {
    let income = 0
    let expense = 0
    let saving = 0
    let broughtForward = 0
    txs.forEach(tx => {
      if (tx.type === 'income') income += Number(tx.amount)
      else if (tx.type === 'expense') expense += Number(tx.amount)
      else if (tx.type === 'saving') saving += Number(tx.amount)
      else if (tx.type === 'brought_forward') broughtForward += Number(tx.amount)
    })
    return { income, expense, saving, broughtForward, balance: income + broughtForward - expense - saving }
  }

  const globalStats = calculateStats(allTransactions)
  const currentStats = calculateStats(filteredTransactions)

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.balance}</CardTitle>
            <div className="flex items-center gap-2">
              <TopUpDialog user={user} dict={dict} />
              <Wallet className="h-4 w-4 text-muted-foreground hidden lg:block" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-4 sm:py-6 pt-0">
            <div className={`text-lg sm:text-2xl font-bold ${globalStats.balance >= 0 ? 'text-foreground' : 'text-rose-600'}`}>
              ฿{globalStats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">
              {currentStats.balance >= 0 ? '+' : '-'} ฿{Math.abs(currentStats.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({dict.dashboard.cashflow || 'Cash flow'})
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.income}</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-600 hidden sm:block" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600">฿{currentStats.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.expense}</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-600 hidden sm:block" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-rose-600">฿{currentStats.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">{dict.dashboard.saving}</CardTitle>
            <PiggyBankIcon className="h-4 w-4 text-indigo-600 hidden sm:block" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-indigo-600">฿{currentStats.saving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 w-full"><BudgetCard user={user} transactions={allTransactions} dict={dict} /></div>
        <div className="lg:col-span-2 w-full"><ExpenseChart transactions={filteredTransactions} dict={dict} /></div>
      </div>
    </div>
  )
}
