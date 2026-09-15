"use client";
import React, { useState } from 'react';
import { Volume2, CheckCircle2, Play, Pause, Square, Check, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

interface Option {
    id: string;
    imageUrl?: string;
    text?: string;
    isCorrect: boolean;
}

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            options: Option[];
            multipleCorrect: boolean;
            instructionSize?: 'sm' | 'md' | 'lg';
        }
    };
    onAnswer: (answer: any, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function SeñalarImagen({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    const toggleAudio = () => {
        if (!exercise.instructionAudioUrl) return;

        if (audioRef.current) {
            // If audio is currently playing, stop it
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reset to start
            audioRef.current = null;
            setPlayingInstruction(false);
        } else {
            // If no audio is playing, start a new one
            const audio = new Audio(exercise.instructionAudioUrl);
            audioRef.current = audio;
            audio.play().catch(e => console.error("Error playing audio:", e));
            setPlayingInstruction(true);
            audio.onended = () => {
                setPlayingInstruction(false);
                audioRef.current = null;
            };
        }
    };

    React.useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleOption = (id: string) => {
        let next: string[];
        if (exercise.content.multipleCorrect) {
            next = selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id];
        } else {
            next = [id];
        }
        setSelectedIds(next);
        if (onAnswerChange) {
            onAnswerChange(exercise.content.multipleCorrect ? next : next[0]);
        }
    };

    const handleConfirm = () => {
        if (selectedIds.length === 0) return;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        const timeMs = Date.now() - startTime.current;
        onAnswer(exercise.content.multipleCorrect ? selectedIds : selectedIds[0], timeMs);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-6">
            {/* Header: Instrucción y Audio */}
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

            {/* Grid de Opciones */}
            <div className={`grid grid-cols-2 ${exercise.content.options.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 w-full max-w-5xl justify-center`}>
                {exercise.content.options.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleOption(option.id)}
                        className={`relative cursor-pointer bg-white p-4 rounded-[32px] border-4 transition-all aspect-square flex items-center justify-center shadow-lg ${selectedIds.includes(option.id)
                            ? 'border-purple-500 shadow-purple-200'
                            : 'border-blue-100 hover:border-blue-200'
                            }`}
                    >
                        <div className="flex flex-col items-center justify-between h-full w-full gap-3">
                            {option.imageUrl ? (
                                <div className="flex-1 flex items-center justify-center w-full min-h-0">
                                    <img 
                                        src={resolveMediaUrl(option.imageUrl)}
                                        className="max-w-full max-h-full object-contain rounded-2xl p-1" 
                                        alt={option.text || ""} 
                                    />
                                </div>
                            ) : null}

                            {option.text ? (
                                <div className={`${option.imageUrl ? 'w-full py-2.5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-sm' : ''} text-center`}>
                                    <span className={`${option.imageUrl ? 'text-lg px-2' : 'text-4xl px-4'} font-black text-slate-800 uppercase tracking-tight block truncate`}>
                                        {option.text}
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {selectedIds.includes(option.id) && (
                            <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-1 shadow-lg">
                                <Check size={20} strokeWidth={4} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Botón Confirmar */}
            {!embedded && (
                <div className="fixed bottom-12 right-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConfirm}
                        disabled={selectedIds.length === 0}
                        className={`p-6 rounded-full shadow-2xl transition-all ${selectedIds.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                    >
                        <Send size={32} fill="currentColor" />
                    </motion.button>
                </div>
            )}
        </div>
    );
}
