'use client'

import { useState } from 'react'
import { addTransaction, updateTransaction } from '@/lib/actions/transactions'
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


export function TransactionForm({ user, dict, initialDate, onSaved, lang = 'th', transaction, isDialog = false }: { user: any, dict: Dictionary, initialDate?: string, onSaved?: () => void, lang?: string, transaction?: any, isDialog?: boolean }) {
  const [type, setType] = useState(transaction?.type || 'expense')
  const [category, setCategory] = useState<string>(transaction?.category || '')
  const [date, setDate] = useState<Date>(transaction?.date ? new Date(transaction.date) : initialDate ? new Date(initialDate) : new Date())

  const categoryKeys = type === 'expense'
    ? Object.keys(dict.transaction.categories.expense)
    : type === 'income' 
      ? Object.keys(dict.transaction.categories.income)
      : type === 'brought_forward'
        ? Object.keys(dict.transaction.categories.brought_forward)
        : Object.keys(dict.transaction.categories.saving)

  const getCategoryLabel = (key: string) => {
    if (type === 'expense') return (dict.transaction.categories.expense as any)[key]
    if (type === 'income') return (dict.transaction.categories.income as any)[key]
    if (type === 'brought_forward') return (dict.transaction.categories.brought_forward as any)[key]
    return (dict.transaction.categories.saving as any)[key]
  }

  const getTypeLabel = (t: string) => {
    if (t === 'expense') return dict.transaction.expense
    if (t === 'income') return dict.transaction.income
    if (t === 'brought_forward') return dict.transaction.broughtForward
    return dict.transaction.savingType
  }

  const FormWrapper = isDialog ? 'div' : Card
  const HeaderWrapper = isDialog ? 'div' : CardHeader
  const ContentWrapper = isDialog ? 'div' : CardContent
  const TitleWrapper = isDialog ? 'h2' : CardTitle

  return (
    <FormWrapper className={isDialog ? "" : "border-0 shadow-none md:border md:shadow-sm"}>
      <HeaderWrapper className={isDialog ? "mb-4" : "px-0 md:px-6"}>
        <TitleWrapper className={isDialog ? "text-lg font-semibold" : ""}>{transaction ? (dict.transaction.editTitle || 'Edit Transaction') : dict.transaction.addTitle}</TitleWrapper>
      </HeaderWrapper>
      <ContentWrapper className={isDialog ? "" : "px-0 md:px-6"}>
        <form action={async (formData) => {
          if (!user) {
            document.getElementById('login-dialog-trigger')?.click()
            return
          }
          if (transaction) {
            formData.append('id', transaction.id)
            await updateTransaction(formData)
          } else {
            await addTransaction(formData)
          }
          if (onSaved) onSaved()
        }} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{dict.transaction.type}</Label>
              <Select name="type" value={type} onValueChange={(val) => {
                setType(val as string)
                setCategory('')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={dict.transaction.type}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-emerald-500' : type === 'expense' ? 'bg-rose-500' : type === 'brought_forward' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                      {getTypeLabel(type)}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      {dict.transaction.expense}
                    </div>
                  </SelectItem>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {dict.transaction.income}
                    </div>
                  </SelectItem>
                  <SelectItem value="saving">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      {dict.transaction.savingType}
                    </div>
                  </SelectItem>
                  <SelectItem value="brought_forward">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      {dict.transaction.broughtForward}
                    </div>
                  </SelectItem>
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
            <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" defaultValue={transaction?.amount} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{dict.transaction.category}</Label>
            <Select name="category" required value={category} onValueChange={(val) => setCategory(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder={dict.transaction.selectPlaceholder}>
                  {category ? getCategoryLabel(category) : undefined}
                </SelectValue>
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
            <Label htmlFor="description">{dict.transaction.description}</Label>
            <Input id="description" name="description" placeholder="Lunch at KFC..." defaultValue={transaction?.description} />
          </div>

          {user ? (
            <SubmitButton text={transaction ? (dict.transaction.update || 'Update') : dict.transaction.save} loadingText={dict.transaction.saving} />
          ) : (
            <LoginDialog trigger={
              <Button id="login-dialog-trigger" type="button" className="w-full bg-muted text-muted-foreground hover:bg-muted/80">
                {dict.transaction.loginRequired}
              </Button>
            } dict={dict} />
          )}
        </form>
      </ContentWrapper>
    </FormWrapper>
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
