"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExerciseEngine from '@/components/exercises/ExerciseEngine';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function ExerciseSessionPage() {
    const params = useParams();
    const router = useRouter();
    const [unit, setUnit] = useState<any>(null);
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.unitId) {
            fetchData();
        }
    }, [params.unitId]);

    const fetchData = async () => {
        try {
            // Usamos el nuevo endpoint que calcula dificultad adaptativa
            const res = await api.get(`/exercises/unit/${params.unitId}`);
            setExercises(res.data.exercises);

            // También necesitamos el título de la unidad para el summary
            const unitRes = await api.get(`/worlds/levels/${params.unitId}`);
            setUnit(unitRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = (results: any) => {
        // Redirigir de vuelta al mundo
        router.push('/dashboard/worlds');
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-crema gap-6">
                <div className="relative">
                    <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl animate-bounce">🚀</span>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-purple-800 animate-pulse italic">PREPARANDO TU AVENTURA...</h2>
            </div>
        );
    }

    if (!exercises || exercises.length === 0) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-crema text-center p-12">
                <span className="text-8xl mb-8">😴</span>
                <h2 className="text-4xl font-black text-gray-700">Esta unidad no tiene ejercicios todavía</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-8 px-12 py-4 bg-purple-600 text-white rounded-3xl font-bold shadow-lg"
                >
                    VOLVER
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-crema">
            <ExerciseEngine
                exercises={exercises}
                unitTitle={unit?.name || "Unidad"}
                onFinish={handleFinish}
            />
        </div>
    );
}
