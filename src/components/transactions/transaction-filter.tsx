'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function TransactionFilter({ dict }: { dict: Dictionary }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentPeriod = searchParams.get('period') || 'month'
  const currentType = searchParams.get('type') || 'all'
  const currentCategory = searchParams.get('category') || 'all'

  const updateFilters = (period: string, type: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (period && period !== 'all') params.set('period', period)
    else params.delete('period')

    if (type && type !== 'all') params.set('type', type)
    else params.delete('type')
    
    if (category && category !== 'all') params.set('category', category)
    else params.delete('category')
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handlePeriodChange = (value: string | null) => {
    if (!value) return
    updateFilters(value, currentType, currentCategory)
  }

  const handleTypeChange = (value: string | null) => {
    if (!value) return
    // Reset category if type changes, since categories are tied to types
    updateFilters(currentPeriod, value, 'all')
  }

  const handleCategoryChange = (value: string | null) => {
    if (!value) return
    updateFilters(currentPeriod, currentType, value)
  }

  const clearFilters = () => {
    updateFilters('all', 'all', 'all')
  }

  const hasFilters = currentPeriod !== 'all' || currentType !== 'all' || currentCategory !== 'all'

  let categoryKeys: string[] = []
  if (currentType === 'expense') categoryKeys = Object.keys(dict.transaction.categories.expense)
  else if (currentType === 'income') categoryKeys = Object.keys(dict.transaction.categories.income)
  else if (currentType === 'saving') categoryKeys = Object.keys(dict.transaction.categories.saving)
  else if (currentType === 'brought_forward') categoryKeys = Object.keys(dict.transaction.categories.brought_forward)

  const getCategoryLabel = (key: string) => {
    if (currentType === 'expense') return (dict.transaction.categories.expense as any)[key]
    if (currentType === 'income') return (dict.transaction.categories.income as any)[key]
    if (currentType === 'saving') return (dict.transaction.categories.saving as any)[key]
    if (currentType === 'brought_forward') return (dict.transaction.categories.brought_forward as any)[key]
    return key
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-card p-3 rounded-xl border md:shadow-sm">
      <div className="text-sm font-medium text-muted-foreground mr-1 hidden lg:block">
        {dict.transaction.filter || 'Filter:'}
      </div>

      <Select value={currentPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[120px] sm:w-[140px] h-9">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{dict.dashboard?.allTime || 'All Time'}</SelectItem>
          <SelectItem value="day">{dict.dashboard?.today || 'Today'}</SelectItem>
          <SelectItem value="week">{dict.dashboard?.thisWeek || 'This Week'}</SelectItem>
          <SelectItem value="month">{dict.dashboard?.thisMonth || 'This Month'}</SelectItem>
          <SelectItem value="year">{dict.dashboard?.thisYear || 'This Year'}</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={currentType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{dict.transaction.allTypes || 'All Types'}</SelectItem>
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
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              {dict.transaction.broughtForward}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {currentType !== 'all' && (
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.transaction.allCategories || 'All Categories'}</SelectItem>
            {categoryKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {getCategoryLabel(key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">{dict.transaction.clearFilters || 'Clear'}</span>
        </Button>
      )}
    </div>
  )
}
