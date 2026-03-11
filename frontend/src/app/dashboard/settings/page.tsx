"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import {
    User, Lock, Bell, Palette, Shield, Save, Loader2,
    Moon, Sun, Volume2, VolumeX, Mail, Eye, EyeOff
} from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    // Profile Settings
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
    });

    // Password Settings
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushNotifications: true,
        dailyReminders: true,
        weeklyReport: false,
        achievementAlerts: true,
    });

    // Appearance Settings
    const [appearance, setAppearance] = useState({
        theme: "light",
        soundEnabled: true,
        animationsEnabled: true,
    });

    useEffect(() => {
        loadUserData();
        loadSavedPreferences();
    }, []);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;

            const res = await api.get(`/users/${userId}`);
            setProfile({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                email: res.data.email || "",
                username: res.data.username || "",
            });
        } catch (err) {
            console.error("Error loading user data", err);
        }
    };

    const loadSavedPreferences = () => {
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedSound = localStorage.getItem("soundEnabled") !== "false";
        const savedAnimations = localStorage.getItem("animationsEnabled") !== "false";

        setAppearance({
            theme: savedTheme,
            soundEnabled: savedSound,
            animationsEnabled: savedAnimations,
        });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token!.split('.')[1]));

            await api.patch(`/users/${payload.sub}`, profile);
            toast.success("Perfil actualizado correctamente");
        } catch (err) {
            toast.error("Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        if (passwords.new.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/change-password", {
                currentPassword: passwords.current,
                newPassword: passwords.new,
            });
            toast.success("Contraseña actualizada correctamente");
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err) {
            toast.error("Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = () => {
        localStorage.setItem("notificationPrefs", JSON.stringify(notifications));
        toast.success("Preferencias de notificaciones guardadas");
    };

    const handleSaveAppearance = () => {
        localStorage.setItem("theme", appearance.theme);
        localStorage.setItem("soundEnabled", String(appearance.soundEnabled));
        localStorage.setItem("animationsEnabled", String(appearance.animationsEnabled));

        document.documentElement.classList.toggle("dark", appearance.theme === "dark");
        toast.success("Preferencias de apariencia guardadas");
    };

    const tabs = [
        { id: "profile", label: "Perfil", icon: User },
        { id: "security", label: "Seguridad", icon: Shield },
        { id: "notifications", label: "Notificaciones", icon: Bell },
        { id: "appearance", label: "Apariencia", icon: Palette },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Administra tu cuenta y preferencias</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Información del Perfil</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Usuario</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">El nombre de usuario no se puede cambiar</p>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Guardar Cambios
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cambiar Contraseña</h2>

                            {["current", "new", "confirm"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {field === "current" ? "Contraseña Actual" : field === "new" ? "Nueva Contraseña" : "Confirmar Contraseña"}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords[field as keyof typeof showPasswords] ? "text" : "password"}
                                            value={passwords[field as keyof typeof passwords]}
                                            onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                                            className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field as keyof typeof showPasswords] })}
                                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords[field as keyof typeof showPasswords] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleChangePassword}
                                disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                                Cambiar Contraseña
                            </button>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferencias de Notificaciones</h2>

                            {[
                                { key: "emailAlerts", label: "Alertas por Email", desc: "Recibe notificaciones importantes por email" },
                                { key: "pushNotifications", label: "Notificaciones Push", desc: "Notificaciones en tiempo real" },
                                { key: "dailyReminders", label: "Recordatorios Diarios", desc: "Recordatorio para completar ejercicios" },
                                { key: "weeklyReport", label: "Reporte Semanal", desc: "Resumen de tu progreso cada semana" },
                                { key: "achievementAlerts", label: "Alertas de Logros", desc: "Notificación al desbloquear medallas" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                        className={`w-12 h-7 rounded-full transition-all ${notifications[item.key as keyof typeof notifications]
                                                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                                : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={handleSaveNotifications}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                            >
                                <Save className="w-5 h-5" />
                                Guardar Preferencias
                            </button>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === "appearance" && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Apariencia</h2>

                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">Tema</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { value: "light", label: "Claro", icon: Sun },
                                        { value: "dark", label: "Oscuro", icon: Moon },
                                    ].map((theme) => {
                                        const Icon = theme.icon;
                                        return (
                                            <button
                                                key={theme.value}
                                                onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${appearance.theme === theme.value
                                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 ${appearance.theme === theme.value ? "text-blue-500" : "text-gray-500"}`} />
                                                <span className={appearance.theme === theme.value ? "text-blue-600 font-medium" : "text-gray-600 dark:text-gray-300"}>
                                                    {theme.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <div className="flex items-center gap-3">
                                    {appearance.soundEnabled ? <Volume2 className="w-5 h-5 text-gray-500" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">Sonidos</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Efectos de sonido en ejercicios</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAppearance({ ...appearance, soundEnabled: !appearance.soundEnabled })}
                                    className={`w-12 h-7 rounded-full transition-all ${appearance.soundEnabled
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                            : "bg-gray-300 dark:bg-gray-600"
                                        }`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${appearance.soundEnabled ? "translate-x-6" : "translate-x-1"
                                        }`} />
                                </button>
                            </div>

                            <button
                                onClick={handleSaveAppearance}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                            >
                                <Save className="w-5 h-5" />
                                Guardar Apariencia
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
