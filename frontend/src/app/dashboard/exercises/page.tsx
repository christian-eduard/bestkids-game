"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorldsService, World } from "@/services/worlds.service";
import { ExerciseService, Unit, Exercise, ExercisesResponse } from "@/services/exercises.service";
import { GamificationService, GamificationProfile } from "@/services/gamification.service";
import ExerciseEngine from "@/components/exercises/ExerciseEngine";

type ViewState = 'worlds' | 'units' | 'playing' | 'results';

export default function StudentExercisesPage() {
    const router = useRouter();

    // Data
    const [worlds, setWorlds] = useState<World[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [exercisesResponse, setExercisesResponse] = useState<ExercisesResponse | null>(null);
    const [profile, setProfile] = useState<GamificationProfile | null>(null);

    // Selection
    const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    // UI
    const [view, setView] = useState<ViewState>('worlds');
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<any>(null);

    // Init
    useEffect(() => {
        loadInitial();
    }, []);

    const loadInitial = async () => {
        try {
            const [worldsData, profileData] = await Promise.all([
                WorldsService.getWorlds(),
                GamificationService.getProfile().catch(() => null)
            ]);
            setWorlds(worldsData || []);
            setProfile(profileData);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const selectWorld = async (world: World) => {
        setSelectedWorld(world);
        setLoading(true);
        try {
            const data = await ExerciseService.getUnitsByWorld(world.id);
            setUnits(data || []);
            setView('units');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const selectUnit = async (unit: Unit) => {
        setSelectedUnit(unit);
        setLoading(true);
        try {
            const data = await ExerciseService.getExercisesByUnit(unit.id);
            setExercisesResponse(data);
            if (data.exercises.length > 0) {
                setView('playing');
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleFinish = (gameResults: any) => {
        setResults(gameResults);
        setView('results');
        // Refresh profile for XP updates
        GamificationService.getProfile().then(setProfile).catch(() => { });
    };

    const goBack = () => {
        if (view === 'results') { setView('worlds'); setSelectedUnit(null); setSelectedWorld(null); }
        else if (view === 'playing') { setView('units'); setSelectedUnit(null); }
        else if (view === 'units') { setView('worlds'); setSelectedWorld(null); }
        else { router.back(); }
    };

    const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

    // ═══════════════════════════════════════════════════════════════════════
    // Loading
    if (loading && view === 'worlds') {
        return (
            <div className="flex h-full items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    // Playing — full screen engine
    if (view === 'playing' && exercisesResponse) {
        return (
            <ExerciseEngine
                exercises={exercisesResponse.exercises}
                unitTitle={selectedUnit?.title || 'Ejercicios'}
                onFinish={handleFinish}
            />
        );
    }

    return (
        <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                <div className="flex flex-col gap-1">
                    <button onClick={goBack}
                        className="w-fit flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-1">
                        <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                        {view === 'units' ? 'Volver a Mundos' : 'Volver'}
                    </button>
                    <h1 className="text-[#1c0d1c] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                        {view === 'worlds' && 'Ejercicios'}
                        {view === 'units' && selectedWorld?.name}
                        {view === 'results' && 'Resultados'}
                    </h1>
                    <p className="text-[#9c499c] dark:text-[#dcb5dc] text-base font-medium">
                        {view === 'worlds' && 'Elige un mundo y empieza a aprender'}
                        {view === 'units' && `Selecciona una unidad para jugar`}
                        {view === 'results' && 'Has completado la unidad'}
                    </p>
                </div>

                {/* XP Badge */}
                {profile && (
                    <div className="flex items-center self-start md:self-end bg-white dark:bg-[#321a32] p-2 pr-5 rounded-full shadow-lg border border-purple-100 dark:border-purple-900/30">
                        <div className="size-9 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-2.5">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tu XP</span>
                            <span className="text-lg font-black text-[#1c0d1c] dark:text-white leading-none">{profile.totalPoints?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── WORLDS VIEW ──────────────────────────────────────── */}
            {view === 'worlds' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {worlds.length > 0 ? worlds.map(world => (
                        <div key={world.id} onClick={() => selectWorld(world)}
                            className="group relative flex flex-col bg-white dark:bg-[#321a32] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 cursor-pointer">
                            {/* World image */}
                            <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30">
                                {(world.backgroundImage || (world as any).backgroundImageUrl) ? (
                                    <img
                                        src={(() => { const url = world.backgroundImage || (world as any).backgroundImageUrl; return url.startsWith('/') ? `${API}${url}` : url; })()}
                                        alt={world.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-purple-300 dark:text-purple-700">{world.icon || 'public'}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-white/90 dark:bg-black/50 text-xs font-bold px-2 py-1 rounded-full text-primary backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-xs align-middle mr-0.5">school</span>
                                        Mundo
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-[#1c0d1c] dark:text-white">{world.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {world.description || 'Explora los ejercicios de este mundo'}
                                </p>
                                <button className="mt-3 w-full h-10 bg-primary hover:bg-fuchsia-600 text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Explorar
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full bg-white dark:bg-[#321a32] rounded-2xl p-12 text-center border border-purple-100 dark:border-purple-900/30">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">search_off</span>
                            <h3 className="text-xl font-bold text-gray-500 mb-1">No hay mundos disponibles</h3>
                            <p className="text-gray-400">Tu profesor todavia no ha creado ejercicios.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── UNITS VIEW ────────────────────────────────────── */}
            {view === 'units' && (
                <>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : units.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {units.filter(u => u.isActive).map((unit, idx) => {
                                const exerciseCount = unit.exercises?.length || 0;
                                return (
                                    <div key={unit.id} onClick={() => selectUnit(unit)}
                                        className="group flex flex-col bg-white dark:bg-[#321a32] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-100 dark:hover:border-purple-900 cursor-pointer">
                                        {/* Unit number */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-lg font-black">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-[#1c0d1c] dark:text-white leading-tight">{unit.title}</h3>
                                                {unit.description && (
                                                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{unit.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex gap-2 mb-3">
                                            <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-600 px-2 py-1 rounded-full">
                                                <span className="material-symbols-outlined text-xs align-middle mr-0.5">quiz</span>
                                                {exerciseCount} ejercicios
                                            </span>
                                            <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-2 py-1 rounded-full">
                                                <span className="material-symbols-outlined text-xs align-middle mr-0.5">signal_cellular_alt</span>
                                                Nivel {unit.difficulty}
                                            </span>
                                        </div>

                                        {/* Play button */}
                                        <button disabled={exerciseCount === 0}
                                            className="mt-auto w-full h-9 bg-primary hover:bg-fuchsia-600 text-white rounded-full font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                                            <span className="material-symbols-outlined text-lg">
                                                {exerciseCount > 0 ? 'play_arrow' : 'lock'}
                                            </span>
                                            {exerciseCount > 0 ? 'Jugar' : 'Sin ejercicios'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#321a32] rounded-2xl p-12 text-center border border-purple-100 dark:border-purple-900/30">
                            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">folder_off</span>
                            <h3 className="text-xl font-bold text-gray-500 mb-1">No hay unidades</h3>
                            <p className="text-gray-400">Este mundo todavia no tiene unidades con ejercicios.</p>
                        </div>
                    )}
                </>
            )}

            {/* ── RESULTS VIEW ─────────────────────────────────── */}
            {view === 'results' && results && (
                <div className="max-w-lg mx-auto w-full">
                    <div className="bg-white dark:bg-[#321a32] rounded-3xl p-8 text-center shadow-xl border border-purple-100 dark:border-purple-900/30">
                        <div className="size-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                        </div>
                        <h2 className="text-2xl font-black text-[#1c0d1c] dark:text-white mb-2">
                            Unidad completada
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {selectedUnit?.title}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                                <div className="text-2xl font-black text-green-600">{results.correct || 0}</div>
                                <div className="text-[10px] font-bold text-green-500 uppercase">Correctas</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
                                <div className="text-2xl font-black text-red-500">{results.incorrect || 0}</div>
                                <div className="text-[10px] font-bold text-red-400 uppercase">Falladas</div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
                                <div className="text-2xl font-black text-yellow-600">{results.xp || 0}</div>
                                <div className="text-[10px] font-bold text-yellow-500 uppercase">XP</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => { setView('units'); setSelectedUnit(null); }}
                                className="flex-1 h-11 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                Volver a Unidades
                            </button>
                            <button onClick={() => selectUnit(selectedUnit!)}
                                className="flex-1 h-11 bg-primary text-white rounded-xl font-bold text-sm hover:bg-fuchsia-600 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-lg">replay</span>
                                Repetir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
