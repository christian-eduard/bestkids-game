"use client";

import { useEffect, useState, useMemo } from 'react';
import { ResourceService, Resource, ResourceType } from '@/services/resource.service';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/ConfirmModal';
import MediaUploader from '@/components/shared/MediaUploader';

const API = process.env.NEXT_PUBLIC_API_URL;
const authHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
});

const TYPE_LABELS: Record<string, string> = {
    image: 'Imágenes',
    video: 'Vídeos',
    link: 'Enlaces',
    file: 'Archivos',
    documentation: 'Documentación',
};

const TYPE_ICONS: Record<string, string> = {
    image: 'image',
    video: 'videocam',
    link: 'link',
    file: 'description',
    documentation: 'menu_book',
};

export default function AdminResourcesPage() {
    const { user } = useAuth();
    const toast = useToast();
    const confirm = useConfirm();

    // Data
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [typeFilter, setTypeFilter] = useState<ResourceType>(ResourceType.IMAGE);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Categories are now derived from resources and filtered by type
    const categoriesByType = useMemo(() => {
        const cats: Record<string, string[]> = {
            [ResourceType.IMAGE]: ['General'],
            [ResourceType.VIDEO]: ['General'],
            [ResourceType.LINK]: ['General'],
            [ResourceType.FILE]: ['General'],
            [ResourceType.DOCUMENTATION]: ['General'],
        };

        resources.forEach(res => {
            if (res.category && !cats[res.type].includes(res.category)) {
                cats[res.type].push(res.category);
            }
        });

        Object.keys(cats).forEach(type => cats[type].sort());
        return cats;
    }, [resources]);

    const currentCategories = useMemo(() => categoriesByType[typeFilter], [categoriesByType, typeFilter]);

    // Category management
    const [showCatManager, setShowCatManager] = useState(false);
    const [editingCat, setEditingCat] = useState<string | null>(null);
    const [editCatValue, setEditCatValue] = useState('');
    const [newCatInput, setNewCatInput] = useState('');
    const [showNewCat, setShowNewCat] = useState(false);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [formData, setFormData] = useState({
        title: '', description: '', type: ResourceType.IMAGE, url: '', category: '',
    });
    const [saving, setSaving] = useState(false);
    const [showNewCatInModal, setShowNewCatInModal] = useState(false);
    const [newCatInModalValue, setNewCatInModalValue] = useState('');

    // Init
    useEffect(() => { fetchResources(); }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await ResourceService.getAll();
            setResources(data && data.length > 0 ? data : []);
        } catch (error) {
            console.error(error);
            setResources([]);
        } finally { setLoading(false); }
    };

    // Handlers
    const openModal = (resource?: Resource) => {
        setShowNewCatInModal(false);
        setNewCatInModalValue('');
        if (resource) {
            setEditingResource(resource);
            setFormData({
                title: resource.title, description: resource.description || '',
                type: resource.type, url: resource.url, category: resource.category || 'General',
            });
        } else {
            setEditingResource(null);
            setFormData({ 
                title: '', 
                description: '', 
                type: typeFilter, 
                url: '', 
                category: currentCategories[0] || 'General' 
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingResource) {
                await ResourceService.update(editingResource.id, formData);
                toast.success('Recurso actualizado');
            } else {
                await ResourceService.create(formData);
                toast.success('Recurso creado');
            }
            setShowModal(false);
            fetchResources();
        } catch (error) { toast.error('Error al guardar'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: 'Eliminar Recurso',
            message: '¿Eliminar este recurso? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar', cancelText: 'Cancelar', variant: 'danger'
        });
        if (!ok) return;
        try { await ResourceService.delete(id); toast.success('Recurso eliminado'); fetchResources(); }
        catch { toast.error('Error al eliminar'); }
    };

    // Category CRUD (Scoped to type)
    const renameCategory = async (oldName: string) => {
        if (!editCatValue.trim() || editCatValue === oldName) { setEditingCat(null); return; }
        try {
            // Updated backend logic would be needed for type-scoped rename, but for now we update all resources of current type
            const resourcesToUpdate = resources.filter(r => r.type === typeFilter && r.category === oldName);
            for (const r of resourcesToUpdate) {
                await ResourceService.update(r.id, { category: editCatValue.trim() });
            }
            toast.success(`Categoría renombrada para ${TYPE_LABELS[typeFilter]}`);
            setEditingCat(null); fetchResources();
        } catch { toast.error('Error al renombrar'); }
    };

    const deleteCategory = async (name: string) => {
        const ok = await confirm({
            title: 'Eliminar categoría',
            message: `Los recursos de "${name}" en "${TYPE_LABELS[typeFilter]}" se moverán a "General". ¿Continuar?`,
            confirmText: 'Eliminar', cancelText: 'Cancelar', variant: 'danger'
        });
        if (!ok) return;
        try {
            const resourcesToUpdate = resources.filter(r => r.type === typeFilter && r.category === name);
            for (const r of resourcesToUpdate) {
                await ResourceService.update(r.id, { category: 'General' });
            }
            toast.success('Categoría eliminada');
            fetchResources();
        } catch { toast.error('Error al eliminar'); }
    };

    const createCategoryInModal = () => {
        if (!newCatInModalValue.trim()) return;
        setFormData({ ...formData, category: newCatInModalValue.trim() });
        setShowNewCatInModal(false);
        setNewCatInModalValue('');
        toast.success('Categoría lista para el nuevo recurso');
    };

    const addNewCategoryManually = () => {
        if (!newCatInput.trim()) return;
        // To "create" a category without a resource, we'd need a separate table or just trust the memo
        // For now, we'll notify that it will appear once a resource is added to it
        setCategoryFilter(newCatInput.trim());
        setNewCatInput('');
        setShowNewCat(false);
        toast.info(`Categoría "${newCatInput}" seleccionada. Crea un recurso para guardarla.`);
    };

    // Auto-select the first category when type changes
    useEffect(() => {
        if (currentCategories.length > 0 && !currentCategories.includes(categoryFilter)) {
            setCategoryFilter(currentCategories[0]);
        }
    }, [typeFilter, currentCategories]);

    const filtered = resources.filter(res => {
        const okType = res.type === typeFilter;
        const okCat = !categoryFilter || (res.category || 'General') === categoryFilter;
        const okSearch = !searchTerm || res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (res.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        return okType && okCat && okSearch;
    });

    const mainTypes = [ResourceType.IMAGE, ResourceType.VIDEO, ResourceType.LINK, ResourceType.FILE, ResourceType.DOCUMENTATION];

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-screen pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Gestión de Recursos</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Administra y organiza el contenido multimedia por tipos y categorías.</p>
                </div>
                <button onClick={() => openModal()}
                    className="bg-primary hover:bg-fuchsia-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                    NUEVO RECURSO
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Fixed Sidebar for Types */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="font-black text-slate-400 text-xs tracking-widest uppercase mb-4 px-2">Tipos de Recursos</h3>
                        <div className="flex flex-col gap-2">
                            {mainTypes.map(type => (
                                <button key={type} onClick={() => setTypeFilter(type)}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold group ${typeFilter === type ? (type === ResourceType.DOCUMENTATION ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 border border-blue-200') : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${typeFilter === type ? (type === ResourceType.DOCUMENTATION ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-blue-600 text-white shadow-md shadow-blue-500/30') : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-white group-hover:text-blue-500'}`}>
                                        <span className="material-symbols-outlined">{TYPE_ICONS[type]}</span>
                                    </div>
                                    <span className="text-base">{TYPE_LABELS[type]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {typeFilter === ResourceType.DOCUMENTATION && (
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-6 text-white shadow-xl shadow-amber-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                <h4 className="font-black text-lg">Guía de Uso</h4>
                            </div>
                            <ul className="space-y-4 text-sm font-medium opacity-90">
                                <li className="flex gap-3">
                                    <span className="font-black opacity-50">01</span>
                                    <span>Sube guías didácticas o fichas imprimibles en PDF/DOC.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-black opacity-50">02</span>
                                    <span>Asigna una categoría (Ej: "Matemáticas - Unidad 1").</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-black opacity-50">03</span>
                                    <span>Los profesores podrán descargarlos e imprimirlos para sus clases.</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </aside>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {/* Top Bar: Search and Categories */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="relative w-full md:w-80">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input type="text" placeholder="Buscar en recursos..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                            </div>

                            {/* Categories */}
                            <div className="flex-1 w-full overflow-x-auto hide-scrollbar flex gap-2 items-center px-2 border-l-0 md:border-l border-slate-100 dark:border-slate-800 pl-4">
                                <span className="hidden md:inline text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 shrink-0">Categorías {TYPE_LABELS[typeFilter]}:</span>
                                {currentCategories.length > 0 ? currentCategories.map(cat => (
                                    <button key={cat} onClick={() => setCategoryFilter(cat)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${categoryFilter === cat ? 'bg-slate-800 border-slate-800 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}>
                                        {cat}
                                    </button>
                                )) : (
                                    <span className="text-sm font-medium text-slate-400 italic">No hay categorías específicas para {TYPE_LABELS[typeFilter]}.</span>
                                )}
                            </div>
                            <button onClick={() => setShowCatManager(!showCatManager)}
                                className={`p-3 rounded-full transition-colors shrink-0 ${showCatManager ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`} title="Gestionar Categorías">
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                        </div>

                        {/* Category manager inline */}
                        {showCatManager && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h4 className="font-black text-slate-400 text-[10px] tracking-widest uppercase">Categorías en {TYPE_LABELS[typeFilter]}</h4>
                                    <button onClick={() => setShowNewCat(true)} className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-fuchsia-600 uppercase transition-colors">
                                        <span className="material-symbols-outlined text-sm">add_circle</span> Crear Nueva
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {showNewCat && (
                                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 border border-blue-100">
                                            <input autoFocus
                                                className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 border-2 border-primary outline-none"
                                                placeholder="Nombre categoría..."
                                                value={newCatInput} onChange={e => setNewCatInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addNewCategoryManually()} />
                                            <button onClick={addNewCategoryManually} className="p-1.5 bg-green-500 text-white rounded-lg shadow-sm"><span className="material-symbols-outlined text-sm">check</span></button>
                                            <button onClick={() => setShowNewCat(false)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg"><span className="material-symbols-outlined text-sm">close</span></button>
                                        </div>
                                    )}
                                    {currentCategories.map(cat => (
                                        <div key={cat} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-100 transition-all hover:border-slate-300 group">
                                            {editingCat === cat ? (
                                                <>
                                                    <input autoFocus
                                                        className="flex-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 border-2 border-primary outline-none"
                                                        value={editCatValue} onChange={e => setEditCatValue(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && renameCategory(cat)} />
                                                    <button onClick={() => renameCategory(cat)} className="p-1.5 bg-green-100 text-green-600 rounded-lg"><span className="material-symbols-outlined text-sm">check</span></button>
                                                    <button onClick={() => setEditingCat(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg"><span className="material-symbols-outlined text-sm">close</span></button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{cat}</span>
                                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setEditingCat(cat); setEditCatValue(cat); }} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                        {cat !== 'General' && (
                                                            <button onClick={() => deleteCategory(cat)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <span className="material-symbols-outlined animate-spin text-5xl text-primary">autorenew</span>
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map(res => (
                                <div key={res.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col cursor-pointer" onClick={() => openModal(res)}>
                                    <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                        {res.type === ResourceType.IMAGE ? (
                                            <img src={res.url.startsWith('/') ? `${API?.replace('/api', '')}${res.url}` : res.url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className={`flex flex-col items-center gap-3 ${res.type === ResourceType.DOCUMENTATION ? 'text-amber-500' : 'text-blue-500'}`}>
                                                <span className="material-symbols-outlined text-6xl opacity-80">{TYPE_ICONS[res.type] || 'folder'}</span>
                                            </div>
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); openModal(res); }} className="size-12 bg-white rounded-full text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <a href={res.url.startsWith('/') ? `${API?.replace('/api', '')}${res.url}` : res.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="size-12 bg-white rounded-full text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </a>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(res.id); }} className="size-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{res.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[40px] leading-snug">{res.description || <span className="italic opacity-50">Sin descripción</span>}</p>
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {new Date(res.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {res.category || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-[500px]">
                            <div className="size-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">check_box_outline_blank</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Sin recursos en {TYPE_LABELS[typeFilter]}</h3>
                            <p className="text-slate-500 max-w-sm">No hay contenido asociado a la categoría <strong className="text-primary">{categoryFilter || 'General'}</strong>.</p>
                            <button onClick={() => openModal()} className="mt-8 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                Subir un nuevo recurso
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Improved Wide */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">{editingResource ? 'edit_document' : 'add_photo_alternate'}</span>
                                </div>
                                {editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form id="resource-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Left Column */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pl-2">Tipo de Recurso</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {mainTypes.map(type => (
                                                <button key={type} type="button" onClick={() => {
                                                    setFormData({ 
                                                        ...formData, 
                                                        type, 
                                                        category: categoriesByType[type][0] || 'General' 
                                                    });
                                                }}
                                                    className={`p-3 rounded-2xl flex items-center gap-3 transition-all font-bold border-2 ${formData.type === type ? (type === ResourceType.DOCUMENTATION ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-blue-600 bg-blue-50 text-blue-700') : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                                                    <span className={`material-symbols-outlined ${formData.type === type && type === ResourceType.DOCUMENTATION ? 'text-amber-500' : ''}`}>{TYPE_ICONS[type]}</span>
                                                    <span className="text-sm">{TYPE_LABELS[type]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pl-2">Título de Identificación</label>
                                        <input required type="text" value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white outline-none font-bold text-slate-800 transition-all"
                                            placeholder="Ej: Logo Principal, Video Introducción..." />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pl-2">Categoría en {TYPE_LABELS[formData.type]}</label>
                                        <div className="flex gap-2 flex-wrap bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                                            {categoriesByType[formData.type].map(cat => (
                                                <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${formData.category === cat ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                                                    {cat}
                                                </button>
                                            ))}
                                            {showNewCatInModal ? (
                                                <div className="flex items-center gap-1.5 w-full mt-2">
                                                    <input autoFocus
                                                        className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-blue-500 outline-none"
                                                        placeholder="Nueva categoría..."
                                                        value={newCatInModalValue}
                                                        onChange={e => setNewCatInModalValue(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), createCategoryInModal())} />
                                                    <button type="button" onClick={createCategoryInModal} className="p-2 bg-green-500 text-white rounded-xl shadow-md"><span className="material-symbols-outlined">check</span></button>
                                                    <button type="button" onClick={() => { setShowNewCatInModal(false); setNewCatInModalValue(''); }} className="p-2 bg-slate-200 text-slate-600 rounded-xl"><span className="material-symbols-outlined">close</span></button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setShowNewCatInModal(true)}
                                                    className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 border-2 border-transparent hover:border-blue-200 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">add</span> Crear Categoría
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-8 flex flex-col">
                                    <div className="flex-1 flex flex-col">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pl-2 mb-3">
                                            Archivo o Enlace
                                        </label>
                                        <div className="flex-1 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 p-6 flex flex-col justify-center gap-4 hover:border-blue-400 transition-colors">
                                            {formData.type === ResourceType.LINK ? (
                                                <div>
                                                    <input required type="text" value={formData.url}
                                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 bg-white outline-none font-medium transition-all"
                                                        placeholder="https://youtu.be/... o ruta externa" />
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-4">
                                                    <MediaUploader
                                                        accept={formData.type === ResourceType.IMAGE ? 'image' : formData.type === ResourceType.VIDEO ? 'video' : (formData.type === ResourceType.DOCUMENTATION ? 'documentation' : 'all')}
                                                        value={formData.url}
                                                        onUpload={(url, type) => {
                                                            const newType = type === 'images' ? ResourceType.IMAGE : type === 'video' ? ResourceType.VIDEO : (type === 'documents' ? ResourceType.DOCUMENTATION : formData.type);
                                                            setFormData({ ...formData, url, type: newType });
                                                        }}
                                                        onClear={() => setFormData({ ...formData, url: '' })}
                                                        label="" />
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
                                                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-400 font-bold">o URL directa</span></div>
                                                    </div>
                                                    <input type="text" value={formData.url}
                                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 bg-white outline-none font-mono text-sm transition-all"
                                                        placeholder="https://..." />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pl-2">Notas Rápidas (Opcional)</label>
                                        <textarea value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 bg-slate-50 focus:bg-white outline-none font-medium transition-all min-h-[100px] resize-none"
                                            placeholder="Detalles sobre las dimensiones, uso previsto, etc..." />
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 md:px-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm font-medium text-slate-500">
                                {formData.type === ResourceType.DOCUMENTATION && <span className="flex items-center gap-2 text-amber-600"><span className="material-symbols-outlined">info</span> La documentación estará disponible para materias y unidades.</span>}
                            </p>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 md:flex-none px-6 py-3.5 font-black text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-2xl transition-colors">
                                    CANCELAR
                                </button>
                                <button disabled={saving} type="submit" form="resource-form"
                                    className="flex-1 md:flex-none px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 min-w-[200px]">
                                    {saving ? <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full"></div> : <span className="material-symbols-outlined">cloud_upload</span>}
                                    {editingResource ? 'ACTUALIZAR' : 'GUARDAR RECURSO'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
