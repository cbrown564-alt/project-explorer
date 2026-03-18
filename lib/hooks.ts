"use client";

import { useState, useEffect, useCallback } from "react";

export function useShortlist() {
  const [shortlist, setShortlist] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("project-shortlist");
    if (stored) {
      try {
        setShortlist(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const toggle = useCallback((id: number) => {
    setShortlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      localStorage.setItem("project-shortlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setShortlist([]);
    localStorage.removeItem("project-shortlist");
  }, []);

  const isShortlisted = useCallback(
    (id: number) => shortlist.includes(id),
    [shortlist]
  );

  return { shortlist, toggle, clear, isShortlisted, count: shortlist.length };
}
