'use client';

import { useEffect, useState } from 'react';
import { Download, Trophy, Flame, Star, BookOpen, TrendingUp, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import ProgressChart from '@/components/parent/ProgressChart';

interface ParentReportData {
    student: { id: number; firstName: string; lastName: string; };
    period: string;
    summary: {
        totalPoints: number;
        exercisesCompleted: number;
        activeDays: number;
        overallPerformance: 'excellent' | 'good' | 'needs_improvement';
    };
    areaProgress: Array<{ area: string; score: number; expected: number; trend: 'up' | 'down' | 'stable'; }>;
    strengths: string[];
    improvementAreas: string[];
    achievements: Array<{ name: string; icon: string; date: string; }>;
    recommendations: string[];
}

export default function ParentReportPage() {
    const { showToast } = useToast();
    const [reportData, setReportData] = useState<ParentReportData | null>(null);
    const [studentId, setStudentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        fetchStudentAndReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const fetchStudentAndReport = async () => {
        setLoading(true);
        setNoData(false);
        try {
            const childrenRes = await api.get('/users/my-children');
            const children = childrenRes.data;
            if (!children || children.length === 0) { setNoData(true); return; }
            const child = children[0];
            setStudentId(child.id);
            const reportRes = await api.get(`/reports/student/${child.id}/${period}`);
            setReportData(reportRes.data);
        } catch (error: any) {
            console.error('Error fetching report:', error);
            setNoData(true);
            if (error?.response?.status !== 404 && error?.response?.status !== 400) {
                showToast('Error al cargar el reporte', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        if (!studentId) return;
        setExporting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reports/student/${studentId}/${period}/pdf`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response.ok) throw new Error('Error generando PDF');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-${period}-${reportData?.student.firstName || 'alumno'}-${new Date().toISOString().slice(0, 10)}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Reporte descargado exitosamente', 'success');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            showToast('Error al exportar PDF', 'error');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (noData || !reportData) {
        return (
            <div className="max-w-2xl mx-auto mt-12 text-center">
                <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-10">
                    <AlertCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Aún no hay datos de progreso</h2>
                    <p className="text-gray-500 mb-6">
                        El informe aparecerá automáticamente cuando tu hijo/a comience a realizar ejercicios.
                        Los datos se actualizan en tiempo real.
                    </p>
                    <div className="bg-white rounded-xl p-4 text-left space-y-1 mb-6 border border-purple-100">
                        <p className="font-semibold text-purple-700 text-sm mb-2">¿Qué aparecerá aquí?</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>⭐ Puntos y ejercicios completados</li>
                            <li>📈 Progreso por área (Matemáticas, Lectura...)</li>
                            <li>🏆 Logros desbloqueados</li>
                            <li>💡 Recomendaciones personalizadas</li>
                            <li>📄 Descarga del informe en PDF</li>
                        </ul>
                    </div>
                    <button
                        onClick={fetchStudentAndReport}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" /> Actualizar
                    </button>
                </div>
            </div>
        );
    }

    const performanceConfig = {
        excellent: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: '¡Excelente período!' },
        good: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Buen período' },
        needs_improvement: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Puede mejorar' },
    };
    const config = performanceConfig[reportData.summary.overallPerformance] || performanceConfig.good;

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Progreso</h1>
                    <p className="text-gray-500">Período: {reportData.period}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button onClick={() => setPeriod('weekly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'weekly' ? 'bg-white text-purple-700 shadow' : 'text-gray-500'}`}>Semanal</button>
                        <button onClick={() => setPeriod('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'monthly' ? 'bg-white text-purple-700 shadow' : 'text-gray-500'}`}>Mensual</button>
                    </div>
                    <button onClick={exportToPDF} disabled={exporting} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
                        <Download className="w-5 h-5" />
                        {exporting ? 'Exportando...' : 'Descargar PDF'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-8">
                <div className={`${config.bg} p-6 rounded-xl border-2 ${config.border}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                            {reportData.student.firstName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{reportData.student.firstName} {reportData.student.lastName}</h2>
                            <p className={`text-lg font-semibold ${config.text}`}>{config.label}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={Star} label="Puntos Ganados" value={reportData.summary.totalPoints.toString()} color="yellow" />
                    <StatCard icon={BookOpen} label="Ejercicios" value={reportData.summary.exercisesCompleted.toString()} color="blue" />
                    <StatCard icon={Calendar} label="Días Activos" value={`${reportData.summary.activeDays}/7`} color="green" />
                </div>

                {reportData.areaProgress?.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-purple-600" /> Progreso por Área</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {reportData.areaProgress.map((area, idx) => (
                                <ProgressChart key={idx} area={area.area} current={area.score} expected={area.expected} trend={area.trend} />
                            ))}
                        </div>
                    </div>
                )}

                {reportData.strengths?.length > 0 && (
                    <div className="bg-green-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-3 text-green-900 flex items-center gap-2"><Trophy className="w-6 h-6" /> Fortalezas</h3>
                        <ul className="space-y-2">
                            {reportData.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-green-800"><span className="text-green-600 mt-1">✓</span><span>{s}</span></li>)}
                        </ul>
                    </div>
                )}

                {reportData.improvementAreas?.length > 0 && (
                    <div className="bg-blue-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-3 text-blue-900 flex items-center gap-2"><Flame className="w-6 h-6" /> Áreas de Mejora</h3>
                        <ul className="space-y-2">
                            {reportData.improvementAreas.map((a, i) => <li key={i} className="flex items-start gap-2 text-blue-800"><span className="text-blue-600 mt-1">💪</span><span>{a}</span></li>)}
                        </ul>
                    </div>
                )}

                {reportData.achievements?.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">🏆 Logros del Período</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {reportData.achievements.map((a, i) => (
                                <div key={i} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200 text-center">
                                    <div className="text-4xl mb-2">{a.icon}</div>
                                    <p className="font-bold text-sm text-gray-900">{a.name}</p>
                                    <p className="text-xs text-gray-600">{new Date(a.date).toLocaleDateString('es-ES')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {reportData.recommendations?.length > 0 && (
                    <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                        <h3 className="text-xl font-bold mb-3 text-purple-900">💡 Actividades Recomendadas en Casa</h3>
                        <ul className="space-y-2">
                            {reportData.recommendations.map((r, i) => <li key={i} className="flex items-start gap-2 text-purple-800"><span className="text-purple-600 mt-1">→</span><span>{r}</span></li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: 'yellow' | 'blue' | 'green'; }) => {
    const colors = { yellow: 'border-yellow-400 bg-yellow-50', blue: 'border-blue-400 bg-blue-50', green: 'border-green-400 bg-green-50' };
    return (
        <div className={`p-5 rounded-xl border-2 ${colors[color]} text-center`}>
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{label}</p>
        </div>
    );
};
