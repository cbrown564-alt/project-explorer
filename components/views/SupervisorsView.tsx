"use client";

import { useState } from "react";
import { useExplorer } from "@/lib/explorer-context";
import { ThemeBadge } from "@/components/ThemeBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import {
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  Building2,
  User,
} from "lucide-react";

export function SupervisorsView() {
  const {
    supervisors,
    projects,
    filteredProjects,
    hasFilters,
    isShortlisted,
    toggleShortlist,
    setSelectedProject,
    navigateToProjectsForSupervisor,
  } = useExplorer();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // Sort supervisors: those with matching projects first when filters active
  const filteredIds = new Set(filteredProjects.map((p) => p.id));
  const sortedSupervisors = [...supervisors].sort((a, b) => {
    if (!hasFilters) return a.name.localeCompare(b.name);
    const aMatches = a.projects.filter((id) => filteredIds.has(id)).length;
    const bMatches = b.projects.filter((id) => filteredIds.has(id)).length;
    return bMatches - aMatches;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedSupervisors.map((supervisor) => {
        const supervisorProjects = projects.filter(
          (p) => p.supervisor === supervisor.name
        );
        const matchCount = hasFilters
          ? supervisorProjects.filter((p) => filteredIds.has(p.id)).length
          : supervisorProjects.length;
        const isDimmed = hasFilters && matchCount === 0;
        const isExpanded = expanded.has(supervisor.name);

        return (
          <div
            key={supervisor.name}
            className={`bg-white dark:bg-card rounded-xl border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] p-5 flex flex-col transition-opacity duration-200 ${
              isDimmed ? "opacity-40" : ""
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-foreground truncate">
                  {supervisor.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {supervisor.email && (
                    <a
                      href={`mailto:${supervisor.email}`}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      Email
                    </a>
                  )}
                  <a
                    href={supervisor.pureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Pure
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {supervisor.themes.map((t) => (
                <ThemeBadge key={t} theme={t} />
              ))}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {matchCount}
                </span>
                {hasFilters && matchCount !== supervisorProjects.length && (
                  <span> of {supervisorProjects.length}</span>
                )}{" "}
                projects
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() =>
                    navigateToProjectsForSupervisor(supervisor.name)
                  }
                >
                  View all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleExpanded(supervisor.name)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-1.5 mt-1 border-t border-border/40 pt-3">
                {supervisorProjects.map((p) => {
                  const isMatch = !hasFilters || filteredIds.has(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className={`w-full text-left p-2.5 rounded-lg border border-border/40 hover:bg-accent transition-colors ${
                        !isMatch ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShortlist(p.id);
                          }}
                          className={`shrink-0 p-1 rounded-full transition-colors ${
                            isShortlisted(p.id)
                              ? "text-amber-500"
                              : "text-muted-foreground/40 hover:text-amber-500"
                          }`}
                        >
                          <Star
                            className="h-3.5 w-3.5"
                            fill={isShortlisted(p.id) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <ThemeBadge theme={p.theme} />
                        {p.industrial && (
                          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <Building2 className="h-3 w-3 mr-0.5" />
                            {p.industrial}
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
