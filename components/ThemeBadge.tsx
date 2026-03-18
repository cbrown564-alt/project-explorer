import { Badge } from "@/components/ui/badge";
import { THEME_COLORS } from "@/lib/types";

export function ThemeBadge({ theme }: { theme: string }) {
  const colors = THEME_COLORS[theme] || THEME_COLORS["Other"];
  return (
    <Badge
      className={`${colors.bg} ${colors.text} border-transparent text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm hover:${colors.bg} hover:brightness-95 transition-all`}
    >
      {theme}
    </Badge>
  );
}
