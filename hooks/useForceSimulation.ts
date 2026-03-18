"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import type { GraphNode, GraphLink } from "@/lib/graph-data";
import { THEME_HEX } from "@/lib/types";

export interface SimNode extends SimulationNodeDatum {
  id: string;
  type: "project" | "supervisor";
  theme: string;
  radius: number;
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  type: "keyword" | "supervisor";
  weight: number;
}

// Assign theme cluster positions
const THEME_POSITIONS: Record<string, { x: number; y: number }> = {
  "Machine Learning": { x: -0.3, y: -0.3 },
  "Computer Vision": { x: 0.3, y: -0.3 },
  "NLP": { x: -0.3, y: 0.3 },
  "Knowledge Engineering": { x: 0.3, y: 0.3 },
  "AI for Health": { x: 0, y: -0.4 },
  "Other": { x: 0, y: 0.4 },
};

export function useForceSimulation(
  graphNodes: GraphNode[],
  graphLinks: GraphLink[],
  width: number,
  height: number,
  filteredIds?: Set<string>
) {
  const [positions, setPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const [isSimulating, setIsSimulating] = useState(true);
  const [alpha, setAlpha] = useState(1);
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null);
  const nodeMapRef = useRef<Map<string, SimNode>>(new Map());

  // Compute degree for sizing
  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const link of graphLinks) {
      map.set(link.source, (map.get(link.source) || 0) + 1);
      map.set(link.target, (map.get(link.target) || 0) + 1);
    }
    return map;
  }, [graphLinks]);

  useEffect(() => {
    if (width === 0 || height === 0) return;

    const nodes: SimNode[] = graphNodes.map((n) => {
      const degree = degreeMap.get(n.id) || 1;
      const baseRadius = n.type === "supervisor" ? 10 : 6;
      return {
        id: n.id,
        type: n.type,
        theme: n.theme,
        radius: baseRadius + Math.min(degree * 0.8, 8),
      };
    });

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    nodeMapRef.current = nodeMap;

    const links: SimLink[] = graphLinks
      .filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map((l) => ({
        source: l.source,
        target: l.target,
        type: l.type,
        weight: l.weight,
      }));

    const sim = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((d) => (d.type === "supervisor" ? 40 : 60))
          .strength((d) => (d.type === "supervisor" ? 0.4 : 0.1 * d.weight))
      )
      .force("charge", forceManyBody<SimNode>().strength(-150))
      .force("center", forceCenter(width / 2, height / 2).strength(0.05))
      .force("collide", forceCollide<SimNode>((d) => d.radius + 3))
      .force(
        "x",
        forceX<SimNode>((d) => {
          const pos = THEME_POSITIONS[d.theme] || { x: 0, y: 0 };
          return width / 2 + pos.x * width * 0.35;
        }).strength(0.05)
      )
      .force(
        "y",
        forceY<SimNode>((d) => {
          const pos = THEME_POSITIONS[d.theme] || { x: 0, y: 0 };
          return height / 2 + pos.y * height * 0.35;
        }).strength(0.05)
      )
      .alpha(1)
      .alphaDecay(0.02);

    sim.on("tick", () => {
      const map = new Map<string, { x: number; y: number }>();
      for (const node of nodes) {
        map.set(node.id, { x: node.x ?? 0, y: node.y ?? 0 });
      }
      setPositions(map);
      setAlpha(sim.alpha());
    });

    sim.on("end", () => {
      setIsSimulating(false);
    });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [graphNodes, graphLinks, width, height, degreeMap]);

  const reheat = useCallback(() => {
    if (simRef.current) {
      simRef.current.alpha(0.3).restart();
      setIsSimulating(true);
    }
  }, []);

  const fixNode = useCallback((id: string, x: number, y: number) => {
    const node = nodeMapRef.current.get(id);
    if (node) {
      node.fx = x;
      node.fy = y;
    }
  }, []);

  const unfixNode = useCallback((id: string) => {
    const node = nodeMapRef.current.get(id);
    if (node) {
      node.fx = null;
      node.fy = null;
    }
  }, []);

  return { positions, isSimulating, alpha, reheat, fixNode, unfixNode };
}
