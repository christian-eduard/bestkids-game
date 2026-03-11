import api from '@/lib/api';

export interface StoreItem {
    id: number;
    name: string;
    description: string;
    cost: number;
    type: string;
    rarity: string;
    imageUrl: string;
    isValuable?: boolean; // mapped from backend logic if needed, or check rarity
}

export interface InventoryItem {
    id: number;
    userId: number;
    itemId: number;
    isEquipped: boolean;
    acquiredAt: string;
    item: StoreItem;
}

export const StoreService = {
    getAllItems: async (): Promise<StoreItem[]> => {
        const response = await api.get('/store/items');
        return response.data;
    },

    getMyInventory: async (): Promise<InventoryItem[]> => {
        const response = await api.get('/store/inventory');
        return response.data;
    },

    purchaseItem: async (itemId: number): Promise<InventoryItem> => {
        const response = await api.post(`/store/buy/${itemId}`);
        return response.data;
    },

    equipItem: async (itemId: number): Promise<InventoryItem> => {
        const response = await api.post(`/store/equip/${itemId}`);
        return response.data;
    }
};
