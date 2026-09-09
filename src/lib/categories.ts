import { Dictionary } from "@/lib/i18n/dictionaries";

export type TransactionType =
  | "income"
  | "expense"
  | "saving"
  | "brought_forward";

type CategoryMap = Record<string, string>;

/**
 * Resolve a category key (e.g. "food") to its localized label
 * (e.g. "อาหาร") for the given transaction type. Falls back to the
 * raw key when the dictionary has no entry for it.
 */
export function getCategoryLabel(
  dict: Dictionary,
  type: string,
  key: string,
): string {
  if (!key) return key;
  const lowerKey = key.toLowerCase();

  let map: CategoryMap | undefined;
  if (type === "expense") map = dict.transaction.categories.expense;
  else if (type === "income") map = dict.transaction.categories.income;
  else if (type === "saving") map = dict.transaction.categories.saving;
  else if (type === "brought_forward")
    map = dict.transaction.categories.brought_forward;

  return map?.[lowerKey] ?? key;
}
