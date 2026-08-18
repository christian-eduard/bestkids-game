"use client";
import React, { useState } from 'react';
import { Send, Volume2, Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Gap {
    id: string;
    correctAnswer: string;
    hint?: string;
}

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            text: string; // e.g. "El [gap1] es de color [gap2]"
            gaps: Gap[];
            imageUrl?: string;
        }
    };
    onAnswer: (answer: Record<string, string>, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function CompletarHuecos({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    // Contar huecos según el formato del texto
    const gapCount = React.useMemo(() => {
        const text = exercise.content.text || '';
        if (/\[gap\d+\]/.test(text)) return (exercise.content.gaps || []).length;
        return (text.match(/___/g) || []).length;
    }, [exercise.content.text, exercise.content.gaps]);

    // Bubble up answers state
    React.useEffect(() => {
        if (embedded && onAnswerChange) {
            const filled = Object.values(answers).filter(v => v && v.trim() !== '').length;
            onAnswerChange(filled >= gapCount && gapCount > 0 ? answers : null);
        }
    }, [answers, gapCount, embedded, onAnswerChange]);

    const toggleAudio = () => {
        if (!exercise.instructionAudioUrl) return;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setPlayingInstruction(false);
        } else {
            const audio = new Audio(exercise.instructionAudioUrl);
            audioRef.current = audio;
            audio.play().catch(e => console.error(e));
            setPlayingInstruction(true);
            audio.onended = () => {
                setPlayingInstruction(false);
                audioRef.current = null;
            };
        }
    };

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        onAnswer(answers, timeMs);
    };

    // Parsear el texto para insertar inputs
    // Acepta dos formatos: [gap1] o ___ (tres guiones)
    const renderContent = () => {
        const text = exercise.content.text || '';

        // Si contiene marcadores [gapN], usar ese formato
        if (/\[gap\d+\]/.test(text)) {
            const parts = text.split(/(\[gap\d+\])/);
            return parts.map((part, idx) => {
                const gapMatch = part.match(/\[(gap\d+)\]/);
                if (gapMatch) {
                    const gapId = gapMatch[1];
                    return (
                        <input
                            key={idx}
                            type="text"
                            value={answers[gapId] || ''}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [gapId]: e.target.value }))}
                            className="inline-block w-32 mx-2 px-2 py-1 border-b-4 border-purple-300 focus:border-purple-600 outline-none text-center font-bold text-purple-700 bg-purple-50 rounded-t-lg transition-colors"
                            placeholder="..."
                        />
                    );
                }
                return <span key={idx}>{part}</span>;
            });
        }

        // Formato ___ (tres guiones bajos) — usado por el formulario del master
        const parts = text.split('___');
        return parts.map((part, idx) => {
            const gapId = `gap${idx}`;
            if (idx < parts.length - 1) {
                return (
                    <React.Fragment key={idx}>
                        <span>{part}</span>
                        <input
                            type="text"
                            value={answers[gapId] || ''}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [gapId]: e.target.value }))}
                            className="inline-block w-32 mx-2 px-2 py-1 border-b-4 border-purple-400 focus:border-purple-600 outline-none text-center font-bold text-purple-700 bg-purple-50 rounded-t-lg transition-colors text-xl"
                            placeholder="..."
                            autoFocus={idx === 0}
                        />
                    </React.Fragment>
                );
            }
            return <span key={idx}>{part}</span>;
        });
    };


    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-6">
            {embedded ? (
                exercise.content.stimulus ? (
                    <div className="mb-2">
                        <ExerciseStimulus stimulus={exercise.content.stimulus} />
                    </div>
                ) : null
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] shadow-sm border-2 border-purple-100 max-w-2xl">
                        <h2 className={`font-black text-gray-700 leading-tight ${exercise.content.instructionSize === 'sm' ? 'text-lg' : exercise.content.instructionSize === 'lg' ? 'text-4xl' : 'text-2xl'}`}>
                            {exercise.instruction}
                        </h2>
                        {exercise.instructionAudioUrl && (
                            <button 
                                onClick={toggleAudio}
                                className={`p-4 rounded-2xl transition-all ${playingInstruction ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                            >
                                {playingInstruction ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
                            </button>
                        )}
                    </div>

                    <ExerciseStimulus stimulus={exercise.content.stimulus} />
                </div>
            )}

            <div className="bg-white p-6 md:p-12 rounded-[48px] md:rounded-[64px] shadow-2xl border-4 border-blue-50 flex flex-col items-center gap-8 w-full">
                {exercise.content.imageUrl && (
                    <img src={exercise.content.imageUrl} className="h-48 rounded-3xl object-contain" alt="" />
                )}

                <div className="text-xl md:text-3xl leading-relaxed text-gray-700 font-medium text-center w-full">
                    {renderContent()}
                </div>
            </div>

            {!embedded && (
                <div className="fixed bottom-12 right-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConfirm}
                        disabled={Object.values(answers).filter(v => v && v.trim() !== '').length < gapCount}
                        className={`p-6 rounded-full shadow-2xl transition-all ${
                            Object.values(answers).filter(v => v && v.trim() !== '').length >= gapCount && gapCount > 0
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        <Send size={32} fill="currentColor" />
                    </motion.button>
                </div>
            )}
        </div>
    );
}
