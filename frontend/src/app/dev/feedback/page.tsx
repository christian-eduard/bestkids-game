"use client";

import { useState } from "react";
import api from "@/lib/api";
import { MessageSquare, Check, Trash2, RefreshCw, Loader2, Bug, Lightbulb, Sparkles, Lock, Eye, EyeOff } from "lucide-react";

interface FeedbackItem {
    id: number;
    message: string;
    category: string;
    page: string;
    userAgent: string;
    isRead: boolean;
    createdAt: string;
    user?: { id: number; firstName: string; lastName: string; email: string; username: string };
}

// Hardcoded dev credentials - simple local login
const DEV_USER = "admin";
const DEV_PASS = "123456";

export default function FeedbackViewPage() {
    // Local auth state (not using backend)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState("");

    // Feedback state
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string>('all');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === DEV_USER && password === DEV_PASS) {
            setIsAuthenticated(true);
            setAuthError("");
            fetchData();
        } else {
            setAuthError("Credenciales incorrectas");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Try to fetch, but handle if not authenticated with backend
            const token = localStorage.getItem('token');
            if (token) {
                const [feedbackRes, statsRes] = await Promise.all([
                    api.get('/feedback'),
                    api.get('/feedback/stats'),
                ]);
                setFeedback(feedbackRes.data || []);
                setStats(statsRes.data || { total: 0, unread: 0, byCategory: [] });
            } else {
                // No token, just show empty
                setFeedback([]);
                setStats({ total: 0, unread: 0, byCategory: [] });
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedback([]);
            setStats({ total: 0, unread: 0, byCategory: [] });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await api.patch(`/feedback/${id}/read`);
            setFeedback(prev => prev.map(f => f.id === id ? { ...f, isRead: true } : f));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este feedback?')) return;
        try {
            await api.delete(`/feedback/${id}`);
            setFeedback(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'bug': return <Bug className="w-4 h-4 text-red-500" />;
            case 'mejora': return <Sparkles className="w-4 h-4 text-purple-500" />;
            default: return <Lightbulb className="w-4 h-4 text-amber-500" />;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'bug': return { label: 'Bug', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' };
            case 'mejora': return { label: 'Mejora', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' };
            default: return { label: 'Sugerencia', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' };
        }
    };

    const filteredFeedback = filter === 'all'
        ? feedback
        : filter === 'unread'
            ? feedback.filter(f => !f.isRead)
            : feedback.filter(f => f.category === filter);

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Dev Access</h1>
                        <p className="text-gray-400 text-sm mt-1">Feedback Console</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Usuario"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {authError && (
                            <p className="text-red-400 text-sm text-center">{authError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // FEEDBACK VIEW (after auth)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-violet-500" />
                            Feedback de Desarrollo
                        </h1>
                        <p className="text-gray-500 mt-1">Consola de feedback (acceso dev)</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchData}
                            className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-800/30 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="px-4 py-2 text-gray-400 hover:text-red-500 text-sm"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
                            <p className="text-sm text-violet-600">Sin leer</p>
                            <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">{stats.unread}</p>
                        </div>
                        {stats.byCategory?.map((cat: { category: string; count: string }) => {
                            const config = getCategoryLabel(cat.category);
                            return (
                                <div key={cat.category} className={`${config.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
                                    <p className={`text-sm ${config.text}`}>{config.label}</p>
                                    <p className={`text-3xl font-bold ${config.text}`}>{cat.count}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {['all', 'unread', 'sugerencia', 'bug', 'mejora'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-violet-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {f === 'all' ? 'Todos' : f === 'unread' ? 'Sin leer' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {filteredFeedback.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500">No hay feedback todavía</p>
                            <p className="text-gray-400 text-sm mt-2">Los usuarios pueden enviar feedback usando el botón flotante</p>
                        </div>
                    ) : (
                        filteredFeedback.map((item) => {
                            const cat = getCategoryLabel(item.category);
                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-colors ${item.isRead
                                        ? 'border-gray-200 dark:border-gray-700 opacity-70'
                                        : 'border-violet-300 dark:border-violet-700'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cat.bg} ${cat.text}`}>
                                                    {getCategoryIcon(item.category)}
                                                    {cat.label}
                                                </span>
                                                {!item.isRead && (
                                                    <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 text-xs font-medium rounded-full">
                                                        Nuevo
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.createdAt).toLocaleString('es-ES')}
                                                </span>
                                            </div>
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{item.message}</p>
                                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                                                {item.user && (
                                                    <span>👤 {item.user.firstName || item.user.username} ({item.user.email})</span>
                                                )}
                                                {item.page && <span>📄 {item.page}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!item.isRead && (
                                                <button
                                                    onClick={() => handleMarkRead(item.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                    title="Marcar como leído"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
