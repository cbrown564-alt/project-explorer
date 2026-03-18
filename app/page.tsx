"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/ProjectFilters";
import { ShortlistPanel } from "@/components/ShortlistPanel";
import { SupervisorModal } from "@/components/SupervisorModal";
import { InfoPanel } from "@/components/InfoPanel";
import { useShortlist } from "@/lib/hooks";
import type { Project, Supervisor } from "@/lib/types";
import projectsData from "@/data/projects.json";
import supervisorsData from "@/data/supervisors.json";
import { GraduationCap, Sparkles } from "lucide-react";

const projects = projectsData as Project[];
const supervisors = supervisorsData as Supervisor[];
const supervisorNames = [...new Set(projects.map((p) => p.supervisor))].sort();

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(
    null
  );
  const [industrialOnly, setIndustrialOnly] = useState(false);
  const [supervisorModal, setSupervisorModal] = useState<string | null>(null);
  const { shortlist, toggle, clear, isShortlisted } = useShortlist();
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const handleThemeToggle = useCallback((theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  }, []);

  const filteredProjects = useMemo(() => {
    const searchLower = search.toLowerCase();
    return projects.filter((p) => {
      if (
        search &&
        !p.title.toLowerCase().includes(searchLower) &&
        !p.description.toLowerCase().includes(searchLower) &&
        !p.supervisor.toLowerCase().includes(searchLower) &&
        !p.keywords.some((k) => k.toLowerCase().includes(searchLower))
      )
        return false;
      if (selectedThemes.length > 0 && !selectedThemes.includes(p.theme))
        return false;
      if (selectedSupervisor && p.supervisor !== selectedSupervisor)
        return false;
      if (industrialOnly && !p.industrial) return false;
      return true;
    });
  }, [search, selectedThemes, selectedSupervisor, industrialOnly]);

  const handleProjectClick = useCallback((id: number) => {
    setTimeout(() => {
      const el = cardRefs.current.get(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-primary", "shadow-xl", "scale-[1.02]", "z-10");
        setTimeout(
          () => el.classList.remove("ring-4", "ring-primary", "shadow-xl", "scale-[1.02]", "z-10"),
          2000
        );
      }
    }, 100);
  }, []);

  const activeSupervisor = supervisors.find(
    (s) => s.name === supervisorModal
  );

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Vibrant EdTech Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] bg-primary p-8 md:p-12 text-primary-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Abstract blurring for the soft gradient glow */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
           
           <div className="relative z-10">
             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Student Portal</span>
             </div>
             <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-5xl">
                Welcome back, <br/>
                <span className="text-white/80">Alex</span>
             </h1>
             <p className="max-w-xl text-lg text-primary-foreground/90 mt-6 leading-relaxed">
                Take your academic journey to the next level. Explore the {projects.length} Artificial Intelligence themed research projects available for the 2026 MSc cohort.
             </p>
           </div>
        </section>

        {/* Sticky Filters & Controls Bar */}
        <section className="sticky top-4 z-40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-card/90 backdrop-blur-xl p-4 md:px-6 rounded-2xl shadow-sm border border-border/40 animate-in fade-in zoom-in-95 duration-500 delay-100">
            <div className="flex-1">
              <ProjectFilters
                search={search}
                onSearchChange={setSearch}
                selectedThemes={selectedThemes}
                onThemeToggle={handleThemeToggle}
                selectedSupervisor={selectedSupervisor}
                onSupervisorChange={setSelectedSupervisor}
                industrialOnly={industrialOnly}
                onIndustrialToggle={() => setIndustrialOnly((p) => !p)}
                supervisors={supervisorNames}
                resultCount={filteredProjects.length}
                totalCount={projects.length}
              />
            </div>
            <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 md:pl-6 md:border-l border-border/50">
              <InfoPanel />
              <ShortlistPanel
                projects={projects}
                shortlist={shortlist}
                onToggle={toggle}
                onClear={clear}
                isShortlisted={isShortlisted}
                onSupervisorClick={setSupervisorModal}
              />
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section>
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-[2rem] border border-dashed border-border/60 animate-in fade-in zoom-in-95">
              <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                No projects found
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search terms or clearing some of the active filters to see more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(project.id, el);
                  }}
                  className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${Math.min(idx * 50, 400)}ms`, animationFillMode: 'both' }}
                >
                  <ProjectCard
                    project={project}
                    isShortlisted={isShortlisted(project.id)}
                    onToggleShortlist={toggle}
                    onSupervisorClick={setSupervisorModal}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SupervisorModal
        supervisor={activeSupervisor || null}
        projects={projects}
        open={!!supervisorModal}
        onClose={() => setSupervisorModal(null)}
        onProjectClick={handleProjectClick}
      />
    </div>
  );
}
