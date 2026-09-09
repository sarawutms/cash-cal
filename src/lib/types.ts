import { User as SupabaseUser } from "@supabase/supabase-js";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense" | "saving" | "brought_forward";
  category: string;
  date: string;
  description?: string | null;
  created_at?: string;
}

export type User = SupabaseUser;
