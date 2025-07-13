import { Badge } from "./Badge"
import { BookOpen } from "lucide-react"
import { cn } from "../../utils/cn"

interface ClassBadgeProps {
  className: string
  subject: string
  color?: string
  size?: "default" | "large"
  onClick?: () => void
}

export function ClassBadge({ 
  className, 
  color = "#667eea", 
  size = "large",
  onClick 
}: ClassBadgeProps) {
  return (
    <div
      className="inline-block"
      style={{ 
        backgroundColor: "#3a3936",
        borderLeftColor: color,
        boxShadow: `0 2px 6px ${color}15`,
        borderLeftWidth: "4px",
        borderLeftStyle: "solid",
        borderRadius: "0.5rem"
      }}
    >
      <Badge 
        variant="default"
        className={cn(
          "flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
          size === "large" ? "px-4 py-2 text-base font-medium" : "px-3 py-1 text-sm",
          "text-white rounded-lg bg-transparent border-0"
        )}
        onClick={onClick}
      >
        <BookOpen className={cn("flex-shrink-0", size === "large" ? "h-5 w-5" : "h-4 w-4")} />
        <span className="truncate">{className}</span>
      </Badge>
    </div>
  )
} 