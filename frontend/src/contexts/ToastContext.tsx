"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Types
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
    success: (message: string, duration?: number) => number;
    error: (message: string, duration?: number) => number;
    warning: (message: string, duration?: number) => number;
    info: (message: string, duration?: number) => number;
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info' | string, duration?: number) => number;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Toast Component
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const styles = {
        success: { bg: 'bg-green-500', icon: <CheckCircle2 className="w-5 h-5" /> },
        error: { bg: 'bg-red-500', icon: <AlertCircle className="w-5 h-5" /> },
        warning: { bg: 'bg-yellow-500', icon: <AlertTriangle className="w-5 h-5" /> },
        info: { bg: 'bg-blue-500', icon: <Info className="w-5 h-5" /> }
    };

    return (
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 min-w-[300px] animate-slide-in-right">
            <div className={`w-8 h-8 ${styles[toast.type].bg} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                {styles[toast.type].icon}
            </div>
            <p className="flex-1 text-gray-800 dark:text-gray-200 text-sm">{toast.message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Toast Container
const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) => (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
        {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
        ))}
    </div>
);

// Provider Component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'], duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const toast: ToastContextType = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
        showToast: (msg, type, duration) => addToast(msg, type as any, duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
        </ToastContext.Provider>
    );
};
