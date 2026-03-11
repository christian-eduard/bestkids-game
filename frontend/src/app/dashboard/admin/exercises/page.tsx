"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/ConfirmModal";
import {
    Puzzle, Plus, Search, Edit2, Trash2, Filter,
    ChevronRight, BarChart3, Star, Layers, Zap, BookOpen, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Exercise {
    id: number;
    title: string;
    exerciseType: string;
    difficultyLevel: string;
    points: number;
    isActive: boolean;
    subjectAreaName?: string;
    courseName?: string;
    courseId?: number;
    unitName?: string;
}

interface Course {
    id: number;
    title: string;
    level: string;
}

export default function ExercisesAdminPage() {
    const { showToast } = useToast();
    const confirm = useConfirm();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<number | null>(null);

    // Modal state
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [savingCourse, setSavingCourse] = useState(false);

    useEffect(() => {
        fetchExercises();
        fetchCourses();
    }, []);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/exercises");
            setExercises(res.data);
        } catch (err) {
            console.error(err);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data || []);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: "Eliminar Ejercicio",
            message: "¿Estás seguro de que quieres eliminar este ejercicio? Esta acción no se puede deshacer.",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "danger"
        });
        if (!confirmed) return;

        setDeleting(id);
        try {
            await api.delete(`/exercises/${id}`);
            showToast("Ejercicio eliminado", "success");
            setExercises(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            showToast("Error al eliminar", "error");
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (id: number) => {
        window.location.href = `/dashboard/admin/curriculum?editExercise=${id}`;
    };

    const openAssignCourseModal = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setSelectedCourseId(exercise.courseId ? exercise.courseId.toString() : "");
        setShowCourseModal(true);
    };

    const handleSaveCourse = async () => {
        if (!selectedExercise) return;

        setSavingCourse(true);
        try {
            await api.patch(`/exercises/${selectedExercise.id}`, {
                courseId: selectedCourseId ? parseInt(selectedCourseId) : null
            });

            showToast("Curso actualizado correctamente", "success");

            // Update local state
            const updatedCourse = courses.find(c => c.id.toString() === selectedCourseId);
            setExercises(prev => prev.map(ex => {
                if (ex.id === selectedExercise.id) {
                    return {
                        ...ex,
                        courseId: selectedCourseId ? parseInt(selectedCourseId) : undefined,
                        courseName: updatedCourse ? updatedCourse.title : undefined
                    };
                }
                return ex;
            }));

            setShowCourseModal(false);
        } catch (error) {
            console.error(error);
            showToast("Error al actualizar el curso", "error");
        } finally {
            setSavingCourse(false);
        }
    };

    const filteredExercises = exercises.filter(ex =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.exerciseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.courseName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const metrics = [
        { label: "Total Ejercicios", value: exercises.length, icon: Puzzle, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/30" },
        { label: "Dificultad Alta", value: exercises.filter(e => e.difficultyLevel === 'hard').length, icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/30" },
        { label: "Puntos Promedio", value: exercises.length ? Math.round(exercises.reduce((acc, e) => acc + e.points, 0) / exercises.length) : 0, icon: Star, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest">
                            Biblioteca de Contenido
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Puzzle className="w-10 h-10 text-purple-500" />
                        Gestión de Ejercicios
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                        Control total sobre los retos educativos.
                    </p>
                </div>

                <Button
                    onClick={() => window.location.href = '/dashboard/admin/curriculum'}
                    className="h-16 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-2xl shadow-purple-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
                >
                    <Plus className="w-6 h-6" />
                    <span className="text-lg uppercase">Nuevo Ejercicio</span>
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", m.bg)}>
                            <m.icon className={cn("w-7 h-7", m.color)} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título, tipo o curso..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-bold text-slate-700 dark:text-slate-200 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ejercicio</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Curso / Unidad</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dificultad</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Puntos</th>
                            <th className="px-6 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400">Cargando...</td></tr>
                        ) : filteredExercises.length === 0 ? (
                            <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400">No se encontraron ejercicios.</td></tr>
                        ) : (
                            filteredExercises.map((ex) => (
                                <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-black">
                                                {ex.title.charAt(0)}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => window.location.href = `/dashboard/admin/exercises/${ex.id}`}
                                                    className="font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors hover:underline text-left"
                                                >
                                                    {ex.title}
                                                </button>
                                                <p className="text-xs text-slate-400 font-bold">{ex.subjectAreaName || "General"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {ex.courseName ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => openAssignCourseModal(ex)}>
                                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        {ex.courseName}
                                                    </span>
                                                    <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                                </div>
                                                {ex.unitName && <p className="text-xs text-slate-400 ml-6">{ex.unitName}</p>}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openAssignCourseModal(ex)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-500 hover:text-purple-600 text-xs font-bold transition-all flex items-center gap-2"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Asignar Curso
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black border-none uppercase text-[10px] tracking-widest px-3 py-1">
                                            {ex.exerciseType}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className={cn(
                                            "font-black uppercase text-[10px] tracking-widest px-3 py-1 shadow-none border-none",
                                            ex.difficultyLevel === 'easy' ? "bg-green-100 text-green-600 dark:bg-green-900/30" :
                                                ex.difficultyLevel === 'medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                                                    "bg-red-100 text-red-600 dark:bg-red-900/30"
                                        )}>
                                            {ex.difficultyLevel}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 font-black text-slate-700 dark:text-slate-300">
                                        {ex.points} ⭐
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(ex.id)}
                                                className="p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all text-slate-400 hover:text-purple-600"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ex.id)}
                                                disabled={deleting === ex.id}
                                                className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all text-slate-400 hover:text-red-500 disabled:opacity-50"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Course Modal */}
            <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Asignar Curso</DialogTitle>
                        <DialogDescription>
                            Selecciona el curso al que pertenecerá el ejercicio "{selectedExercise?.title}".
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="course">Curso</Label>
                            <Select
                                value={selectedCourseId}
                                onValueChange={setSelectedCourseId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id.toString()}>
                                            {course.title} ({course.level})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCourseModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSaveCourse}
                            disabled={savingCourse || !selectedCourseId}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {savingCourse ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
