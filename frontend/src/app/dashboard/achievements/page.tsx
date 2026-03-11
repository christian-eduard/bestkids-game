"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { GamificationService, GamificationProfile } from '@/services/gamification.service';
import { getLevelInfo, getPointsToNextLevel, getLevelFromPoints } from '@/lib/levels';

export default function AchievementsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, achievementsData] = await Promise.all([
                    GamificationService.getProfile(),
                    GamificationService.getAchievements()
                ]);
                setProfile(profileData);
                setAchievements(achievementsData);
            } catch (error) {
                console.error("Failed to fetch achievements data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived stats
    const userPoints = profile?.totalPoints || 0;
    const currentLevel = profile?.currentLevel || 1;
    const pointsNext = getPointsToNextLevel(userPoints, currentLevel);

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const upcomingAchievements = achievements.filter(a => !a.isUnlocked);
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);

    return (
        <div className="flex flex-1 justify-center py-8 px-4 md:px-10 lg:px-40">
            <div className="flex flex-col max-w-[1200px] flex-1 gap-8">
                {/* Hero / Stats Section */}
                <div className="@container">
                    <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-r from-violet-600 to-primary rounded-xl p-8 shadow-glow text-white relative overflow-hidden">
                        {/* Decorator Circles */}
                        <div className="absolute -top-20 -right-20 size-60 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-20 size-40 rounded-full bg-black/10 blur-2xl"></div>

                        <div className="flex flex-col justify-center gap-2 z-10 flex-1">
                            <p className="text-xs text-white/90 font-bold uppercase tracking-wider mb-1">Nivel Actual</p>
                            <p className="text-4xl font-black text-white">{currentLevel}</p>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Sala de Trofeos</h1>
                            <p className="text-white/90 text-lg font-medium max-w-lg">
                                ¡Has desbloqueado <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">{unlockedCount}</span> insignias legendarias! ¡Estás en racha! 🔥
                            </p>
                        </div>

                        {/* Level Progress Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 w-full md:w-80 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm uppercase tracking-wider opacity-80">Siguiente Nivel</span>
                                <span className="font-bold text-xl">Nivel {currentLevel + 1}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-medium opacity-90">
                                    <span>{userPoints} XP</span>
                                    <span>{userPoints + pointsNext} XP</span>
                                </div>
                                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${(Math.max(0, 1000 - pointsNext) / 1000) * 100}%` }}></div>
                                </div>
                                <p className="text-xs mt-1 text-center font-medium bg-black/20 py-1 rounded-lg">¡Faltan {pointsNext} XP para subir!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Section */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-bold px-1 flex items-center gap-2 text-text-main dark:text-white">
                        <span className="material-symbols-outlined text-yellow-500 fill-current">star</span>
                        Insignias Desbloqueadas
                    </h3>

                    {unlockedAchievements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {unlockedAchievements.map(achievement => (
                                <div key={achievement.id} className="group relative bg-white dark:bg-card-dark rounded-xl p-5 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 border border-transparent hover:border-primary/20">
                                    <div className="absolute top-4 right-4 text-green-500 bg-green-50 dark:bg-green-900/30 p-1 rounded-full">
                                        <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                                    </div>
                                    <div className="size-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform">
                                        <span className="material-symbols-outlined text-white text-4xl">{achievement.icon || 'emoji_events'}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1 text-text-main dark:text-white">{achievement.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-normal">{achievement.description}</p>
                                    </div>
                                    <div className="mt-auto pt-2 text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                                        ¡Completado!
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">Aún no has desbloqueado logros. ¡Sigue jugando!</div>
                    )}
                </div>

                {/* Locked & In Progress Section */}
                <div className="flex flex-col gap-6 mt-4">
                    <h3 className="text-2xl font-bold px-1 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined">lock</span>
                        Próximos Desafíos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {upcomingAchievements.map(achievement => (
                            <div key={achievement.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-dashed border-gray-300 dark:border-gray-700 flex flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex justify-between items-start">
                                    <div className="size-16 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
                                        <span className="material-symbols-outlined text-gray-400 text-4xl">{achievement.icon || 'lock'}</span>
                                        <div className="absolute -bottom-2 -right-2 bg-gray-500 text-white p-1 rounded-full border-2 border-white dark:border-card-dark">
                                            <span className="material-symbols-outlined text-[16px]">lock</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1 text-gray-700 dark:text-gray-300">{achievement.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                                </div>
                                <div className="mt-auto pt-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    Bloqueado
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
