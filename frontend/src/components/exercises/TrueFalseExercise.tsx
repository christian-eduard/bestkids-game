"use client";
import React, { useState, useEffect } from 'react';

export interface TrueFalseContent {
    question: string;
    correctAnswer: boolean;
    explanation?: string;
    passage?: string;
}

interface TrueFalseExerciseProps {
    content: TrueFalseContent;
    onAnswer: (selected: boolean) => void;
    selectedAnswer: boolean | null;
    result: any;
    isSubmitting: boolean;
}

const TrueFalseExercise: React.FC<TrueFalseExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [localSelected, setLocalSelected] = useState<boolean | null>(selectedAnswer);

    useEffect(() => {
        setLocalSelected(selectedAnswer);
    }, [selectedAnswer]);

    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando pregunta...</div>;

    const handleSelect = (value: boolean) => {
        if (result || isSubmitting) return;
        setLocalSelected(value);
        if (typeof onAnswer === 'function') {
            onAnswer(value);
        }
    };

    const getOptionStyle = (value: boolean) => {
        const isSelected = localSelected === value;
        const isCorrectResult = result && value === content.correctAnswer;
        const isWrongResult = result && isSelected && value !== content.correctAnswer;

        let baseClasses = `relative min-h-[140px] rounded-[2.5rem] border-4 p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 font-black text-2xl uppercase tracking-widest `;

        if (result) {
            if (isCorrectResult) return baseClasses + `border-green-500 bg-green-50 text-green-700 shadow-xl scale-105 z-10`;
            if (isWrongResult) return baseClasses + `border-red-500 bg-red-50 text-red-700 animate-shake opacity-80`;
            return baseClasses + "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 opacity-40 grayscale scale-95";
        }

        if (isSelected) {
            const colorClass = value ? "border-green-500 bg-green-50 text-green-600" : "border-red-500 bg-red-50 text-red-600";
            return baseClasses + `${colorClass} shadow-2xl scale-110 border-b-[12px] -translate-y-2`;
        }

        return baseClasses + "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-text-sub dark:text-white/60 hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-1 active:scale-95 border-b-8 active:border-b-4";
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Question Header */}
            <div className="text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-main dark:text-white leading-tight drop-shadow-sm">
                    {content.question || '¿Es verdadero o falso?'}
                </h2>
                <div className="flex items-center justify-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs">
                    <span className="h-0.5 w-12 bg-primary"></span>
                    <span>¿Verdad o Mentira?</span>
                    <span className="h-0.5 w-12 bg-primary"></span>
                </div>
            </div>

            {/* Passage if exists */}
            {content.passage && (
                <div className="w-full mb-12 p-10 bg-white dark:bg-[#2d1d2d] rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d243d] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-primary to-violet-500 opacity-20"></div>
                    <p className="text-2xl leading-relaxed text-text-sub dark:text-gray-300 font-bold italic text-center">
                        "{content.passage}"
                    </p>
                </div>
            )}

            {/* Binary Options Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
                {/* VERDADERO */}
                <button
                    onClick={() => handleSelect(true)}
                    disabled={!!result || isSubmitting}
                    className={getOptionStyle(true)}
                >
                    <span className="material-symbols-outlined text-6xl mb-2">recommend</span>
                    <span>Verdadero</span>
                    {result && content.correctAnswer === true && (
                        <div className="absolute -top-4 -right-4 size-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-4 border-white">
                            <span className="material-symbols-outlined font-black">check</span>
                        </div>
                    )}
                </button>

                {/* FALSO */}
                <button
                    onClick={() => handleSelect(false)}
                    disabled={!!result || isSubmitting}
                    className={getOptionStyle(false)}
                >
                    <span className="material-symbols-outlined text-6xl mb-2">falsy</span>
                    <span>Falso</span>
                    {result && content.correctAnswer === false && (
                        <div className="absolute -top-4 -right-4 size-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-4 border-white">
                            <span className="material-symbols-outlined font-black">check</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Feedback / Explanation */}
            {result && content.explanation && (
                <div className="mt-14 animate-in fade-in slide-in-from-bottom duration-1000 w-full max-w-2xl text-center">
                    <p className="text-xl font-bold text-text-sub dark:text-gray-400 border-t-2 border-gray-100 dark:border-white/5 pt-8">
                        {content.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TrueFalseExercise;
