/**
 * Sistema de Niveles Temáticos
 * Del PDF cliente: "Nombres creativos vs números genéricos"
 * 
 * Reemplaza "Level 1, 2, 3..." por nombres temáticos infantiles
 */

export interface LevelInfo {
    level: number;
    name: string;
    emoji: string;
    color: string; // Tailwind color class
    description: string;
    requiredPoints: number;
}

/**
 * Mapeo de niveles numéricos a nombres temáticos
 * Inspirado en juegos infantiles y aventuras
 */
export const LEVEL_NAMES: Record<number, LevelInfo> = {
    1: {
        level: 1,
        name: 'Explorador',
        emoji: '🌱',
        color: 'text-green-500',
        description: '¡Acabas de empezar tu aventura!',
        requiredPoints: 0,
    },
    2: {
        level: 2,
        name: 'Aventurero',
        emoji: '🌟',
        color: 'text-yellow-500',
        description: 'Ya estás en marcha, ¡sigue así!',
        requiredPoints: 100,
    },
    3: {
        level: 3,
        name: 'Héroe',
        emoji: '🚀',
        color: 'text-blue-500',
        description: '¡Eres un verdadero héroe del aprendizaje!',
        requiredPoints: 300,
    },
    4: {
        level: 4,
        name: 'Campeón',
        emoji: '👑',
        color: 'text-purple-500',
        description: '¡Nadie puede detenerte!',
        requiredPoints: 600,
    },
    5: {
        level: 5,
        name: 'Maestro',
        emoji: '🏆',
        color: 'text-orange-500',
        description: '¡Has alcanzado la maestría!',
        requiredPoints: 1000,
    },
    6: {
        level: 6,
        name: 'Leyenda',
        emoji: '⭐',
        color: 'text-pink-500',
        description: '¡Eres una leyenda viva!',
        requiredPoints: 1500,
    },
    7: {
        level: 7,
        name: 'Titán',
        emoji: '💎',
        color: 'text-cyan-500',
        description: '¡Tu poder no tiene límites!',
        requiredPoints: 2100,
    },
    8: {
        level: 8,
        name: 'Guardián',
        emoji: '🛡️',
        color: 'text-indigo-500',
        description: '¡Proteges el conocimiento!',
        requiredPoints: 2800,
    },
    9: {
        level: 9,
        name: 'Sabio',
        emoji: '🧙',
        color: 'text-violet-500',
        description: '¡Tu sabiduría inspira a otros!',
        requiredPoints: 3600,
    },
    10: {
        level: 10,
        name: 'Dios del Saber',
        emoji: '🌌',
        color: 'text-amber-500',
        description: '¡Has alcanzado la perfección absoluta!',
        requiredPoints: 5000,
    },
};

/**
 * Obtener información de un nivel
 */
export function getLevelInfo(level: number): LevelInfo {
    // Si el nivel existe en el mapeo, retornarlo
    if (LEVEL_NAMES[level]) {
        return LEVEL_NAMES[level];
    }

    // Para niveles superiores a 10, generar dinámicamente
    const maxLevel = Math.max(...Object.keys(LEVEL_NAMES).map(Number));
    if (level > maxLevel) {
        return {
            level,
            name: `Infinito ${level - maxLevel}`,
            emoji: '∞',
            color: 'text-rainbow',
            description: '¡Has superado todos los límites!',
            requiredPoints: 5000 + (level - maxLevel) * 1000,
        };
    }

    // Fallback para nivel 1
    return LEVEL_NAMES[1];
}

/**
 * Obtener nombre completo formatead con emoji
 */
export function getLevelDisplayName(level: number): string {
    const info = getLevelInfo(level);
    return `${info.emoji} ${info.name}`;
}

/**
 * Obtener el siguiente nivel
 */
export function getNextLevelInfo(currentLevel: number): LevelInfo {
    return getLevelInfo(currentLevel + 1);
}

/**
 * Calcular progreso hacia el siguiente nivel (0-100)
 */
export function calculateLevelProgress(totalPoints: number, currentLevel: number): number {
    const currentLevelInfo = getLevelInfo(currentLevel);
    const nextLevelInfo = getNextLevelInfo(currentLevel);

    const pointsInCurrentLevel = totalPoints - currentLevelInfo.requiredPoints;
    const pointsNeededForNext = nextLevelInfo.requiredPoints - currentLevelInfo.requiredPoints;

    const progress = (pointsInCurrentLevel / pointsNeededForNext) * 100;

    return Math.min(100, Math.max(0, progress));
}

/**
 * Obtener nivel basado en puntos totales
 */
export function getLevelFromPoints(totalPoints: number): number {
    const levels = Object.values(LEVEL_NAMES).sort((a, b) => b.requiredPoints - a.requiredPoints);

    for (const level of levels) {
        if (totalPoints >= level.requiredPoints) {
            return level.level;
        }
    }

    return 1; // Nivel mínimo
}

/**
 * Obtener puntos necesarios para el siguiente nivel
 */
export function getPointsToNextLevel(totalPoints: number, currentLevel: number): number {
    const nextLevelInfo = getNextLevelInfo(currentLevel);
    return Math.max(0, nextLevelInfo.requiredPoints - totalPoints);
}
