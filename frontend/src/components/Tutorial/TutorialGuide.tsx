"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

export function TutorialGuide() {
    const { steps, currentStepIndex, nextStep, prevStep, stopTutorial, isActive } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const currentStep = steps[currentStepIndex];

    useEffect(() => {
        if (isActive && currentStep) {
            const updateRect = () => {
                const element = document.getElementById(currentStep.targetId);
                if (element) {
                    setTargetRect(element.getBoundingClientRect());
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };

            updateRect();
            window.addEventListener('resize', updateRect);
            window.addEventListener('scroll', updateRect);

            // Re-check after a short delay for animations
            const timer = setTimeout(updateRect, 300);

            return () => {
                window.removeEventListener('resize', updateRect);
                window.removeEventListener('scroll', updateRect);
                clearTimeout(timer);
            };
        }
    }, [isActive, currentStep, currentStepIndex]);

    if (!isActive || !currentStep || !targetRect) return null;

    const tooltipPosition = () => {
        const pos = currentStep.position || 'bottom';
        const gap = 20;

        switch (pos) {
            case 'top': return { bottom: window.innerHeight - targetRect.top + gap, left: targetRect.left + targetRect.width / 2 };
            case 'bottom': return { top: targetRect.bottom + gap, left: targetRect.left + targetRect.width / 2 };
            case 'left': return { top: targetRect.top + targetRect.height / 2, right: window.innerWidth - targetRect.left + gap };
            case 'right': return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + gap };
            default: return { top: targetRect.bottom + gap, left: targetRect.left + targetRect.width / 2 };
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Dark Overlay with Hole */}
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <mask id="tutorial-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left - 8}
                            y={targetRect.top - 8}
                            width={targetRect.width + 16}
                            height={targetRect.height + 16}
                            rx="12"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.7)"
                    mask="url(#tutorial-mask)"
                    className="pointer-events-auto"
                />
            </svg>

            {/* Pulsating Ring around target */}
            <div
                className="absolute border-4 border-primary rounded-2xl animate-pulse"
                style={{
                    left: targetRect.left - 12,
                    top: targetRect.top - 12,
                    width: targetRect.width + 24,
                    height: targetRect.height + 24,
                }}
            />

            {/* Tooltip Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute pointer-events-auto bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-2xl border-4 border-primary/20 w-80 z-[10000]"
                style={{
                    ...tooltipPosition(),
                    transform: 'translateX(-50%)'
                }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <HelpCircle className="size-6" />
                    </div>
                    <h3 className="font-black text-xl text-text-main dark:text-white leading-tight">
                        {currentStep.title}
                    </h3>
                    <button
                        onClick={stopTutorial}
                        className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <p className="text-text-sub dark:text-gray-300 mb-6 font-medium leading-relaxed">
                    {currentStep.content}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-primary/50 uppercase tracking-widest">
                        Paso {currentStepIndex + 1} de {steps.length}
                    </span>
                    <div className="flex gap-2">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={prevStep}
                                className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                        )}
                        <button
                            onClick={nextStep}
                            className="px-5 py-2 rounded-full bg-primary text-white font-black flex items-center gap-2 hover:bg-primary-dark shadow-lg shadow-primary/30"
                        >
                            {currentStepIndex === steps.length - 1 ? '¡Entendido!' : 'Siguiente'}
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
