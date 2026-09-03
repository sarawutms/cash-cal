import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/transaction-list";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "th";
  const dict = await getDictionary(lang as "th" | "en");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} currentLang={lang} />

      <main className="space-y-6 md:space-y-8">
        <div className="w-full max-w-4xl mx-auto">
          <TransactionList user={user} dict={dict} limit={0} />
        </div>
      </main>
    </div>
  );
}
