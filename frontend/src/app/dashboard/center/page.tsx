"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Loader2, Plus, Edit, Trash2, HelpCircle, FileText, Download } from "lucide-react";
import { CreateTeacherModal, CreateStudentModal, CreateClassModal } from "@/components/modals/CenterModals";
import { useTutorial } from "@/contexts/TutorialContext";
import { cn } from "@/lib/utils";

export default function CenterDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'classes'>('overview');

    // Modal states
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showClassModal, setShowClassModal] = useState(false);
    const { startTutorial } = useTutorial();

    const handleStartTutorial = () => {
        startTutorial([
            {
                targetId: 'center-header',
                title: 'Panel del Centro',
                content: 'Bienvenido a la consola de gestión de tu institución. Aquí podrás supervisar el rendimiento global.',
                position: 'bottom'
            },
            {
                targetId: 'center-stats',
                title: 'Métricas Globales',
                content: 'Visualiza rápidamente el número total de docentes, estudiantes y aulas activas.',
                position: 'bottom'
            },
            {
                targetId: 'center-tabs',
                title: 'Gestión por Módulos',
                content: 'Navega entre la gestión de personal docente, alumnado y organización de aulas.',
                position: 'top'
            },
            {
                targetId: 'global-report-btn',
                title: 'Reporte Ejecutivo',
                content: 'Genera informes profesionales en PDF con el rendimiento detallado de todo tu centro.',
                position: 'left'
            }
        ]);
    };

    const handleDownloadReport = async () => {
        try {
            const centerId = stats?.center?.id;
            if (!centerId) return;

            const response = await api.get(`/reports/center/${centerId}/pdf`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_Centro_${stats.center.name.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading center report:", error);
        }
    };

    useEffect(() => {
        fetchCenterData();
    }, []);

    const fetchCenterData = async () => {
        try {
            const statsRes = await api.get("/centers/my-center/stats");
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            {/* Enterprise Header */}
            <div id="center-header" className="relative overflow-hidden bg-white dark:bg-[#2d1d2d] p-10 rounded-[3rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative z-10 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                            <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-black uppercase tracking-wider">
                            Institución Educativa
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-[#2d1d2d] dark:text-white mb-2 tracking-tight">
                        {stats?.center?.name || 'Mi Centro'}
                    </h1>
                    <p className="text-xl text-text-sub font-medium">Panel de Gestión de Centro • {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="flex flex-wrap gap-4 relative z-10 justify-center">
                    <button
                        onClick={handleStartTutorial}
                        className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-[#3d253d] text-purple-600 dark:text-purple-400 font-black rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all shadow-xl hover:scale-105 active:scale-95 group"
                    >
                        <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        GUÍA DEL CENTRO
                    </button>
                    <button
                        id="global-report-btn"
                        onClick={handleDownloadReport}
                        className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 dark:shadow-none hover:scale-105 active:scale-95 group"
                    >
                        <FileText className="w-6 h-6 group-hover:bounce transition-all" />
                        EXPORTAR REPORTE
                    </button>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </div>

            {/* Stats Overview */}
            <div id="center-stats" className="grid gap-8 md:grid-cols-3">
                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-purple-100 dark:bg-purple-900/30 rounded-3xl group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-text-sub font-black text-sm uppercase tracking-widest mb-1">Docentes</p>
                            <p className="text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">
                                {stats?.stats?.teachers || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-blue-100 dark:bg-blue-900/30 rounded-3xl group-hover:scale-110 transition-transform">
                            <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-text-sub font-black text-sm uppercase tracking-widest mb-1">Estudiantes</p>
                            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                                {stats?.stats?.students || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-green-100 dark:bg-green-900/30 rounded-3xl group-hover:scale-110 transition-transform">
                            <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-text-sub font-black text-sm uppercase tracking-widest mb-1">Aulas</p>
                            <p className="text-4xl font-black text-green-600 dark:text-green-400 tracking-tighter">
                                {stats?.stats?.classes || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Aqui podríamos poner gráficas de actividad en el futuro */}
                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] h-64 flex items-center justify-center">
                    <p className="text-text-sub font-medium">Gráfico de Actividad (Próximamente)</p>
                </div>
                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] h-64 flex items-center justify-center">
                    <p className="text-text-sub font-medium">Distribución de Niveles (Próximamente)</p>
                </div>
            </div>
        </div>
    );
}
