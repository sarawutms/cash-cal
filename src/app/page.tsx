import { createClient } from '@/lib/supabase/server'
import { DashboardSummary } from '@/components/transactions/dashboard-summary'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionList } from '@/components/transactions/transaction-list'
import { CalendarView } from '@/components/transactions/calendar-view'
import { TransactionFilter } from '@/components/transactions/transaction-filter'
import { Header } from '@/components/layout/header'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

import { DataActions } from '@/components/transactions/data-actions'

export default async function HomePage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams
  const filterType = searchParams.type as string | undefined
  const filterCategory = searchParams.category as string | undefined

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'th'
  const dict = await getDictionary(lang as 'th' | 'en')

  let allTransactions: any[] = []
  let filteredTransactions: any[] = []

  if (user) {
    // Unfiltered for Dashboard Summary
    const { data: allData } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      
    if (allData) allTransactions = allData

    // Filtered for List and Calendar
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (filterType) query = query.eq('type', filterType)
    if (filterCategory) query = query.eq('category', filterCategory)
      
    const { data: filteredData } = await query
    if (filteredData) filteredTransactions = filteredData
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} currentLang={lang} />

      <main className="space-y-6 md:space-y-8">
        
        <div className="flex justify-end mb-4">
          <DataActions dict={dict} transactions={allTransactions} user={user} />
        </div>

        <DashboardSummary dict={dict} user={user} transactions={allTransactions} />
        
        <Suspense fallback={<div className="h-[60px] bg-card rounded-xl border animate-pulse"></div>}>
          <TransactionFilter dict={dict} />
        </Suspense>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Form */}
          <div className="order-1 lg:order-none lg:col-span-4 w-full">
            <TransactionForm user={user} dict={dict} lang={lang} />
          </div>

          {/* Calendar */}
          <div className="order-2 lg:order-none lg:col-span-8 lg:row-span-2 w-full">
            <CalendarView transactions={filteredTransactions} dict={dict} user={user} lang={lang} />
          </div>

          {/* List */}
          <div className="order-3 lg:order-none lg:col-span-4 w-full">
            <TransactionList user={user} dict={dict} transactions={filteredTransactions.slice(0, 50)} />
          </div>

        </div>

      </main>
    </div>
  )
}
