"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Image as ImageIcon, Upload, FolderPlus } from 'lucide-react';
import MediaUploader from './MediaUploader';
import { resolveMediaUrl } from '@/lib/resolveMediaUrl';

interface Resource {
    id: number;
    title: string;
    url: string;
    type: string;
    category?: string;
}

interface ResourcePickerProps {
    open: boolean;
    onSelect: (url: string) => void;
    onClose: () => void;
    accept?: 'image' | 'audio' | 'video' | 'all';
}

export default function ResourcePicker({ open, onSelect, onClose, accept = 'image' }: ResourcePickerProps) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<'library' | 'upload'>('library');
    const [newCategory, setNewCategory] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    useEffect(() => {
        if (open) fetchResources();
    }, [open]);

    const fetchResources = async () => {
        try {
            const typeFilter = accept === 'all' ? '' : `?type=${accept}`;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources${typeFilter}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setResources(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadAndSave = async (url: string, mediaType: string) => {
        // Save as resource too
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: `Recurso ${new Date().toLocaleDateString()}`,
                    type: mediaType === 'images' ? 'image' : mediaType,
                    url,
                    category: newCategory || 'Ejercicios'
                })
            });
        } catch (e) { /* silent */ }
        onSelect(url);
        onClose();
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) return;
        setShowCategoryInput(false);
        setNewCategory('');
    };

    const filtered = resources.filter(r => {
        const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            (r.category || '').toLowerCase().includes(search.toLowerCase());
        const matchType = accept === 'all' || r.type === accept;
        return matchSearch && matchType;
    });

    const categories = [...new Set(resources.map(r => r.category || 'General'))];

    const getFullUrl = resolveMediaUrl;

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-[32px] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                            <ImageIcon size={24} className="text-purple-500" />
                            Selector de Recursos
                        </h2>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setTab('library')}
                            className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${tab === 'library' ? 'text-purple-600 border-b-3 border-purple-600 bg-purple-50/50' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Search size={18} /> Biblioteca
                        </button>
                        <button
                            onClick={() => setTab('upload')}
                            className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${tab === 'upload' ? 'text-purple-600 border-b-3 border-purple-600 bg-purple-50/50' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Upload size={18} /> Subir Nuevo
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {tab === 'library' ? (
                            <div className="space-y-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-purple-100"
                                        placeholder="Buscar por nombre o categoría..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>

                                {/* Categories */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    <button
                                        onClick={() => setSearch('')}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${!search ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        Todos
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSearch(cat)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${search === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Grid */}
                                {filtered.length === 0 ? (
                                    <div className="text-center py-16">
                                        <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-bold">No hay recursos disponibles</p>
                                        <p className="text-gray-300 text-sm">Sube uno desde la pestaña "Subir Nuevo"</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {filtered.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => { onSelect(r.url); onClose(); }}
                                                className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-purple-400 hover:shadow-lg transition-all"
                                            >
                                                {r.type === 'image' ? (
                                                    <img src={getFullUrl(r.url)} alt={r.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center">
                                                        <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">{r.type === 'audio' ? 'music_note' : 'description'}</span>
                                                        <span className="text-xs font-bold text-gray-400">{r.type}</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white text-xs font-bold truncate">{r.title}</p>
                                                    <p className="text-white/60 text-[10px]">{r.category || 'General'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Category for new upload */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-2">
                                        Categoría del recurso
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setNewCategory(cat)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${newCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                        {showCategoryInput ? (
                                            <input
                                                autoFocus
                                                className="px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-purple-200 outline-none"
                                                placeholder="Nueva categoría..."
                                                value={newCategory}
                                                onChange={e => setNewCategory(e.target.value)}
                                                onBlur={() => { if (!newCategory) setShowCategoryInput(false); }}
                                                onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => { setShowCategoryInput(true); setNewCategory(''); }}
                                                className="px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1"
                                            >
                                                <FolderPlus size={16} /> Nueva
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Upload zone */}
                                <MediaUploader
                                    accept={accept}
                                    onUpload={(url, type) => handleUploadAndSave(url, type)}
                                    label="Arrastra o selecciona un archivo"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
