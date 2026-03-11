'use client';

import { AlertCircle, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentRtiCardProps {
    student: {
        id: number;
        firstName: string;
        lastName: string;
        rtiLevel: 'UNIVERSAL' | 'SELECTIVE' | 'INTENSIVE';
        rtiScore?: number;
        totalPoints: number;
        lastActivityAt: string | null;
        avatarId?: number;
    };
    onClick: (studentId: number) => void;
}

const RTI_CONFIG = {
    UNIVERSAL: {
        bg: 'bg-green-50 hover:bg-green-100',
        border: 'border-green-500',
        text: 'text-green-900',
        badge: 'bg-green-500',
        label: '🟢 Universal',
        range: '70-100%'
    },
    SELECTIVE: {
        bg: 'bg-yellow-50 hover:bg-yellow-100',
        border: 'border-yellow-500',
        text: 'text-yellow-900',
        badge: 'bg-yellow-500',
        label: '🟡 Selectivo',
        range: '40-69%'
    },
    INTENSIVE: {
        bg: 'bg-red-50 hover:bg-red-100',
        border: 'border-red-500',
        text: 'text-red-900',
        badge: 'bg-red-500',
        label: '🔴 Intensivo',
        range: '0-39%'
    }
};

export default function StudentRtiCard({ student, onClick }: StudentRtiCardProps) {
    const config = RTI_CONFIG[student.rtiLevel];

    // Check if inactive (>3 days)
    const isInactive = student.lastActivityAt
        ? (Date.now() - new Date(student.lastActivityAt).getTime()) > (3 * 24 * 60 * 60 * 1000)
        : true;

    // Get initials
    const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();

    // Format last activity
    const formatLastActivity = (date: string | null) => {
        if (!date) return 'Sin actividad';
        const days = Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000));
        if (days === 0) return 'Hoy';
        if (days === 1) return 'Ayer';
        return `Hace ${days} días`;
    };

    return (
        <div
            onClick={() => onClick(student.id)}
            className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                config.bg,
                config.border
            )}
        >
            {/* Alert badge if inactive */}
            {isInactive && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                </div>
            )}

            {/* Avatar */}
            <div className="flex items-start gap-3 mb-3">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md",
                    config.badge
                )}>
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className={cn("font-bold text-sm truncate", config.text)}>
                        {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">
                        {config.label}
                    </p>
                </div>
            </div>

            {/* Score */}
            {student.rtiScore !== undefined && (
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Rendimiento</span>
                        <span className="font-bold">{student.rtiScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={cn("h-2 rounded-full transition-all", config.badge)}
                            style={{ width: `${student.rtiScore}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Puntos</p>
                    <p className={cn("font-bold text-sm", config.text)}>{student.totalPoints}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Actividad</p>
                    <p className={cn(
                        "font-medium text-xs",
                        isInactive ? "text-red-600" : "text-gray-700"
                    )}>
                        {formatLastActivity(student.lastActivityAt)}
                    </p>
                </div>
            </div>

            {/* Trend indicator */}
            <div className="absolute bottom-2 right-2">
                {student.rtiLevel === 'UNIVERSAL' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {student.rtiLevel === 'INTENSIVE' && <TrendingDown className="w-4 h-4 text-red-600" />}
            </div>
        </div>
    );
}
