"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Pipette, Volume2, Play, Pause, Square } from 'lucide-react';
import ExerciseStimulus from '../shared/ExerciseStimulus';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            items: Array<{ id: string, imageUrl: string, label: string }>;
            colors: string[];
            correctPairs: Array<{ itemId: string, color: string }>;
        }
    };
    onAnswer: (answer: Array<{ itemId: string, color: string }>, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function Pintar({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    // Bubble up answers
    React.useEffect(() => {
        if (embedded && onAnswerChange) {
            const answer = Object.entries(assignments).map(([itemId, color]) => ({ itemId, color }));
            onAnswerChange(answer.length === exercise.content.items.length ? answer : null);
        }
    }, [assignments, exercise.content.items.length, embedded, onAnswerChange]);

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

    const handleItemClick = (itemId: string) => {
        if (!selectedColor) return;
        setAssignments(prev => ({ ...prev, [itemId]: selectedColor }));
    };

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        const answer = Object.entries(assignments).map(([itemId, color]) => ({ itemId, color }));
        onAnswer(answer, timeMs);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-6">
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

            <div className="flex gap-12 w-full">
                {/* Elementos a colorear */}
                <div className="flex-1 grid grid-cols-2 gap-8 bg-white p-10 rounded-[64px] shadow-xl border-b-8 border-gray-100">
                    {exercise.content.items.map(item => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleItemClick(item.id)}
                            className="relative cursor-pointer aspect-square rounded-[40px] border-4 border-gray-100 p-6 flex flex-col items-center justify-center transition-all group"
                            style={{ backgroundColor: assignments[item.id] || '#F9FAFB' }}
                        >
                            <img
                                src={resolveMediaUrl(item.imageUrl)}
                                className={`w-full h-full object-contain filter ${assignments[item.id] ? 'brightness-110 contrast-125' : 'grayscale-0'}`}
                                alt=""
                            />
                            {selectedColor && !assignments[item.id] && (
                                <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Pipette size={48} className="text-gray-400 animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Paleta de colores */}
                <div className="w-32 flex flex-col gap-4 bg-white p-6 rounded-full shadow-lg border-2 border-gray-50 self-center">
                    {exercise.content.colors.map(color => (
                        <motion.button
                            key={color}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedColor(color)}
                            className={`w-16 h-16 rounded-full border-4 shadow-md transition-all ${selectedColor === color ? 'border-purple-500 scale-110 ring-4 ring-purple-100' : 'border-white'
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {!embedded && (
                <div className="fixed bottom-12 right-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConfirm}
                        disabled={Object.keys(assignments).length < exercise.content.items.length}
                        className={`p-6 rounded-full shadow-2xl transition-all ${Object.keys(assignments).length === exercise.content.items.length ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                    >
                        <Send size={32} fill="currentColor" />
                    </motion.button>
                </div>
            )}
        </div>
    );
}
