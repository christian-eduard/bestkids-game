"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/ToastContext";

interface Avatar {
    id: number;
    name: string;
    emoji: string;
    unlockPointsRequired: number;
    unlockLevelRequired: number;
    isUnlocked: boolean;
    isSelected: boolean;
    imageUrl?: string;
}

interface AvatarSelectorProps {
    currentAvatarId?: number;
    onAvatarSelected: (avatar: Avatar) => void;
}

export function AvatarSelector({ currentAvatarId, onAvatarSelected }: AvatarSelectorProps) {
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const { showToast: toast } = useToast();

    useEffect(() => {
        if (open) {
            fetchAvatars();
        }
    }, [open]);

    const fetchAvatars = async () => {
        setLoading(true);
        try {
            const res = await api.get("/gamification/my-avatars");
            setAvatars(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (avatar: Avatar) => {
        if (!avatar.isUnlocked) {
            toast("Avatar bloqueado", "error");
            return;
        }

        try {
            await api.post(`/gamification/avatars/${avatar.id}/select`);
            onAvatarSelected(avatar);
            toast(`¡Has equipado a ${avatar.name}!`, "success");
            setOpen(false);
            // Update local state to reflect selection immediately if needed, 
            // but fetching parent will update it.
        } catch (err) {
            toast("Error al seleccionar avatar", "error");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                    Cambiar Avatar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <span>Galería de Avatares</span>
                        <span className="text-xs font-normal text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {avatars.filter(a => a.isUnlocked).length}/{avatars.length} Desbloqueados
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4 max-h-[60vh] overflow-y-auto p-1">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))
                    ) : (
                        avatars.map((avatar) => (
                            <TooltipProvider key={avatar.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => handleSelect(avatar)}
                                            disabled={!avatar.isUnlocked}
                                            className={cn(
                                                "group relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200",
                                                avatar.isSelected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg shadow-blue-500/20"
                                                    : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105",
                                                !avatar.isUnlocked && "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900 grayscale"
                                            )}
                                        >
                                            <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                                                {avatar.emoji}
                                            </div>

                                            {/* Status Indicators */}
                                            {avatar.id === currentAvatarId && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white p-1 shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}

                                            {!avatar.isUnlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-900/50 rounded-xl backdrop-blur-[1px]">
                                                    <Lock className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="text-center">
                                        <p className="font-bold">{avatar.name}</p>
                                        {!avatar.isUnlocked && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <p>Requiere:</p>
                                                <p>{avatar.unlockPointsRequired} Puntos</p>
                                                {avatar.unlockLevelRequired > 1 && <p>Nivel {avatar.unlockLevelRequired}</p>}
                                            </div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
