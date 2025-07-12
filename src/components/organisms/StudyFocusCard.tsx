import { Card } from "../atoms/Card"
import { BookOpen } from "lucide-react"
import { ClassBadge } from "../atoms/ClassBadge"

interface ClassItem {
  id: string
  title: string
  color: string
  subject: string
}

interface StudyFocusCardProps {
  classes: ClassItem[]
  onClassClick?: (classId: string) => void
}

export function StudyFocusCard({ classes, onClassClick }: StudyFocusCardProps) {
  return (
    <Card>
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="flex items-center space-x-2 text-white font-medium">
          <BookOpen className="h-5 w-5" />
          <span>Current Classes</span>
        </h3>
      </div>
      
      {/* Card Content */}
      <div>
        <div className="flex flex-wrap gap-3">
          {classes.map((classItem) => (
            <ClassBadge
              key={classItem.id}
              className={classItem.title}
              subject={classItem.subject}
              color={classItem.color}
              size="large"
              onClick={() => onClassClick?.(classItem.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
} 