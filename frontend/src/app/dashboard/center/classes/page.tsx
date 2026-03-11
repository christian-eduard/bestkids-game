"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BookOpen, Users, Edit, Trash2, Plus, Loader2 } from "lucide-react";

export default function CenterClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await api.get("/centers/my-center/classes");
            setClasses(res.data);
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
        <div className="max-w-7xl mx-auto pb-20 p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-[#2d1d2d] dark:text-white mb-2">Mis Aulas</h1>
                    <p className="text-xl text-text-sub font-medium">Gestiona los grupos y asignaciones de tu centro.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg hover:scale-105 active:scale-95">
                    <Plus className="w-5 h-5" />
                    Nueva Aula
                </button>
            </div>

            <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2.5rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-400">No hay aulas registradas.</div>
                    ) : classes.map((cls) => (
                        <div key={cls.id} className="p-8 bg-[#fcf8fc] dark:bg-[#3d253d]/30 rounded-[2rem] border-4 border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-white dark:bg-[#2d1d2d] rounded-full text-xs font-black text-purple-600 border border-[#f4e7f4] dark:border-[#3d253d] shadow-sm">
                                        {cls.gradeLevel}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-blue-600 hover:bg-white rounded-full transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button className="p-2 text-red-600 hover:bg-white rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <h4 className="font-black text-2xl text-[#2d1d2d] dark:text-white mb-6 line-clamp-2 min-h-[4rem]">
                                    {cls.name}
                                </h4>

                                <div className="mt-auto pt-4 border-t-2 border-[#f4e7f4] dark:border-[#3d253d]/30 flex justify-between items-center text-text-sub font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {cls.students?.length || 0} Alumnos
                                    </div>
                                    <button className="text-purple-600 dark:text-purple-400 hover:underline">Ver detalles →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
