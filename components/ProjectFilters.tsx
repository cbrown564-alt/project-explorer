"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThemeBadge } from "@/components/ThemeBadge";
import { THEMES } from "@/lib/types";
import { Search, X, ArrowUpDown, Building2 } from "lucide-react";

type SortOption = "default" | "title" | "supervisor" | "theme";

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedThemes: string[];
  onThemeToggle: (theme: string) => void;
  selectedSupervisor: string | null;
  onSupervisorChange: (v: string | null) => void;
  industrialOnly: boolean;
  onIndustrialToggle: () => void;
  supervisors: string[];
  resultCount: number;
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (v: SortOption) => void;
}

export function ProjectFilters({
  search,
  onSearchChange,
  selectedThemes,
  onThemeToggle,
  selectedSupervisor,
  onSupervisorChange,
  industrialOnly,
  onIndustrialToggle,
  supervisors,
  resultCount,
  totalCount,
  sortBy,
  onSortChange,
}: FiltersProps) {
  const hasFilters =
    search || selectedThemes.length > 0 || selectedSupervisor || industrialOnly;

  return (
    <div className="space-y-3 w-full">
      {/* Row 1: Search + Supervisor + Industry toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search projects, keywords, or supervisors..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-10 w-full rounded-xl bg-secondary/40 border-transparent focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:bg-white text-sm shadow-inner transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground bg-secondary/80 p-1 rounded-full hover:bg-muted transition-all z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-[220px] shrink-0">
          <select
            value={selectedSupervisor || ""}
            onChange={(e) => onSupervisorChange(e.target.value || null)}
            className="appearance-none w-full h-10 text-sm font-medium border-none rounded-xl px-4 pr-9 bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground focus:text-foreground focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer shadow-inner"
          >
            <option value="">All Supervisors</option>
            {supervisors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <label className="flex items-center gap-2.5 h-10 px-4 rounded-xl bg-secondary/40 cursor-pointer hover:bg-secondary/60 transition-all shrink-0 w-full sm:w-auto select-none">
          <Switch
            checked={industrialOnly}
            onCheckedChange={onIndustrialToggle}
            className="scale-90"
          />
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap">
            <Building2 className="h-3.5 w-3.5" />
            Industry Partner
          </span>
        </label>
      </div>

      {/* Row 2: Theme pills | Sort + Count + Clear */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        {/* Theme pills — no wrapper chrome, just the badges */}
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full sm:w-auto">
          <div className="inline-flex items-center gap-1.5 min-w-max">
            {THEMES.map((theme) => {
              const isSelected = selectedThemes.includes(theme);
              const isDimmed = selectedThemes.length > 0 && !isSelected;
              return (
                <button
                  key={theme}
                  onClick={() => onThemeToggle(theme)}
                  className={`transition-all duration-200 rounded-full hover:scale-105 active:scale-95 ${
                    isDimmed
                      ? "opacity-30 grayscale hover:opacity-70 hover:grayscale-0"
                      : "opacity-100"
                  } ${isSelected ? "ring-2 ring-inset ring-primary/40 scale-105" : ""}`}
                >
                  <ThemeBadge theme={theme} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort + Count + Clear — right-aligned, visually distinct from filters */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none h-8 text-xs font-medium rounded-lg pl-7 pr-3 bg-transparent border border-border/60 text-muted-foreground hover:border-border hover:text-foreground focus:text-foreground focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="default">Default order</option>
              <option value="title">A–Z by title</option>
              <option value="supervisor">By supervisor</option>
              <option value="theme">By theme</option>
            </select>
            <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <span className="text-xs text-muted-foreground shrink-0">
            <span className="font-semibold text-foreground">{resultCount}</span>
            {resultCount !== totalCount && (
              <span className="hidden sm:inline"> of {totalCount}</span>
            )}
            {" "}projects
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasFilters}
            className={`h-8 px-3 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              hasFilters
                ? "text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                : "text-muted-foreground/30 pointer-events-none"
            }`}
            onClick={() => {
              onSearchChange("");
              selectedThemes.forEach(onThemeToggle);
              onSupervisorChange(null);
              if (industrialOnly) onIndustrialToggle();
            }}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
