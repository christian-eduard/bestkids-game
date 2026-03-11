import api from '@/lib/api';

export enum ResourceType {
    IMAGE = 'image',
    VIDEO = 'video',
    LINK = 'link',
    FILE = 'file',
    DOCUMENTATION = 'documentation',
}

export interface Resource {
    id: number;
    title: string;
    description?: string;
    type: ResourceType;
    url: string;
    category?: string;
    metadata?: any;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    creator?: {
        firstName: string;
        lastName: string;
    };
}

export const ResourceService = {
    getAll: async (params?: { type?: ResourceType; category?: string }): Promise<Resource[]> => {
        const response = await api.get('/resources', { params });
        return response.data;
    },

    getOne: async (id: number): Promise<Resource> => {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    },

    create: async (data: Partial<Resource>): Promise<Resource> => {
        const response = await api.post('/resources', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Resource>): Promise<Resource> => {
        const response = await api.patch(`/resources/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/resources/${id}`);
    },
};
