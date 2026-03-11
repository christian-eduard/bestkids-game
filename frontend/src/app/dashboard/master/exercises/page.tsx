"use client";
import { useState, useEffect } from 'react';
import { Unit } from '@/services/exercises.service';
import { WorldsService, World } from '@/services/worlds.service';
import { motion, AnimatePresence } from 'framer-motion';
import MasterExerciseForm from '@/components/master/MasterExerciseForm';
import ExercisePreview from '@/components/master/ExercisePreview';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
    Layers, PlusCircle, Trash2, Globe, Edit2, Play,
    Settings, Plus, Save, X, Gem, ArrowLeft, ChevronDown, Search
} from 'lucide-react';
import Link from 'next/link';

// ── Mechanics config (persisted in localStorage) ────────────────────────────
const DEFAULT_MECHANICS = [
    { id: 'SEÑALAR_IMAGEN', label: 'Señalar Imagen', icon: 'ads_click', description: 'El alumno selecciona la imagen correcta' },
    { id: 'OPCION_MULTIPLE', label: 'Opción Múltiple', icon: 'quiz', description: 'Una sola respuesta correcta entre varias' },
    { id: 'VERDADERO_FALSO', label: 'Verdadero / Falso', icon: 'balance', description: 'Decidir si una afirmación es correcta' },
    { id: 'ARRASTRAR_SILABAS', label: 'Arrastrar Sílabas', icon: 'extension', description: 'Arrastrar sílabas para formar palabras' },
    { id: 'UNIR_LINEAS', label: 'Unir Líneas', icon: 'link', description: 'Conectar elementos relacionados' },
    { id: 'CLASIFICAR_GRUPOS', label: 'Clasificar Grupos', icon: 'category', description: 'Clasificar items en categorías' },
    { id: 'PINTAR', label: 'Pintar', icon: 'palette', description: 'Colorear zonas de una imagen' },
    { id: 'TECLADO_VIRTUAL', label: 'Teclado Virtual', icon: 'keyboard', description: 'Seleccionar sílabas en un teclado' },
    { id: 'AUDIO_SELECCION', label: 'Audio Selección', icon: 'headphones', description: 'Seleccionar según lo que se escucha' },
    { id: 'COMPLETAR_HUECOS', label: 'Completar Huecos', icon: 'edit_note', description: 'Rellenar palabras faltantes' },
];

function loadMechanics() {
    if (typeof window === 'undefined') return DEFAULT_MECHANICS;
    const saved = localStorage.getItem('bestkids_mechanics');
    return saved ? JSON.parse(saved) : DEFAULT_MECHANICS;
}
function saveMechanicsToStorage(mechanics: any[]) {
    localStorage.setItem('bestkids_mechanics', JSON.stringify(mechanics));
}

// ── View types ──────────────────────────────────────────────────────────────
type ViewMode = 'browse' | 'create' | 'edit' | 'mechanics';

// ═════════════════════════════════════════════════════════════════════════════
export default function MasterExercisesPage() {
    // ── Data state ──────────────────────────────────────────────────────────
    const [worlds, setWorlds] = useState<World[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [exercises, setExercises] = useState<any[]>([]);
    const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [newUnitTitle, setNewUnitTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // ── View state ──────────────────────────────────────────────────────────
    const [view, setView] = useState<ViewMode>('browse');
    const [editingExercise, setEditingExercise] = useState<any | null>(null);
    const [previewExercise, setPreviewExercise] = useState<any | null>(null);

    // ── Mechanics state ─────────────────────────────────────────────────────
    const [mechanics, setMechanics] = useState(loadMechanics());
    const [editingMechanic, setEditingMechanic] = useState<any | null>(null);
    const [mechanicForm, setMechanicForm] = useState({ id: '', label: '', icon: '', description: '' });

    // ── UI state ────────────────────────────────────────────────────────────
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean; title: string; message: string; action: () => void;
    }>({ open: false, title: '', message: '', action: () => { } });

    // ── Mechanics lookup ────────────────────────────────────────────────────
    const mechanicsMap: Record<string, any> = {};
    mechanics.forEach((m: any) => { mechanicsMap[m.id] = m; });

    // ── Effects ─────────────────────────────────────────────────────────────
    useEffect(() => { WorldsService.getWorlds().then(data => setWorlds(Array.isArray(data) ? data : [])); }, []);

    useEffect(() => {
        if (selectedWorld) {
            fetchUnits();
            setSelectedUnit(null);
            setExercises([]);
        }
    }, [selectedWorld]);

    useEffect(() => {
        if (selectedUnit) fetchExercises();
        else setExercises([]);
    }, [selectedUnit]);

    // ── API helpers ─────────────────────────────────────────────────────────
    const headers = () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    const jsonHeaders = () => ({ ...headers(), 'Content-Type': 'application/json' });
    const showToast = (msg: string, type: 'ok' | 'err') => {
        setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
    };

    const fetchUnits = () => {
        if (!selectedWorld) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/units/${selectedWorld}`, { headers: headers() })
            .then(r => r.json()).then(data => setUnits(Array.isArray(data) ? data : []));
    };

    const fetchExercises = () => {
        if (!selectedUnit) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/unit/${selectedUnit}/raw`, { headers: headers() })
            .then(r => r.json()).then(data => setExercises(Array.isArray(data) ? data : [])).catch(console.error);
    };

    const handleCreateUnit = async () => {
        if (!newUnitTitle.trim() || !selectedWorld) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/unit`, {
            method: 'POST', headers: jsonHeaders(),
            body: JSON.stringify({ title: newUnitTitle, worldId: selectedWorld })
        });
        if (res.ok) { setNewUnitTitle(''); fetchUnits(); showToast('Unidad creada', 'ok'); }
    };

    const handleDeleteUnit = (id: number) => {
        setConfirmDialog({
            open: true, title: 'Eliminar Unidad',
            message: 'Se borrarán todos los ejercicios de esta unidad. Esta acción no se puede deshacer.',
            action: async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/unit/${id}`, { method: 'DELETE', headers: headers() });
                if (selectedUnit === id) setSelectedUnit(null);
                fetchUnits(); showToast('Unidad eliminada', 'ok');
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleDeleteExercise = (id: number) => {
        setConfirmDialog({
            open: true, title: 'Eliminar Ejercicio',
            message: '¿Estás seguro? Se perderán los resultados de los alumnos asociados.',
            action: async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/exercise/${id}`, { method: 'DELETE', headers: headers() });
                fetchExercises(); showToast('Ejercicio eliminado', 'ok');
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    // ── Mechanics CRUD ──────────────────────────────────────────────────────
    const openMechanicEdit = (m: any) => { setEditingMechanic(m); setMechanicForm({ ...m }); };
    const openNewMechanic = () => { setEditingMechanic({ isNew: true }); setMechanicForm({ id: '', label: '', icon: 'help', description: '' }); };
    const saveMechanic = () => {
        if (!mechanicForm.id || !mechanicForm.label) { showToast('Rellena ID y nombre', 'err'); return; }
        let updated;
        if (editingMechanic?.isNew) {
            if (mechanics.find((m: any) => m.id === mechanicForm.id)) { showToast('Ya existe ese ID', 'err'); return; }
            updated = [...mechanics, { ...mechanicForm }];
        } else {
            updated = mechanics.map((m: any) => m.id === editingMechanic.id ? { ...mechanicForm } : m);
        }
        setMechanics(updated); saveMechanicsToStorage(updated);
        setEditingMechanic(null); showToast('Mecánica guardada', 'ok');
    };
    const deleteMechanic = (id: string) => {
        setConfirmDialog({
            open: true, title: 'Eliminar Mecánica',
            message: 'Esto eliminará el tipo del catálogo. Los ejercicios existentes de este tipo NO se borrarán.',
            action: () => {
                const updated = mechanics.filter((m: any) => m.id !== id);
                setMechanics(updated); saveMechanicsToStorage(updated);
                setConfirmDialog(prev => ({ ...prev, open: false })); showToast('Mecánica eliminada', 'ok');
            }
        });
    };

    // ── Filtered exercises ──────────────────────────────────────────────────
    const filtered = exercises.filter(ex =>
        !searchTerm || ex.instruction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Selected world/unit names ───────────────────────────────────────────
    const selectedWorldName = worlds.find(w => w.id === selectedWorld)?.name || '';
    const selectedUnitName = units.find(u => u.id === selectedUnit)?.title || '';

    // ═════════════════════════════════════════════════════════════════════════
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
            {/* ── Toast ────────────────────────────────────────────────── */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 left-1/2 z-[9999] px-8 py-4 rounded-2xl font-bold shadow-2xl text-white ${toast.type === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Confirm Dialog ────────────────────────────────────────── */}
            <ConfirmDialog
                open={confirmDialog.open} title={confirmDialog.title}
                message={confirmDialog.message} confirmLabel="Eliminar"
                onConfirm={confirmDialog.action}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            />

            {/* ── Exercise Preview Modal ────────────────────────────────── */}
            <ExercisePreview exercise={previewExercise} open={!!previewExercise} onClose={() => setPreviewExercise(null)} />

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ── VIEW: BROWSE (default) ─────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {view === 'browse' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-800 flex items-center gap-3">
                                <span className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200"><Gem size={24} /></span>
                                Ejercicios
                            </h1>
                            <p className="text-gray-400 font-bold mt-2 ml-14">Gestiona el contenido de aprendizaje</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard/master/worlds"
                                className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm">
                                <Globe size={16} /> Mundos
                            </Link>
                            <button onClick={() => setView('mechanics')}
                                className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm">
                                <Settings size={16} /> Mecánicas
                            </button>
                        </div>
                    </div>

                    {/* Selectors row */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4 items-end">
                        {/* World selector */}
                        <div className="flex-1 min-w-[200px] space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mundo</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 bg-gray-50 rounded-xl outline-none font-bold text-gray-700 border border-gray-100 focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all appearance-none cursor-pointer"
                                    value={selectedWorld || ''}
                                    onChange={e => setSelectedWorld(e.target.value ? +e.target.value : null)}
                                >
                                    <option value="">Seleccionar mundo...</option>
                                    {(worlds || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Unit selector */}
                        <div className="flex-1 min-w-[200px] space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unidad</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 pr-10 bg-gray-50 rounded-xl outline-none font-bold text-gray-700 border border-gray-100 focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all appearance-none cursor-pointer disabled:opacity-40"
                                    value={selectedUnit || ''}
                                    onChange={e => setSelectedUnit(e.target.value ? +e.target.value : null)}
                                    disabled={!selectedWorld}
                                >
                                    <option value="">{selectedWorld ? 'Seleccionar unidad...' : 'Elige un mundo primero'}</option>
                                    {(units || []).map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* New unit inline */}
                        {selectedWorld && (
                            <div className="flex gap-2 items-end">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nueva unidad</label>
                                    <input
                                        className="p-3 bg-gray-50 rounded-xl outline-none font-bold border border-gray-100 focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all text-sm w-[180px]"
                                        placeholder="Nombre..."
                                        value={newUnitTitle}
                                        onChange={e => setNewUnitTitle(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleCreateUnit()}
                                    />
                                </div>
                                <button onClick={handleCreateUnit}
                                    className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                                    <Plus size={18} />
                                </button>
                                {selectedUnit && (
                                    <button onClick={() => handleDeleteUnit(selectedUnit)}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                        title="Eliminar unidad seleccionada">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Exercise list ─────────────────────────────────────── */}
                    {selectedUnit ? (
                        <div className="space-y-4">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-black text-gray-600">
                                        {selectedWorldName} / {selectedUnitName}
                                    </h2>
                                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-black">
                                        {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex gap-3 items-center">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input
                                            className="pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-purple-200 w-[200px]"
                                            placeholder="Buscar..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    {/* Create button */}
                                    <button
                                        onClick={() => { setEditingExercise(null); setView('create'); }}
                                        className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 text-sm"
                                    >
                                        <Plus size={18} /> Nuevo Ejercicio
                                    </button>
                                </div>
                            </div>

                            {/* Cards */}
                            {filtered.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                    {exercises.length === 0 ? (
                                        <>
                                            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">inbox</span>
                                            <p className="text-gray-400 font-bold text-lg mb-2">Esta unidad no tiene ejercicios</p>
                                            <p className="text-gray-300 mb-6">Crea el primero para empezar a construir contenido</p>
                                            <button
                                                onClick={() => { setEditingExercise(null); setView('create'); }}
                                                className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-purple-700 transition-colors"
                                            >
                                                <Plus size={20} /> Crear primer ejercicio
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4 block">search_off</span>
                                            <p className="text-gray-400 font-bold">Sin resultados para "{searchTerm}"</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {(filtered || []).map((ex, idx) => (
                                        <motion.div
                                            key={ex.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-purple-100 transition-all group"
                                        >
                                            {/* Order badge */}
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                                <span className="font-black text-gray-500 text-sm">{idx + 1}</span>
                                            </div>

                                            {/* Type icon */}
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-purple-500 text-xl">
                                                    {mechanicsMap[ex.type]?.icon || 'help'}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                    <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg">
                                                        {mechanicsMap[ex.type]?.label || ex.type}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                                        Dificultad {ex.difficulty}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-gray-700 truncate">{ex.instruction || 'Sin instrucción'}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setPreviewExercise(ex)}
                                                    className="p-2.5 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-colors"
                                                    title="Probar">
                                                    <Play size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setEditingExercise(ex); setView('edit'); }}
                                                    className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                                                    title="Editar">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExercise(ex.id)}
                                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty state when no unit selected */
                        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                            <span className="material-symbols-outlined text-7xl text-gray-200 mb-6 block">folder_open</span>
                            <h2 className="text-2xl font-black text-gray-300 mb-2">Selecciona un mundo y una unidad</h2>
                            <p className="text-gray-300 font-bold">Usa los desplegables de arriba para navegar por el contenido</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ── VIEW: CREATE / EDIT ────────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {(view === 'create' || view === 'edit') && (
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    {/* Back header */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => { setView('browse'); setEditingExercise(null); }}
                            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Volver a la lista</span>
                        </button>
                        <div className="text-right">
                            <h2 className="text-xl font-black text-gray-700">
                                {view === 'edit' ? `Editando ejercicio #${editingExercise?.id}` : 'Nuevo ejercicio'}
                            </h2>
                            <p className="text-sm text-gray-400 font-bold">
                                {selectedWorldName} / {selectedUnitName}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <MasterExerciseForm
                        unitId={selectedUnit}
                        editData={view === 'edit' ? editingExercise : null}
                        onSave={() => {
                            setView('browse');
                            setEditingExercise(null);
                            fetchExercises();
                        }}
                    />
                </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ── VIEW: MECHANICS ─────────────────────────────────────── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {view === 'mechanics' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Back header */}
                    <div className="flex items-center justify-between">
                        <button onClick={() => setView('browse')}
                            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold transition-colors">
                            <ArrowLeft size={20} /> Volver a ejercicios
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-700 flex items-center gap-3">
                                    <Settings size={24} className="text-purple-500" />
                                    Tipos de Mecánica
                                </h2>
                                <p className="text-gray-400 font-bold mt-1">Configura los tipos de ejercicio disponibles</p>
                            </div>
                            <button onClick={openNewMechanic}
                                className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-colors text-sm">
                                <Plus size={18} /> Nueva Mecánica
                            </button>
                        </div>

                        {/* Edit form */}
                        {editingMechanic && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-purple-50 rounded-2xl border border-purple-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-purple-700">{editingMechanic.isNew ? 'Nueva Mecánica' : `Editando: ${editingMechanic.label}`}</h3>
                                    <button onClick={() => setEditingMechanic(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase">ID (interno)</label>
                                        <input className="w-full p-3 bg-white rounded-xl outline-none font-bold border border-purple-100" placeholder="NUEVO_TIPO"
                                            value={mechanicForm.id} onChange={e => setMechanicForm({ ...mechanicForm, id: e.target.value.toUpperCase().replace(/\s+/g, '_') })} disabled={!editingMechanic.isNew} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase">Icono (Material Symbol)</label>
                                        <input className="w-full p-3 bg-white rounded-xl outline-none font-bold text-center border border-purple-100" placeholder="ads_click"
                                            value={mechanicForm.icon} onChange={e => setMechanicForm({ ...mechanicForm, icon: e.target.value })} />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase">Nombre</label>
                                        <input className="w-full p-3 bg-white rounded-xl outline-none font-bold border border-purple-100" placeholder="Mi Mecánica"
                                            value={mechanicForm.label} onChange={e => setMechanicForm({ ...mechanicForm, label: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Descripción</label>
                                    <input className="w-full p-3 bg-white rounded-xl outline-none font-bold border border-purple-100" placeholder="¿Qué hace esta mecánica?"
                                        value={mechanicForm.description} onChange={e => setMechanicForm({ ...mechanicForm, description: e.target.value })} />
                                </div>
                                <button onClick={saveMechanic} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-600">
                                    <Save size={18} /> Guardar
                                </button>
                            </motion.div>
                        )}

                        {/* List */}
                        <div className="grid gap-3">
                            {mechanics.map((m: any) => (
                                <div key={m.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-2xl text-purple-600">{m.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-700">{m.label}</h4>
                                            <p className="text-xs text-gray-400 font-bold">{m.description}</p>
                                            <span className="text-[10px] font-mono text-purple-400 bg-purple-50 px-2 py-0.5 rounded mt-1 inline-block">{m.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openMechanicEdit(m)} className="p-2.5 bg-white text-blue-500 rounded-xl hover:bg-blue-50"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteMechanic(m.id)} className="p-2.5 bg-white text-red-500 rounded-xl hover:bg-red-50"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
