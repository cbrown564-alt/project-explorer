"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useExplorer } from "@/lib/explorer-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Copy, Trash2, Check, ArrowRight } from "lucide-react";

export function ShortlistPopover() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const exportShortlist = useCallback(() => {
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shortlistedProjects, getNote]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        className="relative h-10 rounded-2xl border-border/50 px-4 text-xs font-bold shadow-sm group overflow-hidden"
        onClick={() => setOpen(!open)}
      >
        <motion.div
          animate={open ? { rotate: 72 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Star className="h-4 w-4 mr-2" />
        </motion.div>
        Shortlist
        <AnimatePresence mode="popLayout">
          {shortlistCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Badge className="ml-2 h-5 min-w-5 px-1.5 text-xs tabular-nums">
                {shortlistCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] bg-popover/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                <span className="font-heading text-sm font-bold tracking-tight">
                  Shortlisted
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({shortlistCount})
                </span>
              </div>
              {shortlistCount > 0 && (
                <button
                  className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => clearShortlist()}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Content */}
            {shortlistCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground/70">
                  Star projects to add them here
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 py-1.5">
                {shortlistedProjects.map((p, i) => {
                  if (!p) return null;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/40 transition-colors group"
                    >
                      {/* Rank circle */}
                      <span className="shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-snug truncate text-foreground">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                          {p.supervisor}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleShortlist(p.id)}
                        className="shrink-0 p-1.5 rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            {shortlistCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-3 border-t border-border/30 bg-muted/20">
                <Button
                  size="sm"
                  className="flex-1 text-xs h-8 rounded-xl font-bold gap-1.5 group/btn"
                  onClick={() => {
                    navigateToView("shortlist");
                    setOpen(false);
                  }}
                >
                  Open My Shortlist
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-xl"
                  onClick={exportShortlist}
                  title="Copy to clipboard"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
