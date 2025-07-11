# Spool Master Design System

## 1. Design Philosophy

Spool's design system embodies **clarity through simplicity**. We prioritize educational content and student engagement over decorative elements. Every design decision supports our core mission: making learning personally relevant through AI-powered personalization.

**Core Principles:**
- **Clarity First**: Clean layouts that never compete with educational content
- **Subtle Engagement**: Teal accents guide without overwhelming
- **Consistent Hierarchy**: Predictable patterns reduce cognitive load
- **Accessible Always**: High contrast, clear typography, keyboard-friendly
- **Performance Matters**: Lightweight components for fast interactions

## 2. Foundational Design Tokens

### 2.1 Color System

**Primary Palette**
```css
/* Teal Accent Scale */
--color-teal-50: #E6FFFA;    /* Lightest background tint */
--color-teal-100: #B2F5EA;   /* Light backgrounds */
--color-teal-200: #81E6D9;   /* Hover states */
--color-teal-300: #4FD1C5;   /* Default teal */
--color-teal-400: #38B2AC;   /* Primary actions */
--color-teal-500: #319795;   /* Primary brand color */
--color-teal-600: #2C7A7B;   /* Pressed states */
--color-teal-700: #285E61;   /* Dark accents */

/* Obsidian & Neutral Scale */
--color-obsidian: #0A0E1A;   /* Primary text */
--color-gray-900: #1A202C;   /* Headers */
--color-gray-800: #2D3748;   /* Body text */
--color-gray-700: #4A5568;   /* Secondary text */
--color-gray-600: #718096;   /* Muted text */
--color-gray-500: #A0AEC0;   /* Placeholders */
--color-gray-400: #CBD5E0;   /* Borders */
--color-gray-300: #E2E8F0;   /* Dividers */
--color-gray-200: #EDF2F7;   /* Backgrounds */
--color-gray-100: #F7FAFC;   /* Light backgrounds */
--color-white: #FFFFFF;      /* Pure white */

/* Semantic Colors */
--color-success: #48BB78;    /* Green for correct/complete */
--color-warning: #ED8936;    /* Orange for warnings */
--color-error: #F56565;      /* Red for errors */
--color-info: #4299E1;       /* Blue for information */

/* Application Specific */
--color-student-bubble: #319795;     /* Student voice in chat */
--color-ai-bubble: #4299E1;          /* AI voice in chat */
--color-personal: #805AD5;           /* Personal life category */
--color-social: #D69E2E;             /* Social life category */
--color-career: #38B2AC;             /* Career life category */
--color-philanthropic: #E53E3E;     /* Philanthropic category */
```

**Usage Guidelines:**
- **Primary Actions**: Use `--color-teal-500` for main CTAs
- **Text Hierarchy**: `--color-obsidian` for headers, `--color-gray-800` for body
- **Interactive States**: Teal scale for hover/active states
- **Backgrounds**: Gray scale from `100` to `200`
- **Life Categories**: Distinct colors for the four categories

### 2.2 Typography

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Consolas', monospace;

/* Font Sizes - 1.25 Scale */
--text-xs: 0.75rem;     /* 12px - Captions */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - Small headers */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Page headers */
--text-4xl: 2.25rem;    /* 36px - Major headers */
--text-5xl: 3rem;       /* 48px - Display */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

**Typography Hierarchy:**
```css
/* Headers */
.h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-obsidian);
}

.h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
}

.h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--color-gray-900);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-gray-800);
}

.body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-gray-800);
}

.body-small {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-gray-700);
}

/* Special Text */
.caption {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--color-gray-600);
  letter-spacing: var(--tracking-wide);
}

.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background: var(--color-gray-100);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
```

### 2.3 Spacing System

```css
/* 8px Base Unit Scale */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */

/* Component Spacing */
--spacing-card-padding: var(--space-6);
--spacing-section-gap: var(--space-8);
--spacing-page-margin: var(--space-6);
```

### 2.4 Layout & Grid

```css
/* Breakpoints */
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */

/* Container Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Grid System */
--grid-columns: 12;
--grid-gap: var(--space-4);
```

### 2.5 Borders & Radius

```css
/* Border Widths */
--border-0: 0;
--border-1: 1px;
--border-2: 2px;
--border-4: 4px;

/* Border Radius */
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Pills */

/* Component Specific */
--radius-button: var(--radius-md);
--radius-card: var(--radius-lg);
--radius-modal: var(--radius-xl);
```

### 2.6 Shadows & Elevation

```css
/* Shadow Scale */
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Focus Ring */
--shadow-focus: 0 0 0 3px rgba(49, 151, 149, 0.5); /* Teal focus */
```

### 2.7 Animation & Motion

```css
/* Duration Scale */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 400ms;

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Standard Transitions */
--transition-all: all var(--duration-normal) var(--ease-in-out);
--transition-colors: background-color, border-color, color, fill, stroke var(--duration-fast) var(--ease-in-out);
--transition-opacity: opacity var(--duration-normal) var(--ease-in-out);
--transition-transform: transform var(--duration-normal) var(--ease-out);
```

### 2.8 Iconography

**Icon Library**: Lucide React (Consistent stroke-based design)

**Standard Icon Sizes:**
```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-base: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

**Icon Categories & Usage:**
- **Navigation**: Home, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, ArrowRight
- **Actions**: Play, Pause, Check, Plus, Minus, Edit3, Trash2, Save, Share2, Download
- **Status**: CheckCircle2, XCircle, AlertTriangle, Info, AlertCircle
- **Learning**: BookOpen, GraduationCap, Lightbulb, Puzzle, Trophy, Award
- **Communication**: MessageCircle, Mic, Volume2, Video, Phone
- **Progress**: BarChart3, Flame (streak), Star (achievement), Flag (milestone)
- **User**: User, Users, Settings, LogOut, Bell
- **Content**: FileText, Folder, Image, Link, Search, Filter
- **Time**: Clock, Calendar, Timer, History
- **Arrows**: ArrowUp, ArrowDown, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown

## 3. Component Library

### 3.1 Atoms

#### Button
```css
/* Base Button */
.btn {
  /* Structure */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  /* Typography */
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  line-height: 1;
  
  /* Spacing */
  padding: var(--space-3) var(--space-4);
  
  /* Visual */
  border: var(--border-1) solid transparent;
  border-radius: var(--radius-button);
  
  /* Interaction */
  cursor: pointer;
  transition: var(--transition-all);
  
  /* States */
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Variants */
.btn-primary {
  background: var(--color-teal-500);
  color: var(--color-white);
  
  &:hover { background: var(--color-teal-600); }
  &:active { background: var(--color-teal-700); }
}

.btn-secondary {
  background: var(--color-gray-200);
  color: var(--color-gray-800);
  
  &:hover { background: var(--color-gray-300); }
}

.btn-outline {
  background: transparent;
  border-color: var(--color-gray-400);
  color: var(--color-gray-700);
  
  &:hover { 
    border-color: var(--color-teal-500);
    color: var(--color-teal-600);
  }
}

.btn-ghost {
  background: transparent;
  color: var(--color-gray-700);
  
  &:hover { background: var(--color-gray-100); }
}

/* Sizes */
.btn-sm {
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
}

.btn-lg {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-6);
}

.btn-icon {
  padding: var(--space-2);
  width: 40px;
  height: 40px;
}
```

#### Input
```css
.input {
  /* Structure */
  width: 100%;
  
  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-gray-800);
  
  /* Spacing */
  padding: var(--space-3) var(--space-4);
  
  /* Visual */
  background: var(--color-white);
  border: var(--border-1) solid var(--color-gray-400);
  border-radius: var(--radius-base);
  
  /* States */
  &::placeholder {
    color: var(--color-gray-500);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-teal-500);
    box-shadow: var(--shadow-focus);
  }
  
  &:disabled {
    background: var(--color-gray-100);
    cursor: not-allowed;
  }
  
  &.input-error {
    border-color: var(--color-error);
  }
}

/* Sizes */
.input-sm {
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
}

.input-lg {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-5);
}
```

#### Badge
```css
.badge {
  /* Structure */
  display: inline-flex;
  align-items: center;
  
  /* Typography */
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  
  /* Spacing */
  padding: var(--space-1) var(--space-2);
  
  /* Visual */
  border-radius: var(--radius-full);
  
  /* Variants */
  &.badge-default {
    background: var(--color-gray-200);
    color: var(--color-gray-700);
  }
  
  &.badge-teal {
    background: var(--color-teal-100);
    color: var(--color-teal-700);
  }
  
  &.badge-success {
    background: var(--color-success);
    background-opacity: 0.1;
    color: var(--color-success);
  }
}
```

### 3.2 Molecules

#### Voice Interview Chat Bubble
```css
.chat-bubble {
  /* Structure */
  max-width: 70%;
  
  /* Spacing */
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
  
  /* Visual */
  border-radius: var(--radius-lg);
  
  /* Typography */
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  
  /* Variants */
  &.chat-bubble-student {
    background: var(--color-teal-500);
    color: var(--color-white);
    align-self: flex-end;
    border-bottom-right-radius: var(--radius-sm);
  }
  
  &.chat-bubble-ai {
    background: var(--color-gray-100);
    color: var(--color-gray-800);
    align-self: flex-start;
    border-bottom-left-radius: var(--radius-sm);
  }
  
  /* Timestamp */
  .chat-timestamp {
    font-size: var(--text-xs);
    color: var(--color-gray-600);
    margin-top: var(--space-1);
  }
}
```

#### Concept Hook Card
```css
.hook-card {
  /* Structure */
  position: relative;
  height: 200px;
  
  /* Spacing */
  padding: var(--space-4);
  
  /* Visual */
  background: var(--color-white);
  border: var(--border-1) solid var(--color-gray-300);
  border-radius: var(--radius-card);
  transition: var(--transition-all);
  
  /* Hover */
  &:hover {
    border-color: var(--color-teal-400);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  /* Life Category Indicator */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: var(--radius-card) var(--radius-card) 0 0;
  }
  
  &.hook-personal::before { background: var(--color-personal); }
  &.hook-social::before { background: var(--color-social); }
  &.hook-career::before { background: var(--color-career); }
  &.hook-philanthropic::before { background: var(--color-philanthropic); }
  
  /* Content */
  .hook-icon {
    width: var(--icon-lg);
    height: var(--icon-lg);
    margin-bottom: var(--space-3);
  }
  
  .hook-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-gray-600);
    margin-bottom: var(--space-2);
  }
  
  .hook-text {
    font-size: var(--text-base);
    color: var(--color-gray-800);
    line-height: var(--leading-relaxed);
  }
}
```

#### Progress Indicator
```css
.progress-bar {
  /* Container */
  position: relative;
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  
  /* Fill */
  .progress-fill {
    height: 100%;
    background: var(--color-teal-500);
    border-radius: var(--radius-full);
    transition: width var(--duration-slow) var(--ease-out);
    
    /* Animated Stripes */
    &.progress-animated {
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 1rem 1rem;
      animation: progress-stripes 1s linear infinite;
    }
  }
  
  /* Label */
  .progress-label {
    position: absolute;
    top: -24px;
    right: 0;
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--color-gray-600);
  }
}

@keyframes progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
```

### 3.3 Organisms

#### Navigation Header
```css
.nav-header {
  /* Structure */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  
  /* Visual */
  background: var(--color-white);
  border-bottom: var(--border-1) solid var(--color-gray-300);
  box-shadow: var(--shadow-sm);
  
  /* Content Container */
  .nav-container {
    max-width: var(--container-xl);
    margin: 0 auto;
    padding: 0 var(--space-6);
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* Logo */
  .nav-logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-obsidian);
    
    .logo-mark {
      width: 32px;
      height: 32px;
      color: var(--color-teal-500);
    }
  }
  
  /* Navigation Items */
  .nav-items {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    
    .nav-link {
      font-size: var(--text-base);
      color: var(--color-gray-700);
      transition: var(--transition-colors);
      
      &:hover { color: var(--color-teal-600); }
      &.active { color: var(--color-teal-500); }
    }
  }
  
  /* User Menu */
  .nav-user {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    
    .streak-badge {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-3);
      background: var(--color-teal-100);
      color: var(--color-teal-700);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      
      .streak-icon {
        width: var(--icon-sm);
        height: var(--icon-sm);
        color: var(--color-warning);
      }
    }
  }
}
```

#### Concept Display Container
```css
.concept-display {
  /* Structure */
  max-width: 1024px;
  margin: 0 auto;
  
  /* Section: Hook & Relevance */
  .hooks-section {
    margin-bottom: var(--space-12);
    
    .hooks-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
      
      .hooks-icon {
        width: var(--icon-lg);
        height: var(--icon-lg);
        color: var(--color-teal-500);
      }
      
      h2 {
        font-size: var(--text-2xl);
        font-weight: var(--font-semibold);
        color: var(--color-gray-900);
      }
    }
    
    .hooks-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
  }
  
  /* Section: Show Me Examples */
  .examples-section {
    margin-bottom: var(--space-12);
    
    .examples-header {
      /* Same as hooks-header */
    }
    
    .examples-carousel {
      position: relative;
      
      .example-card {
        background: var(--color-gray-50);
        border-radius: var(--radius-card);
        padding: var(--space-6);
        margin-bottom: var(--space-4);
        
        .example-interest-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          background: var(--color-teal-100);
          color: var(--color-teal-700);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          margin-bottom: var(--space-3);
        }
        
        .example-text {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--color-gray-800);
        }
        
        .example-visual {
          margin-top: var(--space-4);
          border-radius: var(--radius-base);
          overflow: hidden;
        }
      }
    }
  }
  
  /* Section: What & How */
  .core-content-section {
    .content-tabs {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-1);
      background: var(--color-gray-100);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
      
      .tab-button {
        flex: 1;
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: none;
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
        color: var(--color-gray-600);
        cursor: pointer;
        transition: var(--transition-all);
        
        &:hover { color: var(--color-gray-800); }
        
        &.active {
          background: var(--color-white);
          color: var(--color-teal-600);
          box-shadow: var(--shadow-sm);
        }
      }
    }
    
    .tab-content {
      padding: var(--space-6);
      background: var(--color-white);
      border: var(--border-1) solid var(--color-gray-200);
      border-radius: var(--radius-card);
      
      /* Vocabulary Cards */
      .vocab-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-4);
        
        .vocab-card {
          padding: var(--space-4);
          background: var(--color-gray-50);
          border-radius: var(--radius-base);
          cursor: pointer;
          transition: var(--transition-all);
          
          &:hover {
            background: var(--color-teal-50);
            transform: translateY(-2px);
          }
          
          .vocab-term {
            font-weight: var(--font-semibold);
            color: var(--color-gray-900);
            margin-bottom: var(--space-1);
          }
          
          .vocab-definition {
            font-size: var(--text-sm);
            color: var(--color-gray-600);
          }
        }
      }
    }
  }
}
```

#### Exercise Interface
```css
.exercise-container {
  max-width: 800px;
  margin: 0 auto;
  
  /* Exercise Header */
  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    background: var(--color-gray-50);
    border-radius: var(--radius-card);
    margin-bottom: var(--space-6);
    
    .exercise-type {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      
      .type-badge {
        padding: var(--space-1) var(--space-3);
        background: var(--color-teal-100);
        color: var(--color-teal-700);
        border-radius: var(--radius-full);
        font-size: var(--text-xs);
        font-weight: var(--font-semibold);
        text-transform: uppercase;
      }
    }
    
    .exercise-timer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-gray-600);
      font-size: var(--text-sm);
    }
  }
  
  /* Exercise Prompt */
  .exercise-prompt {
    padding: var(--space-6);
    background: var(--color-white);
    border: var(--border-2) solid var(--color-teal-200);
    border-radius: var(--radius-card);
    margin-bottom: var(--space-8);
    
    .prompt-context {
      padding: var(--space-4);
      background: var(--color-teal-50);
      border-radius: var(--radius-base);
      margin-bottom: var(--space-4);
      
      .context-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        font-size: var(--text-sm);
        color: var(--color-teal-700);
        font-weight: var(--font-medium);
      }
    }
    
    .prompt-text {
      font-size: var(--text-lg);
      line-height: var(--leading-relaxed);
      color: var(--color-gray-800);
    }
  }
  
  /* Response Area */
  .exercise-response {
    .response-instructions {
      display: flex;
      align-items: start;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--color-info);
      background-opacity: 0.1;
      border-radius: var(--radius-base);
      margin-bottom: var(--space-4);
      
      /* Lucide React Info Icon */
      .info-icon {
        width: var(--icon-base);
        height: var(--icon-base);
        color: var(--color-info);
        flex-shrink: 0;
      }
      
      p {
        font-size: var(--text-sm);
        color: var(--color-gray-700);
      }
    }
    
    .response-textarea {
      width: 100%;
      min-height: 300px;
      padding: var(--space-4);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      line-height: var(--leading-relaxed);
      color: var(--color-gray-800);
      background: var(--color-white);
      border: var(--border-1) solid var(--color-gray-400);
      border-radius: var(--radius-base);
      resize: vertical;
      
      &:focus {
        outline: none;
        border-color: var(--color-teal-500);
        box-shadow: var(--shadow-focus);
      }
    }
    
    .response-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-4);
      
      .character-count {
        font-size: var(--text-sm);
        color: var(--color-gray-600);
        
        &.warning { color: var(--color-warning); }
        &.error { color: var(--color-error); }
      }
    }
  }
}
```

#### Progress Dashboard
```css
.progress-dashboard {
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-8);
    
    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
    
    .stat-card {
      padding: var(--space-6);
      background: var(--color-white);
      border: var(--border-1) solid var(--color-gray-200);
      border-radius: var(--radius-card);
      
      .stat-label {
        font-size: var(--text-sm);
        color: var(--color-gray-600);
        margin-bottom: var(--space-2);
      }
      
      .stat-value {
        font-size: var(--text-3xl);
        font-weight: var(--font-bold);
        color: var(--color-obsidian);
        line-height: 1;
        margin-bottom: var(--space-1);
      }
      
      .stat-change {
        font-size: var(--text-sm);
        color: var(--color-success);
        
        &.negative { color: var(--color-error); }
      }
      
      &.stat-streak {
        background: var(--color-teal-50);
        border-color: var(--color-teal-200);
        
        .stat-value { color: var(--color-teal-600); }
      }
    }
  }
  
  /* Learning Path Visualization */
  .learning-path {
    padding: var(--space-8);
    background: var(--color-white);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-base);
    
    .path-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
      
      h3 {
        font-size: var(--text-xl);
        font-weight: var(--font-semibold);
        color: var(--color-gray-900);
      }
      
      .path-progress {
        font-size: var(--text-sm);
        color: var(--color-gray-600);
      }
    }
    
    .path-nodes {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      overflow-x: auto;
      padding-bottom: var(--space-4);
      
      .path-node {
        flex-shrink: 0;
        position: relative;
        
        .node-circle {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--font-semibold);
          transition: var(--transition-all);
          cursor: pointer;
          
          /* States */
          &.completed {
            background: var(--color-teal-500);
            color: var(--color-white);
          }
          
          &.current {
            background: var(--color-white);
            border: var(--border-4) solid var(--color-teal-500);
            color: var(--color-teal-600);
            box-shadow: var(--shadow-lg);
          }
          
          &.locked {
            background: var(--color-gray-200);
            color: var(--color-gray-500);
            cursor: not-allowed;
          }
        }
        
        .node-label {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          font-size: var(--text-xs);
          color: var(--color-gray-600);
          white-space: nowrap;
        }
        
        /* Connector Line */
        &:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 24px;
          left: 48px;
          width: var(--space-4);
          height: 2px;
          background: var(--color-gray-300);
        }
        
        &.completed:not(:last-child)::after {
          background: var(--color-teal-500);
        }
      }
    }
  }
}
```

## 4. Spool-Specific Components

### Voice Interview Interface
```css
.voice-interview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  height: calc(100vh - 80px);
  padding: var(--space-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  /* Chat Panel */
  .chat-panel {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-base);
    overflow: hidden;
    
    .chat-header {
      padding: var(--space-4) var(--space-6);
      background: var(--color-gray-50);
      border-bottom: var(--border-1) solid var(--color-gray-200);
      
      .chat-title {
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        color: var(--color-gray-900);
      }
      
      .chat-status {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-top: var(--space-1);
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--color-success);
          
          &.recording { 
            background: var(--color-error);
            animation: pulse 2s infinite;
          }
        }
        
        .status-text {
          font-size: var(--text-sm);
          color: var(--color-gray-600);
        }
      }
    }
    
    .chat-messages {
      flex: 1;
      padding: var(--space-6);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .chat-input {
      padding: var(--space-4);
      background: var(--color-gray-50);
      border-top: var(--border-1) solid var(--color-gray-200);
      
      .input-fallback {
        display: flex;
        gap: var(--space-2);
        
        input {
          flex: 1;
        }
      }
    }
  }
  
  /* Visual Panel */
  .visual-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--color-gray-50);
    border-radius: var(--radius-card);
    padding: var(--space-8);
    
    .voice-visualizer {
      width: 200px;
      height: 200px;
      margin-bottom: var(--space-8);
      
      /* Voice wave animation */
      .wave-ring {
        width: 100%;
        height: 100%;
        border: var(--border-2) solid var(--color-teal-400);
        border-radius: var(--radius-full);
        opacity: 0;
        
        &.active {
          animation: wave-expand 2s ease-out infinite;
        }
      }
    }
    
    .interview-controls {
      display: flex;
      gap: var(--space-4);
      
      .control-button {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-white);
        border: var(--border-2) solid var(--color-gray-300);
        cursor: pointer;
        transition: var(--transition-all);
        
        &:hover {
          border-color: var(--color-teal-400);
          transform: scale(1.05);
        }
        
        &.primary {
          background: var(--color-teal-500);
          border-color: var(--color-teal-500);
          color: var(--color-white);
          
          &:hover {
            background: var(--color-teal-600);
            border-color: var(--color-teal-600);
          }
        }
        
        svg {
          width: var(--icon-lg);
          height: var(--icon-lg);
        }
      }
    }
  }
}

@keyframes wave-expand {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Life Category Indicators
```css
.life-category {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  
  /* Lucide React Icons */
  .category-icon {
    width: var(--icon-base);
    height: var(--icon-base);
  }
  
  /* Icon suggestions for each category:
  - Personal: User, Heart, Home
  - Social: Users, MessageCircle, Share2
  - Career: Briefcase, TrendingUp, Target
  - Philanthropic: Heart, Globe, Sparkles
  */
  
  .category-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }
  
  /* Personal */
  &.category-personal {
    .category-icon { color: var(--color-personal); }
    .category-label { color: var(--color-personal); }
  }
  
  /* Social */
  &.category-social {
    .category-icon { color: var(--color-social); }
    .category-label { color: var(--color-social); }
  }
  
  /* Career */
  &.category-career {
    .category-icon { color: var(--color-career); }
    .category-label { color: var(--color-career); }
  }
  
  /* Philanthropic */
  &.category-philanthropic {
    .category-icon { color: var(--color-philanthropic); }
    .category-label { color: var(--color-philanthropic); }
  }
}
```

### Gamification Elements
```css
/* Achievement Badge */
.achievement-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  
  .badge-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full);
    background: var(--color-teal-100);
    
    &.rare { background: var(--color-info); opacity: 0.2; }
    &.epic { background: var(--color-personal); opacity: 0.2; }
    &.legendary { background: var(--color-warning); opacity: 0.2; }
  }
  
  /* Lucide React Icon */
  .badge-icon {
    position: relative;
    width: var(--icon-xl);
    height: var(--icon-xl);
    color: var(--color-teal-600);
    
    .rare & { color: var(--color-info); }
    .epic & { color: var(--color-personal); }
    .legendary & { color: var(--color-warning); }
  }
  
  &.locked {
    opacity: 0.5;
    filter: grayscale(100%);
  }
}

/* Streak Display */
.streak-display {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-warning);
  background-opacity: 0.1;
  border-radius: var(--radius-card);
  
  /* Lucide React Flame Icon */
  .streak-icon {
    width: var(--icon-xl);
    height: var(--icon-xl);
    color: var(--color-warning);
  }
  
  .streak-info {
    .streak-number {
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--color-gray-900);
      line-height: 1;
    }
    
    .streak-label {
      font-size: var(--text-sm);
      color: var(--color-gray-600);
    }
  }
}

/* Points Animation */
.points-popup {
  position: fixed;
  padding: var(--space-2) var(--space-4);
  background: var(--color-teal-500);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-lg);
  animation: points-float 2s ease-out forwards;
  pointer-events: none;
}

@keyframes points-float {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100px);
  }
}
```

## 5. Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 0 var(--space-4);
  margin: 0 auto;
  
  @media (min-width: 640px) {
    max-width: var(--container-sm);
  }
  
  @media (min-width: 768px) {
    max-width: var(--container-md);
    padding: 0 var(--space-6);
  }
  
  @media (min-width: 1024px) {
    max-width: var(--container-lg);
  }
  
  @media (min-width: 1280px) {
    max-width: var(--container-xl);
  }
}

/* Grid Responsive */
.grid {
  display: grid;
  gap: var(--space-4);
  
  &.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  &.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  &.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  &.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  @media (min-width: 640px) {
    &.sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    &.sm\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  }
  
  @media (min-width: 768px) {
    &.md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    &.md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    &.md\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }
  
  @media (min-width: 1024px) {
    &.lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    &.lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }
}
```

### Mobile-Specific Patterns
```css
/* Touch Targets */
@media (max-width: 768px) {
  .btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .nav-header {
    .nav-items {
      display: none;
    }
    
    .mobile-menu-button {
      display: flex;
    }
  }
  
  .concept-display {
    .hooks-grid {
      grid-template-columns: 1fr;
    }
    
    .examples-carousel {
      /* Enable touch swiping */
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      
      .example-card {
        scroll-snap-align: start;
      }
    }
  }
  
  .voice-interview {
    grid-template-columns: 1fr;
    
    .visual-panel {
      order: -1;
      min-height: 300px;
    }
  }
}
```

## 6. Accessibility Standards

### Focus Management
```css
/* Focus Visible */
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-teal-500);
  color: var(--color-white);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  border-radius: var(--radius-base);
  
  &:focus {
    top: var(--space-2);
  }
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### ARIA Patterns
```html
<!-- Progress Bar -->
<div role="progressbar" 
     aria-valuenow="75" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Concept mastery progress">
  <div class="progress-fill" style="width: 75%"></div>
</div>

<!-- Voice Interview Status -->
<div class="chat-status" role="status" aria-live="polite">
  <span class="status-dot recording" aria-hidden="true"></span>
  <span class="status-text">Recording your response...</span>
</div>

<!-- Exercise Timer -->
<div class="exercise-timer" role="timer" aria-live="polite">
  <Clock className="timer-icon" aria-hidden="true" />
  <span>5:23 elapsed</span>
</div>

<!-- Icon Button Example -->
<button className="btn-icon" aria-label="Start voice interview">
  <Mic className="w-5 h-5" />
</button>
```

## 7. Dark Mode Considerations

While the primary design uses a light theme, we can prepare for future dark mode:

```css
/* Dark Mode Variables (Future Enhancement) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-obsidian: #F7FAFC;
    --color-gray-900: #EDF2F7;
    --color-gray-800: #E2E8F0;
    --color-gray-700: #CBD5E0;
    --color-gray-600: #A0AEC0;
    --color-gray-500: #718096;
    --color-gray-400: #4A5568;
    --color-gray-300: #2D3748;
    --color-gray-200: #1A202C;
    --color-gray-100: #171923;
    --color-white: #0A0E1A;
    
    /* Adjust teal for dark backgrounds */
    --color-teal-500: #38B2AC;
    --color-teal-600: #319795;
    --color-teal-700: #2C7A7B;
  }
}
```

## 8. Implementation Guidelines

### Component Development Order
1. **Phase 1 - Core Atoms**: Buttons, Inputs, Badges, Typography
2. **Phase 2 - Essential Molecules**: Chat Bubbles, Cards, Progress Bars
3. **Phase 3 - Key Organisms**: Navigation, Voice Interview, Concept Display
4. **Phase 4 - Complex Features**: Exercise System, Progress Dashboard
5. **Phase 5 - Polish**: Animations, Transitions, Micro-interactions

### Performance Optimization
- Use CSS custom properties for dynamic theming
- Implement lazy loading for images in examples
- Optimize animation performance with `will-change`
- Use CSS Grid and Flexbox for layout (no heavy frameworks)
- Minimize JavaScript for style changes

### Testing Requirements
- Test all interactive states (hover, focus, active, disabled)
- Verify touch targets are 44px minimum on mobile
- Ensure color contrast meets WCAG AA standards
- Test keyboard navigation flows
- Verify screen reader announcements
- Test responsive layouts at all breakpoints

This design system provides a complete foundation for building Spool's UI with consistency, accessibility, and performance in mind. The simple color palette with teal accents creates a calm learning environment while maintaining visual interest through thoughtful typography and spacing.