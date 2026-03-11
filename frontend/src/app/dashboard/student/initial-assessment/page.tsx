'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentApi, Exercise } from '@/lib/api/assessment';

export default function InitialAssessmentPage() {
    const router = useRouter();
    const [stage, setStage] = useState<'welcome' | 'assessment' | 'complete'>('welcome');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    // Mock userId - en producción vendría de auth context
    const userId = 1;

    useEffect(() => {
        checkIfAlreadyCompleted();
    }, []);

    const checkIfAlreadyCompleted = async () => {
        try {
            const completed = await assessmentApi.isComplete(userId);
            if (completed) {
                router.push('/dashboard/student');
            }
        } catch (error) {
            console.error('Error checking completion:', error);
        }
    };

    const startAssessment = async () => {
        setLoading(true);
        try {
            await assessmentApi.startAssessment(userId);
            const { exercises: exerciseList } = await assessmentApi.getExercises(userId);
            setExercises(exerciseList);
            setStage('assessment');
        } catch (error) {
            console.error('Error starting assessment:', error);
            alert('Error al iniciar la evaluación. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (isCorrect: boolean) => {
        if (currentIndex >= exercises.length) return;

        setLoading(true);
        try {
            const exercise = exercises[currentIndex];
            await assessmentApi.submitAnswer(userId, exercise.id, isCorrect);

            if (isCorrect) {
                setScore(score + 1);
            }

            // Actualizar progreso
            const progressData = await assessmentApi.getProgress(userId);
            setProgress(progressData.progressPercentage);

            // Siguiente ejercicio o finalizar
            if (currentIndex + 1 < exercises.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setStage('complete');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        } finally {
            setLoading(false);
        }
    };

    const finishAssessment = () => {
        router.push('/dashboard/student');
    };

    if (stage === 'welcome') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
                    <div className="mb-8">
                        <div className="text-6xl mb-4">🎮</div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            ¡Bienvenido a BestKids!
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Antes de empezar, vamos a conocer tu nivel de aprendizaje
                        </p>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-purple-800 mb-4">
                            📝 Evaluación Inicial
                        </h2>
                        <ul className="text-left text-gray-700 space-y-3">
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">✨</span>
                                <span>Responde 15-20 preguntas divertidas</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">🎯</span>
                                <span>Conoceremos tus fortalezas</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">🏆</span>
                                <span>Al terminar, ¡desbloquearás tu avatar!</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">⏱️</span>
                                <span>Toma solo 10-15 minutos</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={startAssessment}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Preparando...' : '¡Comenzar Evaluación! 🚀'}
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'assessment') {
        const currentExercise = exercises[currentIndex];
        const progressPercent = ((currentIndex + 1) / exercises.length) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="bg-white rounded-full h-4 mb-8 overflow-hidden shadow-lg">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold text-gray-600">
                                Pregunta {currentIndex + 1} de {exercises.length}
                            </span>
                            <span className="text-lg font-bold text-purple-600">
                                {Math.round(progressPercent)}% Completado
                            </span>
                        </div>

                        {currentExercise && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                    {currentExercise.title}
                                </h2>

                                {/* Placeholder for exercise content */}
                                <div className="bg-gray-50 rounded-2xl p-8 mb-8 min-h-[300px] flex items-center justify-center">
                                    <p className="text-gray-500 text-center">
                                        [Aquí iría el contenido del ejercicio interactivo]
                                        <br />
                                        <span className="text-sm">Exercise ID: {currentExercise.id}</span>
                                    </p>
                                </div>

                                {/* Mock answer buttons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        disabled={loading}
                                        className="bg-green-500 text-white text-xl font-bold py-6 rounded-2xl hover:bg-green-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                                    >
                                        ✓ Correcto (Demo)
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        disabled={loading}
                                        className="bg-red-500 text-white text-xl font-bold py-6 rounded-2xl hover:bg-red-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                                    >
                                        ✗ Incorrecto (Demo)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'complete') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
                    <div className="mb-8 animate-bounce">
                        <div className="text-8xl mb-4">🎉</div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        ¡Felicitaciones!
                    </h1>

                    <p className="text-2xl text-gray-600 mb-8">
                        Has completado la evaluación inicial
                    </p>

                    <div className="bg-yellow-50 rounded-2xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-yellow-800 mb-4">
                            🏆 Avatar Desbloqueado
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            ¡Ahora puedes elegir tu avatar y comenzar a aprender jugando!
                        </p>
                        <div className="text-6xl mb-4">🦁</div>
                        <p className="text-sm text-gray-500">
                            Tu puntuación: {score} / {exercises.length}
                        </p>
                    </div>

                    <button
                        onClick={finishAssessment}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-2xl font-bold py-6 px-16 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        ¡Ir a Mi Dashboard! 🚀
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
