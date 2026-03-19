"use client";

import { useMemo, useState, useCallback } from "react";
import { useExplorer } from "@/lib/explorer-context";
import { ThemeBadge } from "@/components/ThemeBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";
import { getRelatedProjects } from "@/lib/graph-data";
import {
  Star,
  ArrowLeft,
  Building2,
  X,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  ChevronRight,
  Eye,
  Check,
} from "lucide-react";

/* ─── Desktop: Comparison Table ─── */
function DesktopTable({
  shortlistedProjects,
  shortlist,
}: {
  shortlistedProjects: Project[];
  shortlist: ReturnType<typeof useExplorer>;
}) {
  const {
    toggleShortlist,
    reorderShortlist,
    updateNote,
    getNote,
    setSelectedProject,
    supervisors,
    setSupervisorModal,
  } = shortlist;

  const [expandedDesc, setExpandedDesc] = useState<Set<number>>(new Set());

  const toggleDesc = (id: number) =>
    setExpandedDesc((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Shared cell styles
  const labelCellBase =
    "sticky left-0 z-10 px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/40 dark:bg-muted/20 border-r border-border/30";
  const dataCellBase = "px-4 py-3 border-l border-border/15";
  const stripeClass = "bg-muted/20 dark:bg-muted/10";

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.3)] max-w-full w-fit min-w-0">
      <table className="text-sm border-collapse">
        {/* Column header: project titles */}
        <thead>
          <tr className="bg-muted/50 dark:bg-muted/25">
            <th className="sticky left-0 z-20 w-[140px] min-w-[140px] bg-muted/60 dark:bg-muted/30 border-r border-border/30 border-b border-b-border/40 p-4">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Project
              </span>
            </th>
            {shortlistedProjects.map((p) => (
              <th
                key={p.id}
                className="w-[260px] min-w-[220px] p-4 text-left border-l border-border/15 border-b border-b-border/40 align-top"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    className="font-heading text-[13px] font-bold leading-snug text-left hover:text-primary transition-colors line-clamp-3"
                    onClick={() => setSelectedProject(p)}
                  >
                    {p.title}
                  </button>
                  <button
                    onClick={() => toggleShortlist(p.id)}
                    className="shrink-0 p-1 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors mt-0.5"
                    title="Remove from shortlist"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Rank */}
          <tr>
            <td className={labelCellBase}>Rank</td>
            {shortlistedProjects.map((p, idx) => (
              <td key={p.id} className={dataCellBase}>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col -space-y-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => reorderShortlist(idx, idx - 1)}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => reorderShortlist(idx, idx + 1)}
                      disabled={idx === shortlistedProjects.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center tabular-nums">
                    {idx + 1}
                  </span>
                </div>
              </td>
            ))}
          </tr>

          {/* Supervisor */}
          <tr className={stripeClass}>
            <td className={labelCellBase}>Supervisor</td>
            {shortlistedProjects.map((p) => {
              const sup = supervisors.find((s) => s.name === p.supervisor);
              return (
                <td
                  key={p.id}
                  className={`${dataCellBase} `}
                >
                  <button
                    className="flex items-center gap-2.5 group/sup text-left"
                    onClick={() => setSupervisorModal(p.supervisor)}
                  >
                    {sup?.photoUrl ? (
                      <img
                        src={sup.photoUrl}
                        alt={p.supervisor}
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-border/30 shrink-0"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground ring-2 ring-border/30 shrink-0">
                        {p.supervisor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <span className="text-sm font-medium group-hover/sup:text-primary transition-colors">
                      {p.supervisor}
                    </span>
                  </button>
                </td>
              );
            })}
          </tr>

          {/* Theme */}
          <tr>
            <td className={labelCellBase}>Theme</td>
            {shortlistedProjects.map((p) => (
              <td
                key={p.id}
                className={`${dataCellBase} `}
              >
                <ThemeBadge theme={p.theme} />
              </td>
            ))}
          </tr>

          {/* Keywords */}
          <tr className={stripeClass}>
            <td className={labelCellBase}>Keywords</td>
            {shortlistedProjects.map((p) => (
              <td key={p.id} className={dataCellBase}>
                <div className="flex flex-wrap gap-1">
                  {p.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/50 rounded-md px-2 py-0.5"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {/* Industry */}
          <tr>
            <td className={labelCellBase}>Industry</td>
            {shortlistedProjects.map((p) => (
              <td key={p.id} className={dataCellBase}>
                {p.industrial ? (
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Building2 className="h-3 w-3 mr-0.5" />
                    {p.industrial}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground/40">—</span>
                )}
              </td>
            ))}
          </tr>

          {/* Description */}
          <tr className={stripeClass}>
            <td className={`${labelCellBase} align-top pt-4`}>Description</td>
            {shortlistedProjects.map((p) => (
              <td
                key={p.id}
                className={`${dataCellBase} align-top`}
              >
                <p
                  className={`text-xs text-muted-foreground leading-relaxed ${expandedDesc.has(p.id) ? "" : "line-clamp-2"}`}
                >
                  {p.description}
                </p>
                <button
                  onClick={() => toggleDesc(p.id)}
                  className="text-[10px] text-primary font-semibold mt-1 hover:underline"
                >
                  {expandedDesc.has(p.id) ? "Show less" : "Show more"}
                </button>
              </td>
            ))}
          </tr>

          {/* Notes */}
          <tr>
            <td className={`${labelCellBase} align-top pt-4`}>Notes</td>
            {shortlistedProjects.map((p) => (
              <td
                key={p.id}
                className={`${dataCellBase} align-top`}
              >
                <textarea
                  placeholder="Add a note…"
                  className="w-full text-xs p-2.5 rounded-xl border border-border/40 bg-background/80 focus:bg-background resize-y min-h-[60px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans placeholder:text-muted-foreground/40"
                  value={getNote(p.id)}
                  onChange={(e) => updateNote(p.id, e.target.value)}
                />
              </td>
            ))}
          </tr>

          {/* Actions */}
          <tr className="border-t border-border/30">
            <td className={labelCellBase}>Actions</td>
            {shortlistedProjects.map((p) => (
              <td key={p.id} className={dataCellBase}>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 rounded-lg"
                    onClick={() => setSelectedProject(p)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-destructive/70 hover:text-destructive"
                    onClick={() => toggleShortlist(p.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─── Mobile: Ranked List ─── */
function MobileRankedList({
  shortlistedProjects,
  shortlist,
}: {
  shortlistedProjects: Project[];
  shortlist: ReturnType<typeof useExplorer>;
}) {
  const {
    toggleShortlist,
    reorderShortlist,
    updateNote,
    getNote,
    setSelectedProject,
  } = shortlist;

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {shortlistedProjects.map((p, idx) => {
        const isExpanded = expandedId === p.id;
        return (
          <div
            key={p.id}
            className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-sm"
          >
            {/* Collapsed row */}
            <button
              className="w-full flex items-center gap-3 p-3 text-left"
              onClick={() => setExpandedId(isExpanded ? null : p.id)}
            >
              {/* Rank controls */}
              <div className="flex flex-col items-center shrink-0 -space-y-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderShortlist(idx, idx - 1);
                  }}
                  disabled={idx === 0}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderShortlist(idx, idx + 1);
                  }}
                  disabled={idx === shortlistedProjects.length - 1}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-snug line-clamp-2">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.supervisor}
                </p>
                <div className="mt-1">
                  <ThemeBadge theme={p.theme} />
                </div>
              </div>

              <ChevronRight
                className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>

            {/* Expanded details */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/40 rounded-md px-2 py-0.5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.industrial && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Industry
                      </p>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Building2 className="h-3 w-3 mr-0.5" />
                        {p.industrial}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Description
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Notes
                  </p>
                  <textarea
                    placeholder="Add a note…"
                    className="w-full text-xs p-2 rounded-lg border border-border/50 bg-secondary/10 dark:bg-secondary/5 focus:bg-background resize-y min-h-[56px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans placeholder:text-muted-foreground/50"
                    value={getNote(p.id)}
                    onChange={(e) => updateNote(p.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 flex-1"
                    onClick={() => setSelectedProject(p)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 text-destructive"
                    onClick={() => toggleShortlist(p.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Mobile: Compare 2 mode ─── */
function MobileCompare2({
  shortlistedProjects,
  shortlist,
}: {
  shortlistedProjects: Project[];
  shortlist: ReturnType<typeof useExplorer>;
}) {
  const { getNote } = shortlist;
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(
    shortlistedProjects.length > 1 ? 1 : 0
  );

  const left = shortlistedProjects[leftIdx];
  const right = shortlistedProjects[rightIdx];

  if (!left || !right) return null;

  const attrs: {
    label: string;
    render: (p: Project) => React.ReactNode;
  }[] = [
    {
      label: "Supervisor",
      render: (p) => (
        <span className="text-sm font-medium">{p.supervisor}</span>
      ),
    },
    {
      label: "Theme",
      render: (p) => <ThemeBadge theme={p.theme} />,
    },
    {
      label: "Keywords",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/40 rounded-md px-2 py-0.5"
            >
              {kw}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Industry",
      render: (p) =>
        p.industrial ? (
          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Building2 className="h-3 w-3 mr-0.5" />
            {p.industrial}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      label: "Description",
      render: (p) => (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
          {p.description}
        </p>
      ),
    },
    {
      label: "Notes",
      render: (p) => {
        const note = getNote(p.id);
        return note ? (
          <p className="text-xs text-foreground italic">{note}</p>
        ) : (
          <span className="text-xs text-muted-foreground/50">No notes</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <select
          className="w-full text-xs p-2 rounded-lg border border-border/50 bg-background"
          value={leftIdx}
          onChange={(e) => setLeftIdx(Number(e.target.value))}
        >
          {shortlistedProjects.map((p, i) => (
            <option key={p.id} value={i}>
              {p.title}
            </option>
          ))}
        </select>
        <select
          className="w-full text-xs p-2 rounded-lg border border-border/50 bg-background"
          value={rightIdx}
          onChange={(e) => setRightIdx(Number(e.target.value))}
        >
          {shortlistedProjects.map((p, i) => (
            <option key={p.id} value={i}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Attribute-by-attribute */}
      <div className="space-y-4">
        {attrs.map((attr) => (
          <div key={attr.label}>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              {attr.label}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                {attr.render(left)}
              </div>
              <div className="p-2 rounded-lg bg-secondary/10">
                {attr.render(right)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main CompareView ─── */
export function CompareView() {
  const explorer = useExplorer();
  const {
    projects,
    shortlist,
    toggleShortlist,
    isShortlisted,
    navigateToView,
    setSelectedProject,
    setSupervisorModal,
    clearShortlist,
    getNote,
    shortlistCount,
  } = explorer;

  const [mobileMode, setMobileMode] = useState<"list" | "compare">("list");
  const [copied, setCopied] = useState(false);

  const shortlistedProjects = useMemo(
    () =>
      shortlist
        .map((item) => projects.find((p) => p.id === item.id))
        .filter(Boolean) as Project[],
    [projects, shortlist]
  );

  // Related projects
  const relatedProjects = useMemo(() => {
    if (shortlistedProjects.length === 0) return [];

    const scoreMap = new Map<number, number>();
    for (const sp of shortlistedProjects) {
      const related = getRelatedProjects(sp.id, projects);
      related.forEach((p, idx) => {
        if (!isShortlisted(p.id)) {
          scoreMap.set(p.id, (scoreMap.get(p.id) || 0) + (related.length - idx));
        }
      });
    }

    return [...scoreMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => projects.find((p) => p.id === id)!)
      .filter(Boolean);
  }, [shortlistedProjects, projects, isShortlisted]);

  const exportShortlist = useCallback(() => {
    const text = shortlistedProjects
      .map((p, i) => {
        const note = getNote(p.id);
        return `${i + 1}. ${p.title}\n   Supervisor: ${p.supervisor} (${p.email})\n   Theme: ${p.theme}${p.industrial ? `\n   Industry: ${p.industrial}` : ""}\n   Keywords: ${p.keywords.join(", ")}${note ? `\n   Notes: ${note}` : ""}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(
      `My ECS8056 Project Shortlist\n${"=".repeat(30)}\n\n${text}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shortlistedProjects, getNote]);

  // Empty state
  if (shortlistedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-[2rem] border border-dashed border-border/60 animate-in fade-in zoom-in-95">
        <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <Star className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-heading text-lg font-bold text-foreground mb-1">
          Your shortlist is empty
        </p>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Star some projects from the Projects or Explore views to build your
          shortlist and compare them here.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToView("projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Browse projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toolbar — integrated into a card-like bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-card rounded-2xl border border-border/40 px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Star className="h-4 w-4 text-primary" fill="currentColor" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground">
              {shortlistCount} project{shortlistCount !== 1 ? "s" : ""}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              shortlisted
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 rounded-xl"
            onClick={exportShortlist}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy to clipboard
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-destructive/70 hover:text-destructive rounded-xl"
            onClick={clearShortlist}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block">
        <DesktopTable
          shortlistedProjects={shortlistedProjects}
          shortlist={explorer}
        />
      </div>

      {/* Mobile (< md) */}
      <div className="md:hidden space-y-4">
        {/* Segmented toggle */}
        <div className="flex rounded-xl border border-border/50 overflow-hidden bg-muted/30">
          <button
            className={`flex-1 text-xs font-bold py-2.5 px-3 transition-colors ${mobileMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"}`}
            onClick={() => setMobileMode("list")}
          >
            Ranked List
          </button>
          <button
            className={`flex-1 text-xs font-bold py-2.5 px-3 transition-colors ${mobileMode === "compare" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"}`}
            onClick={() => setMobileMode("compare")}
            disabled={shortlistedProjects.length < 2}
          >
            Compare 2
          </button>
        </div>

        {mobileMode === "list" ? (
          <MobileRankedList
            shortlistedProjects={shortlistedProjects}
            shortlist={explorer}
          />
        ) : (
          <MobileCompare2
            shortlistedProjects={shortlistedProjects}
            shortlist={explorer}
          />
        )}
      </div>

      {/* You might also like */}
      {relatedProjects.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">
            You might also like
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Projects related to your shortlist by shared keywords and themes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {relatedProjects.map((project) => (
              <div key={project.id} className="relative">
                <ProjectCard
                  project={project}
                  isShortlisted={isShortlisted(project.id)}
                  onToggleShortlist={toggleShortlist}
                  onSupervisorClick={setSupervisorModal}
                  onSelect={setSelectedProject}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
