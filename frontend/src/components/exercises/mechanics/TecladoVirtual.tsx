"use client";
import React, { useState } from 'react';
import { Volume2, Delete, Send, Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            audioUrl?: string;
            imageUrl?: string;
            totalSyllables: number;
            targetPosition: number; // 0-indexed
            correctSyllable: string;
        }
    };
    onAnswer: (answer: string, timeMs: number) => void;
}

export default function TecladoVirtual({ exercise, onAnswer }: Props) {
    const [inputValue, setInputValue] = useState("");
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

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

    // Teclado con sílabas comunes o letras según el grado
    const keyboard = ["BA", "BE", "BI", "BO", "BU", "PA", "PE", "PI", "PO", "PU", "MA", "ME", "MI", "MO", "MU"];

    const handleKey = (key: string) => {
        if (inputValue.length < 10) setInputValue(prev => prev + key);
    };

    const handleDelete = () => {
        setInputValue(prev => prev.slice(0, -1));
    };

    const handleConfirm = () => {
        if (!inputValue) return;
        const timeMs = Date.now() - startTime.current;
        onAnswer(inputValue, timeMs);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-8">
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

            <div className="relative group bg-white p-8 rounded-[48px] shadow-2xl border-b-8 border-gray-100 flex flex-col items-center gap-6">
                {exercise.content.imageUrl && (
                    <img src={exercise.content.imageUrl} className="h-40 rounded-3xl" alt="" />
                )}

                {exercise.content.audioUrl && (
                    <button
                        onClick={() => new Audio(exercise.content.audioUrl).play()}
                        className="p-4 bg-orange-100 text-orange-600 rounded-full hover:scale-110 shadow-md"
                    >
                        <Volume2 size={32} />
                    </button>
                )}

                {/* Huecos de sílabas */}
                <div className="flex gap-3">
                    {Array.from({ length: exercise.content.totalSyllables }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-16 h-20 rounded-2xl border-4 flex items-center justify-center text-2xl font-black ${idx === exercise.content.targetPosition
                                    ? 'border-orange-400 bg-orange-50 text-orange-600 ring-4 ring-orange-200 ring-offset-4'
                                    : 'border-gray-100 bg-gray-50 text-gray-400'
                                }`}
                        >
                            {idx === exercise.content.targetPosition ? inputValue : '?'}
                        </div>
                    ))}
                </div>
            </div>

            {/* Teclado Custom */}
            <div className="grid grid-cols-5 gap-3 bg-gray-100 p-6 rounded-[40px] shadow-inner">
                {keyboard.map(key => (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleKey(key)}
                        className="bg-white p-4 h-16 rounded-2xl shadow-sm font-bold text-xl text-gray-700 border-b-4 border-gray-200"
                    >
                        {key}
                    </motion.button>
                ))}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="col-span-2 bg-red-100 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-b-4 border-red-200"
                >
                    <Delete size={20} /> BORRAR
                </motion.button>
            </div>

            <div className="fixed bottom-12 right-12">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleConfirm}
                    disabled={!inputValue}
                    className={`p-6 rounded-full shadow-2xl transition-all ${inputValue ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                >
                    <Send size={32} fill="currentColor" />
                </motion.button>
            </div>
        </div>
    );
}
