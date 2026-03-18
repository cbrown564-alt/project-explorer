"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeBadge } from "@/components/ThemeBadge";
import { THEMES } from "@/lib/types";
import { Search, X, SlidersHorizontal, ArrowDownWideNarrow } from "lucide-react";

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
}: FiltersProps) {
  const hasFilters =
    search || selectedThemes.length > 0 || selectedSupervisor || industrialOnly;

  return (
    <div className="space-y-4 w-full">
      {/* Top Row: Search, Supervisor, Industrial Phase */}
      <div className="flex flex-col sm:flex-row items-center gap-3 xl:gap-4 w-full">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search projects, keywords, or supervisors..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 w-full rounded-2xl bg-secondary/40 border-transparent focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:bg-white text-base shadow-inner transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground bg-secondary/80 p-1 rounded-full hover:bg-muted transition-all z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-[240px] shrink-0">
          <select
            value={selectedSupervisor || ""}
            onChange={(e) => onSupervisorChange(e.target.value || null)}
            className="appearance-none w-full h-12 text-sm font-semibold border-none rounded-2xl px-5 py-2 bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground focus:text-foreground focus:bg-white focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer shadow-inner"
          >
            <option value="">All Academic Supervisors</option>
            {supervisors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ArrowDownWideNarrow className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        <Button
          variant={industrialOnly ? "default" : "outline"}
          className={`w-full sm:w-auto h-12 px-5 rounded-2xl text-sm font-semibold transition-all shrink-0 border-2 ${
            industrialOnly
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 border-transparent"
              : "bg-transparent border-solid border-border/80 text-muted-foreground hover:bg-secondary/50"
          }`}
          onClick={onIndustrialToggle}
        >
          Industrial Phase
        </Button>
      </div>

      {/* Bottom Row: Themes & Actions */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 xl:gap-4 w-full">
        {/* Themes row */}
        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 -mb-2 xl:-mb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex items-center gap-2 bg-secondary/20 p-1 rounded-2xl border border-border/40 shrink-0 min-w-max">
            <div className="px-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:flex">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </div>
            <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
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
                      : "opacity-100 ring-2 ring-transparent ring-offset-1"
                  } ${isSelected ? "!ring-primary/30 scale-105" : ""}`}
                >
                  <ThemeBadge theme={theme} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Meta & Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full xl:w-auto mt-1 xl:mt-0">
          <div className="flex items-center gap-4 bg-primary/5 px-4 h-10 rounded-2xl border border-primary/10 shrink-0">
            <span className="text-xs font-bold text-primary">
              {resultCount}{" "}
              <span className="text-primary/60 font-medium hidden sm:inline">
                of {totalCount} projects
              </span>
            </span>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 px-4 rounded-2xl text-xs font-bold tracking-wide uppercase text-destructive/70 hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => {
                onSearchChange("");
                selectedThemes.forEach(onThemeToggle);
                onSupervisorChange(null);
                if (industrialOnly) onIndustrialToggle();
              }}
            >
              <X className="h-4 w-4 mr-1.5" /> Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
