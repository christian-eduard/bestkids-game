"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExerciseService, Exercise } from '@/services/exercises.service';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';

export default function UnitPage({ params: paramsPromise }: { params: Promise<{ worldId: string; unitId: string }> }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExercises = async () => {
            try {
                // Adaptive difficulty is handled by the backend automatically
                const data = await ExerciseService.getExercisesByUnit(params.unitId);
                setExercises(data.exercises || []);
            } catch (err) {
                console.error("Error loading exercises", err);
            } finally {
                setLoading(false);
            }
        };
        loadExercises();
    }, [params.unitId]);

    const handleFinish = (results: any) => {
        // Redirect back to the world map after finishing
        router.push(`/dashboard/worlds/${params.worldId}`);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="animate-bounce size-12 bg-primary rounded-full shadow-lg" />
        </div>
    );

    if (exercises.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-black text-gray-400 mb-6 uppercase">No hay ejercicios disponibles</h2>
                <button
                    onClick={() => router.back()}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg"
                >
                    VOLVER
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <ExerciseEngine
                exercises={exercises}
                unitTitle="Nivel de Juego"
                onFinish={handleFinish}
            />
        </div>
    );
}
