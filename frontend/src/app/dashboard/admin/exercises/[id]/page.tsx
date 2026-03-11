"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
    ArrowLeft, Edit2, Trash2, Play, BookOpen, Star, Zap, ChevronDown, ChevronUp,
    CheckCircle2, XCircle, Clock, Award, Puzzle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExercisePlayer, { ExerciseType } from "@/components/exercises/ExercisePlayer";

interface ExerciseDetail {
    id: number;
    title: string;
    description?: string;
    exerciseType: string;
    difficultyLevel: string;
    points: number;
    isActive: boolean;
    content: any;
    correctAnswer: any;
    hints?: string[];
    subjectAreaName?: string;
    courseName?: string;
    unitName?: string;
    createdAt?: string;
}

export default function ExerciseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSimulation, setShowSimulation] = useState(false);
    const [showJson, setShowJson] = useState(false);

    const isMaster = user?.roleId === 1;

    useEffect(() => {
        if (id) fetchExercise();
    }, [id]);

    const fetchExercise = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/exercises/${id}`);
            setExercise(res.data);
        } catch (err) {
            showToast("Error al cargar ejercicio", "error");
            router.push('/dashboard/admin/exercises');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Eliminar este ejercicio permanentemente?")) return;
        try {
            await api.delete(`/exercises/${id}`);
            showToast("Ejercicio eliminado", "success");
            router.push('/dashboard/admin/exercises');
        } catch (err) {
            showToast("Error al eliminar", "error");
        }
    };

    const handleSimulationComplete = (exerciseId: number, isCorrect: boolean, answer: any, timeSpent: number) => {
        showToast(isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta", isCorrect ? "success" : "error");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Cargando ejercicio...</div>
            </div>
        );
    }

    if (!exercise) return null;

    const typeLabels: Record<string, string> = {
        multiple_choice: "Opción Múltiple",
        true_false: "Verdadero/Falso",
        matching: "Unir Líneas",
        drag_drop: "Arrastrar y Soltar",
        sequence: "Ordenar Secuencia",
        fill_blanks: "Completar Huecos",
        multi_select: "Selección Múltiple"
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push('/dashboard/admin/exercises')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a Ejercicios
                </button>

                {isMaster && (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.push(`/dashboard/admin/curriculum?editExercise=${id}`)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Title Section */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-200 dark:shadow-none flex-shrink-0">
                            <Puzzle className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{exercise.title}</h1>
                            {exercise.description && (
                                <p className="text-slate-500 dark:text-slate-400 text-lg">{exercise.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-black uppercase text-xs px-3 py-1 border-none">
                                    {typeLabels[exercise.exerciseType] || exercise.exerciseType}
                                </Badge>
                                <Badge className={cn(
                                    "font-black uppercase text-xs px-3 py-1 border-none",
                                    exercise.difficultyLevel === 'easy' ? "bg-green-100 text-green-600 dark:bg-green-900/30" :
                                        exercise.difficultyLevel === 'medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                                            "bg-red-100 text-red-600 dark:bg-red-900/30"
                                )}>
                                    {exercise.difficultyLevel}
                                </Badge>
                                <span className="flex items-center gap-1 text-amber-500 font-black">
                                    <Star className="w-4 h-4 fill-amber-500" /> {exercise.points} pts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Curso</p>
                            <p className="font-black text-slate-900 dark:text-white">{exercise.courseName || "Sin asignar"}</p>
                            {exercise.unitName && <p className="text-xs text-slate-500">{exercise.unitName}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Award className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Área</p>
                            <p className="font-black text-slate-900 dark:text-white">{exercise.subjectAreaName || "General"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Estado</p>
                            <p className={cn("font-black", exercise.isActive ? "text-emerald-500" : "text-slate-400")}>
                                {exercise.isActive ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* JSON Preview */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setShowJson(!showJson)}
                        className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                        {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        Ver JSON del Ejercicio
                    </button>
                    {showJson && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black text-emerald-500 mb-2 uppercase tracking-widest">Contenido</p>
                                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-auto max-h-60 font-mono">
                                    {JSON.stringify(exercise.content, null, 2)}
                                </pre>
                            </div>
                            <div>
                                <p className="text-xs font-black text-rose-500 mb-2 uppercase tracking-widest">Respuesta Correcta</p>
                                <pre className="bg-slate-900 text-rose-400 p-4 rounded-xl text-xs overflow-auto max-h-60 font-mono">
                                    {JSON.stringify(exercise.correctAnswer, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Simulation Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Play className="w-6 h-6 text-emerald-500" />
                            Simulación del Ejercicio
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Prueba cómo verá el estudiante este ejercicio</p>
                    </div>
                    <Button
                        onClick={() => setShowSimulation(!showSimulation)}
                        className={cn(
                            "font-black",
                            showSimulation ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        )}
                    >
                        {showSimulation ? "Ocultar Simulación" : "Iniciar Simulación"}
                    </Button>
                </div>

                {showSimulation && (
                    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900">
                        <div className="max-w-3xl mx-auto">
                            <ExercisePlayer
                                exercise={{
                                    id: exercise.id,
                                    title: exercise.title,
                                    exerciseType: exercise.exerciseType as ExerciseType,
                                    difficultyLevel: exercise.difficultyLevel,
                                    content: exercise.content,
                                    points: exercise.points,
                                    hints: exercise.hints
                                }}
                                onComplete={handleSimulationComplete}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
