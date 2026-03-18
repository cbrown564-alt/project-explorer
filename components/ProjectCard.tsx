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
  ArrowRight
} from "lucide-react";

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
  return (
    <motion.div layout className="h-full">
      <Card
        onClick={() => onSelect?.(project)}
        className={`flex flex-col h-full transition-all duration-300 rounded-[1.5rem] border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.05)] hover:-translate-y-1 cursor-pointer group ${
          isShortlisted
            ? "ring-2 ring-primary/20 bg-primary/5"
            : "bg-white dark:bg-card"
        }`}
      >
        <CardHeader className="pb-0 pt-6 px-6 relative flex-none">
          <div className="flex items-start justify-between gap-4">
            <h3
              className="font-heading font-bold text-lg leading-snug text-foreground tracking-tight line-clamp-3 min-h-[4rem]"
              title={project.title}
            >
              {project.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className={`shrink-0 h-10 w-10 -mr-2 -mt-2 rounded-full transition-colors z-10 ${
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
                className="h-5 w-5 transition-transform active:scale-75"
                fill={isShortlisted ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 pt-4 flex-1 flex flex-col justify-between">
          <div className="space-y-5">
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
              <div className="flex flex-wrap gap-2">
                {project.keywords.slice(0, 4).map((kw) => (
                  <Badge
                    key={kw}
                    variant="secondary"
                    className="text-[11px] font-semibold bg-secondary/60 text-secondary-foreground rounded-full px-2.5 py-1 border-transparent"
                  >
                    {kw}
                  </Badge>
                ))}
                {project.keywords.length > 4 && (
                  <Badge variant="outline" className="text-[11px] font-semibold text-muted-foreground rounded-full px-2.5 py-1 border-border/50 bg-transparent">
                    +{project.keywords.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {!compact && (
            <div className="mt-6 flex items-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
              <span>View details</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
