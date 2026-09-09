"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const VALID_TYPES = [
  "income",
  "expense",
  "saving",
  "brought_forward",
] as const;

type ImportRow = {
  date?: string;
  type?: string;
  category?: string;
  amount: number;
  description?: string;
};

export async function importTransactions(transactions: ImportRow[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const rows = transactions
    .filter(
      (tx) =>
        !!tx.date &&
        datePattern.test(tx.date) &&
        !!tx.type &&
        (VALID_TYPES as readonly string[]).includes(tx.type) &&
        !!tx.category &&
        Number.isFinite(tx.amount),
    )
    .map((tx) => ({
      user_id: user.id,
      amount: tx.amount,
      type: tx.type as (typeof VALID_TYPES)[number],
      category: tx.category as string,
      description: tx.description || null,
      date: tx.date as string,
    }));

  if (rows.length === 0) {
    throw new Error("No valid transactions to import");
  }

  const { error } = await supabase.from("transactions").insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/", "layout");
  return { success: true };
}
