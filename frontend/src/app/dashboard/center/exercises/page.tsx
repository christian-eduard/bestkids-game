"use client";

import { useState, useEffect } from "react";
import { WorldsService, World } from "@/services/worlds.service";
import { ExerciseService, Unit, Exercise } from "@/services/exercises.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/components/ui/ConfirmModal";
import ExercisePreview from "@/components/master/ExercisePreview";

const MECHANIC_LABELS: Record<string, string> = {
    'SEÑALAR_IMAGEN': 'Señalar Imagen',
    'OPCION_MULTIPLE': 'Opción Múltiple',
    'VERDADERO_FALSO': 'Verdadero / Falso',
    'ARRASTRAR_SILABAS': 'Arrastrar Sílabas',
    'UNIR_LINEAS': 'Unir Líneas',
    'CLASIFICAR_GRUPOS': 'Clasificar Grupos',
    'PINTAR': 'Pintar',
    'TECLADO_VIRTUAL': 'Teclado Virtual',
    'AUDIO_SELECCION': 'Audio Selección',
    'COMPLETAR_HUECOS': 'Completar Huecos',
};

const MECHANIC_ICONS: Record<string, string> = {
    'SEÑALAR_IMAGEN': 'ads_click',
    'OPCION_MULTIPLE': 'quiz',
    'VERDADERO_FALSO': 'check_circle',
    'ARRASTRAR_SILABAS': 'drag_indicator',
    'UNIR_LINEAS': 'conversion_path',
    'CLASIFICAR_GRUPOS': 'category',
    'PINTAR': 'palette',
    'TECLADO_VIRTUAL': 'keyboard',
    'AUDIO_SELECCION': 'headphones',
    'COMPLETAR_HUECOS': 'edit_note',
};

const DIFFICULTY_MAP: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: 'Fácil', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    2: { label: 'Medio', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    3: { label: 'Difícil', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
};

export default function ExercisesAdminPage() {
    const toast = useToast();
    const confirm = useConfirm();

    const [worlds, setWorlds] = useState<World[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Preview
    const [previewExercise, setPreviewExercise] = useState<any | null>(null);

    useEffect(() => {
        WorldsService.getWorlds().then(w => { setWorlds(w || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedWorld) {
            ExerciseService.getUnitsByWorld(selectedWorld).then(u => setUnits(u || [])).catch(() => setUnits([]));
            setSelectedUnit(null); setExercises([]);
        } else { setUnits([]); setExercises([]); setSelectedUnit(null); }
    }, [selectedWorld]);

    useEffect(() => {
        if (selectedUnit) {
            ExerciseService.getExercisesRaw(selectedUnit).then(e => setExercises(e || [])).catch(() => setExercises([]));
        } else { setExercises([]); }
    }, [selectedUnit]);

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: 'Eliminar Ejercicio',
            message: 'Se perderán los resultados de los alumnos asociados. ¿Continuar?',
            confirmText: 'Eliminar', cancelText: 'Cancelar', variant: 'danger'
        });
        if (!ok) return;
        try {
            await ExerciseService.deleteExercise(id);
            toast.success('Ejercicio eliminado');
            setExercises(prev => prev.filter(e => e.id !== id));
        } catch { toast.error('Error al eliminar'); }
    };

    const toggleActive = async (exercise: Exercise) => {
        try {
            await ExerciseService.updateExercise(exercise.id, { isActive: !exercise.isActive });
            setExercises(prev => prev.map(e => e.id === exercise.id ? { ...e, isActive: !e.isActive } : e));
            toast.success(exercise.isActive ? 'Ejercicio desactivado' : 'Ejercicio activado');
        } catch { toast.error('Error al actualizar'); }
    };

    const filtered = exercises.filter(ex =>
        !searchTerm ||
        ex.instruction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalExercises = exercises.length;
    const activeExercises = exercises.filter(e => e.isActive).length;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white">Ejercicios del Centro</h1>
                    <p className="text-text-muted dark:text-gray-400 mt-1">Consulta y gestiona los ejercicios asignados a tu centro</p>
                </div>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-5 border border-[#f4e7f4] dark:border-white/5 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <span className="material-symbols-outlined text-2xl">quiz</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{totalExercises}</p>
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-5 border border-[#f4e7f4] dark:border-white/5 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Activos</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{activeExercises}</p>
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-5 border border-[#f4e7f4] dark:border-white/5 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                        <span className="material-symbols-outlined text-2xl">public</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Mundos</p>
                        <p className="text-2xl font-black text-text-main dark:text-white">{worlds.length}</p>
                    </div>
                </div>
            </div>

            {/* Navigation: World → Unit */}
            <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-[#f4e7f4] dark:border-white/5">
                {/* World selector */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">
                        <span className="material-symbols-outlined text-xs align-middle mr-0.5">public</span>
                        Mundo
                    </span>
                    <div className="flex gap-2 flex-wrap">
                        {worlds.map(w => (
                            <button key={w.id} onClick={() => setSelectedWorld(selectedWorld === w.id ? null : w.id)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedWorld === w.id ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}>
                                <span className="material-symbols-outlined text-sm align-middle mr-1">{w.icon || 'public'}</span>
                                {w.name}
                            </button>
                        ))}
                        {worlds.length === 0 && !loading && (
                            <span className="text-sm text-gray-400 italic">No hay mundos creados</span>
                        )}
                    </div>
                </div>

                {/* Unit selector */}
                {selectedWorld && (
                    <div className="p-4 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">
                            <span className="material-symbols-outlined text-xs align-middle mr-0.5">folder</span>
                            Unidad
                        </span>
                        <div className="flex gap-2 flex-wrap">
                            {units.map(u => (
                                <button key={u.id} onClick={() => setSelectedUnit(selectedUnit === u.id ? null : u.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedUnit === u.id ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200'}`}>
                                    {u.title}
                                    {u.exercises && <span className="ml-1.5 text-xs opacity-70">({u.exercises.length})</span>}
                                </button>
                            ))}
                            {units.length === 0 && (
                                <span className="text-sm text-gray-400 italic">Sin unidades en este mundo</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Search */}
                {selectedUnit && exercises.length > 0 && (
                    <div className="p-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                            <input type="text" placeholder="Buscar ejercicios..."
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 w-full md:w-72 focus:border-primary outline-none text-sm" />
                        </div>
                    </div>
                )}
            </div>

            {/* Exercise list */}
            {selectedUnit && (
                <div className="space-y-3">
                    {filtered.length > 0 ? filtered.map((ex, idx) => {
                        const diff = DIFFICULTY_MAP[ex.difficulty] || DIFFICULTY_MAP[1];
                        return (
                            <div key={ex.id}
                                className={`bg-card-light dark:bg-card-dark rounded-2xl border transition-all hover:shadow-md ${ex.isActive ? 'border-[#f4e7f4] dark:border-white/5' : 'border-red-200 dark:border-red-900/30 opacity-60'}`}>
                                <div className="p-4 flex items-center gap-4">
                                    {/* Number */}
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black shrink-0">
                                        {idx + 1}
                                    </div>

                                    {/* Type icon */}
                                    <div className="size-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-lg text-gray-500">{MECHANIC_ICONS[ex.type] || 'quiz'}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-text-main dark:text-white truncate">{ex.instruction}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                                                {MECHANIC_LABELS[ex.type] || ex.type}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${diff.bg} ${diff.color}`}>
                                                {diff.label}
                                            </span>
                                            <span className="text-[10px] font-bold text-amber-600">
                                                <span className="material-symbols-outlined text-xs align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                {ex.points} pts
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => setPreviewExercise(ex)}
                                            className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Probar">
                                            <span className="material-symbols-outlined text-lg">play_circle</span>
                                        </button>
                                        <button onClick={() => toggleActive(ex)}
                                            className={`p-2 rounded-xl transition-all ${ex.isActive ? 'text-green-500 hover:text-orange-500 hover:bg-orange-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}
                                            title={ex.isActive ? 'Desactivar' : 'Activar'}>
                                            <span className="material-symbols-outlined text-lg">
                                                {ex.isActive ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                        <button onClick={() => handleDelete(ex.id)}
                                            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Eliminar">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-12 text-center border border-[#f4e7f4] dark:border-white/5">
                            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">search_off</span>
                            <p className="text-lg font-bold text-gray-500">No hay ejercicios en esta unidad</p>
                            <p className="text-sm text-gray-400 mt-1">El Master puede crearlos desde su panel.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Initial state */}
            {!selectedWorld && !loading && (
                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-12 text-center border border-[#f4e7f4] dark:border-white/5">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">school</span>
                    <p className="text-xl font-bold text-gray-500">Selecciona un mundo</p>
                    <p className="text-sm text-gray-400 mt-1">Elige un mundo arriba para ver sus unidades y ejercicios.</p>
                </div>
            )}

            {/* Preview modal */}
            {previewExercise && (
                <ExercisePreview exercise={previewExercise} open={!!previewExercise} onClose={() => setPreviewExercise(null)} />
            )}
        </div>
    );
}
