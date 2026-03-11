"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { FileText, FileSpreadsheet, Download, Loader2, User, Calendar, RefreshCw } from "lucide-react";

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export default function ReportsPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Fetch students (role_id 5 = student)
            const res = await api.get('/users?roleId=5');
            setStudents(res.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (studentId: number, format: 'pdf' | 'excel') => {
        const key = `${studentId}-${format}`;
        setDownloading(key);

        try {
            const endpoint = `/reports/student/${studentId}/${selectedPeriod}/${format}`;
            const response = await api.get(endpoint, { responseType: 'blob' });

            const blob = new Blob([response.data], {
                type: format === 'pdf'
                    ? 'application/pdf'
                    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-${selectedPeriod}-${studentId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Error al descargar el reporte');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-500" />
                            Reportes de Progreso
                        </h1>
                        <p className="text-gray-500 mt-1">Descarga reportes en PDF o Excel</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Period Selector */}
                        <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                            <button
                                onClick={() => setSelectedPeriod('weekly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === 'weekly'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Semanal
                            </button>
                            <button
                                onClick={() => setSelectedPeriod('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === 'monthly'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Mensual
                            </button>
                        </div>

                        <button
                            onClick={fetchStudents}
                            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Students List */}
                {students.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No hay estudiantes registrados</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Estudiante
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Descargar Reporte
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {(student.firstName?.[0] || student.username?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {student.firstName} {student.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">@{student.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => downloadReport(student.id, 'pdf')}
                                                    disabled={downloading === `${student.id}-pdf`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {downloading === `${student.id}-pdf` ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <FileText className="w-4 h-4" />
                                                    )}
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => downloadReport(student.id, 'excel')}
                                                    disabled={downloading === `${student.id}-excel`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {downloading === `${student.id}-excel` ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <FileSpreadsheet className="w-4 h-4" />
                                                    )}
                                                    Excel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Info Card */}
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
                        ℹ️ Contenido del Reporte
                    </h3>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <li>• <strong>PDF:</strong> Resumen visual con clasificación RTI, fortalezas y áreas de mejora</li>
                        <li>• <strong>Excel:</strong> 3 hojas - Resumen, Desglose por Área, Detalle de Ejercicios</li>
                        <li>• Los reportes incluyen todos los ejercicios del período seleccionado</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
