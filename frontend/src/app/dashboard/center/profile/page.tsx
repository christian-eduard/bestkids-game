"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Building2, MapPin, Phone, Mail, Save, Loader2 } from "lucide-react";

export default function CenterProfilePage() {
    const [center, setCenter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCenter();
    }, []);

    const fetchCenter = async () => {
        try {
            const res = await api.get("/centers/my-center/stats"); // Using stats endpoint as it returns center info too
            setCenter(res.data.center);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement save logic here
        // await api.patch('/centers/my-center', center);
        alert("Funcionalidad de guardado pendiente de backend para update propio.");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!center) return <div>No se encontró información del centro.</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20 p-6 space-y-8">
            <div>
                <h1 className="text-4xl font-black text-[#2d1d2d] dark:text-white mb-2">Mi Centro</h1>
                <p className="text-xl text-text-sub font-medium">Información institucional y configuración.</p>
            </div>

            <div className="bg-white dark:bg-[#2d1d2d] p-10 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="size-24 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2d1d2d] dark:text-white">{center.name}</h2>
                            <p className="text-text-sub font-mono text-sm">ID: {center.code || center.id}</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-sub uppercase tracking-wider ml-1">Nombre de la Institución</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={center.name}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#3d253d]/50 rounded-xl border-2 border-[#f4e7f4] dark:border-[#3d253d] font-bold text-[#2d1d2d] dark:text-white focus:outline-none focus:border-purple-500 cursor-not-allowed opacity-70"
                                />
                            </div>
                            <p className="text-xs text-orange-500 font-medium ml-1">Contacta al administrador para cambiar el nombre.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-sub uppercase tracking-wider ml-1">Dirección</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    defaultValue={center.address || ''}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2d1d2d] rounded-xl border-2 border-[#f4e7f4] dark:border-[#3d253d] font-bold text-[#2d1d2d] dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Calle Principal 123"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-sub uppercase tracking-wider ml-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    defaultValue={center.phone || ''}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2d1d2d] rounded-xl border-2 border-[#f4e7f4] dark:border-[#3d253d] font-bold text-[#2d1d2d] dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="+34 600 000 000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-sub uppercase tracking-wider ml-1">Email de Contacto</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    defaultValue={center.contactEmail || ''}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2d1d2d] rounded-xl border-2 border-[#f4e7f4] dark:border-[#3d253d] font-bold text-[#2d1d2d] dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="contacto@colegio.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t-2 border-[#f4e7f4] dark:border-[#3d253d] flex justify-end">
                        <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl hover:scale-105 active:scale-95">
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
