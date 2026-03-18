"use client";

import { useMemo } from "react";
import type { GraphNode } from "@/lib/graph-data";
import { THEME_HEX } from "@/lib/types";
import type { ZoomTransform } from "d3-zoom";

interface GraphMinimapProps {
  nodes: GraphNode[];
  positions: Map<string, { x: number; y: number }>;
  width: number;
  height: number;
  transform: ZoomTransform | null;
}

const MINIMAP_W = 160;
const MINIMAP_H = 120;

export function GraphMinimap({
  nodes,
  positions,
  width,
  height,
  transform,
}: GraphMinimapProps) {
  // Compute bounds of all node positions
  const bounds = useMemo(() => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const pos of positions.values()) {
      if (pos.x < minX) minX = pos.x;
      if (pos.y < minY) minY = pos.y;
      if (pos.x > maxX) maxX = pos.x;
      if (pos.y > maxY) maxY = pos.y;
    }
    if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: width, maxY: height };
    const pad = 40;
    return {
      minX: minX - pad,
      minY: minY - pad,
      maxX: maxX + pad,
      maxY: maxY + pad,
    };
  }, [positions, width, height]);

  const scaleX = MINIMAP_W / (bounds.maxX - bounds.minX || 1);
  const scaleY = MINIMAP_H / (bounds.maxY - bounds.minY || 1);
  const scale = Math.min(scaleX, scaleY);

  // Viewport rectangle in minimap coordinates
  const viewport = useMemo(() => {
    if (!transform || width === 0 || height === 0) return null;
    // Invert transform to get visible area in graph space
    const x0 = (0 - transform.x) / transform.k;
    const y0 = (0 - transform.y) / transform.k;
    const x1 = (width - transform.x) / transform.k;
    const y1 = (height - transform.y) / transform.k;
    return {
      x: (x0 - bounds.minX) * scale,
      y: (y0 - bounds.minY) * scale,
      w: (x1 - x0) * scale,
      h: (y1 - y0) * scale,
    };
  }, [transform, width, height, bounds, scale]);

  if (positions.size === 0) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden shadow-sm">
      <svg width={MINIMAP_W} height={MINIMAP_H}>
        {/* Node dots */}
        {nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          const mx = (pos.x - bounds.minX) * scale;
          const my = (pos.y - bounds.minY) * scale;
          const color = THEME_HEX[node.theme] || THEME_HEX["Other"];
          return (
            <circle
              key={node.id}
              cx={mx}
              cy={my}
              r={node.type === "supervisor" ? 2.5 : 1.5}
              fill={color}
              opacity={0.8}
            />
          );
        })}
        {/* Viewport rectangle */}
        {viewport && (
          <rect
            x={viewport.x}
            y={viewport.y}
            width={viewport.w}
            height={viewport.h}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={1.5}
            opacity={0.6}
            rx={2}
          />
        )}
      </svg>
    </div>
  );
}
