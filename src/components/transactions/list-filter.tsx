"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dictionary } from "@/lib/i18n/dictionaries";
import {
  type FilterPeriod,
  type FilterType,
  isFilterPeriod,
  isFilterType,
} from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ListFilter({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const rawPeriod = searchParams.get("period") ?? "all";
  const rawType = searchParams.get("type") ?? "all";
  const currentPeriod: FilterPeriod = isFilterPeriod(rawPeriod)
    ? rawPeriod
    : "all";
  const currentType: FilterType = isFilterType(rawType) ? rawType : "all";

  const updateFilters = (period: FilterPeriod, type: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (period !== "all") params.set("period", period);
    else params.delete("period");
    if (type !== "all") params.set("type", type);
    else params.delete("type");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasFilters = currentPeriod !== "all" || currentType !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border">
      <div className="flex-1 w-full grid grid-cols-2 gap-3">
        <Select
          value={currentPeriod}
          onValueChange={(v) => {
            if (typeof v === "string" && isFilterPeriod(v))
              updateFilters(v, currentType);
          }}
        >
          <SelectTrigger className="w-full h-10 bg-background">
            <SelectValue placeholder={dict.dashboard.allTime} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.dashboard.allTime}</SelectItem>
            <SelectItem value="day">{dict.dashboard.today}</SelectItem>
            <SelectItem value="week">{dict.dashboard.thisWeek}</SelectItem>
            <SelectItem value="month">{dict.dashboard.thisMonth}</SelectItem>
            <SelectItem value="year">{dict.dashboard.thisYear}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentType}
          onValueChange={(v) => {
            if (typeof v === "string" && isFilterType(v))
              updateFilters(currentPeriod, v);
          }}
        >
          <SelectTrigger className="w-full h-10 bg-background">
            <SelectValue placeholder={dict.transaction.allTypes} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.transaction.allTypes}</SelectItem>
            <SelectItem value="income">{dict.transaction.income}</SelectItem>
            <SelectItem value="expense">{dict.transaction.expense}</SelectItem>
            <SelectItem value="saving">{dict.transaction.savingType}</SelectItem>
            <SelectItem value="brought_forward">
              {dict.transaction.broughtForward}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => updateFilters("all", "all")}
          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
          title={dict.transaction.clearFilters}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
