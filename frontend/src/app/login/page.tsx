"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Import Vanta.js only on client side
declare global {
    interface Window {
        VANTA: any;
        THREE: any;
    }
}

export default function BestKidsLogin() {
    const { login } = useAuth();
    const router = useRouter();
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDevMenu, setShowDevMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadVanta = () => {
            if (typeof window !== 'undefined' && !vantaEffect) {
                const threeScript = document.createElement('script');
                threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
                threeScript.onload = () => {
                    const vantaScript = document.createElement('script');
                    vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js';
                    vantaScript.onload = () => {
                        if (vantaRef.current && window.VANTA) {
                            const effect = window.VANTA.HALO({
                                el: vantaRef.current,
                                mouseControls: true,
                                touchControls: true,
                                gyroControls: false,
                                minHeight: 200.00,
                                minWidth: 200.00,
                                baseColor: 0x221a22,
                                backgroundColor: 0x050406,
                                amplitudeFactor: 1.50,
                                xOffset: 0.15,
                                yOffset: 0.00,
                                size: 1.50
                            });
                            setVantaEffect(effect);
                        }
                    };
                    document.head.appendChild(vantaScript);
                };
                document.head.appendChild(threeScript);
            }
        };

        loadVanta();

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await login(username, password);
            const roleId = Number(user.roleId);

            await new Promise(resolve => setTimeout(resolve, 100));

            switch (roleId) {
                case 1:
                    window.location.href = '/dashboard/admin';
                    break;
                case 2:
                    window.location.href = '/dashboard/center';
                    break;
                case 3:
                    window.location.href = '/dashboard/teacher';
                    break;
                case 4:
                    window.location.href = '/dashboard/parent';
                    break;
                case 5:
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
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Vanta Background Container */}
            <div ref={vantaRef} className="absolute inset-0 z-0 h-full w-full"></div>

            {/* Content Mask / Backdrop blur */}
            <div className="absolute inset-0 z-1 bg-black/10 backdrop-blur-[2px]"></div>

            <main className="w-full max-w-[440px] relative z-10 px-4">
                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 dark:border-white/10 relative transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] group/card">
                    
                    {/* Floating Background Elements */}
                    <div className="absolute -top-12 -right-12 size-40 bg-primary/20 rounded-full blur-3xl group-hover/card:bg-primary/30 transition-all duration-700 animate-pulse"></div>
                    <div className="absolute -bottom-12 -left-12 size-40 bg-fuchsia-500/20 rounded-full blur-3xl group-hover/card:bg-fuchsia-500/30 transition-all duration-700 animate-pulse delay-700"></div>

                    {/* Logo Area */}
                    <div className="flex flex-col items-center justify-center mb-8 gap-4">
                        <div className="size-20 bg-gradient-to-br from-primary to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3 transform transition-all duration-500 group-hover/card:rotate-12 group-hover/card:scale-110">
                            <span className="material-symbols-outlined text-white !text-[44px]">rocket_launch</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-white text-4xl font-black tracking-tight leading-tight drop-shadow-md">BestKids</h2>
                            <div className="h-1 w-12 bg-primary mx-auto mt-2 rounded-full"></div>
                        </div>
                    </div>

                    {/* Form Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-white text-2xl font-bold mb-2">¡Bienvenido al Futuro!</h1>
                        <p className="text-white/60 text-sm font-medium">Ingresa para explorar el universo educativo</p>
                    </div>

                    {/* Login Form */}
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        {error && (
                            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm font-bold px-4 py-3 rounded-2xl text-center animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-white/80 text-xs font-black uppercase tracking-widest pl-5" htmlFor="username">Usuario</label>
                            <div className="relative group/input">
                                <input
                                    className="w-full h-15 bg-white/5 border-2 border-white/10 focus:border-primary focus:bg-white/10 rounded-full px-6 pl-14 text-white placeholder:text-white/20 font-bold focus:outline-none transition-all duration-300"
                                    id="username"
                                    placeholder="Tu nombre de usuario"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                />
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-primary transition-colors">person</span>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-5">
                                <label className="block text-white/80 text-xs font-black uppercase tracking-widest" htmlFor="password">Contraseña</label>
                                <a className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-tighter" href="#">¿Olvidaste la clave?</a>
                            </div>
                            <div className="relative group/input">
                                <input
                                    className="w-full h-15 bg-white/5 border-2 border-white/10 focus:border-primary focus:bg-white/10 rounded-full px-6 pl-14 pr-14 text-white placeholder:text-white/20 font-bold focus:outline-none transition-all duration-300"
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                />
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-primary transition-colors">lock</span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined !text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="mt-4 w-full h-16 bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary-dark hover:to-fuchsia-700 text-white text-xl font-black rounded-full shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                            type="button"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            <span className="tracking-tight">{loading ? 'ESTABLECIENDO CONEXIÓN...' : 'INICIAR SESIÓN'}</span>
                            {!loading && <span className="material-symbols-outlined font-black">arrow_forward</span>}
                        </button>

                        {/* Quick Access (Dev Only) */}
                        <div className="mt-4 relative">
                            <button
                                type="button"
                                onClick={() => setShowDevMenu(!showDevMenu)}
                                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer font-black text-[10px] text-white/40 hover:text-primary hover:bg-white/10 transition-all uppercase tracking-widest"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    Acceso Rápido (Dev Mod)
                                </span>
                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showDevMenu ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {showDevMenu && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 grid gap-1 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl z-50 max-h-72 overflow-y-auto border-t-2 border-t-primary animate-in slide-in-from-bottom-4 duration-300">
                                    {[
                                        { id: 'master', label: 'Master Admin', role: 1, icon: 'shield' },
                                        { id: 'admin', label: 'Coordinador Centro', role: 2, icon: 'apartment' },
                                        { id: 'teacher1', label: 'Profesor Titular', role: 3, icon: 'school' },
                                        { id: 'parent1', label: 'Padre/Madre', role: 4, icon: 'family_restroom' },
                                        { id: 'student1', label: 'Alumno Estrella', role: 5, icon: 'child_care' }
                                    ].map((devUser) => (
                                        <button
                                            key={devUser.id}
                                            type="button"
                                            onClick={async () => {
                                                setShowDevMenu(false);
                                                setLoading(true);
                                                try {
                                                    await login(devUser.id, 'admin123'); // Usando password estandar de dev
                                                    await new Promise(r => setTimeout(r, 100));
                                                    
                                                    switch (devUser.role) {
                                                        case 1: window.location.href = '/dashboard/admin'; break;
                                                        case 2: window.location.href = '/dashboard/center'; break;
                                                        case 3: window.location.href = '/dashboard/teacher'; break;
                                                        case 4: window.location.href = '/dashboard/parent'; break;
                                                        default: window.location.href = '/dashboard'; break;
                                                    }
                                                } catch (err) {
                                                    setError('Error sincronización dev');
                                                    setLoading(false);
                                                }
                                            }}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all group/item"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg
                                                    ${devUser.role === 5 ? 'bg-emerald-500' :
                                                        devUser.role === 4 ? 'bg-purple-500' :
                                                            devUser.role === 3 ? 'bg-blue-500' :
                                                                devUser.role === 1 ? 'bg-red-500' : 'bg-orange-500'}`}>
                                                    <span className="material-symbols-outlined !text-sm">{devUser.icon}</span>
                                                </div>
                                                <span className="text-xs font-black text-white/80 group-hover/item:text-white uppercase tracking-tight">
                                                    {devUser.label}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-sm text-white/20 group-hover/item:text-primary transition-colors">login</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <p className="text-white/40 text-[11px] font-black uppercase tracking-widest">
                            ¿Necesitas unirte?
                            <a className="text-primary font-black hover:text-white ml-2 transition-colors" href="/register">SOLICITAR ACCESO</a>
                        </p>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
                .h-15 { height: 3.75rem; }
            `}</style>
        </div>
    );
}
