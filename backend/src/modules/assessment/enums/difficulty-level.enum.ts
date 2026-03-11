export enum DifficultyLevel {
    NIVEL_BAJO = 1,          // 0-2 puntos en evaluación inicial
    NIVEL_MEDIO_BAJO = 2,    // 3-4 puntos
    NIVEL_MEDIO = 3,         // 5-6 puntos
    NIVEL_MEDIO_ALTO = 4,    // 7-8 puntos
    NIVEL_ALTO = 5           // 9-10 puntos
}

export function getDifficultyLevelFromScore(score: number): DifficultyLevel {
    if (score <= 2) return DifficultyLevel.NIVEL_BAJO;
    if (score <= 4) return DifficultyLevel.NIVEL_MEDIO_BAJO;
    if (score <= 6) return DifficultyLevel.NIVEL_MEDIO;
    if (score <= 8) return DifficultyLevel.NIVEL_MEDIO_ALTO;
    return DifficultyLevel.NIVEL_ALTO;
}
