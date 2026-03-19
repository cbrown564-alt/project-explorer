"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  FileText, 
  Users, 
  GraduationCap, 
  FolderKanban, 
  Building2,
  Code,
  Search,
  MessageSquare,
  CheckCircle2,
  ListPlus,
  BookOpen
} from "lucide-react";

export function InfoPanel() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" className="h-10 rounded-2xl border-border/50 px-4 text-xs font-bold shadow-sm hover:bg-primary/5 hover:text-primary transition-colors" />}
      >
        <Info className="h-4 w-4 mr-2" />
        Programme Info
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-5xl p-0 overflow-y-auto bg-white dark:bg-card border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl flex flex-col md:flex-row max-h-[90vh] gap-0 text-left font-sans ring-1 ring-border/20">
        <DialogTitle className="sr-only">ECS8056 Programme Information</DialogTitle>
        <DialogDescription className="sr-only">
          Details about the ECS8056 Themed Research Project, including assessment and selection process.
        </DialogDescription>

        {/* Left Column: Overview & Key Info */}
        <div className="md:w-[35%] lg:w-[320px] xl:w-[360px] bg-secondary/15 dark:bg-secondary/20 p-6 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-border/40 shrink-0 relative">
          {/* Background accent */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-tl-3xl z-0" />

          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-6 relative z-10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20 shadow-inner">
              <BookOpen className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl lg:text-3xl font-extrabold leading-tight text-foreground tracking-tight">
                ECS8056
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Themed Research Project
              </p>
            </div>
          </div>

          {/* Key Information Blocks */}
          <div className="space-y-3 mb-8 relative z-10 flex-1">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FolderKanban className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">61 Projects</p>
                <p className="text-xs text-muted-foreground mt-1">Across 6 themed areas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">17 Supervisors</p>
                <p className="text-xs text-muted-foreground mt-1">Industry & Academic</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm">
               <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">10 Industrial Projects</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">Thales, Pytilia, Cirdan, Sourcing Lens</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-background/40 border border-border/40 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">MSc Artificial Intelligence</p>
                <p className="text-xs text-muted-foreground mt-1">Queen&apos;s University Belfast</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground leading-relaxed relative z-10 mt-auto opacity-80">
            Data sourced from the ECS8056 2026 Supervisors and Projects
            spreadsheet. Supervisor profiles link to QUB Pure research portal.
          </p>
        </div>

        {/* Right Column: Details */}
        <div className="md:w-[65%] lg:flex-1 flex flex-col max-h-[60vh] md:max-h-none bg-white dark:bg-card">
          <ScrollArea className="flex-1">
            <div className="p-6 sm:p-8 md:p-10 space-y-10">
              
              {/* Assessment Section */}
              <section>
                <h3 className="text-sm font-extrabold text-primary mb-5 flex items-center gap-2 uppercase tracking-widest">
                  Assessment
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-secondary/15 dark:bg-secondary/10 border border-border/30 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FileText className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 shadow-sm inline-flex">
                        70% Weight
                      </Badge>
                      <h4 className="text-base font-bold text-foreground mb-1">Research Paper</h4>
                      <p className="text-sm text-muted-foreground">~5,000 words detailing your research findings and methodology.</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-secondary/15 dark:bg-secondary/10 border border-border/30 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Code className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 shadow-sm inline-flex">
                        30% Weight
                      </Badge>
                      <h4 className="text-base font-bold text-foreground mb-1">Supporting Materials</h4>
                      <p className="text-sm text-muted-foreground">Software code, datasets, jupyter notebooks, and visual assets.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Selection Process Section */}
              <section>
                <h3 className="text-sm font-extrabold text-primary mb-6 flex items-center gap-2 uppercase tracking-widest">
                  Selection Process
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                </h3>
                
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-6 before:w-[2px] before:bg-border/40">
                  
                  {/* Step 1 */}
                  <div className="flex gap-4 relative">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-card border-2 border-border/40 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="pt-3 pb-6 border-b border-border/20 last:border-0 last:pb-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground leading-none mb-2">Browse Projects</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Explore the list of available projects and identify the ones that strongly align with your interests.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 relative">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-card border-2 border-border/40 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="pt-3 pb-6 border-b border-border/20 last:border-0 last:pb-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground leading-none mb-2">Contact Supervisors</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Reach out to supervisors to discuss specific projects, ask questions, and explicitly express your interest.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 relative">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-card border-2 border-border/40 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="pt-3 pb-6 border-b border-border/20 last:border-0 last:pb-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground leading-none mb-2">Evaluation</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Supervisors will review interested candidates and select the best fit students for their respective projects.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 relative">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <ListPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="pt-3 pb-6 border-b border-border/20 last:border-0 last:pb-0 flex-1">
                      <h4 className="text-sm font-bold text-primary leading-none mb-2">Multiple Interests</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You may be interested in multiple projects — that is completely fine and actively encouraged!
                      </p>
                    </div>
                  </div>

                </div>
              </section>

            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
