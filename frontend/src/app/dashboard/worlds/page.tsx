"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WorldsService, World } from '@/services/worlds.service';

// Local type with progress always as number after transformation
type TransformedWorld = Omit<World, 'progress'> & { progress: number; isLocked: boolean };

export default function WorldsPage() {
    const router = useRouter();
    const [worlds, setWorlds] = useState<TransformedWorld[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorlds = async () => {
            try {
                const data = await WorldsService.getWorlds();
                // Transform backend response to match frontend needs
                const transformedData = data.map(world => ({
                    ...world,
                    // Backend returns isUnlocked, frontend uses isLocked
                    isLocked: !world.isUnlocked,
                    // Backend may return progress as empty object, convert to number
                    progress: typeof world.progress === 'number' ? world.progress : 0
                }));
                setWorlds(transformedData);
            } catch (error) {
                console.error("Failed to fetch worlds", error);
                // Set empty array on error to show empty state instead of crashing
                setWorlds([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWorlds();
    }, []);
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Navigation / Header (Adapted from Design) */}
            <nav className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f4e7f4] dark:border-[#3d1e3d] pb-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight">VISTA DE MUNDOS</h1>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md w-full">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-white dark:bg-card-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm shadow-sm transition-all" placeholder="Buscar aventuras..." type="text" />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-4 self-end md:self-auto">
                    {/* Level Badge */}
                    <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-card-dark pr-4 pl-1 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="size-8 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900">
                            <span className="material-symbols-outlined text-[20px]">star</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Nivel</span>
                            <span className="text-sm font-bold text-primary">12</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-primary shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-white max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold uppercase tracking-wider mb-4">
                            <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                            Nueva Misión Disponible
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">¡Hola, Explorador!</h2>
                        <p className="text-lg md:text-xl text-white/90 font-medium">¿Listo para continuar tu viaje de aprendizaje hoy?</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="size-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl animate-[bounce_3s_infinite]">
                            <span className="material-symbols-outlined text-6xl text-white drop-shadow-md">sports_esports</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">map</span>
                    Mis Mundos
                </h3>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
                    <button className="px-5 py-2 rounded-full bg-primary text-white font-semibold shadow-md shadow-primary/20 transition hover:bg-primary-hover whitespace-nowrap">
                        Todos
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:text-primary transition whitespace-nowrap">
                        Matemáticas
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:text-primary transition whitespace-nowrap">
                        Ciencias
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:text-primary transition whitespace-nowrap">
                        Idiomas
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:text-primary transition whitespace-nowrap">
                        Arte
                    </button>
                </div>
            </div>

            {/* Worlds Grid */}
            <div id="world-map" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {worlds.map((world, index) => (
                    world.isLocked ? (
                        /* Locked Card */
                        <div key={world.id} className="group relative bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 opacity-90">
                            <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-900/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 group-hover:bg-gray-200/40 dark:group-hover:bg-gray-900/60">
                                <div className="size-14 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center mb-3 shadow-inner">
                                    <span className="material-symbols-outlined text-3xl">lock</span>
                                </div>
                                <h5 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Mundo Bloqueado</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full">
                                    {world.pointsToUnlock ? `Necesitas ${world.pointsToUnlock} Puntos` : "Completa el anterior"}
                                </p>
                            </div>
                            <div className="h-40 w-full relative overflow-hidden bg-gray-300 grayscale">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${world.backgroundImage || world.icon || '/assets/world-placeholder.png'}")` }}></div>
                            </div>
                            <div className="p-5 grayscale opacity-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white leading-tight">{world.name}</h4>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{world.description}</p>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-gray-300 h-2.5 w-0"></div>
                                </div>
                                <button className="mt-5 w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
                                    Bloqueado
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Active Card */
                        <div key={world.id}
                            id={index === 0 ? "level-node" : undefined}
                            onClick={() => router.push(`/dashboard/worlds/${world.id}`)}
                            className="group relative bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20 cursor-pointer">
                            <div className="h-40 w-full relative overflow-hidden bg-blue-100 dark:bg-blue-900/30">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${world.backgroundImage || world.icon || '/assets/world-placeholder.png'}")` }}></div>
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">public</span> Mundo
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white leading-tight">{world.name}</h4>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{world.description}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        <span>Progreso</span>
                                        <span>{world.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(244,37,244,0.5)]" style={{ width: `${world.progress || 0}%` }}></div>
                                    </div>
                                </div>
                                <button className="mt-5 w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-2 group/btn">
                                    {world.progress && world.progress > 0 ? 'Continuar' : 'Jugar'}
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">play_arrow</span>
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Simple Footer */}
            <footer className="mt-auto w-full py-6 text-center text-sm text-gray-400 dark:text-gray-600 border-t border-[#f4e7f4] dark:border-[#3d1e3d]">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Modo Seguro Infantil Activado</span>
                </div>
                <p>© 2024 Plataforma Educativa Gamificada.</p>
            </footer>
        </div>
    );
}
