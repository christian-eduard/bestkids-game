"use client";

import { useEffect, useState } from 'react';
import { ResourceService, Resource, ResourceType } from '@/services/resource.service';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/components/ui/ConfirmModal';

export default function AdminResourcesPage() {
    const { user } = useAuth();
    const toast = useToast();
    const confirm = useConfirm();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ResourceType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: ResourceType.IMAGE,
        url: '',
        category: '',
    });
    const [saving, setSaving] = useState(false);

    const demoResources = [
        { id: 1, title: 'Avatar León', description: 'Avatar mascota de la plataforma', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/616/616412.png', category: 'Avatares', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 2, title: 'Avatar Oso', description: 'Avatar oso de peluche', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/2395/2395434.png', category: 'Avatares', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 3, title: 'Fondo Espacio', description: 'Fondo temático espacial', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/1545/1545532.png', category: 'Fondos', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 4, title: 'Fondo Selva', description: 'Fondo temático natural', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/484/484167.png', category: 'Fondos', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 5, title: 'Video Tutorial Intro', description: 'Video de bienvenida para nuevos usuarios', type: ResourceType.VIDEO, url: 'https://www.youtube.com/watch?v=example1', category: 'Tutoriales', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 6, title: 'Video Ejercicios', description: 'Cómo completar ejercicios', type: ResourceType.VIDEO, url: 'https://www.youtube.com/watch?v=example2', category: 'Tutoriales', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 7, title: 'Documentación API', description: 'Enlace a la documentación técnica', type: ResourceType.LINK, url: 'https://docs.bestkids.com', category: 'Documentación', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 8, title: 'Manual Profesor', description: 'Guía completa para profesores', type: ResourceType.FILE, url: '/docs/manual-profesor.pdf', category: 'Documentación', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 9, title: 'Icono Estrella', description: 'Icono de recompensa', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', category: 'Iconos', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
        { id: 10, title: 'Icono Trofeo', description: 'Icono de logro', type: ResourceType.IMAGE, url: 'https://cdn-icons-png.flaticon.com/512/3176/3176293.png', category: 'Iconos', createdAt: new Date().toISOString(), createdBy: 0, updatedAt: new Date().toISOString() },
    ] as Resource[];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await ResourceService.getAll();
            if (data && data.length > 0) {
                setResources(data);
            } else {
                setResources(demoResources);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources(demoResources);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (resource?: Resource) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                title: resource.title,
                description: resource.description || '',
                type: resource.type,
                url: resource.url,
                category: resource.category || '',
            });
        } else {
            setEditingResource(null);
            setFormData({
                title: '',
                description: '',
                type: ResourceType.IMAGE,
                url: '',
                category: '',
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
                toast.success('Recurso actualizado con éxito');
            } else {
                await ResourceService.create(formData);
                toast.success('Recurso creado con éxito');
            }
            setShowModal(false);
            fetchResources();
        } catch (error) {
            toast.error('Error al guardar el recurso');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: "Eliminar Recurso",
            message: "¿Estás seguro de que quieres eliminar este recurso?",
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            variant: "danger"
        });
        if (!confirmed) return;
        try {
            await ResourceService.delete(id);
            toast.success('Recurso eliminado');
            fetchResources();
        } catch (error) {
            toast.error('Error al eliminar el recurso');
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesFilter = filter === 'all' || res.type === filter;
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (res.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getTypeIcon = (type: ResourceType) => {
        switch (type) {
            case ResourceType.IMAGE: return 'image';
            case ResourceType.VIDEO: return 'videocam';
            case ResourceType.LINK: return 'link';
            case ResourceType.FILE: return 'description';
            default: return 'folder';
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white">Gestión de Recursos Master</h1>
                    <p className="text-text-muted dark:text-gray-400">Administra imágenes, vídeos, enlaces y otros activos multimedia.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Añadir Recurso
                </button>
            </header>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-soft border border-[#f4e7f4] dark:border-white/5">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-[#fcf8fc] dark:bg-white/5 text-text-muted hover:bg-[#f4e7f4]'}`}
                    >
                        Todos
                    </button>
                    {Object.values(ResourceType).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === type ? 'bg-primary text-white' : 'bg-[#fcf8fc] dark:bg-white/5 text-text-muted hover:bg-[#f4e7f4]'}`}
                        >
                            {type === 'image' ? 'Imágenes' : type === 'video' ? 'Vídeos' : type === 'link' ? 'Enlaces' : 'Archivos'}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar recursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 w-full md:w-64 focus:border-primary outline-none"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map(res => (
                        <div key={res.id} className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-soft border border-[#f4e7f4] dark:border-white/5 group transition-all hover:shadow-xl">
                            {/* Preview area */}
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center overflow-hidden">
                                {res.type === ResourceType.IMAGE ? (
                                    <img src={res.url} alt={res.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">{getTypeIcon(res.type)}</span>
                                        <span className="text-xs font-bold uppercase text-gray-400">{res.type}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(res)}
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-primary shadow-lg"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(res.id)}
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 shadow-lg"
                                        title="Eliminar"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-500 shadow-lg"
                                        title="Ver"
                                    >
                                        <span className="material-symbols-outlined">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                            {/* Info area */}
                            <div className="p-4">
                                <h3 className="font-bold text-text-main dark:text-white truncate">{res.title}</h3>
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2 mt-1 h-10">{res.description || 'Sin descripción'}</p>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        {res.category || 'General'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(res.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-gray-300">folder_off</span>
                    <div>
                        <p className="text-xl font-bold text-gray-500">No se encontraron recursos</p>
                        <p className="text-text-muted">Empieza subiendo tu primer archivo o enlace multimedia.</p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#321a32] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">{editingResource ? 'edit' : 'add_circle'}</span>
                                {editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 appearance-none">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Título</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                    placeholder="Nombre del recurso"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                    >
                                        <option value={ResourceType.IMAGE}>Imagen</option>
                                        <option value={ResourceType.VIDEO}>Vídeo</option>
                                        <option value={ResourceType.LINK}>Enlace</option>
                                        <option value={ResourceType.FILE}>Archivo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                        placeholder="Ej: Personajes, UI, Mundos"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">URL / Link</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                    placeholder="https://... o ruta local"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors min-h-[100px]"
                                    placeholder="Detalles sobre el recurso..."
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={saving}
                                    type="submit"
                                    className="bg-primary hover:bg-fuchsia-600 text-white px-8 py-2 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <span className="material-symbols-outlined text-lg">save</span>
                                    )}
                                    {editingResource ? 'Actualizar' : 'Crear Recurso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
