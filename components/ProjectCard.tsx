"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeBadge } from "@/components/ThemeBadge";
import type { Project } from "@/lib/types";
import {
  Star,
  Building2,
  User,
  Network,
} from "lucide-react";
import { useExplorer } from "@/lib/explorer-context";

interface ProjectCardProps {
  project: Project;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onSupervisorClick: (name: string) => void;
  onSelect?: (project: Project) => void;
  compact?: boolean;
}

export function ProjectCard({
  project,
  isShortlisted,
  onToggleShortlist,
  onSupervisorClick,
  onSelect,
  compact = false,
}: ProjectCardProps) {
  const { highlightNodeInGraph } = useExplorer();

  return (
    <motion.div layout className={compact ? "" : "h-full"}>
      <Card
        onClick={() => onSelect?.(project)}
        className={`flex flex-col transition-all duration-300 rounded-xl border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)] hover:-translate-y-1 cursor-pointer group ${
          compact ? "" : "h-full"
        } ${
          isShortlisted
            ? "ring-2 ring-primary/20 bg-primary/5"
            : "bg-white dark:bg-card"
        }`}
      >
        <CardHeader className={`${compact ? "p-3 pb-0" : "pb-0 pt-5 px-5"} relative flex-none`}>
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-heading font-bold leading-snug text-foreground tracking-tight ${
                compact ? "text-base line-clamp-2" : "text-[1.05rem] line-clamp-3"
              }`}
              title={project.title}
            >
              {project.title}
            </h3>
            <div className="flex items-center shrink-0 -mr-2 -mt-2 gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full transition-colors z-10 ${
                  compact ? "h-7 w-7" : "h-8 w-8"
                } text-muted-foreground hover:text-primary hover:bg-primary/10`}
                onClick={(e) => {
                  e.stopPropagation();
                  highlightNodeInGraph(project.id);
                }}
                title="Show in Graph"
              >
                <Network className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full transition-colors z-10 ${
                  compact ? "h-8 w-8" : "h-9 w-9"
                } ${
                  isShortlisted
                    ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-600 dark:text-amber-400 dark:bg-amber-400/10"
                    : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleShortlist(project.id);
                }}
              >
                <Star
                  className={`${compact ? "h-4 w-4" : "h-4.5 w-4.5"} transition-transform active:scale-75`}
                  fill={isShortlisted ? "currentColor" : "none"}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className={`${compact ? "p-3 pt-2" : "px-5 pb-5 pt-3"} flex-1 flex flex-col justify-between`}>
          <div className={`${compact ? "space-y-2" : "space-y-3"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSupervisorClick(project.supervisor);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-2.5 py-1 rounded-full z-10"
              >
                <User className="h-3 w-3" />
                {project.supervisor}
              </button>
              <ThemeBadge theme={project.theme} />
              {project.industrial && (
                <Badge
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-400 border-none px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  {project.industrial}
                </Badge>
              )}
            </div>

            {!compact && (
              <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}

            {!compact && (
              <div className="flex flex-wrap gap-1.5">
                {project.keywords.slice(0, 4).map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/40 rounded-md px-2 py-0.5"
                  >
                    {kw}
                  </span>
                ))}
                {project.keywords.length > 4 && (
                  <span className="text-[10px] font-medium text-muted-foreground/50 px-1 py-0.5">
                    +{project.keywords.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
