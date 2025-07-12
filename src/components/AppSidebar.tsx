import React from "react"
import { BookOpen, Home, BarChart3, User, GraduationCap, MessageSquare } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar"

interface MenuItem {
  title: string
  icon: React.ElementType
  path: string
}

/**
 * Main application sidebar with navigation menu items
 * Clean, organized navigation matching the desired design
 */
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const menuItems: MenuItem[] = [
    {
      title: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      title: "Threads",
      icon: MessageSquare,
      path: "/threads",
    },
    {
      title: "Classes",
      icon: GraduationCap,
      path: "/classes",
    },
    {
      title: "Progress",
      icon: BarChart3,
      path: "/progress",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Spool</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)} 
                    isActive={isActive(item.path)}
                    className={`
                      w-full justify-start px-3 py-2.5 text-sm font-medium transition-colors
                      ${isActive(item.path) 
                        ? 'bg-teal-100 text-teal-900 hover:bg-teal-200' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
} 