"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { ResourceService, Resource, ResourceType } from '@/services/resource.service';

interface StoreItem {
    id?: number;
    name: string;
    description: string;
    type: string;
    cost: number;
    imageUrl: string;
    isActive: boolean;
}

export default function AdminStorePage() {
    const toast = useToast();
    const [items, setItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [showResourcePicker, setShowResourcePicker] = useState(false);

    const [formData, setFormData] = useState<StoreItem>({
        name: '',
        description: '',
        type: 'sticker',
        cost: 100,
        imageUrl: '',
        isActive: true,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchItems();
        fetchResources();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.get('/store/items');
            if (res.data && res.data.length > 0) {
                setItems(res.data);
            } else {
                // Fallback demo items
                setItems([
                    { id: 1, name: 'Gafas de Sol Cool', description: '¡Añade estilo a tu avatar!', type: 'sticker', cost: 50, imageUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', isActive: true },
                    { id: 2, name: 'Sombrero de Fiesta', description: '¡Listo para celebrar!', type: 'sticker', cost: 100, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2418/2418147.png', isActive: true },
                    { id: 3, name: 'Corona de Campeón', description: 'Para los reyes del aprendizaje.', type: 'sticker', cost: 200, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2923/2923223.png', isActive: true },
                    { id: 4, name: 'Capa de Superhéroe', description: '¡Vuela hacia el conocimiento!', type: 'sticker', cost: 300, imageUrl: 'https://cdn-icons-png.flaticon.com/512/5632/5632381.png', isActive: true },
                    { id: 5, name: 'Marco Dorado', description: 'Un marco brillante para campeones.', type: 'avatar_frame', cost: 500, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2550/2550254.png', isActive: true },
                    { id: 6, name: 'Marco Neón', description: '¡Brilla con luz propia!', type: 'avatar_frame', cost: 750, imageUrl: 'https://cdn-icons-png.flaticon.com/512/3504/3504066.png', isActive: true },
                    { id: 7, name: 'Marco Arcoíris', description: 'Todos los colores del éxito.', type: 'avatar_frame', cost: 600, imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', isActive: true },
                    { id: 8, name: 'Tema Espacial', description: 'Lleva tu dashboard a las estrellas.', type: 'theme', cost: 2000, imageUrl: 'https://cdn-icons-png.flaticon.com/512/1545/1545532.png', isActive: true },
                    { id: 9, name: 'Tema Selva', description: '¡Salvaje y verde!', type: 'theme', cost: 1500, imageUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png', isActive: true },
                    { id: 10, name: 'Tema Oceánico', description: 'Sumérgete en el aprendizaje marino.', type: 'theme', cost: 1800, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942079.png', isActive: true },
                ]);
            }
        } catch (error) {
            // On error, also show demo items
            setItems([
                { id: 1, name: 'Gafas de Sol Cool', description: '¡Añade estilo a tu avatar!', type: 'sticker', cost: 50, imageUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', isActive: true },
                { id: 2, name: 'Sombrero de Fiesta', description: '¡Listo para celebrar!', type: 'sticker', cost: 100, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2418/2418147.png', isActive: true },
                { id: 3, name: 'Corona de Campeón', description: 'Para los reyes del aprendizaje.', type: 'sticker', cost: 200, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2923/2923223.png', isActive: true },
                { id: 4, name: 'Capa de Superhéroe', description: '¡Vuela hacia el conocimiento!', type: 'sticker', cost: 300, imageUrl: 'https://cdn-icons-png.flaticon.com/512/5632/5632381.png', isActive: true },
                { id: 5, name: 'Marco Dorado', description: 'Un marco brillante para campeones.', type: 'avatar_frame', cost: 500, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2550/2550254.png', isActive: true },
                { id: 6, name: 'Marco Neón', description: '¡Brilla con luz propia!', type: 'avatar_frame', cost: 750, imageUrl: 'https://cdn-icons-png.flaticon.com/512/3504/3504066.png', isActive: true },
                { id: 7, name: 'Marco Arcoíris', description: 'Todos los colores del éxito.', type: 'avatar_frame', cost: 600, imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', isActive: true },
                { id: 8, name: 'Tema Espacial', description: 'Lleva tu dashboard a las estrellas.', type: 'theme', cost: 2000, imageUrl: 'https://cdn-icons-png.flaticon.com/512/1545/1545532.png', isActive: true },
                { id: 9, name: 'Tema Selva', description: '¡Salvaje y verde!', type: 'theme', cost: 1500, imageUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png', isActive: true },
                { id: 10, name: 'Tema Oceánico', description: 'Sumérgete en el aprendizaje marino.', type: 'theme', cost: 1800, imageUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942079.png', isActive: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async () => {
        try {
            const data = await ResourceService.getAll({ type: ResourceType.IMAGE });
            setResources(data);
        } catch (error) { }
    };

    const handleOpenModal = (item?: StoreItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                type: 'sticker',
                cost: 100,
                imageUrl: '',
                isActive: true,
            });
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingItem?.id) {
                await api.patch(`/store/items/${editingItem.id}`, formData);
                toast.success('Item actualizado');
            } else {
                await api.post('/store/items', formData);
                toast.success('Item creado');
            }
            setShowModal(false);
            fetchItems();
        } catch (error) {
            toast.error('Error al guardar item');
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (item: StoreItem) => {
        try {
            await api.patch(`/store/items/${item.id}`, { isActive: !item.isActive });
            toast.success('Estatus actualizado');
            fetchItems();
        } catch (error) {
            toast.error('Error al actualizar estatus');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white">Administración de la Tienda</h1>
                    <p className="text-text-muted dark:text-gray-400">Gestiona los productos disponibles para los estudiantes.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    Nuevo Item
                </button>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
            ) : (
                <div className="bg-card-light dark:bg-card-dark rounded-3xl overflow-hidden shadow-soft border border-[#f4e7f4] dark:border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fcf8fc] dark:bg-white/5 border-b border-[#f4e7f4] dark:border-white/5">
                                <th className="p-6 font-bold text-text-main dark:text-gray-200">Icono</th>
                                <th className="p-6 font-bold text-text-main dark:text-gray-200">Nombre</th>
                                <th className="p-6 font-bold text-text-main dark:text-gray-200">Tipo</th>
                                <th className="p-6 font-bold text-text-main dark:text-gray-200">Coste (XP)</th>
                                <th className="p-6 font-bold text-text-main dark:text-gray-200">Estado</th>
                                <th className="p-6 font-bold text-text-main dark:text-gray-200 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-6">
                                        <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 p-2 overflow-hidden">
                                            <img src={item.imageUrl || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-text-main dark:text-white">
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-xs text-text-muted truncate max-w-[200px]">{item.description}</p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full text-xs font-bold uppercase">
                                            {item.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-primary">
                                        {item.cost} XP
                                    </td>
                                    <td className="p-6">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all
                                            ${item.isActive
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {item.isActive ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#321a32] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">{editingItem ? 'edit' : 'add_shopping_cart'}</span>
                                {editingItem ? 'Editar Item' : 'Nuevo Item'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 appearance-none">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="avatar_frame">Marco de Avatar</option>
                                        <option value="sticker">Sticker</option>
                                        <option value="theme">Tema</option>
                                        <option value="powerup">Poder</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Coste (XP)</label>
                                    <input
                                        type="number"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: +e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">URL de Imagen</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors"
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowResourcePicker(!showResourcePicker)}
                                        className="p-2 bg-[#f4e7f4] dark:bg-white/5 rounded-xl hover:bg-primary/20 transition-colors"
                                        title="Seleccionar de Recursos"
                                    >
                                        <span className="material-symbols-outlined text-primary">folder_open</span>
                                    </button>
                                </div>
                                {showResourcePicker && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-primary/20 max-h-40 overflow-y-auto grid grid-cols-4 gap-2">
                                        {resources.length > 0 ? resources.map(res => (
                                            <button
                                                key={res.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, imageUrl: res.url });
                                                    setShowResourcePicker(false);
                                                }}
                                                className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                                            >
                                                <img src={res.url} className="w-full h-full object-cover" />
                                            </button>
                                        )) : <p className="col-span-4 text-center text-xs text-gray-400">No hay imágenes en la biblioteca.</p>}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-primary transition-colors min-h-[80px]"
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
                                    {editingItem ? 'Actualizar' : 'Crear Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
