"use client";

import { useState, useRef, useEffect } from "react";
import { useExplorer } from "@/lib/explorer-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, X, Copy, Trash2 } from "lucide-react";

export function ShortlistPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    projects,
    shortlist,
    toggleShortlist,
    clearShortlist,
    shortlistCount,
    getNote,
    navigateToView,
  } = useExplorer();

  const shortlistedProjects = shortlist
    .map((item) => projects.find((p) => p.id === item.id))
    .filter(Boolean);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const exportShortlist = () => {
    const text = shortlistedProjects
      .map((p, i) => {
        if (!p) return "";
        const note = getNote(p.id);
        return `${i + 1}. ${p.title}\n   Supervisor: ${p.supervisor} (${p.email})\n   Theme: ${p.theme}${p.industrial ? `\n   Industry: ${p.industrial}` : ""}\n   Keywords: ${p.keywords.join(", ")}${note ? `\n   Notes: ${note}` : ""}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(
      `My ECS8056 Project Shortlist\n${"=".repeat(30)}\n\n${text}`
    );
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        className="relative h-10 rounded-2xl border-border/50 px-4 text-xs font-bold shadow-sm"
        onClick={() => setOpen(!open)}
      >
        <Star className="h-4 w-4 mr-2" />
        Shortlist
        {shortlistCount > 0 && (
          <Badge className="ml-2 h-5 min-w-5 px-1.5 text-xs">
            {shortlistCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] bg-popover border border-border rounded-xl shadow-lg z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <span className="font-heading text-sm font-bold">
              Shortlisted ({shortlistCount})
            </span>
            {shortlistCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive h-7 px-2"
                onClick={() => clearShortlist()}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Content */}
          {shortlistCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Star className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Star projects to add them here
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 py-1">
              {shortlistedProjects.map((p) => {
                if (!p) return null;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {p.supervisor}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleShortlist(p.id)}
                      className="shrink-0 p-1 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {shortlistCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50">
              <Button
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  navigateToView("shortlist");
                  setOpen(false);
                }}
              >
                Open My Shortlist
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={exportShortlist}
                title="Copy to clipboard"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
