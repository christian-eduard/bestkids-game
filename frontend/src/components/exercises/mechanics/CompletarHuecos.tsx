"use client";
import React, { useState } from 'react';
import { Send, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Gap {
    id: string;
    correctAnswer: string;
    hint?: string;
}

interface Props {
    exercise: {
        instruction: string;
        content: {
            text: string; // e.g. "El [gap1] es de color [gap2]"
            gaps: Gap[];
            imageUrl?: string;
        }
    };
    onAnswer: (answer: Record<string, string>, timeMs: number) => void;
}

export default function CompletarHuecos({ exercise, onAnswer }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const startTime = React.useRef(Date.now());

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        onAnswer(answers, timeMs);
    };

    // Parsear el texto para insertar inputs
    const renderContent = () => {
        const parts = exercise.content.text.split(/(\[gap\d+\])/);
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
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-12">
            <h2 className="text-2xl font-bold bg-white px-8 py-4 rounded-3xl shadow-sm text-center">
                {exercise.instruction}
            </h2>

            <div className="bg-white p-12 rounded-[64px] shadow-2xl border-4 border-blue-50 flex flex-col items-center gap-8 w-full">
                {exercise.content.imageUrl && (
                    <img src={exercise.content.imageUrl} className="h-48 rounded-3xl object-contain" alt="" />
                )}

                <div className="text-3xl leading-relaxed text-gray-700 font-medium text-center w-full">
                    {renderContent()}
                </div>
            </div>

            <div className="fixed bottom-12 right-12">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleConfirm}
                    disabled={Object.keys(answers).length < exercise.content.gaps.length}
                    className={`p-6 rounded-full shadow-2xl transition-all ${Object.keys(answers).length === exercise.content.gaps.length ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                >
                    <Send size={32} fill="currentColor" />
                </motion.button>
            </div>
        </div>
    );
}
