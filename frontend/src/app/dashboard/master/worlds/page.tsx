"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusCircle, Trash2, Edit2, Save, X, Globe, Image as ImageIcon, FolderOpen, Upload, FolderPlus,
    // Icon picker options
    Rocket, Star, Zap, Heart, Diamond, Crown, Flame, Sparkles,
    Sun, Moon, Cloud, Leaf, TreePine, Mountain, Waves,
    Music, Palette, Book, BookOpen, GraduationCap, Lightbulb,
    Puzzle, Target, Award, Trophy, Medal, Gift,
    Compass, Map, Plane, Ship, Home, Castle,
    Cat, Dog, Fish, Bug, Bird, Flower2,
    Atom, Beaker, Cpu, Cog, Wrench, Hammer
} from 'lucide-react';
import MediaUploader from '@/components/shared/MediaUploader';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import ResourcePicker from '@/components/shared/ResourcePicker';

// ── Available icons for the picker ──────────────────────────────────────────
const ICON_OPTIONS = [
    { name: 'Rocket', component: Rocket },
    { name: 'Star', component: Star },
    { name: 'Zap', component: Zap },
    { name: 'Heart', component: Heart },
    { name: 'Diamond', component: Diamond },
    { name: 'Crown', component: Crown },
    { name: 'Flame', component: Flame },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Sun', component: Sun },
    { name: 'Moon', component: Moon },
    { name: 'Cloud', component: Cloud },
    { name: 'Leaf', component: Leaf },
    { name: 'TreePine', component: TreePine },
    { name: 'Mountain', component: Mountain },
    { name: 'Waves', component: Waves },
    { name: 'Globe', component: Globe },
    { name: 'Music', component: Music },
    { name: 'Palette', component: Palette },
    { name: 'Book', component: Book },
    { name: 'BookOpen', component: BookOpen },
    { name: 'GraduationCap', component: GraduationCap },
    { name: 'Lightbulb', component: Lightbulb },
    { name: 'Puzzle', component: Puzzle },
    { name: 'Target', component: Target },
    { name: 'Award', component: Award },
    { name: 'Trophy', component: Trophy },
    { name: 'Medal', component: Medal },
    { name: 'Gift', component: Gift },
    { name: 'Compass', component: Compass },
    { name: 'Map', component: Map },
    { name: 'Plane', component: Plane },
    { name: 'Ship', component: Ship },
    { name: 'Home', component: Home },
    { name: 'Castle', component: Castle },
    { name: 'Cat', component: Cat },
    { name: 'Dog', component: Dog },
    { name: 'Fish', component: Fish },
    { name: 'Bug', component: Bug },
    { name: 'Bird', component: Bird },
    { name: 'Flower2', component: Flower2 },
    { name: 'Atom', component: Atom },
    { name: 'Beaker', component: Beaker },
    { name: 'Cpu', component: Cpu },
    { name: 'Cog', component: Cog },
    { name: 'Wrench', component: Wrench },
    { name: 'Hammer', component: Hammer },
];

function getIconComponent(name: string) {
    return ICON_OPTIONS.find(i => i.name === name)?.component || Globe;
}

// ── Types ───────────────────────────────────────────────────────────────────
interface World {
    id: number;
    name: string;
    description: string;
    icon: string;
    backgroundImage?: string;
    colorTheme: string;
    pointsToUnlock: number;
}

export default function MasterWorldsPage() {
    const [worlds, setWorlds] = useState<World[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<World>>({});
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [showResourcePicker, setShowResourcePicker] = useState(false);
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [uploadCategory, setUploadCategory] = useState('Fondos');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [categories, setCategories] = useState<string[]>(['Fondos', 'Mundos', 'Ejercicios', 'General']);
    const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean; title: string; message: string; action: () => void;
    }>({ open: false, title: '', message: '', action: () => { } });

    useEffect(() => { fetchWorlds(); }, []);

    const showToast = (msg: string, type: 'ok' | 'err') => {
        setToast({ msg, type }); setTimeout(() => setToast(null), 3000);
    };

    const fetchWorlds = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worlds`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setWorlds(await res.json());
        } catch (error) { console.error("Error fetching worlds", error); }
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) { showToast('El nombre es obligatorio', 'err'); return; }
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_API_URL}/worlds/${isEditing}`
                : `${process.env.NEXT_PUBLIC_API_URL}/worlds`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    icon: formData.icon || 'Globe',
                    backgroundImage: formData.backgroundImage || null,
                    colorTheme: formData.colorTheme || '#9333ea',
                    description: formData.description || '',
                    pointsToUnlock: Number(formData.pointsToUnlock) || 0
                })
            });

            if (res.ok) {
                setIsEditing(null); setIsCreating(false); setFormData({});
                fetchWorlds();
                showToast(isEditing ? 'Mundo actualizado' : 'Mundo creado', 'ok');
            } else {
                showToast('Error al guardar el mundo', 'err');
            }
        } catch (error) {
            console.error(error); showToast('Error de conexión', 'err');
        }
    };

    const handleDelete = (id: number, name: string) => {
        setConfirmDialog({
            open: true,
            title: 'Eliminar Mundo',
            message: `Al eliminar "${name}" también se eliminarán TODAS sus unidades, ejercicios y el progreso de los estudiantes. Esta acción no se puede deshacer.`,
            action: async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/worlds/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (res.ok) { fetchWorlds(); showToast('Mundo eliminado', 'ok'); }
                    else showToast('Error al eliminar', 'err');
                } catch (error) { console.error(error); showToast('Error de conexión', 'err'); }
                setConfirmDialog(prev => ({ ...prev, open: false }));
            }
        });
    };

    const openEdit = (w: World) => {
        setFormData(w); setIsEditing(w.id); setIsCreating(false);
    };

    const filteredIcons = ICON_OPTIONS.filter(i =>
        i.name.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const SelectedIcon = getIconComponent(formData.icon || 'Globe');

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 left-1/2 z-[9999] px-8 py-4 rounded-2xl font-bold shadow-2xl text-white ${toast.type === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}
                    >{toast.msg}</motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmDialog.open} title={confirmDialog.title}
                message={confirmDialog.message} confirmLabel="Eliminar"
                onConfirm={confirmDialog.action}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            />

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3 text-gray-800">
                        <span className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200"><Globe size={24} /></span>
                        Mundos
                    </h1>
                    <p className="text-gray-400 font-bold mt-2 ml-14">Organiza el contenido en mundos temáticos</p>
                </div>

                {!isCreating && !isEditing && (
                    <button
                        onClick={() => { setIsCreating(true); setFormData({ icon: 'Rocket', colorTheme: '#9333ea', pointsToUnlock: 0 }); }}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all text-sm"
                    >
                        <PlusCircle size={18} /> Nuevo Mundo
                    </button>
                )}
            </header>

            {/* ── Create / Edit Form ─────────────────────────────────────── */}
            <AnimatePresence>
                {(isCreating || isEditing) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-700">
                                {isEditing ? `Editando: ${formData.name || ''}` : 'Nuevo Mundo'}
                            </h2>
                            <button onClick={() => { setIsCreating(false); setIsEditing(null); setShowIconPicker(false); }}
                                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                                <input
                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-800 border border-gray-100"
                                    placeholder="Ej: Planeta Alpha"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                                <input
                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-gray-600 border border-gray-100"
                                    placeholder="Descubre el origen..."
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Icon picker */}
                            <div className="space-y-1 relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icono</label>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <SelectedIcon size={22} className="text-blue-600" />
                                    </div>
                                    <span className="font-bold text-gray-600">{formData.icon || 'Globe'}</span>
                                    <span className="text-xs text-gray-400 ml-auto">Clic para cambiar</span>
                                </button>

                                {/* Icon picker dropdown */}
                                <AnimatePresence>
                                    {showIconPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 space-y-3"
                                        >
                                            {/* Search */}
                                            <input
                                                className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm font-bold border border-gray-100 focus:border-blue-200"
                                                placeholder="Buscar icono..."
                                                value={iconSearch}
                                                onChange={e => setIconSearch(e.target.value)}
                                                autoFocus
                                            />
                                            {/* Grid */}
                                            <div className="grid grid-cols-8 gap-1.5 max-h-[240px] overflow-y-auto">
                                                {filteredIcons.map(({ name, component: Icon }) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, icon: name });
                                                            setShowIconPicker(false);
                                                            setIconSearch('');
                                                        }}
                                                        className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.icon === name
                                                            ? 'bg-blue-100 ring-2 ring-blue-400'
                                                            : 'hover:bg-gray-100'
                                                            }`}
                                                        title={name}
                                                    >
                                                        <Icon size={20} className={formData.icon === name ? 'text-blue-600' : 'text-gray-500'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Color */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color del tema</label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        className="h-[56px] w-16 rounded-xl cursor-pointer bg-gray-50 border border-gray-100"
                                        value={formData.colorTheme || '#9333ea'}
                                        onChange={e => setFormData({ ...formData, colorTheme: e.target.value })}
                                    />
                                    <input
                                        className="flex-1 p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-600 border border-gray-100 uppercase"
                                        value={formData.colorTheme || '#9333ea'}
                                        onChange={e => setFormData({ ...formData, colorTheme: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Points */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Puntos para desbloquear</label>
                                <input
                                    type="number"
                                    className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-black text-gray-800 border border-gray-100"
                                    min="0" step="100"
                                    value={formData.pointsToUnlock || 0}
                                    onChange={e => setFormData({ ...formData, pointsToUnlock: Number(e.target.value) })}
                                />
                                <p className="text-[10px] text-gray-400 ml-1 font-bold">0 = siempre disponible</p>
                            </div>

                            {/* Background image */}
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <ImageIcon size={12} /> Imagen de fondo
                                </label>

                                {formData.backgroundImage ? (
                                    /* ── Preview when image is selected ── */
                                    <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                        <img
                                            src={formData.backgroundImage.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${formData.backgroundImage}` : formData.backgroundImage}
                                            alt="Fondo"
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, backgroundImage: '' })}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : !showUploadPanel ? (
                                    /* ── Two equal buttons ── */
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowResourcePicker(true)}
                                            className="p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 font-bold flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors cursor-pointer"
                                        >
                                            <FolderOpen size={28} />
                                            <span className="text-sm">Elegir de Recursos</span>
                                            <span className="text-[10px] text-blue-400 font-normal">Selecciona una ya existente</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowUploadPanel(true); setUploadCategory('Fondos'); }}
                                            className="p-6 bg-green-50 border-2 border-dashed border-green-200 rounded-xl text-green-600 font-bold flex flex-col items-center justify-center gap-2 hover:bg-green-100 transition-colors cursor-pointer"
                                        >
                                            <Upload size={28} />
                                            <span className="text-sm">Subir Nueva</span>
                                            <span className="text-[10px] text-green-400 font-normal">Arrastra o selecciona</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* ── Upload panel with category ── */
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-black text-gray-600 text-sm">Subir imagen nueva</h4>
                                            <button type="button" onClick={() => setShowUploadPanel(false)}
                                                className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
                                        </div>

                                        {/* Category selector */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría del recurso</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {categories.map(cat => (
                                                    <button key={cat} type="button" onClick={() => setUploadCategory(cat)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${uploadCategory === cat ? 'bg-green-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300'}`}>
                                                        {cat}
                                                    </button>
                                                ))}
                                                {showNewCategoryInput ? (
                                                    <input
                                                        autoFocus
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border-2 border-green-300 outline-none w-[140px]"
                                                        placeholder="Nombre..."
                                                        value={newCategoryName}
                                                        onChange={e => setNewCategoryName(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && newCategoryName.trim()) {
                                                                setCategories(prev => [...prev, newCategoryName.trim()]);
                                                                setUploadCategory(newCategoryName.trim());
                                                                setNewCategoryName('');
                                                                setShowNewCategoryInput(false);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (newCategoryName.trim()) {
                                                                setCategories(prev => [...prev, newCategoryName.trim()]);
                                                                setUploadCategory(newCategoryName.trim());
                                                            }
                                                            setNewCategoryName(''); setShowNewCategoryInput(false);
                                                        }}
                                                    />
                                                ) : (
                                                    <button type="button"
                                                        onClick={() => { setShowNewCategoryInput(true); setNewCategoryName(''); }}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-green-600 border border-green-200 hover:bg-green-50 flex items-center gap-1">
                                                        <FolderPlus size={12} /> Nueva
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Uploader */}
                                        <MediaUploader
                                            accept="image"
                                            onUpload={async (url, mediaType) => {
                                                // Save to resources with selected category
                                                try {
                                                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                                                        body: JSON.stringify({ title: formData.name || 'Fondo', type: 'image', url, category: uploadCategory })
                                                    });
                                                } catch (e) { /* silent */ }
                                                setFormData({ ...formData, backgroundImage: url });
                                                setShowUploadPanel(false);
                                                showToast('Imagen subida y guardada en recursos', 'ok');
                                            }}
                                            onClear={() => { }}
                                            label="Arrastra o haz clic"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* Resource Picker Modal */}
                            <ResourcePicker
                                open={showResourcePicker}
                                accept="image"
                                onSelect={(url) => { setFormData({ ...formData, backgroundImage: url }); setShowResourcePicker(false); }}
                                onClose={() => setShowResourcePicker(false)}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!formData.name?.trim()}
                            className="w-full p-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-200"
                        >
                            <Save size={20} /> {isEditing ? 'Actualizar Mundo' : 'Crear Mundo'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── World list ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4">
                {worlds.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <Globe size={48} className="mx-auto text-gray-200 mb-4" />
                        <h2 className="text-xl font-black text-gray-300">No hay mundos creados</h2>
                        <p className="text-gray-300 font-bold mt-1">Crea el primero para organizar tu contenido</p>
                    </div>
                ) : (
                    worlds.map(w => {
                        const WIcon = getIconComponent(w.icon);
                        return (
                            <div key={w.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${w.colorTheme}15`, border: `2px solid ${w.colorTheme}30` }}
                                    >
                                        <WIcon size={26} style={{ color: w.colorTheme }} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-3">
                                            {w.name}
                                            {w.pointsToUnlock > 0 && (
                                                <span className="text-xs font-bold bg-yellow-50 text-yellow-600 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {w.pointsToUnlock} pts
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-400 font-bold text-sm">{w.description || 'Sin descripción'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(w)}
                                        className="p-2.5 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors" title="Editar">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(w.id, w.name)}
                                        className="p-2.5 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors" title="Eliminar">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
