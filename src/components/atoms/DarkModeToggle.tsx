import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../../providers/ThemeProvider';

export const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" style={{ color: 'var(--thread-primary)' }} />
      ) : (
        <Moon className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
      )}
    </Button>
  );
};