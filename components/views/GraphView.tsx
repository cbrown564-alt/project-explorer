"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { zoom, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { select } from "d3-selection";
import { useExplorer } from "@/lib/explorer-context";
import { buildGraphData, type GraphNode } from "@/lib/graph-data";
import { useForceSimulation } from "@/hooks/useForceSimulation";
import { THEME_HEX } from "@/lib/types";
import { GraphTooltip } from "@/components/graph/GraphTooltip";
import type { Project, Supervisor } from "@/lib/types";
import { Network } from "lucide-react";

export function GraphView() {
  const {
    projects,
    supervisors,
    filteredProjects,
    isShortlisted,
    toggleShortlist,
    setSelectedProject,
    setSupervisorModal,
    hasFilters,
  } = useExplorer();

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transformRef = useRef<ZoomTransform | null>(null);

  // Build graph data
  const graphData = useMemo(
    () => buildGraphData(projects, supervisors),
    [projects, supervisors]
  );

  // Build filtered ID set
  const filteredIds = useMemo(() => {
    if (!hasFilters) return null;
    const ids = new Set<string>();
    for (const p of filteredProjects) {
      ids.add(`p-${p.id}`);
      ids.add(`s-${p.supervisor}`);
    }
    return ids;
  }, [filteredProjects, hasFilters]);

  // Measure container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  // Force simulation
  const { positions, isSimulating } = useForceSimulation(
    graphData.nodes,
    graphData.links,
    dimensions.width,
    dimensions.height,
    filteredIds ?? undefined
  );

  // D3 zoom
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svgEl = select(svgRef.current);
    const gEl = gRef.current;

    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<
      SVGSVGElement,
      unknown
    >()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        gEl.setAttribute("transform", event.transform.toString());
      });

    svgEl.call(zoomBehavior);

    return () => {
      svgEl.on(".zoom", null);
    };
  }, []);

  // Node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of graphData.nodes) map.set(n.id, n);
    return map;
  }, [graphData.nodes]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.type === "project") {
        setSelectedProject(node.data as Project);
      } else {
        setSupervisorModal((node.data as Supervisor).name);
      }
    },
    [setSelectedProject, setSupervisorModal]
  );

  // Tooltip hover: position based on node's simulation position (stable),
  // transformed through the current zoom transform. Debounce hide to prevent flicker.
  const showTooltip = useCallback(
    (node: GraphNode) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      const pos = positions.get(node.id);
      if (!pos) return;

      // Apply zoom transform to get screen-space coordinates
      const t = transformRef.current;
      const screenX = t ? t.applyX(pos.x) : pos.x;
      const screenY = t ? t.applyY(pos.y) : pos.y;

      setHoveredNode(node);
      setTooltipPos({ x: screenX, y: screenY });
    },
    [positions]
  );

  const hideTooltip = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredNode(null);
    }, 150);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Mobile fallback
  const isMobile = dimensions.width > 0 && dimensions.width < 768;

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-[2rem] border border-dashed border-border/60">
        <div className="h-16 w-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <Network className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-heading text-lg font-bold text-foreground mb-1">
          Graph view is best on desktop
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Switch to the Projects or Supervisors tab for mobile browsing, or
          rotate to landscape on a larger device.
        </p>
      </div>
    );
  }

  // Unique themes present
  const themes = [...new Set(graphData.nodes.map((n) => n.theme))];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-card rounded-2xl border border-border/40 overflow-hidden"
      style={{ height: "calc(100vh - 280px)", minHeight: 500 }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <g ref={gRef}>
          {/* Edges */}
          {graphData.links.map((link, i) => {
            const sourcePos = positions.get(link.source);
            const targetPos = positions.get(link.target);
            if (!sourcePos || !targetPos) return null;

            const isFiltered =
              filteredIds &&
              (!filteredIds.has(link.source) || !filteredIds.has(link.target));

            return (
              <line
                key={`link-${i}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="var(--color-border)"
                strokeWidth={
                  link.type === "keyword" ? Math.min(link.weight, 3) : 0.5
                }
                opacity={
                  isFiltered ? 0.05 : link.type === "keyword" ? 0.4 : 0.15
                }
              />
            );
          })}

          {/* Nodes */}
          {graphData.nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;

            const isFiltered = filteredIds && !filteredIds.has(node.id);
            const shortlisted =
              node.type === "project" &&
              isShortlisted((node.data as Project).id);
            const color = THEME_HEX[node.theme] || THEME_HEX["Other"];
            const degree =
              graphData.links.filter(
                (l) => l.source === node.id || l.target === node.id
              ).length || 1;
            const baseRadius = node.type === "supervisor" ? 10 : 6;
            const radius = baseRadius + Math.min(degree * 0.8, 8);

            if (node.type === "supervisor") {
              const size = radius * 1.6;
              return (
                <g key={node.id}>
                  <rect
                    x={pos.x - size / 2}
                    y={pos.y - size / 2}
                    width={size}
                    height={size}
                    rx={4}
                    fill={color}
                    opacity={isFiltered ? 0.15 : 0.9}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => showTooltip(node)}
                    onMouseLeave={hideTooltip}
                  />
                  {!isFiltered && (
                    <text
                      x={pos.x}
                      y={pos.y + size / 2 + 12}
                      textAnchor="middle"
                      className="fill-foreground text-[9px] font-medium pointer-events-none select-none"
                    >
                      {(node.data as Supervisor).name
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </text>
                  )}
                </g>
              );
            }

            return (
              <g key={node.id}>
                {shortlisted && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 3}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    opacity={isFiltered ? 0.15 : 1}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  opacity={isFiltered ? 0.15 : 0.85}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => showTooltip(node)}
                  onMouseLeave={hideTooltip}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl p-3 text-xs space-y-2">
        <div className="font-heading font-bold text-foreground mb-1">
          Legend
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg width="12" height="12">
            <circle cx="6" cy="6" r="5" fill="#94a3b8" />
          </svg>
          Project
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg width="12" height="12">
            <rect x="1" y="1" width="10" height="10" rx="2" fill="#94a3b8" />
          </svg>
          Supervisor
        </div>
        <div className="h-px bg-border/40 my-1" />
        {themes.map((theme) => (
          <div key={theme} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: THEME_HEX[theme] || "#64748b" }}
            />
            <span className="text-muted-foreground">{theme}</span>
          </div>
        ))}
      </div>

      {/* Simulation indicator */}
      {isSimulating && (
        <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-white/80 dark:bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/40">
          Simulating...
        </div>
      )}

      {/* Tooltip — positioned at node location, not mouse cursor */}
      {hoveredNode && (
        <div
          onMouseEnter={() => {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          }}
          onMouseLeave={hideTooltip}
        >
          <GraphTooltip
            node={hoveredNode}
            x={tooltipPos.x}
            y={tooltipPos.y}
            isShortlisted={
              hoveredNode.type === "project" &&
              isShortlisted((hoveredNode.data as Project).id)
            }
            onToggleShortlist={() => {
              if (hoveredNode.type === "project") {
                toggleShortlist((hoveredNode.data as Project).id);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
