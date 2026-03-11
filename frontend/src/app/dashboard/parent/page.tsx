"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
    Activity, Award, Calendar, ChevronRight, Clock,
    Heart, LayoutDashboard, LineChart, Loader2,
    Settings, Star, Target, TrendingUp, Users,
    Brain, Rocket, Zap, BookOpen, Trophy, HelpCircle
} from "lucide-react";
import { useTutorial } from "@/contexts/TutorialContext";
import { cn } from "@/lib/utils";

interface Child {
    id: number;
    firstName: string;
    lastName: string;
}

interface ChildProgress {
    child: Child;
    weeklyStats: {
        exercisesCompleted: number;
        pointsEarned: number;
        studyTime: number; // minutes
        streak: number;
        successRate: number;
    };
    subjectProgress: Array<{
        subject: string;
        progress: number;
        total: number;
    }>;
    recentAchievements: Array<{
        name: string;
        date: Date;
        icon: string;
    }>;
}

export default function ParentDashboardPage() {
    const { user } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [progress, setProgress] = useState<ChildProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const { startTutorial } = useTutorial();

    // Link Child State
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkCode, setLinkCode] = useState("");
    const [linkLoading, setLinkLoading] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const res = await api.get("/parents/my-children");
            setChildren(res.data);

            if (res.data.length > 0) {
                setSelectedChild(res.data[0]);
                fetchChildProgress(res.data[0].id);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchChildProgress = async (childId: number) => {
        try {
            const res = await api.get(`/parents/children/${childId}/progress`);
            setProgress(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTutorial = () => {
        startTutorial([
            {
                targetId: "child-selector",
                title: "Tus Hijos",
                content: "Selecciona a uno de tus hijos para ver su actividad y rendimiento actual en la plataforma.",
                position: "bottom"
            },
            {
                targetId: "parent-metrics",
                title: "Resumen de Actividad",
                content: "Consulta puntos ganados, tasa de éxito y tiempo de estudio acumulado esta semana.",
                position: "bottom"
            },
            {
                targetId: "subject-progress",
                title: "Progreso por Materia",
                content: "Observa el avance detallado en cada área curricular y ayuda a reforzar lo que más necesiten.",
                position: "top"
            },
            {
                targetId: "achievement-log",
                title: "Vitrina de Logros",
                content: "¡Celebra los éxitos! Aquí verás las últimas medallas y reconocimientos obtenidos.",
                position: "left"
            },
            {
                targetId: "download-report-btn",
                title: "Reportes en PDF",
                content: "Haz clic en el icono del libro para descargar un informe detallado listo para imprimir o compartir.",
                position: "right"
            }
        ]);
    };

    const handleChildChange = (child: Child) => {
        setLoading(true);
        setSelectedChild(child);
        fetchChildProgress(child.id);
    };

    const handleLinkChild = async (e: React.FormEvent) => {
        e.preventDefault();
        setLinkLoading(true);
        try {
            await api.post("/parents/link-child", { studentCode: linkCode });
            setShowLinkModal(false);
            setLinkCode("");
            fetchChildren(); // Refresh list
        } catch (err) {
            console.error(err);
        } finally {
            setLinkLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Cargando Academia Familiar...</p>
                </div>
            </div>
        );
    }

    const parentMetrics = [
        { label: "Estrellas Totales", value: progress?.weeklyStats.pointsEarned || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
        { label: "Efectividad", value: `${progress?.weeklyStats.successRate || 0}%`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
        { label: "Tiempo de Estudio", value: `${progress?.weeklyStats.studyTime || 0}m`, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
        { label: "Racha Actual", value: `${progress?.weeklyStats.streak || 0} d`, icon: Zap, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 p-6 md:p-10 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Panel de Familia
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
                        Bienvenido, <span className="text-slate-900 dark:text-white font-black underline decoration-rose-500/30 decoration-4">{user?.firstName}</span>. Supervisa el crecimiento educativo de tus hijos en tiempo real.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStartTutorial}
                        className="h-14 px-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-800 rounded-2xl font-black text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                    >
                        <HelpCircle className="w-5 h-5" />
                        GUÍA PARA PADRES
                    </button>
                    <button
                        onClick={() => setShowLinkModal(true)}
                        className="h-14 px-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-700 dark:text-white hover:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all flex items-center gap-3 shadow-sm active:scale-95"
                    >
                        <Users className="w-5 h-5 text-rose-500" />
                        VINCULAR HIJO
                    </button>
                    <button className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 shadow-xl active:scale-90 transition-all">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Micro Metrics Rejection */}
            <div id="parent-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {parentMetrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", m.bg)}>
                            <m.icon className={cn("w-7 h-7", m.color)} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left Side: Children & Progress */}
                <div className="xl:col-span-8 space-y-10">
                    {/* Children Cards */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Users className="w-6 h-6 text-rose-500" /> Mis Hijos
                            </h2>
                        </div>

                        {children.length > 0 ? (
                            <div id="child-selector" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {children.map(child => {
                                    const isSelected = selectedChild?.id === child.id;
                                    return (
                                        <div
                                            key={child.id}
                                            onClick={() => handleChildChange(child)}
                                            className={cn(
                                                "p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden",
                                                isSelected
                                                    ? "bg-white dark:bg-slate-900 border-rose-500 shadow-xl shadow-rose-100 dark:shadow-none"
                                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-rose-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-5 relative z-10">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner transition-transform group-hover:scale-105",
                                                    isSelected ? "bg-rose-50 dark:bg-rose-900/20" : "bg-slate-50 dark:bg-slate-800"
                                                )}>
                                                    {isSelected ? "🚀" : "👶"}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                                        {child.firstName}
                                                    </h3>
                                                    <p className="text-sm font-bold text-rose-500 uppercase tracking-widest">
                                                        {isSelected ? "Viendo Progreso" : "Ver Detalles"}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <button
                                                        id="download-report-btn"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            try {
                                                                const res = await api.get(`/reports/student/${child.id}/weekly/pdf`, {
                                                                    responseType: 'blob'
                                                                });
                                                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.setAttribute('download', `reporte-semanal-${child.firstName}.pdf`);
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                link.remove();
                                                            } catch (err) {
                                                                console.error("Error downloading report:", err);
                                                            }
                                                        }}
                                                        className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
                                                        title="Descargar Reporte Semanal"
                                                    >
                                                        <BookOpen className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                            {/* Subtle background decoration */}
                                            <Activity className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-50 dark:text-white/5 opacity-50" />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                                <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">No hay hijos vinculados</h3>
                                <p className="text-slate-500 mt-2 mb-8">Usa el código STU-XXXX para conectar un perfil.</p>
                                <button
                                    onClick={() => setShowLinkModal(true)}
                                    className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-rose-600 transition-all"
                                >
                                    VINCULAR AHORA
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Detailed Progress Table/Grid */}
                    {progress && (
                        <div id="subject-progress" className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-emerald-500" /> Rendimiento Académico
                                    </h3>
                                    <p className="text-slate-500 font-medium">Ejercicios completados por cada área de estudio.</p>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase">
                                    CORTE SEMANAL
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {progress.subjectProgress.map((subject, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all group">
                                        <div className="flex justify-between items-end mb-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">{subject.subject}</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{subject.total} Retos</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-slate-900 dark:text-white">{subject.progress}%</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full transition-all duration-1000 group-hover:brightness-110"
                                                style={{ width: `${subject.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Activity & Milestones */}
                <div className="xl:col-span-4 space-y-10">
                    <div id="achievement-log" className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-slate-900 space-y-6 shadow-2xl relative overflow-hidden">
                        <Trophy className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight">Logros de {selectedChild?.firstName}</h3>
                                <p className="text-slate-400 dark:text-slate-500 font-medium">Medallas y distinciones recientes.</p>
                            </div>

                            {progress?.recentAchievements && progress.recentAchievements.length > 0 ? (
                                <div className="space-y-4">
                                    {progress.recentAchievements.map((ach, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-50 rounded-2xl border border-white/10 dark:border-slate-100 hover:scale-105 transition-all cursor-pointer">
                                            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                                                {ach.icon || "🏆"}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm leading-tight">{ach.name}</p>
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">
                                                    {new Date(ach.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center opacity-40">
                                    <Star className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Aún sin medallas esta semana</p>
                                </div>
                            )}

                            <button className="w-full py-4 bg-white/10 dark:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 dark:hover:bg-slate-200 transition-all border border-white/10">
                                VER TODA LA VITRINA
                            </button>
                        </div>
                    </div>

                    {/* Quick Link Ad / Support */}
                    <div className="p-10 bg-gradient-to-br from-indigo-500 to-violet-700 rounded-[3rem] text-white space-y-6 shadow-xl relative overflow-hidden group">
                        <Brain className="absolute -bottom-6 -left-6 w-40 h-40 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-2xl font-black tracking-tighter leading-none">¿Dudas con el currículum?</h4>
                            <p className="text-indigo-100 font-medium text-sm leading-relaxed">
                                Nuestro equipo psicopedagógico ha preparado guías para que acompañes el aprendizaje en casa.
                            </p>
                            <button className="h-12 px-6 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
                                LEER GUÍAS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link Child Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <button
                            onClick={() => setShowLinkModal(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 rotate-90" />
                        </button>

                        <div className="flex flex-col items-center gap-6 text-center mb-8">
                            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center text-rose-500">
                                <Users className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Vincular Hijo</h2>
                                <p className="text-slate-500 font-medium px-4">
                                    Ingresa el código único del estudiante para conectarlo a tu red familiar.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleLinkChild} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Código del Estudiante</label>
                                <input
                                    type="text"
                                    value={linkCode}
                                    onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                                    placeholder="STU-XXXX-XXXX"
                                    className="w-full h-16 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-rose-500 rounded-2xl px-6 text-xl text-center font-black tracking-[0.2em] outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={linkLoading}
                                className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {linkLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        VINCULAR AHORA <Rocket className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
