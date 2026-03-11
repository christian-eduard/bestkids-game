"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2, ArrowLeft, Star, Play, Lock, CheckCircle2 } from "lucide-react";

interface Level {
    id: number;
    name: string;
    description: string;
    levelNumber: number;
    isUnlocked: boolean;
    progress: {
        isCompleted: boolean;
        starsEarned: number;
        exercisesCompleted: number;
        totalExercises: number;
    };
}

interface World {
    id: number;
    name: string;
    description: string;
    icon: string;
    colorTheme: string;
}

export default function WorldLevelsPage() {
    const params = useParams();
    const router = useRouter();
    const [world, setWorld] = useState<World | null>(null);
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchWorldAndLevels(params.id as string);
        }
    }, [params.id]);

    const fetchWorldAndLevels = async (worldId: string) => {
        try {
            const [worldRes, levelsRes] = await Promise.all([
                api.get(`/worlds/${worldId}`),
                api.get(`/worlds/${worldId}/levels`),
            ]);

            setWorld(worldRes.data);
            setLevels(levelsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-pk-purple" />
            </div>
        );
    }

    if (!world) return null;

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Immersive Header */}
            <div
                className="card-pk relative overflow-hidden text-center p-8 border-none text-white shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${world.colorTheme || '#9B7EDE'}, #2D3047)`,
                }}
            >
                {/* Back Button */}
                <button
                    onClick={() => router.push("/dashboard/worlds")}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* World Icon & Info */}
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-6xl mx-auto mb-4 border-2 border-white/30 animate-float">
                        {world.icon}
                    </div>
                    <h1 className="text-display-lg drop-shadow-md mb-2">{world.name}</h1>
                    <p className="text-body-lg opacity-90 max-w-2xl mx-auto">
                        {world.description}
                    </p>
                </div>

                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Levels Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        onClick={() => level.isUnlocked && router.push(`/dashboard/worlds/${params.id}/levels/${level.id}`)}
                        className={`
                            card-pk relative overflow-hidden transition-all duration-300 group
                            ${level.isUnlocked
                                ? 'cursor-pointer hover:-translate-y-2 hover:shadow-lg border-2 border-transparent hover:border-pk-purple'
                                : 'opacity-70 bg-pk-gray-100 cursor-not-allowed'
                            }
                        `}
                    >
                        {/* Level Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center text-display-sm shadow-sm
                                ${level.isUnlocked ? 'bg-pk-lavender text-pk-purple' : 'bg-pk-gray-300 text-pk-gray-500'}
                            `}>
                                {level.levelNumber}
                            </div>

                            {/* Status Icons */}
                            {level.progress.isCompleted ? (
                                <div className="bg-pk-mint text-pk-teal p-2 rounded-full shadow-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            ) : !level.isUnlocked && (
                                <div className="bg-pk-gray-200 text-pk-gray-500 p-2 rounded-full">
                                    <Lock className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <h3 className="text-display-sm text-pk-dark mb-2 relative z-10">
                            {level.name}
                        </h3>
                        <p className="text-body-sm text-pk-gray mb-6 h-10 line-clamp-2 relative z-10">
                            {level.description}
                        </p>

                        {/* Footer / Progress */}
                        {level.isUnlocked ? (
                            <div className="relative z-10">
                                {/* Stars */}
                                <div className="flex justify-center gap-1 mb-4 bg-pk-light rounded-xl p-2">
                                    {[1, 2, 3].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 transition-colors ${star <= level.progress.starsEarned
                                                    ? 'text-pk-gold fill-pk-gold'
                                                    : 'text-pk-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Action Button */}
                                <button className="w-full btn-pk btn-pk-secondary group-hover:bg-pk-purple group-hover:text-white transition-colors">
                                    {level.progress.isCompleted ? (
                                        <>
                                            <Play className="w-4 h-4" /> Repetir
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 fill-current" /> ¡Jugar!
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-pk-gray-200/50 rounded-xl">
                                <span className="text-caption text-pk-gray-500">Bloqueado</span>
                            </div>
                        )}

                        {/* Background Decor */}
                        {level.isUnlocked && level.progress.isCompleted && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pk-mint/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
