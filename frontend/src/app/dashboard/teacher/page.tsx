"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity, ArrowRight, BarChart3, Bell, BookOpen,
    Calendar, CheckCircle2, ChevronRight, GraduationCap,
    LayoutDashboard, LineChart, Loader2, MousePointer2,
    Search, Settings, ShieldAlert, Star, TrendingUp, Users,
    PieChart as PieIcon
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTutorial } from "@/contexts/TutorialContext";
import { HelpCircle } from "lucide-react";

interface Class {
    id: number;
    name: string;
    gradeLevel: string;
    students: any[];
}

interface EvolutionData {
    date: string;
    successRate: number;
    totalAttempts: number;
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function TeacherDashboardPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [evolution, setEvolution] = useState<EvolutionData[]>([]);
    const [loading, setLoading] = useState(true);
    const { startTutorial } = useTutorial();

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const fetchMyClasses = async () => {
        try {
            const res = await api.get("/teachers/my-classes");
            setClasses(res.data);

            if (res.data.length > 0) {
                fetchClassDetails(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassDetails = async (classId: number) => {
        setLoading(true);
        try {
            const [detailsRes, evolutionRes] = await Promise.all([
                api.get(`/teachers/classes/${classId}`),
                api.get(`/teachers/classes/${classId}/performance`)
            ]);
            setSelectedClass(detailsRes.data);
            setEvolution(evolutionRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTutorial = () => {
        startTutorial([
            {
                targetId: "class-selector",
                title: "Tus Aulas",
                content: "Aquí verás todas las clases a las que tienes acceso. Haz clic en una para ver sus detalles específicos.",
                position: "bottom"
            },
            {
                targetId: "teacher-metrics",
                title: "Métricas en Tiempo Real",
                content: "Monitoriza el éxito promedio, racha de actividad y alertas de RtI Tier 3 para una intervención rápida.",
                position: "bottom"
            },
            {
                targetId: "evolution-chart",
                title: "Evolución Temporal",
                content: "Visualiza cómo progresa tu aula a lo largo del tiempo y detecta tendencias de aprendizaje.",
                position: "right"
            },
            {
                targetId: "rti-pie",
                title: "Distribución RtI",
                content: "Una vista rápida de cuántos estudiantes se encuentran en cada nivel de apoyo pedagógico.",
                position: "left"
            },
            {
                targetId: "student-list",
                title: "Expedientes Académicos",
                content: "Configura planes específicos y consulta la evolución individual de cada estudiante.",
                position: "top"
            },
            {
                targetId: "report-export",
                title: "Generación de Informes",
                content: "Exporta un reporte profesional en PDF con toda la analítica consolidada para tus reuniones pedagógicas.",
                position: "left"
            }
        ]);
    };

    if (loading && classes.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-16 w-16 animate-spin text-emerald-600" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Cargando Academia Docente...</p>
                </div>
            </div>
        );
    }

    const tier3Count = selectedClass?.students?.filter((s: any) => s.stats?.rtiTier === 3).length || 0;
    const avgEfficacy = evolution.length > 0
        ? Math.round(evolution.reduce((acc, curr) => acc + curr.successRate, 0) / evolution.length)
        : 0;

    const teacherMetrics = [
        { label: "Eficacia Promedio", value: `${avgEfficacy}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", sub: "+5% vs mes anterior" },
        { label: "En Riesgo (Tier III)", value: tier3Count, icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30", sub: "Requieren atención" },
        { label: "Actividad Semanal", value: evolution.reduce((acc, curr) => acc + curr.totalAttempts, 0), icon: Activity, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", sub: "Retos superados" },
        { label: "Alumnos Activos", value: selectedClass?.students?.length || 0, icon: Users, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", sub: "En esta sección" },
    ];

    const pieData = selectedClass ? [
        { name: 'Tier 1', value: selectedClass.tierDistribution?.tier1 || 0 },
        { name: 'Tier 2', value: selectedClass.tierDistribution?.tier2 || 0 },
        { name: 'Tier 3', value: selectedClass.tierDistribution?.tier3 || 0 },
    ].filter(d => d.value > 0) : [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 p-6 md:p-10 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none transition-transform hover:rotate-6">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Panel Docente
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
                        Gestiona tus aulas y monitoriza el progreso del modelo <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-tighter uppercase">RtI Tiered Support</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStartTutorial}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-emerald-600 font-black hover:bg-emerald-50 transition-all active:scale-95"
                    >
                        <HelpCircle className="w-5 h-5" />
                        GUÍA DE USO
                    </button>
                    <div className="hidden lg:flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm italic text-slate-400 font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Sistema de Analítica Activo
                    </div>
                </div>
            </div>

            {/* Class Selector Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs px-1">Mis Aulas Asignadas</h2>
                    {classes.length > 0 && <span className="text-xs font-black text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full uppercase tracking-widest">{classes.length} Aulas</span>}
                </div>
                <div id="class-selector" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {classes.map((cls) => (
                        <button
                            key={cls.id}
                            onClick={() => fetchClassDetails(cls.id)}
                            className={cn(
                                "relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col gap-4 text-left group overflow-hidden",
                                selectedClass?.id === cls.id
                                    ? "bg-white dark:bg-slate-900 border-emerald-600 shadow-xl shadow-emerald-100 dark:shadow-none"
                                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:shadow-md"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
                                selectedClass?.id === cls.id ? "bg-emerald-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                            )}>
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{cls.name}</h3>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{cls.gradeLevel}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-between relative z-10">
                                <span className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400">
                                    {cls.students?.length || 0} ESTUDIANTES
                                </span>
                                {selectedClass?.id === cls.id && <ArrowRight className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <span className="absolute -bottom-6 -right-4 text-9xl font-black text-slate-50 dark:text-white/5 opacity-50 select-none group-hover:scale-110 transition-transform">
                                {cls.id}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {selectedClass && (
                <>
                    {/* Micro Metrics Section */}
                    <div id="teacher-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teacherMetrics.map((m, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
                                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3", m.bg)}>
                                    <m.icon className={cn("w-8 h-8", m.color)} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-1">{m.value}</p>
                                    <p className="text-[10px] font-bold text-slate-400 italic">{m.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Performance Evolution Chart */}
                        <div id="evolution-chart" className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <BarChart3 className="w-6 h-6 text-blue-500" /> Evolución del Aula
                                </h3>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-black text-slate-500 tracking-widest uppercase">
                                    EFICACIA TEMPORAL
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={evolution}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            tickFormatter={(str) => {
                                                const d = new Date(str);
                                                return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                                            }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            domain={[0, 100]}
                                            unit="%"
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800 }}
                                            formatter={(value: any) => [`${value}%`, 'Eficacia']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="successRate"
                                            stroke="#10b981"
                                            strokeWidth={6}
                                            fillOpacity={1}
                                            fill="url(#colorRate)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* RtI Distribution */}
                        <div id="rti-pie" className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-slate-900 space-y-8 shadow-2xl relative overflow-hidden">
                            <PieIcon className="absolute -top-6 -right-6 w-32 h-32 opacity-10" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-black tracking-tight">Distribución RtI</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 800 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white/5 dark:bg-slate-50 p-4 rounded-2xl border border-white/10 dark:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Tier 1 (Base)</span>
                                        </div>
                                        <span className="font-black text-xl">{selectedClass.tierDistribution?.tier1 || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 dark:bg-slate-50 p-4 rounded-2xl border border-white/10 dark:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Tier 2 (Refuerzo)</span>
                                        </div>
                                        <span className="font-black text-xl">{selectedClass.tierDistribution?.tier2 || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 dark:bg-slate-50 p-4 rounded-2xl border border-white/10 dark:border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Tier 3 (Intensivo)</span>
                                        </div>
                                        <span className="font-black text-xl">{selectedClass.tierDistribution?.tier3 || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Users className="w-6 h-6 text-emerald-600" /> Expedientes Académicos
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar estudiante..."
                                        className="h-12 pl-12 pr-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium outline-none focus:border-emerald-500 transition-all w-64 shadow-sm"
                                    />
                                </div>
                                <button
                                    id="report-export"
                                    onClick={async () => {
                                        if (!selectedClass) return;
                                        try {
                                            const res = await api.get(`/reports/class/${selectedClass.id}/pdf`, {
                                                responseType: 'blob'
                                            });
                                            const url = window.URL.createObjectURL(new Blob([res.data]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.setAttribute('download', `reporte-aula-${selectedClass.name}.pdf`);
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                        } catch (err) {
                                            console.error("Error downloading report:", err);
                                        }
                                    }}
                                    className="h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    EXPORTAR REPORTE
                                </button>
                            </div>
                        </div>

                        <div id="student-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedClass.students?.map((student: any) => (
                                <div
                                    key={student.id}
                                    onClick={() => router.push(`/dashboard/teacher/students/${student.id}`)}
                                    className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col gap-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6",
                                            student.stats?.rtiTier === 1 ? 'bg-gradient-to-br from-emerald-500 to-emerald-400' :
                                                student.stats?.rtiTier === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-400' :
                                                    'bg-gradient-to-br from-rose-600 to-rose-500'
                                        )}>
                                            {student.firstName?.[0]}{student.lastName?.[0]}
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-orange-500 font-black justify-end">
                                                <span className="text-lg">{student.stats?.streak || 0}</span>
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Días de Racha</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-black text-xl text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                                            {student.firstName} {student.lastName}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                student.stats?.rtiTier === 1 ? 'bg-emerald-100 text-emerald-600' :
                                                    student.stats?.rtiTier === 2 ? 'bg-amber-100 text-amber-600' :
                                                        'bg-rose-100 text-rose-600'
                                            )}>
                                                TIER {student.stats?.rtiTier || 1}
                                            </div>
                                            <div className="flex-1 h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-1000"
                                                    style={{ width: `${student.stats?.successRate || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase">
                                                {student.stats?.successRate || 0}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {student.stats?.totalAttempts || 0} RETOS SUPERADOS
                                        </p>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Global Empty State */}
            {classes.length === 0 && !loading && (
                <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                    <Users className="w-24 h-24 mx-auto mb-6 text-slate-100" />
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">Aulas no encontradas</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                        Contacta con tu coordinador para que asigne tus aulas de este curso académico.
                    </p>
                </div>
            )}
        </div>
    );
}
