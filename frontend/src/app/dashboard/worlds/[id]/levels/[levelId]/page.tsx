
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
// Using safer, standard icons to avoid version conflicts
import { Loader2, ArrowLeft, Star, Play, Trophy, Lock, CheckCircle } from "lucide-react";

interface Exercise {
    id: number;
    title: string;
    exerciseType: string;
    difficultyLevel: string;
    points: number;
}

interface Level {
    id: number;
    name: string;
    description: string;
    levelNumber: number;
}

export default function LevelExercisesPage() {
    const params = useParams();
    const router = useRouter();
    const [level, setLevel] = useState<Level | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.levelId) {
            fetchLevelData();
        }
    }, [params.levelId]);

    const fetchLevelData = async () => {
        try {
            const [levelRes, progressRes] = await Promise.all([
                api.get(`/worlds/levels/${params.levelId}`),
                api.get('/exercises/my-progress')
            ]);

            const levelData = levelRes.data;
            setLevel(levelData);

            // Extract exercises from the relation
            // levelData.exercises is an array of LevelExercise which contains 'exercise' property
            const extractedExercises = levelData.exercises?.map((le: any) => le.exercise) || [];
            // Sort by orderIndex if available in LevelExercise?
            // backend query has 'relations', order might depend on implementation. 
            // LevelExercise likely has orderIndex but we just map the exercise for now.
            setExercises(extractedExercises);

            setCompletedExercises(new Set(progressRes.data.completedExerciseIds || []));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
            </div>
            <p className="text-xl font-bold text-primary animate-pulse">Desbloqueando desafíos...</p>
        </div>
    );

    if (!level) return <div className="text-center p-10 font-bold text-gray-500">Nivel no encontrado</div>;

    const completedCount = completedExercises.size;
    const totalCount = exercises.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Header */}
            <div className="relative overflow-hidden mb-8 rounded-3xl bg-gradient-to-r from-violet-600 via-primary to-fuchsia-600 shadow-xl shadow-primary/20 p-8 md:p-10 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <button
                        onClick={() => router.push(`/dashboard/worlds/${params.id}`)}
                        className="bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold mb-2 border border-white/10">
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <span className="text-yellow-100 font-mono tracking-widest uppercase">Nivel {level.levelNumber}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight drop-shadow-md">{level.name}</h1>
                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl">{level.description}</p>
                    </div>

                    {/* Progress Circle */}
                    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="relative size-20">
                            <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray={`${progressPercent}, 100`} className="drop-shadow-[0_0_4px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xl font-bold">{Math.round(progressPercent)}%</span>
                            </div>
                        </div>
                        <span className="text-xs font-bold mt-2 uppercase tracking-wider opacity-80">Completado</span>
                    </div>
                </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise, index) => {
                    const isCompleted = completedExercises.has(exercise.id);
                    // Determine status logic (locked, current, completed) could be added here if sequential
                    const isLocked = false; // For now everything is unlocked

                    return (
                        <div
                            key={exercise.id}
                            onClick={() => !isLocked && router.push(`/dashboard/exercises/${exercise.id}`)}
                            className={`
                                group relative bg-white dark:bg-surface-dark rounded-3xl p-1 shadow-lg cursor-pointer
                                transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20
                                ${isCompleted ? 'border-2 border-green-400/50' : 'border-2 border-transparent hover:border-primary/30'}
                            `}
                        >
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner font-bold
                                        ${isCompleted
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                            : 'bg-primary/10 text-primary dark:bg-primary/20'
                                        }
                                    `}>
                                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : (index + 1)}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-bold text-sm border border-yellow-200 dark:border-yellow-700/50">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{exercise.points} XP</span>
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                                        {getExerciseLabel(exercise.exerciseType)}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                                        {exercise.title}
                                    </h3>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 relative z-10">
                                    <button className={`
                                        w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                        ${isCompleted
                                            ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                                            : 'bg-primary text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-[1.02]'
                                        }
                                    `}>
                                        {isCompleted ? (
                                            <>¡Repetir Desafío!</>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5 fill-current" />
                                                ¡JUGAR!
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getExerciseLabel(type: string) {
    if (!type) return 'Desafío';
    const t = type.toLowerCase();

    if (t.includes('choice')) return 'Selección';
    if (t.includes('true') || t.includes('false')) return 'Verdadero/Falso';
    if (t.includes('match')) return 'Parejas';
    if (t.includes('order') || t.includes('seq')) return 'Secuencia';
    if (t.includes('blank')) return 'Completar';
    return 'Desafío';
}

