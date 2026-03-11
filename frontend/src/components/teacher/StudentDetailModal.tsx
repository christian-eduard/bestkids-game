'use client';

import { X, User, TrendingUp, BookOpen, Target, Calendar, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentDetailModalProps {
    student: {
        id: number;
        firstName: string;
        lastName: string;
        email?: string;
        rtiLevel: 'UNIVERSAL' | 'SELECTIVE' | 'INTENSIVE';
        rtiScore?: number;
        totalPoints: number;
        currentLevel: number;
        exercisesCompleted: number;
        lastActivityAt: string | null;
        accuracyPercentage?: number;
    } | null;
    onClose: () => void;
}

const RTI_INTERVENTION_PLANS = {
    UNIVERSAL: {
        title: 'Plan Universal',
        description: 'El estudiante muestra un rendimiento adecuado. Continuar con el plan regular.',
        recommendations: [
            'Mantener motivación con retos progresivos',
            'Fomentar autonomía en el aprendizaje',
            'Celebrar logros y progreso constante'
        ]
    },
    SELECTIVE: {
        title: 'Plan Selectivo',
        description: 'Requiere intervención suplementaria en grupos pequeños.',
        recommendations: [
            'Asignar ejercicios de refuerzo específicos',
            'Monitoreo semanal del progreso',
            'Sesiones grupales 2-3 veces por semana',
            'Comunicación frecuente con padres'
        ]
    },
    INTENSIVE: {
        title: 'Plan Intensivo',
        description: 'Necesita intervención individualizada inmediata.',
        recommendations: [
            '⚠️ Evaluación diagnóstica completa',
            'Plan de intervención personalizado',
            'Sesiones individuales diarias',
            'Contacto inmediato con familia',
            'Posible derivación a especialista'
        ]
    }
};

export default function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
    if (!student) return null;

    const interventionPlan = RTI_INTERVENTION_PLANS[student.rtiLevel];

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark p-6 rounded-t-2xl flex items-start justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{student.firstName} {student.lastName}</h2>
                            <p className="text-white/80 text-sm font-medium">{student.email || 'Sin email'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* RtI Level Badge */}
                    <div className={cn(
                        "p-5 rounded-3xl border-4",
                        student.rtiLevel === 'UNIVERSAL' && "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
                        student.rtiLevel === 'SELECTIVE' && "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
                        student.rtiLevel === 'INTENSIVE' && "bg-destructive/10 border-destructive/20 text-destructive"
                    )}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-black text-xl uppercase tracking-wider">
                                {student.rtiLevel === 'UNIVERSAL' && 'Nivel Universal'}
                                {student.rtiLevel === 'SELECTIVE' && 'Nivel Selectivo'}
                                {student.rtiLevel === 'INTENSIVE' && 'Nivel Intensivo'}
                            </h3>
                            {student.rtiScore !== undefined && (
                                <span className="text-3xl font-black">{student.rtiScore}%</span>
                            )}
                        </div>
                        {student.rtiScore !== undefined && (
                            <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-4">
                                <div
                                    className={cn(
                                        "h-4 rounded-full transition-all duration-700",
                                        student.rtiLevel === 'UNIVERSAL' && "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]",
                                        student.rtiLevel === 'SELECTIVE' && "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
                                        student.rtiLevel === 'INTENSIVE' && "bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                    )}
                                    style={{ width: `${student.rtiScore}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={TrendingUp} label="Nivel Actual" value={student.currentLevel.toString()} />
                        <StatCard icon={BookOpen} label="Ejercicios" value={student.exercisesCompleted.toString()} />
                        <StatCard icon={Target} label="Puntos" value={student.totalPoints.toString()} />
                        <StatCard
                            icon={Calendar}
                            label="Última Act."
                            value={student.lastActivityAt ? new Date(student.lastActivityAt).toLocaleDateString() : 'N/A'}
                        />
                    </div>

                    {/* Intervention Plan */}
                    <div className="bg-muted p-6 rounded-3xl border border-border">
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                            <span>📋</span> {interventionPlan.title}
                        </h3>
                        <p className="text-foreground/80 mb-6 font-medium leading-relaxed">{interventionPlan.description}</p>
                        <div className="space-y-3">
                            <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Recomendaciones del experto:</p>
                            <ul className="space-y-3">
                                {interventionPlan.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm font-bold text-foreground flex items-start gap-3">
                                        <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                        <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-2xl font-black transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Asignar Tarea
                        </button>
                        <button className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-4 px-6 rounded-2xl font-black transition-all hover:scale-[1.02] border-2 border-border flex items-center justify-center gap-2">
                            <Mail className="w-5 h-5" />
                            Contactar Familia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="bg-muted p-5 rounded-2xl text-center border border-border/10">
            <Icon className="w-6 h-6 mx-auto mb-3 text-primary opacity-80" />
            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">{label}</p>
            <p className="font-black text-xl text-foreground">{value}</p>
        </div>
    );
}
