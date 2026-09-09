import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTransaction } from "@/lib/actions/transactions";
import { type FilterPeriod, type FilterType } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { getCategoryLabel } from "@/lib/categories";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { Transaction, User } from "@/lib/types";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

export async function TransactionList({
  dict,
  user,
  limit = 50,
  period = "all",
  type = "all",
}: {
  dict: Dictionary;
  user: User | null;
  limit?: number;
  period?: FilterPeriod;
  type?: FilterType;
}) {
  if (!user) {
    return (
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle>{dict.transaction.recent}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-lg bg-muted/20">
            {dict.transaction.loginToView}
          </p>
        </CardContent>
      </Card>
    );
  }

  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  if (type !== "all") {
    query = query.eq("type", type);
  }

  const now = new Date();

  if (period === "day") {
    query = query.eq("date", format(now, "yyyy-MM-dd"));
  } else if (period === "week") {
    query = query
      .gte("date", format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"))
      .lte("date", format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"));
  } else if (period === "month") {
    query = query
      .gte("date", format(startOfMonth(now), "yyyy-MM-dd"))
      .lte("date", format(endOfMonth(now), "yyyy-MM-dd"));
  } else if (period === "year") {
    query = query
      .gte("date", format(startOfYear(now), "yyyy-MM-dd"))
      .lte("date", format(endOfYear(now), "yyyy-MM-dd"));
  }

  const { data: transactions } = await query;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = dict.calendar.months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader className="px-0 md:px-6">
          <CardTitle>{dict.transaction.recent}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          <p className="text-muted-foreground text-sm text-center py-8 border rounded-lg bg-muted/20">
            {dict.transaction.empty}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
      <CardHeader className="px-0 md:px-6">
        <CardTitle>
          {limit > 0
            ? dict.transaction.recent
            : dict.transaction.allTransactions}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 md:px-6 pb-6">
        <div
          className={`overflow-x-auto overflow-y-auto ${limit > 0 ? "max-h-[600px]" : "h-[calc(100vh-250px)] min-h-[500px]"}`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] whitespace-nowrap">{dict.transaction.date}</TableHead>
                <TableHead className="min-w-[120px]">{dict.transaction.description}</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap">{dict.transaction.category}</TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  {dict.transaction.amount}
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: Transaction) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className="break-words">
                    {tx.description || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "saving" || tx.category === "saving"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                          : tx.type === "brought_forward"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                            : tx.type === "income"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                      }`}
                    >
                      {getCategoryLabel(dict, tx.type, tx.category)}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium whitespace-nowrap ${tx.type === "saving" || tx.category === "saving" ? "text-indigo-600" : tx.type === "brought_forward" ? "text-slate-600" : tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {tx.type === "income" || tx.type === "brought_forward"
                      ? "+"
                      : "-"}
                    ฿
                    {Number(tx.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <EditTransactionDialog
                        transaction={tx}
                        dict={dict}
                        user={user}
                      />
                      <form
                        action={async () => {
                          "use server";
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
