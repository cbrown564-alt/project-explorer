"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project, ShortlistItem } from "@/lib/types";
import { Star, Trash2, Copy, ArrowLeftRight, Maximize2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ShortlistPanelProps {
  projects: Project[];
  shortlist: ShortlistItem[];
  onToggle: (id: number) => void;
  onClear: () => void;
  isShortlisted: (id: number) => boolean;
  onSupervisorClick: (name: string) => void;
  onCompare?: () => void;
  updateNote?: (id: number, note: string) => void;
  reorderShortlist?: (startIndex: number, endIndex: number) => void;
  getNote?: (id: number) => string;
}

export function ShortlistPanel({
  projects,
  shortlist,
  onToggle,
  onClear,
  isShortlisted,
  onSupervisorClick,
  onCompare,
  updateNote,
  reorderShortlist,
  getNote,
}: ShortlistPanelProps) {
  const [comparing, setComparing] = useState(false);
  const shortlistedProjects = shortlist
    .map((item) => projects.find((p) => p.id === item.id))
    .filter(Boolean) as Project[];

  const exportShortlist = () => {
    const text = shortlistedProjects
      .map(
        (p, i) =>
          `${i + 1}. ${p.title}\n   Supervisor: ${p.supervisor} (${p.email})\n   Theme: ${p.theme}${p.industrial ? `\n   Industry: ${p.industrial}` : ""}\n   Keywords: ${p.keywords.join(", ")}`
      )
      .join("\n\n");
    navigator.clipboard.writeText(
      `My ECS8056 Project Shortlist\n${"=".repeat(30)}\n\n${text}`
    );
  };

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" className="relative h-10 rounded-2xl border-border/50 px-4 text-xs font-bold shadow-sm" />}
      >
        <Star className="h-4 w-4 mr-2" />
        Shortlist
        {shortlist.length > 0 && (
          <Badge className="ml-2 h-5 min-w-5 px-1.5 text-xs">
            {shortlist.length}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:!max-w-xl p-4 overflow-hidden">
        <SheetHeader>
          <SheetTitle className="font-heading flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
            Shortlist ({shortlist.length})
          </SheetTitle>
        </SheetHeader>

        {shortlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Star className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              No projects shortlisted yet.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Click the star on any project to add it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex gap-2 py-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setComparing(!comparing)}
              >
                <ArrowLeftRight className="h-3 w-3 mr-1" />
                {comparing ? "Card view" : "Compare"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={exportShortlist}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy to clipboard
              </Button>
              {onCompare && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={onCompare}
                >
                  <Maximize2 className="h-3 w-3 mr-1" /> Full Compare
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive ml-auto"
                onClick={onClear}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear all
              </Button>
            </div>

            <Separator />

            <ScrollArea className="flex-1 mt-3 overflow-x-hidden">
              {comparing ? (
                <div className="space-y-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-center p-2 font-medium w-10"></th>
                        <th className="text-left p-2 font-medium">Project</th>
                        <th className="text-left p-2 font-medium">
                          Supervisor
                        </th>
                        <th className="text-left p-2 font-medium">Theme</th>
                        <th className="text-left p-2 font-medium">
                          Industrial
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortlistedProjects.map((p, index) => (
                        <tr key={p.id} className="border-b">
                          <td className="p-1 align-middle">
                            {reorderShortlist ? (
                              <div className="flex flex-col items-center justify-center -space-y-1 w-8 mx-auto">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full"
                                  onClick={() => reorderShortlist(index, index - 1)}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <span className="text-[10px] font-bold text-muted-foreground">{index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full"
                                  onClick={() => reorderShortlist(index, index + 1)}
                                  disabled={index === shortlistedProjects.length - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground w-full text-center block">
                                {index + 1}.
                              </span>
                            )}
                          </td>
                          <td className="p-2 font-medium">{p.title}</td>
                          <td className="p-2">{p.supervisor}</td>
                          <td className="p-2">{p.theme}</td>
                          <td className="p-2">{p.industrial || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4 px-1 pt-1 pb-1">
                  {shortlistedProjects.map((p, index) => (
                    <div key={p.id} className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        {reorderShortlist && (
                          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => reorderShortlist(index, index - 1)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-5 w-5" />
                            </Button>
                            <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => reorderShortlist(index, index + 1)}
                              disabled={index === shortlistedProjects.length - 1}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <ProjectCard
                            project={p}
                            isShortlisted={true}
                            onToggleShortlist={onToggle}
                            onSupervisorClick={onSupervisorClick}
                          />
                        </div>
                      </div>
                      {updateNote && getNote && (
                        <div className={reorderShortlist ? "ml-10" : ""}>
                          <textarea
                            placeholder="Add a private note about this project..."
                            className="w-full text-sm p-3 rounded-xl border border-border/50 bg-secondary/10 dark:bg-secondary/5 focus:bg-background resize-y min-h-[60px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans placeholder:text-muted-foreground/60"
                            value={getNote(p.id)}
                            onChange={(e) => updateNote(p.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
