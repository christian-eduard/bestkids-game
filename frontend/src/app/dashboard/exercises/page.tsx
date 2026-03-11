"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { GamificationService, GamificationProfile } from "@/services/gamification.service";

interface Subject {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    colorHex?: string;
}

interface Exercise {
    id: number;
    title: string;
    description?: string;
    points: number;
    estimatedTimeMinutes?: number;
    difficultyLevel?: string;
}

export default function ExercisesPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exercisesLoading, setExercisesLoading] = useState(false);
    const [profile, setProfile] = useState<GamificationProfile | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [subjectsRes, profileData] = await Promise.all([
                api.get("/exercises/subjects"),
                GamificationService.getProfile().catch(() => null)
            ]);
            setSubjects(subjectsRes.data);
            setProfile(profileData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExercises = async (subjectId: number) => {
        setSelectedSubject(subjectId);
        setExercisesLoading(true);
        try {
            const res = await api.get(`/exercises/subject/${subjectId}`);
            setExercises(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setExercisesLoading(false);
        }
    };

    // Material Symbols icon based on subject name
    const getSubjectIcon = (name: string): string => {
        const iconMap: Record<string, string> = {
            'Mathematics': 'calculate',
            'Matemáticas': 'calculate',
            'Language': 'menu_book',
            'Lengua': 'menu_book',
            'Lenguaje': 'menu_book',
            'Science': 'science',
            'Ciencias': 'science',
            'Natural Sciences': 'eco',
            'Ciencias Naturales': 'eco',
            'Social Studies': 'public',
            'Estudios Sociales': 'public',
            'Sociales': 'public',
        };
        return iconMap[name] || 'school';
    };

    // Gradients for card backgrounds (like avatar store)
    const getGradient = (index: number) => {
        const gradients = [
            'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
            'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
            'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
            'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
        ];
        return gradients[index % gradients.length];
    };

    // Icon color based on subject
    const getIconColor = (name: string): string => {
        const colorMap: Record<string, string> = {
            'Mathematics': 'text-emerald-600',
            'Matemáticas': 'text-emerald-600',
            'Language': 'text-violet-600',
            'Lengua': 'text-violet-600',
            'Lenguaje': 'text-violet-600',
            'Science': 'text-cyan-600',
            'Ciencias': 'text-cyan-600',
            'Natural Sciences': 'text-green-600',
            'Ciencias Naturales': 'text-green-600',
            'Social Studies': 'text-amber-600',
            'Estudios Sociales': 'text-amber-600',
            'Sociales': 'text-amber-600',
        };
        return colorMap[name] || 'text-primary';
    };

    const getDifficultyBadge = (level?: string) => {
        switch (level?.toLowerCase()) {
            case 'easy':
            case 'fácil':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'medium':
            case 'medio':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'hard':
            case 'difícil':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-8 p-4 sm:p-6 lg:p-8">
            {/* Page Heading & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => router.back()}
                        className="w-fit flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-1"
                    >
                        <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                        Volver al Inicio
                    </button>
                    <h1 className="text-[#1c0d1c] dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.03em] drop-shadow-sm">
                        EJERCICIOS
                    </h1>
                    <p className="text-[#9c499c] dark:text-[#dcb5dc] text-lg font-medium">
                        Elige una materia y empieza a ganar puntos
                    </p>
                </div>

                {/* XP Badge */}
                {profile && (
                    <div className="flex items-center self-start md:self-end bg-white dark:bg-[#321a32] p-2 pr-6 rounded-full shadow-lg shadow-purple-100 dark:shadow-none border border-purple-100 dark:border-purple-900/30">
                        <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-inner mr-3">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tu XP</span>
                            <span className="text-xl font-black text-[#1c0d1c] dark:text-white leading-none">{profile.totalPoints?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Subject Filter Tabs */}
            <div className="flex gap-3 flex-wrap items-center">
                <button
                    onClick={() => {
                        setSelectedSubject(null);
                        setExercises([]);
                    }}
                    className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${selectedSubject === null
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                        }`}
                >
                    <span className="text-sm font-bold">Todas las Materias</span>
                </button>
                {subjects.map(subject => (
                    <button
                        key={subject.id}
                        onClick={() => fetchExercises(subject.id)}
                        className={`group flex h-10 items-center justify-center gap-x-2 rounded-full px-6 transition-all hover:scale-105 active:scale-95 ${selectedSubject === subject.id
                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                            : 'bg-white dark:bg-[#321a32] text-[#1c0d1c] dark:text-white shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-lg ${selectedSubject === subject.id ? 'text-white' : getIconColor(subject.name)}`}>
                            {getSubjectIcon(subject.name)}
                        </span>
                        <span className="text-sm font-bold">{subject.name}</span>
                    </button>
                ))}
            </div>

            {/* Subject Cards (when no subject selected) */}
            {selectedSubject === null && (
                <div id="exercises-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjects.map((subject, index) => (
                        <div
                            key={subject.id}
                            onClick={() => fetchExercises(subject.id)}
                            className="group relative flex flex-col bg-white dark:bg-[#321a32] rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 cursor-pointer"
                        >
                            {/* Icon Container */}
                            <div className={`aspect-square w-full rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center mb-4 overflow-hidden relative`}>
                                <span className={`material-symbols-outlined text-7xl ${getIconColor(subject.name)} transform group-hover:scale-110 transition-transform duration-300`}>
                                    {getSubjectIcon(subject.name)}
                                </span>
                            </div>

                            {/* Subject Info */}
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-[#1c0d1c] dark:text-white leading-tight">{subject.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    {subject.description || "Explora los ejercicios"}
                                </p>
                                <button className="mt-auto w-full h-10 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Empezar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Exercises List (when subject is selected) */}
            {selectedSubject !== null && (
                <div>
                    {exercisesLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : exercises.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exercises.map((exercise, index) => (
                                <Link key={exercise.id} href={`/dashboard/exercises/${exercise.id}`}>
                                    <div className="group relative flex flex-col bg-white dark:bg-[#321a32] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 cursor-pointer h-full">
                                        {/* Exercise Number Badge */}
                                        <div className="absolute top-4 right-4 z-10 bg-primary text-white text-xs font-bold size-8 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>

                                        {/* Difficulty Badge */}
                                        {exercise.difficultyLevel && (
                                            <div className={`absolute top-4 left-4 z-10 text-xs font-bold px-2 py-1 rounded-full border ${getDifficultyBadge(exercise.difficultyLevel)}`}>
                                                {exercise.difficultyLevel}
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-[#1c0d1c] dark:text-white leading-tight mt-8 mb-2 pr-10">
                                            {exercise.title}
                                        </h3>

                                        {/* Description */}
                                        {exercise.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                                {exercise.description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex gap-3 mt-auto mb-4">
                                            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold">
                                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                {exercise.points} XP
                                            </div>
                                            {exercise.estimatedTimeMinutes && (
                                                <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-bold">
                                                    <span className="material-symbols-outlined text-base">schedule</span>
                                                    {exercise.estimatedTimeMinutes} min
                                                </div>
                                            )}
                                        </div>

                                        {/* Play Button */}
                                        <button className="w-full h-10 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-transform group-hover:scale-[1.02] active:scale-95">
                                            <span className="material-symbols-outlined text-lg">play_arrow</span>
                                            Jugar
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#321a32] rounded-2xl p-12 text-center border border-purple-100 dark:border-purple-900/30">
                            <div className="size-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1c0d1c] dark:text-white mb-2">No hay ejercicios</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Todavía no hay ejercicios disponibles en esta materia. ¡Pronto añadiremos más!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
