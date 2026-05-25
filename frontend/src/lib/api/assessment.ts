// API client for Assessment endpoints

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface AssessmentProgress {
    totalQuestions: number;
    answeredQuestions: number;
    progressPercentage: number;
    completed: boolean;
}

export interface AssessmentResult {
    userId: number;
    overallScore: number;
    subjectResults: Array<{
        subjectArea: string;
        score: number;
        difficultyLevel: string;
        rtiLevel: string;
        recommendedExercises: string;
    }>;
    avatarUnlocked: boolean;
    completedAt: Date;
}

export interface Exercise {
    id: number;
    title: string;
    subjectAreaId: number;
    // Add other exercise properties as needed
}

export const assessmentApi = {
    async startAssessment(userId: number) {
        const res = await fetch(`${API_URL}/assessment/start/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to start assessment');
        return res.json();
    },

    async getExercises(userId: number): Promise<{ exercises: Exercise[]; total: number }> {
        const res = await fetch(`${API_URL}/assessment/exercises/${userId}`);
        if (!res.ok) throw new Error('Failed to get exercises');
        return res.json();
    },

    async submitAnswer(userId: number, exerciseId: number, isCorrect: boolean) {
        const res = await fetch(`${API_URL}/assessment/submit/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exerciseId, isCorrect }),
        });
        if (!res.ok) throw new Error('Failed to submit answer');
        return res.json();
    },

    async getProgress(userId: number): Promise<AssessmentProgress> {
        const res = await fetch(`${API_URL}/assessment/progress/${userId}`);
        if (!res.ok) throw new Error('Failed to get progress');
        return res.json();
    },

    async getResults(userId: number): Promise<AssessmentResult> {
        const res = await fetch(`${API_URL}/assessment/results/${userId}`);
        if (!res.ok) throw new Error('Failed to get results');
        return res.json();
    },

    async isComplete(userId: number): Promise<boolean> {
        const res = await fetch(`${API_URL}/assessment/complete/${userId}`);
        if (!res.ok) throw new Error('Failed to check completion');
        const data = await res.json();
        return data.completed;
    },
};
