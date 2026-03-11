"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ChevronRight, Star, X, Trophy, ArrowRight } from 'lucide-react';

// Import Mechanics
import SeñalarImagen from './mechanics/SeñalarImagen';
import OpcionMultiple from './mechanics/OpcionMultiple';
import VerdaderoFalso from './mechanics/VerdaderoFalso';
import ArrastrarSilabas from './mechanics/ArrastrarSilabas';
import UnirLineas from './mechanics/UnirLineas';
import ClasificarGrupos from './mechanics/ClasificarGrupos';
import Pintar from './mechanics/Pintar';
import TecladoVirtual from './mechanics/TecladoVirtual';
import AudioSeleccion from './mechanics/AudioSeleccion';
import CompletarHuecos from './mechanics/CompletarHuecos';

interface Exercise {
    id: number;
    type: string;
    instruction: string;
    content: any;
}

interface Props {
    exercises: Exercise[];
    unitTitle: string;
    onFinish: (results: any) => void;
    isPreview?: boolean;
}

export default function ExerciseEngine({ exercises, unitTitle, onFinish, isPreview = false }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const currentExercise = exercises[currentIndex];

    const handleAnswer = async (answer: any, timeMs: number) => {
        if (isPreview) {
            // Lógica local para preview — No enviar a la API
            const isCorrect = validateAnswerLocal(currentExercise, answer);
            if (isCorrect) {
                setShowFeedback('correct');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A855F7', '#60A5FA', '#FACC15']
                });
            } else {
                setShowFeedback('incorrect');
            }
            setResults(prev => [...prev, { isCorrect, xpEarned: isCorrect ? 10 : 0, exerciseId: currentExercise.id }]);
            setTimeout(() => {
                setShowFeedback(null);
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsFinished(true);
                }
            }, 2000);
            return;
        }

        // Lógica real — Enviar al backend
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    exerciseId: currentExercise.id,
                    answer,
                    responseTimeMs: timeMs
                })
            });

            const data = await res.json();

            if (data.isCorrect) {
                setShowFeedback('correct');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A855F7', '#60A5FA', '#FACC15']
                });
            } else {
                setShowFeedback('incorrect');
            }

            setResults(prev => [...prev, { ...data, exerciseId: currentExercise.id }]);

            // Esperar feedback y pasar al siguiente
            setTimeout(() => {
                setShowFeedback(null);
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsFinished(true);
                }
            }, 2000);

        } catch (err) {
            console.error("Error submitting answer", err);
        }
    };

    const renderMechanic = () => {
        const props = { exercise: currentExercise, onAnswer: handleAnswer };

        switch (currentExercise.type) {
            case 'SEÑALAR_IMAGEN': return <SeñalarImagen {...props} />;
            case 'OPCION_MULTIPLE': return <OpcionMultiple {...props} />;
            case 'VERDADERO_FALSO': return <VerdaderoFalso {...props} />;
            case 'ARRASTRAR_SILABAS': return <ArrastrarSilabas {...props} />;
            case 'UNIR_LINEAS': return <UnirLineas {...props} />;
            case 'CLASIFICAR_GRUPOS': return <ClasificarGrupos {...props} />;
            case 'PINTAR': return <Pintar {...props} />;
            case 'TECLADO_VIRTUAL': return <TecladoVirtual {...props} />;
            case 'AUDIO_SELECCION': return <AudioSeleccion {...props} />;
            case 'COMPLETAR_HUECOS': return <CompletarHuecos {...props} />;
            default: return <div className="p-10 bg-red-50 text-red-500 rounded-3xl">Mecánica no implementada: {currentExercise.type}</div>;
        }
    };

    if (isFinished) {
        const correctCount = results.filter(r => r.isCorrect).length;
        const totalXp = results.reduce((sum, r) => sum + (r.xpEarned || 0), 0);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-12 bg-white rounded-[64px] shadow-2xl border-b-[16px] border-purple-100"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
                    <Trophy size={120} className="text-yellow-400 relative z-10" strokeWidth={1} />
                </div>

                <h2 className="text-5xl font-black text-gray-800 mt-8 mb-2">¡UNIDAD COMPLETADA!</h2>
                <p className="text-xl text-gray-400 font-bold uppercase tracking-widest">{unitTitle}</p>

                <div className="grid grid-cols-2 gap-6 w-full mt-12">
                    <div className="bg-purple-50 p-8 rounded-[40px] flex flex-col items-center border-b-8 border-purple-200">
                        <span className="text-4xl font-black text-purple-600">{correctCount}/{exercises.length}</span>
                        <span className="text-xs font-bold text-purple-400 uppercase mt-2">Correctas</span>
                    </div>
                    <div className="bg-orange-50 p-8 rounded-[40px] flex flex-col items-center border-b-8 border-orange-200">
                        <span className="text-4xl font-black text-orange-500">+{totalXp} XP</span>
                        <span className="text-xs font-bold text-orange-400 uppercase mt-2">Ganados</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onFinish(results)}
                    className="mt-12 w-full py-6 bg-green-500 hover:bg-green-600 text-white rounded-[32px] font-black text-2xl shadow-xl flex items-center justify-center gap-4 border-b-8 border-green-700"
                >
                    CONTINUAR <ArrowRight size={32} />
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="w-full relative min-h-[90vh]">
            {/* Header / Progreso */}
            <div className="fixed top-0 left-0 right-0 p-6 z-50">
                <div className="max-w-5xl mx-auto flex items-center gap-6">
                    <button
                        onClick={() => onFinish(null)}
                        className="p-4 bg-white rounded-2xl shadow-md hover:scale-110 transition-transform"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>

                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner border-4 border-white">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                        />
                    </div>

                    <div className="bg-white px-6 py-3 rounded-2xl shadow-md font-black text-purple-600 border-b-4 border-purple-100 italic">
                        {currentIndex + 1} / {exercises.length}
                    </div>
                </div>
            </div>

            {/* Render Mechanic Container */}
            <div className="pt-32 pb-32 w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        className="w-full"
                    >
                        {renderMechanic()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Overlays de Feedback */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm ${showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-white p-16 rounded-[80px] shadow-2xl flex flex-col items-center border-[20px] border-white"
                        >
                            {showFeedback === 'correct' ? (
                                <>
                                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
                                        <Star size={64} fill="white" />
                                    </div>
                                    <h3 className="text-5xl font-black text-green-500 italic">¡GENIAL!</h3>
                                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-tighter">¡Sigue así!</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white mb-6">
                                        <X size={64} strokeWidth={4} />
                                    </div>
                                    <h3 className="text-5xl font-black text-red-500 italic">¡ÁNIMO!</h3>
                                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-tighter">Vuelve a intentarlo</p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/** 
 * Lógica de validación local (solo para preview) 
 * Debe estar sincronizada con el backend 
 */
function validateAnswerLocal(exercise: any, answer: any): boolean {
    const { type, content } = exercise;
    if (!content) return false;

    switch (type) {
        case 'SEÑALAR_IMAGEN':
        case 'AUDIO_SELECCION': {
            const correctIds = (content.options || []).filter((o: any) => o.isCorrect).map((o: any) => o.id);
            if (content.multipleCorrect) {
                return Array.isArray(answer) &&
                    answer.length === correctIds.length &&
                    answer.every((id: any) => correctIds.includes(id));
            }
            return answer === correctIds[0];
        }
        case 'OPCION_MULTIPLE': {
            const correctId = (content.options || []).find((o: any) => o.isCorrect)?.id;
            return answer === correctId;
        }
        case 'VERDADERO_FALSO':
            return answer === content.correctAnswer;
        case 'TECLADO_VIRTUAL':
            return String(answer).toLowerCase().trim() === String(content.correctSyllable).toLowerCase().trim();
        case 'ARRASTRAR_SILABAS':
            return JSON.stringify(answer) === JSON.stringify((content.items || []).map((i: any) => i.word));
        case 'UNIR_LINEAS': {
            const pairs = answer as Array<[string, string]>;
            const correctPairs = content.correctPairs || [];
            return Array.isArray(pairs) && pairs.length === correctPairs.length &&
                pairs.every(p => correctPairs.some((cp: any) => cp[0] === p[0] && cp[1] === p[1]));
        }
        case 'CLASIFICAR_GRUPOS': {
            const assignments = answer as Array<{ itemId: string, groupId: string }>;
            return Array.isArray(assignments) && assignments.every((a: any) => {
                const item = (content.items || []).find((i: any) => i.id === a.itemId);
                return item && item.correctGroupId === a.groupId;
            });
        }
        case 'PINTAR': {
            const assignments = answer as Array<{ itemId: string, color: string }>;
            return Array.isArray(assignments) && assignments.every((a: any) => {
                const pair = (content.correctPairs || []).find((p: any) => p.itemId === a.itemId);
                return pair && pair.color === a.color;
            });
        }
        case 'COMPLETAR_HUECOS': {
            const answers = answer as Record<string, string>;
            return Array.isArray(content.gaps) && content.gaps.every((g: any) =>
                answers[g.id]?.toLowerCase().trim() === g.correctAnswer.toLowerCase().trim()
            );
        }
        default:
            return true;
    }
}
