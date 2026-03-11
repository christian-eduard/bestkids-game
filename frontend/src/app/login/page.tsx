"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BestKidsLogin() {
    const { login } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDevMenu, setShowDevMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await login(username, password);
            // Ensure roleId is number for comparison
            const roleId = Number(user.roleId);

            // Small delay to ensure localStorage is synced before navigation
            await new Promise(resolve => setTimeout(resolve, 100));

            // Role-based redirection - use full page reload to ensure token is picked up
            switch (roleId) {
                case 1: // Master Admin
                    window.location.href = '/dashboard/admin';
                    break;
                case 2: // Center Admin
                    window.location.href = '/dashboard/center';
                    break;
                case 3: // Teacher
                    window.location.href = '/dashboard/teacher';
                    break;
                case 4: // Parent
                    window.location.href = '/dashboard/parent';
                    break;
                case 5: // Student
                default:
                    window.location.href = '/dashboard';
                    break;
            }
        } catch (err) {
            setError('Credenciales inválidas');
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="h-screen w-full flex items-center justify-center p-2 md:p-4">
            <main className="w-full max-w-[440px] relative z-10">
                <div className="bg-card-light dark:bg-card-dark rounded-2xl md:rounded-3xl shadow-soft p-5 md:p-8 border border-white/50 dark:border-white/5 relative z-10 transition-all duration-300 hover:shadow-glow">
                    {/* Logo Area */}
                    <div className="flex flex-col items-center justify-center mb-6 gap-2">
                        <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center rotate-3 transform transition-transform hover:rotate-6">
                            <span className="material-symbols-outlined text-primary !text-[32px]">rocket_launch</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-text-main dark:text-white text-3xl font-black tracking-tight leading-tight">BestKids</h2>
                            <p className="text-text-muted dark:text-gray-400 text-sm font-medium tracking-wide uppercase mt-1">Portal de Acceso</p>
                        </div>
                    </div>

                    {/* Greeting */}
                    <div className="text-center mb-6">
                        <h1 className="text-text-main dark:text-white text-xl md:text-2xl font-bold mb-1">¡Hola de nuevo!</h1>
                        <p className="text-text-muted dark:text-gray-400 text-sm">Ingresa a tu cuenta para continuar</p>
                    </div>

                    {/* Login Form */}
                    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold px-4 py-2 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="group">
                            <label className="block text-text-main dark:text-gray-200 text-sm font-bold mb-2 pl-4" htmlFor="username">Usuario</label>
                            <div className="relative flex items-center">
                                <input
                                    className="peer w-full h-14 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-12 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300"
                                    id="username"
                                    placeholder="Nombre de usuario"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                />
                                <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300">person</span>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <div className="flex justify-between items-center mb-2 px-4">
                                <label className="block text-text-main dark:text-gray-200 text-sm font-bold" htmlFor="password">Contraseña</label>
                                <a className="text-xs font-bold text-primary hover:text-primary-dark transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    className="peer w-full h-14 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-12 pr-12 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300"
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                />
                                <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300">lock</span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-text-muted hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="mt-4 w-full h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
                            type="button"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            <span>{loading ? 'Entrando...' : 'Iniciar Sesión'}</span>
                            {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                        </button>

                        {/* Quick Access (Dev Only) - Opens upwards */}
                        <div className="mt-3 relative">
                            <button
                                type="button"
                                onClick={() => setShowDevMenu(!showDevMenu)}
                                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 cursor-pointer font-bold text-xs text-text-muted hover:text-primary transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">bolt</span>
                                    Acceso Rápido (Dev)
                                </span>
                                <span className={`material-symbols-outlined text-base transition-transform duration-200 ${showDevMenu ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {showDevMenu && (
                                <div className="absolute bottom-full left-0 right-0 mb-1 p-2 grid gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-lg z-50 max-h-64 overflow-y-auto">
                                    {['master', 'admin', 'teacher1', 'parent1', 'student1', 'student2', 'student3'].map((user) => (
                                        <button
                                            key={user}
                                            type="button"
                                            onClick={async () => {
                                                setShowDevMenu(false);
                                                setLoading(true);
                                                try {
                                                    await login(user, 'admin123');
                                                    await new Promise(r => setTimeout(r, 100));

                                                    if (user === 'master') {
                                                        window.location.href = '/dashboard/admin';
                                                    } else if (user === 'admin') {
                                                        window.location.href = '/dashboard/center';
                                                    } else if (user.includes('teacher')) {
                                                        window.location.href = '/dashboard/teacher';
                                                    } else if (user.includes('parent')) {
                                                        window.location.href = '/dashboard/parent';
                                                    } else {
                                                        window.location.href = '/dashboard';
                                                    }
                                                } catch (err) {
                                                    setError('Error en acceso rápido');
                                                    setLoading(false);
                                                }
                                            }}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-primary/10 transition-all group/item"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`size-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]
                                                    ${user.includes('student') ? 'bg-emerald-500' :
                                                        user.includes('parent') ? 'bg-purple-500' :
                                                            user.includes('teacher') ? 'bg-blue-500' :
                                                                user === 'master' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                                    {user[0].toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-text-main dark:text-white">
                                                    {user === 'master' ? 'Master Admin' :
                                                        user === 'admin' ? 'Admin Centro' :
                                                            user === 'teacher1' ? 'Profesor' :
                                                                user === 'parent1' ? 'Padre' :
                                                                    user === 'student1' ? 'Estudiante 1' :
                                                                        user === 'student2' ? 'Estudiante 2' :
                                                                            'Estudiante 3'}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-xs text-gray-300 group-hover/item:text-primary">login</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Footer / Sign Up */}
                    <div className="mt-4 text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-text-muted dark:text-gray-400 text-sm">
                            ¿No tienes cuenta?
                            <a className="text-primary font-bold hover:underline ml-1" href="/register">Regístrate aquí</a>
                        </p>
                    </div>
                </div>

                {/* Fun decorative graphics */}
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-full blur-xl opacity-20 -z-10 animate-pulse"></div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl from-blue-400 to-primary rounded-full blur-xl opacity-20 -z-10"></div>
            </main>
        </div>
    );
}
