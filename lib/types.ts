export interface Project {
  id: number;
  title: string;
  supervisor: string;
  email: string;
  theme: string;
  keywords: string[];
  description: string;
  industrial: string | null;
}

export interface Supervisor {
  name: string;
  email: string;
  projectCount: number;
  themes: string[];
  projects: number[];
  pureUrl: string;
}

export const THEME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Machine Learning": { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  "Computer Vision": { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  "NLP": { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  "Knowledge Engineering": { bg: "bg-orange-50 dark:bg-orange-950", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  "AI for Health": { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800" },
  "Other": { bg: "bg-slate-50 dark:bg-slate-950", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-800" },
};

export const THEMES = ["Machine Learning", "Computer Vision", "NLP", "Knowledge Engineering", "AI for Health", "Other"] as const;
