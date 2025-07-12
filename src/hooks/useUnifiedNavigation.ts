/**
 * useUnifiedNavigation Hook
 * 
 * A unified navigation hook that provides routing functionality
 * across the application. This is a placeholder implementation
 * that can be enhanced with actual routing logic.
 */

import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export type AppTab = 'learning' | 'dashboard' | 'classes' | 'visualization' | 'settings' | 'profile'

interface UseUnifiedNavigationReturn {
  activeTab: AppTab
  navigateToTab: (tab: AppTab) => void
  navigateToUrl: (url: string) => void
  navigateToLanding: () => void
  navigateToSignInWithRedirect: (redirectPath: string) => void
  isTabActive: (tab: AppTab) => boolean
}

export function useUnifiedNavigation(): UseUnifiedNavigationReturn {
  const navigate = useNavigate()
  const location = useLocation()

  // Get active tab from URL or search params
  const getActiveTab = useCallback((): AppTab => {
    const searchParams = new URLSearchParams(location.search)
    const tabFromQuery = searchParams.get('tab') as AppTab
    
    if (tabFromQuery && ['learning', 'dashboard', 'classes', 'visualization', 'settings', 'profile'].includes(tabFromQuery)) {
      return tabFromQuery
    }
    
    // Default to dashboard if no valid tab found
    return 'dashboard'
  }, [location.search])

  const activeTab = getActiveTab()

  const navigateToTab = useCallback((tab: AppTab) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('tab', tab)
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }, [navigate, location])

  const navigateToUrl = useCallback((url: string) => {
    navigate(url)
  }, [navigate])

  const navigateToLanding = useCallback(() => {
    // Set flag to show landing page
    localStorage.setItem('return-to-landing', 'true')
    navigate('/')
  }, [navigate])

  const navigateToSignInWithRedirect = useCallback((redirectPath: string) => {
    // Store redirect path for after sign in
    localStorage.setItem('auth-redirect', redirectPath)
    navigate('/signin')
  }, [navigate])

  const isTabActive = useCallback((tab: AppTab): boolean => {
    return activeTab === tab
  }, [activeTab])

  return {
    activeTab,
    navigateToTab,
    navigateToUrl,
    navigateToLanding,
    navigateToSignInWithRedirect,
    isTabActive,
  }
} 