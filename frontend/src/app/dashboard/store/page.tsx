"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GamificationService } from '@/services/gamification.service';
import { StoreService, StoreItem, InventoryItem } from '@/services/store.service';

export default function StorePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [items, setItems] = useState<StoreItem[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'owned' | 'premium' | 'new'>('all');
    const [purchasing, setPurchasing] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, itemsData, inventoryData] = await Promise.all([
                    GamificationService.getProfile(),
                    StoreService.getAllItems(),
                    StoreService.getMyInventory()
                ]);
                setPoints(profileData.totalPoints);
                setItems(itemsData);
                setInventory(inventoryData);
            } catch (error) {
                console.error("Failed to load store data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePurchase = async (item: StoreItem) => {
        if (points < item.cost) {
            alert("No tienes suficientes puntos.");
            return;
        }
        setPurchasing(item.id);
        try {
            const newItem = await StoreService.purchaseItem(item.id);
            setInventory([...inventory, newItem]);
            setPoints(prev => prev - item.cost);
            // alert(`¡${item.name} comprado!`);
        } catch (error) {
            console.error("Purchase failed", error);
            alert("Error en la compra.");
        } finally {
            setPurchasing(null);
        }
    };

    const handleEquip = async (inventoryItem: InventoryItem) => {
        try {
            await StoreService.equipItem(inventoryItem.item.id);
            // Update local state: unequip others of same type if single slot, or just toggle
            // For now, assume backend handles logic, re-fetch inventory or manually update
            const updatedInventory = inventory.map(i => ({
                ...i,
                isEquipped: i.id === inventoryItem.id // Simplistic logic: only one item equipped at a time? Or depends on type.
            }));

            // Allow multiple equipped items if different types? 
            // Better to re-fetch inventory to be safe or just update specific one
            const newInventory = await StoreService.getMyInventory();
            setInventory(newInventory);

        } catch (error) {
            console.error("Equip failed", error);
        }
    };

    // Derived state
    const isOwned = (itemId: number) => inventory.some(i => i.item.id === itemId);
    const getInventoryItem = (itemId: number) => inventory.find(i => i.item.id === itemId);

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'owned') return isOwned(item.id);
        if (filter === 'premium') return item.cost >= 1000; // Example logic
        if (filter === 'new') return false; // meaningful logic needed
        return true;
    });

    return (
        <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col max-w-[1200px] flex-1 w-full gap-8">
                {/* Page Heading & Wallet */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
                    <div className="flex flex-col gap-2">
                        <button onClick={() => router.push('/dashboard')} className="w-fit flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-1">
                            <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                            Volver al Mapa
                        </button>
                        <h1 className="text-text-dark dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.03em] drop-shadow-sm">
                            TIENDA DE AVATARES
                        </h1>
                        <p className="text-[#9c499c] dark:text-[#dcb5dc] text-lg font-medium">
                            Personaliza tu aventura con nuevos estilos épicos
                        </p>
                    </div>
                    {/* Coin Wallet */}
                    <div className="flex items-center self-start md:self-end bg-white dark:bg-[#321a32] p-2 pr-6 rounded-full shadow-lg shadow-purple-100 dark:shadow-none border border-purple-100 dark:border-purple-900/30">
                        <div className="size-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 shadow-inner mr-3 animate-bounce-slow">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-text-muted dark:text-gray-400 font-bold uppercase tracking-wider">Tu Balance</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-500">monetization_on</span>
                                <span className="text-xl font-black text-text-main dark:text-white">{points || 0}</span>
                            </div>
                        </div><button className="ml-4 size-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">add</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap items-center">
                    <button onClick={() => setFilter('all')} className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95 ${filter === 'all' ? 'bg-primary text-white shadow-primary/25' : 'bg-white dark:bg-[#321a32] text-text-dark dark:text-white hover:border-purple-200 dark:hover:border-purple-800 border border-transparent'}`}>
                        <span className="text-sm font-bold">Todos</span>
                    </button>
                    <button onClick={() => setFilter('owned')} className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95 ${filter === 'owned' ? 'bg-primary text-white shadow-primary/25' : 'bg-white dark:bg-[#321a32] text-text-dark dark:text-white hover:border-purple-200 dark:hover:border-purple-800 border border-transparent'}`}>
                        <span className="text-sm font-bold">Mi Colección</span>
                    </button>
                    <button onClick={() => setFilter('premium')} className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95 ${filter === 'premium' ? 'bg-primary text-white shadow-primary/25' : 'bg-white dark:bg-[#321a32] text-text-dark dark:text-white hover:border-purple-200 dark:hover:border-purple-800 border border-transparent'}`}>
                        <span className="material-symbols-outlined text-lg text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-sm font-bold">Premium</span>
                    </button>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                    {loading ? (
                        <div className="col-span-full text-center py-10">Cargando tienda...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500">No hay items disponibles en esta categoría.</div>
                    ) : (
                        filteredItems.map(item => {
                            const ownedItem = getInventoryItem(item.id);
                            const equipped = ownedItem?.isEquipped;
                            const owned = !!ownedItem;

                            return (
                                <div key={item.id} className={`group relative flex flex-col bg-white dark:bg-[#321a32] rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 ${equipped ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f8f5f8] dark:ring-offset-[#221022]' : ''}`}>

                                    {/* Badges */}
                                    {owned && (
                                        <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">check_circle</span> {equipped ? 'Equipado' : 'Tuyo'}
                                        </div>
                                    )}
                                    {!owned && item.cost >= 1000 && (
                                        <div className="absolute top-4 right-4 z-10 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200">Raro</div>
                                    )}

                                    {/* Image */}
                                    <div className={`aspect-square w-full rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center mb-4 overflow-hidden relative ${!owned && points < item.cost ? 'grayscale opacity-80' : ''}`}>
                                        <img
                                            alt={item.name}
                                            className="w-3/4 h-3/4 object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                            src={item.imageUrl || "https://placehold.co/200x200/png?text=Item"}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-bold text-text-dark dark:text-white leading-tight">{item.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{item.description || 'Item genial'}</p>

                                        {owned ? (
                                            <button
                                                onClick={() => !equipped && handleEquip(ownedItem)}
                                                disabled={equipped}
                                                className={`mt-auto w-full h-10 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${equipped ? 'bg-green-500 hover:bg-green-600 text-white cursor-default' : 'bg-white dark:bg-gray-700 border-2 border-primary text-primary dark:text-white hover:bg-primary hover:text-white'}`}
                                            >
                                                {equipped ? (
                                                    <><span className="material-symbols-outlined text-lg">check</span> Equipado</>
                                                ) : (
                                                    'Equipar'
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handlePurchase(item)}
                                                disabled={purchasing === item.id || points < item.cost}
                                                className={`mt-auto w-full h-10 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${points >= item.cost ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                            >
                                                {purchasing === item.id ? (
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-lg">{points >= item.cost ? 'shopping_cart' : 'lock'}</span>
                                                        {item.cost}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
