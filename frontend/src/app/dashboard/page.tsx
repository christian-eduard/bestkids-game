"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getLevelInfo, getPointsToNextLevel, calculateLevelProgress, getLevelFromPoints } from '@/lib/levels';
import { useEffect, useState } from 'react';
import { GamificationService, GamificationProfile } from '@/services/gamification.service';

import { AVATARS } from '@/lib/constants';

export default function StudentDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    // ...

    const userName = user?.fullName || user?.username || 'Estudiante';
    // Use API points
    const userPoints = profile?.totalPoints || 0;

    // Use backend level or calculate
    const currentLevel = profile?.currentLevel || 1;
    const levelInfo = getLevelInfo(currentLevel);
    const pointsToNext = getPointsToNextLevel(userPoints, currentLevel);
    const progress = calculateLevelProgress(userPoints, currentLevel);

    // Stats from profile
    const streak = profile?.currentStreakDays || 0;

    // Find selected avatar
    const selectedAvatar = profile?.selectedAvatarId ? AVATARS.find(a => a.id === profile.selectedAvatarId) : null;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-20">
            {/* Profile Header Section */}
            <section className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-2xl shadow-sm border border-transparent dark:border-[#3d253d]">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => router.push('/dashboard/avatar-selection')}>
                        {selectedAvatar ? (
                            <div className={`size-20 md:size-24 rounded-full bg-gradient-to-br ${selectedAvatar.color} flex items-center justify-center ring-4 ring-primary/20 group-hover:ring-primary transition-all duration-300 shadow-lg`}>
                                <span className="text-4xl md:text-5xl">{selectedAvatar.emoji}</span>
                            </div>
                        ) : (
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-20 md:size-24 ring-4 ring-primary/20 group-hover:ring-primary transition-all duration-300" data-alt="Default avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCM67HQOEd7nkYkWPhrSSMHxTMiE1qAPUtrH78i9u5bPfuyBrvcFvTMFcTfhPg3zQiAM9A_yssZ5yEsnSJWafkhDQjPNT5ocp6w9XdaYrDPO5L1Dp46xVdMPi5sAbyfLF9PY2OM4hKvVx1lJGw6WKOKBuKlZMJ-UVbq5jSyqQ0Hfi2zu1ZVGctiUBY48CspCIEPNBwzXRQCB9lzD8-Kt8GYMvnVc0QhJNxLdevk9t5xdMG6ZrXeiD98Qo9Yy72K19f-RcStjjhixnQ")' }}></div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-card-dark">
                            Nivel {currentLevel}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-[#1c0d1c] dark:text-white text-2xl md:text-3xl font-bold leading-tight">¡Hola, {userName}! 🚀</h2>
                        <p className="text-[#6b4c6b] dark:text-[#d1bdd1] text-base font-medium mt-1">{levelInfo.emoji} {levelInfo.name} • {levelInfo.description}</p>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="w-32 md:w-48 bg-[#f4e7f4] dark:bg-[#3d253d] rounded-full h-2.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full animate-pulse transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-primary">{pointsToNext} XP para Nivel {currentLevel + 1}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => router.push('/dashboard/profile')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                        Editar Perfil
                    </button>
                </div>
            </section>

            {/* Stats Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Streak Card */}
                <div className="flex items-center p-5 bg-card-light dark:bg-card-dark rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-[#3d253d] hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="size-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mr-4">
                        <span className="material-symbols-outlined text-[32px] filled-icon" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    </div>
                    <div>
                        <p className="text-[#6b4c6b] dark:text-[#d1bdd1] text-sm font-medium">Racha Diaria</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#1c0d1c] dark:text-white text-2xl font-bold">{streak} Días</p>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">+1</span>
                        </div>
                    </div>
                </div>
                {/* Points Card */}
                <div className="flex items-center p-5 bg-card-light dark:bg-card-dark rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-[#3d253d] hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-4">
                        <span className="material-symbols-outlined text-[32px] filled-icon" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                    </div>
                    <div>
                        <p className="text-[#6b4c6b] dark:text-[#d1bdd1] text-sm font-medium">XP Total</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#1c0d1c] dark:text-white text-2xl font-bold">{userPoints}</p>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">+150</span>
                        </div>
                    </div>
                </div>
                {/* Level Card */}
                <div className="flex items-center p-5 bg-card-light dark:bg-card-dark rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-[#3d253d] hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="size-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-primary mr-4">
                        <div className="text-2xl">{levelInfo.emoji}</div>
                    </div>
                    <div>
                        <p className="text-[#6b4c6b] dark:text-[#d1bdd1] text-sm font-medium">Rango Actual</p>
                        <p className="text-[#1c0d1c] dark:text-white text-2xl font-bold">{levelInfo.name}</p>
                    </div>
                </div>
            </section>

            {/* Main Adventure Card (Hero) */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-[#1c0d1c] dark:text-white text-2xl font-bold">Tu Aventura</h2>
                    <a className="text-primary text-sm font-bold hover:underline cursor-pointer" onClick={() => router.push('/dashboard/worlds')}>Ver mapa completo</a>
                </div>
                <div className="group relative overflow-hidden bg-card-light dark:bg-card-dark rounded-2xl md:rounded-[2rem] shadow-sm border border-transparent dark:border-[#3d253d]">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="w-full md:w-2/5 h-48 md:h-auto bg-[#f0f0f0] relative overflow-hidden">
                            <div className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105" data-alt="Magical cave illustration" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMSTxwSes7T8Y5nF4Tw2qLokqyQokQRBQ2n-H-mVp4Cc1Tg50qlHb_PLt6a1Av3H66CjGWryRdW9fEokA548jSkTFuJUPr2CHK-jilkRxYIn4cd91JWlphIBwAjo5NrBLs4f6yb1BEcwGllKUJkQGqZNdEcd5PJQwDfl-FmTIgkB2u0heWxz8maDiDLVEvZ24YOJnguArxRytFvVZKyoi-PdAe7MEpIMG9HVgoPr0YuHQ1BqjYmR2Xvl3SkSPp1D1wImeOWMcoAFQ")' }}></div>
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1c0d1c] dark:text-white border border-white/20">
                                EN PROGRESO
                            </div>
                        </div>
                        {/* Content Side */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm uppercase tracking-wide">
                                <span className="material-symbols-outlined text-lg">calculate</span>
                                <span>Matemáticas</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#1c0d1c] dark:text-white mb-2 leading-tight">La Cueva de los Números</h3>
                            <div className="flex flex-col gap-1 mb-6">
                                <p className="text-[#6b4c6b] dark:text-[#d1bdd1] font-medium">Capítulo 3 - Lección 2: Sumas Mágicas</p>
                                <p className="text-sm text-[#9c829c] dark:text-[#a08ca0]">Ayuda a los guardianes de la cueva a resolver los acertijos numéricos para abrir la puerta del tesoro.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mt-auto">
                                <div className="w-full sm:w-1/2">
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-[#6b4c6b] dark:text-[#d1bdd1]">Progreso del Capítulo</span>
                                        <span className="text-primary">45%</span>
                                    </div>
                                    <div className="w-full bg-[#f4e7f4] dark:bg-[#3d253d] rounded-full h-2">
                                        <div className="bg-primary h-full rounded-full w-[45%]"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/exercises')}
                                    className="w-full sm:w-auto cursor-pointer shadow-[0_4px_14px_0_rgba(244,37,244,0.39)] hover:shadow-[0_6px_20px_rgba(244,37,244,0.23)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 rounded-full h-12 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold"
                                >
                                    <span className="material-symbols-outlined filled-icon">play_arrow</span>
                                    Jugar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section>
                <h2 className="text-[#1c0d1c] dark:text-white text-2xl font-bold mb-4 px-2">Explorar más</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* World Card */}
                    <div onClick={() => router.push('/dashboard/worlds')} className="group flex flex-col bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-transparent dark:border-[#3d253d] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="h-32 rounded-xl bg-cover bg-center mb-4 group-hover:brightness-110 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjSSRUQXpYtDOGsLvCSd9dpprd9eupxKunUAfyC0YMMGFBerDRJouric-2GyIJeMkwceaJeDmUHoLaIEPabdx8ETKdKooNwzQSYimOY6-zzehbHANjEVK9pDfwzwnhbRCdGIBYJ0_z_0PwtSOcz8cmzstK9PPRoqWpcrM3bJ3Voh0-F-rjdFGDKGN-UWAV9_KKD5-GQ-t3lLjun3wG_FSrGvPjHsOf3b_24KSIraDRZ-hb6v7C19wbSj4e60JXZhvSs7wExemfUC4")' }}></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-[#1c0d1c] dark:text-white">Mundos</h3>
                                <p className="text-xs text-[#6b4c6b] dark:text-[#d1bdd1]">Explora nuevos temas</p>
                            </div>
                            <div className="size-8 rounded-full bg-[#f4e7f4] dark:bg-[#3d253d] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Card */}
                    <div onClick={() => router.push('/dashboard/achievements')} className="group flex flex-col bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-transparent dark:border-[#3d253d] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="h-32 rounded-xl bg-cover bg-center mb-4 group-hover:brightness-110 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADl8Ev0KTiW2fJpTdkt6reXJrzZ9r1_5vWN0Z4euQ7fLCqHKdpAN-F8hT3av6Ak-2R9RvX_HiOaxiatz89tkiA_rqDUvaVjWvK6S5pldWFSw4ci1rNUl3at_7JeWjz0irPUhaa4xL_sSAc4q3xz7Hi6NGgajP1otlytcu51i7W40e7-fneMAKbLTnpo7CHtL21-KZZczawfF32Y6oFbkAmAmlSbDz5aVYVLmobdEheTWIW_jS7UKfIRSbhp5OObV3axzdJIJwz93A")' }}></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-[#1c0d1c] dark:text-white">Mis Logros</h3>
                                <p className="text-xs text-[#6b4c6b] dark:text-[#d1bdd1]">12 Desbloqueados</p>
                            </div>
                            <div className="size-8 rounded-full bg-[#f4e7f4] dark:bg-[#3d253d] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Store Card (Example reuse) */}
                    <div onClick={() => router.push('/dashboard/store')} className="group flex flex-col bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-transparent dark:border-[#3d253d] hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="h-32 rounded-xl bg-cover bg-center mb-4 group-hover:brightness-110 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDY__2Zc6d8mHMaXB-IgL3DjFMb15zOOEJ9gGl0Aqvw4QNDz_5300S8UWJOhMVm_OYpYH0s-WCpF4Mr-3SmSNLDeVxNjKQFZx0GniveeLNB9z7Ni-YVWcHMdYXL5CVlh-kUsAq9fhr2TR5C3agcUvdyVx3wNvV003CJBbNQjATwI2MLwFABZQ0MBkmXWtvCi4U5HSHuP-ijmXIYf_Hm6JiDLwipxdXaQbv_V3d16cY8e3bj43soDtejA4Ll8XAmoIIxPKRiZ6q-xps")' }}></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-[#1c0d1c] dark:text-white">Tienda</h3>
                                <p className="text-xs text-[#6b4c6b] dark:text-[#d1bdd1]">Gasta tus gemas</p>
                            </div>
                            <div className="size-8 rounded-full bg-[#f4e7f4] dark:bg-[#3d253d] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge */}
                    <div className="group flex flex-col bg-gradient-to-br from-primary to-purple-600 p-4 rounded-2xl shadow-md border border-transparent transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="h-32 rounded-xl flex items-center justify-center mb-4 bg-white/10 group-hover:bg-white/20 transition-all border border-white/20">
                            <span className="material-symbols-outlined text-white text-[64px] animate-bounce">bolt</span>
                        </div>
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <h3 className="font-bold text-lg">Desafío Diario</h3>
                                <p className="text-xs text-white/80">Tiempo restante: 2h</p>
                            </div>
                            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">play_arrow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
