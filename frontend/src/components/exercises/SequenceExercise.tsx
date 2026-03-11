"use client";
import React, { useState } from 'react';
import Celebration from '../Celebration';
import { getSuccessMessage, getEncouragementMessage } from '@/lib/feedbackMessages';

export interface SequenceContent {
    question?: string;
    items: Array<{ id: string; text: string; order: number }>;
}

interface SequenceExerciseProps {
    content: SequenceContent;
    onAnswer: (finalOrder: string[]) => void;
    selectedAnswer: string[] | null;
    result: any;
    isSubmitting: boolean;
}

const SequenceExercise: React.FC<SequenceExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    // Initial order state
    const [order, setOrder] = useState<Array<{ id: string; text: string; order: number }>>(() => {
        if (selectedAnswer && Array.isArray(selectedAnswer)) {
            return selectedAnswer.map(id => content.items.find(i => i.id === id)!).filter(Boolean);
        }
        return [...content.items].sort(() => Math.random() - 0.5);
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const updateAnswer = (newOrder: Array<{ id: string; text: string; order: number }>) => {
        setOrder(newOrder);
        onAnswer(newOrder.map(i => i.id));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (result || isSubmitting) return;
        const newOrder = [...order];
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        updateAnswer(newOrder);
    };

    const handleDragStart = (index: number) => {
        if (result || isSubmitting) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || result || isSubmitting) return;

        if (draggedIndex !== index) {
            const newOrder = [...order];
            const [removed] = newOrder.splice(draggedIndex, 1);
            newOrder.splice(index, 0, removed);
            updateAnswer(newOrder);
            setDraggedIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getItemStyle = (item: { id: string; order: number }, index: number) => {
        if (!result) {
            return draggedIndex === index
                ? 'border-primary bg-primary/10 scale-105 shadow-xl rotate-1'
                : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/50 hover:bg-primary/5';
        }

        const correctOrder = [...content.items].sort((a, b) => a.order - b.order);
        const isCorrectPosition = item.id === correctOrder[index].id;

        return isCorrectPosition
            ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
            : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 animate-shake';
    };

    return (
        <div className="max-w-4xl mx-auto p-2">
            <div className="mb-10 text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-white flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary drop-shadow-sm">format_list_numbered</span>
                    {content.question || '¡Pon todo en Orden!'}
                </h2>
                <p className="text-lg text-text-sub dark:text-gray-400 font-medium">
                    Arrastra los elementos para que queden en el lugar correcto.
                </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
                {order.map((item, index) => (
                    <div
                        key={item.id}
                        draggable={!result && !isSubmitting}
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`
                            relative flex items-center justify-between p-6 rounded-[1.5rem] border-4 
                            transition-all duration-300 cursor-grab active:cursor-grabbing
                            ${getItemStyle(item, index)}
                        `}
                    >
                        <div className="flex items-center gap-6">
                            <span className={`
                                w-12 h-12 flex items-center justify-center rounded-2xl 
                                font-black text-xl shadow-inner
                                ${result
                                    ? (item.id === [...content.items].sort((a, b) => a.order - b.order)[index].id ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                                    : 'bg-primary/10 text-primary border-2 border-primary/20'
                                }
                            `}>
                                {index + 1}
                            </span>
                            <span className="font-bold text-2xl tracking-tight">{item.text}</span>
                        </div>

                        {!result && !isSubmitting && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="p-3 rounded-xl hover:bg-primary/10 text-primary disabled:opacity-20 transition-all border-2 border-transparent hover:border-primary/20"
                                >
                                    <span className="material-symbols-outlined font-black">arrow_upward</span>
                                </button>
                                <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === order.length - 1}
                                    className="p-3 rounded-xl hover:bg-primary/10 text-primary disabled:opacity-20 transition-all border-2 border-transparent hover:border-primary/20"
                                >
                                    <span className="material-symbols-outlined font-black">arrow_downward</span>
                                </button>
                            </div>
                        )}

                        {result && (
                            <div className={`p-2 rounded-full ${item.id === [...content.items].sort((a, b) => a.order - b.order)[index].id ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <span className="material-symbols-outlined font-black">
                                    {item.id === [...content.items].sort((a, b) => a.order - b.order)[index].id ? 'check' : 'close'}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SequenceExercise;
