export const PERIODS = ["all", "day", "week", "month", "year"] as const;
export const TYPES = ["all", "income", "expense", "saving"] as const;

export type FilterPeriod = (typeof PERIODS)[number];
export type FilterType = (typeof TYPES)[number];

export const isFilterPeriod = (v: string): v is FilterPeriod =>
  (PERIODS as readonly string[]).includes(v);

export const isFilterType = (v: string): v is FilterType =>
  (TYPES as readonly string[]).includes(v);
