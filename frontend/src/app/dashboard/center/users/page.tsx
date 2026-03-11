"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, GraduationCap, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CenterUsersPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teachersRes, studentsRes] = await Promise.all([
                api.get("/centers/my-center/teachers"),
                api.get("/centers/my-center/students"),
            ]);
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
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
        <div className="space-y-10 max-w-7xl mx-auto pb-20 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#2d1d2d] dark:text-white mb-2">Mis Usuarios</h1>
                    <p className="text-xl text-text-sub font-medium">Gestiona el personal docente y alumnado de tu centro.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white dark:bg-[#2d1d2d] rounded-xl border-2 border-[#f4e7f4] dark:border-[#3d253d]">
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={cn(
                            "px-6 py-2 rounded-lg font-bold transition-all",
                            activeTab === 'teachers'
                                ? "bg-purple-600 text-white shadow-md"
                                : "text-text-sub hover:text-purple-600"
                        )}
                    >
                        👨‍🏫 Profesores
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={cn(
                            "px-6 py-2 rounded-lg font-bold transition-all",
                            activeTab === 'students'
                                ? "bg-purple-600 text-white shadow-md"
                                : "text-text-sub hover:text-purple-600"
                        )}
                    >
                        👨‍🎓 Estudiantes
                    </button>
                </div>
            </div>

            {activeTab === 'teachers' ? (
                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-[#2d1d2d] dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            Listado de Profesores
                        </h2>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5" />
                            Nuevo Profesor
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {teachers.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No hay profesores registrados.</div>
                        ) : teachers.map((teacher) => (
                            <div key={teacher.id} className="p-5 bg-[#fcf8fc] dark:bg-[#3d253d]/30 rounded-2xl border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-white dark:bg-[#2d1d2d] rounded-xl flex items-center justify-center font-black text-xl text-purple-600 shadow-sm">
                                        {teacher.firstName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#2d1d2d] dark:text-white">
                                            {teacher.firstName} {teacher.lastName}
                                        </h4>
                                        <p className="text-sm text-text-sub">{teacher.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#2d1d2d] p-8 rounded-[2rem] border-4 border-[#f4e7f4] dark:border-[#3d253d] shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-[#2d1d2d] dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            Listado de Estudiantes
                        </h2>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5" />
                            Nuevo Estudiante
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {students.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No hay estudiantes registrados.</div>
                        ) : students.map((student) => (
                            <div key={student.id} className="p-5 bg-[#fcf8fc] dark:bg-[#3d253d]/30 rounded-2xl border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-900/50 transition-all flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-white dark:bg-[#2d1d2d] rounded-xl flex items-center justify-center font-black text-xl text-blue-600 shadow-sm">
                                        {student.firstName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#2d1d2d] dark:text-white">
                                            {student.firstName} {student.lastName}
                                        </h4>
                                        <p className="text-sm text-text-sub">{student.gradeLevel || 'Sin Grado'} • {student.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
