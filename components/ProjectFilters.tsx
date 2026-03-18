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
  children?: React.ReactNode;
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
  children,
}: FiltersProps) {
  const hasFilters =
    search || selectedThemes.length > 0 || selectedSupervisor || industrialOnly;

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground bg-secondary/80 p-1 rounded-full hover:bg-muted transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 xl:gap-4 w-full">
        {/* Themes row */}
        <div className="flex flex-wrap items-center gap-2.5 bg-secondary/20 p-1.5 rounded-2xl border border-border/40 shrink-0">
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
                  isDimmed ? "opacity-30 grayscale hover:opacity-70 hover:grayscale-0" : "opacity-100 ring-2 ring-transparent ring-offset-1"
                } ${isSelected ? "!ring-primary/30 scale-105" : ""}`}
              >
                <ThemeBadge theme={theme} />
              </button>
            );
          })}
          <div className="h-6 w-px bg-border/50 mx-1" />
          <Button
            variant={industrialOnly ? "default" : "outline"}
            size="sm"
            className={`h-8 px-4 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${
              industrialOnly ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20" : "bg-transparent border-dashed text-muted-foreground hover:bg-secondary"
            }`}
            onClick={onIndustrialToggle}
          >
            Industrial Phase
          </Button>
        </div>

        {/* Supervisor Select */}
        <div className="relative min-w-[200px] flex-grow xl:flex-grow-0 xl:max-w-xs shrink-0">
          <select
            value={selectedSupervisor || ""}
            onChange={(e) =>
              onSupervisorChange(e.target.value || null)
            }
            className="appearance-none w-full h-10 text-sm font-semibold border-none rounded-2xl px-4 py-2 bg-secondary/60 text-foreground hover:bg-secondary/80 focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">All Academic Supervisors</option>
            {supervisors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ArrowDownWideNarrow className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Meta & Actions */}
        <div className="flex flex-wrap items-center gap-3 ml-auto shrink-0">
          <div className="flex items-center gap-4 bg-primary/5 px-4 h-10 rounded-2xl border border-primary/10 shrink-0">
            <span className="text-xs font-bold text-primary">
              {resultCount} <span className="text-primary/60 font-medium hidden sm:inline">of {totalCount} projects</span>
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

          {children}
        </div>
      </div>
    </div>
  );
}
