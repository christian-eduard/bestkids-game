"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Send, Volume2, Play, Pause, Square } from 'lucide-react';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Props {
    exercise: {
        instruction: string;
        content: {
            items: Array<{
                id: string;
                imageUrl: string;
                word: string;
                syllables: string[];
                audioUrl?: string;
            }>;
            availableSyllables: string[];
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
        },
        instructionAudioUrl?: string;
    };
    onAnswer: (answer: string[], timeMs: number) => void;
}

function DraggableSyllable({ id, content }: { id: string, content: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            whileHover={{ scale: 1.05 }}
            className={`cursor-grab active:cursor-grabbing p-4 min-w-[70px] h-16 bg-white rounded-2xl shadow-md border-b-4 border-gray-200 flex items-center justify-center font-black text-2xl text-purple-600 ${isDragging ? 'opacity-50' : ''}`}
        >
            {content}
        </motion.div>
    );
}

function DroppableSpot({ id, content }: { id: string, content: string | null }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center font-black text-2xl transition-all ${content
                ? 'bg-purple-50 border-purple-200 text-purple-600'
                : isOver
                    ? 'bg-orange-50 border-orange-300 border-dashed'
                    : 'bg-gray-100 border-gray-200 border-dashed hover:border-orange-200'
                }`}
        >
            {content}
        </div>
    );
}

export default function ArrastrarSilabas({ exercise, onAnswer }: Props) {
    const [responses, setResponses] = useState<Record<string, (string | null)[]>>(
        Object.fromEntries(exercise.content.items.map(i => [i.id, i.syllables.map(() => null)]))
    );
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    const toggleInstructionAudio = () => {
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

    // Pool de sílabas: Todas las necesarias + distractoras (aleatorizado)
    const syllablePool = useMemo(() => {
        const required = exercise.content.items.flatMap(item => item.syllables);
        const distractors = exercise.content.availableSyllables || [];
        return [...required, ...distractors]
            .map(s => ({ value: s, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(a => a.value);
    }, [exercise.content]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (!over) return;

        const syllableValue = active.id.toString().split('-')[1];
        const [, itemId, spotIdxStr] = over.id.toString().split('-');
        const spotIdx = parseInt(spotIdxStr);

        setResponses(prev => {
            const newRes = { ...prev };
            const itemRes = [...newRes[itemId]];
            itemRes[spotIdx] = syllableValue;
            newRes[itemId] = itemRes;
            return newRes;
        });
    };

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        const finalWords = exercise.content.items.map(item => (responses[item.id] || []).join(""));
        onAnswer(finalWords, timeMs);
    };

    const playAudio = (url: string) => url && new Audio(url).play();

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 space-y-12">
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

                <div className="grid gap-8 w-full">
                    {exercise.content.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-10 bg-white p-8 rounded-[48px] shadow-xl border-b-[12px] border-purple-50 relative group">
                            <div className="relative h-40 w-40 shrink-0">
                                <img src={item.imageUrl} className="w-full h-full object-cover rounded-[32px] shadow-lg border-4 border-white" alt="" />
                                {item.audioUrl && (
                                    <button onClick={() => playAudio(item.audioUrl!)} className="absolute -bottom-4 -right-4 p-4 bg-orange-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-all">
                                        <Volume2 size={24} />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 flex flex-wrap gap-4 items-center justify-center bg-gray-50/50 p-8 rounded-[40px] border-4 border-dashed border-gray-100">
                                {item.syllables.map((_, idx) => (
                                    <DroppableSpot
                                        key={idx}
                                        id={`spot-${item.id}-${idx}`}
                                        content={responses[item.id][idx]}
                                    />
                                ))}
                                <div className="ml-4 p-4 bg-white/80 rounded-2xl text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.word.length} LETRAS</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-purple-900/5 p-10 rounded-[56px] shadow-inner border-4 border-white/50 w-full flex flex-wrap justify-center gap-6">
                    {syllablePool.map((s, idx) => (
                        <DraggableSyllable key={`${s}-${idx}`} id={`syllable-${s}-${idx}`} content={s} />
                    ))}
                </div>

                <div className="fixed bottom-12 right-12 z-[100]">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConfirm}
                        className="p-8 rounded-[32px] bg-green-500 text-white shadow-2xl shadow-green-200 transition-all border-b-8 border-green-700"
                    >
                        <Send size={40} fill="currentColor" />
                    </motion.button>
                </div>
            </div>
        </DndContext>
    );
}
