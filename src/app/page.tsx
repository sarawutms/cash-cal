import { createClient } from "@/lib/supabase/server";
import { DashboardSummary } from "@/components/transactions/dashboard-summary";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CalendarView } from "@/components/transactions/calendar-view";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DataActions } from "@/components/transactions/data-actions";
import { Transaction } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lang = "th";
  const dict = await getDictionary("th");

  let allTransactions: Transaction[] = [];
  if (user) {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (data) {
      allTransactions = data;
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} />

      <main className="space-y-8 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {dict.dashboard.cashflow || "Dashboard"}
          </h2>
          <DataActions dict={dict} transactions={allTransactions} user={user} />
        </div>

        <DashboardSummary
          dict={dict}
          user={user}
          transactions={allTransactions}
          formSlot={<TransactionForm user={user} dict={dict} lang={lang} />}
          calendarSlot={
            <CalendarView
              transactions={allTransactions}
              dict={dict}
              user={user}
              lang={lang}
            />
          }
        />

        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium tracking-tight">
              {dict.transaction.recent}
            </h3>
            <a
              href="/transactions"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {dict.app.navTransactions || "View All"} &rarr;
            </a>
          </div>
          {/* List */}
          <TransactionList user={user} dict={dict} limit={5} />
        </div>
      </main>
    </div>
  );
}
