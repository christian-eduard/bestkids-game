import api from '@/lib/api';

export interface Exercise {
    id: number;
    title: string;
    description: string; // The question text
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop';
    content: any; // Options, images, etc.
    correctAnswer: any;
    points: number;
    difficultyLevel: 'easy' | 'medium' | 'hard';
    subjectAreaId: number;
    exerciseType: string;
    isActive: boolean;
    rewardPoints?: number;
}

export interface ExerciseAttemptResult {
    success: boolean;
    pointsEarned: number;
    isCorrect: boolean;
    correctAnswer: any;
    feedback?: string;
    adaptiveRecommendation?: any;
}

export const ExerciseService = {
    getExerciseById: async (id: string | number): Promise<Exercise> => {
        const response = await api.get(`/exercises/${id}`);
        return response.data;
    },

    submitAttempt: async (id: string | number, answer: any, timeSpent: number = 0): Promise<ExerciseAttemptResult> => {
        const response = await api.post(`/exercises/${id}/submit`, { answer, timeSpent });
        return response.data;
    }
};
