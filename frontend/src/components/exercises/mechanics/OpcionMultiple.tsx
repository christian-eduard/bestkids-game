"use client";
import React, { useState } from 'react';
import { Volume2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface Option {
    id: string;
    text?: string;
    imageUrl?: string;
    isCorrect: boolean;
}

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'grid', value: any };
            options: Option[];
        }
    };
    onAnswer: (answer: string, timeMs: number) => void;
}

export default function OpcionMultiple({ exercise, onAnswer }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const startTime = React.useRef(Date.now());

    const handleConfirm = () => {
        if (!selectedId) return;
        const timeMs = Date.now() - startTime.current;
        onAnswer(selectedId, timeMs);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl shadow-sm border-2 border-purple-100">
                <h2 className="text-2xl font-bold text-gray-700">{exercise.instruction}</h2>
                {exercise.instructionAudioUrl && (
                    <button className="p-2 bg-purple-100 text-purple-600 rounded-full hover:scale-110">
                        <Volume2 size={24} />
                    </button>
                )}
            </div>

            {/* Grid de Estímulos A-F si el tipo es grid */}
            {exercise.content.stimulus?.type === 'grid' && (
                <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-[40px] shadow-inner border-4 border-blue-50">
                    {(exercise.content.stimulus.value as any[]).map((item, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                            <span className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <img src={item} className="w-full h-full object-contain" alt={`Ref ${idx}`} />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 w-full max-w-lg">
                {exercise.content.options.map((option) => (
                    <motion.button
                        key={option.id}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedId(option.id)}
                        className={`p-6 rounded-2xl border-b-8 text-left font-bold text-xl transition-all flex items-center gap-4 ${selectedId === option.id
                                ? 'bg-purple-600 text-white border-purple-800'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${selectedId === option.id ? 'border-white' : 'border-purple-200'
                            }`}>
                            {selectedId === option.id && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                        {option.imageUrl && <img src={option.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                        {option.text}
                    </motion.button>
                ))}
            </div>

            <div className="fixed bottom-12 right-12">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleConfirm}
                    disabled={!selectedId}
                    className={`p-6 rounded-full shadow-2xl transition-all ${selectedId ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                >
                    <Send size={32} fill="currentColor" />
                </motion.button>
            </div>
        </div>
    );
}
