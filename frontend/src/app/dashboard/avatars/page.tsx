"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { GamificationService } from "@/services/gamification.service";

interface Avatar {
    id: number;
    name: string;
    emoji: string;
    imageUrl?: string;
    collection?: string;
    rarity?: string;
    price: number;
    unlockPointsRequired: number;
    unlockLevelRequired: number;
    isUnlocked: boolean;
    isSelected: boolean;
    isOwned: boolean;
}

export default function AvatarsPage() {
    const router = useRouter();
    const toast = useToast();
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState<number | null>(null);
    const [userPoints, setUserPoints] = useState(0);
    const [filter, setFilter] = useState<'all' | 'owned' | 'premium' | 'new'>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [avatarsRes, profile] = await Promise.all([
                api.get("/gamification/my-avatars"),
                GamificationService.getProfile()
            ]);
            setAvatars(avatarsRes.data);
            setUserPoints(profile?.totalPoints || 0);
        } catch (err) {
            console.error("Error fetching data", err);
            // Mock data for demo
            setAvatars([
                { id: 1, name: "Robot Héroe", emoji: "🤖", collection: "Espacial", rarity: "Raro", price: 500, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEF0RlwEtN_mJ6soFwvNGKT3PmgTzjrkJrHNTZVHzQrzlm250EY9ydZNcJK-yR9lurOWexjgJQldYyUdnK2c4ZqiD-af3ulZHcX22V6MvSRmBo3cebfq5jf1hDw1SPGdm67ajWUDhmsZ4Od0jDngMlAqlBNZ9Rv-_jI8oUzUzVYkkJCEi06IpTspi8cm9RJQskgREcnE9KcgwsXK43ODSTXwjzak-dLKJIqbgee4_QhGl59AD9yxenqrLaCLgPLx4TBYu32vdADOM" },
                { id: 2, name: "Gatito Feliz", emoji: "🐱", collection: "Animales", rarity: "Común", price: 0, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: true, isOwned: true, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpcZa_Q29xbJ1z0gvvt1F9YHodXIHBwFKnivm1SCkeaQGlQ16CTZ2Ov_xoVWOF4QJzQt3lUVWsK0-frBBFHU4rHx7LJgXY_m-BsEIbqX8gZN8YZh5FMUkCxZcexunrykJNwyTFBtX4cwXpE4yS9QeXGIXCPuLXnFE8WBUck08fAdQInH46Ek39vgylTcqDgHtoQ2-ZX6i2WbWZHpwd4rAj4bYXST8dPfjKEVbNFDdM9vbL5DHWqsERcFj04OJDkUMeNqAwklN2A2c" },
                { id: 3, name: "Mago Supremo", emoji: "🧙", collection: "Fantasía", rarity: "Legendario", price: 2500, unlockPointsRequired: 0, unlockLevelRequired: 5, isUnlocked: true, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXH1HTuwbCig_Udh9XMkQq2R3bkLw3TRLgGWtT30iSbtuB7K7G5DKa3BtBwbBlnD3HbjlZWzaO8p4EwpTEbVcDZxzgatCKBTtaxQbGWLDfQ3G_PLW1onvZG6k0kvjCcl4AlnWRjbvLO2w3PIv0GJPkjCPjUSoK4TTsB6R8ZbsE8rOVuhzBddt0sCZYZVh_pROqpq5mqZ_1QtmnLuPpcYI23l_c88pDBTaBAgw55nFC8SkzH5YBAeUiuoPHxk4qpaJJK6UqJhjcz9Y" },
                { id: 4, name: "Explorador", emoji: "🧭", collection: "Básica", rarity: "Común", price: 250, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCefzRZF9PMSUg_homz2tn1aRL5ndVQzdimcPr9bvvLT5bzIlJ65JSodhJO1N3NDoMY2w3zlVDGhnHgWAOsuOWNF8RYP7DmpFuyyfnyfb4ylwhE9tpKd5R0aEL17ieO3SXGLNiN41apBUpZBCDqnaPEN-58pgOCa7On1MtAM2JhOx4K_gyloMMSaK6PViwyfJIFePsRS8GVPwP5wzd3g6ig-sb1m2_2e_1OQRv_E6Vsa8VtywPrsoiqBNX29PuRttz1d7Q_2ilbWAY" },
                { id: 5, name: "Ninja Bot", emoji: "🥷", collection: "Cyber", rarity: "Épico", price: 5000, unlockPointsRequired: 5000, unlockLevelRequired: 10, isUnlocked: false, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYIgkfOTenDQTDUXm4xO-Vyv6BFtpIDuHI8tmSLVE_oYj_LDtybsasEyzkjeOPdY8d2yslVgrb5Otuw2gDKHwboi9DxTpfJYN3c_-Kz78d0qNen5MeEt4dMVq5uFaJVPBNHC0851xUA02cER--ZlUmFaY1U-QwpJ1sA7rv1GCKGnFReSHlP1yiG1Jesf3v0Tpc9woNhbDkVKNr6067_hW58bcpgEPnk9ZekclbN7NhXxwBrBqhMmlRVI7HDDs4XtTJAmWWdJw5rH4" },
                { id: 6, name: "Princesa Smart", emoji: "👸", collection: "Realeza", rarity: "Raro", price: 0, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: false, isOwned: true, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB67Cz9NMrKQCzftu9TxlBTT4hDi9x3avvkinq4zl4nVyBbpQY-nIQUHGXPLOHSQA-prNfF6vAGDSrUkPXAL2eypqMB-L3IFi9RUveIwJFinDVYUWUofsy1o958IpYbA7MkD_TN1Yub_NXbmrgc9WmMGjaNGRvSKcocUkZKzTKekqLFHSuFMoEq1enjoGL6ux8tWAJaFGo4HEwR_w76q3SCZ8UTAqEJ-WCei2KiK-hHAbqWwK4p7IVxC7IDfbVN5c_akczC9bvEFSY" },
                { id: 7, name: "Orejas Locas", emoji: "🐰", collection: "Divertida", rarity: "Común", price: 300, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBalh1WkcPRRP2mWzn2vyY8euK1dhJRF8jp3yiCo-L-nWFtGu9MLb2OHjWkd-VJsHreQAz_pX0ycz95E84rPUkwgPEyxyfvTDwho7uJ2wo--fLq4xNdQpHaFUHJDLVttP4qlV1gWyoHyAiyUx3g3iaL71mbCXq3cWrTtgviS6jYh7JJQF2jZDlzqdnJlQsJNKRgDP298ogXeOpL4taWT_i1bYW954WWQexkxmPnD0meq7NULwS9pf_rFF0nZuLRQJYPap4NIVNPibY" },
                { id: 8, name: "El Artista", emoji: "🎨", collection: "Creativa", rarity: "Nuevo", price: 600, unlockPointsRequired: 0, unlockLevelRequired: 1, isUnlocked: true, isSelected: false, isOwned: false, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZvA6DosWSINmpPhD40XdQ_drrd1a0wMViyMOL8Za55Lj_owMpaiZHrFJJiD5KRQIErfshSo4mC9FIPohymDaYpuh6ahfrhr79WwcuNWxQKerqz6MW7Y9FUQwsH0zPo3Dy_jP6dLHwnvdtK825oFIMkuSrLq0v7Fyb8Q2LeeM0v-ctRVbqKc8_DGZP6vqgguuwoM2c7kvF5XRAYB7co58jvTXOviVyiVQGBc0-yETTJhasXRi66u7ifREfSIPmdFPgEoVUzqejqNc" },
            ]);
            setUserPoints(1250);
        } finally {
            setLoading(false);
        }
    };

    const selectAvatar = async (avatarId: number) => {
        if (selecting) return;
        setSelecting(avatarId);
        try {
            await api.post(`/gamification/avatars/${avatarId}/select`);
            toast.success("¡Avatar equipado!");
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al seleccionar avatar");
        } finally {
            setSelecting(null);
        }
    };

    const buyAvatar = async (avatar: Avatar) => {
        if (userPoints < avatar.price) {
            toast.error("No tienes suficientes puntos");
            return;
        }
        try {
            await api.post(`/gamification/avatars/${avatar.id}/purchase`);
            toast.success(`¡Has comprado ${avatar.name}!`);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error al comprar avatar");
        }
    };

    const getRarityStyles = (rarity?: string) => {
        switch (rarity?.toLowerCase()) {
            case 'legendario': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'épico': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'raro': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'nuevo': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getGradient = (index: number) => {
        const gradients = [
            'from-blue-50 to-purple-50 dark:from-purple-900/20 dark:to-blue-900/20',
            'from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20',
            'from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20',
            'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
            'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
            'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
            'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
        ];
        return gradients[index % gradients.length];
    };

    const filteredAvatars = avatars.filter(avatar => {
        if (filter === 'owned') return avatar.isOwned;
        if (filter === 'premium') return avatar.price >= 1000;
        if (filter === 'new') return avatar.rarity?.toLowerCase() === 'nuevo';
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-8 p-4 sm:p-6 lg:p-8">
            {/* Page Heading & Wallet */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => router.back()}
                        className="w-fit flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-1"
                    >
                        <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                        Volver
                    </button>
                    <h1 className="text-[#1c0d1c] dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.03em] drop-shadow-sm">
                        TIENDA DE AVATARES
                    </h1>
                    <p className="text-[#9c499c] dark:text-[#dcb5dc] text-lg font-medium">
                        Personaliza tu aventura con nuevos estilos épicos
                    </p>
                </div>

                {/* Coin Wallet */}
                <div className="flex items-center self-start md:self-end bg-white dark:bg-[#321a32] p-2 pr-6 rounded-full shadow-lg shadow-purple-100 dark:shadow-none border border-purple-100 dark:border-purple-900/30">
                    <div className="size-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 shadow-inner mr-3">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tu Saldo</span>
                        <span className="text-xl font-black text-[#1c0d1c] dark:text-white leading-none">{userPoints.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap items-center">
                <button
                    onClick={() => setFilter('all')}
                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${filter === 'all'
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                >
                    <span className="text-sm font-bold">Todos</span>
                </button>
                <button
                    onClick={() => setFilter('owned')}
                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${filter === 'owned'
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                >
                    <span className="text-sm font-bold">Mi Colección</span>
                </button>
                <button
                    onClick={() => setFilter('premium')}
                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${filter === 'premium'
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">Premium</span>
                </button>
                <button
                    onClick={() => setFilter('new')}
                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${filter === 'new'
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                >
                    <span className="text-sm font-bold">Nuevos</span>
                </button>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                {filteredAvatars.map((avatar, index) => (
                    <div
                        key={avatar.id}
                        className={`group relative flex flex-col bg-white dark:bg-[#321a32] rounded-2xl p-4 shadow-sm transition-all duration-300 border border-transparent
                            ${avatar.isSelected
                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#f8f5f8] dark:ring-offset-[#221022]'
                                : avatar.isUnlocked
                                    ? 'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-purple-100 dark:hover:border-purple-900'
                                    : 'opacity-80 hover:opacity-100'
                            }`}
                    >
                        {/* Rarity Tag */}
                        {avatar.rarity && !avatar.isOwned && (
                            <div className={`absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full border ${getRarityStyles(avatar.rarity)}`}>
                                {avatar.rarity}
                            </div>
                        )}

                        {/* Owned Tag */}
                        {avatar.isOwned && !avatar.isSelected && (
                            <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check</span> Tuyo
                            </div>
                        )}

                        {/* Equipped Tag */}
                        {avatar.isSelected && (
                            <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span> Equipado
                            </div>
                        )}

                        {/* Avatar Image */}
                        <div className={`aspect-square w-full rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center mb-4 overflow-hidden relative ${!avatar.isUnlocked ? 'grayscale group-hover:grayscale-0' : ''} transition-all duration-500`}>
                            {avatar.imageUrl ? (
                                <img
                                    alt={avatar.name}
                                    className="w-3/4 h-3/4 object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                    src={avatar.imageUrl}
                                />
                            ) : (
                                <span className="text-8xl transform group-hover:scale-110 transition-transform duration-300">{avatar.emoji}</span>
                            )}
                        </div>

                        {/* Avatar Info */}
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-[#1c0d1c] dark:text-white leading-tight">{avatar.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Colección {avatar.collection || 'General'}</p>

                            {/* Action Button */}
                            {avatar.isSelected ? (
                                <button className="mt-auto w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-sm shadow-md shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                                    <span className="material-symbols-outlined text-lg">check</span>
                                    Equipado
                                </button>
                            ) : avatar.isOwned ? (
                                <button
                                    onClick={() => selectAvatar(avatar.id)}
                                    disabled={selecting === avatar.id}
                                    className="mt-auto w-full h-10 bg-white dark:bg-gray-700 border-2 border-primary text-primary dark:text-white hover:bg-primary hover:text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    {selecting === avatar.id ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                                    ) : (
                                        'Equipar'
                                    )}
                                </button>
                            ) : !avatar.isUnlocked ? (
                                <button className="mt-auto w-full h-10 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    {avatar.price.toLocaleString()}
                                </button>
                            ) : (
                                <button
                                    onClick={() => buyAvatar(avatar)}
                                    className="mt-auto w-full h-10 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                    {avatar.price.toLocaleString()}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredAvatars.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No hay avatares disponibles en esta categoría
                </div>
            )}
        </div>
    );
}
