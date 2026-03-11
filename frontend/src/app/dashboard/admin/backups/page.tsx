"use client";

import { useState, useEffect } from "react";
import { Database, Download, Trash2, Clock, HardDrive, Shield } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BackupFile {
    filename: string;
    size: number;
    createdAt: string;
}

export default function BackupsPage() {
    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get("/infra/backups");
            setBackups(data);
        } catch (error) {
            console.error("Failed to fetch backups", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createBackup = async () => {
        try {
            setIsCreating(true);
            showToast("Iniciando copia de seguridad... Esto puede tardar unos segundos.", "info");
            await api.post("/infra/backups");
            showToast("Copia de seguridad completada con éxito", "success");
            fetchBackups();
        } catch (error) {
            showToast("Error al crear copia de seguridad", "error");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDownload = async (filename: string) => {
        // Direct download logic usually implies opening a window, 
        // but for Auth headers we might need a blob download via axios, 
        // or simply rely on cookie auth if implemented. 
        // Assuming Axios interceptor handles token:
        try {
            const response = await api.get(`/infra/backups/${filename}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            showToast("Error en la descarga", "error");
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("¿Estás seguro de querer borrar esta copia?")) return;
        try {
            await api.delete(`/infra/backups/${filename}`);
            showToast("Copia eliminada", "success");
            setBackups(prev => prev.filter(b => b.filename !== filename));
        } catch (e) {
            showToast("Error al eliminar", "error");
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    return (
        <div className="space-y-8 animate-fade-in p-6">
            <div className="flex justify-between items-center bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="w-8 h-8 text-green-400" />
                        Centro de Seguridad
                    </h1>
                    <p className="text-slate-300 mt-2">Gestiona las copias de seguridad de la base de datos.</p>
                </div>
                <Database className="absolute right-[-20px] bottom-[-40px] w-64 h-64 text-slate-800 opacity-50" />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={createBackup}
                    disabled={isCreating}
                    className="btn-3d btn-primary"
                >
                    {isCreating ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <HardDrive className="w-4 h-4 mr-2" />}
                    {isCreating ? "Generando..." : "Crear Nueva Copia"}
                </Button>
            </div>

            <div className="grid gap-4">
                {backups.map((backup) => (
                    <Card key={backup.filename} className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
                        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 break-all">{backup.filename}</h3>
                                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(backup.createdAt).toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {formatBytes(backup.size)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleDownload(backup.filename)}>
                                    <Download className="w-4 h-4 mr-2" /> Descargar
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(backup.filename)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {backups.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No hay copias de seguridad disponibles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
