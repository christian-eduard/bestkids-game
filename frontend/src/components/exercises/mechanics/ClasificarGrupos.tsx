"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Volume2, Send, Play, Pause, Square } from 'lucide-react';
import ExerciseStimulus from '../shared/ExerciseStimulus';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            groups: Array<{ id: string, audioUrl?: string, label?: string }>;
            items: Array<{ id: string, imageUrl?: string, text?: string, syllables?: string[] }>;
        }
    };
    onAnswer: (answer: Array<{ itemId: string, groupId: string }>, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

function DraggableItem({ id, item }: { id: string, item: any }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`cursor-grab active:cursor-grabbing p-4 min-w-[120px] bg-white rounded-3xl shadow-lg border-2 border-blue-100 flex flex-col items-center gap-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} className="h-20 w-20 object-contain rounded-xl" alt="" />}
            {item.text && <span className="font-bold text-gray-700">{item.text}</span>}
            {item.syllables && (
                <div className="flex gap-1">
                    {item.syllables.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] font-black bg-gray-100 px-1 rounded">{s}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

function DropGroup({ id, group, count }: { id: string, group: any, count: number }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`w-48 h-56 rounded-[48px] border-4 flex flex-col items-center justify-between p-6 transition-all relative ${isOver ? 'bg-purple-100 border-purple-400 scale-105' : 'bg-white border-blue-100'
                }`}
        >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
                <Volume2 size={32} />
            </div>

            <span className="text-xl font-black text-gray-400 uppercase tracking-widest">{group.label || 'GRUPO'}</span>

            <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black shadow-lg">
                {count}
            </div>

            {isOver && <div className="absolute inset-0 border-4 border-purple-500 rounded-[48px] animate-pulse" />}
        </div>
    );
}

export default function ClasificarGrupos({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [assignments, setAssignments] = useState<Array<{ itemId: string, groupId: string }>>([]);
    const [playingInstruction, setPlayingInstruction] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    // Bubble up changes for master template
    React.useEffect(() => {
        if (embedded && onAnswerChange) {
            onAnswerChange(assignments.length > 0 ? assignments : null);
        }
    }, [assignments, embedded, onAnswerChange]);

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (!over) return;

        const itemId = active.id.toString();
        const groupId = over.id.toString();

        setAssignments(prev => {
            const filtered = prev.filter(a => a.itemId !== itemId);
            return [...filtered, { itemId, groupId }];
        });
    };

    const handleConfirm = () => {
        const timeMs = Date.now() - startTime.current;
        onAnswer(assignments, timeMs);
    };

    const unassignedItems = exercise.content.items.filter(item => !assignments.some(a => a.itemId === item.id));

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 space-y-6">
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

                <div className="flex justify-center gap-12 w-full">
                    {exercise.content.groups.map(group => (
                        <DropGroup
                            key={group.id}
                            id={group.id}
                            group={group}
                            count={assignments.filter(a => a.groupId === group.id).length}
                        />
                    ))}
                </div>

                {/* Pool de items */}
                <div className="bg-gray-50/50 p-10 rounded-[64px] border-4 border-dashed border-gray-100 w-full min-h-[200px] flex flex-wrap justify-center gap-6 mt-8">
                    {unassignedItems.map(item => (
                        <DraggableItem key={item.id} id={item.id} item={item} />
                    ))}
                    {unassignedItems.length === 0 && (
                        <span className="text-gray-300 font-bold self-center">¡Todos los elementos clasificados! ✨</span>
                    )}
                </div>

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
        </DndContext>
    );
}
