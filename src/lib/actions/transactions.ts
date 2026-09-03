"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    type,
    category,
    date,
    description,
  });

  if (error) {
    console.error("Error adding transaction:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
}
export async function updateTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("transactions")
    .update({
      amount,
      type,
      category,
      date,
      description,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating transaction:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
}
