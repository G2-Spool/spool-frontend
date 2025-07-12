/**
 * MainLayout Component
 * 
 * The main application layout component that provides consistent structure
 * across all pages with sidebar navigation and content area.
 * 
 * Features:
 * - Sidebar navigation with user stats
 * - Responsive layout
 * - Content area with optional overflow control
 * - Unified navigation integration
 */

import React from 'react'
import { SidebarNav } from '@/components/molecules/SidebarNav'
import { useAuth } from '@/contexts/AuthContext'
import { useStudyStreak } from '@/hooks/useStudyStreak'
import { cn } from '@/utils/cn'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
  allowOverflow?: boolean
  className?: string
}

export function MainLayout({ children, title, allowOverflow = false, className }: MainLayoutProps) {
  const { user, studentProfile } = useAuth()
  const { studyStreak } = useStudyStreak()

  // Get user data for sidebar
  const userFirstName = studentProfile?.firstName || user?.email?.split('@')[0] || 'Student'
  const currentStreak = studyStreak.currentStreak
  const totalPoints = studentProfile?.totalPoints || 0

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block">
        <SidebarNav
          currentStreak={currentStreak}
          totalPoints={totalPoints}
          userFirstName={userFirstName}
        />
      </div>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 transition-all duration-200",
        "lg:ml-0", // Remove margin since sidebar is now positioned with flex
        className
      )}>
        <div className={cn(
          "flex-1 space-y-4 p-6 bg-background min-h-screen",
          !allowOverflow && "overflow-hidden"
        )}>
          {children}
        </div>
      </main>

      {/* Mobile sidebar overlay - placeholder for future mobile implementation */}
      {/* <div className="lg:hidden">
        <MobileSidebar
          currentStreak={currentStreak}
          totalPoints={totalPoints}
          userFirstName={userFirstName}
        />
      </div> */}
    </div>
  )
} 