"use client";

import { lazy, Suspense } from "react";
import { ExplorerProvider, useExplorer } from "@/lib/explorer-context";
import { ProjectFilters } from "@/components/ProjectFilters";
import { ShortlistPanel } from "@/components/ShortlistPanel";
import { SupervisorModal } from "@/components/SupervisorModal";
import { InfoPanel } from "@/components/InfoPanel";
import { ProjectDetailsPanel } from "@/components/ProjectDetailsPanel";
import { ProjectsView } from "@/components/views/ProjectsView";
import { SupervisorsView } from "@/components/views/SupervisorsView";
import { CompareView } from "@/components/views/CompareView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Network, LayoutGrid, Users, ArrowLeftRight } from "lucide-react";
import type { ViewId } from "@/lib/explorer-context";

const GraphView = lazy(() =>
  import("@/components/views/GraphView").then((m) => ({ default: m.GraphView }))
);

function ExplorerContent() {
  const {
    projects,
    supervisors,
    supervisorNames,
    search,
    setSearch,
    selectedThemes,
    handleThemeToggle,
    selectedSupervisor,
    setSelectedSupervisor,
    industrialOnly,
    setIndustrialOnly,
    sortBy,
    setSortBy,
    filteredProjects,
    shortlist,
    toggleShortlist,
    clearShortlist,
    isShortlisted,
    shortlistCount,
    selectedProject,
    setSelectedProject,
    supervisorModal,
    setSupervisorModal,
    activeView,
    setActiveView,
    navigateToView,
    handleProjectClick,
  } = useExplorer();

  const activeSupervisor = supervisors.find((s) => s.name === supervisorModal);

  const VIEW_TABS: { id: ViewId; label: string; icon: React.ElementType }[] = [
    { id: "explore", label: "Explore", icon: Network },
    { id: "projects", label: "Projects", icon: LayoutGrid },
    { id: "supervisors", label: "Supervisors", icon: Users },
    { id: "compare", label: "Compare", icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page Header */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide text-sm mb-1">
                <GraduationCap className="h-4 w-4" />
                <span>2026 MSc Cohort</span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-foreground">
                ECS8056 Project Explorer
              </h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <InfoPanel />
              <ShortlistPanel
                projects={projects}
                shortlist={shortlist}
                onToggle={toggleShortlist}
                onClear={clearShortlist}
                isShortlisted={isShortlisted}
                onSupervisorClick={setSupervisorModal}
                onCompare={() => navigateToView("compare")}
              />
            </div>
          </div>
        </section>

        {/* View Tabs */}
        <Tabs
          value={activeView}
          onValueChange={(v) => setActiveView(v as ViewId)}
        >
          <div className="flex items-center justify-between gap-4">
            <TabsList variant="line" className="h-10">
              {VIEW_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 gap-2 text-sm"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.id === "compare" && shortlistCount > 0 && (
                    <Badge className="h-5 min-w-5 px-1.5 text-[10px]">
                      {shortlistCount}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Filters — hidden on Compare view */}
          {activeView !== "compare" && (
            <section className="sticky top-0 z-40">
              <div className="bg-background/80 backdrop-blur-xl py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 animate-in fade-in zoom-in-95 duration-500 delay-100">
                <ProjectFilters
                  search={search}
                  onSearchChange={setSearch}
                  selectedThemes={selectedThemes}
                  onThemeToggle={handleThemeToggle}
                  selectedSupervisor={selectedSupervisor}
                  onSupervisorChange={setSelectedSupervisor}
                  industrialOnly={industrialOnly}
                  onIndustrialToggle={() => setIndustrialOnly(!industrialOnly)}
                  supervisors={supervisorNames}
                  resultCount={filteredProjects.length}
                  totalCount={projects.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </section>
          )}

          {/* Tab Content */}
          <TabsContent value="explore">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  Loading graph...
                </div>
              }
            >
              <GraphView />
            </Suspense>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsView />
          </TabsContent>

          <TabsContent value="supervisors">
            <SupervisorsView />
          </TabsContent>

          <TabsContent value="compare">
            <CompareView />
          </TabsContent>
        </Tabs>
      </main>

      <SupervisorModal
        supervisor={activeSupervisor || null}
        projects={projects}
        open={!!supervisorModal}
        onClose={() => setSupervisorModal(null)}
        onProjectClick={handleProjectClick}
      />
      <ProjectDetailsPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSupervisorClick={setSupervisorModal}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ExplorerProvider>
      <ExplorerContent />
    </ExplorerProvider>
  );
}
