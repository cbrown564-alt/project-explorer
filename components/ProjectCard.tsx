"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div layout className="h-full">
      <Card
        className={`h-full transition-all duration-300 rounded-[1.5rem] border-transparent shadow-sm hover:shadow-lg ${
          isShortlisted
            ? "ring-4 ring-primary/20 bg-primary/[0.02]"
            : "bg-white dark:bg-card"
        }`}
      >
        <CardHeader className="pb-3 pt-6 px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-snug mb-3 text-foreground tracking-tight">
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSupervisorClick(project.supervisor)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-2.5 py-1 rounded-full"
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
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`shrink-0 h-10 w-10 rounded-full transition-colors ${
                isShortlisted
                  ? "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
              onClick={() => onToggleShortlist(project.id)}
            >
              <Star
                className="h-5 w-5 transition-transform active:scale-75"
                fill={isShortlisted ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </CardHeader>
        {!compact && (
          <CardContent className="px-6 pb-6 pt-0">
            <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
              {project.keywords.slice(0, expanded ? undefined : 4).map((kw) => (
                <Badge
                  key={kw}
                  variant="secondary"
                  className="text-xs font-semibold bg-secondary/60 text-secondary-foreground rounded-lg px-2 py-0.5 border-transparent"
                >
                  {kw}
                </Badge>
              ))}
              {!expanded && project.keywords.length > 4 && (
                <Badge variant="secondary" className="text-xs font-semibold bg-secondary/60 text-secondary-foreground rounded-lg px-2 py-0.5 border-transparent">
                  +{project.keywords.length - 4}
                </Badge>
              )}
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-4 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                      <a
                        href={`mailto:${project.email}`}
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold w-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors py-2.5 rounded-xl border border-primary/10"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Contact {project.email}
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/50 rounded-xl py-5"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1.5" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1.5" /> Read abstract
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
