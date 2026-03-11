export enum RtiLevel {
    LEVEL_1_UNIVERSAL = 'UNIVERSAL',    // Verde - 70-100% de precisión
    LEVEL_2_SELECTIVE = 'SELECTIVE',    // Amarillo - 40-69% de precisión
    LEVEL_3_INTENSIVE = 'INTENSIVE'     // Rojo - 0-39% de precisión (requiere intervención)
}

export function getRtiLevelFromScore(score: number): RtiLevel {
    if (score >= 70) return RtiLevel.LEVEL_1_UNIVERSAL;
    if (score >= 40) return RtiLevel.LEVEL_2_SELECTIVE;
    return RtiLevel.LEVEL_3_INTENSIVE;
}

export function getRtiLevelColor(level: RtiLevel): string {
    switch (level) {
        case RtiLevel.LEVEL_1_UNIVERSAL:
            return '#10B981'; // Verde
        case RtiLevel.LEVEL_2_SELECTIVE:
            return '#F59E0B'; // Amarillo
        case RtiLevel.LEVEL_3_INTENSIVE:
            return '#EF4444'; // Rojo
    }
}
