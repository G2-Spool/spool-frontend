import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';

export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className="p-2 rounded"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-500" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600" />
      )}
    </Button>
  );
};