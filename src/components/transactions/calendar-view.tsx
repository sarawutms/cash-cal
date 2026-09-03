"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dictionary } from "@/lib/i18n/dictionaries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { th, enUS } from "date-fns/locale";

export function CalendarView({
  transactions,
  dict,
  user,
  lang,
}: {
  transactions: any[];
  dict: Dictionary;
  user: any;
  lang: string;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  // Aggregate daily totals
  const dailyStats: Record<
    string,
    {
      income: number;
      expense: number;
      saving: number;
      broughtForward: number;
      count: number;
    }
  > = {};
  transactions.forEach((tx) => {
    const date = tx.date;
    if (!dailyStats[date]) {
      dailyStats[date] = {
        income: 0,
        expense: 0,
        saving: 0,
        broughtForward: 0,
        count: 0,
      };
    }
    dailyStats[date].count += 1;
    if (tx.type === "income") dailyStats[date].income += Number(tx.amount);
    else if (tx.type === "expense")
      dailyStats[date].expense += Number(tx.amount);
    else if (tx.type === "saving") dailyStats[date].saving += Number(tx.amount);
    else if (tx.type === "brought_forward")
      dailyStats[date].broughtForward += Number(tx.amount);
  });

  const formatFullDate = (d: Date) => {
    return `${d.getDate()} ${dict.calendar.months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getCategoryLabel = (type: string, key: string) => {
    const lowerKey = key ? key.toLowerCase() : "";
    if (type === "expense")
      return (dict.transaction.categories.expense as any)[lowerKey] || key;
    if (type === "income")
      return (dict.transaction.categories.income as any)[lowerKey] || key;
    if (type === "brought_forward")
      return (
        (dict.transaction.categories.brought_forward as any)[lowerKey] || key
      );
    if (type === "saving")
      return (dict.transaction.categories.saving as any)[lowerKey] || key;
    return key;
  };

  const weekdays = dict.calendar.weekdays;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-bold text-lg h-10",
                    !currentDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? (
                    formatFullDate(currentDate)
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (date) setCurrentDate(date);
                }}
                locale={lang === "th" ? th : enUS}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            {dict.calendar.today}
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] md:text-xs font-semibold text-muted-foreground py-1 truncate"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const stats = dailyStats[dateStr];
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const net = stats
              ? stats.income +
                stats.broughtForward -
                stats.expense -
                stats.saving
              : 0;

            let bgColor = "bg-muted/30";
            if (stats && stats.count > 0) {
              if (net > 0) bgColor = "bg-emerald-500/10 border-emerald-500/30";
              else if (net < 0) bgColor = "bg-rose-500/10 border-rose-500/30";
              else bgColor = "bg-slate-500/10 border-slate-500/30";
            }

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[60px] md:min-h-[80px] p-1 md:p-2 rounded-lg border transition-all cursor-pointer hover:border-primary/50 flex flex-col justify-between group relative ${bgColor} ${!isCurrentMonth ? "opacity-40" : ""} ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[10px] md:text-xs font-semibold ${isToday ? "text-primary" : ""}`}
                  >
                    {format(day, dateFormat)}
                  </span>
                  {stats && stats.count > 0 && (
                    <span className="text-[9px] md:text-[10px] text-muted-foreground hidden sm:block">
                      {stats.count}
                    </span>
                  )}
                </div>

                {stats && stats.count > 0 ? (
                  <div className="flex flex-col items-end mt-1">
                    <span
                      className={`text-[9px] md:text-xs font-bold truncate max-w-full ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {net >= 0 ? "+" : "-"}฿
                      {Math.abs(net).toLocaleString("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog
        open={!!selectedDate}
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? formatFullDate(selectedDate) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="order-2 md:order-1">
              <h3 className="font-medium text-sm mb-3">
                {dict.calendar.transactionsOnDay}
              </h3>
              <div className="space-y-3">
                {selectedDate &&
                transactions.filter(
                  (tx) => tx.date === format(selectedDate, "yyyy-MM-dd"),
                ).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg bg-muted/20">
                    {dict.calendar.noTransactions}
                  </p>
                ) : (
                  selectedDate &&
                  transactions
                    .filter(
                      (tx) => tx.date === format(selectedDate, "yyyy-MM-dd"),
                    )
                    .map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 border rounded-lg"
                      >
                        <div className="w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                                tx.type === "saving" || tx.category === "saving"
                                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                                  : tx.type === "brought_forward"
                                    ? "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                                    : tx.type === "income"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                              }`}
                            >
                              {getCategoryLabel(tx.type, tx.category)}
                            </span>
                          </div>
                          {tx.description && (
                            <p className="text-xs text-muted-foreground mt-1 ml-1 truncate max-w-[200px] sm:max-w-xs">
                              {tx.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                          <span
                            className={`font-bold ${tx.type === "saving" || tx.category === "saving" ? "text-indigo-600" : tx.type === "brought_forward" ? "text-slate-600" : tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                          >
                            {tx.type === "income" ||
                            tx.type === "brought_forward"
                              ? "+"
                              : "-"}
                            ฿
                            {Number(tx.amount).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            <EditTransactionDialog
                              transaction={tx}
                              dict={dict}
                              user={user}
                            />
                            <form
                              action={async () => {
                                const { deleteTransaction } =
                                  await import("@/lib/actions/transactions");
                                await deleteTransaction(tx.id);
                              }}
                            >
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <TransactionForm
                user={user}
                dict={dict}
                initialDate={
                  selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
                }
                onSaved={() => setSelectedDate(null)}
                lang={lang}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
