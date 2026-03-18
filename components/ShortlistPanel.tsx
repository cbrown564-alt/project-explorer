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
import type { Project } from "@/lib/types";
import { Star, Trash2, Copy, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

interface ShortlistPanelProps {
  projects: Project[];
  shortlist: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
  isShortlisted: (id: number) => boolean;
  onSupervisorClick: (name: string) => void;
}

export function ShortlistPanel({
  projects,
  shortlist,
  onToggle,
  onClear,
  isShortlisted,
  onSupervisorClick,
}: ShortlistPanelProps) {
  const [comparing, setComparing] = useState(false);
  const shortlistedProjects = projects.filter((p) => shortlist.includes(p.id));

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
        render={<Button variant="outline" className="relative" />}
      >
        <Star className="h-4 w-4 mr-2" />
        Shortlist
        {shortlist.length > 0 && (
          <Badge className="ml-2 h-5 min-w-5 px-1.5 text-xs">
            {shortlist.length}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:!max-w-xl p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
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

            <ScrollArea className="flex-1 mt-3">
              {comparing ? (
                <div className="space-y-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
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
                      {shortlistedProjects.map((p) => (
                        <tr key={p.id} className="border-b">
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
                <div className="space-y-3 pr-3">
                  {shortlistedProjects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      isShortlisted={true}
                      onToggleShortlist={onToggle}
                      onSupervisorClick={onSupervisorClick}
                    />
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
