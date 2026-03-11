"use client";
import React, { useState, useEffect } from 'react';

export interface FillBlankItem {
    id: string;
    correctAnswers: string[];
    caseSensitive?: boolean;
    hint?: string;
}

export interface FillBlanksContent {
    question: string;
    text: string; // Text with {blank0}, {blank1} placeholders
    blanks: FillBlankItem[];
}

interface FillBlanksExerciseProps {
    content: FillBlanksContent;
    onAnswer: (answers: Record<string, string>) => void;
    selectedAnswer: Record<string, string> | null;
    result: any;
    isSubmitting: boolean;
}

const FillBlanksExercise: React.FC<FillBlanksExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [answers, setAnswers] = useState<Record<string, string>>(selectedAnswer || {});

    useEffect(() => {
        if (selectedAnswer) setAnswers(selectedAnswer);
    }, [selectedAnswer]);

    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando oraciones...</div>;

    const handleAnswerChange = (blankId: string, value: string) => {
        if (result || isSubmitting) return;
        const newAnswers = { ...answers, [blankId]: value };
        setAnswers(newAnswers);
        if (typeof onAnswer === 'function') {
            onAnswer(newAnswers);
        }
    };

    const isBlankCorrect = (blankId: string): boolean | null => {
        if (!result || !content?.blanks) return null;

        const blank = content.blanks.find((b) => b.id === blankId);
        if (!blank) return null;

        const userAnswer = (answers[blankId] || '').trim();
        const correctAnswers = (blank.correctAnswers || []).map((ans) =>
            blank.caseSensitive ? ans : ans.toLowerCase()
        );
        const compareAnswer = blank.caseSensitive
            ? userAnswer
            : userAnswer.toLowerCase();

        return correctAnswers.includes(compareAnswer);
    };

    const renderTextWithBlanks = () => {
        if (!content.text) return null;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        const placeholders = (content.blanks || []).map(b => ({
            id: b.id,
            tag: `{${b.id}}`,
            index: content.text.indexOf(`{${b.id}}`)
        })).filter(p => p.index !== -1).sort((a, b) => a.index - b.index);

        placeholders.forEach((p, idx) => {
            if (p.index > lastIndex) {
                parts.push(
                    <span key={`text-${idx}`} className="text-text-main dark:text-white/80">
                        {content.text.substring(lastIndex, p.index)}
                    </span>
                );
            }

            const correctStatus = isBlankCorrect(p.id);
            let statusClasses = "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-primary focus:ring-4 focus:ring-primary/20";

            if (correctStatus === true) {
                statusClasses = "border-green-500 bg-green-500/5 text-green-600 dark:text-green-400 ring-4 ring-green-500/10";
            } else if (correctStatus === false) {
                statusClasses = "border-red-500 bg-red-500/5 text-red-600 dark:text-red-400 animate-shake ring-4 ring-red-500/10";
            }

            parts.push(
                <span key={`blank-${idx}`} className="relative inline-block mx-2 group">
                    <input
                        type="text"
                        value={answers[p.id] || ''}
                        onChange={(e) => handleAnswerChange(p.id, e.target.value)}
                        disabled={!!result || isSubmitting}
                        placeholder="..."
                        className={`
                            min-w-[120px] max-w-[180px] px-4 py-2 border-4 rounded-[1.25rem]
                            font-black text-center transition-all duration-300 outline-none
                            ${statusClasses}
                        `}
                    />
                    {correctStatus !== null && (
                        <div className={`absolute -top-3 -right-3 size-7 rounded-full flex items-center justify-center text-white shadow-lg z-10 ${correctStatus ? 'bg-green-500' : 'bg-red-500'}`}>
                            <span className="material-symbols-outlined text-[18px] font-black">{correctStatus ? 'check' : 'close'}</span>
                        </div>
                    )}
                </span>
            );

            lastIndex = p.index + p.tag.length;
        });

        if (lastIndex < content.text.length) {
            parts.push(
                <span key="text-end" className="text-text-main dark:text-white/80">
                    {content.text.substring(lastIndex)}
                </span>
            );
        }

        return parts;
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-white flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary font-black">edit_square</span>
                    {content.question || 'Completa la Misión'}
                </h2>
                <p className="text-lg text-text-sub dark:text-gray-400 font-medium">
                    Escribe lo que falta para completar la frase correctamente.
                </p>
            </div>

            <div className="w-full bg-white dark:bg-[#2d1d2d] rounded-[3rem] p-10 md:p-16 shadow-2xl border-4 border-[#f4e7f4] dark:border-[#3d243d] flex flex-col items-center">
                <div className="text-2xl md:text-3xl lg:text-4xl leading-[1.8] font-black text-center max-w-3xl">
                    {renderTextWithBlanks()}
                </div>
            </div>

            {result && !result.isCorrect && content.blanks && (
                <div className="mt-8 animate-in fade-in slide-in-from-top duration-700">
                    <div className="bg-amber-50 dark:bg-amber-900/10 border-4 border-amber-200 dark:border-amber-700/30 p-6 rounded-[2rem] flex items-center gap-6 shadow-lg">
                        <div className="size-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 animate-bounce">
                            <span className="material-symbols-outlined text-4xl font-black">tips_and_updates</span>
                        </div>
                        <div>
                            <p className="font-black text-amber-700 dark:text-amber-400 text-xl">¿Necesitas ayuda?</p>
                            <p className="text-amber-600 dark:text-amber-500 font-bold">Vuelve a leer el enunciado y revisa que todo esté bien escrito.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FillBlanksExercise;
