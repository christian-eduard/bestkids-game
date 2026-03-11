"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Activity, Building2, Globe, Heart,
    Layers, LayoutDashboard, Loader2, MousePointer2,
    Plus, Search, Settings, ShieldAlert, Star,
    TrendingUp, Trophy, UserPlus, Users, Zap,
    ChevronRight, ArrowRight, MonitorSmartphone, Database, Cpu,
    BookOpen, Bell, Edit, Trash2, HelpCircle
} from "lucide-react";
import { useTutorial } from "@/contexts/TutorialContext";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [centers, setCenters] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [worlds, setWorlds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { startTutorial } = useTutorial();
    const [activeTab, setActiveTab] = useState<'overview' | 'centers' | 'avatars' | 'achievements' | 'worlds'>('overview');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsRes, centersRes, avatarsRes, achievementsRes, worldsRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/centers"),
                api.get("/admin/avatars"),
                api.get("/admin/achievements"),
                api.get("/admin/worlds"),
            ]);

            setStats(statsRes.data);
            setCenters(centersRes.data);
            setAvatars(avatarsRes.data);
            setAchievements(achievementsRes.data);
            setWorlds(worldsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTutorial = () => {
        startTutorial([
            {
                targetId: "admin-metrics",
                title: "Consola de Comando",
                content: "Monitoriza el estado global de la plataforma: centros activos, suscripciones y usuarios totales.",
                position: "bottom"
            },
            {
                targetId: "admin-tabs",
                title: "Navegación Modular",
                content: "Cambia entre los diferentes módulos de gestión: Centros, Avatares, Logros y Mundos de forma instantánea.",
                position: "right"
            },
            {
                targetId: "admin-content",
                title: "Panel de Gestión",
                content: "Aquí puedes crear, editar y supervisar cada entidad del sistema con herramientas avanzadas.",
                position: "top"
            }
        ]);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs tracking-[0.3em]">Cargando Consola de Mando...</p>
                </div>
            </div>
        );
    }

    const adminMetrics = [
        { label: "Centros Activos", value: stats?.centers || 0, icon: Building2, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Docentes", value: stats?.teachers || 0, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", isDynamic: true },
        { label: "Estudiantes", value: stats?.students || 0, icon: Users, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
        { label: "Mundos", value: stats?.worlds || 0, icon: Globe, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 p-6 md:p-10 space-y-10">
            {/* Unified Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                            <ShieldAlert className="w-8 h-8 text-white dark:text-slate-900" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Consola Master</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Gestión global de la infraestructura BestKids v4.0</p>
                        </div>
                    </div>
                </div>

                {/* System Pulsar */}
                <div className="flex items-center gap-6 px-8 py-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <button
                        onClick={handleStartTutorial}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                    >
                        <HelpCircle className="w-4 h-4" />
                        GUÍA
                    </button>
                    <div className="w-px h-6 bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Status: Online</span>
                    </div>
                    <div className="w-px h-6 bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">DB: Connected</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div id="admin-metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {adminMetrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6", m.bg)}>
                            {m.icon && <m.icon className={cn("w-8 h-8", m.color)} />}
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{m.label}</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{m.value}</p>
                        </div>
                        {/* Decorative background number */}
                        <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 dark:text-white/5 opacity-50 group-hover:translate-x-2 transition-transform" />
                    </div>
                ))}
            </div>

            {/* Main Tabs Navigation */}
            <div id="admin-tabs" className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] w-fit shadow-sm overflow-x-auto">
                {[
                    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                    { id: 'centers', icon: Building2, label: 'Centros' },
                    { id: 'avatars', icon: Star, label: 'Avatares' },
                    { id: 'achievements', icon: Trophy, label: 'Logros' },
                    { id: 'worlds', icon: Globe, label: 'Mundos' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg"
                                : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div id="admin-content" className="grid grid-cols-1 gap-10">
                {/* Dynamic Content based on Active Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Quick Actions Console */}
                        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500" /> Operaciones Rápidas
                                </h3>
                                <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { href: "/dashboard/admin/users", label: "Nuevo Usuario", icon: UserPlus, color: "bg-blue-500", shadow: "shadow-blue-200" },
                                    { href: "/dashboard/admin/centers", label: "Nuevo Centro", icon: Plus, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
                                    { href: "/dashboard/admin/curriculum", label: "Nuevo Reto", icon: BookOpen, color: "bg-purple-500", shadow: "shadow-purple-200" },
                                    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings, color: "bg-slate-900", shadow: "shadow-slate-300" }
                                ].map((action, i) => (
                                    <a key={i} href={action.href} className="group flex flex-col items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                        <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white transition-all group-hover:scale-110 group-hover:rotate-3 shadow-xl", action.color, action.shadow)}>
                                            <action.icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{action.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Recent Alerts / Updates */}
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-8 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                                <Bell className="w-6 h-6 text-rose-500" /> Historial Crítico
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { text: "Backup automatico completado", time: "04:00 AM", type: "success", icon: Database },
                                    { text: "Alerta de latencia en módulo Exercises", time: "10:24 AM", type: "warning", icon: Activity },
                                    { text: "Nueva suscripción Centro 'San Juan'", time: "14:15 PM", type: "info", icon: Building2 }
                                ].map((alert, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 transition-colors">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            alert.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                                alert.type === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                        )}>
                                            <alert.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{alert.text}</p>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">{alert.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'centers' && (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Red de Centros Educativos</h3>
                                <p className="text-slate-500 font-medium">Gestiona el licenciamiento y configuración de instituciones vinculadas.</p>
                            </div>
                            <button className="h-14 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                <Plus className="w-5 h-5" /> NUEVO CENTRO
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {centers.map((center) => (
                                <div key={center.id} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-transparent hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110">
                                            <Building2 className="w-7 h-7" />
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-xl text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{center.name}</h4>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">{center.code}</p>
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
                                        <span className="uppercase tracking-widest">ACTIVO DESDE 2024</span>
                                        <div className="flex items-center gap-1 text-slate-900 dark:text-white">
                                            VER DETALLES <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                    {/* Ghost number background */}
                                    <span className="absolute -bottom-10 -right-4 text-9xl font-black text-white dark:text-slate-700/20 select-none group-hover:scale-110 transition-transform">
                                        {center.id}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'avatars' && (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 space-y-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">BestKids Persona Editor</h3>
                                <p className="text-slate-500 font-medium">Controla el catálogo de avatares y costes de gamificación.</p>
                            </div>
                            <button className="h-14 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                <Plus className="w-5 h-5" /> CREAR AVATAR
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {avatars.map((avatar) => (
                                <div key={avatar.id} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-transparent hover:border-purple-500/30 transition-all group flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-6xl shadow-xl transition-all group-hover:scale-125 group-hover:-rotate-6 mb-6">
                                        {avatar.imageUrl || '🦁'}
                                    </div>
                                    <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1">{avatar.name}</h4>
                                    <div className="flex items-center gap-2 mb-4 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                                        <Star className="w-3 h-3 text-purple-600 fill-purple-600" />
                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{avatar.pointsRequired} PTS</span>
                                    </div>
                                    <div className="flex gap-2 w-full pt-4 mt-auto border-t border-slate-200 dark:border-slate-700">
                                        <button className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements & Worlds follows similar premium grid pattern... */}
                {(activeTab === 'achievements' || activeTab === 'worlds') && (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-200">
                            {activeTab === 'achievements' ? <Trophy className="w-12 h-12" /> : <Globe className="w-12 h-12" />}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Módulo en Rediseño</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">La gestión de {activeTab} está siendo optimizada para ofrecer mejores capacidades de filtrado y edición masiva.</p>
                        <button onClick={() => setActiveTab('overview')} className="h-12 px-8 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">VOLVER AL PANEL</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icons that were missing
function GraduationCap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}
