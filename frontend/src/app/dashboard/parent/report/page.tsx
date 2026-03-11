'use client';

import { useEffect, useState, useRef } from 'react';
import { Download, Trophy, Flame, Star, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import ProgressChart from '@/components/parent/ProgressChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ParentReportData {
    student: {
        id: number;
        firstName: string;
        lastName: string;
    };
    period: string;
    summary: {
        totalPoints: number;
        exercisesCompleted: number;
        activeDays: number;
        overallPerformance: 'excellent' | 'good' | 'needs_improvement';
    };
    areaProgress: Array<{
        area: string;
        score: number;
        expected: number;
        trend: 'up' | 'down' | 'stable';
    }>;
    strengths: string[];
    improvementAreas: string[];
    achievements: Array<{
        name: string;
        icon: string;
        date: string;
    }>;
    recommendations: string[];
}

export default function ParentReportPage() {
    const { showToast } = useToast();
    const [reportData, setReportData] = useState<ParentReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            // Get parent's first child (simplified for demo)
            const token = localStorage.getItem('token');
            if (!token) return;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const parentId = payload.sub;

            // Mock data for development
            setReportData(generateMockReport());
        } catch (error) {
            console.error('Error fetching report:', error);
            showToast('Error al cargar el reporte', 'error');
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        if (!reportRef.current) return;

        setExporting(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                logging: false,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            const fileName = `reporte_${reportData?.student.firstName}_${new Date().toISOString().slice(0, 10)}.pdf`;
            pdf.save(fileName);

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

    if (!reportData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay datos de reporte disponibles</p>
            </div>
        );
    }

    const performanceConfig = {
        excellent: { bg: 'bg-green-50', text: 'text-green-700', label: '¡Excelente semana!' },
        good: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Buena semana' },
        needs_improvement: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Puede mejorar' }
    };

    const config = performanceConfig[reportData.summary.overallPerformance];

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            {/* Export Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Progreso</h1>
                    <p className="text-gray-500">Semana del {reportData.period}</p>
                </div>
                <button
                    onClick={exportToPDF}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    {exporting ? 'Exportando...' : 'Descargar PDF'}
                </button>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-8">
                {/* Header */}
                <div className={`${config.bg} p-6 rounded-xl border-2 border-${config.text.replace('text-', '')}`}>
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

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={Star} label="Puntos Ganados" value={reportData.summary.totalPoints.toString()} color="yellow" />
                    <StatCard icon={BookOpen} label="Ejercicios" value={reportData.summary.exercisesCompleted.toString()} color="blue" />
                    <StatCard icon={Calendar} label="Días Activos" value={`${reportData.summary.activeDays}/7`} color="green" />
                </div>

                {/* Progress by Area */}
                <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Progreso por Área
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {reportData.areaProgress.map((area, idx) => (
                            <ProgressChart
                                key={idx}
                                area={area.area}
                                current={area.score}
                                expected={area.expected}
                                trend={area.trend}
                            />
                        ))}
                    </div>
                </div>

                {/* Strengths */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3 text-green-900 dark:text-green-100 flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        Fortalezas
                    </h3>
                    <ul className="space-y-2">
                        {reportData.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-green-800 dark:text-green-200">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvement Areas */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Flame className="w-6 h-6" />
                        Áreas de Mejora
                    </h3>
                    <ul className="space-y-2">
                        {reportData.improvementAreas.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                                <span className="text-blue-600 mt-1">💪</span>
                                <span>{area}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Achievements */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">🏆 Logros de la Semana</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {reportData.achievements.map((achievement, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200 text-center">
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <p className="font-bold text-sm text-gray-900">{achievement.name}</p>
                                <p className="text-xs text-gray-600">{new Date(achievement.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-2 border-purple-200">
                    <h3 className="text-xl font-bold mb-3 text-purple-900 dark:text-purple-100">💡 Actividades Recomendadas en Casa</h3>
                    <ul className="space-y-2">
                        {reportData.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-purple-800 dark:text-purple-200">
                                <span className="text-purple-600 mt-1">→</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Helper component for stat cards
const StatCard = ({ label, value, icon: Icon, color }: {
    label: string;
    value: number | string;
    icon: any;
    color: 'yellow' | 'blue' | 'green';
}) => {
    const colors = {
        yellow: 'border-yellow-400 bg-yellow-50',
        blue: 'border-blue-400 bg-blue-50',
        green: 'border-green-400 bg-green-50'
    };

    return (
        <div className={`p-5 rounded-xl border-2 ${colors[color]} text-center`}>
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{label}</p>
        </div>
    );
};

function generateMockReport(): ParentReportData {
    return {
        student: {
            id: 6,
            firstName: 'Ana',
            lastName: 'García'
        },
        period: '10-16 Diciembre 2025',
        summary: {
            totalPoints: 450,
            exercisesCompleted: 28,
            activeDays: 5,
            overallPerformance: 'excellent'
        },
        areaProgress: [
            { area: 'Matemáticas', score: 85, expected: 70, trend: 'up' },
            { area: 'Lectura', score: 75, expected: 70, trend: 'stable' },
            { area: 'Atención', score: 90, expected: 75, trend: 'up' },
            { area: 'Memoria', score: 65, expected: 70, trend: 'down' }
        ],
        strengths: [
            'Excelente resolución de problemas matemáticos',
            'Muy buena concentración en ejercicios largos',
            'Progreso constante en todas las áreas'
        ],
        improvementAreas: [
            'Practicar más la comprensión lectora',
            'Ejercicios de memoria visual'
        ],
        achievements: [
            { name: 'Racha 5 días', icon: '🔥', date: '2025-12-15' },
            { name: 'Nivel 3 alcanzado', icon: '⭐', date: '2025-12-14' },
            { name: '100 puntos en un día', icon: '💯', date: '2025-12-13' }
        ],
        recommendations: [
            'Leer juntos 10 minutos antes de dormir',
            'Juegos de memoria (cartas, Simon dice)',
            'Practicar sumas y restas en actividades diarias (compras, cocinar)'
        ]
    };
}
