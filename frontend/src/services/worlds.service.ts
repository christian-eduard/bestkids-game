import api from '@/lib/api';

export interface World {
    id: number;
    name: string;
    description: string;
    icon?: string;
    backgroundImage?: string;
    colorTheme?: string;
    pointsToUnlock?: number;
    isUnlocked?: boolean; // Backend returns isUnlocked (true = accessible)
    isLocked?: boolean;   // Computed: !isUnlocked
    progress?: number | Record<string, unknown>;  // From findWorldsForStudent (can be object or number)
    levels?: any[];
}

export interface Level {
    id: number;
    title: string;
    description: string;
    isLocked?: boolean;
    isCompleted?: boolean;
    stars?: number;
    status?: 'locked' | 'active' | 'completed';
}

export const WorldsService = {
    getWorlds: async (): Promise<World[]> => {
        const response = await api.get('/worlds');
        return response.data;
    },

    getLevels: async (worldId: number): Promise<Level[]> => {
        const response = await api.get(`/worlds/${worldId}/levels`);
        return response.data;
    }
};
