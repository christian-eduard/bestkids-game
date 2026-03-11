"use client";
import React, { useState } from 'react';
import { Check, Volume2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

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
            stimulus?: { type: 'image' | 'text' | 'audio', value: string };
            options: Option[];
            multipleCorrect: boolean;
        }
    };
    onAnswer: (answer: any, timeMs: number) => void;
}

export default function SeñalarImagen({ exercise, onAnswer }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const startTime = React.useRef(Date.now());
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleOption = (id: string) => {
        if (exercise.content.multipleCorrect) {
            setSelectedIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
        } else {
            setSelectedIds([id]);
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

    const playAudio = () => {
        if (!exercise.instructionAudioUrl) return;

        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current = null;
            return;
        }

        const audio = new Audio(exercise.instructionAudioUrl);
        audioRef.current = audio;
        audio.onended = () => { audioRef.current = null; };
        audio.play().catch(e => console.error(e));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-8">
            {/* Instrucción */}
            <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl shadow-sm border-2 border-purple-100">
                <h2 className="text-2xl font-bold text-gray-700">{exercise.instruction}</h2>
                {exercise.instructionAudioUrl && (
                    <button onClick={playAudio} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:scale-110 transition-transform">
                        <Volume2 size={24} />
                    </button>
                )}
            </div>

            {/* Estímulo (si existe) */}
            {exercise.content.stimulus && (
                <div className="bg-white p-4 rounded-3xl shadow-md border-4 border-green-200">
                    {exercise.content.stimulus.type === 'image' && (
                        <img src={exercise.content.stimulus.value} className="max-h-40 rounded-2xl" alt="Estímulo" />
                    )}
                    {exercise.content.stimulus.type === 'text' && (
                        <p className="text-4xl font-black text-purple-600 px-8 underline decoration-green-300 underline-offset-8">
                            {exercise.content.stimulus.value}
                        </p>
                    )}
                </div>
            )}

            {/* Grid de Opciones */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
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
                                        src={option.imageUrl} 
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
        </div>
    );
}
