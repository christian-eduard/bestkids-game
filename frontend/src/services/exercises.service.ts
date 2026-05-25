import api from '@/lib/api';

// ── Types aligned with backend entity ExerciseType ──────────────────────────
export type ExerciseType =
    | 'SEÑALAR_IMAGEN'
    | 'OPCION_MULTIPLE'
    | 'VERDADERO_FALSO'
    | 'ARRASTRAR_SILABAS'
    | 'UNIR_LINEAS'
    | 'CLASIFICAR_GRUPOS'
    | 'PINTAR'
    | 'TECLADO_VIRTUAL'
    | 'AUDIO_SELECCION'
    | 'COMPLETAR_HUECOS';

export interface Exercise {
    id: number;
    type: ExerciseType;
    instruction: string;
    instructionAudioUrl?: string;
    backgroundImageUrl?: string;
    backgroundColor?: string;
    difficulty: number;
    points: number;
    order: number;
    content: any; // JSONB — structure varies per type
    isActive: boolean;
    unitId?: number;
    subjectAreaId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Unit {
    id: number;
    worldId: number;
    courseId?: number;
    title: string;
    description?: string;
    orderIndex: number;
    difficulty: number;
    coverImageUrl?: string;
    isActive: boolean;
    exercises?: Exercise[];
    createdAt: string;
    updatedAt: string;
}

export interface SubjectArea {
    id: number;
    name: string;
    description?: string;
    icon: string;
    colorHex: string;
    orderIndex: number;
    isActive: boolean;
}

export interface SubmitResult {
    isCorrect: boolean;
    xpEarned: number;
    feedback: string;
    correctAnswer: any;
}

export interface UnitProgress {
    completed: number;
    correct: number;
    totalXp: number;
}

export interface ExercisesResponse {
    exercises: Exercise[];
    recommendedDifficulty: number;
    userProgress: UnitProgress;
}

// ── Service (matches backend controller endpoints) ──────────────────────────
export const ExerciseService = {
    /** Get units for a world */
    getUnitsByWorld: async (worldId: number | string): Promise<Unit[]> => {
        const response = await api.get(`/exercises/units/${worldId}`);
        return response.data;
    },
    /** Get all learning subject areas */
    getSubjectAreas: async (): Promise<SubjectArea[]> => {
        const response = await api.get('/exercises/subjects');
        return response.data;
    },

    /** Get exercises for a unit (with adaptive difficulty + progress) */
    getExercisesByUnit: async (unitId: number | string): Promise<ExercisesResponse> => {
        const response = await api.get(`/exercises/unit/${unitId}`);
        return response.data;
    },

    /** Get raw exercises for a unit (admin/master — no adaptation) */
    getExercisesRaw: async (unitId: number | string): Promise<Exercise[]> => {
        const response = await api.get(`/exercises/unit/${unitId}/raw`);
        return response.data;
    },

    /** Submit answer */
    submitAnswer: async (params: {
        exerciseId: number;
        answer: any;
        responseTimeMs: number;
    }): Promise<SubmitResult> => {
        const response = await api.post('/exercises/submit', params);
        return response.data;
    },

    /** Get user stats */
    getUserStats: async (userId: number | string) => {
        const response = await api.get(`/exercises/stats/${userId}`);
        return response.data;
    },

    // ── CRUD (Master panel) ─────────────────────────────────────────────
    createUnit: async (data: Partial<Unit>): Promise<Unit> => {
        const response = await api.post('/exercises/unit', data);
        return response.data;
    },

    updateUnit: async (id: number, data: Partial<Unit>): Promise<Unit> => {
        const response = await api.put(`/exercises/unit/${id}`, data);
        return response.data;
    },

    deleteUnit: async (id: number): Promise<void> => {
        await api.delete(`/exercises/unit/${id}`);
    },

    createExercise: async (data: Partial<Exercise>): Promise<Exercise> => {
        const response = await api.post('/exercises/exercise', data);
        return response.data;
    },

    updateExercise: async (id: number, data: Partial<Exercise>): Promise<Exercise> => {
        const response = await api.put(`/exercises/exercise/${id}`, data);
        return response.data;
    },

    deleteExercise: async (id: number): Promise<void> => {
        await api.delete(`/exercises/exercise/${id}`);
    },

    /** Fetch a single exercise by ID */
    getExerciseById: async (id: number | string): Promise<Exercise> => {
        const response = await api.get(`/exercises/exercise/${id}`);
        return response.data;
    },
};
