"use client";
import React, { useState, useRef } from 'react';
import { CloudUpload, X, Play, Pause, Image as ImageIcon, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaUploaderProps {
    onUpload: (url: string, type: string) => void;
    accept?: 'image' | 'audio' | 'video' | 'all';
    label?: string;
    value?: string;
    onClear?: () => void;
}

export default function MediaUploader({
    onUpload,
    accept = 'all',
    label = "Sube multimedia",
    value,
    onClear
}: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [fileType, setFileType] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAcceptedTypes = () => {
        switch (accept) {
            case 'image': return 'image/*';
            case 'audio': return 'audio/*';
            case 'video': return 'video/*';
            default: return 'image/*,audio/*,video/*';
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        setProgress(10);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Error al subir');

            const data = await res.json();
            setProgress(100);
            setPreview(data.url);
            setFileType(data.type);
            onUpload(data.url, data.type);
        } catch (err) {
            alert("Error al subir el archivo");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const clearMedia = () => {
        setPreview(null);
        setFileType(null);
        if (onClear) onClear();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-bold text-gray-500 ml-2">{label}</label>}

            <div className="relative">
                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="h-32 border-3 border-dashed border-purple-200 rounded-3xl bg-purple-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors group"
                        >
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                                <CloudUpload size={24} />
                            </div>
                            <span className="mt-2 text-xs font-bold text-purple-400">Haz clic o arrastra</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept={getAcceptedTypes()}
                                onChange={handleFileChange}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative h-40 rounded-3xl overflow-hidden bg-white border-2 border-purple-100 shadow-sm group"
                        >
                            {/* Previews based on type (simulated by URL path/extension) */}
                            {preview.includes('/images/') || preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${preview}`} className="w-full h-full object-cover" alt="Preview" />
                            ) : preview.includes('/audio/') || preview.match(/\.(mp3|wav|ogg)$/i) ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-blue-500">
                                    <div className="p-4 bg-white rounded-full shadow-md"><Play size={32} fill="currentColor" /></div>
                                    <span className="mt-2 text-xs font-bold uppercase tracking-widest">Audio cargado</span>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-green-50 text-green-500">
                                    <Film size={40} />
                                    <span className="mt-2 text-xs font-bold uppercase tracking-widest">Video cargado</span>
                                </div>
                            )}

                            <button
                                onClick={clearMedia}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-3xl flex flex-col items-center justify-center">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="mt-2 text-[10px] font-black text-purple-600 animate-pulse uppercase">Subiendo...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
