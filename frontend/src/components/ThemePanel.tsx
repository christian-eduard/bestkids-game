"use client";

import { useState } from 'react';
import { useTheme, COLOR_THEMES } from '@/contexts/ThemeContext';

export function ThemePanel() {
    const { colorTheme, setColorTheme, themeMode, toggleThemeMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const colorOptions = Object.entries(COLOR_THEMES) as [keyof typeof COLOR_THEMES, typeof COLOR_THEMES[keyof typeof COLOR_THEMES]][];

    return (
        <>
            {/* Floating trigger button - partially hidden on the right */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 
                    w-10 h-14 rounded-l-xl shadow-lg
                    flex items-center justify-center
                    transition-all duration-300 hover:w-12
                    ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                `}
                style={{ backgroundColor: 'var(--color-primary, #f425f4)' }}
                aria-label="Abrir configuración de tema"
            >
                <span className="material-symbols-outlined text-white text-xl">palette</span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Side Panel */}
            <div className={`fixed right-0 top-0 h-full w-72 z-50 
                bg-white dark:bg-gray-900 shadow-2xl
                transform transition-transform duration-300 ease-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
                <div
                    className="p-4 flex items-center justify-between"
                    style={{ backgroundColor: 'var(--color-primary, #f425f4)' }}
                >
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined">palette</span>
                        Personalizar
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Dark/Light Mode Toggle */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">
                                {themeMode === 'dark' ? 'dark_mode' : 'light_mode'}
                            </span>
                            Modo
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => themeMode === 'dark' && toggleThemeMode()}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2
                                    ${themeMode === 'light'
                                        ? 'bg-gray-900 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined text-lg">light_mode</span>
                                Claro
                            </button>
                            <button
                                onClick={() => themeMode === 'light' && toggleThemeMode()}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2
                                    ${themeMode === 'dark'
                                        ? 'bg-gray-900 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined text-lg">dark_mode</span>
                                Oscuro
                            </button>
                        </div>
                    </div>

                    {/* Color Theme Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">format_paint</span>
                            Color Principal
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {colorOptions.map(([key, theme]) => (
                                <button
                                    key={key}
                                    onClick={() => setColorTheme(key)}
                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                                        ${colorTheme === key
                                            ? 'border-gray-900 dark:border-white scale-105 shadow-lg'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full shadow-md"
                                        style={{ backgroundColor: theme.primary }}
                                    />
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {theme.name}
                                    </span>
                                    {colorTheme === key && (
                                        <span
                                            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                                            style={{ backgroundColor: theme.primary }}
                                        >
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">preview</span>
                            Vista Previa
                        </h3>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: 'var(--color-primary, #f425f4)' }}
                                >
                                    A
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">Estudiante</p>
                                    <p className="text-xs" style={{ color: 'var(--color-text-muted, #9c499c)' }}>Nivel 5 • 1,250 pts</p>
                                </div>
                            </div>
                            <button
                                className="w-full py-2 rounded-lg text-white text-sm font-bold transition-transform hover:scale-[1.02]"
                                style={{ backgroundColor: 'var(--color-primary, #f425f4)' }}
                            >
                                Botón Ejemplo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
