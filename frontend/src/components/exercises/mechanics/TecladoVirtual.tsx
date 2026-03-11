"use client";
import React, { useState } from 'react';
import { Volume2, Delete, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    exercise: {
        instruction: string;
        content: {
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
    const startTime = React.useRef(Date.now());

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
            <h2 className="text-2xl font-bold bg-white px-8 py-4 rounded-3xl shadow-sm text-gray-700">
                {exercise.instruction}
            </h2>

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
