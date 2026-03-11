import api from '@/lib/api';

export interface GamificationProfile {
    userId: number;
    totalPoints: number;
    currentLevel: number;
    currentStreakDays: number;
    experiencePoints: number;
    stats?: { // Optional as it might not be in the main profile entity response directly unless computed
        accuracy: number;
        timeSpent: number;
        completedLessons: number;
    };
    achievements: any[];
    selectedAvatarId?: number;
}

export const GamificationService = {
    getProfile: async (): Promise<GamificationProfile> => {
        const response = await api.get('/gamification/profile');
        return response.data;
    },

    getUserStats: async (): Promise<any> => {
        const response = await api.get('/gamification/profile'); // Reuse profile for stats or use getStats
        return response.data;
    },

    getStats: async (): Promise<any> => {
        // Requires backend endpoint for specific stats if not in profile
        // mocking for now based on profile data
        return {
            streak: 12,
            accuracy: 85,
            timeSpent: 45
        };
    },

    getAchievements: async (): Promise<any[]> => {
        const response = await api.get('/gamification/my-achievements');
        return response.data;
    },

    selectAvatar: async (avatarId: number): Promise<any> => {
        const response = await api.post('/gamification/avatar/select', { avatarId });
        return response.data;
    }
};
