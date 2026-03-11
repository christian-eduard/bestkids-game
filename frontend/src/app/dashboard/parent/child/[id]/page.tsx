"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation"; // Corrected import for App Router
import {
    User, ArrowLeft, Trophy, Star, Clock, Brain,
    Calendar, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChildDetail {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    avatarId: number;
    level: number;
    points: number;
    streakDays: number;
    lastLoginAt: string;
    areaProgress: {
        areaName: string;
        progress: number;
        stars: number;
        color: string;
    }[];
    recentActivity: {
        id: number;
        exerciseTitle: string;
        score: number;
        createdAt: string;
    }[];
}

export default function ChildDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [child, setChild] = useState<ChildDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchChildData(params.id as string);
        }
    }, [params.id]);

    const fetchChildData = async (id: string) => {
        try {
            // In a real app, we would have a specific endpoint /users/children/:id/stats
            // For now, we simulate fetching detailed data or reuse existing endpoints if permissible
            // Let's assume we fetch basic user data and mock the rest for MVP demonstration
            const res = await api.get(`/users/${id}`);

            // Simulating stats
            const mockData: ChildDetail = {
                ...res.data,
                level: 5,
                points: 1250,
                streakDays: 3,
                areaProgress: [
                    { areaName: 'Matemáticas', progress: 75, stars: 12, color: 'bg-blue-500' },
                    { areaName: 'Ciencias', progress: 45, stars: 5, color: 'bg-green-500' },
                    { areaName: 'Lenguaje', progress: 90, stars: 18, color: 'bg-yellow-500' },
                    { areaName: 'Arte', progress: 30, stars: 2, color: 'bg-pink-500' },
                ],
                recentActivity: [
                    { id: 1, exerciseTitle: 'Sumas Básicas', score: 100, createdAt: new Date().toISOString() },
                    { id: 2, exerciseTitle: 'Animales', score: 80, createdAt: new Date(Date.now() - 86400000).toISOString() },
                ]
            };

            setChild(mockData);
        } catch (err) {
            console.error(err);
            // Handle error (e.g., child not found or not belonging to parent)
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando perfil...</div>;
    }

    if (!child) {
        return <div className="p-8 text-center">No se encontró información del estudiante.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header / Back */}
            <div>
                <Link
                    href="/dashboard/parent"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a mis hijos
                </Link>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {child.firstName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {child.firstName} {child.lastName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            @{child.username}
                        </p>
                    </div>
                    <div className="ml-auto flex gap-4 text-center">
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold">Nivel</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{child.level}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold">Puntos</div>
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{child.points}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Progreso por Área
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {child.areaProgress.map((area) => (
                    <div key={area.areaName} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200">{area.areaName}</h3>
                            <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                <Star className="w-4 h-4 fill-current" />
                                {area.stars}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500", area.color)}
                                style={{ width: `${area.progress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-right text-xs text-gray-500">
                            {area.progress}% Completado
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 pt-4">
                <Clock className="w-5 h-5 text-blue-500" />
                Actividad Reciente
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {child.recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                activity.score >= 80 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                            )}>
                                {activity.score >= 80 ? <CheckCircle2 className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{activity.exerciseTitle}</p>
                                <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleDateString()} • {new Date(activity.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "font-bold text-lg",
                                activity.score >= 80 ? "text-green-600" : activity.score >= 60 ? "text-yellow-600" : "text-red-500"
                            )}>
                                {activity.score}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
