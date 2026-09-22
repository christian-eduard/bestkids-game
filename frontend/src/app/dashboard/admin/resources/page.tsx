"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Resource {
    id: number;
    title: string;
    description?: string;
    type: string;
    url: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const { data } = await api.get('/resources');
                setResources(Array.isArray(data) ? data : data?.data || []);
            } catch (err: any) {
                setError('No se pudieron cargar los recursos.');
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    return (
        <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-text-main">Recursos Educativos</h1>
                    <p className="text-text-sub font-medium mt-1">Gestión de materiales y recursos del sistema</p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-medium">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-text-sub">
                            <span className="material-symbols-outlined text-6xl mb-4 block text-gray-300">folder_open</span>
                            <p className="text-xl font-bold">No hay recursos disponibles</p>
                            <p className="text-sm mt-2">Los recursos aparecerán aquí cuando se añadan al sistema.</p>
                        </div>
                    ) : resources.map(resource => (
                        <div key={resource.id}
                            className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary">
                                        {resource.type === 'video' ? 'play_circle' :
                                            resource.type === 'audio' ? 'volume_up' :
                                                resource.type === 'image' ? 'image' : 'description'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-text-main truncate">{resource.title}</h3>
                                    {resource.description && (
                                        <p className="text-sm text-text-sub mt-1 line-clamp-2">{resource.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${resource.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'}`}>
                                            {resource.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <span className="text-xs text-text-sub capitalize">{resource.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
