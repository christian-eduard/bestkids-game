"use client";
import React, { useState, useEffect } from 'react';

export interface DragDropWord {
    id: string;
    text: string;
    order: number; // Correct position (1-indexed)
}

export interface DragDropContent {
    question: string;
    words: DragDropWord[];
    correctSequence: string[]; // Ordered array of word IDs
}

interface DragDropExerciseProps {
    content: DragDropContent;
    onAnswer: (finalSequence: string[]) => void;
    selectedAnswer: string[] | null;
    result: any;
    isSubmitting: boolean;
}

const DragDropExercise: React.FC<DragDropExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [availableWords, setAvailableWords] = useState<DragDropWord[]>([]);
    const [placedWords, setPlacedWords] = useState<(DragDropWord | null)[]>([]);

    // Initialize or Reset
    useEffect(() => {
        // Robust data normalization: check for 'words' or 'items'
        const rawWords = content?.words || (content as any)?.items;
        if (!rawWords || !Array.isArray(rawWords)) return;

        // Ensure each word has a consistent structure
        const normalizedWords: DragDropWord[] = rawWords.map((w: any) => ({
            id: w.id,
            text: w.text || w.value || String(w),
            order: w.order || w.value || 0
        }));

        const initialAvailable = [...normalizedWords].sort(() => Math.random() - 0.5);

        if (selectedAnswer && Array.isArray(selectedAnswer) && selectedAnswer.length > 0) {
            // Restore from selectedAnswer
            const newPlaced = selectedAnswer.map(id => normalizedWords.find(w => w.id === id) || null);
            setPlacedWords(newPlaced);
            setAvailableWords(initialAvailable.filter(w => !selectedAnswer.includes(w.id)));
        } else {
            // Initial state
            setAvailableWords(initialAvailable);
            setPlacedWords(new Array(normalizedWords.length).fill(null));
        }
    }, [content]);

    // Handle incoming external changes to selectedAnswer (e.g. from parent reset)
    useEffect(() => {
        if (!content?.words || !Array.isArray(content.words)) return;

        if (!selectedAnswer || !Array.isArray(selectedAnswer) || selectedAnswer.length === 0) {
            if (placedWords.some(w => w !== null)) {
                // Reset internal state if parent says so
                setAvailableWords([...content.words].sort(() => Math.random() - 0.5));
                setPlacedWords(new Array(content.words.length).fill(null));
            }
        }
    }, [selectedAnswer]);

    const handleDragStart = (e: React.DragEvent, word: DragDropWord) => {
        if (result || isSubmitting) return;
        e.dataTransfer.setData('wordId', word.id);
    };

    const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        if (result || isSubmitting || !finalWordsList) return;

        const wordId = e.dataTransfer.getData('wordId');
        const rawWords = content?.words || (content as any)?.items;
        const word = Array.isArray(rawWords) ? rawWords.find((w: any) => w.id === wordId) : null;
        if (!word) return;

        // Reorder logic
        const currentInSlot = placedWords[slotIndex];
        let newAvailable = availableWords.filter((w) => w.id !== word.id);
        if (currentInSlot && currentInSlot.id !== word.id) {
            newAvailable.push(currentInSlot);
        }

        const newPlaced = placedWords.map((w) =>
            w?.id === word.id ? null : w
        );

        newPlaced[slotIndex] = word;
        setPlacedWords(newPlaced);

        // Construct final sequence of IDs for validation
        const currentSequenceIds = newPlaced.map(w => w ? w.id : "");
        // Only trigger onAnswer if we have a full sequence or partial updates are allowed
        if (typeof onAnswer === 'function') {
            onAnswer(currentSequenceIds as any);
        }
        setAvailableWords(newAvailable);

        if (typeof onAnswer === 'function') {
            onAnswer(newPlaced.map(w => w?.id || ''));
        }
    };

    const handleReturnToAvailable = (word: DragDropWord) => {
        if (result || isSubmitting) return;

        const newPlaced = placedWords.map((w) => (w?.id === word.id ? null : w));
        setPlacedWords(newPlaced);
        setAvailableWords((prev) => [...prev, word]);

        if (typeof onAnswer === 'function') {
            onAnswer(newPlaced.map(w => w?.id || ''));
        }
    };

    const getSlotStyle = (index: number): string => {
        const word = placedWords[index];

        if (!result) {
            return word
                ? 'border-primary bg-primary/5 shadow-inner'
                : 'border-gray-200 dark:border-white/10 border-dashed bg-gray-50/50 dark:bg-white/5';
        }

        // Safety check for correctSequence or correctOrder
        const correctSeq = content.correctSequence || (content as any).correctOrder;
        const isCorrect = word && Array.isArray(correctSeq) && word.id === correctSeq[index];
        return isCorrect
            ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
            : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 animate-shake';
    };

    const finalWordsList = content?.words || (content as any)?.items;
    if (!content || !finalWordsList) {
        return (
            <div className="p-10 bg-white dark:bg-[#2d1d2d] rounded-3xl text-center border-4 border-dashed border-gray-200">
                <p className="text-text-sub font-bold">Cargando palabras...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-white flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary drop-shadow-sm">extension</span>
                    {content.question || '¡Ordena el Desorden!'}
                </h2>
                <p className="text-lg text-text-sub dark:text-gray-400 font-medium">
                    Arrastra las burbujas a los cuadros grises para completar la misión.
                </p>
            </div>

            {/* Drop Zones */}
            <div className="w-full bg-white dark:bg-[#2d1d2d] rounded-[3rem] p-10 md:p-14 shadow-2xl border-4 border-[#f4e7f4] dark:border-[#3d243d] flex flex-wrap gap-5 items-center justify-center min-h-[200px]">
                {placedWords.map((word, index) => (
                    <div
                        key={index}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (!result && !isSubmitting) e.currentTarget.classList.add('scale-110', 'border-primary', 'bg-primary/10');
                        }}
                        onDragLeave={(e) => {
                            e.currentTarget.classList.remove('scale-110', 'border-primary', 'bg-primary/10');
                        }}
                        onDrop={(e) => {
                            e.currentTarget.classList.remove('scale-110', 'border-primary', 'bg-primary/10');
                            handleDropOnSlot(e, index);
                        }}
                        className={`
                            min-w-[150px] min-h-[80px] px-6 py-4 rounded-[1.5rem] border-4
                            flex items-center justify-center font-bold text-xl
                            transition-all duration-300 ${getSlotStyle(index)}
                        `}
                    >
                        {word ? (
                            <div
                                draggable={!result && !isSubmitting}
                                onDragStart={(e) => handleDragStart(e, word)}
                                onClick={() => handleReturnToAvailable(word)}
                                className={`
                                    cursor-grab active:cursor-grabbing px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 shadow-lg border border-gray-100 dark:border-white/5
                                    ${!result ? 'hover:scale-110 active:scale-95' : 'cursor-default opacity-90'}
                                    transition-all duration-300
                                `}
                            >
                                {word.text}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center opacity-20 group-hover:opacity-40 transition-opacity">
                                <span className="material-symbols-outlined text-3xl">add_circle</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black">{index + 1}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Word Bank */}
            <div className="mt-14 w-full">
                {!result && availableWords.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                            <span className="text-primary font-black text-xs uppercase tracking-widest bg-primary/5 px-4 py-1 rounded-full">Banco de Palabras</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center p-10 bg-[#fceaff]/20 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-primary/20 backdrop-blur-sm">
                            {availableWords.map((word) => (
                                <div
                                    key={word.id}
                                    draggable={!result && !isSubmitting}
                                    onDragStart={(e) => handleDragStart(e, word)}
                                    className="
                                        px-10 py-5 bg-gradient-to-br from-primary to-violet-600 text-white
                                        rounded-[1.25rem] font-black text-2xl cursor-grab active:cursor-grabbing
                                        shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-110 
                                        active:scale-95 transition-all duration-300 border-b-4 border-violet-800
                                    "
                                >
                                    {word.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : !result && availableWords.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 text-green-500 animate-bounce mt-4">
                        <span className="material-symbols-outlined text-5xl">stars</span>
                        <p className="font-black text-lg uppercase tracking-wider">¡Listo para comprobar!</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default DragDropExercise;
