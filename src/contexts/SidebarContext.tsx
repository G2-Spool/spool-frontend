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

  // Edge hover detection
  useEffect(() => {
    let leftHoverTimer: NodeJS.Timeout;
    let rightHoverTimer: NodeJS.Timeout;

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
          }, 300); // Show after 300ms of hovering
        }
      } else {
        clearTimeout(rightHoverTimer);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(leftHoverTimer);
      clearTimeout(rightHoverTimer);
    };
  }, [isLeftSidebarVisible, isRightSidebarVisible]);

  const setLeftSidebarVisible = (visible: boolean) => {
    setIsLeftSidebarVisible(visible);
  };

  const setRightSidebarVisible = (visible: boolean) => {
    setIsRightSidebarVisible(visible);
  };

  const hideAllSidebars = () => {
    setIsLeftSidebarVisible(false);
    setIsRightSidebarVisible(false);
  };

  const showAllSidebars = () => {
    setIsLeftSidebarVisible(true);
    setIsRightSidebarVisible(true);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(!isRightSidebarVisible);
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