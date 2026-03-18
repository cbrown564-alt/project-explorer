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
        {/* Subtle Page Header */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-2">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide text-sm mb-1">
              <GraduationCap className="h-4 w-4" />
              <span>2026 MSc Cohort</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-foreground">
              ECS8056 Project Explorer
            </h1>
          </div>
        </section>

        {/* Sticky Filters & Controls Bar */}
        <section className="sticky top-4 z-40">
          <div className="bg-card/90 backdrop-blur-xl p-4 md:px-6 rounded-2xl shadow-sm border border-border/40 animate-in fade-in zoom-in-95 duration-500 delay-100">
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
            >
              <div className="flex items-center gap-3 shrink-0 border-l border-border/50 pl-3 sm:pl-4">
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
            </ProjectFilters>
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
