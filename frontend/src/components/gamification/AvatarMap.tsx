"use client";

import { useEffect, useState } from "react";
import { Lock, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Avatar {
    id: number;
    url: string;
    name: string;
    requiredPoints: number;
    isLocked: boolean;
}

interface AvatarMapProps {
    avatars: Avatar[];
    currentPoints: number;
    onSelect: (avatarId: number) => void;
    currentAvatarId: number;
}

export default function AvatarMap({ avatars, currentPoints, onSelect, currentAvatarId }: AvatarMapProps) {
    // Sort avatars by required points to create a path
    const sortedAvatars = [...avatars].sort((a, b) => a.requiredPoints - b.requiredPoints);

    // Calculate progress percentage for progress bar path
    // Simple logic: user points / max points of last avatar
    const maxPoints = sortedAvatars.length > 0 ? sortedAvatars[sortedAvatars.length - 1].requiredPoints : 1000;
    const progressPercent = Math.min((currentPoints / maxPoints) * 100, 100);

    return (
        <div className="relative py-12 px-4 overflow-hidden bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl border-4 border-blue-200 dark:border-gray-700 shadow-inner">

            {/* Background Path Decoration (SVG Curve?) - Simplified with CSS dashed line */}
            <div className="absolute top-1/2 left-0 w-full h-4 border-t-4 border-dashed border-gray-300 dark:border-gray-600 -translate-y-1/2 z-0" />
            <div
                className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-green-400 to-blue-500 -translate-y-1/2 z-0 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                style={{ width: `${progressPercent}%` }}
            />

            <div className="relative z-10 flex gap-8 items-center overflow-x-auto pb-8 pt-4 px-4 snap-x hide-scrollbar">
                {sortedAvatars.map((avatar, index) => {
                    const isUnlocked = !avatar.isLocked; // or currentPoints >= avatar.requiredPoints
                    const isCurrent = avatar.id === currentAvatarId;

                    return (
                        <div key={avatar.id} className="snap-center flex flex-col items-center gap-3 min-w-[140px]">
                            {/* Connection node on line */}
                            <div className={cn(
                                "w-6 h-6 rounded-full border-4 z-10 mb-2 transition-colors duration-500",
                                isUnlocked ? "bg-green-500 border-white shadow-lg" : "bg-gray-300 border-gray-100 dark:bg-gray-600 dark:border-gray-500"
                            )} />

                            <div
                                onClick={() => isUnlocked && onSelect(avatar.id)}
                                className={cn(
                                    "relative w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-300 transform group cursor-pointer",
                                    isUnlocked
                                        ? "bg-white dark:bg-gray-700 shadow-xl hover:-translate-y-2 border-b-8 border-gray-200 dark:border-gray-900"
                                        : "bg-gray-200 dark:bg-gray-800 opacity-80 grayscale",
                                    isCurrent && "ring-4 ring-green-400 ring-offset-4 ring-offset-blue-50 dark:ring-offset-gray-900 scale-105"
                                )}
                            >
                                {isUnlocked ? (
                                    <div className="text-6xl animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                                        {/* Using emoji for now, assuming URL is emoji or image path */}
                                        {avatar.url.startsWith('http') || avatar.url.startsWith('/') ? (
                                            <img src={avatar.url} alt={avatar.name} className="w-20 h-20 object-contain" />
                                        ) : (
                                            avatar.url // Emoji
                                        )}
                                    </div>
                                ) : (
                                    <Lock className="w-10 h-10 text-gray-400" />
                                )}

                                {isCurrent && (
                                    <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <div className="font-bold text-gray-700 dark:text-gray-200 font-heading">{avatar.name}</div>
                                <div className={cn(
                                    "text-xs font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1",
                                    isUnlocked ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                )}>
                                    <Star className="w-3 h-3 fill-current" />
                                    {avatar.requiredPoints} XP
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Mystery End Node */}
                <div className="snap-center flex flex-col items-center gap-3 min-w-[140px]">
                    <div className="w-6 h-6 rounded-full border-4 z-10 mb-2 bg-gray-300 border-gray-100 dark:bg-gray-600" />
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-inner opacity-80">
                        <span className="text-4xl">❓</span>
                    </div>
                    <div className="text-center text-sm font-bold text-gray-400 mt-2">Próximamente</div>
                </div>
            </div>
        </div>
    );
}
