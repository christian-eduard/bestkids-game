"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import {
    Building2, Plus, Search, Edit2, Trash2, X, MapPin, Phone, User,
    Shield, Globe, Briefcase, ChevronRight, MoreVertical,
    BarChart3, Users, Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/AuthContext";

// Types
interface Center {
    id: number;
    name: string;
    code: string;
    address?: string;
    city?: string;
    phone?: string;
    directorName?: string;
    isActive: boolean;
}

export default function CentersManagementPage() {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState<Center | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: "",
        city: "",
        phone: "",
        directorName: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/centers");
            let data = res.data;

            // Filter for Center Admin (Role 2)
            if (user?.roleId === 2 && user.centerId) {
                data = data.filter((c: Center) => c.id === user.centerId);
            }

            setCenters(data);
        } catch (err) {
            console.error(err);
            showToast("Error al cargar centros", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingCenter(null);
        setFormData({
            name: "",
            code: "",
            address: "",
            city: "",
            phone: "",
            directorName: "",
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (center: Center) => {
        setEditingCenter(center);
        setFormData({
            name: center.name,
            code: center.code,
            address: center.address || "",
            city: center.city || "",
            phone: center.phone || "",
            directorName: center.directorName || "",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCenter) {
                await api.put(`/admin/centers/${editingCenter.id}`, formData);
                showToast("Centro actualizado correctamente", "success");
            } else {
                await api.post("/admin/centers", formData);
                showToast("Centro registrado con éxito", "success");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            showToast("Error al guardar el centro", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este centro permanentemente?")) return;
        try {
            await api.delete(`/admin/centers/${id}`);
            setCenters(centers.filter(c => c.id !== id));
            showToast("Centro eliminado", "success");
        } catch (err) {
            console.error(err);
            showToast("Error al eliminar", "error");
        }
    };

    const filteredCenters = centers.filter(center =>
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Metrics for the dashboard
    const metrics = [
        { label: "Total Centros", value: centers.length, icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Activos", value: centers.filter(c => c.isActive).length, icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Ciudades", value: new Set(centers.map(c => c.city)).size, icon: Globe, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Enterprise Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest">
                            Directorio Global
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">v2.4 Enterprise</span>
                    </div>
                    <h1 id="centers-title" className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Building2 className="w-10 h-10 text-orange-500" />
                        Gestión de Centros
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
                        Administración centralizada de instituciones educativas y sus directivas.
                    </p>
                </div>

                {user?.roleId === 1 && (
                    <Button
                        id="new-center-btn"
                        onClick={handleOpenCreate}
                        className="h-16 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-2xl shadow-orange-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="text-lg">REGISTRAR CENTRO</span>
                    </Button>
                )}
            </div>

            {/* Micro Metrics Rejection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", m.bg)}>
                            <m.icon className={cn("w-7 h-7", m.color)} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Bulk Actions */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Filtrar por nombre, código o director..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-bold text-slate-700 dark:text-slate-200 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 font-black text-slate-500 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" /> REPORTE
                    </Button>
                </div>
            </div>

            {/* Main Grid/List View */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredCenters.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">Sin resultados coincidentes</h3>
                        <p className="text-slate-500 mt-2">Prueba con términos de búsqueda diferentes.</p>
                    </div>
                ) : (
                    filteredCenters.map((center) => (
                        <div key={center.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            {/* Decorative background logo */}
                            <Building2 className="absolute -bottom-10 -right-10 w-40 h-40 text-slate-50 dark:text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-700" />

                            <div className="relative z-10 flex items-start justify-between">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-orange-50 dark:ring-orange-900/20">
                                        {center.name.charAt(0)}
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none group-hover:text-orange-600 transition-colors">
                                                {center.name}
                                            </h3>
                                            <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 mt-2 inline-block">ID: {center.code}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <User className="w-4 h-4 text-orange-400" />
                                                <span className="truncate">{center.directorName || "Sin director asignado"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <MapPin className="w-4 h-4 text-orange-400" />
                                                <span>{center.city || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Phone className="w-4 h-4 text-orange-400" />
                                                <span>{center.phone || "-"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <div className={cn("w-2 h-2 rounded-full animate-pulse", center.isActive ? "bg-emerald-500" : "bg-rose-500")} />
                                                <span className="font-bold uppercase text-[10px] tracking-widest">{center.isActive ? "Activo" : "Inactivo"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(center)}
                                        className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-2xl transition-all shadow-sm active:scale-90"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    {user?.roleId === 1 && (
                                        <button
                                            onClick={() => handleDelete(center.id)}
                                            className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-2xl transition-all shadow-sm active:scale-90"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 border-t border-slate-50 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-orange-500 transition-colors">
                                Ver Detalles del Centro <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Enterprise Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 border-4 border-white dark:border-slate-800 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden dialog-content-enterprise">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-10 text-white shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black tracking-tight">{editingCenter ? "MODIFICAR ENTIDAD" : "NUEVA ALTA DE CENTRO"}</DialogTitle>
                            <DialogDescription className="text-orange-100 font-medium text-lg mt-2 italic">
                                Asegúrate de que los datos de contacto sean precisos para la facturación y soporte.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Briefcase className="w-3 h-3" /> INFORMACIÓN INSTITUCIONAL
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Nombre de la Institución</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ej: Academy Global Kids"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Código Identificador (ID)</Label>
                                    <Input
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-mono font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="BC-001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Director a Cargo</Label>
                                    <Input
                                        value={formData.directorName}
                                        onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="Nombre Completo"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> LOCALIZACIÓN Y CONTACTO
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Teléfono Corporativo</Label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="+34 000 000 000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Ciudad / Provincia</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ej: Madrid"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold text-xs text-slate-600 px-1 italic">Dirección Física Completa</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-orange-500"
                                        placeholder="Calle, número, CP..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                className="h-14 flex-1 rounded-2xl font-black text-slate-400"
                            >
                                CANCELAR
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="h-14 flex-[2] bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {submitting && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {editingCenter ? "ACTUALIZAR DATOS" : "CONFIRMAR REGISTRO"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
