import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const AdminThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'admin-theme',
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  // Update effective theme based on theme setting and system preference
  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setEffectiveTheme(systemTheme);
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateEffectiveTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(effectiveTheme);
    
    // Update CSS custom properties for theme
    if (effectiveTheme === 'dark') {
      root.style.setProperty('--background', '222.2% 84% 4.9%');
      root.style.setProperty('--foreground', '210% 40% 98%');
      root.style.setProperty('--card', '222.2% 84% 4.9%');
      root.style.setProperty('--card-foreground', '210% 40% 98%');
      root.style.setProperty('--popover', '222.2% 84% 4.9%');
      root.style.setProperty('--popover-foreground', '210% 40% 98%');
      root.style.setProperty('--primary', '210% 40% 98%');
      root.style.setProperty('--primary-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--secondary', '217.2% 32.6% 17.5%');
      root.style.setProperty('--secondary-foreground', '210% 40% 98%');
      root.style.setProperty('--muted', '217.2% 32.6% 17.5%');
      root.style.setProperty('--muted-foreground', '215% 20.2% 65.1%');
      root.style.setProperty('--accent', '217.2% 32.6% 17.5%');
      root.style.setProperty('--accent-foreground', '210% 40% 98%');
      root.style.setProperty('--destructive', '0 62.8% 30.6%');
      root.style.setProperty('--destructive-foreground', '210% 40% 98%');
      root.style.setProperty('--border', '217.2% 32.6% 17.5%');
      root.style.setProperty('--input', '217.2% 32.6% 17.5%');
      root.style.setProperty('--ring', '212.7% 26.8% 83.9%');
    } else {
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--primary', '222.2% 47.4% 11.2%');
      root.style.setProperty('--primary-foreground', '210% 40% 98%');
      root.style.setProperty('--secondary', '210% 40% 96%');
      root.style.setProperty('--secondary-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--muted', '210% 40% 96%');
      root.style.setProperty('--muted-foreground', '215.4% 16.3% 46.9%');
      root.style.setProperty('--accent', '210% 40% 96%');
      root.style.setProperty('--accent-foreground', '222.2% 84% 4.9%');
      root.style.setProperty('--destructive', '0 84.2% 60.2%');
      root.style.setProperty('--destructive-foreground', '210% 40% 98%');
      root.style.setProperty('--border', '214.3% 31.8% 91.4%');
      root.style.setProperty('--input', '214.3% 31.8% 91.4%');
      root.style.setProperty('--ring', '222.2% 84% 4.9%');
    }
  }, [effectiveTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      handleSetTheme('dark');
    } else if (theme === 'dark') {
      handleSetTheme('system');
    } else {
      handleSetTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAdminTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};

// Hook to get theme-aware colors
export const useThemeColors = () => {
  const { effectiveTheme } = useAdminTheme();
  
  const colors = {
    light: {
      background: '#ffffff',
      foreground: '#0f0f0f',
      card: '#ffffff',
      cardForeground: '#0f0f0f',
      primary: '#171717',
      primaryForeground: '#fafafa',
      secondary: '#f5f5f5',
      secondaryForeground: '#171717',
      muted: '#f5f5f5',
      mutedForeground: '#737373',
      accent: '#f5f5f5',
      accentForeground: '#171717',
      border: '#e5e5e5',
      input: '#e5e5e5',
      ring: '#171717',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#fafafa',
      card: '#0a0a0a',
      cardForeground: '#fafafa',
      primary: '#fafafa',
      primaryForeground: '#0a0a0a',
      secondary: '#262626',
      secondaryForeground: '#fafafa',
      muted: '#262626',
      mutedForeground: '#a3a3a3',
      accent: '#262626',
      accentForeground: '#fafafa',
      border: '#262626',
      input: '#262626',
      ring: '#d4d4d8',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    },
  };
  
  return colors[effectiveTheme];
};

export default ThemeContext;