"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/contexts/ToastContext";
import { Shield, AlertTriangle, CheckCircle, XCircle, UserX } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ModerationReport {
    id: number;
    reporterId: number;
    reportedUserId?: number;
    reason: string;
    description: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: string;
    reporter: { username: string };
    reportedUser?: { username: string };
}

export default function ModerationPage() {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get("/moderation/reports");
            setReports(res.data);
        } catch (error) {
            console.error("Error fetching reports", error);
            showToast("No tienes permisos para ver reportes", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: number, status: 'resolved' | 'dismissed') => {
        try {
            await api.patch(`/moderation/reports/${id}/resolve`, { status });
            showToast(`Reporte ${status === 'resolved' ? 'resuelto' : 'descartado'}`, "success");
            fetchReports(); // Refresh
        } catch (error) {
            showToast("Error al actualizar reporte", "error");
        }
    };

    return (
        <div className="space-y-8 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-red-500" />
                    Panel de Moderación
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Gestiona reportes de contenido y usuarios.
                </p>
            </header>

            <div className="grid gap-6">
                {loading ? (
                    <p>Cargando reportes...</p>
                ) : reports.length === 0 ? (
                    <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Todo limpio</h3>
                        <p className="text-gray-500">No hay reportes pendientes de revisión.</p>
                    </Card>
                ) : (
                    reports.map(report => (
                        <Card key={report.id} className="overflow-hidden border-l-4 border-l-orange-500">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={report.status === 'pending' ? 'destructive' : 'outline'}>
                                                {report.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-sm text-gray-400">
                                                {format(new Date(report.createdAt), "PPP p", { locale: es })}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                                            {report.reason}
                                        </h3>

                                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                                            "{report.description}"
                                        </p>

                                        <div className="flex items-center gap-4 text-sm mt-4">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <span>Reportado por:</span>
                                                <span className="font-bold text-gray-900 dark:text-white">@{report.reporter.username}</span>
                                            </div>
                                            {report.reportedUser && (
                                                <div className="flex items-center gap-1 text-red-500 font-medium">
                                                    <UserX className="w-4 h-4" />
                                                    <span>Usuario Reportado: @{report.reportedUser.username}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {report.status === 'pending' && (
                                        <div className="flex flex-row md:flex-col gap-2 justify-center">
                                            <Button
                                                variant="default"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleResolve(report.id, 'resolved')}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Resolver
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleResolve(report.id, 'dismissed')}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Descartar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
