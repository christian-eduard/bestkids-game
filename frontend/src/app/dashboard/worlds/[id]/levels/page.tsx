"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorldsService, World, Level } from '@/services/worlds.service';
import { GamificationService, GamificationProfile } from '@/services/gamification.service';

export default function LevelsPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const worldId = Number(params.worldId);

    const [world, setWorld] = useState<World | null>(null);
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [totalStars, setTotalStars] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!worldId) return;
            try {
                // In a real app we might need a specific endpoint to get single world details + levels
                // For now, getting all worlds to find current one, and getting levels
                const [worldsData, levelsData, profileData] = await Promise.all([
                    WorldsService.getWorlds(),
                    WorldsService.getLevels(worldId),
                    GamificationService.getProfile()
                ]);

                const currentWorld = worldsData.find(w => w.id === worldId);
                setWorld(currentWorld || null);

                // Map backend level data to UI needs if necessary. 
                // Assuming getLevels returns levels with 'isLocked', 'isCompleted', 'stars' populated from backend
                setLevels(levelsData);
                setProfile(profileData);

                // Calculate total stars for this world
                const stars = levelsData.reduce((acc, level) => acc + (level.stars || 0), 0);
                setTotalStars(stars);

            } catch (error) {
                console.error("Failed to load levels data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [worldId]);

    const handleLevelClick = (level: Level) => {
        if (level.isLocked) return;
        router.push(`/dashboard/exercises/${level.id}`); // Or whatever the exercise route is
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando niveles...</div>;
    }

    if (!world) {
        return <div className="flex items-center justify-center min-h-screen">Mundo no encontrado</div>;
    }

    const completedLevelsCount = levels.filter(l => l.isCompleted).length;
    const progressPercentage = levels.length > 0 ? (completedLevelsCount / levels.length) * 100 : 0;

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#fcf8fc] dark:bg-background-dark">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark shadow-sm z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-1">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <span className="font-bold text-lg">{world.name}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
                    <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
                        {/* HeaderImage */}
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-soft group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                            <div
                                className="bg-cover bg-center h-[240px] md:h-[300px] transform group-hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: `url("${world.backgroundImage || 'https://placehold.co/1200x400/png?text=World'}")` }}
                            >
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 mb-3">
                                        <span className="material-symbols-outlined text-white text-sm">public</span>
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Mundo {world.id}</span>
                                    </div>
                                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">{world.name}</h2>
                                    <p className="text-white/90 text-sm md:text-base font-medium mt-2 max-w-lg drop-shadow-md">{world.description}</p>
                                </div>
                                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/40 transition-all active:scale-95 flex items-center gap-2 shrink-0">
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Continuar Aventura
                                </button>
                            </div>
                        </div>

                        {/* Stats & Progress Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* ProgressBar */}
                            <div className="md:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-primary/5">
                                <div className="flex flex-col gap-3 h-full justify-center">
                                    <div className="flex gap-6 justify-between items-end">
                                        <div>
                                            <p className="text-text-main dark:text-white text-lg font-bold">Progreso del Mundo</p>
                                            <p className="text-text-muted dark:text-gray-400 text-sm">
                                                {progressPercentage >= 50 ? '¡Vas muy bien!' : '¡Tú puedes!'}
                                            </p>
                                        </div>
                                        <p className="text-primary text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                                    </div>
                                    <div className="w-full h-4 bg-primary/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <p className="text-secondary dark:text-primary-light text-xs font-bold uppercase tracking-wide text-right">{completedLevelsCount} de {levels.length} niveles completados</p>
                                </div>
                            </div>
                            {/* ProfileStats */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-primary/5 flex items-center justify-between gap-4">
                                <div className="flex flex-col items-center justify-center flex-1 text-center">
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mb-2">
                                        <span className="material-symbols-outlined text-yellow-500 text-3xl">star</span>
                                    </div>
                                    <p className="text-2xl font-black text-text-main dark:text-white">{totalStars}<span className="text-gray-400 text-lg font-normal">/{levels.length * 3}</span></p>
                                    <p className="text-text-muted dark:text-gray-400 text-xs font-bold uppercase">Estrellas</p>
                                </div>
                                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex flex-col items-center justify-center flex-1 text-center">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                                        <span className="material-symbols-outlined text-blue-500 text-3xl">bolt</span>
                                    </div>
                                    <p className="text-2xl font-black text-text-main dark:text-white">{profile?.currentLevel}</p>
                                    <p className="text-text-muted dark:text-gray-400 text-xs font-bold uppercase">Nivel Actual</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline / Level Map */}
                        <div className="flex flex-col pt-4 pb-12">
                            <h3 className="text-xl font-bold mb-6 px-2 text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">alt_route</span>
                                Tu Camino
                            </h3>
                            <div className="relative px-4">
                                {/* Vertical Line Background */}
                                <div className="absolute left-[38px] top-4 bottom-4 w-1.5 bg-gray-200 dark:bg-gray-700 rounded-full -z-10"></div>
                                {/* Active Line Overlay (Dynamic height) - approximate */}
                                <div className="absolute left-[38px] top-4 w-1.5 bg-gradient-to-b from-primary via-purple-500 to-primary rounded-full -z-10 shadow-glow" style={{ height: `${Math.max(5, progressPercentage)}%` }}></div>

                                <div className="flex flex-col gap-8">
                                    {levels.map((level, index) => {
                                        // Determine state: completed, active (next available), or locked
                                        // Simple logic: if not locked and not completed -> active? 
                                        // Backend might give 'isLocked'. 
                                        // Frontend logic: First unlocked but not completed is 'active'.
                                        const isCompleted = level.isCompleted;
                                        const isLocked = level.isLocked;
                                        const isActive = !isLocked && !isCompleted && (index === 0 || levels[index - 1].isCompleted); // simplistic assumption

                                        return (
                                            <div key={level.id} onClick={() => handleLevelClick(level)} className={`group flex gap-6 items-center ${isLocked ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}>
                                                <div className="relative flex-shrink-0 z-10">
                                                    {isCompleted ? (
                                                        <div className="size-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-background-dark">
                                                            <span className="material-symbols-outlined text-2xl">check</span>
                                                        </div>
                                                    ) : isActive ? (
                                                        <>
                                                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                                                            <div className="relative size-16 -ml-1 rounded-full bg-white dark:bg-surface-dark border-[5px] border-primary flex items-center justify-center text-primary shadow-xl shadow-primary/30">
                                                                <span className="material-symbols-outlined filled text-3xl">play_arrow</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="size-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-white dark:border-background-dark">
                                                            <span className="material-symbols-outlined text-2xl">lock</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`level-card flex-1 p-4 rounded-2xl shadow-sm flex justify-between items-center transition-transform hover:-translate-y-1 ${isActive ? 'bg-gradient-to-r from-primary/10 to-transparent border-2 border-primary transform scale-[1.02]' : 'bg-surface-light dark:bg-surface-dark border border-primary/20'}`}>
                                                    <div>
                                                        {isActive && <div className="inline-block bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">JUGAR AHORA</div>}
                                                        <div className={`text-xs font-bold mb-0.5 uppercase tracking-wide ${isActive ? 'text-primary' : 'text-gray-400'}`}>Nivel {index + 1}</div>
                                                        <h4 className={`text-lg font-bold ${isActive || isCompleted ? 'text-text-main dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{level.title}</h4>
                                                    </div>

                                                    {isLocked ? (
                                                        <div className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-400">Bloqueado</div>
                                                    ) : isActive ? (
                                                        <div className="flex items-center justify-center size-10 rounded-full bg-primary text-white shadow-md hover:bg-primary-dark transition-colors">
                                                            <span className="material-symbols-outlined">arrow_forward</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-1 text-yellow-400">
                                                            {[1, 2, 3].map(star => (
                                                                <span key={star} className={`material-symbols-outlined text-[20px] ${star <= (level.stars || 0) ? 'filled' : 'text-gray-300 dark:text-gray-600'}`}>star</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
