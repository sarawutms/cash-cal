import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TransactionList } from "@/components/transactions/transaction-list";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dict = await getDictionary("th");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} />

      <main className="space-y-8 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {dict.app.navTransactions || "Transactions"}
          </h2>
        </div>

        <div className="w-full">
          {/* List all with no limit */}
          <TransactionList user={user} dict={dict} limit={0} />
        </div>
      </main>
    </div>
  );
}
