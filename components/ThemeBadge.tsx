import { Badge } from "@/components/ui/badge";
import { THEME_COLORS } from "@/lib/types";
import { Brain, Eye, MessageSquare, Network, HeartPulse, Layers } from "lucide-react";

const THEME_ICONS: Record<string, React.ElementType> = {
  "Machine Learning": Brain,
  "Computer Vision": Eye,
  "NLP": MessageSquare,
  "Knowledge Engineering": Network,
  "AI for Health": HeartPulse,
  "Other": Layers,
};

export function ThemeBadge({ theme }: { theme: string }) {
  const colors = THEME_COLORS[theme] || THEME_COLORS["Other"];
  const Icon = THEME_ICONS[theme] || THEME_ICONS["Other"];
  
  return (
    <Badge
      className={`${colors.bg} ${colors.text} border-transparent text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm hover:${colors.bg} hover:brightness-95 transition-all flex items-center gap-1.5`}
    >
      <Icon className="h-3.5 w-3.5" />
      {theme}
    </Badge>
  );
}
