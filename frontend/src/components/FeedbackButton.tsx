"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, X, Send, Loader2, History, Clock, Bug, Lightbulb, Sparkles, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import api from '@/lib/api';

interface LocalFeedback {
    id: string;
    message: string;
    category: string;
    timestamp: number;
    screenshot?: string;
}

const STORAGE_KEY = 'bestkids_feedback_history';

export function FeedbackButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('sugerencia');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [capturingScreen, setCapturingScreen] = useState(false);

    // Local history
    const [localHistory, setLocalHistory] = useState<LocalFeedback[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load history from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    setLocalHistory(JSON.parse(stored));
                } catch (e) {
                    console.error('Error parsing feedback history:', e);
                }
            }
        }
    }, []);

    const saveToLocalHistory = (feedback: LocalFeedback) => {
        const updated = [feedback, ...localHistory].slice(0, 20); // Keep last 20
        setLocalHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const clearHistory = () => {
        setLocalHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Screenshot capture using html2canvas approach (basic version)
    const captureScreenshot = async () => {
        setCapturingScreen(true);
        try {
            // Close modal temporarily for screenshot
            setIsOpen(false);

            // Wait for modal to close
            await new Promise(resolve => setTimeout(resolve, 300));

            // Use canvas-based screenshot if html2canvas is available, otherwise prompt for upload
            if (typeof window !== 'undefined' && 'html2canvas' in window) {
                // @ts-ignore
                const canvas = await window.html2canvas(document.body);
                const dataUrl = canvas.toDataURL('image/png');
                setScreenshot(dataUrl);
            } else {
                // Fallback: prompt user to paste screenshot
                alert('Usa Ctrl+Shift+S (Mac: Cmd+Shift+4) para capturar y luego pega aquí');
            }

            setIsOpen(true);
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            alert('Error capturando pantalla. Intenta subir una imagen manualmente.');
            setIsOpen(true);
        } finally {
            setCapturingScreen(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Imagen muy grande. Máximo 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setScreenshot(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setSending(true);
        try {
            // Send to backend
            await api.post('/feedback', {
                message: message.trim(),
                category,
                page: typeof window !== 'undefined' ? window.location.pathname : '',
                screenshot: screenshot || undefined,
            });

            // Save to local history
            saveToLocalHistory({
                id: Date.now().toString(),
                message: message.trim(),
                category,
                timestamp: Date.now(),
                screenshot: screenshot || undefined,
            });

            setSent(true);
            setMessage('');
            setScreenshot(null);

            setTimeout(() => {
                setSent(false);
                setActiveTab('history');
            }, 1500);
        } catch (error) {
            console.error('Error sending feedback:', error);
            // Still save locally even if API fails
            saveToLocalHistory({
                id: Date.now().toString(),
                message: message.trim(),
                category,
                timestamp: Date.now(),
                screenshot: screenshot || undefined,
            });
            setSent(true);
            setMessage('');
            setScreenshot(null);
            setTimeout(() => {
                setSent(false);
                setActiveTab('history');
            }, 1500);
        } finally {
            setSending(false);
        }
    };

    const getCategoryConfig = (cat: string) => {
        switch (cat) {
            case 'bug': return { icon: <Bug className="w-4 h-4" />, label: 'Bug', bg: 'bg-red-100', text: 'text-red-700' };
            case 'mejora': return { icon: <Sparkles className="w-4 h-4" />, label: 'Mejora', bg: 'bg-purple-100', text: 'text-purple-700' };
            default: return { icon: <Lightbulb className="w-4 h-4" />, label: 'Sugerencia', bg: 'bg-amber-100', text: 'text-amber-700' };
        }
    };

    return (
        <>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
            />

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                title="Enviar feedback"
            >
                <MessageSquarePlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                                    <MessageSquarePlus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Feedback Dev</h3>
                                    <p className="text-xs text-gray-500">Herramienta de desarrollo</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
                            <button
                                onClick={() => setActiveTab('new')}
                                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'new'
                                        ? 'text-violet-600 border-b-2 border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Send className="w-4 h-4" />
                                Nuevo
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'history'
                                        ? 'text-violet-600 border-b-2 border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <History className="w-4 h-4" />
                                Historial
                                {localHistory.length > 0 && (
                                    <span className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">
                                        {localHistory.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* NEW TAB */}
                            {activeTab === 'new' && (
                                <>
                                    {sent ? (
                                        <div className="p-10 text-center">
                                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                <span className="text-3xl">✅</span>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white">¡Enviado!</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-4">
                                            {/* Category */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { value: 'sugerencia', emoji: '💡', label: 'Sugerencia' },
                                                    { value: 'bug', emoji: '🐛', label: 'Bug' },
                                                    { value: 'mejora', emoji: '✨', label: 'Mejora' },
                                                ].map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        onClick={() => setCategory(cat.value)}
                                                        className={`p-2 rounded-xl border-2 text-center transition-all ${category === cat.value
                                                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
                                                                : 'border-gray-200 dark:border-gray-600 hover:border-violet-300'
                                                            }`}
                                                    >
                                                        <span className="text-xl block">{cat.emoji}</span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Message */}
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Describe el bug, sugerencia o mejora..."
                                                rows={3}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none text-sm"
                                            />

                                            {/* Screenshot Section */}
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex-1 py-2 px-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                                                    >
                                                        <ImageIcon className="w-4 h-4" />
                                                        Subir imagen
                                                    </button>
                                                    <button
                                                        onClick={captureScreenshot}
                                                        disabled={capturingScreen}
                                                        className="flex-1 py-2 px-3 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {capturingScreen ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Camera className="w-4 h-4" />
                                                        )}
                                                        Capturar
                                                    </button>
                                                </div>

                                                {/* Screenshot Preview */}
                                                {screenshot && (
                                                    <div className="relative">
                                                        <img
                                                            src={screenshot}
                                                            alt="Screenshot"
                                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            onClick={() => setScreenshot(null)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Submit */}
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!message.trim() || sending}
                                                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                            >
                                                {sending ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Enviar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* HISTORY TAB */}
                            {activeTab === 'history' && (
                                <div className="p-4">
                                    {localHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <History className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-500 text-sm">Sin historial</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs text-gray-400">Guardado localmente</span>
                                                <button
                                                    onClick={clearHistory}
                                                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Limpiar
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {localHistory.map((item) => {
                                                    const catConfig = getCategoryConfig(item.category);
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${catConfig.bg} ${catConfig.text}`}>
                                                                    {catConfig.icon}
                                                                    {catConfig.label}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    {new Date(item.timestamp).toLocaleDateString('es-ES')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                                {item.message}
                                                            </p>
                                                            {item.screenshot && (
                                                                <img
                                                                    src={item.screenshot}
                                                                    alt=""
                                                                    className="mt-2 h-16 w-auto rounded border border-gray-200"
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
