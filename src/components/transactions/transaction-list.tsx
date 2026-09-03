import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteTransaction } from '@/lib/actions/transactions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Dictionary } from '@/lib/i18n/dictionaries'

export async function TransactionList({ dict, user }: { dict: Dictionary, user: any }) {
  if (!user) {
    return (
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle>{dict.transaction.recent}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-lg bg-muted/20">{dict.transaction.loginToView}</p>
        </CardContent>
      </Card>
    )
  }

  const supabase = await createClient()
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  const getCategoryLabel = (type: string, key: string) => {
    const catType = type === 'expense' ? dict.transaction.categories.expense : dict.transaction.categories.income;
    const lowerKey = key ? key.toLowerCase() : '';
    return (catType as any)[lowerKey] || key;
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = dict.calendar.months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle>{dict.transaction.recent}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-lg bg-muted/20">{dict.transaction.empty}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="px-0 md:px-6">
        <CardTitle>{dict.transaction.recent}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 md:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.transaction.date}</TableHead>
                <TableHead>{dict.transaction.desc}</TableHead>
                <TableHead>{dict.transaction.category}</TableHead>
                <TableHead className="text-right">{dict.transaction.amount}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium whitespace-nowrap">{formatDate(tx.date)}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{tx.description || '-'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center whitespace-nowrap">
                      {getCategoryLabel(tx.type, tx.category)}
                      <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tx.type === 'income' ? dict.transaction.income : dict.transaction.expense}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-medium whitespace-nowrap ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}฿{Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <form action={async () => {
                      'use server'
                      await deleteTransaction(tx.id)
                    }}>
                      <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
