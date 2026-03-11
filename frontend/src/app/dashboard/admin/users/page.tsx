"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import {
    Users, Plus, Search, Edit2, Trash2, X, Check, Shield,
    MoreHorizontal, Building2, UserCircle, Key, Mail,
    Briefcase, GraduationCap, UserPlus, Filter, Download
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roleId: number;
    centerId: number | null;
    isActive: boolean;
    createdAt: string;
}

interface Center {
    id: number;
    name: string;
}

const ROLES = [
    { id: 1, name: "Master Admin", color: "bg-rose-500/10 text-rose-600 border-rose-200", icon: Shield },
    { id: 2, name: "Admin Centro", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Building2 },
    { id: 3, name: "Profesor", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Briefcase },
    { id: 4, name: "Padre", color: "bg-purple-500/10 text-purple-600 border-purple-200", icon: UserCircle },
    { id: 5, name: "Estudiante", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: GraduationCap },
];

export default function UsersManagementPage() {
    const toast = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        roleId: 1,
        centerId: "" as string | number,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, centersRes] = await Promise.all([
                api.get("/users"),
                api.get("/admin/centers")
            ]);
            setUsers(usersRes.data);
            setCenters(centersRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            roleId: 1,
            centerId: "",
        });
        setShowModal(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: "",
            roleId: user.roleId,
            centerId: user.centerId || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                roleId: Number(formData.roleId),
                centerId: formData.centerId ? Number(formData.centerId) : null,
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (editingUser) {
                await api.patch(`/users/${editingUser.id}`, payload);
                toast.success("Usuario actualizado correctamente");
            } else {
                if (!payload.password) {
                    toast.error("La contraseña es obligatoria");
                    setSubmitting(false);
                    return;
                }
                await api.post("/users", payload);
                toast.success("Usuario creado correctamente");
            }

            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Error al guardar usuario");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            toast.success("Usuario eliminado");
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query);

        const matchesRole = roleFilter === "all" || user.roleId === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (roleId: number) => {
        const role = ROLES.find(r => r.id === roleId);
        if (!role) return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Guest</span>;
        const Icon = role.icon;
        return (
            <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit",
                role.color
            )}>
                <Icon className="w-3 h-3" />
                {role.name}
            </span>
        );
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Enterprise Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 id="users-title" className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Gestión de Usuarios
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                                <span>{users.length} usuarios registrados</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="text-blue-600 dark:text-blue-400">{filteredUsers.length} en la vista actual</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                    <button
                        id="new-user-btn"
                        onClick={handleOpenCreate}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <UserPlus className="w-5 h-5" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Administradores", count: users.filter(u => u.roleId <= 2).length, color: "bg-rose-500" },
                    { label: "Profesores", count: users.filter(u => u.roleId === 3).length, color: "bg-blue-500" },
                    { label: "Estudiantes", count: users.filter(u => u.roleId === 5).length, color: "bg-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.count}</p>
                        </div>
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center opacity-10", stat.color)} />
                    </div>
                ))}
            </div>

            {/* Advanced Filters */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Buscar por nombre, email, usuario..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400"
                        />
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-700 self-center hidden md:block" />
                    <div className="flex items-center px-4 gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer pr-8"
                        >
                            <option value="all">Cualquier Rol</option>
                            {ROLES.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Enterprise Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario & Perfil</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rol Sistema</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Institución / Centro</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Controles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6 h-20 bg-slate-50/20 dark:bg-slate-800/50" />
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full">
                                                <Users className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <p className="font-bold text-slate-400">No se encontraron resultados para tu búsqueda</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all duration-200">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-slate-700 dark:text-white font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                        {user.firstName.charAt(0)}
                                                    </div>
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800",
                                                        user.isActive ? "bg-emerald-500" : "bg-slate-300"
                                                    )} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-base leading-none mb-1">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-400">@{user.username}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                        <span className="text-xs font-medium text-slate-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {getRoleBadge(user.roleId)}
                                        </td>
                                        <td className="px-8 py-5">
                                            {user.centerId ? (
                                                <div className="flex flex-col">
                                                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 underline decoration-slate-200 dark:decoration-slate-600 underline-offset-4 decoration-2">
                                                        {centers.find(c => c.id === user.centerId)?.name || "N/A"}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                                                        <Building2 className="w-2.5 h-2.5" /> Entidad Vinculada
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-300 tracking-widest italic">SIN VINCULACIÓN</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                    title="Editar Perfil"
                                                >
                                                    <Edit2 className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                                    title="Eliminar Cuenta"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Enterprise Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1a0b1a] rounded-[2rem] w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border-4 border-white/10 flex flex-col dialog-content-enterprise">

                        {/* Modal Header */}
                        <div className="p-8 pb-6 flex items-start justify-between relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                                    {editingUser ? "Modificación de Perfil" : "Alta de Nuevo Usuario"}
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {editingUser ? formData.firstName + ' ' + formData.lastName : "Crear Expediente"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 bg-slate-100 dark:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-all hover:rotate-90 relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormField label="Nombre Pila" icon={UserCircle}>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="Ej: Miguel"
                                    />
                                </FormField>
                                <FormField label="Apellidos" icon={UserCircle}>
                                    <input
                                        required
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="Ej: García Pérez"
                                    />
                                </FormField>
                                <FormField label="Identificador (@)" icon={Mail}>
                                    <input
                                        required
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="miguel.garcia"
                                    />
                                </FormField>
                                <FormField label="Correo Corporativo" icon={Mail}>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none"
                                        placeholder="nombre@bestkids.com"
                                    />
                                </FormField>
                                <div className="md:col-span-2">
                                    <FormField label={editingUser ? "Actualizar Contraseña" : "Contraseña de Acceso"} icon={Key}>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none"
                                                placeholder={editingUser ? "Solo si desea cambiarla" : "Mínimo 8 caracteres"}
                                            />
                                        </div>
                                    </FormField>
                                </div>
                                <FormField label="Asignación de Rol" icon={Shield}>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none appearance-none"
                                    >
                                        {ROLES.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label="Sede / Centro" icon={Building2}>
                                    <select
                                        value={formData.centerId}
                                        onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl px-4 py-3 font-bold text-slate-700 dark:text-white focus:border-blue-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="">Sin Centro (Independiente)</option>
                                        {centers.map(center => (
                                            <option key={center.id} value={center.id}>{center.name}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </form>

                        {/* Modal Footer */}
                        <div className="p-8 pt-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 px-6 rounded-2xl font-black text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-[2] py-4 px-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {submitting && <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />}
                                {editingUser ? "ACTUALIZAR DATOS" : "REGISTRAR USUARIO"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FormField({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                <Icon className="w-3 h-3" />
                {label}
            </label>
            {children}
        </div>
    );
}
