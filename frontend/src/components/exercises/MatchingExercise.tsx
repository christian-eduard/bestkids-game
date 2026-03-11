"use client";
import React, { useState, useEffect, useRef } from 'react';

export interface MatchingPair {
    left: string;
    right: string;
}

export interface MatchingContent {
    question: string;
    leftColumn: Array<{ id: string; text: string; imageUrl?: string }>;
    rightColumn: Array<{ id: string; text: string; imageUrl?: string }>;
    correctPairs: MatchingPair[];
}

interface MatchingExerciseProps {
    content: MatchingContent;
    onAnswer: (matches: MatchingPair[]) => void;
    selectedAnswer: MatchingPair[] | null;
    result: any;
    isSubmitting: boolean;
}

const MatchingExercise: React.FC<MatchingExerciseProps> = ({
    content,
    onAnswer,
    selectedAnswer,
    result,
    isSubmitting
}) => {
    const [matches, setMatches] = useState<MatchingPair[]>(selectedAnswer || []);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [lines, setLines] = useState<Array<{ x1: number, y1: number, x2: number, y2: number, left: string, right: string }>>([]);

    const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedAnswer) setMatches(selectedAnswer);
    }, [selectedAnswer]);

    useEffect(() => {
        updateLines();
    }, [matches, content]);

    if (!content) return <div className="p-10 text-center font-bold opacity-50">Cargando relaciones...</div>;

    const updateLines = () => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();

        const newLines = matches.map(match => {
            const leftEl = leftRefs.current[match.left];
            const rightEl = rightRefs.current[match.right];

            if (leftEl && rightEl) {
                const leftRect = leftEl.getBoundingClientRect();
                const rightRect = rightEl.getBoundingClientRect();

                return {
                    x1: leftRect.right - containerRect.left,
                    y1: leftRect.top + leftRect.height / 2 - containerRect.top,
                    x2: rightRect.left - containerRect.left,
                    y2: rightRect.top + rightRect.height / 2 - containerRect.top,
                    left: match.left,
                    right: match.right
                };
            }
            return null;
        }).filter(Boolean) as any[];

        setLines(newLines);
    };

    const handleLeftClick = (id: string) => {
        if (result || isSubmitting) return;
        setSelectedLeft(id === selectedLeft ? null : id);
    };

    const handleRightClick = (id: string) => {
        if (!selectedLeft || result || isSubmitting) return;

        // Remove any existing match for either side
        const newMatches = matches.filter(m => m.left !== selectedLeft && m.right !== id);
        newMatches.push({ left: selectedLeft, right: id });

        setMatches(newMatches);
        setSelectedLeft(null);
        if (typeof onAnswer === 'function') {
            onAnswer(newMatches);
        }
    };

    const removeMatch = (leftId: string) => {
        if (result || isSubmitting) return;
        const newMatches = matches.filter(m => m.left !== leftId);
        setMatches(newMatches);
        if (typeof onAnswer === 'function') {
            onAnswer(newMatches);
        }
    };

    const getLineColor = (left: string, right: string) => {
        if (!result) return 'url(#lineGradient)';
        const correctPair = (content.correctPairs || []).find(p => p.left === left && p.right === right);
        return correctPair ? '#22C55E' : '#EF4444';
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12 space-y-3">
                <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white leading-tight">
                    {content.question || 'Une con Flechas'}
                </h2>
                <p className="text-lg text-text-sub dark:text-gray-400 font-medium">Relaciona los elementos de la izquierda con los de la derecha.</p>
            </div>

            <div ref={containerRef} className="relative w-full flex justify-between gap-20 p-8">
                {/* SVG Overlay for lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {lines.map((line, i) => (
                        <g key={i} className="animate-in fade-in duration-500">
                            <line
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke={getLineColor(line.left, line.right)}
                                strokeWidth="6"
                                strokeLinecap="round"
                                filter={!result ? "url(#glow)" : ""}
                                className="transition-all duration-300"
                            />
                            {!result && (
                                <circle r="4" fill="white">
                                    <animateMotion
                                        path={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                                        dur="2s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            )}
                        </g>
                    ))}
                </svg>

                {/* Left Column */}
                <div className="flex flex-col gap-6 z-20">
                    {(content.leftColumn || []).map((item) => {
                        const isMatched = matches.some(m => m.left === item.id);
                        const isSelected = selectedLeft === item.id;

                        return (
                            <button
                                key={item.id}
                                ref={el => { leftRefs.current[item.id] = el; }}
                                onClick={() => handleLeftClick(item.id)}
                                className={`
                                    relative min-w-[200px] p-6 rounded-[1.5rem] border-4 transition-all duration-300 flex items-center gap-4 font-black text-lg
                                    ${isSelected ? 'border-primary bg-primary/10 scale-110 shadow-xl' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-text-main dark:text-white'}
                                    ${isMatched && !isSelected ? 'opacity-70 grayscale-[0.5]' : ''}
                                    hover:border-primary/50 hover:scale-105 active:scale-95
                                `}
                            >
                                {item.imageUrl && <img src={item.imageUrl} alt="" className="size-12 rounded-lg object-contain" />}
                                {item.text}
                                {isMatched && (
                                    <div className="absolute -top-3 -left-3 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                                        <span className="material-symbols-outlined text-[14px]">link</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 z-20">
                    {(content.rightColumn || []).map((item) => {
                        const isMatched = matches.some(m => m.right === item.id);

                        return (
                            <button
                                key={item.id}
                                ref={el => { rightRefs.current[item.id] = el; }}
                                onClick={() => handleRightClick(item.id)}
                                disabled={!selectedLeft && !isMatched}
                                className={`
                                    min-w-[200px] p-6 rounded-[1.5rem] border-4 transition-all duration-300 flex items-center gap-4 font-black text-lg
                                    ${isMatched ? 'border-violet-500 bg-violet-50 shadow-md' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-text-main dark:text-white'}
                                    ${!isMatched && selectedLeft ? 'hover:border-violet-400 hover:scale-105' : ''}
                                    ${!selectedLeft && !isMatched ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                            >
                                {item.imageUrl && <img src={item.imageUrl} alt="" className="size-12 rounded-lg object-contain" />}
                                {item.text}
                            </button>
                        );
                    })}
                </div>
            </div>

            {matches.length > 0 && !result && (
                <button
                    onClick={() => { setMatches([]); setSelectedLeft(null); if (typeof onAnswer === 'function') onAnswer([]); }}
                    className="mt-12 text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                    Limpiar Conexiones
                </button>
            )}
        </div>
    );
};

export default MatchingExercise;
