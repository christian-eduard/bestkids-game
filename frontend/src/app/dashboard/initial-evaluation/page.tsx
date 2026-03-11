"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { getSoundManager } from "@/lib/soundManager";

interface InitialExercise {
    id: number;
    title: string;
    exerciseType: string;
    difficultyLevel: string;
}

export default function InitialEvaluationPage() {
    const router = useRouter();
    const [exercises, setExercises] = useState<InitialExercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);

    useEffect(() => {
        checkEvaluationStatus();
    }, []);

    const checkEvaluationStatus = async () => {
        try {
            const res = await api.get('/evaluations/initial-status');

            if (res.data.completed) {
                // Ya completó la evaluación inicial
                router.push('/dashboard');
                return;
            }

            // Cargar ejercicios de evaluación inicial
            const exercisesRes = await api.get('/evaluations/initial-exercises');
            setExercises(exercisesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExerciseComplete = async (exerciseId: number, isCorrect: boolean) => {
        const soundManager = getSoundManager();

        if (isCorrect) {
            soundManager?.playCorrect();
        } else {
            soundManager?.playIncorrect();
        }

        setCompleted([...completed, exerciseId]);

        // Si completó todos los ejercicios
        if (completed.length + 1 >= exercises.length) {
            await finishEvaluation();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const finishEvaluation = async () => {
        setEvaluating(true);

        try {
            const res = await api.post('/evaluations/complete-initial', {
                completedExercises: completed,
            });

            // Mostrar resultado de clasificación RtI
            const tier = res.data.rtiTier;

            setTimeout(() => {
                router.push('/dashboard?evaluation=completed&tier=' + tier);
            }, 2000);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
        );
    }

    if (evaluating) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <Card className="max-w-2xl w-full mx-4">
                    <CardContent className="p-12 text-center">
                        <div className="text-8xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            ¡Evaluación Completada!
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">
                            Estamos analizando tus resultados...
                        </p>
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentExercise = exercises[currentIndex];
    const progress = ((completed.length / exercises.length) * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <Card className="mb-8 border-4 border-purple-500">
                    <CardContent className="p-6">
                        <h1 className="text-4xl font-bold text-center mb-4">
                            🎯 Evaluación Inicial
                        </h1>
                        <p className="text-xl text-center text-gray-600 mb-6">
                            Completa estos ejercicios para que podamos conocer tu nivel
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progreso</span>
                                <span>{completed.length} / {exercises.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Completed Exercises */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {exercises.map((ex, idx) => (
                                <div
                                    key={ex.id}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${completed.includes(ex.id)
                                            ? 'bg-green-500 text-white'
                                            : idx === currentIndex
                                                ? 'bg-purple-500 text-white animate-pulse'
                                                : 'bg-gray-300 text-gray-600'
                                        }`}
                                >
                                    {completed.includes(ex.id) ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Current Exercise */}
                {currentExercise && (
                    <Card className="border-4 border-blue-500">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600 mb-2">
                                    Ejercicio {currentIndex + 1} de {exercises.length}
                                </p>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {currentExercise.title}
                                </h2>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 mb-6 min-h-[300px] flex items-center justify-center">
                                <p className="text-xl text-gray-600 text-center">
                                    Aquí se mostraría el ejercicio tipo: {currentExercise.exerciseType}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleExerciseComplete(currentExercise.id, false)}
                                    className="flex-1 px-6 py-4 bg-gray-300 hover:bg-gray-400 rounded-xl font-bold text-lg transition-colors"
                                >
                                    Saltar
                                </button>
                                <button
                                    onClick={() => handleExerciseComplete(currentExercise.id, true)}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    Siguiente
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
