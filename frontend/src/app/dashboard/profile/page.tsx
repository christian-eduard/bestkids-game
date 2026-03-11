"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getLevelInfo, calculateLevelProgress } from '@/lib/levels';
import { useEffect, useState, useRef } from 'react';
import { GamificationService, GamificationProfile } from '@/services/gamification.service';
import { StoreService, InventoryItem } from '@/services/store.service';
import { useToast } from '@/contexts/ToastContext';
import api from '@/lib/api';

// Predefined profile images gallery
const PROFILE_IMAGES = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhQI6ikt9p_7bwcZki4N2M_KqCqvhG9Kx0amR8gR_Dyb3yJlTcDPaRz-0ALUX4gTpaAUexhR-rxxp7xCcwtxO7-gRkwfe3fzf3hNb9Oy4LTdhonvk0G2d4n5M0iyvY7ROmtnqxnrHbRnyMjvs1DEkzntMhY95U_1wuN9i3KvDBOwy5sKz3wnZ2m-uedo_xwUgo4G24y6fARvH5PZAr5fOKKUDYKAIAirVNAnZEt4d_mbyK71bA6z7w40G5jycz3735G3whzkJQhU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD5k8hUt3-0i8sjCfcPDXNNtK13akHoRYmDgYQvQIHwGs_3BrcaPgcbi-Jr86XUviP579PuCKrJzQi_fuHu8OZU9Jf9EsbZTMaOk9pWPA7iZZuKLHcUiml-KG_XSEytDgnSdiRX_twjEjEdCexH0j-oqrqzF1TCVRBxq7WVxpRFEsl1lIkO3Rcp8Shy514ZaIM5swHdUglmSRdPtduq-g4zMA52CEmE_RfYrSZsx-BkgT9740DoAkC7dGTBr0FfzNDh8Xy3ruA-3RM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDEF0RlwEtN_mJ6soFwvNGKT3PmgTzjrkJrHNTZVHzQrzlm250EY9ydZNcJK-yR9lurOWexjgJQldYyUdnK2c4ZqiD-af3ulZHcX22V6MvSRmBo3cebfq5jf1hDw1SPGdm67ajWUDhmsZ4Od0jDngMlAqlBNZ9Rv-_jI8oUzUzVYkkJCEi06IpTspi8cm9RJQskgREcnE9KcgwsXK43ODSTXwjzak-dLKJIqbgee4_QhGl59AD9yxenqrLaCLgPLx4TBYu32vdADOM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpcZa_Q29xbJ1z0gvvt1F9YHodXIHBwFKnivm1SCkeaQGlQ16CTZ2Ov_xoVWOF4QJzQt3lUVWsK0-frBBFHU4rHx7LJgXY_m-BsEIbqX8gZN8YZh5FMUkCxZcexunrykJNwyTFBtX4cwXpE4yS9QeXGIXCPuLXnFE8WBUck08fAdQInH46Ek39vgylTcqDgHtoQ2-ZX6i2WbWZHpwd4rAj4bYXST8dPfjKEVbNFDdM9vbL5DHWqsERcFj04OJDkUMeNqAwklN2A2c",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXH1HTuwbCig_Udh9XMkQq2R3bkLw3TRLgGWtT30iSbtuB7K7G5DKa3BtBwbBlnD3HbjlZWzaO8p4EwpTEbVcDZxzgatCKBTtaxQbGWLDfQ3G_PLW1onvZG6k0kvjCcl4AlnWRjbvLO2w3PIv0GJPkjCPjUSoK4TTsB6R8ZbsE8rOVuhzBddt0sCZYZVh_pROqpq5mqZ_1QtmnLuPpcYI23l_c88pDBTaBAgw55nFC8SkzH5YBAeUiuoPHxk4qpaJJK6UqJhjcz9Y",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCefzRZF9PMSUg_homz2tn1aRL5ndVQzdimcPr9bvvLT5bzIlJ65JSodhJO1N3NDoMY2w3zlVDGhnHgWAOsuOWNF8RYP7DmpFuyyfnyfb4ylwhE9tpKd5R0aEL17ieO3SXGLNiN41apBUpZBCDqnaPEN-58pgOCa7On1MtAM2JhOx4K_gyloMMSaK6PViwyfJIFePsRS8GVPwP5wzd3g6ig-sb1m2_2e_1OQRv_E6Vsa8VtywPrsoiqBNX29PuRttz1d7Q_2ilbWAY",
];

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileImage, setProfileImage] = useState(PROFILE_IMAGES[0]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await GamificationService.getProfile();
                const achievementsData = await GamificationService.getAchievements();
                setProfile(profileData);
                setAchievements(achievementsData);

                // Fetch Inventory to check for equipped avatar
                try {
                    const inventory = await StoreService.getMyInventory();
                    const equippedAvatar = inventory.find((inv: InventoryItem) => inv.isEquipped && (inv.item.type === 'sticker' || inv.item.type === 'avatar_frame'));

                    if (equippedAvatar && equippedAvatar.item.imageUrl) {
                        setProfileImage(equippedAvatar.item.imageUrl);
                        // Optional: Update localStorage to keep in sync
                        localStorage.setItem('bestkids-profile-image', equippedAvatar.item.imageUrl);
                    } else {
                        // If no equipped backend item, fallback to localStorage
                        const savedImage = localStorage.getItem('bestkids-profile-image');
                        if (savedImage) {
                            setProfileImage(savedImage);
                        }
                    }
                } catch (storeError) {
                    console.error("Failed to fetch inventory", storeError);
                    // Fallback to localStorage on error
                    const savedImage = localStorage.getItem('bestkids-profile-image');
                    if (savedImage) {
                        setProfileImage(savedImage);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch profile/achievements", error);
            }
        };
        fetchProfileData();
    }, []);

    const handleImageSelect = (imageUrl: string) => {
        setProfileImage(imageUrl);
        localStorage.setItem('bestkids-profile-image', imageUrl);
        setShowImageModal(false);
        toast.success('¡Imagen de perfil actualizada!');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no puede ser mayor a 5MB');
            return;
        }

        setUploading(true);

        try {
            // Convert to base64 for local storage demo
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                setProfileImage(base64);
                localStorage.setItem('bestkids-profile-image', base64);
                setShowImageModal(false);
                toast.success('¡Imagen subida correctamente!');
                setUploading(false);
            };
            reader.onerror = () => {
                toast.error('Error al procesar la imagen');
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('Error al subir la imagen');
            setUploading(false);
        }
    };

    const openEditModal = () => {
        setEditFirstName(user?.firstName || '');
        setEditLastName(user?.lastName || '');
        setEditEmail(user?.email || '');
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await api.patch('/users/profile', {
                firstName: editFirstName,
                lastName: editLastName,
                email: editEmail
            });
            toast.success('¡Perfil actualizado!');
            setShowEditModal(false);
            // Refresh the page to see changes
            window.location.reload();
        } catch (error) {
            toast.error('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    const userName = user?.fullName || user?.username || 'Estudiante';
    const totalPoints = profile?.totalPoints || 0;
    const level = profile?.currentLevel || 1;
    const levelInfo = getLevelInfo(level);
    const progress = calculateLevelProgress(totalPoints, level);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full p-6">
                {/* Left Column: Identity Card */}
                <section className="lg:col-span-4 flex flex-col gap-6">
                    {/* Avatar Card */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 shadow-soft flex flex-col items-center border border-[#f4e7f4] dark:border-white/5 h-full relative overflow-hidden group">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent rounded-t-2xl z-0"></div>
                        <div className="relative z-10 flex flex-col items-center w-full">
                            <div className="relative mb-6">
                                <div className="size-40 rounded-full p-1 bg-gradient-to-tr from-primary via-purple-400 to-blue-400 shadow-xl">
                                    <div className="w-full h-full rounded-full border-4 border-white dark:border-card-dark overflow-hidden bg-white dark:bg-gray-800">
                                        <div
                                            className="w-full h-full bg-center bg-cover"
                                            style={{ backgroundImage: `url("${profileImage}")` }}
                                        ></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowImageModal(true)}
                                    className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 text-text-main dark:text-white p-2.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 transition-transform hover:scale-105"
                                >
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold text-text-main dark:text-white mb-1">{userName}</h2>
                                <button
                                    onClick={openEditModal}
                                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                    title="Editar perfil"
                                >
                                    <span className="material-symbols-outlined text-lg">edit_note</span>
                                </button>
                            </div>
                            <p className="text-primary font-medium text-lg mb-6 flex items-center gap-2">
                                <span className="text-2xl">{levelInfo.emoji}</span>
                                Nivel {level} - {levelInfo.name}
                            </p>
                            {/* XP Progress */}
                            <div className="w-full flex flex-col gap-2 mb-8">
                                <div className="flex justify-between text-sm font-semibold px-1">
                                    <span className="text-text-muted dark:text-gray-400">Progreso de Nivel</span>
                                    <span className="text-text-main dark:text-white">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-4 w-full bg-[#f4e7f4] dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-primary rounded-full relative transition-all duration-1000" style={{ width: `${progress}%` }}>
                                        <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-b from-white/30 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Quick Actions */}
                            <div className="w-full grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => router.push('/dashboard/avatars')}
                                    className="flex flex-col items-center justify-center gap-1 bg-[#fcf8fc] dark:bg-white/5 hover:bg-[#f4e7f4] dark:hover:bg-white/10 p-4 rounded-xl transition-colors group/btn"
                                >
                                    <span className="material-symbols-outlined text-3xl text-primary group-hover/btn:scale-110 transition-transform">face</span>
                                    <span className="text-sm font-bold text-text-main dark:text-gray-200">Avatares</span>
                                </button>
                                <button
                                    onClick={() => router.push('/dashboard/store')}
                                    className="flex flex-col items-center justify-center gap-1 bg-[#fcf8fc] dark:bg-white/5 hover:bg-[#f4e7f4] dark:hover:bg-white/10 p-4 rounded-xl transition-colors group/btn"
                                >
                                    <span className="material-symbols-outlined text-3xl text-blue-500 group-hover/btn:scale-110 transition-transform">storefront</span>
                                    <span className="text-sm font-bold text-text-main dark:text-gray-200">Tienda</span>
                                </button>
                                <button
                                    onClick={openEditModal}
                                    className="flex flex-col items-center justify-center gap-1 bg-[#fcf8fc] dark:bg-white/5 hover:bg-[#f4e7f4] dark:hover:bg-white/10 p-4 rounded-xl transition-colors group/btn"
                                >
                                    <span className="material-symbols-outlined text-3xl text-green-500 group-hover/btn:scale-110 transition-transform">manage_accounts</span>
                                    <span className="text-sm font-bold text-text-main dark:text-gray-200">Editar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: Stats & Achievements */}
                <section className="lg:col-span-8 flex flex-col gap-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Stat Card 1 */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-soft border border-[#f4e7f4] dark:border-white/5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-500">
                                    <span className="material-symbols-outlined">local_fire_department</span>
                                </div>
                                <span className="text-sm font-bold text-text-muted dark:text-gray-400 uppercase tracking-wide">Racha</span>
                            </div>
                            <p className="text-4xl font-bold text-text-main dark:text-white">{profile?.currentStreakDays || 0} <span className="text-lg font-medium text-text-muted dark:text-gray-500">Días</span></p>
                        </div>
                        {/* Stat Card 2 */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-soft border border-[#f4e7f4] dark:border-white/5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                                    <span className="material-symbols-outlined">diamond</span>
                                </div>
                                <span className="text-sm font-bold text-text-muted dark:text-gray-400 uppercase tracking-wide">Puntos</span>
                            </div>
                            <p className="text-4xl font-bold text-text-main dark:text-white">{totalPoints.toLocaleString()} <span className="text-lg font-medium text-text-muted dark:text-gray-500">XP</span></p>
                        </div>
                        {/* Stat Card 3 */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-soft border border-[#f4e7f4] dark:border-white/5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-500">
                                    <span className="material-symbols-outlined">emoji_events</span>
                                </div>
                                <span className="text-sm font-bold text-text-muted dark:text-gray-400 uppercase tracking-wide">Logros</span>
                            </div>
                            <p className="text-4xl font-bold text-text-main dark:text-white">{achievements.length} <span className="text-lg font-medium text-text-muted dark:text-gray-500">Ganados</span></p>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-8 shadow-soft border border-[#f4e7f4] dark:border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                                Logros Desbloqueados
                            </h3>
                            <a className="text-sm font-bold text-primary hover:text-purple-600 transition-colors" href="/dashboard/achievements">Ver Todos</a>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {achievements.length > 0 ? achievements.slice(0, 3).map((achievement: any) => (
                                <div key={achievement.id} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#fcf8fc] dark:bg-white/5 border border-transparent hover:border-primary/30 transition-all cursor-pointer group">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">{achievement.icon || 'stars'}</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-text-main dark:text-white line-clamp-1">{achievement.title || achievement.name}</p>
                                        <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-1">{achievement.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center text-gray-500 py-4">No tienes logros desbloqueados aún. ¡Juega para ganar!</div>
                            )}
                            {/* Locked Placeholder */}
                            <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent opacity-60 hover:opacity-100 transition-all cursor-pointer grayscale hover:grayscale-0">
                                <div className="size-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">lock</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-sm text-text-main dark:text-gray-300">???</p>
                                    <p className="text-xs text-text-muted dark:text-gray-500">Bloqueado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Adventure */}
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-soft border border-[#f4e7f4] dark:border-white/5 flex flex-col md:flex-row">
                        <div className="p-8 flex-1 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Próxima Aventura</h3>
                            <p className="text-text-muted dark:text-gray-400 mb-6 text-sm">Continúa tu viaje y gana puntos para desbloquear nuevos avatares en la tienda.</p>
                            <button
                                onClick={() => router.push('/dashboard/worlds')}
                                className="bg-primary hover:bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-full w-fit shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">play_circle</span>
                                Continuar Jugando
                            </button>
                        </div>
                        <div className="md:w-1/2 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-purple-500/20 relative flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary/50 text-9xl">explore</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Profile Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#321a32] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">account_circle</span>
                                Cambiar Imagen de Perfil
                            </h2>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Upload Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">upload</span>
                                    Subir una imagen
                                </h3>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center gap-2"
                                >
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-4xl text-gray-400">cloud_upload</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Haz clic para seleccionar una imagen</span>
                                            <span className="text-xs text-gray-400">Máximo 5MB • JPG, PNG, GIF</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Gallery Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">photo_library</span>
                                    O elige de la galería
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {PROFILE_IMAGES.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleImageSelect(image)}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${profileImage === image
                                                ? 'border-primary ring-2 ring-primary/30'
                                                : 'border-transparent hover:border-primary/50'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-full bg-center bg-cover"
                                                style={{ backgroundImage: `url("${image}")` }}
                                            />
                                            {profileImage === image && (
                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="px-6 py-2 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#321a32] rounded-2xl shadow-2xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit</span>
                                Editar Perfil
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    value={editLastName}
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Tu apellido"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:border-primary focus:outline-none transition-colors"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-2 rounded-full font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="px-6 py-2 rounded-full font-bold bg-primary text-white hover:bg-fuchsia-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <span className="material-symbols-outlined text-lg">save</span>
                                )}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
