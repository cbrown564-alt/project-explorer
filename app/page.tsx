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
import { GraduationCap } from "lucide-react";

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
        el.classList.add("ring-2", "ring-primary");
        setTimeout(
          () => el.classList.remove("ring-2", "ring-primary"),
          2000
        );
      }
    }, 100);
  }, []);

  const activeSupervisor = supervisors.find(
    (s) => s.name === supervisorModal
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  ECS8056 Project Explorer
                </h1>
                <p className="text-xs text-muted-foreground">
                  MSc AI Themed Research Projects 2026 — Queen&apos;s University Belfast
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">
              No projects match your filters.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or clearing some filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(project.id, el);
                }}
                className="transition-all duration-300"
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
