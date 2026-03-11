"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star, TrendingUp, Loader2, Crown } from "lucide-react";

interface LeaderboardEntry {
    userId: number;
    userName: string;
    totalPoints: number;
    level: number;
    rank: number;
    avatar?: string;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'global' | 'class' | 'center'>('global');

    useEffect(() => {
        fetchLeaderboard();
    }, [filter]);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get(`/gamification/leaderboard?scope=${filter}`);
            setLeaderboard(res.data.leaderboard || []);
            setMyRank(res.data.myRank || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-8 h-8 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
        if (rank === 3) return <Medal className="w-8 h-8 text-orange-400" />;
        return <span className="text-2xl font-bold text-gray-600">#{rank}</span>;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return "from-yellow-400 to-yellow-600";
        if (rank === 2) return "from-gray-300 to-gray-500";
        if (rank === 3) return "from-orange-400 to-orange-600";
        return "from-blue-400 to-blue-600";
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-3xl text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                    <Trophy className="w-12 h-12" />
                    <div>
                        <h1 className="text-4xl font-bold">🏆 Ranking</h1>
                        <p className="text-xl opacity-90">¡Compite con los mejores!</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setFilter('global')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'global'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                        }`}
                >
                    🌍 Global
                </button>
                <button
                    onClick={() => setFilter('class')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'class'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                        }`}
                >
                    👥 Mi Clase
                </button>
                <button
                    onClick={() => setFilter('center')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'center'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                        }`}
                >
                    🏫 Mi Centro
                </button>
            </div>

            {/* My Rank Card */}
            {myRank && (
                <Card className="border-4 border-purple-500 shadow-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {getRankIcon(myRank.rank)}
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Tu Posición</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        #{myRank.rank}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Puntos Totales</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                    <p className="text-3xl font-bold">{myRank.totalPoints}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Leaderboard */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">🏅 Top Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboard.map((entry, index) => (
                            <div
                                key={entry.userId}
                                className={`p-4 rounded-xl border-2 transition-all ${entry.userId === myRank?.userId
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Rank */}
                                        <div className="w-16 flex justify-center">
                                            {getRankIcon(entry.rank)}
                                        </div>

                                        {/* Avatar */}
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${getRankColor(entry.rank)}`}>
                                            {entry.avatar || entry.userName.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Name & Level */}
                                        <div>
                                            <p className="font-bold text-lg">{entry.userName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Nivel {entry.level}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                            <p className="text-2xl font-bold">{entry.totalPoints}</p>
                                        </div>
                                        {index > 0 && (
                                            <p className="text-xs text-gray-500">
                                                -{leaderboard[0].totalPoints - entry.totalPoints} del 1º
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {leaderboard.length === 0 && (
                        <div className="text-center py-20">
                            <Trophy className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                No hay datos de ranking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                ¡Sé el primero en aparecer aquí!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Motivational Card */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardContent className="p-8 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        ¡Sigue Aprendiendo!
                    </h3>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        Cada ejercicio que completas te acerca más al primer lugar 🏆
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
