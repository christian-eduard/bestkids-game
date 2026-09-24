"use client";
import React, { useState } from 'react';
import { Volume2, Send, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

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
            stimulus?: { type: 'image' | 'text' | 'audio' | 'grid' | 'video', value: any, size?: 'sm' | 'md' | 'lg' };
            options: Option[];
            multipleCorrect?: boolean;
            instructionSize?: 'sm' | 'md' | 'lg';
        }
    };
    onAnswer: (answer: string | string[], timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function OpcionMultiple({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const multipleCorrect = !!exercise.content.multipleCorrect || exercise.content.options.filter(o => o.isCorrect).length > 1;
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    // Shuffle options once on mount (Fisher-Yates) so the correct answer isn't always in the same position
    const [shuffledOptions] = useState(() => {
        const opts = [...exercise.content.options];
        for (let i = opts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return opts;
    });

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

    const handleSelectOption = (id: string) => {
        const next = multipleCorrect
            ? selectedIds.includes(id) ? selectedIds.filter(selected => selected !== id) : [...selectedIds, id]
            : [id];
        setSelectedIds(next);
        if (onAnswerChange) {
            onAnswerChange(multipleCorrect ? next : next[0]);
        }
    };

    const handleConfirm = () => {
        if (selectedIds.length === 0) return;
        const timeMs = Date.now() - startTime.current;
        onAnswer(multipleCorrect ? selectedIds : selectedIds[0], timeMs);
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

            {/* Grid de Estímulos A-F si el tipo es grid */}
            {exercise.content.stimulus?.type === 'grid' && (
                <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-[40px] shadow-inner border-4 border-blue-50">
                    {(exercise.content.stimulus.value as any[]).map((item, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                            <span className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <img src={resolveMediaUrl(item)} className="w-full h-full object-contain" alt={`Ref ${idx}`} />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 w-full max-w-lg">
                {shuffledOptions.map((option) => (
                    <motion.button
                        key={option.id}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOption(option.id)}
                        aria-pressed={selectedIds.includes(option.id)}
                        className={`p-6 rounded-2xl border-b-8 text-left font-bold text-xl transition-all flex items-center gap-4 ${selectedIds.includes(option.id)
                                ? 'bg-purple-600 text-white border-purple-800'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                            }`}
                    >
                        <div className={`w-8 h-8 ${multipleCorrect ? 'rounded-lg' : 'rounded-full'} border-4 flex items-center justify-center ${selectedIds.includes(option.id) ? 'border-white' : 'border-purple-200'
                            }`}>
                            {selectedIds.includes(option.id) && <div className={`w-3 h-3 bg-white ${multipleCorrect ? 'rounded-sm' : 'rounded-full'}`} />}
                        </div>
                        {option.imageUrl && <img src={resolveMediaUrl(option.imageUrl)} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                        {option.text}
                    </motion.button>
                ))}
            </div>

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
