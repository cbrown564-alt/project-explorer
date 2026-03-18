import type { Project, Supervisor } from "./types";

export interface GraphNode {
  id: string;
  type: "project" | "supervisor";
  data: Project | Supervisor;
  theme: string;
}

export interface GraphLink {
  source: string;
  target: string;
  type: "keyword" | "supervisor";
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraphData(
  projects: Project[],
  supervisors: Supervisor[]
): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Create project nodes
  for (const project of projects) {
    nodes.push({
      id: `p-${project.id}`,
      type: "project",
      data: project,
      theme: project.theme,
    });
  }

  // Create supervisor nodes — theme derived from majority of their projects
  for (const supervisor of supervisors) {
    const supProjects = projects.filter((p) => p.supervisor === supervisor.name);
    const themeCounts: Record<string, number> = {};
    for (const p of supProjects) {
      themeCounts[p.theme] = (themeCounts[p.theme] || 0) + 1;
    }
    const majorityTheme =
      Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      supervisor.themes[0] ||
      "Other";

    nodes.push({
      id: `s-${supervisor.name}`,
      type: "supervisor",
      data: supervisor,
      theme: majorityTheme,
    });
  }

  // Supervisor-project links
  for (const project of projects) {
    const supervisorId = `s-${project.supervisor}`;
    if (nodes.some((n) => n.id === supervisorId)) {
      links.push({
        source: `p-${project.id}`,
        target: supervisorId,
        type: "supervisor",
        weight: 1,
      });
    }
  }

  // Keyword-based project-project links (threshold: 1+ shared keywords)
  for (let i = 0; i < projects.length; i++) {
    const kwA = new Set(projects[i].keywords.map((k) => k.toLowerCase()));
    for (let j = i + 1; j < projects.length; j++) {
      const shared = projects[j].keywords.filter((k) =>
        kwA.has(k.toLowerCase())
      ).length;
      if (shared >= 1) {
        links.push({
          source: `p-${projects[i].id}`,
          target: `p-${projects[j].id}`,
          type: "keyword",
          weight: shared,
        });
      }
    }
  }

  return { nodes, links };
}

export function getRelatedProjects(
  projectId: number,
  projects: Project[]
): Project[] {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return [];

  const kwSet = new Set(project.keywords.map((k) => k.toLowerCase()));

  const scored = projects
    .filter((p) => p.id !== projectId)
    .map((p) => {
      let score = 0;
      score += p.keywords.filter((k) => kwSet.has(k.toLowerCase())).length * 2;
      if (p.supervisor === project.supervisor) score += 1;
      if (p.theme === project.theme) score += 1;
      return { project: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.project);
}
