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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { EditTransactionDialog } from "./edit-transaction-dialog";

export async function TransactionList({
  dict,
  user,
}: {
  dict: Dictionary;
  user: any;
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
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

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
        <CardTitle>{dict.transaction.recent}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 md:px-6 pb-6">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dict.transaction.date}</TableHead>
                <TableHead>{dict.transaction.description}</TableHead>
                <TableHead>{dict.transaction.category}</TableHead>
                <TableHead className="text-right">
                  {dict.transaction.amount}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {tx.description || "-"}
                  </TableCell>
                  <TableCell>
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
                      {getCategoryLabel(tx.type, tx.category)}
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
                    <div className="flex items-center gap-1">
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
