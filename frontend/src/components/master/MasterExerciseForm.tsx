"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, HelpCircle, Settings, Type, ImageIcon, FolderOpen } from 'lucide-react';
import MediaUploader from '../shared/MediaUploader';
import ResourcePicker from '../shared/ResourcePicker';

interface Props {
    unitId: number | null;
    onSave: () => void;
    editData?: any;
}

const DEFAULT_EXERCISE_TYPES = [
    { id: 'SEÑALAR_IMAGEN', label: 'Señalar Imagen', icon: 'ads_click' },
    { id: 'OPCION_MULTIPLE', label: 'Opción Múltiple', icon: 'quiz' },
    { id: 'VERDADERO_FALSO', label: 'Verdadero / Falso', icon: 'balance' },
    { id: 'ARRASTRAR_SILABAS', label: 'Arrastrar Sílabas', icon: 'extension' },
    { id: 'UNIR_LINEAS', label: 'Unir Líneas', icon: 'link' },
    { id: 'CLASIFICAR_GRUPOS', label: 'Clasificar Grupos', icon: 'category' },
    { id: 'PINTAR', label: 'Pintar', icon: 'palette' },
    { id: 'TECLADO_VIRTUAL', label: 'Teclado Virtual', icon: 'keyboard' },
    { id: 'AUDIO_SELECCION', label: 'Audio Selección', icon: 'headphones' },
    { id: 'COMPLETAR_HUECOS', label: 'Completar Huecos', icon: 'edit_note' },
];

function getExerciseTypes() {
    if (typeof window === 'undefined') return DEFAULT_EXERCISE_TYPES;
    const saved = localStorage.getItem('bestkids_mechanics');
    if (saved) {
        try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return DEFAULT_EXERCISE_TYPES;
}

export default function MasterExerciseForm({ unitId, onSave, editData }: Props) {
    const [type, setType] = useState(editData?.type || 'SEÑALAR_IMAGEN');
    const [instruction, setInstruction] = useState(editData?.instruction || '');
    const [difficulty, setDifficulty] = useState(editData?.difficulty || 1);
    const [instructionAudio, setInstructionAudio] = useState(editData?.instructionAudioUrl || '');
    const [content, setContent] = useState<any>(editData?.content || {});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [pickers, setPickers] = useState<{ [key: string]: boolean }>({});
    const [subjectAreas, setSubjectAreas] = useState<any[]>([]);
    const [subjectAreaId, setSubjectAreaId] = useState<number | null>(editData?.subjectAreaId || null);

    const isEditing = !!editData;

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/subjects`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSubjectAreas(data || []);
                }
            } catch (e) { console.error(e); }
        };
        fetchSubjects();
    }, []);

    // Init content based on type (only on type change when not editing)
    useEffect(() => {
        if (isEditing && type === editData?.type) return;
        const defaults: Record<string, any> = {
            'SEÑALAR_IMAGEN': { multipleCorrect: false, options: [], stimulus: null },
            'OPCION_MULTIPLE': { options: [], stimulus: null },
            'VERDADERO_FALSO': { stimulusA: { type: 'text', value: '' }, stimulusB: { type: 'text', value: '' }, correctAnswer: true },
            'ARRASTRAR_SILABAS': { items: [{ id: 'i1', imageUrl: '', word: '', syllables: [], givenSyllables: [] }], availableSyllables: [] },
            'UNIR_LINEAS': { leftItems: [], rightItems: [], correctPairs: [] },
            'CLASIFICAR_GRUPOS': { groups: [{ id: 'g1', label: '' }], items: [] },
            'PINTAR': { items: [], colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'], correctPairs: [] },
            'TECLADO_VIRTUAL': { totalSyllables: 2, targetPosition: 1, correctSyllable: '', imageUrl: '' },
            'AUDIO_SELECCION': { options: [], multipleCorrect: false },
            'COMPLETAR_HUECOS': { text: '', gaps: [], imageUrl: '' },
        };
        setContent(defaults[type] || {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const showToast = (msg: string, type: 'ok' | 'err') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        if (!unitId || !instruction.trim()) {
            showToast('Completa el enunciado del ejercicio', 'err');
            return;
        }
        setSaving(true);
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_API_URL}/exercises/exercise/${editData.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/exercises/exercise`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    unitId,
                    type,
                    instruction,
                    difficulty,
                    subjectAreaId: subjectAreaId || null,
                    instructionAudioUrl: instructionAudio || null,
                    content
                })
            });
            if (res.ok) {
                showToast(isEditing ? 'Ejercicio actualizado' : 'Ejercicio creado', 'ok');
                onSave();
            } else {
                showToast('Error al guardar', 'err');
            }
        } catch (err) {
            console.error(err);
            showToast('Error de conexión', 'err');
        } finally {
            setSaving(false);
        }
    };

    const openPicker = (key: string) => setPickers({ ...pickers, [key]: true });
    const closePicker = (key: string) => setPickers({ ...pickers, [key]: false });
    const getFullUrl = (url: string) => url?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}` : url;

    // --- Option helpers ---
    const addOption = () => {
        const opts = content.options || [];
        setContent({ ...content, options: [...opts, { id: `opt_${Date.now()}`, text: '', imageUrl: '', isCorrect: false, audioUrl: '' }] });
    };
    const removeOption = (idx: number) => {
        const opts = [...(content.options || [])];
        opts.splice(idx, 1);
        setContent({ ...content, options: opts });
    };
    const updateOption = (idx: number, field: string, value: any) => {
        const opts = [...(content.options || [])];
        opts[idx] = { ...opts[idx], [field]: value };
        setContent({ ...content, options: opts });
    };

    // --- Multi-item helpers (e.g. ARRASTRAR_SILABAS) ---
    const addSyllableItem = () => {
        const items = content.items || [];
        setContent({ ...content, items: [...items, { id: `i_${Date.now()}`, imageUrl: '', word: '', syllables: [], givenSyllables: [] }] });
    };
    const removeSyllableItem = (idx: number) => {
        const items = [...(content.items || [])];
        items.splice(idx, 1);
        setContent({ ...content, items });
    };
    const updateSyllableItem = (idx: number, field: string, value: any) => {
        const items = [...(content.items || [])];
        items[idx] = { ...items[idx], [field]: value };
        setContent({ ...content, items });
    };

    return (
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-purple-50">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl font-bold shadow-xl text-white ${toast.type === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black italic">
                        {isEditing ? `EDITAR EJERCICIO #${editData.id}` : 'EDITOR DE DESAFÍOS'}
                    </h2>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${difficulty === d ? 'bg-yellow-400 text-purple-900 scale-110 shadow-lg' : 'bg-white/20 text-white'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-60 ml-2 tracking-widest">Tipo de Mecánica</label>
                        <select
                            className="w-full p-4 bg-white/10 rounded-2xl outline-none font-bold border-2 border-white/20 focus:border-white transition-all appearance-none cursor-pointer"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {getExerciseTypes().map((t: any) => (
                                <option key={t.id} value={t.id} className="text-gray-800">{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-60 ml-2 tracking-widest">Materia / Área</label>
                        <select
                            className="w-full p-4 bg-white/10 rounded-2xl outline-none font-bold border-2 border-white/20 focus:border-white transition-all appearance-none cursor-pointer"
                            value={subjectAreaId || ''}
                            onChange={(e) => setSubjectAreaId(e.target.value ? Number(e.target.value) : null)}
                        >
                            {(subjectAreas || []).map((sa: any) => (
                                <option key={sa.id} value={sa.id}>{sa.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase opacity-60 ml-2 tracking-widest">Instrucción (Voz)</label>
                        <MediaUploader
                            accept="audio"
                            onUpload={(url) => setInstructionAudio(url)}
                            value={instructionAudio}
                            onClear={() => setInstructionAudio('')}
                        />
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Enunciado */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={16} /> Enunciado del Ejercicio
                    </label>
                    <textarea
                        className="w-full p-6 bg-gray-50 rounded-[32px] border-none focus:ring-4 focus:ring-purple-100 text-xl font-bold text-gray-700 transition-all outline-none min-h-[100px]"
                        placeholder="Ej: ¿Cuál de estos animales hace 'miau'?"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                    />
                </div>

                {/* Configuración de Mecánica */}
                <div className="bg-purple-50/30 p-8 rounded-[40px] border-2 border-dashed border-purple-100 min-h-[300px]">
                    <h3 className="text-lg font-black text-purple-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <Settings size={20} /> Configuración de Mecánica
                    </h3>

                    {/* SEÑALAR_IMAGEN / OPCION_MULTIPLE */}
                    {(type === 'SEÑALAR_IMAGEN' || type === 'OPCION_MULTIPLE') && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-purple-900 border-b-2 border-purple-200 pb-1">Opciones de respuesta</span>
                                <button onClick={addOption} className="p-2 bg-purple-600 text-white rounded-xl hover:scale-110 transition-transform"><Plus size={20} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {(content.options || []).map((opt: any, idx: number) => (
                                    <div key={opt.id} className="p-4 bg-white rounded-3xl shadow-sm border-2 border-purple-50 space-y-3 relative">
                                        <button onClick={() => removeOption(idx)} className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>

                                        {/* Image with ResourcePicker */}
                                        {opt.imageUrl ? (
                                            <div className="relative h-28 rounded-2xl overflow-hidden bg-gray-100">
                                                <img src={getFullUrl(opt.imageUrl)} className="w-full h-full object-cover" alt="" />
                                                <button onClick={() => updateOption(idx, 'imageUrl', '')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openPicker(`opt_${idx}`)}
                                                className="w-full h-28 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/30 flex flex-col items-center justify-center text-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
                                            >
                                                <FolderOpen size={24} />
                                                <span className="text-xs font-bold mt-1">Seleccionar imagen</span>
                                            </button>
                                        )}
                                        <ResourcePicker
                                            open={!!pickers[`opt_${idx}`]}
                                            onSelect={(url) => updateOption(idx, 'imageUrl', url)}
                                            onClose={() => closePicker(`opt_${idx}`)}
                                            accept="image"
                                        />

                                        <input
                                            className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-bold"
                                            placeholder="Texto de la opción..."
                                            value={opt.text || ''}
                                            onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={opt.isCorrect}
                                                onChange={(e) => {
                                                    if (type === 'OPCION_MULTIPLE') {
                                                        const opts = (content.options || []).map((o: any, i: number) => ({ ...o, isCorrect: i === idx ? e.target.checked : false }));
                                                        setContent({ ...content, options: opts });
                                                    } else {
                                                        updateOption(idx, 'isCorrect', e.target.checked);
                                                    }
                                                }}
                                                className="w-5 h-5 accent-green-500"
                                            />
                                            <span className={`text-xs font-bold ${opt.isCorrect ? 'text-green-500' : 'text-gray-400'}`}>
                                                {opt.isCorrect ? 'CORRECTA' : 'CORRECTA'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VERDADERO_FALSO */}
                    {type === 'VERDADERO_FALSO' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400">Elemento A (afirmación)</label>
                                    <input className="w-full p-4 bg-white rounded-2xl outline-none font-bold" placeholder="Un gato tiene 4 patas" value={content.stimulusA?.value || ''} onChange={(e) => setContent({ ...content, stimulusA: { type: 'text', value: e.target.value } })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400">Elemento B (comparación)</label>
                                    <input className="w-full p-4 bg-white rounded-2xl outline-none font-bold" placeholder="Los gatos son reptiles" value={content.stimulusB?.value || ''} onChange={(e) => setContent({ ...content, stimulusB: { type: 'text', value: e.target.value } })} />
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setContent({ ...content, correctAnswer: true })} className={`px-8 py-5 rounded-3xl font-black text-lg ${content.correctAnswer ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>VERDADERO</button>
                                <button onClick={() => setContent({ ...content, correctAnswer: false })} className={`px-8 py-5 rounded-3xl font-black text-lg ${!content.correctAnswer ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400'}`}>FALSO</button>
                            </div>
                        </div>
                    )}

                    {/* ARRASTRAR_SILABAS */}
                    {type === 'ARRASTRAR_SILABAS' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-purple-900 border-b-2 border-purple-200 pb-1">Palabras a formar (Secuencial)</span>
                                <button onClick={addSyllableItem} className="p-2 bg-purple-600 text-white rounded-xl hover:scale-110 transition-transform"><Plus size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                {(content.items || []).map((item: any, idx: number) => (
                                    <div key={item.id} className="p-6 bg-white rounded-3xl shadow-sm border-2 border-purple-100 space-y-4 relative">
                                        <button onClick={() => removeSyllableItem(idx)} className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase">Palabra {idx + 1}</label>
                                                <input
                                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-xl"
                                                    placeholder="GATO"
                                                    value={item.word || ''}
                                                    onChange={(e) => updateSyllableItem(idx, 'word', e.target.value.toUpperCase())}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase">Sílabas (separadas por coma)</label>
                                                <input
                                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold"
                                                    placeholder="GA, TO"
                                                    value={item.syllables?.join(', ') || ''}
                                                    onChange={(e) => updateSyllableItem(idx, 'syllables', e.target.value.split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean))}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {item.imageUrl ? (
                                                <div className="relative h-20 w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                    <img src={getFullUrl(item.imageUrl)} className="w-full h-full object-cover" alt="" />
                                                    <button onClick={() => updateSyllableItem(idx, 'imageUrl', '')} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><Trash2 size={10} /></button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openPicker(`syllable_img_${idx}`)}
                                                    className="w-32 h-20 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30 flex flex-col items-center justify-center text-purple-400 shrink-0"
                                                >
                                                    <FolderOpen size={18} />
                                                    <span className="text-[10px] font-bold mt-1">Imagen</span>
                                                </button>
                                            )}
                                            <ResourcePicker
                                                open={!!pickers[`syllable_img_${idx}`]}
                                                onSelect={(url) => updateSyllableItem(idx, 'imageUrl', url)}
                                                onClose={() => closePicker(`syllable_img_${idx}`)}
                                                accept="image"
                                            />

                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase">Audio (opcional)</label>
                                                <MediaUploader
                                                    accept="audio"
                                                    onUpload={(url) => updateSyllableItem(idx, 'audioUrl', url)}
                                                    value={item.audioUrl}
                                                    onClear={() => updateSyllableItem(idx, 'audioUrl', '')}
                                                    label=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white rounded-2xl border-2 border-purple-100 border-dashed space-y-2">
                                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Sílabas Distractoras (Para todo el ejercicio)</label>
                                <input
                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold"
                                    placeholder="MA, LO, PE"
                                    value={content.availableSyllables?.join(', ') || ''}
                                    onChange={(e) => setContent({ ...content, availableSyllables: e.target.value.split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean) })}
                                />
                            </div>
                        </div>
                    )}

                    {/* UNIR_LINEAS */}
                    {type === 'UNIR_LINEAS' && (
                        <div className="space-y-6">
                            <p className="text-sm text-purple-400 font-bold">Añade pares izquierda-derecha. Los items se conectan por su posición (par 1↔1, 2↔2, etc.)</p>
                            {(content.leftItems || []).map((_: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-5 gap-3 items-center">
                                    <input className="col-span-2 p-3 bg-white rounded-xl outline-none font-bold" placeholder="Izquierda" value={content.leftItems[idx] || ''} onChange={(e) => {
                                        const l = [...(content.leftItems || [])]; l[idx] = e.target.value;
                                        setContent({ ...content, leftItems: l });
                                    }} />
                                    <span className="text-center text-purple-300 font-black">↔</span>
                                    <input className="col-span-2 p-3 bg-white rounded-xl outline-none font-bold" placeholder="Derecha" value={content.rightItems?.[idx] || ''} onChange={(e) => {
                                        const r = [...(content.rightItems || [])]; r[idx] = e.target.value;
                                        setContent({ ...content, rightItems: r });
                                    }} />
                                </div>
                            ))}
                            <button onClick={() => setContent({ ...content, leftItems: [...(content.leftItems || []), ''], rightItems: [...(content.rightItems || []), ''] })} className="w-full p-3 bg-purple-100 text-purple-600 rounded-xl font-bold flex items-center justify-center gap-2">
                                <Plus size={18} /> Añadir par
                            </button>
                        </div>
                    )}

                    {/* CLASIFICAR_GRUPOS */}
                    {type === 'CLASIFICAR_GRUPOS' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase">Grupos</label>
                                {(content.groups || []).map((g: any, idx: number) => (
                                    <input key={idx} className="w-full p-3 bg-white rounded-xl outline-none font-bold" placeholder={`Grupo ${idx + 1}`} value={g.label || ''} onChange={(e) => {
                                        const groups = [...(content.groups || [])]; groups[idx] = { ...groups[idx], label: e.target.value };
                                        setContent({ ...content, groups });
                                    }} />
                                ))}
                                <button onClick={() => setContent({ ...content, groups: [...(content.groups || []), { id: `g_${Date.now()}`, label: '' }] })} className="text-sm text-purple-500 font-bold"><Plus size={14} className="inline" /> Añadir grupo</button>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase">Items (texto, grupo al que pertenece)</label>
                                {(content.items || []).map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <input className="flex-1 p-3 bg-white rounded-xl outline-none font-bold" placeholder="Texto del item" value={item.text || ''} onChange={(e) => {
                                            const items = [...(content.items || [])]; items[idx] = { ...items[idx], text: e.target.value };
                                            setContent({ ...content, items });
                                        }} />
                                        <select className="p-3 bg-white rounded-xl font-bold" value={item.groupId || ''} onChange={(e) => {
                                            const items = [...(content.items || [])]; items[idx] = { ...items[idx], groupId: e.target.value };
                                            setContent({ ...content, items });
                                        }}>
                                            <option value="">--Grupo--</option>
                                            {(content.groups || []).map((g: any) => <option key={g.id} value={g.id}>{g.label || g.id}</option>)}
                                        </select>
                                    </div>
                                ))}
                                <button onClick={() => setContent({ ...content, items: [...(content.items || []), { id: `it_${Date.now()}`, text: '', groupId: '' }] })} className="text-sm text-purple-500 font-bold"><Plus size={14} className="inline" /> Añadir item</button>
                            </div>
                        </div>
                    )}

                    {/* TECLADO_VIRTUAL */}
                    {type === 'TECLADO_VIRTUAL' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">Sílaba correcta</label>
                                    <input className="w-full p-4 bg-white rounded-xl outline-none font-bold text-xl" placeholder="MA" value={content.correctSyllable || ''} onChange={(e) => setContent({ ...content, correctSyllable: e.target.value.toUpperCase() })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase">Total sílabas visibles</label>
                                    <input type="number" className="w-full p-4 bg-white rounded-xl outline-none font-bold text-xl" min={2} max={6} value={content.totalSyllables || 2} onChange={(e) => setContent({ ...content, totalSyllables: Number(e.target.value) })} />
                                </div>
                            </div>
                            <button onClick={() => openPicker('keyboard_img')} className="w-full p-3 bg-purple-50 text-purple-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-100">
                                <FolderOpen size={18} /> Imagen asociada
                            </button>
                            <ResourcePicker open={!!pickers['keyboard_img']} onSelect={(url) => setContent({ ...content, imageUrl: url })} onClose={() => closePicker('keyboard_img')} />
                            {content.imageUrl && <img src={getFullUrl(content.imageUrl)} className="h-32 rounded-2xl object-cover" alt="" />}
                        </div>
                    )}

                    {/* AUDIO_SELECCION */}
                    {type === 'AUDIO_SELECCION' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-purple-900 border-b-2 border-purple-200 pb-1">Opciones con audio</span>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={content.multipleCorrect}
                                            onChange={(e) => setContent({ ...content, multipleCorrect: e.target.checked })}
                                            className="w-5 h-5 accent-purple-600"
                                        />
                                        <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Multiple</span>
                                    </label>
                                    <button onClick={addOption} className="p-2 bg-purple-600 text-white rounded-xl hover:scale-110 transition-transform"><Plus size={20} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {(content.options || []).map((opt: any, idx: number) => (
                                    <div key={opt.id} className="p-5 bg-white rounded-3xl border-2 border-purple-50 space-y-3 relative group shadow-sm hover:shadow-md transition-all">
                                        <button onClick={() => removeOption(idx)} className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Texto Auxiliar</label>
                                            <input className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold text-sm" placeholder="Oveja" value={opt.text || ''} onChange={(e) => updateOption(idx, 'text', e.target.value)} />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audio de la opción</label>
                                            <MediaUploader accept="audio" onUpload={(url) => updateOption(idx, 'audioUrl', url)} value={opt.audioUrl} onClear={() => updateOption(idx, 'audioUrl', '')} label="" />
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                checked={opt.isCorrect}
                                                onChange={(e) => {
                                                    if (!content.multipleCorrect) {
                                                        const opts = (content.options || []).map((o: any, i: number) => ({ ...o, isCorrect: i === idx ? e.target.checked : false }));
                                                        setContent({ ...content, options: opts });
                                                    } else {
                                                        updateOption(idx, 'isCorrect', e.target.checked);
                                                    }
                                                }}
                                                className="w-6 h-6 accent-green-500"
                                            />
                                            <span className={`text-xs font-black tracking-widest ${opt.isCorrect ? 'text-green-500' : 'text-gray-300'}`}>
                                                {opt.isCorrect ? 'CORRECTA' : 'MARCAR CORRECTA'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* COMPLETAR_HUECOS */}
                    {type === 'COMPLETAR_HUECOS' && (
                        <div className="space-y-6">
                            <div className="p-6 bg-white rounded-2xl space-y-4 border-2 border-purple-100">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Texto con huecos (usa ___ para cada hueco)</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold min-h-[120px] text-lg leading-relaxed"
                                        placeholder="El ___ tiene cuatro ___."
                                        value={content.text || ''}
                                        onChange={(e) => setContent({ ...content, text: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Definir Respuestas</label>
                                        <div className="text-[10px] font-bold text-purple-400">HUECOS DETECTADOS: {(content.text || '').match(/___/g)?.length || 0}</div>
                                    </div>

                                    <div className="grid gap-3">
                                        {(content.gaps || []).map((gap: any, idx: number) => (
                                            <div key={gap.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                                                <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-black text-xs">{idx + 1}</span>
                                                <input
                                                    className="flex-1 p-2 bg-white rounded-lg outline-none font-bold text-sm"
                                                    placeholder="Respuesta correcta"
                                                    value={gap.correctAnswer || ''}
                                                    onChange={(e) => {
                                                        const gaps = [...(content.gaps || [])];
                                                        gaps[idx] = { ...gaps[idx], correctAnswer: e.target.value };
                                                        setContent({ ...content, gaps });
                                                    }}
                                                />
                                                <button onClick={() => {
                                                    const gaps = [...(content.gaps || [])];
                                                    gaps.splice(idx, 1);
                                                    setContent({ ...content, gaps });
                                                }} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setContent({ ...content, gaps: [...(content.gaps || []), { id: `gap_${Date.now()}`, correctAnswer: '' }] })}
                                            className="p-3 border-2 border-dashed border-purple-200 rounded-xl text-purple-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-50"
                                        >
                                            <Plus size={14} /> Añadir definición de hueco
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        {content.imageUrl ? (
                                            <div className="relative h-24 w-40 rounded-xl overflow-hidden bg-gray-100">
                                                <img src={getFullUrl(content.imageUrl)} className="w-full h-full object-cover" alt="" />
                                                <button onClick={() => setContent({ ...content, imageUrl: '' })} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => openPicker('gap_img')}
                                                className="w-40 h-24 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30 flex flex-col items-center justify-center text-purple-400"
                                            >
                                                <FolderOpen size={20} />
                                                <span className="text-[10px] font-bold mt-1">Imagen de apoyo</span>
                                            </button>
                                        )}
                                        <ResourcePicker open={!!pickers['gap_img']} onSelect={(url) => setContent({ ...content, imageUrl: url })} onClose={() => closePicker('gap_img')} accept="image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PINTAR */}
                    {type === 'PINTAR' && (
                        <div className="space-y-6">
                            <div className="p-6 bg-white rounded-3xl border-2 border-purple-100 space-y-6">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    {content.imageUrl ? (
                                        <div className="relative w-full max-w-md h-64 rounded-2xl overflow-hidden bg-gray-100 border-2 border-purple-50">
                                            <img src={getFullUrl(content.imageUrl)} className="w-full h-full object-contain" alt="" />
                                            <button onClick={() => setContent({ ...content, imageUrl: '' })} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"><Trash2 size={18} /></button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openPicker('paint_img')}
                                            className="w-full h-64 border-4 border-dashed border-purple-200 rounded-3xl bg-purple-50/20 flex flex-col items-center justify-center text-purple-300 hover:bg-purple-50 transition-all group"
                                        >
                                            <div className="p-6 bg-white rounded-full shadow-xl shadow-purple-100 group-hover:scale-110 transition-transform"><ImageIcon size={40} /></div>
                                            <span className="text-lg font-black mt-4">SELECCIONAR IMAGEN PARA COLOREAR</span>
                                            <p className="text-sm font-bold opacity-60 mt-1">Sube el SVG o diseño base</p>
                                        </button>
                                    )}
                                    <ResourcePicker open={!!pickers['paint_img']} onSelect={(url) => setContent({ ...content, imageUrl: url })} onClose={() => closePicker('paint_img')} accept="image" />
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Colores Disponibles (HEX)</label>
                                        <input
                                            className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold"
                                            placeholder="#FF0000, #00FF00..."
                                            value={(content.colors || []).join(', ')}
                                            onChange={(e) => setContent({ ...content, colors: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                                        />
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {(content.colors || []).map((c: string) => (
                                                <div key={c} className="size-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asignaciones Correctas</label>
                                            <button
                                                onClick={() => setContent({ ...content, correctPairs: [...(content.correctPairs || []), { itemId: `area_${Date.now()}`, color: content.colors?.[0] || '#FF0000' }] })}
                                                className="p-1 bg-purple-600 text-white rounded-lg"
                                            ><Plus size={16} /></button>
                                        </div>
                                        <div className="space-y-2">
                                            {(content.correctPairs || []).map((pair: any, idx: number) => (
                                                <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
                                                    <input className="flex-1 p-2 bg-white rounded-lg text-xs font-bold" placeholder="ID de la zona (ej: area1)" value={pair.itemId} onChange={(e) => {
                                                        const pairs = [...(content.correctPairs || [])];
                                                        pairs[idx] = { ...pair, itemId: e.target.value };
                                                        setContent({ ...content, correctPairs: pairs });
                                                    }} />
                                                    <input type="color" className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" value={pair.color} onChange={(e) => {
                                                        const pairs = [...(content.correctPairs || [])];
                                                        pairs[idx] = { ...pair, color: e.target.value };
                                                        setContent({ ...content, correctPairs: pairs });
                                                    }} />
                                                    <button onClick={() => {
                                                        const pairs = [...(content.correctPairs || [])];
                                                        pairs.splice(idx, 1);
                                                        setContent({ ...content, correctPairs: pairs });
                                                    }} className="text-red-400 p-1"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-5 bg-green-500 hover:bg-green-600 text-white rounded-[24px] font-black text-xl shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all border-b-4 border-green-700 active:border-b-0 active:translate-y-1 disabled:opacity-50"
                    >
                        {saving ? 'GUARDANDO...' : <><Save size={24} /> {isEditing ? 'ACTUALIZAR DESAFÍO' : 'GUARDAR DESAFÍO'}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
