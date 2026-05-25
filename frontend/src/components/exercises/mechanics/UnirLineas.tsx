"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Volume2, Square } from 'lucide-react';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Item { id: string; text?: string; imageUrl?: string; }

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            leftItems: Item[];
            rightItems: Item[];
            correctPairs: Array<[string, string]>;
        }
    };
    onAnswer: (answer: Array<[string, string]>, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function UnirLineas({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [connections, setConnections] = useState<Array<[string, string]>>([]);
    const [coords, setCoords] = useState<Record<string, { x: number, y: number }>>({});
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const startTime = useRef(Date.now());
    const containerRef = useRef<HTMLDivElement>(null);

    // Bubble up answers
    useEffect(() => {
        if (embedded && onAnswerChange) {
            onAnswerChange(connections.length > 0 ? connections : null);
        }
    }, [connections, embedded, onAnswerChange]);

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

    const handleLeftClick = (id: string) => {
        // If already connected, remove it? For now just select.
        setSelectedLeft(id);
    };

    const handleRightClick = (rightId: string) => {
        if (!selectedLeft) return;

        // Remove existing connection for either id
        const filtered = connections.filter(c => c[0] !== selectedLeft && c[1] !== rightId);
        setConnections([...filtered, [selectedLeft, rightId]]);
        setSelectedLeft(null);
    };

    const updateCoords = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newCoords: any = {};

        [...exercise.content.leftItems, ...exercise.content.rightItems].forEach(item => {
            const el = document.getElementById(`node-${item.id}`);
            if (el) {
                const elRect = el.getBoundingClientRect();
                const isLeft = exercise.content.leftItems.some(i => i.id === item.id);
                newCoords[item.id] = {
                    x: isLeft ? (elRect.right - rect.left) : (elRect.left - rect.left),
                    y: (elRect.top + elRect.height / 2) - rect.top
                };
            }
        });
        setCoords(newCoords);
    };

    useEffect(() => {
        window.addEventListener('resize', updateCoords);
        setTimeout(updateCoords, 500); // Wait for render
        return () => window.removeEventListener('resize', updateCoords);
    }, []);

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        onAnswer(connections, timeMs);
    };

    return (
        <div ref={containerRef} className="relative flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-6 min-h-[500px]">
            {embedded ? (
                exercise.content.stimulus ? (
                    <div className="mb-2">
                        <ExerciseStimulus stimulus={exercise.content.stimulus} />
                    </div>
                ) : null
            ) : (
                <div className="flex flex-col items-center gap-4 w-full z-10">
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

            <div className="flex justify-between w-full gap-32 relative z-10">
                {/* Columna Izquierda */}
                <div className="flex flex-col gap-6">
                    {exercise.content.leftItems.map(item => (
                        <div
                            key={item.id}
                            id={`node-${item.id}`}
                            onClick={() => handleLeftClick(item.id)}
                            className={`w-32 h-32 bg-white rounded-3xl border-4 cursor-pointer transition-all flex items-center justify-center p-2 shadow-lg ${selectedLeft === item.id ? 'border-purple-500 scale-105 ring-4 ring-purple-100' : 'border-blue-100 hover:border-blue-200'
                                }`}
                        >
                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-xl font-bold">{item.text}</span>}
                        </div>
                    ))}
                </div>

                {/* Columna Derecha */}
                <div className="flex flex-col gap-6">
                    {exercise.content.rightItems.map(item => (
                        <div
                            key={item.id}
                            id={`node-${item.id}`}
                            onClick={() => handleRightClick(item.id)}
                            className={`w-32 h-32 bg-white rounded-3xl border-4 cursor-pointer transition-all flex items-center justify-center p-2 shadow-lg ${connections.some(c => c[1] === item.id) ? 'border-green-400' : 'border-blue-100 hover:border-blue-200'
                                }`}
                        >
                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-xl font-bold">{item.text}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* SVG Overlay para las líneas */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {connections.map(([leftId, rightId], idx) => {
                    const from = coords[leftId];
                    const to = coords[rightId];
                    if (!from || !to) return null;
                    return (
                        <motion.line
                            key={idx}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                            stroke="#A855F7" strokeWidth="8" strokeLinecap="round" opacity="0.6"
                        />
                    );
                })}
            </svg>

            {!embedded && (
                <div className="fixed bottom-12 right-12">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConfirm}
                        className="p-6 rounded-full bg-green-500 text-white shadow-2xl transition-all"
                    >
                        <Send size={32} fill="currentColor" />
                    </motion.button>
                </div>
            )}
        </div>
    );
}
