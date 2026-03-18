"use client";

import { useMemo } from "react";
import { useExplorer } from "@/lib/explorer-context";
import { ThemeBadge } from "@/components/ThemeBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";
import { getRelatedProjects } from "@/lib/graph-data";
import {
  Star,
  ArrowLeft,
  Building2,
  X,
  Plus,
} from "lucide-react";

export function CompareView() {
  const {
    projects,
    shortlist,
    toggleShortlist,
    isShortlisted,
    navigateToView,
    setSelectedProject,
    setSupervisorModal,
  } = useExplorer();

  const shortlistedProjects = useMemo(
    () => shortlist.map(item => projects.find(p => p.id === item.id)).filter(Boolean) as Project[],
    [projects, shortlist]
  );

  // Related projects: aggregate across all shortlisted, exclude those already shortlisted
  const relatedProjects = useMemo(() => {
    if (shortlistedProjects.length === 0) return [];

    const scoreMap = new Map<number, number>();
    for (const sp of shortlistedProjects) {
      const related = getRelatedProjects(sp.id, projects);
      related.forEach((p, idx) => {
        if (!isShortlisted(p.id)) {
          scoreMap.set(p.id, (scoreMap.get(p.id) || 0) + (related.length - idx));
        }
      });
    }

    return [...scoreMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => projects.find((p) => p.id === id)!)
      .filter(Boolean);
  }, [shortlistedProjects, projects, shortlist]);

  if (shortlistedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-[2rem] border border-dashed border-border/60 animate-in fade-in zoom-in-95">
        <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <Star className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-heading text-lg font-bold text-foreground mb-1">
          No projects to compare
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Star some projects from the Projects or Explore views to compare them
          side by side.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToView("projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Browse projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Comparison table */}
      <div className="overflow-x-auto">
        <div
          className="inline-flex gap-4 min-w-full pb-4"
          style={{ minWidth: `${shortlistedProjects.length * 280}px` }}
        >
          {shortlistedProjects.map((project) => (
            <div
              key={project.id}
              className="w-[280px] shrink-0 bg-white dark:bg-card rounded-xl border border-border/40 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3
                  className="font-heading text-sm font-bold leading-snug line-clamp-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  {project.title}
                </h3>
                <button
                  onClick={() => toggleShortlist(project.id)}
                  className="shrink-0 p-1 rounded-full text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove from shortlist"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm flex-1">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Supervisor
                  </p>
                  <p className="text-foreground font-medium text-xs">
                    {project.supervisor}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Theme
                  </p>
                  <ThemeBadge theme={project.theme} />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/40 rounded-md px-2 py-0.5"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {project.industrial && (
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Industry Partner
                    </p>
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <Building2 className="h-3 w-3 mr-0.5" />
                      {project.industrial}
                    </Badge>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Description
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">
            You might also like
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Projects related to your shortlist by shared keywords and themes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {relatedProjects.map((project) => (
              <div key={project.id} className="relative">
                <ProjectCard
                  project={project}
                  isShortlisted={isShortlisted(project.id)}
                  onToggleShortlist={toggleShortlist}
                  onSupervisorClick={setSupervisorModal}
                  onSelect={setSelectedProject}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
