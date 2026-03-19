"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useShortlist } from "./hooks";
import type { Project, Supervisor, ShortlistItem } from "./types";
import projectsData from "@/data/projects.json";
import supervisorsData from "@/data/supervisors.json";

const rawProjects = projectsData as Project[];
const projects: Project[] = rawProjects.map((p) => ({
  ...p,
  keywords: p.keywords.flatMap((k) =>
    k.includes(";") ? k.split(";").map((s) => s.trim()).filter(Boolean) : [k]
  ),
}));

const supervisors = supervisorsData as Supervisor[];
const supervisorNames = [...new Set(projects.map((p) => p.supervisor))].sort();

export type ViewId = "explore" | "projects" | "supervisors" | "shortlist";
export type SortOption = "default" | "title" | "supervisor" | "theme";

interface ExplorerContextValue {
  // Data
  projects: Project[];
  supervisors: Supervisor[];
  supervisorNames: string[];

  // Filters
  search: string;
  setSearch: (v: string) => void;
  selectedThemes: string[];
  handleThemeToggle: (theme: string) => void;
  selectedSupervisor: string | null;
  setSelectedSupervisor: (v: string | null) => void;
  industrialOnly: boolean;
  setIndustrialOnly: (v: boolean) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  filteredProjects: Project[];
  clearFilters: () => void;
  hasFilters: boolean;

  // Shortlist
  shortlist: ShortlistItem[];
  toggleShortlist: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  reorderShortlist: (startIndex: number, endIndex: number) => void;
  clearShortlist: () => void;
  isShortlisted: (id: number) => boolean;
  getNote: (id: number) => string;
  shortlistCount: number;

  // Modals
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  supervisorModal: string | null;
  setSupervisorModal: (name: string | null) => void;

  // Views
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;
  navigateToView: (v: ViewId) => void;
  navigateToProjectsForSupervisor: (name: string) => void;

  // Card refs for scroll-to-highlight
  cardRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  handleProjectClick: (id: number) => void;

  // Graph highlight
  graphHighlightNodeId: string | null;
  highlightNodeInGraph: (projectId: number) => void;
  clearGraphHighlight: () => void;
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

function getInitialView(): ViewId {
  return "projects";
}

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [industrialOnly, setIndustrialOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [supervisorModal, setSupervisorModal] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveViewState] = useState<ViewId>(getInitialView);
  const { shortlist, toggle, updateNote, reorder, clear, isShortlisted, getNote, count } = useShortlist();
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [graphHighlightNodeId, setGraphHighlightNodeId] = useState<string | null>(null);

  const handleThemeToggle = useCallback((theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  }, []);

  const hasFilters = !!(search || selectedThemes.length > 0 || selectedSupervisor || industrialOnly);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedThemes([]);
    setSelectedSupervisor(null);
    setIndustrialOnly(false);
  }, []);

  const filteredProjects = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = projects.filter((p) => {
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

    if (sortBy === "title") filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "supervisor") filtered.sort((a, b) => a.supervisor.localeCompare(b.supervisor));
    else if (sortBy === "theme") filtered.sort((a, b) => a.theme.localeCompare(b.theme));

    return filtered;
  }, [search, selectedThemes, selectedSupervisor, industrialOnly, sortBy]);

  // Hash-based view sync
  const setActiveView = useCallback((v: ViewId) => {
    setActiveViewState(v);
    window.location.hash = v;
  }, []);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      const resolvedHash = hash === "compare" ? "shortlist" : hash;
      if (["explore", "projects", "supervisors", "shortlist"].includes(resolvedHash)) {
        setActiveViewState(resolvedHash as ViewId);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigateToView = useCallback(
    (v: ViewId) => setActiveView(v),
    [setActiveView]
  );

  const navigateToProjectsForSupervisor = useCallback(
    (name: string) => {
      setSelectedSupervisor(name);
      setActiveView("projects");
    },
    [setActiveView]
  );

  const highlightNodeInGraph = useCallback((projectId: number) => {
    setGraphHighlightNodeId(`p-${projectId}`);
    setActiveView("explore");
    // Auto-clear after animation
    setTimeout(() => setGraphHighlightNodeId(null), 3000);
  }, [setActiveView]);

  const clearGraphHighlight = useCallback(() => {
    setGraphHighlightNodeId(null);
  }, []);

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

  const value: ExplorerContextValue = {
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
    clearFilters,
    hasFilters,
    shortlist,
    toggleShortlist: toggle,
    updateNote,
    reorderShortlist: reorder,
    clearShortlist: clear,
    isShortlisted,
    getNote,
    shortlistCount: count,
    selectedProject,
    setSelectedProject,
    supervisorModal,
    setSupervisorModal,
    activeView,
    setActiveView,
    navigateToView,
    navigateToProjectsForSupervisor,
    cardRefs,
    handleProjectClick,
    graphHighlightNodeId,
    highlightNodeInGraph,
    clearGraphHighlight,
  };

  return (
    <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
  );
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext);
  if (!ctx) throw new Error("useExplorer must be used within ExplorerProvider");
  return ctx;
}
