"use client";
import React, { useState } from 'react';
import { Volume2, Check, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Option {
    id: string;
    audioUrl: string;
    label?: string;
    imageUrl?: string;
}

interface Props {
    exercise: {
        instruction: string;
        content: {
            stimulusText?: string;
            stimulusImageUrl?: string;
            options: Option[];
            multipleCorrect: boolean;
        }
    };
    onAnswer: (answer: any, timeMs: number) => void;
}

export default function AudioSeleccion({ exercise, onAnswer }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const startTime = React.useRef(Date.now());
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Stop audio on unmount
    React.useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playAudio = (id: string, url: string) => {
        // Toggle off if same id
        if (playingId === id && audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setPlayingId(null);
            return;
        }

        // Stop previous
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setPlayingId(id);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
            setPlayingId(null);
            audioRef.current = null;
        };
        audio.play().catch(err => {
            console.error("Audio play failed:", err);
            setPlayingId(null);
            audioRef.current = null;
        });
    };

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

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-12">
            <h2 className="text-2xl font-bold bg-white px-8 py-4 rounded-3xl shadow-sm text-center">
                {exercise.instruction}
            </h2>

            {/* Estímulo Central */}
            {(exercise.content.stimulusText || exercise.content.stimulusImageUrl) && (
                <div className="bg-white p-10 rounded-[64px] shadow-2xl border-4 border-blue-50 flex flex-col items-center gap-4">
                    {exercise.content.stimulusImageUrl && <img src={exercise.content.stimulusImageUrl} className="h-48" alt="" />}
                    {exercise.content.stimulusText && <span className="text-6xl font-black text-purple-600 underline decoration-orange-300 underline-offset-8">{exercise.content.stimulusText}</span>}
                </div>
            )}

            {/* Opciones de Audio */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {exercise.content.options.map(option => (
                    <div key={option.id} className="flex flex-col items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playAudio(option.id, option.audioUrl)}
                            className={`p-10 rounded-full shadow-lg transition-all relative ${playingId === option.id ? 'bg-orange-500 text-white animate-pulse' : 'bg-white text-orange-500 hover:bg-orange-50'
                                }`}
                        >
                            <Volume2 size={48} />
                            {playingId === option.id && (
                                <div className="absolute -inset-2 border-4 border-orange-500 rounded-full animate-ping opacity-25" />
                            )}
                        </motion.button>

                        <motion.button
                            onClick={() => toggleOption(option.id)}
                            className={`w-full p-4 rounded-2xl border-4 transition-all font-bold ${selectedIds.includes(option.id)
                                ? 'bg-purple-600 border-purple-800 text-white'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200'
                                }`}
                        >
                            {selectedIds.includes(option.id) ? 'SELECCIONADO' : (option.label || 'OPCIÓN')}
                        </motion.button>
                    </div>
                ))}
            </div>

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
