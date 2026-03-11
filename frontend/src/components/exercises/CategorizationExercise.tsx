"use client";
import React, { useState, useEffect } from 'react';

export interface CategorizationItem {
    id: string;
    text: string;
    categoryId: string;
    imageUrl?: string;
}

export interface CategorizationCategory {
    id: string;
    title: string;
    imageUrl?: string;
}

export interface CategorizationContent {
    question: string;
    categories: CategorizationCategory[];
    items: CategorizationItem[];
}

interface CategorizationExerciseProps {
    content: CategorizationContent;
    onAnswer: (assigned: Record<string, string>) => void;
    selectedAnswer: Record<string, string> | null;
    result: any;
    isSubmitting: boolean;
}

const CategorizationExercise: React.FC<CategorizationExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [unassignedItems, setUnassignedItems] = useState<CategorizationItem[]>([]);
    const [assignedItems, setAssignedItems] = useState<Record<string, CategorizationItem[]>>({});
    const [draggedItem, setDraggedItem] = useState<CategorizationItem | null>(null);

    useEffect(() => {
        if (!content?.categories || !content?.items) return;

        const categoriesMap: Record<string, CategorizationItem[]> = {};
        content.categories.forEach(cat => categoriesMap[cat.id] = []);

        if (selectedAnswer) {
            const unassigned: CategorizationItem[] = [];
            content.items.forEach(item => {
                const catId = selectedAnswer[item.id];
                if (catId && categoriesMap[catId]) {
                    categoriesMap[catId].push(item);
                } else {
                    unassigned.push(item);
                }
            });
            setUnassignedItems(unassigned);
            setAssignedItems(categoriesMap);
        } else {
            setUnassignedItems([...content.items].sort(() => Math.random() - 0.5));
            setAssignedItems(categoriesMap);
        }
    }, [content]);

    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando clasificación...</div>;

    const handleDragStart = (e: React.DragEvent, item: CategorizationItem) => {
        if (result || isSubmitting) return;
        setDraggedItem(item);
        e.dataTransfer.setData('itemId', item.id);
    };

    const handleDropOnCategory = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        if (result || isSubmitting || !content?.items) return;

        const itemId = e.dataTransfer.getData('itemId');
        const item = content.items.find(i => i.id === itemId);
        if (!item) return;

        // Remove from everywhere else
        const newUnassigned = unassignedItems.filter(i => i.id !== itemId);
        const newAssigned = { ...assignedItems };
        Object.keys(newAssigned).forEach(catId => {
            newAssigned[catId] = (newAssigned[catId] || []).filter(i => i.id !== itemId);
        });

        // Add to new category
        if (!newAssigned[categoryId]) newAssigned[categoryId] = [];
        newAssigned[categoryId].push(item);

        setUnassignedItems(newUnassigned);
        setAssignedItems(newAssigned);
        setDraggedItem(null);

        // Update parent
        const updatedAnswer: Record<string, string> = {};
        Object.keys(newAssigned).forEach(catId => {
            newAssigned[catId].forEach(i => updatedAnswer[i.id] = catId);
        });

        if (typeof onAnswer === 'function') {
            onAnswer(updatedAnswer);
        }
    };

    const handleReturnToUnassigned = (item: CategorizationItem) => {
        if (result || isSubmitting) return;

        const newAssigned = { ...assignedItems };
        Object.keys(newAssigned).forEach(catId => {
            newAssigned[catId] = (newAssigned[catId] || []).filter(i => i.id !== item.id);
        });

        setAssignedItems(newAssigned);
        setUnassignedItems(prev => [...prev, item]);

        const updatedAnswer: Record<string, string> = {};
        Object.keys(newAssigned).forEach(catId => {
            newAssigned[catId].forEach(i => updatedAnswer[i.id] = catId);
        });

        if (typeof onAnswer === 'function') {
            onAnswer(updatedAnswer);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
                    {content.question || 'Clasifica los elementos'}
                </h2>
                <p className="text-lg text-text-sub dark:text-gray-400 font-medium">Arrastra cada objeto al grupo que le corresponde.</p>
            </div>

            {/* Categories Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(content.categories || []).map((cat) => (
                    <div
                        key={cat.id}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (!result && !isSubmitting) e.currentTarget.classList.add('scale-105', 'shadow-2xl', 'border-primary');
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.classList.remove('scale-105', 'shadow-2xl', 'border-primary');
                        }}
                        onDrop={(e) => {
                            e.currentTarget.classList.remove('scale-105', 'shadow-2xl', 'border-primary');
                            handleDropOnCategory(e, cat.id);
                        }}
                        className="flex flex-col bg-white dark:bg-[#2d1d2d] rounded-[2rem] shadow-xl border-4 border-[#f4e7f4] dark:border-[#3d243d] overflow-hidden min-h-[300px] transition-all duration-300"
                    >
                        <div className="p-4 bg-primary/5 border-b-2 border-primary/10 flex items-center justify-center gap-2">
                            {cat.imageUrl && <img src={cat.imageUrl} alt="" className="size-8 object-contain" />}
                            <h3 className="font-black text-primary text-xl uppercase tracking-wider">{cat.title}</h3>
                        </div>
                        <div className="flex-1 p-6 flex flex-wrap content-start gap-3 bg-gray-50/30 dark:bg-black/10">
                            {(assignedItems[cat.id] || []).map(item => {
                                const isFinal = !!result;
                                const isCorrect = isFinal && item.categoryId === cat.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleReturnToUnassigned(item)}
                                        className={`
                                            px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all
                                            ${isFinal
                                                ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-shake')
                                                : 'bg-white dark:bg-white/10 hover:scale-105 cursor-pointer border border-gray-100 dark:border-white/5'}
                                        `}
                                    >
                                        {item.imageUrl && <img src={item.imageUrl} alt="" className="size-6 object-contain" />}
                                        {item.text}
                                        {!isFinal && <span className="material-symbols-outlined text-[14px]">close</span>}
                                    </div>
                                );
                            })}
                            {(!assignedItems[cat.id] || assignedItems[cat.id].length === 0) && (
                                <div className="w-full h-full flex flex-col items-center justify-center opacity-10 py-10">
                                    <span className="material-symbols-outlined text-4xl">move_to_inbox</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest mt-2">Vacío</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Unassigned Items */}
            {!result && unassignedItems.length > 0 && (
                <div className="w-full bg-gray-50/50 dark:bg-black/20 p-10 rounded-[3rem] border-4 border-dashed border-gray-200 dark:border-white/10 flex flex-wrap justify-center gap-6 animate-in slide-in-from-bottom duration-700">
                    {unassignedItems.map(item => (
                        <div
                            key={item.id}
                            draggable={!isSubmitting}
                            onDragStart={(e) => handleDragStart(e, item)}
                            className="
                                px-8 py-4 bg-white dark:bg-white/10 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5
                                font-black text-xl text-text-main dark:text-white cursor-grab active:cursor-grabbing
                                hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center gap-3
                            "
                        >
                            {item.imageUrl && <img src={item.imageUrl} alt="" className="size-10 object-contain" />}
                            {item.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorizationExercise;
