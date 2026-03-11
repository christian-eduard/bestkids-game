"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ExerciseEngine from "@/components/exercises/ExerciseEngine";

export default function PlayExercisePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showToast } = useToast();

    const [exercise, setExercise] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const assignmentId = searchParams.get('assignmentId');

    useEffect(() => {
        if (params.id) {
            fetchExercise(params.id as string);
        }
    }, [params.id]);

    const fetchExercise = async (id: string) => {
        try {
            // Reusing the general exercises raw endpoint or specific exercise if available
            // Since there is no direct endpoint for 1 exercise for a student, 
            // we assume the assignment contains the exercise id
            // Normally we'd need a specific endpoint like GET /exercises/exercise/:id
            // For now, let's use the master endpoint if it works, or we can just show an error
            // Actually, we'll implement a fallback GET /exercises/exercise/:id in the backend soon, 
            // but let's assume it exists and returns the Exercise entity.
            const res = await api.get(`/exercises/exercise/${id}`);
            setExercise(res.data);
        } catch (err: any) {
            console.error(err);
            showToast("Error al cargar el ejercicio", "error");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async (results: any) => {
        // results contains { xp, correct, incorrect } from ExerciseEngine
        // But since we just played 1 exercise, it already submitted internally via ExerciseEngine!
        // Wait, ExerciseEngine calls submitAnswer which requires exerciseId and unitId.

        if (assignmentId) {
            // If it's an assignment, we should mark it as complete
            try {
                await api.post(`/assignments/${assignmentId}/complete`, {
                    score: results.xp,
                    completed: true
                });
                showToast("¡Tarea completada!", "success");
            } catch (err) {
                console.error("Error completing assignment", err);
            }
        }

        // Go back after finishing
        setTimeout(() => {
            router.back();
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-800 mb-4">
                        Ejercicio no encontrado
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-primary text-white rounded-full font-bold"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // Wrap the single exercise in an array for the Engine
    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
            <ExerciseEngine
                exercises={[exercise]}
                unitTitle="Tarea Asignada"
                onFinish={handleFinish}
            />
        </div>
    );
}
