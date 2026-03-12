"use client";
import React, { useState } from 'react';
import { Volume2, Check, Send, Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Option {
    id: string;
    audioUrl: string;
    label?: string;
    imageUrl?: string;
}

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            options: Option[];
            multipleCorrect: boolean;
        }
    };
    onAnswer: (answer: any, timeMs: number) => void;
}

export default function AudioSeleccion({ exercise, onAnswer }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const startTime = React.useRef(Date.now());
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const toggleInstructionAudio = () => {
        if (!exercise.instructionAudioUrl) return;
        if (playingInstruction && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setPlayingInstruction(false);
            setPlayingId(null);
        } else {
            // Stop current options audio
            if (audioRef.current) audioRef.current.pause();
            
            const audio = new Audio(exercise.instructionAudioUrl);
            audioRef.current = audio;
            audio.play().catch(e => console.error(e));
            setPlayingInstruction(true);
            setPlayingId('instruction');
            audio.onended = () => {
                setPlayingInstruction(false);
                setPlayingId(null);
                audioRef.current = null;
            };
        }
    };

    const playAudio = (id: string, url: string) => {
        // Toggle off if same id
        if (playingId === id && audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setPlayingId(null);
            setPlayingInstruction(false);
            return;
        }

        // Stop previous
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setPlayingId(id);
        setPlayingInstruction(false);
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
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] shadow-sm border-2 border-purple-100 max-w-2xl">
                    <h2 className={`font-black text-gray-700 leading-tight ${exercise.content.instructionSize === 'sm' ? 'text-lg' : exercise.content.instructionSize === 'lg' ? 'text-4xl' : 'text-2xl'}`}>
                        {exercise.instruction}
                    </h2>
                    {exercise.instructionAudioUrl && (
                        <button 
                            onClick={toggleInstructionAudio}
                            className={`p-4 rounded-2xl transition-all ${playingInstruction ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                        >
                            {playingInstruction ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
                        </button>
                    )}
                </div>

                <ExerciseStimulus stimulus={exercise.content.stimulus} />
            </div>

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
