"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PlacementTestPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Test de Nivel (En Construcción)</h1>
                <p className="mb-8">Esta función está siendo actualizada para usar el nuevo motor de ejercicios.</p>
                <Button onClick={() => router.push('/dashboard')}>
                    Volver al Dashboard
                </Button>
            </div>
        </div>
    );
}
