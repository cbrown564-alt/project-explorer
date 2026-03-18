"use client";

import { useState, useEffect, useCallback } from "react";
import type { ShortlistItem } from "./types";

export function useShortlist() {
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("project-shortlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && typeof parsed[0] === 'number') {
          setShortlist(parsed.map(id => ({ id, note: "" })));
        } else {
          setShortlist(parsed);
        }
      } catch {}
    }
  }, []);

  const toggle = useCallback((id: number) => {
    setShortlist((prev) => {
      const exists = prev.some(item => item.id === id);
      const next = exists
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, note: "" }];
      localStorage.setItem("project-shortlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setShortlist((prev) => {
      const next = prev.map(item => item.id === id ? { ...item, note } : item);
      localStorage.setItem("project-shortlist", JSON.stringify(next));
      return next;
    });
  }, []);
  
  const reorder = useCallback((startIndex: number, endIndex: number) => {
    setShortlist(prev => {
      const next = Array.from(prev);
      const [removed] = next.splice(startIndex, 1);
      next.splice(endIndex, 0, removed);
      localStorage.setItem("project-shortlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setShortlist([]);
    localStorage.removeItem("project-shortlist");
  }, []);

  const isShortlisted = useCallback(
    (id: number) => shortlist.some(item => item.id === id),
    [shortlist]
  );
  
  const getNote = useCallback(
    (id: number) => shortlist.find(item => item.id === id)?.note || "",
    [shortlist]
  );

  return { shortlist, toggle, updateNote, reorder, clear, isShortlisted, getNote, count: shortlist.length };
}

