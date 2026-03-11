"use client";
import React, { useState, useEffect } from 'react';

export interface MultipleChoiceContent {
    question: string;
    options: Array<string | { text: string; value: any; imageUrl?: string }>;
    correctAnswer: any;
    explanation?: string;
    passage?: string;
}

interface MultipleChoiceExerciseProps {
    content: MultipleChoiceContent;
    onAnswer: (selected: any) => void;
    selectedAnswer: any | null;
    result: any;
    isSubmitting: boolean;
}

const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [localSelected, setLocalSelected] = useState<any>(selectedAnswer);

    useEffect(() => {
        setLocalSelected(selectedAnswer);
    }, [selectedAnswer]);

    // Cleanup and safety
    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando contenido...</div>;

    // Normalize options
    const options = (content.options || []).map((opt: any) => {
        if (typeof opt === 'string') return { text: opt, value: opt };
        return opt;
    });

    const handleSelect = (value: any) => {
        if (result || isSubmitting) return;
        setLocalSelected(value);
        if (typeof onAnswer === 'function') {
            onAnswer(value);
        }
    };

    const getOptionStyle = (option: any) => {
        const isSelected = localSelected === option.value;
        const isCorrectResult = result && option.value === content.correctAnswer;
        const isWrongResult = result && isSelected && option.value !== content.correctAnswer;

        let baseClasses = "relative min-h-[100px] rounded-[1.5rem] border-4 p-6 flex items-center justify-between gap-4 transition-all duration-300 font-black text-xl ";

        if (result) {
            if (isCorrectResult) return baseClasses + "border-green-500 bg-green-50 text-green-700 shadow-lg scale-105 z-10";
            if (isWrongResult) return baseClasses + "border-red-500 bg-red-50 text-red-700 animate-shake";
            return baseClasses + "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 opacity-50 grayscale scale-95";
        }

        if (isSelected) {
            return baseClasses + "border-primary bg-primary/5 text-primary shadow-xl scale-105 border-b-8 -translate-y-1";
        }

        return baseClasses + "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-text-main dark:text-white hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 active:scale-95 border-b-8 active:border-b-4";
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Question Header */}
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
                    {content.question || 'Pregunta de opción múltiple'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
                    <span className="h-px w-8 bg-primary"></span>
                    <span>Elige la mejor opción</span>
                    <span className="h-px w-8 bg-primary"></span>
                </div>
            </div>

            {/* Passage if exists */}
            {content.passage && (
                <div className="w-full mb-10 p-8 bg-white dark:bg-[#2d1d2d] rounded-[2rem] border-4 border-[#f4e7f4] dark:border-[#3d243d] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                    <p className="text-xl leading-relaxed text-text-sub dark:text-gray-300 font-medium italic">
                        "{content.passage}"
                    </p>
                </div>
            )}

            {/* Options Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                {options.map((option: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => handleSelect(option.value)}
                        disabled={!!result || isSubmitting}
                        className={getOptionStyle(option)}
                    >
                        <div className="flex flex-col items-start gap-1 flex-1">
                            <span className="text-left leading-tight">{option.text}</span>
                            {result && option.value === content.correctAnswer && (
                                <span className="text-[10px] uppercase font-black tracking-widest text-green-600">¡Correcto!</span>
                            )}
                        </div>

                        {option.imageUrl && (
                            <div className="size-20 rounded-2xl bg-white p-1 overflow-hidden shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                <img src={option.imageUrl} alt="" className="w-full h-full object-contain" />
                            </div>
                        )}

                        {/* Visual feedback mark */}
                        <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-colors ${localSelected === option.value ? 'bg-primary border-primary text-white' : 'border-gray-200 text-transparent'}`}>
                            <span className="material-symbols-outlined text-[18px] font-black">check</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Explanation Result */}
            {result && !result.isCorrect && content.explanation && (
                <div className="mt-10 animate-in slide-in-from-top duration-700 w-full max-w-2xl">
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-4 border-amber-200 dark:border-amber-700/30 p-6 rounded-[2rem] flex items-center gap-6 shadow-lg">
                        <div className="size-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <span className="material-symbols-outlined text-4xl font-black">help</span>
                        </div>
                        <div>
                            <p className="font-black text-amber-700 dark:text-amber-400 text-lg uppercase tracking-wider">Sabías que...</p>
                            <p className="text-amber-600 dark:text-amber-300 font-medium">{content.explanation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultipleChoiceExercise;
