"use client";

import { ThemeBadge } from "@/components/ThemeBadge";
import { Star, User } from "lucide-react";
import type { Project, Supervisor } from "@/lib/types";

interface GraphTooltipProps {
  node: {
    id: string;
    type: "project" | "supervisor";
    data: Project | Supervisor;
    theme: string;
  };
  x: number;
  y: number;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
}

export function GraphTooltip({
  node,
  x,
  y,
  isShortlisted,
  onToggleShortlist,
}: GraphTooltipProps) {
  const isProject = node.type === "project";
  const project = isProject ? (node.data as Project) : null;
  const supervisor = !isProject ? (node.data as Supervisor) : null;

  return (
    <div
      className="absolute pointer-events-auto z-50 bg-white dark:bg-card border border-border/60 rounded-xl shadow-lg p-3 max-w-xs animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%) translateY(-12px)",
      }}
    >
      {isProject && project && (
        <div className="space-y-2">
          <h4 className="font-heading text-sm font-bold leading-snug line-clamp-2">
            {project.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {project.supervisor}
          </div>
          <div className="flex items-center gap-2">
            <ThemeBadge theme={project.theme} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist();
              }}
              className={`ml-auto p-1 rounded-full transition-colors ${
                isShortlisted
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-muted-foreground hover:text-amber-500"
              }`}
            >
              <Star
                className="h-4 w-4"
                fill={isShortlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      )}

      {!isProject && supervisor && (
        <div className="space-y-2">
          <h4 className="font-heading text-sm font-bold">{supervisor.name}</h4>
          <div className="flex flex-wrap gap-1">
            {supervisor.themes.map((t) => (
              <ThemeBadge key={t} theme={t} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {supervisor.projectCount} projects
          </p>
        </div>
      )}
    </div>
  );
}
