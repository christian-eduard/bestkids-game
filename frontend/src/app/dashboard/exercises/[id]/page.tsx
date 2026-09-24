"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExerciseService, Exercise, ExerciseAttemptResult } from '@/services/exercises.service';
import { GamificationService } from '@/services/gamification.service';
import Link from 'next/link';
import confetti from 'canvas-confetti';

// Exercise Components
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import TrueFalseExercise from '@/components/exercises/TrueFalseExercise';
import MatchingExercise from '@/components/exercises/MatchingExercise';
import DragDropExercise from '@/components/exercises/DragDropExercise';
import FillBlanksExercise from '@/components/exercises/FillBlanksExercise';
import MultiSelectExercise from '@/components/exercises/MultiSelectExercise';
import CategorizationExercise from '@/components/exercises/CategorizationExercise';
import SequenceExercise from '@/components/exercises/SequenceExercise';

export default function ExercisePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [result, setResult] = useState<ExerciseAttemptResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const data = await ExerciseService.getExerciseById(id);
                setExercise(data);

                // Initialize answer if needed
                setSelectedAnswer(null);
            } catch (err: any) {
                console.error('Error fetching exercise:', err);
                setError('No se pudo cargar el ejercicio. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchExercise();
    }, [id]);

    const handleSubmit = async () => {
        if (!selectedAnswer || isSubmitting || !exercise) return;

        setIsSubmitting(true);
        try {
            const response = await ExerciseService.submitAttempt(id, selectedAnswer);
            setResult(response);

            if (response.isCorrect) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D946EF', '#8B5CF6', '#3B82F6']
                });

                // Refresh points/level if gamification is active
                try {
                    await GamificationService.getUserStats();
                } catch (e) {
                    console.warn('Could not refresh stats');
                }
            }
        } catch (err) {
            console.error('Error submitting attempt:', err);
            setError('Error al enviar la respuesta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        if (!exercise) return;

        const nextIndex = currentQuestionIndex + 1;
        const totalQuestions = Array.isArray(exercise.content) ? exercise.content.length : 1;

        if (nextIndex < totalQuestions) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(null);
            setResult(null);
            setError(null);
        } else {
            // Completed all questions
            router.push('/dashboard/exercises');
        }
    };

    const renderExerciseComponent = () => {
        if (!exercise) return null;

        const currentContent = Array.isArray(exercise.content)
            ? exercise.content[currentQuestionIndex]
            : exercise.content;

        if (!currentContent) {
            return (
                <div className="p-10 bg-white rounded-3xl text-center shadow-xl border-4 border-dashed border-gray-100">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">data_info_alert</span>
                    <h3 className="text-2xl font-black text-text-sub">Datos incompletos</h3>
                    <p className="text-gray-400">Esta pregunta no tiene contenido válido.</p>
                </div>
            );
        }

        const commonProps = {
            content: currentContent,
            onAnswer: setSelectedAnswer,
            selectedAnswer,
            result,
            isSubmitting
        };

        switch (exercise.exerciseType) {
            case 'MULTIPLE_CHOICE':
            case 'multiple_choice':
            case 'multiple-choice':
            case 'options':
                return <MultipleChoiceExercise {...commonProps} />;

            case 'TRUE_FALSE':
            case 'true_false':
                return <TrueFalseExercise {...commonProps} />;

            case 'MATCHING':
            case 'matching':
                return <MatchingExercise {...commonProps} />;

            case 'SEQUENCE':
            case 'ORDERING':
            case 'sequence':
                return (
                    <SequenceExercise
                        {...commonProps}
                    />
                );

            case 'DRAG_DROP':
            case 'drag_drop':
                return <DragDropExercise {...commonProps} />;

            case 'FILL_BLANKS':
            case 'fill_blanks':
                return <FillBlanksExercise {...commonProps} />;

            case 'CATEGORIZATION':
            case 'categorization':
                return <CategorizationExercise {...commonProps} />;

            case 'MULTI_SELECT':
            case 'multi_select':
                return <MultiSelectExercise {...commonProps} />;

            default:
                return (
                    <div className="p-10 bg-white rounded-3xl text-center shadow-xl">
                        <span className="material-symbols-outlined text-6xl text-amber-500 mb-4">warning</span>
                        <h3 className="text-2xl font-black mb-2">Tipo no soportado</h3>
                        <p className="text-text-sub font-medium">El tipo de ejercicio "{exercise.exerciseType}" aún no está disponible.</p>
                        <Link href="/dashboard/exercises" className="mt-6 inline-block text-primary font-bold hover:underline">Volver a la lista</Link>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="relative size-24">
                    <div className="absolute inset-0 rounded-full border-8 border-primary/20 border-t-primary animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-8 border-violet-500/20 border-b-violet-500 animate-spin-slow"></div>
                </div>
                <p className="text-2xl font-black text-primary animate-pulse uppercase tracking-[0.2em]">Cargando Misión...</p>
            </div>
        );
    }

    if (!exercise && error) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-2xl border-4 border-red-50 border-b-red-100 text-center">
                <span className="material-symbols-outlined text-7xl text-red-500 mb-6 font-black">error_meditation</span>
                <h2 className="text-3xl font-black text-text-main mb-4">¡Ups! Algo salió mal</h2>
                <p className="text-lg text-text-sub font-medium mb-8">{error}</p>
                <Link
                    href="/dashboard/exercises"
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Regresar a Ejercicios
                </Link>
            </div>
        );
    }

    if (!exercise) return null;

    const totalQuestions = Array.isArray(exercise.content) ? exercise.content.length : 1;
    const progress = ((currentQuestionIndex + (result ? 1 : 0)) / totalQuestions) * 100;

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/dashboard/exercises"
                        className="p-3 bg-white dark:bg-white/5 rounded-2xl border-2 border-gray-100 dark:border-white/10 text-text-sub hover:text-primary transition-colors flex items-center gap-2 font-bold"
                    >
                        <span className="material-symbols-outlined font-black">close</span>
                        <span className="hidden md:inline">Salir</span>
                    </Link>

                    {/* Progress Steps */}
                    <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalQuestions }).map((_, i) => {
                                const done = i < currentQuestionIndex || (i === currentQuestionIndex && !!result);
                                const current = i === currentQuestionIndex && !result;
                                return (
                                    <div key={i} className="flex items-center">
                                        <div className={`
                                            flex items-center justify-center rounded-full font-black text-sm transition-all duration-500
                                            ${done
                                                ? 'w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-200'
                                                : current
                                                    ? 'w-10 h-10 bg-gradient-to-br from-primary to-violet-600 text-white shadow-xl shadow-primary/40 ring-4 ring-primary/20 scale-110'
                                                    : 'w-8 h-8 bg-gray-100 dark:bg-white/10 text-gray-400'
                                            }
                                        `}>
                                            {done
                                                ? <span className="material-symbols-outlined !text-base font-black">star</span>
                                                : i + 1
                                            }
                                        </div>
                                        {i < totalQuestions - 1 && (
                                            <div className={`h-1 w-4 md:w-8 rounded-full transition-all duration-500 ${
                                                done ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : 'bg-gray-100 dark:bg-white/10'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <span className="text-xs font-black text-text-sub uppercase tracking-widest">
                            {currentQuestionIndex + 1} de {totalQuestions} · {Math.round(progress)}% completado
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl font-black flex items-center gap-2 border-2 border-amber-200/50 shadow-sm">
                            <span className="material-symbols-outlined font-black">monetization_on</span>
                            <span>{exercise?.rewardPoints ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercise Content Area */}
            <div className="animate-in fade-in zoom-in-95 duration-500">
                {renderExerciseComponent()}
            </div>

            {/* Bottom Controls */}
            <div className="mt-16 flex justify-center">
                {!result ? (
                    <button
                        id="check-btn"
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || isSubmitting}
                        className={`
                            px-12 py-6 rounded-[2rem] font-black text-2xl shadow-xl transition-all duration-300 flex items-center gap-4
                            ${selectedAnswer && !isSubmitting
                                ? 'bg-gradient-to-br from-primary to-violet-700 text-white hover:scale-110 active:scale-95 border-b-8 border-violet-900'
                                : 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed border-b-4 border-gray-300 dark:border-transparent scale-90 opacity-50'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <span className="material-symbols-outlined animate-spin font-black">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined font-black">rocket_launch</span>
                        )}
                        {isSubmitting ? 'Enviando...' : '¡Comprobar!'}
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-8 animate-in slide-in-from-bottom duration-500">
                        <div className={`
                            px-10 py-6 rounded-[2.5rem] border-4 flex items-center gap-6 shadow-2xl
                            ${result.isCorrect
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : 'bg-red-50 border-red-500 text-red-700'}
                        `}>
                            <div className={`size-16 rounded-full flex items-center justify-center text-white shadow-lg ${result.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                <span className="material-symbols-outlined text-4xl font-black">
                                    {result.isCorrect ? 'mood' : 'sentiment_very_dissatisfied'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black uppercase tracking-tight">
                                    {result.isCorrect ? '¡Excelente Trabajo!' : '¡Buen Intento!'}
                                </span>
                                <span className="text-sm font-bold opacity-70">
                                    {result.isCorrect
                                        ? `Has ganado ${result.pointsEarned || 0} estrellas`
                                        : 'Vuelve a intentarlo para ganar más estrellas'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            className="px-14 py-6 bg-gradient-to-r from-indigo-600 to-primary text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-4 border-b-8 border-indigo-900"
                        >
                            <span>{currentQuestionIndex + 1 < totalQuestions ? 'Siguiente Pregunta' : 'Terminar Misión'}</span>
                            <span className="material-symbols-outlined font-black">east</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
