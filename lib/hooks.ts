"use client";

import { useState, useEffect, useCallback } from "react";
import type { ShortlistItem } from "./types";

export function useShortlist() {
  const [shortlist, setShortlist] = useState<ShortlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("project-shortlist");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && typeof parsed[0] === "number") {
        return parsed.map((id) => ({ id, note: "" }));
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Effect to persist to localStorage whenever shortlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("project-shortlist", JSON.stringify(shortlist));
    }
  }, [shortlist]);

  const toggle = useCallback((id: number) => {
    setShortlist((prev) => {
      const exists = prev.some(item => item.id === id);
      return exists
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, note: "" }];
    });
  }, []);

  const updateNote = useCallback((id: number, note: string) => {
    setShortlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  }, []);

  const reorder = useCallback((startIndex: number, endIndex: number) => {
    setShortlist((prev) => {
      const next = Array.from(prev);
      const [removed] = next.splice(startIndex, 1);
      next.splice(endIndex, 0, removed);
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

