"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Volume2, Send } from 'lucide-react';

interface Props {
    exercise: {
        instruction: string;
        content: {
            groups: Array<{ id: string, audioUrl?: string, label?: string }>;
            items: Array<{ id: string, imageUrl?: string, text?: string, syllables?: string[] }>;
        }
    };
    onAnswer: (answer: Array<{ itemId: string, groupId: string }>, timeMs: number) => void;
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
            {item.imageUrl && <img src={item.imageUrl} className="h-20 w-20 object-contain rounded-xl" alt="" />}
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

export default function ClasificarGrupos({ exercise, onAnswer }: Props) {
    const [assignments, setAssignments] = useState<Array<{ itemId: string, groupId: string }>>([]);
    const startTime = React.useRef(Date.now());

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
            <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-6 space-y-12">
                <h2 className="text-2xl font-bold bg-white px-8 py-4 rounded-3xl shadow-sm">
                    {exercise.instruction}
                </h2>

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
            </div>
        </DndContext>
    );
}
