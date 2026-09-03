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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ListFilter({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPeriod: string = searchParams?.get("period") || "all";
  const currentType: string = searchParams?.get("type") || "all";

  const updateFilters = (period: string | null, type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (period && period !== "all") params.set("period", period);
    else params.delete("period");

    if (type && type !== "all") params.set("type", type);
    else params.delete("type");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    updateFilters("all", "all");
  };

  const hasFilters = currentPeriod !== "all" || currentType !== "all";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border">
      <div className="flex-1 w-full grid grid-cols-2 gap-3">
        <Select
          value={currentPeriod}
          onValueChange={(v) => updateFilters(v, currentType)}
        >
          <SelectTrigger className="w-full h-10 bg-background">
            <SelectValue placeholder={dict.dashboard?.allTime} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {dict.dashboard?.allTime}
            </SelectItem>
            <SelectItem value="day">
              {dict.dashboard?.today}
            </SelectItem>
            <SelectItem value="week">
              {dict.dashboard?.thisWeek}
            </SelectItem>
            <SelectItem value="month">
              {dict.dashboard?.thisMonth}
            </SelectItem>
            <SelectItem value="year">
              {dict.dashboard?.thisYear}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentType}
          onValueChange={(v) => updateFilters(currentPeriod, v)}
        >
          <SelectTrigger className="w-full h-10 bg-background">
            <SelectValue placeholder={dict.transaction?.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {dict.transaction?.allTypes}
            </SelectItem>
            <SelectItem value="income">
              {dict.transaction?.income}
            </SelectItem>
            <SelectItem value="expense">
              {dict.transaction?.expense}
            </SelectItem>
            <SelectItem value="saving">
              {dict.transaction?.savingType}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
          title={dict.transaction?.clearFilters || "Clear filters"}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
