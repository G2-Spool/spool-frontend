import type React from "react"
import { Card } from "./Card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number | React.ReactNode
  description?: string
  icon: LucideIcon
  children?: React.ReactNode
}

export function StatCard({ title, value, description, icon: Icon, children }: StatCardProps) {
  return (
    <Card>
      {/* Card Header */}
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      
      {/* Card Content */}
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-gray-400">{description}</p>}
        {children}
      </div>
    </Card>
  )
} 