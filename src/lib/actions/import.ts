'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function importTransactions(transactions: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not logged in')
  }

  const rows = transactions.map(tx => ({
    user_id: user.id,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    description: tx.description || null,
    date: tx.date
  }))

  const { error } = await supabase.from('transactions').insert(rows)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  return { success: true }
}
