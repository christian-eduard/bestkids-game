"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { GamificationService } from "@/services/gamification.service";
import { AVATARS } from "@/lib/constants";

export default function AvatarSelectionPage() {
    const router = useRouter();
    const toast = useToast();
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSelectAvatar = (avatarId: number) => {
        const avatar = AVATARS.find(a => a.id === avatarId);
        if (avatar?.locked) {
            toast.error("Este avatar está bloqueado. ¡Juega para desbloquearlo!");
            return;
        }
        setSelectedAvatar(avatarId);
    };

    const handleConfirm = async () => {
        if (!selectedAvatar) {
            toast.error("Por favor selecciona un avatar");
            return;
        }

        setSaving(true);
        try {
            // Save avatar selection
            localStorage.setItem('bestkids-selected-avatar', String(selectedAvatar));
            localStorage.setItem('bestkids-avatar-selected', 'true');

            toast.success("¡Excelente elección! Bienvenido a BestKids 🎉");

            // Redirect to main dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            toast.error("Error al guardar tu avatar");
            setSaving(false);
        }
    };

    const selectedAvatarData = AVATARS.find(a => a.id === selectedAvatar);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/20 via-purple-100 to-blue-100 dark:from-[#221022] dark:via-[#2d1b2e] dark:to-[#1a1625] flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-20 bg-primary rounded-full mb-4 shadow-xl shadow-primary/30">
                        <span className="text-4xl">🎭</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-[#1c0d1c] dark:text-white mb-3 drop-shadow-sm">
                        ¡Elige tu Avatar!
                    </h1>
                    <p className="text-lg text-[#6b4c6b] dark:text-[#dcb5dc] max-w-md mx-auto">
                        Tu avatar te acompañará en todas tus aventuras. ¡Elige el que más te guste!
                    </p>
                </div>

                {/* Current Selection Preview */}
                {selectedAvatarData && (
                    <div className="bg-white dark:bg-[#321a32] rounded-2xl p-6 mb-8 shadow-xl border border-primary/20 flex items-center gap-6">
                        <div className={`size - 24 rounded - 2xl bg - gradient - to - br ${selectedAvatarData.color} flex items - center justify - center shadow - lg`}>
                            <span className="text-6xl">{selectedAvatarData.emoji}</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-primary uppercase tracking-wide">Tu elección</p>
                            <h2 className="text-2xl font-bold text-[#1c0d1c] dark:text-white">{selectedAvatarData.name}</h2>
                            <p className="text-[#6b4c6b] dark:text-[#dcb5dc]">{selectedAvatarData.description}</p>
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={saving}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    ¡Confirmar!
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Avatar Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {AVATARS.map((avatar) => (
                        <button
                            key={avatar.id}
                            onClick={() => handleSelectAvatar(avatar.id)}
                            disabled={avatar.locked}
                            className={`relative p - 6 rounded - 2xl transition - all duration - 300 ${selectedAvatar === avatar.id
                                ? 'bg-white dark:bg-[#321a32] ring-4 ring-primary shadow-xl scale-105'
                                : avatar.locked
                                    ? 'bg-gray-100 dark:bg-gray-800/50 opacity-60 cursor-not-allowed'
                                    : 'bg-white dark:bg-[#321a32] hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-primary/30'
                                } `}
                        >
                            {/* Selection Check */}
                            {selectedAvatar === avatar.id && (
                                <div className="absolute -top-2 -right-2 size-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-white text-lg">check</span>
                                </div>
                            )}

                            {/* Lock Icon */}
                            {avatar.locked && (
                                <div className="absolute -top-2 -right-2 size-8 bg-gray-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-white text-lg">lock</span>
                                </div>
                            )}

                            {/* Avatar */}
                            <div className={`size - 20 mx - auto rounded - 2xl bg - gradient - to - br ${avatar.color} flex items - center justify - center shadow - lg mb - 4 ${avatar.locked ? 'grayscale' : ''} `}>
                                <span className="text-5xl">{avatar.emoji}</span>
                            </div>

                            {/* Name */}
                            <p className="text-sm font-bold text-[#1c0d1c] dark:text-white text-center line-clamp-1">
                                {avatar.name}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Skip Option (hidden but accessible) */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => {
                            localStorage.setItem('bestkids-avatar-selected', 'true');
                            router.push('/dashboard');
                        }}
                        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
                    >
                        Elegir más tarde
                    </button>
                </div>
            </div>
        </div>
    );
}
