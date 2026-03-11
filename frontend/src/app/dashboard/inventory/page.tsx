"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoreService, InventoryItem, StoreItem } from "@/services/store.service";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export default function InventoryPage() {
    const router = useRouter();
    const toast = useToast();
    const { user } = useAuth();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | 'all'>('all');
    const [equipping, setEquipping] = useState<number | null>(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await StoreService.getMyInventory();
            setInventory(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Error al cargar tu inventario");
        } finally {
            setLoading(false);
        }
    };

    const handleEquip = async (itemId: number) => {
        setEquipping(itemId);
        try {
            await StoreService.equipItem(itemId);
            toast.success("¡Objeto equipado con éxito!");
            fetchInventory();
        } catch (error) {
            console.error("Error equipping item:", error);
            toast.error("Error al equipar el objeto");
        } finally {
            setEquipping(null);
        }
    };

    const filteredInventory = inventory.filter(item =>
        filter === 'all' || item.item.type === filter
    );

    const categories = Array.from(new Set(inventory.map(i => i.item.type)));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-text-main dark:text-white uppercase tracking-tight">Mi Inventario</h1>
                    <p className="text-text-muted dark:text-gray-400 text-lg">Colecciona y equipa tus tesoros ganados.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/store')}
                    className="bg-[#fcf8fc] dark:bg-white/5 hover:bg-[#f4e7f4] border border-primary/20 text-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">storefront</span>
                    Ir a la Tienda
                </button>
            </header>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${filter === 'all'
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-white dark:bg-[#321a32] border-gray-100 dark:border-white/5 text-text-muted hover:border-primary/30'}`}
                >
                    Todos
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-full font-bold capitalize transition-all border-2 ${filter === cat
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white dark:bg-[#321a32] border-gray-100 dark:border-white/5 text-text-muted hover:border-primary/30'}`}
                    >
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredInventory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredInventory.map(inv => (
                        <div key={inv.id} className={`bg-card-light dark:bg-card-dark rounded-3xl overflow-hidden shadow-soft border-2 transition-all relative group
                            ${inv.isEquipped ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-primary/30'}`}>

                            {inv.isEquipped && (
                                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                                    Equipado
                                </div>
                            )}

                            <div className="aspect-square bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center p-8">
                                <img
                                    src={inv.item.imageUrl || 'https://placehold.co/200'}
                                    alt={inv.item.name}
                                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-5 flex flex-col gap-2">
                                <h3 className="font-bold text-text-main dark:text-white text-xl leading-tight">{inv.item.name}</h3>
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-1">{inv.item.description}</p>

                                <button
                                    disabled={inv.isEquipped || equipping === inv.item.id}
                                    onClick={() => handleEquip(inv.item.id)}
                                    className={`mt-4 w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95
                                        ${inv.isEquipped
                                            ? 'bg-green-500 text-white cursor-default'
                                            : 'bg-primary text-white hover:bg-fuchsia-600 shadow-lg shadow-primary/20'}`}
                                >
                                    {equipping === inv.item.id ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : inv.isEquipped ? (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            En uso
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">auto_fix_high</span>
                                            Equipar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="size-32 bg-[#f4e7f4] dark:bg-white/5 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-primary/30">inventory_2</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-text-main dark:text-white">Tu inventario está vacío</p>
                        <p className="text-text-muted max-w-xs mx-auto">¡Ve a la tienda y usa tus puntos para comprar objetos increíbles!</p>
                    </div>
                </div>
            )}
        </div>
    );
}
