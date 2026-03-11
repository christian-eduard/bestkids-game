"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    ClipboardCheck, Clock, CheckCircle2, AlertCircle, Play, Trophy,
    Loader2, Calendar, BookOpen, Star, Zap
} from "lucide-react";

interface Assignment {
    id: number;
    title: string;
    instructions: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string | null;
    createdAt: string;
    score: number | null;
    pointsAwarded: number | null;
    teacher?: { id: number; firstName: string; lastName: string };
    exercise?: { id: number; title: string; points: number; exerciseType: string };
}

interface Stats {
    totalAssignments: number;
    pending: number;
    completed: number;
    overdue: number;
    averageScore: number;
    totalPointsEarned: number;
}

export default function MyTasksPage() {
    const router = useRouter();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, statsRes] = await Promise.all([
                api.get('/assignments/my'),
                api.get('/assignments/my/stats'),
            ]);
            setAssignments(assignmentsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartAssignment = async (assignment: Assignment) => {
        try {
            await api.post(`/assignments/${assignment.id}/start`);
            // Navigate to play the exercise
            router.push(`/dashboard/play/${assignment.exercise?.id}?assignmentId=${assignment.id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusConfig = (status: string) => {
        const config = {
            pending: {
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                border: 'border-yellow-300 dark:border-yellow-700',
                text: 'text-yellow-700 dark:text-yellow-400',
                label: '⏳ Pendiente',
                icon: Clock
            },
            in_progress: {
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                border: 'border-blue-300 dark:border-blue-700',
                text: 'text-blue-700 dark:text-blue-400',
                label: '📖 En progreso',
                icon: BookOpen
            },
            completed: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                border: 'border-green-300 dark:border-green-700',
                text: 'text-green-700 dark:text-green-400',
                label: '✅ Completado',
                icon: CheckCircle2
            },
            overdue: {
                bg: 'bg-red-100 dark:bg-red-900/30',
                border: 'border-red-300 dark:border-red-700',
                text: 'text-red-700 dark:text-red-400',
                label: '⚠️ Vencido',
                icon: AlertCircle
            },
        };
        return config[status as keyof typeof config] || config.pending;
    };

    const getExerciseTypeEmoji = (type: string) => {
        const emojis: Record<string, string> = {
            multiple_choice: '🎯',
            true_false: '⚖️',
            drag_drop: '🎪',
            matching: '🔗',
            fill_blanks: '✏️',
        };
        return emojis[type] || '📝';
    };

    const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'in_progress' || a.status === 'overdue');
    const completedAssignments = assignments.filter(a => a.status === 'completed');

    const displayedAssignments = activeTab === 'pending' ? pendingAssignments : completedAssignments;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400">Cargando tus tareas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
                    <span className="text-4xl">📋</span>
                    Mis Tareas
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    ¡Completa tus tareas y gana puntos!
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <ClipboardCheck className="w-5 h-5" />
                            <span className="text-sm opacity-90">Por hacer</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm opacity-90">Completadas</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="w-5 h-5" />
                            <span className="text-sm opacity-90">Promedio</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.averageScore}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm opacity-90">XP Ganados</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.totalPointsEarned}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                        activeTab === 'pending'
                            ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                >
                    <Clock className="w-4 h-4" />
                    Por hacer ({pendingAssignments.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                        activeTab === 'completed'
                            ? "bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Completadas ({completedAssignments.length})
                </button>
            </div>

            {/* Assignments List */}
            {displayedAssignments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                        {activeTab === 'pending' ? '🎉' : '📭'}
                    </div>
                    <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                        {activeTab === 'pending'
                            ? '¡No tienes tareas pendientes!'
                            : 'Aún no has completado ninguna tarea'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {activeTab === 'pending'
                            ? 'Disfruta de tu tiempo libre 🌟'
                            : 'Cuando completes tareas aparecerán aquí'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedAssignments.map((assignment) => {
                        const statusConfig = getStatusConfig(assignment.status);
                        const Icon = statusConfig.icon;
                        const isOverdue = assignment.status === 'overdue';
                        const canPlay = assignment.status === 'pending' || assignment.status === 'in_progress';

                        return (
                            <div
                                key={assignment.id}
                                className={cn(
                                    "bg-white dark:bg-gray-800 rounded-2xl border-2 p-5 transition-all hover:shadow-lg",
                                    statusConfig.border,
                                    isOverdue && "opacity-75"
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">
                                                {getExerciseTypeEmoji(assignment.exercise?.exerciseType || '')}
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                    {assignment.title || assignment.exercise?.title || 'Tarea'}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Por: {assignment.teacher?.firstName} {assignment.teacher?.lastName}
                                                </p>
                                            </div>
                                        </div>

                                        {assignment.instructions && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                                💬 {assignment.instructions}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                            <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium", statusConfig.bg, statusConfig.text)}>
                                                <Icon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>

                                            {assignment.dueDate && (
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-3 py-1 rounded-full",
                                                    isOverdue ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                )}>
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(assignment.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Star className="w-3 h-3" />
                                                {assignment.exercise?.points || 10} XP
                                            </span>

                                            {assignment.score !== null && (
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold",
                                                    assignment.score >= 70
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                )}>
                                                    <Trophy className="w-3 h-3" />
                                                    {assignment.score}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0">
                                        {canPlay ? (
                                            <button
                                                onClick={() => handleStartAssignment(assignment)}
                                                className={cn(
                                                    "flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-lg",
                                                    "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                )}
                                            >
                                                <Play className="w-5 h-5" />
                                                {assignment.status === 'in_progress' ? 'Continuar' : '¡Jugar!'}
                                            </button>
                                        ) : assignment.status === 'completed' ? (
                                            <div className="text-center px-4 py-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                                                <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                                                    +{assignment.pointsAwarded || 0} XP
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center px-4 py-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />
                                                <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                                                    Vencido
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
