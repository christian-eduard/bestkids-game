"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTutorial } from '@/contexts/TutorialContext';
import { HelpCircle } from 'lucide-react';
import { TUTORIAL_CONFIG } from '@/config/tutorials.config';

const ROLE_CONFIG = {
    1: { label: 'Administrador', color: 'text-orange-500' },
    2: { label: 'Admin Centro', color: 'text-blue-500' },
    3: { label: 'Profesor', color: 'text-cyan-500' },
    4: { label: 'Familia', color: 'text-purple-500' },
    5: { label: 'Estudiante', color: 'text-primary' },
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { startTutorial } = useTutorial();
    const pathname = usePathname();

    let roleId = user?.roleId || 5;

    // HOTFIX: Ensure main admin sees Center Dashboard as requested
    if (user?.email === 'admin@bestkids.com') {
        roleId = 2;
    }

    const roleConfig = ROLE_CONFIG[roleId as keyof typeof ROLE_CONFIG] || ROLE_CONFIG[5];

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const handleStartTutorial = () => {
        // Normalize path for dynamic routes (e.g. /dashboard/exercises/123 -> /dashboard/exercises/id)
        let processedPath = pathname;
        if (pathname.startsWith('/dashboard/exercises/') && pathname !== '/dashboard/exercises') {
            processedPath = '/dashboard/exercises/id';
        }

        // First try specific path + role
        const rolePathKey = `${processedPath}_${roleId}`;
        const steps = TUTORIAL_CONFIG[rolePathKey] || TUTORIAL_CONFIG[processedPath] || TUTORIAL_CONFIG["default"];
        startTutorial(steps);
    };

    // Master Admin Navigation (roleId 1)
    const masterNav = [
        { href: '/dashboard/admin', icon: 'dashboard', label: 'Dashboard' },
        { href: '/dashboard/admin/centers', icon: 'business', label: 'Centros' },
        { href: '/dashboard/admin/users', icon: 'group', label: 'Usuarios' },
        { href: '/dashboard/admin/curriculum', icon: 'school', label: 'Curriculum' },
        { href: '/dashboard/admin/exercises', icon: 'extension', label: 'Ejercicios' },
        { href: '/dashboard/admin/store', icon: 'shopping_bag', label: 'Tienda Master' },
        { href: '/dashboard/admin/reports', icon: 'analytics', label: 'Reportes' },
        { href: '/dashboard/admin/resources', icon: 'folder_open', label: 'Recursos Master' },
        { href: '/dashboard/admin/settings', icon: 'settings', label: 'Configuración' },
        { href: '/dashboard/admin/moderation', icon: 'shield', label: 'Moderación' },
        { href: '/dashboard/admin/backups', icon: 'backup', label: 'Backups' },
        { href: '/dashboard/docs', icon: 'menu_book', label: 'Documentación' },
    ];

    // Center Admin Navigation (roleId 2)
    // Center Admin Navigation (roleId 2)
    const centerAdminNav = [
        { href: '/dashboard/center', icon: 'dashboard', label: 'Inicio' },
        { href: '/dashboard/center/users', icon: 'group', label: 'Mis Usuarios' },
        { href: '/dashboard/center/classes', icon: 'school', label: 'Mis Aulas' },
        { href: '/dashboard/center/profile', icon: 'business', label: 'Mi Centro' },
        { href: '/dashboard/docs', icon: 'menu_book', label: 'Documentación' },
    ];

    // Teacher Navigation (roleId 3)
    const teacherNav = [
        { href: '/dashboard/teacher', icon: 'home', label: 'Inicio' },
        { href: '/dashboard/teacher', icon: 'groups', label: 'Mis Clases', exact: true },
        { href: '/dashboard/assignments', icon: 'assignment', label: 'Asignaciones' },
        { href: '/dashboard/progress', icon: 'insights', label: 'Reportes' },
        { href: '/dashboard/docs', icon: 'menu_book', label: 'Documentación' },
    ];

    // Parent Navigation (roleId 4)
    const parentNav = [
        { href: '/dashboard/parent', icon: 'home', label: 'Inicio' },
        { href: '/dashboard/parent/report', icon: 'assessment', label: 'Reportes' },
        { href: '/dashboard/messages', icon: 'mail', label: 'Mensajes' },
        { href: '/dashboard/docs', icon: 'menu_book', label: 'Documentación' },
    ];

    // Student Navigation (roleId 5)
    const studentNav = [
        { href: '/dashboard', icon: 'home', label: 'Inicio' },
        { href: '/dashboard/worlds', icon: 'map', label: 'Mundos' },
        { href: '/dashboard/assignments', icon: 'assignment', label: 'Mis Tareas' },
        { href: '/dashboard/store', icon: 'storefront', label: 'Tienda' },
        { href: '/dashboard/inventory', icon: 'inventory_2', label: 'Mi Inventario' },
        { href: '/dashboard/achievements', icon: 'emoji_events', label: 'Logros' },
        { href: '/dashboard/profile', icon: 'person', label: 'Mi Perfil' },
        { href: '/dashboard/avatars', icon: 'face', label: 'Avatares' },
    ];

    // Select navigation based on role
    const getNavItems = () => {
        if (roleId === 1) return masterNav;
        if (roleId === 2) return centerAdminNav;
        if (roleId === 3) return teacherNav;
        if (roleId === 4) return parentNav;
        return studentNav;
    };

    const navItems = getNavItems();

    return (
        <aside className="hidden lg:flex flex-col w-72 bg-card-light dark:bg-card-dark border-r border-[#f4e7f4] dark:border-[#3d253d] h-full flex-shrink-0 transition-colors duration-300 z-20">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-center bg-no-repeat bg-cover rounded-xl size-10 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvhmmqX6VgGTVLie98HiW-BQOV9Ts6juqei8HLVS0-hQl-XZAxhczw1hLjw8ydG5e0sSn4ONid5YTLL3E6lEsPmsnl3_rT8pJQCNBcemMk3GPBSbyGoHMO2ZBNLt5gIKtRUyt95iL-AcWxNI3bjzWdjX-Uf7Y5ZFAbSBKt9Re0BFIndU8fLNBlXF0cq8Hau0ap-snLkJtt9KVbwg7o7PvrKJueaH4FlU4Rr7zlRdbG9jv1vHcN0fFIBa3CjAa_t-Ck5s1VvqV-910")' }}></div>
                <div className="flex flex-col">
                    <h1 className="text-[#1c0d1c] dark:text-white text-xl font-bold leading-tight tracking-tight">BestKids</h1>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${roleConfig.color}`}>{roleConfig.label}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item, index) => (
                    <Link
                        key={item.href + item.label}
                        href={item.href}
                        id={item.href.includes('exercises') ? 'nav-exercises' : item.href.includes('settings') ? 'nav-settings' : item.href.includes('users') ? 'nav-users' : item.href.includes('centers') ? 'nav-centers' : index === 0 ? 'nav-home' : undefined}
                        className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive(item.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#6b4c6b] dark:text-[#d1bdd1] hover:bg-[#f8f0f8] dark:hover:bg-[#3d253d] hover:text-primary'
                            }`}
                    >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontVariationSettings: isActive(item.href) ? "'FILL' 1" : "'FILL' 0" }}>
                            {item.icon}
                        </span>
                        <span className={`text-base ${isActive(item.href) ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-6">
                {/* Daily Task - Only show for students */}
                {roleId === 5 && (
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-transparent rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-xl">school</span>
                            <span className="text-sm font-bold text-primary dark:text-primary-light">Tarea Diaria</span>
                        </div>
                        <p className="text-xs text-[#6b4c6b] dark:text-[#d1bdd1] mb-2">Completa 2 lecciones de Matemáticas</p>
                        <div className="w-full bg-white dark:bg-black/20 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full rounded-full w-1/2"></div>
                        </div>
                    </div>
                )}

                {/* User Info */}
                <div id="user-profile" className="flex items-center gap-3 mb-4 p-3 bg-[#f8f0f8] dark:bg-[#2d1d2d] rounded-xl">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1c0d1c] dark:text-white truncate">
                            {user?.firstName || 'Usuario'}
                        </p>
                        <p className="text-xs text-[#6b4c6b] dark:text-[#d1bdd1] truncate">
                            {user?.email || ''}
                        </p>
                    </div>
                </div>

                <button
                    id="help-btn"
                    onClick={handleStartTutorial}
                    className="flex w-full items-center justify-center gap-2 rounded-full h-12 px-6 bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 text-primary text-sm font-bold transition-all duration-200 cursor-pointer mb-2"
                >
                    <HelpCircle className="size-5" />
                    <span>¿Necesitas Ayuda?</span>
                </button>

                <button
                    id="logout-btn"
                    onClick={() => {
                        logout();
                        window.location.href = '/login';
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full h-12 px-6 border-2 border-[#f4e7f4] dark:border-[#3d253d] hover:border-primary/50 text-[#6b4c6b] dark:text-[#d1bdd1] hover:text-primary text-sm font-bold transition-all duration-200 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
