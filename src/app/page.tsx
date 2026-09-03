import { createClient } from '@/lib/supabase/server'
import { DashboardSummary } from '@/components/transactions/dashboard-summary'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionList } from '@/components/transactions/transaction-list'
import { CalendarView } from '@/components/transactions/calendar-view'
import { Header } from '@/components/layout/header'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { cookies } from 'next/headers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { DataActions } from '@/components/transactions/data-actions'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'th'
  const dict = await getDictionary(lang as 'th' | 'en')

  let allTransactions: any[] = []
  if (user) {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (data) {
      allTransactions = data
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} currentLang={lang} />

      <main className="space-y-6 md:space-y-8">
        <DashboardSummary dict={dict} user={user} transactions={allTransactions} />
        
        <Tabs defaultValue="calendar" className="w-full">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="calendar">{dict.tabs.calendar}</TabsTrigger>
              <TabsTrigger value="table">{dict.tabs.list}</TabsTrigger>
            </TabsList>
            
            <DataActions dict={dict} transactions={allTransactions} user={user} />
          </div>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView transactions={allTransactions} dict={dict} user={user} lang={lang} />
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <TransactionForm user={user} dict={dict} lang={lang} />
              </div>
              <div className="md:col-span-2">
                <TransactionList user={user} dict={dict} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}
