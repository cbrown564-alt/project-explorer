"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ThemeBadge } from "@/components/ThemeBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/lib/types";
import { User, Building2, Mail } from "lucide-react";

interface ProjectDetailsPanelProps {
  project: Project | null;
  onClose: () => void;
  onSupervisorClick: (name: string) => void;
  supervisorPhotoUrl?: string | null;
}

export function ProjectDetailsPanel({
  project,
  onClose,
  onSupervisorClick,
  supervisorPhotoUrl,
}: ProjectDetailsPanelProps) {
  // Split description into distinct paragraphs to create proper reading spacing
  const descriptionParagraphs = project?.description
    ? project.description.split(/\n+/).filter((p) => p.trim() !== "")
    : [];

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      {/* 
        Width fixes: max-w-[90vw] md:max-w-5xl lg:max-w-6xl
        We use w-[95vw] sm:w-[90vw] to ensure it uses the allowed max width. 
      */}
      <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-[90vw] lg:max-w-5xl xl:max-w-6xl p-0 overflow-hidden bg-white dark:bg-card border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl flex flex-col md:flex-row max-h-[90vh] gap-0 text-left font-sans ring-1 ring-border/20">
        <DialogTitle className="sr-only">{project?.title || "Project Details"}</DialogTitle>
        <DialogDescription className="sr-only">Detailed view of the selected research project.</DialogDescription>
        
        {project && (
          <>
            {/* Left Column: Metadata & Actions */}
            {/* Reduced padding, fixed max width for better balance */}
            <div className="md:w-[35%] lg:w-[320px] xl:w-[380px] bg-secondary/15 dark:bg-secondary/20 p-6 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-border/40 shrink-0 relative">
              
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-tl-3xl z-0"></div>

              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                <ThemeBadge theme={project.theme} />
                {project.industrial && (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-400 border-none px-2.5 py-1 rounded-full text-[10px] items-center font-bold uppercase tracking-wider shadow-sm">
                    <Building2 className="h-3 w-3 mr-1" />
                    {project.industrial}
                  </Badge>
                )}
              </div>

              {/* Title size optimized so it limits awkward wrapping */}
              <h2 className="font-heading text-2xl lg:text-3xl font-extrabold leading-tight mb-8 text-foreground tracking-tight relative z-10">
                {project.title}
              </h2>

              {/* Refined Supervisor Layout */}
              <div className="flex items-start gap-4 mb-8 p-4 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm relative z-10 transition-colors hover:bg-white dark:hover:bg-background/60">
                {supervisorPhotoUrl ? (
                  <img
                    src={supervisorPhotoUrl}
                    alt={project.supervisor}
                    className="h-10 w-10 mt-0.5 rounded-full object-cover shrink-0 border border-border/50 shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 mt-0.5 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground border border-border/50 shadow-inner">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-80">
                    Supervisor
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onSupervisorClick(project.supervisor);
                    }}
                    className="font-bold text-sm lg:text-base text-foreground hover:text-primary transition-colors text-left"
                  >
                    {project.supervisor}
                  </button>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <h3 className="text-[10px] font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-widest opacity-80">
                   Keywords <span className="h-px bg-border/50 flex-1 ml-2"></span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.keywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="text-[10px] lg:text-[11px] font-medium bg-white/60 dark:bg-background/60 text-foreground rounded-lg px-2.5 py-1 border-none shadow-sm"
                    >
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 relative z-10">
                <a
                  href={`mailto:${project.email}`}
                  className="flex items-center justify-center gap-2 font-bold w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all py-3.5 rounded-xl shadow-[0_8px_20px_rgb(var(--primary)_/_0.2)] md:text-sm group"
                >
                  <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Contact Supervisor
                </a>
              </div>
            </div>

            {/* Right Column: Abstract Reading Area */}
            {/* Width optimized for character line length (max-w-3xl) */}
            <div className="md:w-[65%] lg:flex-1 flex flex-col max-h-[50vh] md:max-h-none bg-white dark:bg-card">
              <ScrollArea className="flex-1">
                <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-sm font-extrabold text-primary mb-6 flex items-center gap-2 uppercase tracking-widest">
                      Abstract 
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                    </h3>
                    <div className="text-foreground/80 leading-[1.8] space-y-5 text-left font-sans text-sm md:text-[15px] lg:text-base">
                      {descriptionParagraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
