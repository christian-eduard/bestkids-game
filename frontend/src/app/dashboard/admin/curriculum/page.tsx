"use client";

import { useState, useEffect } from "react";
import {
    Plus, Edit, Trash2, FileQuestion, Save, BookOpen, GraduationCap,
    Settings, Layout, AlignLeft, AlertCircle, Info, Eye, Code, FormInput
} from "lucide-react";
import VisualExerciseForm from "@/components/admin/exercises/VisualExerciseForm";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

interface Course {
    id: number;
    name: string;
    level: string;
    units: Unit[];
}

interface Unit {
    id: number;
    title: string;
    exercises: Exercise[];
}

interface Exercise {
    id: number;
    title: string;
    description?: string;
    exerciseType: string;
    points: number;
    content?: any;
    correctAnswer?: any;
    difficultyLevel?: string;
    subjectAreaId?: number;
}

export default function CurriculumPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Create State
    const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseLevel, setNewCourseLevel] = useState("");

    const [isCreateUnitOpen, setIsCreateUnitOpen] = useState(false);
    const [newUnitTitle, setNewUnitTitle] = useState("");

    // Exercise Builder State
    const [isExerciseOpen, setIsExerciseOpen] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [exTitle, setExTitle] = useState("");
    const [exDesc, setExDesc] = useState("");
    const [exType, setExType] = useState("multiple_choice");
    const [exPoints, setExPoints] = useState("10");
    const [exDifficulty, setExDifficulty] = useState("easy");
    const [exSubjectArea, setExSubjectArea] = useState("1");
    const [exJsonContent, setExJsonContent] = useState('');
    const [exJsonAnswer, setExJsonAnswer] = useState('');
    const [editorMode, setEditorMode] = useState<"visual" | "json">("visual");

    // State for Edit
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/courses");
            setCourses(data);

            if (selectedCourse) {
                const updated = data.find((c: Course) => c.id === selectedCourse.id);
                if (updated) setSelectedCourse(updated);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
            showToast("Error al cargar cursos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCourse = async () => {
        if (!newCourseName || !newCourseLevel) {
            showToast("Completa todos los campos", "error");
            return;
        }
        try {
            if (editingCourse) {
                await api.patch(`/courses/${editingCourse.id}`, { name: newCourseName, level: newCourseLevel });
                showToast("Curso actualizado", "success");
            } else {
                await api.post("/courses", { name: newCourseName, level: newCourseLevel });
                showToast("Curso creado", "success");
            }
            setIsCreateCourseOpen(false);
            setEditingCourse(null);
            setNewCourseName("");
            setNewCourseLevel("");
            fetchCourses();
        } catch (error) { showToast("Error al guardar curso", "error"); }
    };

    const handleDeleteCourse = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("¿Eliminar curso permanentemente?")) return;
        try {
            await api.delete(`/courses/${id}`);
            showToast("Curso eliminado", "success");
            if (selectedCourse?.id === id) setSelectedCourse(null);
            fetchCourses();
        } catch (error) { showToast("Error al eliminar", "error"); }
    };

    const openEditCourse = (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCourse(course);
        setNewCourseName(course.name);
        setNewCourseLevel(course.level);
        setIsCreateCourseOpen(true);
    }

    const handleCreateUnit = async (courseId: number) => {
        if (!newUnitTitle) {
            showToast("Título obligatorio", "error");
            return;
        }
        try {
            const payload = {
                title: newUnitTitle.trim(),
                orderIndex: selectedCourse?.units?.length || 0
            };

            if (editingUnit) {
                await api.patch(`/courses/units/${editingUnit.id}`, payload);
                showToast("Unidad actualizada", "success");
            } else {
                await api.post(`/courses/${courseId}/units`, payload);
                showToast("Unidad creada", "success");
            }
            setIsCreateUnitOpen(false);
            setEditingUnit(null);
            setNewUnitTitle("");
            fetchCourses();
        } catch (error: any) {
            console.error("Error saving unit:", error.response?.data || error.message);
            showToast(error.response?.data?.message || "Error al guardar unidad", "error");
        }
    };

    const handleDeleteUnit = async (id: number) => {
        if (!confirm("¿Eliminar unidad?")) return;
        try {
            await api.delete(`/courses/units/${id}`);
            showToast("Unidad eliminada", "success");
            fetchCourses();
        } catch (error) { showToast("Error al eliminar unidad", "error"); }
    };

    const openEditUnit = (unit: Unit) => {
        setEditingUnit(unit);
        setNewUnitTitle(unit.title);
        setIsCreateUnitOpen(true);
    };

    const handleOpenExerciseBuilder = (unitId: number, exercise?: Exercise) => {
        setSelectedUnitId(unitId);
        setEditorMode("visual");
        if (exercise) {
            setEditingExercise(exercise);
            setExTitle(exercise.title);
            setExDesc(exercise.description || "");
            setExType(exercise.exerciseType);
            setExPoints(exercise.points.toString());
            setExDifficulty(exercise.difficultyLevel || "easy");
            setExSubjectArea(exercise.subjectAreaId?.toString() || "1");
            setExJsonContent(JSON.stringify(exercise.content, null, 2));
            setExJsonAnswer(JSON.stringify(exercise.correctAnswer, null, 2));
        } else {
            setEditingExercise(null);
            setExTitle("");
            setExDesc("");
            setExType("multiple_choice");
            setExPoints("10");
            handleTypeChange("multiple_choice");
        }
        setIsExerciseOpen(true);
    };

    const handleTypeChange = (val: string) => {
        setExType(val);
        switch (val) {
            case 'true_false':
                setExJsonContent('{\n  "question": "¿El sol es una estrella?"\n}');
                setExJsonAnswer('{\n  "correctAnswer": true\n}');
                break;
            case 'multiple_choice':
                setExJsonContent('{\n  "question": "¿Cuál es la capital de España?",\n  "options": [\n    {"id": 1, "text": Madrid"},\n    {"id": 2, "text": "Barcelona"}\n  ]\n}');
                setExJsonAnswer('{\n  "correctOptionId": 1\n}');
                break;
            default:
                setExJsonContent('{\n  "question": ""\n}');
                setExJsonAnswer('{\n  "correctAnswer": ""\n}');
        }
    };

    const handleCreateExercise = async () => {
        if (!selectedUnitId) return;
        try {
            const payload = {
                unitId: selectedUnitId,
                subjectAreaId: parseInt(exSubjectArea),
                title: exTitle,
                description: exDesc,
                exerciseType: exType,
                points: parseInt(exPoints),
                content: JSON.parse(exJsonContent),
                correctAnswer: JSON.parse(exJsonAnswer),
                difficultyLevel: exDifficulty,
                isActive: true,
                createdBy: user?.id || 1
            };

            if (editingExercise) {
                await api.patch(`/exercises/${editingExercise.id}`, payload);
                showToast("Ejercicio actualizado", "success");
            } else {
                await api.post("/exercises", payload);
                showToast("Ejercicio creado", "success");
            }
            setIsExerciseOpen(false);
            fetchCourses();
        } catch (error: any) {
            showToast("Error en los datos o servidor", "error");
        }
    };

    const handleDeleteExercise = async (id: number) => {
        if (!confirm("¿Eliminar ejercicio?")) return;
        try {
            await api.delete(`/exercises/${id}`);
            showToast("Eliminado con éxito", "success");
            fetchCourses();
        } catch (error) { showToast("Error al eliminar", "error"); }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 h-[calc(100vh-80px)] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">

            {/* Sidebar */}
            <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        MIS CURSOS
                    </h2>
                    <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="rounded-full text-blue-600">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="dialog-content-enterprise">
                            <DialogHeader>
                                <DialogTitle>{editingCourse ? 'Editar' : 'Nuevo'}</DialogTitle>
                                <DialogDescription>Datos del curso</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input value={newCourseName} onChange={e => setNewCourseName(e.target.value)} placeholder="Nombre" />
                                <Input value={newCourseLevel} onChange={e => setNewCourseLevel(e.target.value)} placeholder="Nivel" />
                                <Button onClick={handleCreateCourse} className="w-full">GUARDAR</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {courses.map(course => (
                        <div key={course.id} onClick={() => setSelectedCourse(course)}
                            className={cn("group p-4 rounded-2xl cursor-pointer border-2 transition-all",
                                selectedCourse?.id === course.id ? "bg-blue-600 border-blue-600 shadow-lg" : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700")}>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className={cn("font-black text-sm", selectedCourse?.id === course.id ? "text-white" : "text-slate-800 dark:text-slate-100")}>{course.name}</p>
                                    <p className={cn("text-[10px] uppercase font-bold", selectedCourse?.id === course.id ? "text-blue-100" : "text-slate-400")}>{course.level}</p>
                                </div>
                                <div className="flex gap-1 opacity-100">
                                    <button onClick={(e) => openEditCourse(course, e)} className={cn("p-1.5 rounded", selectedCourse?.id === course.id ? "text-white" : "text-slate-400")}><Edit className="w-3.5 h-3.5" /></button>
                                    <button onClick={(e) => handleDeleteCourse(course.id, e)} className={cn("p-1.5 rounded", selectedCourse?.id === course.id ? "text-white" : "text-slate-400")}><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-center py-4 text-slate-400 font-bold">CARGANDO...</div>}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
                {selectedCourse ? (
                    <>
                        <header className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedCourse.name}</h1>
                                <GraduationCap className="w-4 h-4" /> {selectedCourse.level} • {selectedCourse.units?.length || 0} Unidades
                            </div>
                            <Dialog open={isCreateUnitOpen} onOpenChange={setIsCreateUnitOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl">
                                        <Plus className="w-5 h-5 mr-2" /> NUEVA UNIDAD
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="dialog-content-enterprise">
                                    <DialogHeader>
                                        <DialogTitle>Nueva Unidad</DialogTitle>
                                        <DialogDescription>Añadir bloque de contenido</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input value={newUnitTitle} onChange={e => setNewUnitTitle(e.target.value)} placeholder="Título" />
                                        <Button onClick={() => handleCreateUnit(selectedCourse.id)} className="w-full">CREAR</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {selectedCourse.units?.map((unit, idx) => (
                                <section key={unit.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group/unit">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">{idx + 1}</span>
                                            {unit.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditUnit(unit)} className="p-2 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteUnit(unit.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleOpenExerciseBuilder(unit.id)} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-xs">
                                                AÑADIR EJERCICIO
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {unit.exercises?.map(ex => (
                                            <div key={ex.id} className="p-4 rounded-2xl border-2 border-slate-50 dark:border-slate-700 bg-white dark:bg-slate-800 group/ex relative">
                                                <div className="space-y-2">
                                                    <p className="font-bold text-slate-800 dark:text-white pr-8">{ex.title}</p>
                                                    <p className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full w-fit uppercase">{ex.exerciseType}</p>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/ex:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenExerciseBuilder(unit.id, ex)} className="p-1 text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDeleteExercise(ex.id)} className="p-1 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 uppercase font-black">
                        Selecciona un curso para empezar
                    </div>
                )}
            </main>

            {/* Exercise Builder */}
            <Dialog open={isExerciseOpen} onOpenChange={setIsExerciseOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 dialog-content-enterprise">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a0b1a]">
                        <DialogTitle className="text-3xl font-black">{editingExercise ? 'Editar Desafío' : 'Nuevo Desafío'}</DialogTitle>
                        <DialogDescription>Configuración técnica del ejercicio</DialogDescription>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8 scrollbar-hide">
                        <div className="col-span-5 space-y-4">
                            <Label className="uppercase font-black text-[10px] text-slate-400">Título</Label>
                            <Input value={exTitle} onChange={e => setExTitle(e.target.value)} placeholder="Título" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-500">Puntos</Label>
                                    <Input type="number" value={exPoints} onChange={e => setExPoints(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-500">Dificultad</Label>
                                    <Select value={exDifficulty} onValueChange={setExDifficulty}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Fácil</SelectItem>
                                            <SelectItem value="medium">Medio</SelectItem>
                                            <SelectItem value="hard">Difícil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Label className="font-bold text-xs text-slate-500">Tipo</Label>
                            <Select value={exType} onValueChange={handleTypeChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                                    <SelectItem value="true_false">V / F</SelectItem>
                                    <SelectItem value="matching">Unir</SelectItem>
                                    <SelectItem value="drag_drop">Arrastrar</SelectItem>
                                </SelectContent>
                            </Select>

                            <Textarea value={exDesc} onChange={e => setExDesc(e.target.value)} placeholder="Instrucciones..." className="h-32" />
                        </div>

                        <div className="col-span-7 flex flex-col bg-slate-900 rounded-[2rem] border-4 border-slate-800 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <Label className="text-blue-400 font-black text-xs uppercase tracking-widest">Configuración de Contenido</Label>
                                <div className="flex bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => setEditorMode("visual")}
                                        className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                                            editorMode === "visual" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
                                    >
                                        <Eye className="w-4 h-4" /> VISUAL
                                    </button>
                                    <button
                                        onClick={() => setEditorMode("json")}
                                        className={cn("px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                                            editorMode === "json" ? "bg-slate-700 text-white shadow-lg" : "text-slate-400 hover:text-white")}
                                    >
                                        <Code className="w-4 h-4" /> JSON (AVANZADO)
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {editorMode === "visual" ? (
                                    <VisualExerciseForm
                                        type={exType}
                                        content={(() => { try { return JSON.parse(exJsonContent || "{}"); } catch { return {}; } })()}
                                        answer={(() => { try { return JSON.parse(exJsonAnswer || "{}"); } catch { return {}; } })()}
                                        onChange={(c, a) => {
                                            setExJsonContent(JSON.stringify(c, null, 2));
                                            setExJsonAnswer(JSON.stringify(a, null, 2));
                                        }}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <Label className="text-emerald-400 font-bold block mb-2">JSON de Contenido</Label>
                                            <Textarea
                                                className="font-mono text-xs bg-black text-emerald-400 border-none p-4 rounded-xl min-h-[250px] ring-1 ring-slate-800 focus:ring-emerald-500"
                                                value={exJsonContent}
                                                onChange={e => setExJsonContent(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-rose-400 font-bold block mb-2">JSON de Respuesta</Label>
                                            <Textarea
                                                className="h-32 font-mono text-xs bg-black text-rose-300 border-none p-4 rounded-xl ring-1 ring-slate-800 focus:ring-rose-500"
                                                value={exJsonAnswer}
                                                onChange={e => setExJsonAnswer(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-black/20 border-t flex gap-4">
                        <Button variant="ghost" className="flex-1 h-12 font-black" onClick={() => setIsExerciseOpen(false)}>CANCELAR</Button>
                        <Button onClick={handleCreateExercise} className="flex-[2] h-12 bg-blue-600 text-white font-black rounded-xl">
                            {editingExercise ? 'GUARDAR CAMBIOS' : 'CONFIRMAR Y CREAR'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Function to replace original (passing to component)
function GraduationCapIcon() { return <GraduationCap className="w-4 h-4" /> }
