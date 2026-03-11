"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available color themes
export const COLOR_THEMES = {
    pink: {
        name: 'Rosa',
        primary: '#f425f4',
        primaryDark: '#c91dc9',
        primaryLight: '#fceafc',
        backgroundLight: '#f8f5f8',
        backgroundDark: '#221022',
        cardDark: '#2d1b2d',
        textMuted: '#9c499c',
    },
    blue: {
        name: 'Azul',
        primary: '#3b82f6',
        primaryDark: '#2563eb',
        primaryLight: '#dbeafe',
        backgroundLight: '#f0f9ff',
        backgroundDark: '#0c1929',
        cardDark: '#1e293b',
        textMuted: '#64748b',
    },
    green: {
        name: 'Verde',
        primary: '#22c55e',
        primaryDark: '#16a34a',
        primaryLight: '#dcfce7',
        backgroundLight: '#f0fdf4',
        backgroundDark: '#0d1f12',
        cardDark: '#1a2e1f',
        textMuted: '#4ade80',
    },
    orange: {
        name: 'Naranja',
        primary: '#f97316',
        primaryDark: '#ea580c',
        primaryLight: '#ffedd5',
        backgroundLight: '#fff7ed',
        backgroundDark: '#1c1006',
        cardDark: '#2d1f14',
        textMuted: '#fb923c',
    },
};

type ColorThemeKey = keyof typeof COLOR_THEMES;
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    colorTheme: ColorThemeKey;
    setColorTheme: (theme: ColorThemeKey) => void;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [colorTheme, setColorThemeState] = useState<ColorThemeKey>('pink');
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
    const [mounted, setMounted] = useState(false);

    // Load saved preferences on mount
    useEffect(() => {
        const savedColor = localStorage.getItem('bestkids-color-theme') as ColorThemeKey;
        const savedMode = localStorage.getItem('bestkids-theme-mode') as ThemeMode;

        if (savedColor && COLOR_THEMES[savedColor]) {
            setColorThemeState(savedColor);
        }
        if (savedMode === 'dark' || savedMode === 'light') {
            setThemeModeState(savedMode);
        }
        setMounted(true);
    }, []);

    // Apply theme changes
    useEffect(() => {
        if (!mounted) return;

        const theme = COLOR_THEMES[colorTheme];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-primary-dark', theme.primaryDark);
        root.style.setProperty('--color-primary-light', theme.primaryLight);
        root.style.setProperty('--color-background-light', theme.backgroundLight);
        root.style.setProperty('--color-background-dark', theme.backgroundDark);
        root.style.setProperty('--color-card-dark', theme.cardDark);
        root.style.setProperty('--color-text-muted', theme.textMuted);

        // Apply dark/light mode
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('bestkids-color-theme', colorTheme);
        localStorage.setItem('bestkids-theme-mode', themeMode);
    }, [colorTheme, themeMode, mounted]);

    const setColorTheme = (theme: ColorThemeKey) => {
        setColorThemeState(theme);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
    };

    const toggleThemeMode = () => {
        setThemeModeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ colorTheme, setColorTheme, themeMode, setThemeMode, toggleThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
