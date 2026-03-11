"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<'student' | 'parent'>('student');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("¡Las contraseñas no coinciden! Revísalas 🔍");
            return;
        }

        if (formData.password.length < 6) {
            setError("¡La contraseña debe tener al menos 6 caracteres! 🔐");
            return;
        }

        setLoading(true);

        try {
            // IDs based on Seeder: Student = 5, Parent = 4
            const roleId = role === 'student' ? 5 : 4;

            await api.post("/users", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                roleId: roleId,
            });

            router.push("/login?registered=true");
        } catch (err: any) {
            console.error(err);
            setError("¡Ups! Algo salió mal. ¿Ya tienes una cuenta? 🤔");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-2 md:p-4 overflow-auto">
            <main className="w-full max-w-[520px] perspective-1000 relative z-10 my-auto">
                <div className="bg-card-light dark:bg-card-dark rounded-[2rem] md:rounded-[2.5rem] shadow-soft p-5 md:p-8 border border-white/50 dark:border-white/5 relative z-10 transition-all duration-300 hover:shadow-glow">

                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium text-sm group"
                        >
                            <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </span>
                            Volver
                        </Link>

                        <div className="flex flex-col items-end">
                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center rotate-3 transform mb-1">
                                <span className="material-symbols-outlined text-primary !text-[24px]">rocket_launch</span>
                            </div>
                            <h2 className="text-text-main dark:text-white text-xl font-black">BestKids</h2>
                        </div>
                    </div>

                    {/* Greeting */}
                    <div className="text-center mb-4">
                        <h1 className="text-text-main dark:text-white text-xl font-bold mb-1">¡Crea tu cuenta!</h1>
                        <p className="text-text-muted dark:text-gray-400 text-sm">Únete a la aventura de aprender</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex justify-center gap-3 mb-5">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${role === 'student' ? 'border-primary bg-primary/5 shadow-md scale-105' : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'}`}
                        >
                            <div className={`size-10 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'student' ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700 grayscale'}`}>🎓</div>
                            <span className={`text-xs font-bold ${role === 'student' ? 'text-primary' : 'text-text-muted'}`}>Estudiante</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('parent')}
                            className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${role === 'parent' ? 'border-secondary bg-secondary/5 shadow-md scale-105' : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'}`}
                        >
                            <div className={`size-10 rounded-full flex items-center justify-center text-xl transition-colors ${role === 'parent' ? 'bg-secondary/20 text-secondary' : 'bg-gray-200 dark:bg-gray-700 grayscale'}`}>👨‍👩‍👧‍👦</div>
                            <span className={`text-xs font-bold ${role === 'parent' ? 'text-secondary' : 'text-text-muted'}`}>Familiar</span>
                        </button>
                    </div>

                    {/* Register Form */}
                    <form className="flex flex-col gap-3" onSubmit={handleRegister}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="group">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer w-full h-12 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-11 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300 text-sm"
                                        name="firstName"
                                        placeholder="Nombre"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300 text-[20px]">badge</span>
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="group">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer w-full h-12 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-11 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300 text-sm"
                                        name="lastName"
                                        placeholder="Apellido"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300 text-[20px]">badge</span>
                                </div>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="group">
                            <div className="relative flex items-center">
                                <input
                                    className="peer w-full h-14 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-12 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300"
                                    name="username"
                                    placeholder="Nombre de usuario"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300">person</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <div className="relative flex items-center">
                                <input
                                    className="peer w-full h-14 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-12 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300">mail</span>
                            </div>
                        </div>

                        {/* Password & Confirm */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer w-full h-12 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-11 pr-10 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300 text-sm"
                                        name="password"
                                        placeholder="Contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300 text-[20px]">lock</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-text-muted hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="group">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer w-full h-12 bg-background-light dark:bg-background-dark/50 border-2 border-transparent focus:border-primary rounded-full px-5 pl-11 pr-10 text-text-main dark:text-white placeholder:text-text-muted/70 font-medium focus:outline-none focus:ring-0 transition-all duration-300 text-sm"
                                        name="confirmPassword"
                                        placeholder="Confirmar"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted peer-focus:text-primary transition-colors duration-300 text-[20px]">lock_reset</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-text-muted hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <button
                            className="mt-4 w-full h-14 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>Crear Cuenta</span>
                            )}
                            {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                        </button>
                    </form>

                    {/* Footer / Login Link */}
                    <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-text-muted dark:text-gray-400 text-sm">
                            ¿Ya tienes cuenta?
                            <Link className="text-primary font-bold hover:underline ml-1" href="/login">Inicia sesión aquí</Link>
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
