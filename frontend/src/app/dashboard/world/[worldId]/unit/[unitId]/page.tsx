"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseService, Exercise } from '@/services/exercises.service';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';

export default function UnitPage({ params: paramsPromise }: { params: Promise<{ worldId: string; unitId: string }> }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [feedback, setFeedback] = useState<any>(null);
    const [sessionXp, setSessionXp] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const difficulty = await ExerciseService.getAdaptiveDifficulty(params.unitId);
                const data = await ExerciseService.getExercisesByUnit(params.unitId, difficulty);
                setExercises(data);
            } catch (err) {
                console.error("Error loading exercises", err);
            } finally {
                setLoading(false);
            }
        };
        loadExercises();
    }, [params.unitId]);

    const handleAnswer = async (answer: string, timeMs: number) => {
        const exercise = exercises[currentIndex];
        try {
            const result = await ExerciseService.submitAnswer({
                exerciseId: exercise.id,
                answer,
                responseTimeMs: timeMs
            });

            setFeedback(result);

            if (result.isCorrect) {
                setSessionXp(prev => prev + result.xpEarned);
                setCorrectCount(prev => prev + 1);

                setTimeout(() => {
                    setFeedback(null);
                    if (currentIndex < exercises.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        setCompleted(true);
                    }
                }, 2000);
            } else {
                // Wait before allowing retry
                setTimeout(() => {
                    setFeedback(null);
                }, 2000);
            }
        } catch (err) {
            console.error("Error submitting answer", err);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="animate-bounce size-12 bg-primary rounded-full shadow-lg" />
        </div>
    );

    if (completed) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/10 to-transparent">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-card-dark p-10 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border-b-[12px] border-primary/20"
            >
                <div className="text-8xl mb-6">🏆</div>
                <h2 className="text-4xl font-black mb-4">¡UNIDAD COMPLETADA!</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-primary/5 p-4 rounded-2xl">
                        <p className="text-sm font-bold opacity-50 uppercase">Puntos Ganados</p>
                        <p className="text-3xl font-black text-primary">+{sessionXp} XP</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-2xl">
                        <p className="text-sm font-bold opacity-50 uppercase">Correctos</p>
                        <p className="text-3xl font-black text-text-main dark:text-white">{correctCount} / {exercises.length}</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/dashboard/worlds/${params.worldId}`)}
                    className="w-full bg-primary text-white p-6 rounded-2xl font-black text-2xl hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                >
                    ¡VOLVER AL MAPA!
                </button>
            </motion.div>
        </div>
    );

    const currentExercise = exercises[currentIndex];

    return (
        <div className="w-full min-h-screen p-4 md:p-8 flex flex-col items-center">
            {/* Header Bar */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <button
                    onClick={() => router.back()}
                    className="size-12 rounded-full bg-white dark:bg-card-dark shadow-md flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex-1 mx-8 h-4 bg-gray-100 dark:bg-card-dark rounded-full overflow-hidden shadow-inner border-2 border-white">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(244,37,244,0.5)]"
                    />
                </div>

                <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-lg">
                    ✨ <span>{sessionXp}</span>
                </div>
            </div>

            {/* Exercise Content */}
            <div className="w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {currentExercise ? (
                            <ExerciseEngine
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                                feedback={feedback}
                            />
                        ) : (
                            <div className="text-center p-20 opacity-50 font-bold">No hay ejercicios para esta dificultad.</div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
