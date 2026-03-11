"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    Trophy,
    Target,
    Clock,
    CheckCircle2,
    XCircle,
    Zap,
    Award,
    Loader2
} from "lucide-react";

interface ProgressStats {
    totalAttempts: number;
    correctAttempts: number;
    totalPoints: number;
    avgTimePerExercise: number;
    successRate: number;
    recentPerformance: any[];
    rtiClassification?: {
        tier: number;
        tierLabel: string;
        tierColor: string;
        recommendation: string;
    };
}

export default function ProgressPage() {
    const [stats, setStats] = useState<ProgressStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const res = await api.get("/exercises/my-progress");
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-bestkids-purple" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-20">
                <p className="text-2xl text-gray-600">No hay datos de progreso aún</p>
            </div>
        );
    }

    const getTierBadge = () => {
        if (!stats.rtiClassification) return null;

        const { tier, tierLabel, tierColor } = stats.rtiClassification;
        const tierEmojis = ['🌟', '⚠️', '🚨'];

        return (
            <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                style={{ backgroundColor: tierColor, color: 'white' }}
            >
                <span className="text-3xl">{tierEmojis[tier - 1]}</span>
                {tierLabel}
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="relative rounded-3xl bg-gradient-to-br from-bestkids-blue via-bestkids-purple to-bestkids-pink p-8 md:p-12 text-white overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-title mb-4 drop-shadow-lg">
                        Mi Progreso 📊
                    </h1>
                    <p className="text-2xl font-title opacity-90">
                        ¡Mira todo lo que has logrado!
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* RtI Classification */}
            {stats.rtiClassification && (
                <Card className="border-4 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-title flex items-center gap-3">
                            <Award className="w-10 h-10 text-bestkids-purple" />
                            Tu Nivel Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-6">
                            {getTierBadge()}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border-2 border-blue-200">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                <strong>Recomendación:</strong> {stats.rtiClassification.recommendation}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Attempts */}
                <Card className="border-4 border-bestkids-blue shadow-lg hover:scale-105 transition-transform">
                    <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Target className="w-12 h-12 text-bestkids-blue" />
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-bestkids-blue mb-2">
                            {stats.totalAttempts}
                        </p>
                        <p className="text-lg font-semibold text-gray-600">
                            Ejercicios Intentados
                        </p>
                    </CardContent>
                </Card>

                {/* Correct Attempts */}
                <Card className="border-4 border-bestkids-green shadow-lg hover:scale-105 transition-transform">
                    <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle2 className="w-12 h-12 text-bestkids-green" />
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-bestkids-green mb-2">
                            {stats.correctAttempts}
                        </p>
                        <p className="text-lg font-semibold text-gray-600">
                            Respuestas Correctas
                        </p>
                    </CardContent>
                </Card>

                {/* Success Rate */}
                <Card className="border-4 border-bestkids-purple shadow-lg hover:scale-105 transition-transform">
                    <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-purple-100 p-4 rounded-full">
                                <TrendingUp className="w-12 h-12 text-bestkids-purple" />
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-bestkids-purple mb-2">
                            {stats.successRate}%
                        </p>
                        <p className="text-lg font-semibold text-gray-600">
                            Tasa de Éxito
                        </p>
                    </CardContent>
                </Card>

                {/* Total Points */}
                <Card className="border-4 border-bestkids-yellow shadow-lg hover:scale-105 transition-transform">
                    <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-yellow-100 p-4 rounded-full">
                                <Trophy className="w-12 h-12 text-bestkids-yellow" />
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-bestkids-yellow mb-2">
                            {stats.totalPoints}
                        </p>
                        <p className="text-lg font-semibold text-gray-600">
                            Puntos Totales
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-4 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-title flex items-center gap-3">
                            <Clock className="w-8 h-8 text-bestkids-orange" />
                            Tiempo Promedio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <p className="text-6xl font-bold text-bestkids-orange mb-2">
                                {stats.avgTimePerExercise}
                            </p>
                            <p className="text-2xl text-gray-600">segundos por ejercicio</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-4 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-title flex items-center gap-3">
                            <Zap className="w-8 h-8 text-bestkids-pink" />
                            Racha Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <p className="text-6xl font-bold text-bestkids-pink mb-2">
                                {Math.min(stats.correctAttempts, 5)}
                            </p>
                            <p className="text-2xl text-gray-600">ejercicios seguidos</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Motivational Message */}
            <Card className="border-4 border-bestkids-green bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 shadow-xl">
                <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-3xl font-title font-bold text-gray-900 dark:text-white mb-4">
                        ¡Sigue así, campeón!
                    </h3>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        Cada ejercicio que completas te hace más inteligente. ¡No te rindas!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
