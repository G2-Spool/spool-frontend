# Spool Design System 2.0: Threads & Illumination

## 1. Core Design Philosophy

**Threads & Illumination** represents the evolution of Spool's visual language, combining educational clarity with a modern, tactile aesthetic that makes learning feel approachable and engaging.

### Primary Principles

- **Illuminated Threads**: Components feel subtly lit from within, like threads catching light in the learning journey
- **Tactile Minimalism**: Soft shadows and gentle glows make UI elements feel touchable and real
- **Layered Clarity**: Multiple depth layers guide focus without overwhelming the educational content
- **Thread Physics**: Subtle animations suggest the natural movement of threads connecting concepts
- **Focused Accessibility**: Every design decision supports learners of all abilities

### Dark Mode Philosophy

- **Illuminated Surfaces**: Components glow softly from within on darker backgrounds
- **Tactile & Approachable**: Soft shadows and gentle borders create inviting interaction points
- **Focused Clarity**: Dark environments reduce visual noise, allowing content to shine

## 2. Foundational Design Tokens

### 2.1 Color System

```css
:root {
  /* Thread Colors - Primary Palette */
  --thread-primary: #4FD1C5;      /* Teal - main thread color */
  --thread-secondary: #805AD5;    /* Purple - connecting threads */
  --thread-tertiary: #ED64A6;     /* Pink - discovery moments */
  --thread-accent: #38B2AC;       /* Deep teal - emphasis */
  
  /* Surface Colors - Light Mode */
  --surface-ground: #FAFAFA;      /* Base background */
  --surface-base: #FFFFFF;        /* Component background */
  --surface-raised: #FFFFFF;      /* Elevated components */
  --surface-overlay: #F7FAFC;     /* Hover states */
  
  /* Text Colors - Light Mode */
  --text-primary: #1A202C;        /* Primary text */
  --text-secondary: #4A5568;      /* Secondary text */
  --text-muted: #718096;          /* Muted text */
  --text-inverse: #FFFFFF;        /* Inverse text */
  
  /* Semantic Colors */
  --color-success: #48BB78;       /* Green for correct/complete */
  --color-warning: #ED8936;       /* Orange for warnings */
  --color-error: #F56565;         /* Red for errors */
  --color-info: #4299E1;          /* Blue for information */
  
  /* Life Categories */
  --color-personal: #805AD5;      /* Personal life */
  --color-social: #D69E2E;        /* Social life */
  --color-career: #38B2AC;        /* Career */
  --color-philanthropic: #E53E3E; /* Philanthropic */
  
  /* Border System */
  --border-color: rgba(0, 0, 0, 0.05);
  --border-color-strong: rgba(0, 0, 0, 0.1);
}

/* Dark Mode Colors */
[data-theme="dark"] {
  /* Surface Colors - Dark Mode */
  --surface-ground: #0A0E1A;      /* Deepest background */
  --surface-base: #1A202C;        /* Component background */
  --surface-raised: #2D3748;      /* Elevated components */
  --surface-overlay: #374151;     /* Hover states */
  
  /* Text Colors - Dark Mode */
  --text-primary: #F7FAFC;        /* Primary text */
  --text-secondary: #CBD5E0;      /* Secondary text */
  --text-muted: #A0AEC0;          /* Muted text */
  --text-inverse: #1A202C;        /* Inverse text */
  
  /* Border System - Dark Mode */
  --border-color: rgba(255, 255, 255, 0.1);
  --border-color-strong: rgba(255, 255, 255, 0.2);
  --border-glow: rgba(255, 255, 255, 0.05);
  
  /* Adjusted Thread Colors for Dark Mode */
  --thread-primary: #5FE1D5;      /* Brighter teal */
  --thread-secondary: #9F7AEA;    /* Lighter purple */
  --thread-tertiary: #F687B3;     /* Lighter pink */
}
```

### 2.2 Shadow & Glow System

```css
:root {
  /* Light Mode Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.02);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 
               0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04), 
               0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.04), 
               0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.04), 
               0 10px 10px rgba(0, 0, 0, 0.04);
  
  /* Focus States */
  --focus-ring: 0 0 0 3px rgba(79, 209, 197, 0.5);
  --focus-ring-error: 0 0 0 3px rgba(245, 101, 101, 0.5);
}

[data-theme="dark"] {
  /* Dark Mode Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2), 
               0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 5px 15px rgba(0, 0, 0, 0.3), 
               0 2px 5px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.3), 
               0 5px 10px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 35px rgba(0, 0, 0, 0.3), 
               0 10px 15px rgba(0, 0, 0, 0.2);
  
  /* Inner Glow Effects */
  --glow-inner: inset 0 1px 1px rgba(255, 255, 255, 0.05);
  --glow-inner-strong: inset 0 1px 2px rgba(255, 255, 255, 0.1);
  
  /* Focus States - Dark Mode */
  --focus-ring: 0 0 0 3px rgba(79, 209, 197, 0.6);
  --focus-ring-error: 0 0 0 3px rgba(245, 101, 101, 0.6);
}
```

### 2.3 Typography System

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  
  /* Font Sizes - 1.25 Scale */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  
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
}
```

### 2.4 Spacing & Layout

```css
:root {
  /* Spacing Scale - 4px base */
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
  
  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.25rem;   /* 20px */
  --radius-full: 9999px;   /* Full circle */
  
  /* Breakpoints */
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
  --screen-2xl: 1536px;
  
  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}
```

### 2.5 Animation & Motion

```css
:root {
  /* Duration Scale */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 600ms;
  
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
  --transition-shadow: box-shadow var(--duration-normal) var(--ease-in-out);
}
```

## 3. Core Components

### 3.1 Button Component

```css
.btn {
  /* Base Structure */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  
  /* Typography */
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  line-height: 1;
  
  /* Visual */
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--transition-all);
  
  /* Thread Animation on Click */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(79, 209, 197, 0.3);
    transform: translate(-50%, -50%);
    transition: width var(--duration-slowest), height var(--duration-slowest);
  }
  
  &:active::after {
    width: 300px;
    height: 300px;
  }
  
  /* Focus State */
  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  
  /* Disabled State */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Primary Button */
.btn-primary {
  background: var(--thread-primary);
  color: var(--surface-ground);
  box-shadow: var(--shadow-sm);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  [data-theme="dark"] & {
    color: var(--text-inverse);
    box-shadow: var(--shadow-sm), 
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

/* Secondary Button */
.btn-secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--border-color);
  
  &:hover:not(:disabled) {
    background: var(--surface-overlay);
    border-color: var(--border-color-strong);
  }
  
  [data-theme="dark"] & {
    box-shadow: var(--shadow-sm), var(--glow-inner);
  }
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  
  &:hover:not(:disabled) {
    background: var(--surface-overlay);
    color: var(--text-primary);
  }
}

/* Icon Button */
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: var(--radius-full);
}

/* Size Variants */
.btn-sm {
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
}

.btn-lg {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-6);
}
```

### 3.2 Input Component

```css
.input {
  /* Base Structure */
  width: 100%;
  padding: var(--space-3) var(--space-4);
  
  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text-primary);
  
  /* Visual */
  background: var(--surface-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: var(--transition-all);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--thread-primary);
    box-shadow: var(--focus-ring);
  }
  
  &:disabled {
    background: var(--surface-overlay);
    cursor: not-allowed;
  }
  
  &.input-error {
    border-color: var(--color-error);
    
    &:focus {
      box-shadow: var(--focus-ring-error);
    }
  }
  
  /* Dark Mode */
  [data-theme="dark"] & {
    background: var(--surface-base);
    border-color: var(--border-color);
    box-shadow: var(--glow-inner);
    
    &:focus {
      box-shadow: var(--focus-ring), var(--glow-inner-strong);
    }
  }
}

/* Textarea Variant */
.textarea {
  min-height: 120px;
  resize: vertical;
}

/* Size Variants */
.input-sm {
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
}

.input-lg {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-5);
}
```

### 3.3 Thread Card Component

```css
.thread-card {
  /* Base Structure */
  background: var(--surface-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
  transition: var(--transition-all);
  
  /* Light Mode Shadow */
  box-shadow: var(--shadow-sm);
  
  /* Thread Accent Line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      var(--thread-primary),
      transparent
    );
    opacity: 0;
    transition: opacity var(--duration-slow) ease;
  }
  
  /* Hover State */
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    
    &::before {
      opacity: 0.8;
    }
    
    .thread-indicator {
      transform: translateX(4px);
    }
  }
  
  /* Dark Mode */
  [data-theme="dark"] & {
    background: var(--surface-raised);
    border-color: var(--border-color);
    box-shadow: var(--shadow-sm), var(--glow-inner);
    
    &:hover {
      box-shadow: var(--shadow-md), var(--glow-inner-strong);
      border-color: rgba(79, 209, 197, 0.3);
    }
  }
}

.thread-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--thread-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: transform var(--duration-normal) ease;
}

.thread-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: var(--space-3) 0;
}

.thread-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.thread-stats {
  display: flex;
  gap: var(--space-4);
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-muted);
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
}
```

### 3.4 Chat Bubble Component

```css
.chat-bubble {
  /* Base Structure */
  max-width: 70%;
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
  border-radius: var(--radius-xl);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  
  /* Student Bubble (FR-005) */
  &.chat-bubble-student {
    background: var(--thread-primary);
    color: var(--surface-ground);
    align-self: flex-end;
    border-bottom-right-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
    
    [data-theme="dark"] & {
      color: var(--text-inverse);
    }
  }
  
  /* AI Bubble */
  &.chat-bubble-ai {
    background: var(--surface-overlay);
    color: var(--text-primary);
    align-self: flex-start;
    border-bottom-left-radius: var(--radius-sm);
    
    [data-theme="dark"] & {
      background: var(--surface-raised);
      border: 1px solid var(--border-color);
      box-shadow: var(--glow-inner);
    }
  }
  
  .chat-timestamp {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--space-1);
  }
}
```

### 3.5 Rich Text Editor Component

```css
.rich-text-editor {
  /* Container */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--surface-raised);
  padding: var(--space-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  
  /* Dark Mode */
  [data-theme="dark"] & {
    background: var(--surface-raised);
    border-color: var(--border-color);
    box-shadow: var(--shadow-md), var(--glow-inner);
  }
}

.editor-group {
  display: inline-flex;
  gap: var(--space-1);
}

.editor-btn {
  /* Base Structure */
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-all);
  position: relative;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    color: var(--text-primary);
    background: var(--surface-overlay);
  }
  
  &.active {
    background: var(--surface-ground);
    color: var(--text-primary);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  /* Dark Mode */
  [data-theme="dark"] & {
    color: var(--text-muted);
    
    &:hover {
      color: var(--text-primary);
      background: var(--surface-overlay);
    }
    
    &.active {
      background: var(--surface-ground);
      color: var(--thread-primary);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }
}

.editor-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
  margin: 0 var(--space-1);
  
  [data-theme="dark"] & {
    background: var(--border-color);
  }
}
```

### 3.6 Progress Components

#### Progress Bar
```css
.progress-bar {
  /* Container */
  position: relative;
  width: 100%;
  height: 8px;
  background: var(--surface-overlay);
  border-radius: var(--radius-full);
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: var(--surface-ground);
    box-shadow: var(--glow-inner);
  }
  
  /* Fill */
  .progress-fill {
    height: 100%;
    background: var(--thread-primary);
    border-radius: var(--radius-full);
    transition: width var(--duration-slow) var(--ease-out);
    position: relative;
    
    /* Animated Stripes */
    &.progress-animated::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
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
    color: var(--text-muted);
  }
}

@keyframes progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
```

#### Learning Progress Widget
```css
.progress-widget {
  /* Base Structure */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-3xl);
  padding: var(--space-6);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  
  /* Glass Overlay Effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: var(--radius-3xl);
  }
  
  .widget-content {
    position: relative;
    z-index: 1;
  }
  
  .widget-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-2);
  }
  
  .widget-subtitle {
    font-size: var(--text-base);
    opacity: 0.9;
    margin-bottom: var(--space-4);
  }
  
  /* Thread Progress Display */
  .thread-progress {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-4);
    
    .progress-item {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-xl);
      padding: var(--space-3) var(--space-4);
      backdrop-filter: blur(5px);
      transition: var(--transition-all);
      
      &.completed {
        background: rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
      }
      
      .progress-value {
        font-size: var(--text-xl);
        font-weight: var(--font-bold);
      }
      
      .progress-label {
        font-size: var(--text-sm);
        opacity: 0.9;
      }
    }
  }
}
```

### 3.7 Navigation Components

#### Thread Navigation
```css
.thread-nav {
  /* Container */
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-4) 0;
  
  .thread-node {
    /* Base Node */
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    background: var(--surface-raised);
    border: 2px solid var(--border-color);
    position: relative;
    cursor: pointer;
    transition: var(--transition-all);
    
    /* Connector Line */
    &::after {
      content: '';
      position: absolute;
      left: 12px;
      top: 50%;
      width: var(--space-6);
      height: 1px;
      background: var(--border-color);
      transform: translateY(-50%);
    }
    
    &:last-child::after {
      display: none;
    }
    
    /* States */
    &.active {
      background: var(--thread-primary);
      border-color: var(--thread-primary);
      transform: scale(1.2);
      box-shadow: 0 0 0 4px rgba(79, 209, 197, 0.2);
    }
    
    &.completed {
      background: var(--thread-accent);
      border-color: var(--thread-accent);
      
      &::after {
        background: var(--thread-accent);
      }
    }
    
    /* Dark Mode */
    [data-theme="dark"] & {
      background: var(--surface-raised);
      border-color: var(--border-color);
      box-shadow: var(--glow-inner);
      
      &.active {
        box-shadow: 0 0 0 4px rgba(79, 209, 197, 0.3),
                    var(--glow-inner-strong);
      }
    }
  }
}
```

#### Header Navigation
```css
.nav-header {
  /* Container */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: var(--surface-base);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  
  [data-theme="dark"] & {
    background: var(--surface-base);
    box-shadow: var(--shadow-sm), var(--glow-inner);
  }
  
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
    color: var(--text-primary);
    
    .logo-mark {
      width: 32px;
      height: 32px;
      color: var(--thread-primary);
    }
  }
  
  /* Navigation Items */
  .nav-items {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    
    .nav-link {
      font-size: var(--text-base);
      color: var(--text-secondary);
      transition: var(--transition-colors);
      position: relative;
      
      &:hover {
        color: var(--thread-primary);
      }
      
      &.active {
        color: var(--thread-primary);
        
        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--thread-primary);
          border-radius: var(--radius-full);
        }
      }
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
      background: var(--color-warning);
      background-opacity: 0.1;
      color: var(--color-warning);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      
      .streak-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}
```

### 3.8 Exercise Components

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
    background: var(--surface-overlay);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-6);
    
    [data-theme="dark"] & {
      background: var(--surface-raised);
      box-shadow: var(--shadow-sm), var(--glow-inner);
    }
    
    .exercise-type {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      
      .type-badge {
        padding: var(--space-1) var(--space-3);
        background: var(--thread-primary);
        background-opacity: 0.1;
        color: var(--thread-primary);
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
      color: var(--text-muted);
      font-size: var(--text-sm);
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  
  /* Exercise Prompt */
  .exercise-prompt {
    padding: var(--space-6);
    background: var(--surface-base);
    border: 2px solid var(--thread-primary);
    border-opacity: 0.3;
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-8);
    
    [data-theme="dark"] & {
      background: var(--surface-raised);
      box-shadow: var(--shadow-md), var(--glow-inner);
    }
    
    .prompt-context {
      padding: var(--space-4);
      background: var(--thread-primary);
      background-opacity: 0.05;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
      
      .context-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        font-size: var(--text-sm);
        color: var(--thread-primary);
        font-weight: var(--font-medium);
      }
    }
    
    .prompt-text {
      font-size: var(--text-lg);
      line-height: var(--leading-relaxed);
      color: var(--text-primary);
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
      background-opacity: 0.05;
      border: 1px solid var(--color-info);
      border-opacity: 0.2;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
      
      .info-icon {
        width: 20px;
        height: 20px;
        color: var(--color-info);
        flex-shrink: 0;
      }
      
      p {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
      }
    }
    
    .response-textarea {
      width: 100%;
      min-height: 300px;
      padding: var(--space-4);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      line-height: var(--leading-relaxed);
      color: var(--text-primary);
      background: var(--surface-base);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      resize: vertical;
      transition: var(--transition-all);
      
      &:focus {
        outline: none;
        border-color: var(--thread-primary);
        box-shadow: var(--focus-ring);
      }
      
      [data-theme="dark"] & {
        background: var(--surface-base);
        box-shadow: var(--glow-inner);
        
        &:focus {
          box-shadow: var(--focus-ring), var(--glow-inner-strong);
        }
      }
    }
    
    .response-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-4);
      
      .character-count {
        font-size: var(--text-sm);
        color: var(--text-muted);
        
        &.warning { color: var(--color-warning); }
        &.error { color: var(--color-error); }
      }
    }
  }
}
```

## 4. Animation Patterns

```css
/* Thread Unravel Animation */
@keyframes thread-unravel {
  0% {
    clip-path: circle(0% at left center);
  }
  100% {
    clip-path: circle(150% at left center);
  }
}

/* Gentle Float */
@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Glow Pulse */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: var(--shadow-sm), var(--glow-inner);
  }
  50% {
    box-shadow: var(--shadow-md), var(--glow-inner-strong);
  }
}

/* Loading Thread */
@keyframes loading-thread {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 0;
  }
}

/* Thread Connect */
@keyframes thread-connect {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

/* Points Float */
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

/* Wave Expand */
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

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## 5. Spool-Specific Components

### 5.1 Text Interview Interface

```css
.text-interview {
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
    background: var(--surface-base);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    
    [data-theme="dark"] & {
      background: var(--surface-raised);
      box-shadow: var(--shadow-md), var(--glow-inner);
    }
    
    .chat-header {
      padding: var(--space-4) var(--space-6);
      background: var(--surface-overlay);
      border-bottom: 1px solid var(--border-color);
      
      .chat-title {
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
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
          color: var(--text-muted);
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
      background: var(--surface-overlay);
      border-top: 1px solid var(--border-color);
      
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
    background: var(--surface-overlay);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    
    [data-theme="dark"] & {
      background: var(--surface-raised);
      box-shadow: var(--shadow-md), var(--glow-inner);
    }
    
    .voice-visualizer {
      width: 200px;
      height: 200px;
      margin-bottom: var(--space-8);
      position: relative;
      
      /* Voice Wave Animation */
      .wave-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid var(--thread-primary);
        border-radius: var(--radius-full);
        opacity: 0;
        
        &.active {
          animation: wave-expand 2s ease-out infinite;
        }
        
        &:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        &:nth-child(3) {
          animation-delay: 1s;
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
        background: var(--surface-base);
        border: 2px solid var(--border-color);
        cursor: pointer;
        transition: var(--transition-all);
        
        &:hover {
          border-color: var(--thread-primary);
          transform: scale(1.05);
        }
        
        &.primary {
          background: var(--thread-primary);
          border-color: var(--thread-primary);
          color: var(--surface-ground);
          
          &:hover {
            background: var(--thread-accent);
            border-color: var(--thread-accent);
          }
        }
        
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
```

### 5.2 Life Category Components

```css
.life-category {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  
  .category-icon {
    width: 20px;
    height: 20px;
  }
  
  .category-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }
  
  /* Category Variants */
  &.category-personal {
    .category-icon { color: var(--color-personal); }
    .category-label { color: var(--color-personal); }
  }
  
  &.category-social {
    .category-icon { color: var(--color-social); }
    .category-label { color: var(--color-social); }
  }
  
  &.category-career {
    .category-icon { color: var(--color-career); }
    .category-label { color: var(--color-career); }
  }
  
  &.category-philanthropic {
    .category-icon { color: var(--color-philanthropic); }
    .category-label { color: var(--color-philanthropic); }
  }
}

/* Life Category Card */
.life-card {
  padding: var(--space-4);
  background: var(--surface-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: var(--transition-all);
  
  /* Category Accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  &.card-personal::before { 
    background: var(--color-personal);
  }
  
  &.card-social::before { 
    background: var(--color-social);
  }
  
  &.card-career::before { 
    background: var(--color-career);
  }
  
  &.card-philanthropic::before { 
    background: var(--color-philanthropic);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  [data-theme="dark"] & {
    background: var(--surface-raised);
    box-shadow: var(--shadow-sm), var(--glow-inner);
    
    &::before {
      filter: blur(4px);
    }
  }
}
```

### 5.3 Concept Display Components

```css
.concept-display {
  max-width: 1024px;
  margin: 0 auto;
  
  /* Hook Section */
  .hooks-section {
    margin-bottom: var(--space-12);
    
    .hooks-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
      
      .hooks-icon {
        width: 24px;
        height: 24px;
        color: var(--thread-primary);
      }
      
      h2 {
        font-size: var(--text-2xl);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
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
  
  /* Examples Section */
  .examples-section {
    margin-bottom: var(--space-12);
    
    .examples-carousel {
      position: relative;
      
      .example-card {
        background: var(--surface-overlay);
        border-radius: var(--radius-xl);
        padding: var(--space-6);
        margin-bottom: var(--space-4);
        
        [data-theme="dark"] & {
          background: var(--surface-raised);
          box-shadow: var(--shadow-sm), var(--glow-inner);
        }
        
        .example-interest-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          background: var(--thread-primary);
          background-opacity: 0.1;
          color: var(--thread-primary);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          margin-bottom: var(--space-3);
        }
        
        .example-text {
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          color: var(--text-primary);
        }
        
        .example-visual {
          margin-top: var(--space-4);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
      }
    }
  }
  
  /* Core Content Section */
  .core-content-section {
    .content-tabs {
      display: flex;
      gap: var(--space-1);
      padding: var(--space-1);
      background: var(--surface-overlay);
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-6);
      
      .tab-button {
        flex: 1;
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: none;
        border-radius: var(--radius-lg);
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
        color: var(--text-muted);
        cursor: pointer;
        transition: var(--transition-all);
        
        &:hover { 
          color: var(--text-primary);
        }
        
        &.active {
          background: var(--surface-base);
          color: var(--thread-primary);
          box-shadow: var(--shadow-sm);
        }
      }
    }
    
    .tab-content {
      padding: var(--space-6);
      background: var(--surface-base);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      
      [data-theme="dark"] & {
        background: var(--surface-raised);
        box-shadow: var(--shadow-sm), var(--glow-inner);
      }
      
      /* Vocabulary Grid */
      .vocab-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-4);
        
        .vocab-card {
          padding: var(--space-4);
          background: var(--surface-overlay);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition-all);
          
          &:hover {
            background: var(--thread-primary);
            background-opacity: 0.05;
            transform: translateY(-2px);
          }
          
          .vocab-term {
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            margin-bottom: var(--space-1);
          }
          
          .vocab-definition {
            font-size: var(--text-sm);
            color: var(--text-secondary);
          }
        }
      }
    }
  }
}
```

### 5.4 Gamification Components

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
    background: var(--thread-primary);
    opacity: 0.1;
    
    &.rare { 
      background: var(--color-info);
      opacity: 0.15;
    }
    
    &.epic { 
      background: var(--color-personal);
      opacity: 0.15;
    }
    
    &.legendary { 
      background: var(--color-warning);
      opacity: 0.15;
    }
  }
  
  .badge-icon {
    position: relative;
    width: 32px;
    height: 32px;
    color: var(--thread-primary);
    
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
  background-opacity: 0.05;
  border: 1px solid var(--color-warning);
  border-opacity: 0.2;
  border-radius: var(--radius-xl);
  
  .streak-icon {
    width: 32px;
    height: 32px;
    color: var(--color-warning);
  }
  
  .streak-info {
    .streak-number {
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      line-height: 1;
    }
    
    .streak-label {
      font-size: var(--text-sm);
      color: var(--text-muted);
    }
  }
}

/* Points Popup */
.points-popup {
  position: fixed;
  padding: var(--space-2) var(--space-4);
  background: var(--thread-primary);
  color: var(--surface-ground);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  box-shadow: var(--shadow-lg);
  animation: points-float 2s ease-out forwards;
  pointer-events: none;
}
```

## 6. Utility Classes

### 6.1 Spacing Utilities

```css
/* Margin */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

/* Margin Top */
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mt-8 { margin-top: var(--space-8); }

/* Margin Bottom */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }

/* Padding */
.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

/* Gap */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }
```

### 6.2 Typography Utilities

```css
/* Text Size */
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }

/* Font Weight */
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

/* Text Color */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }

/* Text Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

### 6.3 Layout Utilities

```css
/* Display */
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Flex Utilities */
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.flex-1 { flex: 1; }
.flex-grow { flex-grow: 1; }
.flex-shrink-0 { flex-shrink: 0; }

/* Grid Utilities */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Position */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }

/* Z-Index */
.z-0 { z-index: 0; }
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }
```

## 7. Responsive Design

### 7.1 Container System

```css
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
```

### 7.2 Responsive Utilities

```css
/* Hide/Show by Breakpoint */
@media (max-width: 639px) {
  .sm\:hidden { display: none; }
}

@media (min-width: 640px) {
  .sm\:block { display: block; }
  .sm\:flex { display: flex; }
  .sm\:grid { display: grid; }
  .sm\:hidden { display: none; }
}

@media (min-width: 768px) {
  .md\:block { display: block; }
  .md\:flex { display: flex; }
  .md\:grid { display: grid; }
  .md\:hidden { display: none; }
  
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .lg\:block { display: block; }
  .lg\:flex { display: flex; }
  .lg\:grid { display: grid; }
  .lg\:hidden { display: none; }
  
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

### 7.3 Mobile-Specific Adjustments

```css
/* Touch-Friendly Targets */
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
  
  .thread-card {
    padding: var(--space-4);
  }
  
  .text-interview {
    grid-template-columns: 1fr;
    
    .visual-panel {
      order: -1;
      min-height: 300px;
    }
  }
  
  .examples-carousel {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    
    .example-card {
      scroll-snap-align: start;
    }
  }
}
```

## 8. Accessibility Standards

### 8.1 Focus Management

```css
/* Focus Visible */
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--thread-primary);
  color: var(--surface-ground);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  border-radius: var(--radius-lg);
  z-index: 100;
  
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

### 8.2 ARIA Patterns

```html
<!-- Progress Bar -->
<div role="progressbar" 
     aria-valuenow="75" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Concept mastery progress">
  <div class="progress-fill" style="width: 75%"></div>
</div>

<!-- Text Interview Status -->
<div class="chat-status" role="status" aria-live="polite">
  <span class="status-dot recording" aria-hidden="true"></span>
  <span class="status-text">Recording your response...</span>
</div>

<!-- Thread Navigation -->
<nav aria-label="Learning path progress">
  <ol class="thread-nav">
    <li class="thread-node completed" aria-label="Introduction - Completed"></li>
    <li class="thread-node active" aria-current="step" aria-label="Core Concepts - Current"></li>
    <li class="thread-node" aria-label="Advanced Topics - Not started"></li>
  </ol>
</nav>

<!-- Icon Button -->
<button class="btn-icon" aria-label="Start text interview">
  <svg aria-hidden="true"><!-- Mic icon --></svg>
</button>
```

### 8.3 Color Contrast Requirements

All text colors meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18px+): 3:1 contrast ratio minimum
- Interactive elements: 3:1 contrast ratio minimum

## 9. Iconography Guidelines

**Icon Library**: Lucide React (Consistent 24x24 stroke-based design)

### 9.1 Icon Sizes

```css
:root {
  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-base: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
}
```

### 9.2 Icon Categories

**Navigation**
- Home, ChevronLeft, ChevronRight, Menu, X, ArrowLeft, ArrowRight

**Actions**
- Play, Pause, Check, Plus, Minus, Edit3, Trash2, Save, Share2, Download

**Communication**
- MessageCircle, Mic, Volume2, Video, Phone, Send

**Learning**
- BookOpen, GraduationCap, Lightbulb, Puzzle, Trophy, Award, Target

**Progress**
- BarChart3, Flame (streak), Star (achievement), Flag (milestone), TrendingUp

**Content**
- FileText, Folder, Image, Link, Search, Filter, Eye, EyeOff

**Life Categories**
- User (Personal), Users (Social), Briefcase (Career), Heart (Philanthropic)

**Status**
- CheckCircle2, XCircle, AlertTriangle, Info, AlertCircle, Clock

**Formatting (Rich Text Editor)**
- Bold, Italic, Underline, Link2, List, ListOrdered, Quote, Code

## 10. Implementation Guidelines

### 10.1 Development Phases

**Phase 1 - Core Foundation**
- Design tokens (colors, typography, spacing)
- Base components (Button, Input, Card)
- Dark mode support

**Phase 2 - Thread Components**
- ThreadCard, ThreadNavigation
- Rich Text Editor
- Progress components

**Phase 3 - Learning Interface**
- Text Interview interface
- Exercise components
- Concept display

**Phase 4 - Enhancement**
- Animations and transitions
- Gamification elements
- Advanced interactions

### 10.2 Performance Guidelines

- Use CSS custom properties for theming
- Implement lazy loading for images
- Optimize animations with `will-change`
- Minimize JavaScript for style changes
- Use CSS Grid and Flexbox for layouts
- Enable hardware acceleration for transforms

### 10.3 Testing Checklist

- [ ] All interactive states (hover, focus, active, disabled)
- [ ] Touch targets minimum 44px on mobile
- [ ] Color contrast WCAG AA compliance
- [ ] Keyboard navigation flows
- [ ] Screen reader announcements
- [ ] Responsive layouts at all breakpoints
- [ ] Dark mode visual consistency
- [ ] Animation performance
- [ ] Loading states
- [ ] Error states

## 11. Migration Guide

### From Design System 1.0 to 2.0

1. **Update CSS Variables**: Replace old color variables with new token system
2. **Component Classes**: Update component classes to use new naming
3. **Dark Mode**: Implement `[data-theme="dark"]` attribute system
4. **Shadows**: Replace single shadows with layered shadow system
5. **Animations**: Add new thread-based animations
6. **Icons**: Ensure all icons use Lucide React library

This design system provides a complete foundation for building Spool's modern, approachable interface with the thread metaphor at its core. The tactile aesthetic and thoughtful dark mode create an engaging learning environment that feels both minimal and rich.