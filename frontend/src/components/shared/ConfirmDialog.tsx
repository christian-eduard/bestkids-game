"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'danger', onConfirm, onCancel }: ConfirmDialogProps) {
    if (!open) return null;

    const colors = {
        danger: { bg: 'bg-red-500', hover: 'hover:bg-red-600', iconBg: 'bg-red-100', iconColor: 'text-red-500', shadow: 'shadow-red-200' },
        warning: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', shadow: 'shadow-yellow-200' },
        info: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', shadow: 'shadow-blue-200' },
    };
    const c = colors[variant];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-8 text-center">
                        <div className={`w-20 h-20 ${c.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                            {variant === 'danger' ? <Trash2 size={32} className={c.iconColor} /> : <AlertTriangle size={32} className={c.iconColor} />}
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-3">{title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
                    </div>
                    <div className="flex gap-3 p-6 pt-0">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-4 ${c.bg} ${c.hover} text-white rounded-2xl font-black shadow-lg ${c.shadow} transition-all active:scale-95`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
