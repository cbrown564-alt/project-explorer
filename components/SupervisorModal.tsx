"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ThemeBadge } from "@/components/ThemeBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Supervisor, Project } from "@/lib/types";
import { Mail, ExternalLink, User, BookOpen, Building2 } from "lucide-react";

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
      <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden bg-white dark:bg-card border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl flex flex-col md:flex-row max-h-[90vh] gap-0 text-left font-sans ring-1 ring-border/20">
        <DialogTitle className="sr-only">{supervisor.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Supervisor profile and their research projects.
        </DialogDescription>

        {/* Left Column: Profile */}
        <div className="md:w-[35%] lg:w-[320px] xl:w-[360px] bg-secondary/15 dark:bg-secondary/20 p-6 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-border/40 shrink-0 relative">
          {/* Background accent */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-tl-3xl z-0" />

          {/* Avatar + Name */}
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground border border-border/50 shadow-inner">
              <User className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl lg:text-2xl font-extrabold leading-tight text-foreground tracking-tight">
                {supervisor.name}
              </h2>
            </div>
          </div>

          {/* Theme badges */}
          <div className="flex flex-wrap gap-2 mb-6 relative z-10">
            {supervisor.themes.map((t) => (
              <ThemeBadge key={t} theme={t} />
            ))}
          </div>

          {/* Links card */}
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm relative z-10 mb-6 space-y-3">
            {supervisor.email && (
              <a
                href={`mailto:${supervisor.email}`}
                className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/10 transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="font-medium truncate">
                  {supervisor.email}
                </span>
              </a>
            )}
            <a
              href={supervisor.pureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
            >
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/10 transition-colors">
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium">QUB Pure Profile</span>
            </a>
          </div>

          {/* Contact CTA */}
          <div className="mt-auto pt-4 relative z-10">
            <a
              href={`mailto:${supervisor.email}`}
              className="flex items-center justify-center gap-2 font-bold w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all py-3.5 rounded-xl shadow-[0_8px_20px_rgb(var(--primary)_/_0.2)] md:text-sm group"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              Contact Supervisor
            </a>
          </div>
        </div>

        {/* Right Column: Projects */}
        <div className="md:w-[65%] lg:flex-1 flex flex-col max-h-[50vh] md:max-h-none bg-white dark:bg-card">
          <ScrollArea className="flex-1">
            <div className="p-6 sm:p-8 md:p-10">
              <h3 className="text-sm font-extrabold text-primary mb-6 flex items-center gap-2 uppercase tracking-widest">
                <BookOpen className="h-4 w-4" />
                Projects ({supervisorProjects.length})
                <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              </h3>

              <div className="space-y-3">
                {supervisorProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onProjectClick(p.id);
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-secondary/15 dark:bg-secondary/10 border border-border/30 hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all group"
                  >
                    <p className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-2.5">
                      {p.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <ThemeBadge theme={p.theme} />
                      {p.industrial && (
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-400 border-none px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          <Building2 className="h-3 w-3 mr-1" />
                          {p.industrial}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
