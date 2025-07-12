import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SidebarContextType {
  isLeftSidebarVisible: boolean;
  isRightSidebarVisible: boolean;
  setLeftSidebarVisible: (visible: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  hideAllSidebars: () => void;
  showAllSidebars: () => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [leftRevealedByHover, setLeftRevealedByHover] = useState(false);
  const [rightRevealedByHover, setRightRevealedByHover] = useState(false);

  // Edge hover detection and auto-hide
  useEffect(() => {
    let leftHoverTimer: NodeJS.Timeout;
    let rightHoverTimer: NodeJS.Timeout;
    let leftHideTimer: NodeJS.Timeout;
    let rightHideTimer: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Left edge detection (20px from edge)
      if (clientX <= 20 && clientY > 60 && clientY < windowHeight - 60) {
        if (!isLeftSidebarVisible) {
          clearTimeout(leftHoverTimer);
          leftHoverTimer = setTimeout(() => {
            setIsLeftSidebarVisible(true);
            setLeftRevealedByHover(true);
          }, 300); // Show after 300ms of hovering
        }
      } else {
        clearTimeout(leftHoverTimer);
      }

      // Right edge detection (20px from edge)
      if (clientX >= windowWidth - 20 && clientY > 60 && clientY < windowHeight - 60) {
        if (!isRightSidebarVisible) {
          clearTimeout(rightHoverTimer);
          rightHoverTimer = setTimeout(() => {
            setIsRightSidebarVisible(true);
            setRightRevealedByHover(true);
          }, 300); // Show after 300ms of hovering
        }
      } else {
        clearTimeout(rightHoverTimer);
      }

      // Auto-hide logic for hover-revealed sidebars
      // Left sidebar area (approximately 256px width)
      if (isLeftSidebarVisible && leftRevealedByHover) {
        if (clientX > 280) { // Mouse moved away from left sidebar area
          clearTimeout(leftHideTimer);
          leftHideTimer = setTimeout(() => {
            setIsLeftSidebarVisible(false);
            setLeftRevealedByHover(false);
          }, 500); // Hide after 0.5 seconds of being away
        } else {
          clearTimeout(leftHideTimer); // Cancel hide if mouse returns to sidebar
        }
      }

      // Right sidebar area (approximately 320px width)
      if (isRightSidebarVisible && rightRevealedByHover) {
        if (clientX < windowWidth - 340) { // Mouse moved away from right sidebar area
          clearTimeout(rightHideTimer);
          rightHideTimer = setTimeout(() => {
            setIsRightSidebarVisible(false);
            setRightRevealedByHover(false);
          }, 500); // Hide after 0.5 seconds of being away
        } else {
          clearTimeout(rightHideTimer); // Cancel hide if mouse returns to sidebar
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(leftHoverTimer);
      clearTimeout(rightHoverTimer);
      clearTimeout(leftHideTimer);
      clearTimeout(rightHideTimer);
    };
  }, [isLeftSidebarVisible, isRightSidebarVisible, leftRevealedByHover, rightRevealedByHover]);

  const setLeftSidebarVisible = (visible: boolean) => {
    setIsLeftSidebarVisible(visible);
    setLeftRevealedByHover(false); // Reset hover state when manually controlled
  };

  const setRightSidebarVisible = (visible: boolean) => {
    setIsRightSidebarVisible(visible);
    setRightRevealedByHover(false); // Reset hover state when manually controlled
  };

  const hideAllSidebars = () => {
    setIsLeftSidebarVisible(false);
    setIsRightSidebarVisible(false);
    setLeftRevealedByHover(false);
    setRightRevealedByHover(false);
  };

  const showAllSidebars = () => {
    setIsLeftSidebarVisible(true);
    setIsRightSidebarVisible(true);
    setLeftRevealedByHover(false);
    setRightRevealedByHover(false);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
    setLeftRevealedByHover(false);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(!isRightSidebarVisible);
    setRightRevealedByHover(false);
  };

  const value = {
    isLeftSidebarVisible,
    isRightSidebarVisible,
    setLeftSidebarVisible,
    setRightSidebarVisible,
    hideAllSidebars,
    showAllSidebars,
    toggleLeftSidebar,
    toggleRightSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
      
      {/* Left edge indicator when sidebar is hidden */}
      {!isLeftSidebarVisible && (
        <div className="sidebar-edge-indicator left show" />
      )}
      
      {/* Right edge indicator when sidebar is hidden */}
      {!isRightSidebarVisible && (
        <div className="sidebar-edge-indicator right show" />
      )}
    </SidebarContext.Provider>
  );
}; 