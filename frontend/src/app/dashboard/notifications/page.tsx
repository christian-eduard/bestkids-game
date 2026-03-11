"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
    Bell, Check, Trash2, Filter, CheckCircle2,
    Inbox, Star, Zap, BookOpen, MessageCircle, AlertCircle, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    icon: string;
    isRead: boolean;
    createdAt: string;
}

const typeConfig: Record<string, { color: string, icon: any }> = {
    achievement: { color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30", icon: Star },
    level_up: { color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30", icon: Zap },
    streak: { color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30", icon: Zap },
    assignment: { color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30", icon: BookOpen },
    message: { color: "text-green-600 bg-green-100 dark:bg-green-900/30", icon: MessageCircle },
    reminder: { color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30", icon: AlertCircle },
    system: { color: "text-gray-600 bg-gray-100 dark:bg-gray-800", icon: Settings },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) { console.error(err); }
    };

    const markAllAsRead = async () => {
        try {
            await api.post("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) { console.error(err); }
    };

    const deleteNotification = async (id: number) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) { console.error(err); }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                        <Bell className="w-8 h-8 text-purple-600" /> Centro de Notificaciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gestiona tus avisos y novedades recientes.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead} className="gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Marcar todo leído
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="w-5 h-5" /> Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant={filter === 'all' ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setFilter('all')}
                        >
                            <Inbox className="w-4 h-4 mr-2" /> Todas
                            <span className="ml-auto bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {notifications.length}
                            </span>
                        </Button>
                        <Button
                            variant={filter === 'unread' ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setFilter('unread')}
                        >
                            <Bell className="w-4 h-4 mr-2" /> No leídas
                            {unreadCount > 0 && (
                                <span className="ml-auto bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications List */}
                <Card className="md:col-span-3 min-h-[500px]">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4" />
                                <p>Cargando notificaciones...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                    <Inbox className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Estás al día</h3>
                                <p className="text-sm">No tienes notificaciones en esta vista.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredNotifications.map((notif) => {
                                    const details = typeConfig[notif.type] || typeConfig.system;
                                    const Icon = details.icon;

                                    return (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-6 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 flex gap-4 group",
                                                !notif.isRead && "bg-blue-50/40 dark:bg-blue-900/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                                details.color
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <div className="flex-1 min-w-0 pt-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className={cn(
                                                            "font-semibold text-base",
                                                            !notif.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                        )}>
                                                            {notif.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notif.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => markAsRead(notif.id)}
                                                            className="text-blue-600 hover:text-blue-700 h-8 px-2"
                                                        >
                                                            <Check className="w-3 h-3 mr-1.5" /> Marcar leída
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteNotification(notif.id)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 px-2"
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1.5" /> Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
