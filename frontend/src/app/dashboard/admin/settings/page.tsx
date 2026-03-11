"use client";

import { useState } from "react";
import {
    Settings, Gamepad2, Shield, Database, Bell, Palette, Save,
    Loader2, Mail, Bot, Link as LinkIcon, Globe, Lock,
    Cloud, Server, Cpu, Layers, AppWindow, HardDrive,
    Info, CheckCircle2, AlertCircle, RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { showToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Branding State
    const [brandColor, setBrandColor] = useState("#6366f1");
    const [secondaryColor, setSecondaryColor] = useState("#4f46e5");
    const [logoUrl, setLogoUrl] = useState("https://bestkids.com/logo.png");
    const [fontFamily, setFontFamily] = useState("Inter");

    const handleSave = async () => {
        setSaving(true);
        // Simulating API persistence
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast("Configuración global sincronizada correctamente", "success");
        setSaving(false);
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Enterprise Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest">
                            Control Maestro
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">NÚCLEO DEL SISTEMA</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Settings className="w-10 h-10 text-indigo-600" />
                        Ajustes del Sistema
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                        Gestiona la identidad visual, integraciones de IA y servicios de infraestructura.
                    </p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
                >
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    <span className="text-lg">GUARDAR CONFIGURACIÓN</span>
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mb-10 overflow-hidden shadow-sm">
                    <TabsTrigger value="general" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <AppWindow className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <Palette className="w-4 h-4 mr-2" /> Branding
                    </TabsTrigger>
                    <TabsTrigger value="mail" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <Mail className="w-4 h-4 mr-2" /> Correo
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <Bot className="w-4 h-4 mr-2" /> IA / Engine
                    </TabsTrigger>
                    <TabsTrigger value="gamification" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <Gamepad2 className="w-4 h-4 mr-2" /> Gamificación
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <LinkIcon className="w-4 h-4 mr-2" /> Integraciones
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                        <Shield className="w-4 h-4 mr-2" /> Seguridad
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="md:col-span-2 rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-8 bg-white dark:bg-slate-900">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Información de la Aplicación</h3>
                                    <p className="text-slate-500 font-medium font-serif italic text-sm">Define la identidad básica de tu plataforma.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Nombre del Sistema</Label>
                                        <Input defaultValue="BestKids Game Master" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">URL del Sitio</Label>
                                        <Input defaultValue="https://bestkids-game.com" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-slate-800 dark:text-white" />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Descripción Meta (SEO)</Label>
                                        <Textarea defaultValue="La mejor plataforma de aprendizaje gamificado para niños en edad escolar." className="min-h-[100px] bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-medium" />
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm p-8 bg-white dark:bg-slate-900 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg">Mantenimiento</h4>
                                        <Switch />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium font-serif italic">Cuando está activo, solo los administradores pueden acceder al panel central.</p>
                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                                        <p className="text-xs text-orange-700 dark:text-orange-300 font-bold leading-tight uppercase tracking-tighter">Acción crítica para el acceso de usuarios.</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Branding / Personalización */}
                    <TabsContent value="branding" className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 shadow-sm p-10 bg-white dark:bg-slate-900 space-y-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white italic">Identidad Visual</h3>
                                    <p className="text-slate-500 font-medium">Personaliza los colores y logos para tu institución.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Color Primario</Label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="color"
                                                    value={brandColor}
                                                    onChange={(e) => setBrandColor(e.target.value)}
                                                    className="w-14 h-14 rounded-2xl cursor-pointer border-none p-0 overflow-hidden"
                                                />
                                                <Input
                                                    value={brandColor}
                                                    onChange={(e) => setBrandColor(e.target.value)}
                                                    className="h-14 font-mono bg-slate-50 dark:bg-slate-800 border-none rounded-2xl flex-1 text-center font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Color Secundario</Label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="color"
                                                    value={secondaryColor}
                                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                                    className="w-14 h-14 rounded-2xl cursor-pointer border-none p-0 overflow-hidden"
                                                />
                                                <Input
                                                    value={secondaryColor}
                                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                                    className="h-14 font-mono bg-slate-50 dark:bg-slate-800 border-none rounded-2xl flex-1 text-center font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">URL del Logo (Formato SVG/PNG)</Label>
                                        <Input
                                            value={logoUrl}
                                            onChange={(e) => setLogoUrl(e.target.value)}
                                            className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-medium"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Tipografía del Sistema</Label>
                                        <select
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value)}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black px-4 outline-none appearance-none"
                                        >
                                            <option>Inter</option>
                                            <option>Roboto</option>
                                            <option>Outfit</option>
                                            <option>Montserrat</option>
                                        </select>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-10">
                                <Card className="rounded-[3rem] p-10 border-4 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-6 relative overflow-hidden">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
                                        <h4 className="font-black text-slate-400 uppercase tracking-widest text-xs">Previsualización en Vivo</h4>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 min-h-[300px] flex flex-col items-center justify-center space-y-6 transform hover:scale-[1.02] transition-transform duration-500">
                                        <div className="w-32 h-32 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 overflow-hidden shadow-inner">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="Logo Preview" className="max-w-[80%] max-h-[80%] object-contain" />
                                            ) : (
                                                <Layers className="w-12 h-12 text-slate-300" />
                                            )}
                                        </div>

                                        <div className="text-center space-y-2">
                                            <h5 className="text-xl font-black" style={{ color: brandColor, fontFamily }}>
                                                Bienvenido a su Institución
                                            </h5>
                                            <p className="text-sm font-medium text-slate-400 italic">
                                                Sistema de Gestión Gamificado
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button style={{ backgroundColor: brandColor, borderRadius: '1rem' }} className="font-black h-12 px-6">
                                                BOTÓN PRIMARIO
                                            </Button>
                                            <Button style={{ backgroundColor: secondaryColor, borderRadius: '1rem' }} className="font-black h-12 px-6">
                                                BOTÓN SECUNDARIO
                                            </Button>
                                        </div>

                                        <div className="absolute top-0 right-0 p-4">
                                            <CheckCircle2 className="w-8 h-8 opacity-10" style={{ color: brandColor }} />
                                        </div>
                                    </div>
                                </Card>

                                <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-indigo-200 dark:shadow-none">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5" />
                                        <h4 className="font-black uppercase tracking-widest text-xs">Nota de Estilización</h4>
                                    </div>
                                    <p className="text-indigo-100 text-sm font-medium leading-relaxed font-serif italic">
                                        "Los cambios de color afectan a los componentes interactivos principales, barras de navegación y acentos visuales de toda la plataforma."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Mail Settings */}
                    <TabsContent value="mail" className="space-y-6">
                        <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm p-10 bg-white dark:bg-slate-900 space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50 dark:border-slate-800">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Servidor de Correo (SMTP)</h3>
                                    <p className="text-slate-500 font-medium font-serif italic">Configura el motor para el envío de reportes a padres y alertas.</p>
                                </div>
                                <Button size="lg" variant="outline" className="rounded-2xl border-2 font-black h-14 px-8 text-indigo-600 flex items-center gap-2">
                                    <RefreshCcw className="w-5 h-5" /> PROBAR CONEXIÓN
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Host SMTP</Label>
                                    <Input placeholder="smtp.servidor.com" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Puerto</Label>
                                    <Input placeholder="587" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Cifrado</Label>
                                    <select className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black px-4 outline-none appearance-none">
                                        <option>TLS / STARTTLS</option>
                                        <option>SSL</option>
                                        <option>Ninguno</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Usuario / Email</Label>
                                    <Input placeholder="noreply@bestkids.com" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Contraseña</Label>
                                    <Input type="password" placeholder="********" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Nombre Remitente</Label>
                                    <Input placeholder="Equipo BestKids" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* AI Settings */}
                    <TabsContent value="ai" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="md:col-span-2 rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-sm p-10 bg-white dark:bg-slate-900 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Cpu className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Motor de Inteligencia Artificial</h3>
                                        <p className="text-slate-500 font-medium font-serif italic">Gestión de API Keys y parámetros de generación automática.</p>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Proveedor Principal</Label>
                                        <select className="w-full h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black px-4 outline-none">
                                            <option>OpenAI (GPT-4o)</option>
                                            <option>Google Gemini (v2.0 Flash)</option>
                                            <option>Anthropic (Claude 3.5)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">API Key del Proveedor</Label>
                                        <div className="relative">
                                            <Input type="password" defaultValue="sk-********************************" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-mono text-xs tracking-widest pl-6 pr-14" />
                                            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Temperatura (Creatividad)</Label>
                                            <Input type="number" step="0.1" defaultValue="0.7" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Tokens Máximos</Label>
                                            <Input type="number" defaultValue="2048" className="h-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black" />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl relative overflow-hidden group">
                                <Bot className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Info className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-black italic tracking-tighter">¿IA Educativa Segura?</h4>
                                    <p className="text-indigo-100 font-medium leading-relaxed font-serif italic text-sm">
                                        "Nuestro motor filtra automáticamente cualquier respuesta no apta para menores, garantizando un entorno educativo 100% controlado."
                                    </p>
                                    <div className="pt-4">
                                        <Button className="w-full h-14 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs">
                                            Ver logs de IA
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Placeholder for other tabs with consistent style */}
                    {["gamification", "integrations", "security"].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 gap-6">
                            <Layers className="w-20 h-20 text-slate-200 animate-pulse" />
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest italic">Módulo en Desarrollo</h3>
                                <p className="text-slate-400 font-semibold mt-2 italic font-serif">Integrando parámetros avanzados para esta sección nucleo...</p>
                            </div>
                        </div>
                    )}
                </div>
            </Tabs>

            {/* Support Master Status */}
            <div className="bg-slate-900 dark:bg-indigo-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border-t-8 border-indigo-500 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border-4 border-indigo-500/30">
                        <HardDrive className="w-10 h-10 text-indigo-300" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black italic tracking-tighter">Estado de Infraestructura PROD</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                            <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Sistemas Operativos 100% Alta Disponibilidad</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 text-white font-black hover:bg-white/10 italic">EXPORTAR DATA MASTER</Button>
                    <Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-200 uppercase tracking-widest">Soporte TI</Button>
                </div>
            </div>
        </div>
    );
}
