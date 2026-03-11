import { Star, Trophy, Flame, Award } from 'lucide-react';

interface DailyStatsProps {
    starsEarned?: number;
    trophiesEarned?: number;
    streakDays?: number;
    exercisesCompleted?: number;
}

/**
 * Componente "Hoy has ganado"
 * Del PDF cliente: "Mostrar logros del día con iconos visuales"
 */
export default function DailyStats({
    starsEarned = 0,
    trophiesEarned = 0,
    streakDays = 0,
    exercisesCompleted = 0
}: DailyStatsProps) {
    const stats = [
        {
            icon: Star,
            value: starsEarned,
            label: 'Estrellas',
            emoji: '⭐',
            color: 'from-yellow-400 to-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            icon: Trophy,
            value: trophiesEarned,
            label: 'Trofeos',
            emoji: '🏆',
            color: 'from-purple-400 to-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
        {
            icon: Flame,
            value: streakDays,
            label: 'Días Racha',
            emoji: '🔥',
            color: 'from-orange-400 to-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400',
        },
        {
            icon: Award,
            value: exercisesCompleted,
            label: 'Ejercicios',
            emoji: '🎯',
            color: 'from-green-400 to-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
        },
    ];

    return (
        <div className="rounded-3xl bg-gradient-to-br from-bestkids-purple/10 via-bestkids-pink/10 to-bestkids-orange/10 p-6 md:p-8 border-2 border-bestkids-purple/20 shadow-lg">
            {/* Header */}
            <h3 className="text-3xl md:text-4xl font-title text-center mb-6 text-gray-800 dark:text-white">
                ✨ ¡Hoy has ganado! ✨
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const hasValue = stat.value > 0;

                    return (
                        <div
                            key={index}
                            className={`
                                ${stat.bgColor}
                                rounded-2xl p-4 md:p-6
                                border-2 border-transparent
                                ${hasValue ? 'border-current shadow-md' : 'opacity-50'}
                                transition-all duration-300
                                ${hasValue ? 'hover:scale-105 hover:shadow-xl' : ''}
                                text-center
                            `}
                        >
                            {/* Emoji grande */}
                            <div className="text-4xl md:text-5xl mb-2 animate-bounce">
                                {stat.emoji}
                            </div>

                            {/* Valor */}
                            <div className={`text-3xl md:text-4xl font-black ${stat.textColor} mb-1 font-title`}>
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 font-body">
                                {stat.label}
                            </div>

                            {/* Icon decorativo pequeño */}
                            <div className="mt-2 flex justify-center">
                                <Icon className={`w-4 h-4 ${stat.textColor} ${hasValue ? 'animate-pulse' : ''}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mensaje motivacional */}
            {(starsEarned > 0 || trophiesEarned > 0 || exercisesCompleted > 0) ? (
                <div className="mt-6 text-center">
                    <p className="text-xl md:text-2xl font-title text-bestkids-purple font-bold">
                        {starsEarned >= 10 ? '🌟 ¡Increíble día!' :
                            starsEarned >= 5 ? '🎉 ¡Muy bien!' :
                                '💪 ¡Sigue así!'}
                    </p>
                </div>
            ) : (
                <div className="mt-6 text-center">
                    <p className="text-lg md:text-xl font-body text-gray-500 dark:text-gray-400">
                        🎮 ¡Empieza a jugar para ganar recompensas!
                    </p>
                </div>
            )}
        </div>
    );
}
