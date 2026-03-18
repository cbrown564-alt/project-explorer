"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeBadge } from "@/components/ThemeBadge";
import { THEMES } from "@/lib/types";
import { Search, X, SlidersHorizontal } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, keywords, supervisors..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeToggle(theme)}
            className={`transition-opacity ${
              selectedThemes.length > 0 && !selectedThemes.includes(theme)
                ? "opacity-40 hover:opacity-70"
                : ""
            }`}
          >
            <ThemeBadge theme={theme} />
          </button>
        ))}
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          variant={industrialOnly ? "default" : "outline"}
          size="sm"
          className="text-xs h-6"
          onClick={onIndustrialToggle}
        >
          Industrial
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedSupervisor || ""}
          onChange={(e) =>
            onSupervisorChange(e.target.value || null)
          }
          className="text-xs border rounded-md px-2 py-1 bg-background"
        >
          <option value="">All supervisors</option>
          {supervisors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <span className="text-xs text-muted-foreground ml-auto">
          {resultCount} of {totalCount} projects
        </span>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6"
            onClick={() => {
              onSearchChange("");
              selectedThemes.forEach(onThemeToggle);
              onSupervisorChange(null);
              if (industrialOnly) onIndustrialToggle();
            }}
          >
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
