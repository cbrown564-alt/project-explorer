"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { useExplorer } from "@/lib/explorer-context";
import { GraduationCap } from "lucide-react";

export function ProjectsView() {
  const {
    filteredProjects,
    isShortlisted,
    toggleShortlist,
    setSupervisorModal,
    setSelectedProject,
    cardRefs,
  } = useExplorer();

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-[2rem] border border-dashed border-border/60 animate-in fade-in zoom-in-95">
        <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <GraduationCap className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-heading text-lg font-bold text-foreground mb-1">
          No projects found
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search terms or clearing some of the active filters
          to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProjects.map((project, idx) => (
        <div
          key={project.id}
          ref={(el) => {
            if (el) cardRefs.current.set(project.id, el);
          }}
          className="h-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
          style={{
            animationDelay: `${Math.min(idx * 50, 400)}ms`,
            animationFillMode: "both",
          }}
        >
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
  );
}
