import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TransactionList } from "@/components/transactions/transaction-list";
import { ListFilter } from "@/components/transactions/list-filter";
import { isFilterPeriod, isFilterType } from "@/lib/filters";
import { Suspense } from "react";

export default async function TransactionsPage({
  searchParams,
}: PageProps<"/transactions">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dict = await getDictionary("th");

  const sp = await searchParams;
  const rawPeriod = typeof sp.period === "string" ? sp.period : "all";
  const rawType = typeof sp.type === "string" ? sp.type : "all";
  const period = isFilterPeriod(rawPeriod) ? rawPeriod : "all";
  const type = isFilterType(rawType) ? rawType : "all";

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} />

      <main className="space-y-8 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {dict.app.navTransactions || "Transactions"}
          </h2>
        </div>

        <div className="w-full max-w-4xl mx-auto space-y-4">
          <Suspense
            fallback={
              <div className="h-16 w-full bg-muted/20 animate-pulse rounded-xl border"></div>
            }
          >
            <ListFilter dict={dict} />
          </Suspense>
          <TransactionList
            user={user}
            dict={dict}
            limit={0}
            period={period}
            type={type}
          />
        </div>
      </main>
    </div>
  );
}
