"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, Medal, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/contexts/ToastContext";
import { Progress } from "@/components/ui/progress";

interface Achievement {
    id: number;
    title: string;
    description: string;
    category: string;
    requirementValue: number;
    pointsReward: number;
    icon: string;
    isUnlocked: boolean;
    isClaimed: boolean;
    progressCurrent: number;
    progressTarget: number;
    unlockedAt?: string;
}

export function BadgeGrid() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast: toast } = useToast();

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get("/gamification/achievements/user");
            setAchievements(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (achievement: Achievement) => {
        if (!achievement.isUnlocked || achievement.isClaimed) return;

        try {
            await api.post(`/gamification/achievements/${achievement.id}/claim`);
            toast(`¡Recompensa reclamada! +${achievement.pointsReward} Puntos`, "success");
            // Refresh to update claimed status
            fetchAchievements();
        } catch (err) {
            toast("Error al reclamar recompensa", "error");
        }
    };

    if (loading) {
        return <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            ))}
        </div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
                const percent = Math.min(100, Math.round((achievement.progressCurrent / achievement.progressTarget) * 100));

                return (
                    <Card
                        key={achievement.id}
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 border-2",
                            achievement.isUnlocked
                                ? "bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-900/30 shadow-md hover:shadow-lg hover:-translate-y-1"
                                : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-80"
                        )}
                    >
                        <CardContent className="p-5 flex flex-col items-center text-center h-full justify-between">
                            {/* Icon / Badge Visual */}
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-3 shadow-inner relative",
                                achievement.isUnlocked ? "bg-gradient-to-br from-yellow-100 to-orange-100" : "bg-gray-200 grayscale"
                            )}>
                                {achievement.icon || <Medal />}

                                {achievement.isUnlocked && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="w-full">
                                <h3 className={cn("font-bold text-lg leading-tight mb-1", !achievement.isUnlocked && "text-gray-500")}>
                                    {achievement.title}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-2 h-8">{achievement.description}</p>
                            </div>

                            {/* Progress or Claim Button */}
                            <div className="w-full mt-4">
                                {achievement.isUnlocked ? (
                                    achievement.isClaimed ? (
                                        <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 py-1.5 rounded-lg w-full">
                                            <CheckCircle className="w-3 h-3" /> Reclamado
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleClaim(achievement)}
                                            className="w-full py-1.5 px-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-xs font-bold rounded-lg shadow-sm animate-pulse flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Award className="w-3 h-3" />
                                            Reclamar {achievement.pointsReward} pts
                                        </button>
                                    )
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                            <span>Progreso</span>
                                            <span>{percent}%</span>
                                        </div>
                                        <Progress value={percent} className="h-1.5 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-blue-400" />
                                        <p className="text-[10px] text-gray-400 text-right mt-1">
                                            {achievement.progressCurrent} / {achievement.progressTarget}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {!achievement.isUnlocked && (
                            <div className="absolute top-3 right-3 text-gray-300">
                                <Lock className="w-4 h-4" />
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
