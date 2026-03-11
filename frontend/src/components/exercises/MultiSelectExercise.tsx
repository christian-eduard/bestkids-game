"use client";
import React, { useState, useEffect } from 'react';

export interface MultiSelectOption {
    id: string;
    text: string;
    correct: boolean;
}

export interface MultiSelectContent {
    question: string;
    options: MultiSelectOption[];
}

interface MultiSelectExerciseProps {
    content: MultiSelectContent;
    onAnswer: (selectedIds: string[]) => void;
    selectedAnswer: string[] | null;
    result: any;
    isSubmitting: boolean;
}

const MultiSelectExercise: React.FC<MultiSelectExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedAnswer || []));

    useEffect(() => {
        setLocalSelected(new Set(selectedAnswer || []));
    }, [selectedAnswer]);

    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando opciones...</div>;

    const handleToggle = (id: string) => {
        if (result || isSubmitting) return;

        const newSet = new Set(localSelected);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);

        setLocalSelected(newSet);
        if (typeof onAnswer === 'function') {
            onAnswer(Array.from(newSet));
        }
    };

    const getOptionStyle = (option: MultiSelectOption) => {
        const isSelected = localSelected.has(option.id);
        const isCorrectResult = result && option.correct;

        let baseClasses = "relative min-h-[90px] rounded-[1.5rem] border-4 p-6 flex items-center gap-5 transition-all duration-300 font-bold text-xl ";

        if (result) {
            if (option.correct) return baseClasses + "border-green-500 bg-green-50 text-green-700 shadow-md";
            if (isSelected && !option.correct) return baseClasses + "border-red-500 bg-red-50 text-red-700 animate-shake";
            return baseClasses + "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 opacity-50";
        }

        if (isSelected) {
            return baseClasses + "border-primary bg-primary/5 text-primary shadow-lg scale-[1.02] border-b-8 -translate-y-1";
        }

        return baseClasses + "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-text-main dark:text-white hover:border-primary/50 hover:bg-primary/5 active:scale-95 border-b-8 active:border-b-4";
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Question Header */}
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
                    {content.question || 'Selecciona las opciones correctas'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                    <span className="material-symbols-outlined text-sm">checklist</span>
                    <span>Puede haber varias correctas</span>
                </div>
            </div>

            {/* Options List */}
            <div className="w-full flex flex-col gap-4">
                {(content.options || []).map((option) => {
                    const isSelected = localSelected.has(option.id);

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleToggle(option.id)}
                            disabled={!!result || isSubmitting}
                            className={getOptionStyle(option)}
                        >
                            {/* Custom Checkbox */}
                            <div className={`size-8 rounded-xl border-4 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary text-white scale-110' : 'bg-white dark:bg-white/10 border-gray-200'}`}>
                                {isSelected && <span className="material-symbols-outlined text-[20px] font-black">check</span>}
                            </div>

                            <span className="flex-1 text-left">{option.text}</span>

                            {result && option.correct && (
                                <div className="size-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                                    <span className="material-symbols-outlined font-black">star</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Hint / Result info */}
            {result && (
                <div className="mt-8 text-center text-text-sub dark:text-gray-400 font-bold italic">
                    {result.isCorrect
                        ? "¡Excelente puntería! Has encontrado todas las correctas."
                        : "¡Casi lo tienes! Sigue practicando para encontrarlas todas."}
                </div>
            )}
        </div>
    );
};

export default MultiSelectExercise;
