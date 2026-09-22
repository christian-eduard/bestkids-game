"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface GamificationStats {
    totalUsers: number;
    totalXpAwarded: number;
    averageLevel: number;
    topStudents: Array<{
        id: number;
        firstName: string;
        lastName: string;
        xpPoints: number;
        level: number;
    }>;
}

export default function MasterGamificationPage() {
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/gamification/stats');
                setStats(data);
            } catch (err: any) {
                // Graceful degradation — show placeholder if endpoint not ready
                setStats({
                    totalUsers: 0,
                    totalXpAwarded: 0,
                    averageLevel: 1,
                    topStudents: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-text-main">Gamificación</h1>
                <p className="text-text-sub font-medium mt-1">Gestión del sistema de puntos, niveles y recompensas</p>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
            )}

            {!loading && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Usuarios Activos', value: stats?.totalUsers ?? 0, icon: 'group', color: 'from-violet-500 to-purple-600' },
                            { label: 'XP Total Otorgado', value: stats?.totalXpAwarded?.toLocaleString() ?? 0, icon: 'bolt', color: 'from-amber-400 to-orange-500' },
                            { label: 'Nivel Promedio', value: stats?.averageLevel?.toFixed(1) ?? '1.0', icon: 'trending_up', color: 'from-emerald-400 to-teal-500' },
                        ].map(stat => (
                            <div key={stat.label}
                                className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg`}>
                                <span className="material-symbols-outlined text-3xl opacity-80 mb-2 block">{stat.icon}</span>
                                <div className="text-4xl font-black mb-1">{stat.value}</div>
                                <div className="text-sm font-bold opacity-80">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Top Students */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
                        <h2 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500">emoji_events</span>
                            Ranking de Estudiantes
                        </h2>

                        {!stats?.topStudents?.length ? (
                            <div className="text-center py-12 text-text-sub">
                                <span className="material-symbols-outlined text-5xl mb-3 block text-gray-300">leaderboard</span>
                                <p className="font-bold">No hay datos de ranking todavía</p>
                                <p className="text-sm mt-1">Aparecerá aquí cuando los estudiantes completen ejercicios.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.topStudents.map((student, index) => (
                                    <div key={student.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg
                                            ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-50 text-gray-400'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-text-main">
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div className="text-sm text-text-sub">Nivel {student.level}</div>
                                        </div>
                                        <div className="font-black text-primary">
                                            {student.xpPoints?.toLocaleString()} XP
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
