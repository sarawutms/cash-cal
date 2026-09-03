import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/transaction-list";
import { ListFilter } from "@/components/transactions/list-filter";
import { Header } from "@/components/layout/header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; type?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "th";
  const dict = await getDictionary(lang as "th" | "en");

  const resolvedSearchParams = await searchParams;
  const period = resolvedSearchParams.period || "all";
  const type = resolvedSearchParams.type || "all";

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8">
      <Header user={user} dict={dict} currentLang={lang} />

      <main className="space-y-6 md:space-y-8">
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
