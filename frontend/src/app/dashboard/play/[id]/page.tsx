"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ExercisePlayer from "@/components/exercises/ExercisePlayer";
import { Loader2, ArrowLeft, Trophy } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function PlayExercisePage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const [exercise, setExercise] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchExercise(params.id as string);
        }
    }, [params.id]);

    const fetchExercise = async (id: string) => {
        try {
            const res = await api.get(`/exercises/${id}`);
            setExercise(res.data);
        } catch (err: any) {
            console.error(err);
            showToast("Error al cargar el ejercicio", "error");
            router.push("/dashboard/exercises");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (
        exerciseId: number,
        isCorrect: boolean,
        answer: any,
        timeSpent: number
    ) => {
        setSubmitting(true);
        try {
            const res = await api.post(`/exercises/${exerciseId}/submit`, {
                answer,
                timeSpent,
            });

            // Show result
            if (res.data.isCorrect) {
                showToast(
                    `¡Excelente! +${res.data.earnedPoints} puntos 🎉`,
                    "success"
                );
            } else {
                showToast("¡Sigue intentando! 💪", "info");
            }

            // Show adaptive recommendation if available
            if (res.data.adaptiveRecommendation) {
                const rec = res.data.adaptiveRecommendation;
                console.log("Adaptive Recommendation:", rec);

                // Show recommendation toast
                setTimeout(() => {
                    showToast(rec.adjustmentReason, "info");
                }, 2000);
            }

            // Redirect back after 3 seconds
            setTimeout(() => {
                router.push("/dashboard/exercises");
            }, 3000);
        } catch (err: any) {
            console.error(err);
            showToast("Error al enviar respuesta", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleHintRequest = (exerciseId: number, hintIndex: number) => {
        if (exercise?.hints && exercise.hints[hintIndex]) {
            showToast(`💡 Pista: ${exercise.hints[hintIndex]}`, "info");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-bestkids-purple" />
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-title text-gray-800">
                        Ejercicio no encontrado
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/exercises")}
                        className="mt-4 btn-student"
                    >
                        Volver a ejercicios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-4 border-bestkids-purple shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push("/dashboard/exercises")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-semibold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-bestkids-yellow px-4 py-2 rounded-xl font-bold text-lg shadow-md">
                            <Trophy className="w-5 h-5" />
                            {exercise.points} pts
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercise Title */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-title font-bold text-gray-900 dark:text-white mb-2">
                        {exercise.title}
                    </h1>
                    {exercise.description && (
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {exercise.description}
                        </p>
                    )}
                </div>

                {/* Exercise Player */}
                {submitting ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-16 w-16 animate-spin text-bestkids-purple mx-auto mb-4" />
                            <p className="text-2xl font-title text-gray-800 dark:text-white">
                                Enviando respuesta...
                            </p>
                        </div>
                    </div>
                ) : (
                    <ExercisePlayer
                        exercise={exercise}
                        onComplete={handleComplete}
                        onHintRequest={handleHintRequest}
                    />
                )}
            </div>
        </div>
    );
}
