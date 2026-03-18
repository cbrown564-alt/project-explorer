import { Badge } from "@/components/ui/badge";
import { THEME_COLORS } from "@/lib/types";

export function ThemeBadge({ theme }: { theme: string }) {
  const colors = THEME_COLORS[theme] || THEME_COLORS["Other"];
  return (
    <Badge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} text-xs font-medium`}
    >
      {theme}
    </Badge>
  );
}
