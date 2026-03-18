"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { select } from "d3-selection";
import "d3-transition";
import { useExplorer } from "@/lib/explorer-context";
import { buildGraphData, buildAdjacencyMap, type GraphNode, type GraphLink } from "@/lib/graph-data";
import { useForceSimulation } from "@/hooks/useForceSimulation";
import { THEME_HEX } from "@/lib/types";
import { GraphTooltip } from "@/components/graph/GraphTooltip";
import { GraphMinimap } from "@/components/graph/GraphMinimap";
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
    graphHighlightNodeId,
    clearGraphHighlight,
  } = useExplorer();

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphLink | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentTransform, setCurrentTransform] = useState<ZoomTransform | null>(null);
  const transformRef = useRef<ZoomTransform | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Drag state
  const dragNodeRef = useRef<string | null>(null);
  const wasDraggedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keyboard navigation
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(-1);

  // Build graph data
  const graphData = useMemo(
    () => buildGraphData(projects, supervisors),
    [projects, supervisors]
  );

  // Adjacency map for hover highlighting
  const adjacencyMap = useMemo(
    () => buildAdjacencyMap(graphData.links),
    [graphData.links]
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
  const { positions, isSimulating, alpha, reheat, fixNode, unfixNode } =
    useForceSimulation(
      graphData.nodes,
      graphData.links,
      dimensions.width,
      dimensions.height,
      filteredIds ?? undefined
    );

  // D3 zoom with rAF-throttled transform state
  const rafRef = useRef(0);
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svgEl = select(svgRef.current);
    const gEl = gRef.current;

    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<
      SVGSVGElement,
      unknown
    >()
      .scaleExtent([0.3, 4])
      .filter((event) => {
        // Allow zoom unless we're dragging a node
        if (dragNodeRef.current) return false;
        return true;
      })
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        gEl.setAttribute("transform", event.transform.toString());
        // Throttle state update via rAF
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setCurrentTransform(event.transform);
        });
      });

    svgEl.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;

    return () => {
      svgEl.on(".zoom", null);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of graphData.nodes) map.set(n.id, n);
    return map;
  }, [graphData.nodes]);

  // Degree map for sizing
  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of graphData.links) {
      map.set(l.source, (map.get(l.source) || 0) + 1);
      map.set(l.target, (map.get(l.target) || 0) + 1);
    }
    return map;
  }, [graphData.links]);

  const getNodeRadius = useCallback(
    (node: GraphNode) => {
      const degree = degreeMap.get(node.id) || 1;
      const baseRadius = node.type === "supervisor" ? 10 : 6;
      return baseRadius + Math.min(degree * 0.8, 8);
    },
    [degreeMap]
  );

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (wasDraggedRef.current) {
        wasDraggedRef.current = false;
        return;
      }
      if (node.type === "project") {
        setSelectedProject(node.data as Project);
      } else {
        setSupervisorModal((node.data as Supervisor).name);
      }
    },
    [setSelectedProject, setSupervisorModal]
  );

  // Tooltip hover
  const showTooltip = useCallback(
    (node: GraphNode) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      const pos = positions.get(node.id);
      if (!pos) return;

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

  // Drag handlers (React pointer events)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, nodeId: string) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      dragNodeRef.current = nodeId;
      wasDraggedRef.current = false;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      const pos = positions.get(nodeId);
      if (pos) fixNode(nodeId, pos.x, pos.y);
    },
    [positions, fixNode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragNodeRef.current) return;

      const start = dragStartRef.current;
      if (start) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          wasDraggedRef.current = true;
        }
      }

      const t = transformRef.current;
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      // Convert screen coords to graph coords
      const screenX = e.clientX - svgRect.left;
      const screenY = e.clientY - svgRect.top;
      const graphX = t ? (screenX - t.x) / t.k : screenX;
      const graphY = t ? (screenY - t.y) / t.k : screenY;

      fixNode(dragNodeRef.current, graphX, graphY);
      reheat();
    },
    [fixNode, reheat]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragNodeRef.current) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      unfixNode(dragNodeRef.current);
      dragNodeRef.current = null;
    },
    [unfixNode]
  );

  // "Show in Graph" highlight — zoom to node with pulsing ring
  useEffect(() => {
    if (
      !graphHighlightNodeId ||
      !svgRef.current ||
      !zoomBehaviorRef.current ||
      dimensions.width === 0
    )
      return;

    const pos = positions.get(graphHighlightNodeId);
    if (!pos) return;

    const svgEl = select(svgRef.current);
    const targetScale = 2;
    const targetX = dimensions.width / 2 - pos.x * targetScale;
    const targetY = dimensions.height / 2 - pos.y * targetScale;

    svgEl
      .transition()
      .duration(750)
      .call(
        zoomBehaviorRef.current.transform,
        zoomIdentity.translate(targetX, targetY).scale(targetScale)
      );
  }, [graphHighlightNodeId, positions, dimensions]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const nodeCount = graphData.nodes.length;
      if (nodeCount === 0) return;

      if (e.key === "Tab") {
        e.preventDefault();
        setFocusedNodeIndex((prev) => {
          if (e.shiftKey) return prev <= 0 ? nodeCount - 1 : prev - 1;
          return prev >= nodeCount - 1 ? 0 : prev + 1;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedNodeIndex >= 0 && focusedNodeIndex < nodeCount) {
          handleNodeClick(graphData.nodes[focusedNodeIndex]);
        }
      } else if (e.key === "Escape") {
        setFocusedNodeIndex(-1);
        clearGraphHighlight();
      }
    },
    [graphData.nodes, focusedNodeIndex, handleNodeClick, clearGraphHighlight]
  );

  // Hover highlighting: which nodes/edges are "active"
  const hoveredNeighbors = useMemo(() => {
    if (!hoveredNode) return null;
    const neighbors = adjacencyMap.get(hoveredNode.id);
    if (!neighbors) return new Set<string>([hoveredNode.id]);
    return new Set<string>([hoveredNode.id, ...neighbors]);
  }, [hoveredNode, adjacencyMap]);

  // Compute theme centroids for cluster labels
  const themeCentroids = useMemo(() => {
    if (isSimulating) return [];
    const themePositions: Record<string, { xs: number[]; ys: number[] }> = {};
    for (const node of graphData.nodes) {
      const pos = positions.get(node.id);
      if (!pos) continue;
      if (!themePositions[node.theme]) {
        themePositions[node.theme] = { xs: [], ys: [] };
      }
      themePositions[node.theme].xs.push(pos.x);
      themePositions[node.theme].ys.push(pos.y);
    }
    return Object.entries(themePositions).map(([theme, { xs, ys }]) => ({
      theme,
      x: xs.reduce((a, b) => a + b, 0) / xs.length,
      y: ys.reduce((a, b) => a + b, 0) / ys.length,
    }));
  }, [graphData.nodes, positions, isSimulating]);

  // Animated entry: opacity/scale based on alpha
  const entryProgress = Math.min(1, (1 - alpha) * 2);

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

  // Edge path generator for curved keyword edges
  const getEdgePath = (
    link: GraphLink,
    index: number,
    sx: number,
    sy: number,
    tx: number,
    ty: number
  ) => {
    if (link.type === "supervisor") return null; // straight line
    // Quadratic bezier with perpendicular offset
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const offset = 15 * (index % 2 === 0 ? 1 : -1);
    const cx = mx + (-dy / len) * offset;
    const cy = my + (dx / len) * offset;
    return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
  };

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
        className="w-full h-full outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          opacity: entryProgress,
          transform: `scale(${0.9 + entryProgress * 0.1})`,
          transformOrigin: "center",
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <defs>
          {/* Clip paths for supervisor avatars — positioned at node locations */}
          {graphData.nodes
            .filter((n) => n.type === "supervisor")
            .map((n) => {
              const radius = getNodeRadius(n);
              const photoR = radius * 0.8;
              const pos = positions.get(n.id);
              return (
                <clipPath key={`clip-${n.id}`} id={`clip-${n.id}`}>
                  <circle cx={pos?.x ?? 0} cy={pos?.y ?? 0} r={photoR} />
                </clipPath>
              );
            })}
        </defs>
        <g ref={gRef}>
          {/* Cluster labels (behind everything) */}
          {themeCentroids.map(({ theme, x, y }) => (
            <text
              key={`cluster-${theme}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none font-heading font-bold"
              style={{
                fontSize: "28px",
                fill: THEME_HEX[theme] || THEME_HEX["Other"],
                opacity: 0.08,
              }}
            >
              {theme}
            </text>
          ))}

          {/* Edges */}
          {graphData.links.map((link, i) => {
            const sourcePos = positions.get(link.source);
            const targetPos = positions.get(link.target);
            if (!sourcePos || !targetPos) return null;

            const isFiltered =
              filteredIds &&
              (!filteredIds.has(link.source) || !filteredIds.has(link.target));

            // Hover highlighting
            const isDimmed =
              hoveredNeighbors &&
              !(
                hoveredNeighbors.has(link.source) &&
                hoveredNeighbors.has(link.target)
              );
            const isHighlighted =
              hoveredNeighbors &&
              hoveredNeighbors.has(link.source) &&
              hoveredNeighbors.has(link.target);

            let edgeOpacity = isFiltered
              ? 0.05
              : link.type === "keyword"
              ? 0.4
              : 0.15;
            if (isDimmed) edgeOpacity = 0.04;
            if (isHighlighted) edgeOpacity = 0.8;

            const path = getEdgePath(
              link,
              i,
              sourcePos.x,
              sourcePos.y,
              targetPos.x,
              targetPos.y
            );

            const isEdgeHovered = hoveredEdge === link;
            const mx = (sourcePos.x + targetPos.x) / 2;
            const my = (sourcePos.y + targetPos.y) / 2;

            return (
              <g key={`link-${i}`}>
                {path ? (
                  <>
                    {/* Visible curved edge */}
                    <path
                      d={path}
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth={Math.min(link.weight, 3)}
                      opacity={edgeOpacity}
                      style={{ transition: "opacity 0.2s" }}
                    />
                    {/* Invisible wide hit target */}
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredEdge(link)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                  </>
                ) : (
                  <>
                    {/* Straight line for supervisor edges */}
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      opacity={edgeOpacity}
                      style={{ transition: "opacity 0.2s" }}
                    />
                  </>
                )}

                {/* Edge keyword label on hover */}
                {isEdgeHovered &&
                  link.sharedKeywords &&
                  link.sharedKeywords.length > 0 && (
                    <g>
                      <rect
                        x={mx - 40}
                        y={my - 10}
                        width={80}
                        height={20}
                        rx={6}
                        fill="var(--color-card)"
                        stroke="var(--color-border)"
                        strokeWidth={0.5}
                        opacity={0.95}
                      />
                      <text
                        x={mx}
                        y={my + 4}
                        textAnchor="middle"
                        className="fill-foreground text-[8px] font-medium pointer-events-none select-none"
                      >
                        {link.sharedKeywords.slice(0, 3).join(", ")}
                        {link.sharedKeywords.length > 3 ? "…" : ""}
                      </text>
                    </g>
                  )}
              </g>
            );
          })}

          {/* Nodes */}
          {graphData.nodes.map((node, nodeIndex) => {
            const pos = positions.get(node.id);
            if (!pos) return null;

            const isFiltered = filteredIds && !filteredIds.has(node.id);
            const shortlisted =
              node.type === "project" &&
              isShortlisted((node.data as Project).id);
            const color = THEME_HEX[node.theme] || THEME_HEX["Other"];
            const radius = getNodeRadius(node);

            // Hover highlighting
            const isDimmed = hoveredNeighbors && !hoveredNeighbors.has(node.id);
            let nodeOpacity = isFiltered ? 0.15 : 0.85;
            if (isDimmed) nodeOpacity = 0.1;
            if (hoveredNeighbors?.has(node.id)) nodeOpacity = 1;

            // Keyboard focus
            const isFocused = focusedNodeIndex === nodeIndex;

            // Graph highlight (pulse)
            const isPulsing = graphHighlightNodeId === node.id;

            if (node.type === "supervisor") {
              const supervisor = node.data as Supervisor;
              const photoR = radius * 0.8;

              return (
                <g
                  key={node.id}
                  style={{ transition: "opacity 0.2s" }}
                  opacity={nodeOpacity}
                >
                  {/* Focus ring */}
                  {isFocused && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={photoR + 5}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                    />
                  )}
                  {/* Colored border ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={photoR + 2}
                    fill={color}
                    className="cursor-pointer"
                    onPointerDown={(e) => handlePointerDown(e, node.id)}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => showTooltip(node)}
                    onMouseLeave={hideTooltip}
                  />
                  {supervisor.photoUrl ? (
                    <image
                      href={supervisor.photoUrl}
                      x={pos.x - photoR}
                      y={pos.y - photoR}
                      width={photoR * 2}
                      height={photoR * 2}
                      clipPath={`url(#clip-${node.id})`}
                      className="cursor-pointer"
                      preserveAspectRatio="xMidYMid slice"
                      onPointerDown={(e) => handlePointerDown(e, node.id)}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => showTooltip(node)}
                      onMouseLeave={hideTooltip}
                    />
                  ) : (
                    <>
                      {/* Fallback: grey circle with user silhouette */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={photoR}
                        fill="#e2e8f0"
                        className="cursor-pointer"
                        onPointerDown={(e) => handlePointerDown(e, node.id)}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => showTooltip(node)}
                        onMouseLeave={hideTooltip}
                      />
                      {/* User silhouette: head + shoulders, clipped to circle */}
                      {(() => {
                        const s = photoR / 12;
                        return (
                          <g clipPath={`url(#clip-${node.id})`} className="pointer-events-none">
                            <circle cx={pos.x} cy={pos.y - 2 * s} r={3 * s} fill="#94a3b8" />
                            <ellipse cx={pos.x} cy={pos.y + 6 * s} rx={6 * s} ry={4 * s} fill="#94a3b8" />
                          </g>
                        );
                      })()}
                    </>
                  )}
                  {!isFiltered && !isDimmed && (
                    <text
                      x={pos.x}
                      y={pos.y + photoR + 14}
                      textAnchor="middle"
                      className="fill-foreground text-[9px] font-medium pointer-events-none select-none"
                    >
                      {supervisor.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                  )}
                </g>
              );
            }

            return (
              <g
                key={node.id}
                style={{ transition: "opacity 0.2s" }}
                opacity={nodeOpacity}
              >
                {/* Pulse ring for "Show in Graph" */}
                {isPulsing && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 8}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    opacity={0.9}
                  >
                    <animate
                      attributeName="r"
                      from={String(radius + 4)}
                      to={String(radius + 16)}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.9"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                {/* Focus ring */}
                {isFocused && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 4}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                  />
                )}
                {shortlisted && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 3}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  className="cursor-pointer"
                  onPointerDown={(e) => handlePointerDown(e, node.id)}
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
          <svg width="12" height="12" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <clipPath id="legend-sup-clip"><circle cx="12" cy="12" r="11" /></clipPath>
            <g clipPath="url(#legend-sup-clip)">
              <circle cx="12" cy="9" r="4" fill="#94a3b8" />
              <ellipse cx="12" cy="22" rx="8" ry="6" fill="#94a3b8" />
            </g>
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

      {/* Minimap */}
      <GraphMinimap
        nodes={graphData.nodes}
        positions={positions}
        width={dimensions.width}
        height={dimensions.height}
        transform={currentTransform}
      />

      {/* Simulation indicator — subtle pulsing dot */}
      {isSimulating && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground bg-white/80 dark:bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Loading
        </div>
      )}

      {/* Tooltip */}
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
