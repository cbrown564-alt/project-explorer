"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeBadge } from "@/components/ThemeBadge";
import type { Project } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Building2,
  Mail,
  User,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  isShortlisted: boolean;
  onToggleShortlist: (id: number) => void;
  onSupervisorClick: (name: string) => void;
  compact?: boolean;
}

export function ProjectCard({
  project,
  isShortlisted,
  onToggleShortlist,
  onSupervisorClick,
  compact = false,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`transition-all duration-200 ${
        isShortlisted
          ? "ring-2 ring-amber-400 dark:ring-amber-500 shadow-md"
          : "hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-2">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSupervisorClick(project.supervisor)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <User className="h-3 w-3" />
                {project.supervisor}
              </button>
              <ThemeBadge theme={project.theme} />
              {project.industrial && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 text-xs"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  {project.industrial}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`shrink-0 h-8 w-8 ${
              isShortlisted
                ? "text-amber-500 hover:text-amber-600"
                : "text-muted-foreground hover:text-amber-500"
            }`}
            onClick={() => onToggleShortlist(project.id)}
          >
            <Star
              className="h-4 w-4"
              fill={isShortlisted ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </CardHeader>
      {!compact && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {project.keywords.slice(0, expanded ? undefined : 5).map((kw) => (
              <Badge
                key={kw}
                variant="secondary"
                className="text-xs font-normal"
              >
                {kw}
              </Badge>
            ))}
            {!expanded && project.keywords.length > 5 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{project.keywords.length - 5}
              </Badge>
            )}
          </div>

          {expanded && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <a
                  href={`mailto:${project.email}`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {project.email}
                </a>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Read more
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
