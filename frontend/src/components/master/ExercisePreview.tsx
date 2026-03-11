"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';

interface ExercisePreviewProps {
    exercise: any;
    open: boolean;
    onClose: () => void;
}

export default function ExercisePreview({ exercise, open, onClose }: ExercisePreviewProps) {
    if (!open || !exercise) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] flex flex-col p-4 sm:p-8"
                onClick={onClose}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">preview</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-tight">Vista Previa</h2>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Modo Simulador de Alumno</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Engine Container */}
                <div
                    className="flex-1 rounded-[48px] bg-slate-50 dark:bg-slate-950 overflow-hidden relative shadow-2xl border-4 border-white/10"
                    onClick={e => e.stopPropagation()}
                >
                    <ExerciseEngine
                        exercises={[exercise]}
                        unitTitle="Vista Previa"
                        onFinish={() => onClose()}
                        isPreview={true}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
