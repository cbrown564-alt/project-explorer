"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeBadge } from "@/components/ThemeBadge";
import type { Supervisor, Project } from "@/lib/types";
import { Mail, ExternalLink, BookOpen } from "lucide-react";

interface SupervisorModalProps {
  supervisor: Supervisor | null;
  projects: Project[];
  open: boolean;
  onClose: () => void;
  onProjectClick: (id: number) => void;
}

export function SupervisorModal({
  supervisor,
  projects,
  open,
  onClose,
  onProjectClick,
}: SupervisorModalProps) {
  if (!supervisor) return null;

  const supervisorProjects = projects.filter(
    (p) => p.supervisor === supervisor.name
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{supervisor.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${supervisor.email}`}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {supervisor.email}
            </a>
            <a
              href={supervisor.pureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              QUB Pure Profile
            </a>
          </div>

          <div className="flex flex-wrap gap-1">
            {supervisor.themes.map((t) => (
              <ThemeBadge key={t} theme={t} />
            ))}
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Projects ({supervisorProjects.length})
            </h4>
            <div className="space-y-2">
              {supervisorProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onProjectClick(p.id);
                  }}
                  className="w-full text-left p-2 rounded-md border hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium leading-tight">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <ThemeBadge theme={p.theme} />
                    {p.industrial && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {p.industrial}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
