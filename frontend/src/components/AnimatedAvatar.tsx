"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedAvatarProps {
    emoji: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    animation?: 'bounce' | 'float' | 'pulse' | 'spin' | 'wave' | 'celebrate';
    className?: string;
}

export default function AnimatedAvatar({
    emoji,
    size = 'md',
    animation = 'float',
    className
}: AnimatedAvatarProps) {
    const [isAnimating, setIsAnimating] = useState(true);

    const sizeClasses = {
        sm: 'w-12 h-12 text-2xl',
        md: 'w-16 h-16 text-4xl',
        lg: 'w-24 h-24 text-6xl',
        xl: 'w-32 h-32 text-8xl',
    };

    const animationClasses = {
        bounce: 'animate-bounce',
        float: 'animate-float',
        pulse: 'animate-pulse',
        spin: 'animate-spin',
        wave: 'animate-wave',
        celebrate: 'animate-celebrate',
    };

    return (
        <>
            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    25% {
                        transform: translateY(-10px) rotate(-5deg);
                    }
                    75% {
                        transform: translateY(-5px) rotate(5deg);
                    }
                }

                @keyframes wave {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-15deg);
                    }
                    75% {
                        transform: rotate(15deg);
                    }
                }

                @keyframes celebrate {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                    }
                    25% {
                        transform: scale(1.2) rotate(-10deg);
                    }
                    50% {
                        transform: scale(1.1) rotate(10deg);
                    }
                    75% {
                        transform: scale(1.2) rotate(-10deg);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-wave {
                    animation: wave 1s ease-in-out infinite;
                }

                .animate-celebrate {
                    animation: celebrate 0.6s ease-in-out;
                }
            `}</style>

            <div
                className={cn(
                    'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg',
                    sizeClasses[size],
                    isAnimating && animationClasses[animation],
                    className
                )}
                onMouseEnter={() => setIsAnimating(true)}
            >
                <span className="select-none">{emoji}</span>
            </div>
        </>
    );
}

// Hook para usar avatares animados
export function useAnimatedAvatar() {
    const [currentAnimation, setCurrentAnimation] = useState<'bounce' | 'float' | 'pulse' | 'spin' | 'wave' | 'celebrate'>('float');

    const celebrate = () => {
        setCurrentAnimation('celebrate');
        setTimeout(() => setCurrentAnimation('float'), 600);
    };

    const wave = () => {
        setCurrentAnimation('wave');
        setTimeout(() => setCurrentAnimation('float'), 1000);
    };

    const bounce = () => {
        setCurrentAnimation('bounce');
        setTimeout(() => setCurrentAnimation('float'), 1000);
    };

    return {
        currentAnimation,
        celebrate,
        wave,
        bounce,
    };
}
