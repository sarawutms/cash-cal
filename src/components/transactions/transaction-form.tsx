'use client'

import { useState } from 'react'
import { addTransaction } from '@/lib/actions/transactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormStatus } from 'react-dom'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { LoginDialog } from '@/components/auth/login-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'


export function TransactionForm({ user, dict, initialDate, onSaved, lang = 'th' }: { user: any, dict: Dictionary, initialDate?: string, onSaved?: () => void, lang?: string }) {
  const [type, setType] = useState('expense')
  const [date, setDate] = useState<Date>(initialDate ? new Date(initialDate) : new Date())

  const categoryKeys = type === 'expense'
    ? Object.keys(dict.transaction.categories.expense)
    : Object.keys(dict.transaction.categories.income)
    
  const getCategoryLabel = (key: string) => {
    if (type === 'expense') return (dict.transaction.categories.expense as any)[key]
    return (dict.transaction.categories.income as any)[key]
  }

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="px-0 md:px-6">
        <CardTitle>{dict.transaction.addTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 md:px-6">
        <form action={async (formData) => {
          if (user) {
            await addTransaction(formData)
            if (onSaved) onSaved()
          }
        }} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{dict.transaction.type}</Label>
              <Select name="type" value={type} onValueChange={(val) => setType(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder={dict.transaction.type}>
                    {type === 'expense' ? dict.transaction.expense : dict.transaction.income}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">{dict.transaction.expense}</SelectItem>
                  <SelectItem value="income">{dict.transaction.income}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col justify-end">
              <Label htmlFor="date" className="mb-1">{dict.transaction.date}</Label>
              <input type="hidden" name="date" value={format(date, 'yyyy-MM-dd')} />
              <Popover>
                <PopoverTrigger render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? `${date.getDate()} ${dict.calendar.months[date.getMonth()]} ${date.getFullYear()}` : <span>Pick a date</span>}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    locale={lang === 'th' ? th : enUS}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{dict.transaction.amount}</Label>
            <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{dict.transaction.category}</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder={dict.transaction.selectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {categoryKeys.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{dict.transaction.desc}</Label>
            <Input id="description" name="description" placeholder="..." />
          </div>

          {user ? (
            <SubmitButton text={dict.transaction.save} loadingText={dict.transaction.saving} />
          ) : (
            <LoginDialog trigger={
              <Button type="button" className="w-full bg-muted text-muted-foreground hover:bg-muted/80">
                {dict.transaction.loginRequired}
              </Button>
            } dict={dict} />
          )}
        </form>
      </CardContent>
    </Card>
  )
}

function SubmitButton({ text, loadingText }: { text: string, loadingText: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? loadingText : text}
    </Button>
  )
}
