"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
    ClipboardList, Plus, Users, Clock, CheckCircle2, AlertCircle,
    Calendar, Loader2, Send, Trash2, Filter, BookOpen, Play,
    GraduationCap, ListTodo
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Assignment {
    id: number;
    title: string;
    instructions: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate: string | null;
    createdAt: string;
    score: number | null;
    exerciseId: number;
    classId: number | null;
    student?: { id: number; firstName: string; lastName: string };
    exercise?: { id: number; title: string; points: number };
}

interface Student {
    id: number;
    firstName: string;
    lastName: string;
}

interface Exercise {
    id: number;
    title: string;
    points: number;
    subjectAreaId: number;
}

interface Class {
    id: number;
    name: string;
    students: Student[];
}

interface Stats {
    totalAssignments: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    averageScore: number;
}

export default function AssignmentsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const isTeacher = user?.roleId === 3;
    const isStudent = user?.roleId === 5;

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Form state
    const [assignmentType, setAssignmentType] = useState<'individual' | 'class'>('individual');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (isTeacher) {
                const [assignmentsRes, studentsRes, classesRes, exercisesRes, statsRes] = await Promise.all([
                    api.get('/assignments/teacher'),
                    api.get('/users/students'),
                    api.get('/teachers/my-classes'),
                    api.get('/exercises/all'),
                    api.get('/assignments/teacher/stats'),
                ]);
                setAssignments(assignmentsRes.data);
                setStudents(studentsRes.data);
                setClasses(classesRes.data);
                setExercises(exercisesRes.data);
                setStats(statsRes.data);
            } else if (isStudent) {
                const assignmentsRes = await api.get('/assignments/my-assignments');
                setAssignments(assignmentsRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async () => {
        if (!selectedExercise) return;
        if (assignmentType === 'individual' && selectedStudents.length === 0) return;
        if (assignmentType === 'class' && !selectedClass) return;

        setSubmitting(true);
        try {
            if (assignmentType === 'class') {
                await api.post('/assignments/class', {
                    classId: selectedClass,
                    exerciseId: selectedExercise,
                    title: title || undefined,
                    instructions: instructions || undefined,
                    dueDate: dueDate || undefined,
                });
            } else if (selectedStudents.length === 1) {
                await api.post('/assignments', {
                    studentId: selectedStudents[0],
                    exerciseId: selectedExercise,
                    title: title || undefined,
                    instructions: instructions || undefined,
                    dueDate: dueDate || undefined,
                });
            } else {
                await api.post('/assignments/bulk', {
                    studentIds: selectedStudents,
                    exerciseId: selectedExercise,
                    title: title || undefined,
                    instructions: instructions || undefined,
                    dueDate: dueDate || undefined,
                });
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAssignment = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta asignación?')) return;

        try {
            await api.delete(`/assignments/${id}`);
            setAssignments(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setAssignmentType('individual');
        setSelectedStudents([]);
        setSelectedClass(null);
        setSelectedExercise(null);
        setTitle('');
        setInstructions('');
        setDueDate('');
    };

    const getStatusBadge = (status: string) => {
        const config = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pendiente', icon: Clock },
            in_progress: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'En progreso', icon: BookOpen },
            completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Completado', icon: CheckCircle2 },
            overdue: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Vencido', icon: AlertCircle },
        };
        const c = config[status as keyof typeof config] || config.pending;
        const Icon = c.icon;
        return (
            <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider font-bold", c.bg, c.text)}>
                <Icon className="w-3 h-3" />
                {c.label}
            </span>
        );
    };

    const filteredAssignments = filterStatus === 'all'
        ? assignments
        : assignments.filter(a => a.status === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isStudent) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                            <ListTodo className="w-8 h-8 text-primary" />
                            Mis Tareas
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
                            ¡Completa tus misiones para ganar premios increíbles! 🚀
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.length === 0 ? (
                        <div className="col-span-full p-16 text-center bg-white dark:bg-gray-800 rounded-[2rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
                            <div className="size-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Misión Cumplida!</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No tienes tareas hoy. ¡Disfruta explorando los mundos!</p>
                        </div>
                    ) : (
                        assignments.map((assignment) => (
                            <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative border-b-8 border-primary/20">
                                <div className={cn(
                                    "absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-10 group-hover:scale-150 transition-all duration-500",
                                    assignment.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                                )} />

                                <div className="flex justify-between items-start mb-6 z-10 relative">
                                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                                        <BookOpen className="w-7 h-7 text-primary" />
                                    </div>
                                    {getStatusBadge(assignment.status)}
                                </div>

                                <div className="mb-8 z-10 relative">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-3 tracking-tighter group-hover:text-primary transition-colors">
                                        {assignment.exercise?.title || assignment.title || 'Misión Especial'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium line-clamp-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl">
                                        {assignment.instructions || '¡Usa tus habilidades para resolver este desafío y ganar muchos puntos!'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between z-10 relative pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Premio</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/20 rounded-full border border-yellow-400/30">
                                            <span className="material-symbols-outlined text-yellow-600 text-[18px] font-black">monetization_on</span>
                                            <span className="text-yellow-700 dark:text-yellow-400 font-black text-lg">
                                                {assignment.exercise?.points || 0}
                                            </span>
                                        </div>
                                    </div>
                                    {assignment.status !== 'completed' ? (
                                        <button
                                            onClick={() => router.push(`/dashboard/play?exerciseId=${assignment.exerciseId}&assignmentId=${assignment.id}`)}
                                            className="px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            ¡JUGAR!
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Resultado</span>
                                            <span className="text-green-600 font-black text-3xl tabular-nums tracking-tighter">{assignment.score}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    // Teacher View
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-blue-500" />
                        Gestión de Asignaciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Crea y monitorea las tareas de tus estudiantes
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Asignación
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider mb-1">Total</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalAssignments}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-yellow-600 dark:text-yellow-400 tracking-wider mb-1">Pendientes</p>
                        <p className="text-3xl font-black text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800/50 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider mb-1">En curso</p>
                        <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{stats.inProgress}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800/50 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-green-600 dark:text-green-400 tracking-wider mb-1">Éxito</p>
                        <p className="text-3xl font-black text-green-700 dark:text-green-300">{stats.completed}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800/50 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider mb-1">Media</p>
                        <p className="text-3xl font-black text-purple-700 dark:text-purple-300">{stats.averageScore}%</p>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none pr-8 cursor-pointer"
                    >
                        <option value="all">Filtro: Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="in_progress">En progreso</option>
                        <option value="completed">Completados</option>
                        <option value="overdue">Vencidos</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                {filteredAssignments.length === 0 ? (
                    <div className="p-20 text-center">
                        <ClipboardList className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-6" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No hay asignaciones activas</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">Comienza asignando ejercicios a tus alumnos o aulas completas.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-primary font-black hover:underline underline-offset-4"
                        >
                            + Crear la primera asignación
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contenido</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Estudiante / Aula</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Vencimiento</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota</th>
                                    <th className="px-6 py-1 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredAssignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {assignment.exercise?.title || assignment.title || 'Ejercicio'}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[14px]">star</span>
                                                    {assignment.exercise?.points || 0} PUNTOS
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {assignment.student ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-black shadow-sm">
                                                        {assignment.student.firstName?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                        {assignment.student.firstName} {assignment.student.lastName}
                                                    </span>
                                                </div>
                                            ) : assignment.classId ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                                                        <GraduationCap className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-purple-600">Asignación Grupal</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Desconocido</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(assignment.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {assignment.dueDate
                                                    ? new Date(assignment.dueDate).toLocaleDateString()
                                                    : 'Abierta'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {assignment.score !== null ? (
                                                <div className={cn(
                                                    "inline-flex px-3 py-1 rounded-full font-black text-sm tabular-nums",
                                                    assignment.score >= 70 ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                                                        assignment.score >= 50 ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" :
                                                            "bg-red-100 dark:bg-red-900/30 text-red-600"
                                                )}>
                                                    {assignment.score}%
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 font-black">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleDeleteAssignment(assignment.id)}
                                                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-8 border-primary">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter">
                                <Plus className="w-7 h-7 text-primary" />
                                Nueva Tarea
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                                <Plus className="w-6 h-6 rotate-45 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Tipo de asignación */}
                            <div className="flex bg-gray-100/50 dark:bg-gray-700/50 p-1.5 rounded-2xl border border-gray-200/50">
                                <button
                                    onClick={() => setAssignmentType('individual')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all",
                                        assignmentType === 'individual' ? "bg-white dark:bg-gray-600 text-primary shadow-lg shadow-gray-200/50" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <Users className="w-4 h-4" />
                                    Alumno Individual
                                </button>
                                <button
                                    onClick={() => setAssignmentType('class')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all",
                                        assignmentType === 'class' ? "bg-white dark:bg-gray-600 text-primary shadow-lg shadow-gray-200/50" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Aula Completa
                                </button>
                            </div>

                            {/* Seleccionar Estudiantes o Aula */}
                            {assignmentType === 'individual' ? (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Seleccionar Alumnos
                                    </label>
                                    <div className="max-h-52 overflow-y-auto border-2 border-gray-100 dark:border-gray-700 rounded-3xl p-4 space-y-2 bg-gray-50/30">
                                        <label className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition-colors shadow-sm bg-white/50 border border-transparent hover:border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.length === students.length && students.length > 0}
                                                    onChange={(e) => setSelectedStudents(e.target.checked ? students.map(s => s.id) : [])}
                                                    className="size-5 rounded-md border-2 border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="font-black text-sm text-gray-900 dark:text-white">Seleccionar Todos</span>
                                            </div>
                                            <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                                                {students.length} TOTAL
                                            </span>
                                        </label>
                                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                                        {students.map((student) => (
                                            <label key={student.id} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition-colors shadow-sm bg-white/50 border border-transparent hover:border-primary/20">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents([...selectedStudents, student.id]);
                                                        } else {
                                                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                        }
                                                    }}
                                                    className="size-5 rounded-md border-2 border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {student.firstName} {student.lastName}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-primary pl-1 italic">
                                        {selectedStudents.length} estudiantes seleccionados
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Seleccionar Aula Escolar
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {classes.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic p-6 border-2 border-dashed rounded-3xl text-center">No hay aulas vinculadas</p>
                                        ) : (
                                            classes.map((cls) => (
                                                <button
                                                    key={cls.id}
                                                    onClick={() => setSelectedClass(cls.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-5 rounded-3xl border-2 transition-all shadow-sm",
                                                        selectedClass === cls.id
                                                            ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                                                            : "border-gray-100 hover:border-primary/20 bg-white dark:bg-gray-800"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "size-10 rounded-2xl flex items-center justify-center transition-colors",
                                                            selectedClass === cls.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                                        )}>
                                                            <GraduationCap className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col items-start leading-none">
                                                            <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{cls.name}</span>
                                                            <span className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                                                                Aula de Trabajo
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full text-[10px] font-black text-gray-500">
                                                        {cls.students?.length || 0} ALUMNOS
                                                    </div>
                                                </button>
                                            ))
                                        )
                                        }
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Ejercicio
                                    </label>
                                    <select
                                        value={selectedExercise || ''}
                                        onChange={(e) => setSelectedExercise(parseInt(e.target.value))}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm"
                                    >
                                        <option value="">Buscar ejercicio...</option>
                                        {exercises.map((ex) => (
                                            <option key={ex.id} value={ex.id}>
                                                {ex.title} ({ex.points} pts)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        Fecha Límite
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Título de la Tarea
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Misión Semanal: Explorando Fracciones"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Instrucciones
                                </label>
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Hola alumnos, en esta tarea debéis..."
                                    rows={4}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 dark:border-gray-700 flex gap-4 justify-end">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="px-8 py-4 text-gray-400 font-black hover:text-gray-600 transition-colors uppercase text-xs tracking-widest"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateAssignment}
                                disabled={!selectedExercise || (assignmentType === 'individual' ? selectedStudents.length === 0 : !selectedClass) || submitting}
                                className="flex items-center gap-3 px-10 py-4 bg-primary text-white font-black rounded-3xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 uppercase text-xs tracking-widest"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin font-black" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Asignar Tarea
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

