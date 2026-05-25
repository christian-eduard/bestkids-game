"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ChevronRight, Star, X, Trophy, ArrowRight, Volume2, Square, Home, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import Mechanics
import SeñalarImagen from './mechanics/SenalarImagen';
import OpcionMultiple from './mechanics/OpcionMultiple';
import VerdaderoFalso from './mechanics/VerdaderoFalso';
import ArrastrarSilabas from './mechanics/ArrastrarSilabas';
import UnirLineas from './mechanics/UnirLineas';
import ClasificarGrupos from './mechanics/ClasificarGrupos';
import Pintar from './mechanics/Pintar';
import TecladoVirtual from './mechanics/TecladoVirtual';
import AudioSeleccion from './mechanics/AudioSeleccion';
import CompletarHuecos from './mechanics/CompletarHuecos';

interface Exercise {
    id: number;
    type: string;
    instruction: string;
    instructionAudioUrl?: string;
    content: any;
}

interface Props {
    exercises: Exercise[];
    unitTitle: string;
    onFinish: (results: any) => void;
    isPreview?: boolean;
}

export default function ExerciseEngine({ exercises, unitTitle, onFinish, isPreview = false }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<any>(null);
    const [playingInstruction, setPlayingInstruction] = useState(false);

    const instructionAudioRef = useRef<HTMLAudioElement | null>(null);
    const startTimeRef = useRef(Date.now());

    // Resolve Auth safely
    let authContext: any = null;
    try {
        authContext = useAuth();
    } catch (e) {
        // Safe fallback if useAuth is not inside context provider
    }
    const user = authContext?.user;

    const currentExercise = exercises[currentIndex];

    // Background color mappings by exercise type
    const BG_COLORS: Record<string, string> = {
        SEÑALAR_IMAGEN: 'bg-[#6b46c1]',
        OPCION_MULTIPLE: 'bg-[#2b6cb0]',
        VERDADERO_FALSO: 'bg-[#2c7a7b]',
        ARRASTRAR_SILABAS: 'bg-[#b7791f]',
        UNIR_LINEAS: 'bg-[#4a5568]',
        CLASIFICAR_GRUPOS: 'bg-[#702459]',
        PINTAR: 'bg-[#c53030]',
        TECLADO_VIRTUAL: 'bg-[#2f855a]',
        AUDIO_SELECCION: 'bg-[#dd6b20]',
        COMPLETAR_HUECOS: 'bg-[#44337a]'
    };

    const SHADOW_COLORS: Record<string, string> = {
        SEÑALAR_IMAGEN: '#523494',
        OPCION_MULTIPLE: '#1a4e80',
        VERDADERO_FALSO: '#1e595a',
        ARRASTRAR_SILABAS: '#855611',
        UNIR_LINEAS: '#2d3748',
        CLASIFICAR_GRUPOS: '#4c153c',
        PINTAR: '#8c1d1d',
        TECLADO_VIRTUAL: '#1c5235',
        AUDIO_SELECCION: '#9c4810',
        COMPLETAR_HUECOS: '#2d2254'
    };

    const activeColor = currentExercise ? (BG_COLORS[currentExercise.type] || 'bg-[#6b46c1]') : 'bg-[#6b46c1]';
    const activeShadowColor = currentExercise ? (SHADOW_COLORS[currentExercise.type] || '#523494') : '#523494';

    // Start timer on exercise load and reset answer
    useEffect(() => {
        startTimeRef.current = Date.now();
        setCurrentAnswer(null);

        // Stop previous instruction audio if playing
        if (instructionAudioRef.current) {
            instructionAudioRef.current.pause();
            instructionAudioRef.current = null;
            setPlayingInstruction(false);
        }
    }, [currentIndex]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (instructionAudioRef.current) {
                instructionAudioRef.current.pause();
                instructionAudioRef.current = null;
            }
        };
    }, []);

    const toggleInstructionAudio = () => {
        if (!currentExercise?.instructionAudioUrl) return;

        if (instructionAudioRef.current) {
            instructionAudioRef.current.pause();
            instructionAudioRef.current.currentTime = 0;
            instructionAudioRef.current = null;
            setPlayingInstruction(false);
        } else {
            const audio = new Audio(currentExercise.instructionAudioUrl);
            instructionAudioRef.current = audio;
            audio.play().catch(e => console.error("Error playing audio instruction:", e));
            setPlayingInstruction(true);
            audio.onended = () => {
                setPlayingInstruction(false);
                instructionAudioRef.current = null;
            };
        }
    };

    const handleConfirmAnswer = () => {
        if (currentAnswer === null || currentAnswer === undefined) return;
        const timeMs = Date.now() - startTimeRef.current;
        handleAnswer(currentAnswer, timeMs);
    };

    const handleAnswer = async (answer: any, timeMs: number) => {
        if (isPreview) {
            // Local preview logic
            const isCorrect = validateAnswerLocal(currentExercise, answer);
            if (isCorrect) {
                setShowFeedback('correct');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A855F7', '#60A5FA', '#FACC15']
                });
            } else {
                setShowFeedback('incorrect');
            }
            setResults(prev => [...prev, { isCorrect, xpEarned: isCorrect ? 10 : 0, exerciseId: currentExercise.id }]);
            setTimeout(() => {
                setShowFeedback(null);
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsFinished(true);
                }
            }, 2000);
            return;
        }

        // Production / Real backend submit logic
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    exerciseId: currentExercise.id,
                    answer,
                    responseTimeMs: timeMs
                })
            });

            const data = await res.json();

            if (data.isCorrect) {
                setShowFeedback('correct');
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#A855F7', '#60A5FA', '#FACC15']
                });
            } else {
                setShowFeedback('incorrect');
            }

            setResults(prev => [...prev, { ...data, exerciseId: currentExercise.id }]);

            // Wait for feedback overlays and progress to next exercise
            setTimeout(() => {
                setShowFeedback(null);
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsFinished(true);
                }
            }, 2000);

        } catch (err) {
            console.error("Error submitting answer", err);
        }
    };

    const renderMechanic = () => {
        const props = { 
            exercise: currentExercise, 
            onAnswer: handleAnswer,
            embedded: true,
            onAnswerChange: (ans: any) => setCurrentAnswer(ans)
        };

        switch (currentExercise.type) {
            case 'SEÑALAR_IMAGEN': return <SeñalarImagen {...props} />;
            case 'OPCION_MULTIPLE': return <OpcionMultiple {...props} />;
            case 'VERDADERO_FALSO': return <VerdaderoFalso {...props} />;
            case 'ARRASTRAR_SILABAS': return <ArrastrarSilabas {...props} />;
            case 'UNIR_LINEAS': return <UnirLineas {...props} />;
            case 'CLASIFICAR_GRUPOS': return <ClasificarGrupos {...props} />;
            case 'PINTAR': return <Pintar {...props} />;
            case 'TECLADO_VIRTUAL': return <TecladoVirtual {...props} />;
            case 'AUDIO_SELECCION': return <AudioSeleccion {...props} />;
            case 'COMPLETAR_HUECOS': return <CompletarHuecos {...props} />;
            default: return <div className="p-10 bg-red-50 text-red-500 rounded-3xl">Mecánica no implementada: {currentExercise.type}</div>;
        }
    };

    if (isFinished) {
        const correctCount = results.filter(r => r.isCorrect).length;
        const totalXp = results.reduce((sum, r) => sum + (r.xpEarned || 0), 0);

        return (
            <div className={`w-full min-h-screen ${activeColor} flex items-center justify-center p-4 md:p-8 transition-colors duration-500`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 bg-white rounded-[64px] shadow-2xl border-b-[16px] border-purple-100"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
                        <Trophy size={120} className="text-yellow-400 relative z-10" strokeWidth={1} />
                    </div>

                    <h2 className="text-5xl font-black text-gray-800 mt-8 mb-2">¡UNIDAD COMPLETADA!</h2>
                    <p className="text-xl text-gray-400 font-bold uppercase tracking-widest">{unitTitle}</p>

                    <div className="grid grid-cols-2 gap-6 w-full mt-12">
                        <div className="bg-purple-50 p-8 rounded-[40px] flex flex-col items-center border-b-8 border-purple-200">
                            <span className="text-4xl font-black text-purple-600">{correctCount}/{exercises.length}</span>
                            <span className="text-xs font-bold text-purple-400 uppercase mt-2">Correctas</span>
                        </div>
                        <div className="bg-orange-50 p-8 rounded-[40px] flex flex-col items-center border-b-8 border-orange-200">
                            <span className="text-4xl font-black text-orange-500">+{totalXp} XP</span>
                            <span className="text-xs font-bold text-orange-400 uppercase mt-2">Ganados</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onFinish(results)}
                        className="mt-12 w-full py-6 bg-green-500 hover:bg-green-600 text-white rounded-[32px] font-black text-2xl shadow-xl flex items-center justify-center gap-4 border-b-8 border-green-700"
                    >
                        CONTINUAR <ArrowRight size={32} />
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen ${activeColor} flex items-center justify-center p-4 md:p-8 transition-colors duration-500 overflow-hidden relative select-none font-sans`}>
            {/* Background Stars Decoration (outside board) */}
            <div className="absolute top-10 left-10 text-4xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute bottom-10 right-10 text-5xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute top-1/2 left-5 text-2xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute bottom-1/4 left-20 text-3xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute top-20 right-20 text-4xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute top-1/3 right-4 text-xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute bottom-1/3 left-4 text-2xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute top-5 left-1/4 text-lg select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>
            <div className="absolute bottom-10 left-1/2 text-3xl select-none opacity-30 text-white/30 pointer-events-none z-0">★</div>

            {/* Game Board container */}
            <main 
                className="bg-[#fdf6e9] w-full max-w-[1200px] h-[92vh] max-h-[850px] rounded-[40px] md:rounded-[60px] relative flex flex-col p-4 md:p-8 overflow-hidden z-10"
                style={{ 
                    boxShadow: `0 20px 0 ${activeShadowColor}, 0 30px 60px rgba(0,0,0,0.2)`
                }}
            >
                {/* Decorative Stars inside the board */}
                <div className="absolute top-10 left-40 text-4xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute bottom-20 left-10 text-5xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute top-60 right-10 text-3xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute bottom-10 right-40 text-4xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute top-40 left-10 text-2xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute top-1/2 left-4 text-3xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute bottom-1/4 right-8 text-2xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>
                <div className="absolute top-1/4 right-20 text-4xl select-none text-[#e6dbbf] pointer-events-none z-[1] opacity-50">★</div>

                {/* Central Purple Header Area (contained within board boundaries) */}
                <div 
                    className="absolute top-0 rounded-b-[30px] md:rounded-b-[40px] z-20 flex flex-col items-center justify-center transition-colors duration-500 shadow-md h-[80px] md:h-[100px]"
                    style={{ 
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'calc(100% - 240px)',
                        maxWidth: '580px',
                        backgroundColor: activeColor.replace('bg-[', '').replace(']', ''),
                        boxShadow: `0 8px 0 ${activeShadowColor}`
                    }}
                >
                    {/* Smooth rounded shoulders using css transitions */}
                    <div className="absolute top-0 left-[-40px] w-10 h-10 bg-[#fdf6e9] rounded-tr-[40px] pointer-events-none" />
                    <div className="absolute top-0 right-[-40px] w-10 h-10 bg-[#fdf6e9] rounded-tl-[40px] pointer-events-none" />

                    <div className="flex flex-col items-center gap-1 w-full px-4">
                        <div className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-[#fdf6e9] w-full max-w-[480px]">
                            <div className="w-8 h-8 shrink-0">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0YfLlNYxzkkqna3OFWWBcUkTLf8Ou32Qu6sO_L7ZWqLBGNIV6MIZDgcVDf6HIl5Rpg7LyhU1_UhByBxTUqZA23RdeAVXhsTtbaLHzGSXE8L5wru_6NHeYA4ja8Pbg058bqadFNfDtfliE4a3UdQzoqRF5U0GzdLbmVgRm86vko2RAfLRDN3a8gT2hfDPcqdPgNtdPxONsSQDAhJazd5AYHKoNmiXuXaCym9InjWRVbb80WsJ6Sp_7rw20nP8Mh7RADG0iyEzV1cAQ" className="w-full h-full object-contain" alt="Earth" />
                            </div>
                            
                            <div className="flex-1 bg-[#fdf6e9] h-5 md:h-6 rounded-full relative overflow-visible border-2 border-[#e6dbbf]">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#9b89ff] to-[#4da6ff] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div 
                                    className="absolute top-1/2 object-contain drop-shadow-md h-[36px] w-[36px] md:h-[48px] md:w-[48px]"
                                    style={{ y: '-50%', x: '-50%' }}
                                    animate={{ left: `${((currentIndex + 1) / exercises.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz5iXRIPb74SoiNNmZOn1tb6xES8AnqHaLAJcq4Byh3Zk62mHEu31qJ-Do3PFaVIN2fZVUajHTzh0LSqM1A1el7bQ3VqeOAffiQnFhFbiJFU_DinXk4P9MPzK3AJDZpsynGoLnZpPFLNbv5nyjy6dv621kODW0Rk8XOB22d_9b150TdBfyJwDTJYZ6V4eJfsutGyFGHLWKGnaSsPPO9tSTiK8OwMlaG3aj1zsLrEfDZQN3JGt6yWEtiM981LhgvHlseWdXhc7Az9g3YPg" alt="Rocket" className="w-full h-full object-contain" />
                                </motion.div>

                                <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
                                    <span className="text-xl drop-shadow-sm text-[#ffb800]">★</span>
                                    <span className="text-xl opacity-30 text-[#ffb800]">★</span>
                                    <span className="text-xl opacity-30 text-[#ffb800]">★</span>
                                </div>
                            </div>

                            <div className="w-8 h-8 shrink-0">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNd1vfdG5pidwguhYqm93bLb4Cvi5yeisr9u_HGF9yPli96tyqMx5P5fabtt2lzl8tTntw80ym4rRJnRoV805kSqXlLXqxto_U1ciejV9zk3edQ0DabT7YBbHX7o5Y-izaGjDGkWSzAKZVVpzOIDgz1M2boZ4H0MS7ySws51gBgzIGXMFXOqz6AvNS6lGRMRmlC1US83K7U6fJ3x5ULmbej6tYZjlW7fezv17NA2dJGdfKqYBJaQgMmCkDKu2smQS8Toaaw4qmU1Mu" className="w-full h-full object-contain" alt="Sun" />
                            </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-black text-white/80">{currentIndex + 1} DE {exercises.length}</span>
                    </div>
                </div>

                {/* Header Section */}
                <header className="flex justify-between items-start z-10 w-full mb-4">
                    {/* User Profile (Top Left) */}
                    <div className="flex items-center gap-2 md:gap-3 bg-white/60 p-1.5 pr-4 md:pr-6 rounded-full border-2 border-white shadow-sm shrink-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-yellow-400 bg-[#f2e8d5] shrink-0">
                            <img 
                                alt="User Avatar" 
                                className="w-full h-full object-cover" 
                                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA0M4mHIKpPQVqznyyWnYqeUIBuT-xO9G-l8rz7LkEG9pO78qoaDR2vmBm8XrksCjhg0VC_Y_l96nYJ4APqKrdQoVTLDarRZjzVB3CY7AQeJe30H9rePDrNxww_ZnOrFxJdiroZ20nWj3px1w3KbDZwUhh3ruJvUvheInIWcAoSsIz8eLOURj6i7cEgr8GIIp3cuGzSn7c195lJk7z94qMAdJYNwug8mmfXZEodEOfH5h_xXGLEw-U1r6mhjtWTqty9DdXNCVh8hw06"} 
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-[#2d3e50] text-sm md:text-xl leading-none">
                                <img 
                                    alt="BestKids Logo" 
                                    className="w-auto object-contain h-8 md:h-14" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvqLQgpRb06bdG3paAr_coJIZVfv97IpJR2_rY2LW2EXP7y4Q7t25k8JGJhUg780t1onz006IYCKAykyREuPDe48kwl2QzeNzU7OcLUBc0YIPoRJKhv4BqRokcFEyKbySuOdhl8ffSrCsn9WcHO4IyXDJkhFwGqDqRqiVSIPvhEGAWoX0pMXlj377ptIDjzKXtmhZ-AWILU2OkjmN9aUjt5THI0LHhjR0rMcz_GKPEs9jFxfNJnsiBuFN2Fb-CX_3cslID5MLRs7FF" 
                                />
                            </h1>
                            <p className="text-[10px] md:text-xs text-[#2d3e50]/60 font-black italic">"{user?.firstName || 'Estudiante'}"</p>
                        </div>
                    </div>

                    {/* Stats & Score (Top Right) */}
                    <div className="flex items-center gap-1 shrink-0">
                        <div className="bg-white px-4 md:px-6 py-2 rounded-full shadow-sm border-2 border-[#f2e8d5] flex items-center gap-2 md:gap-3">
                            <span className="font-black text-[#2d3e50] text-xs md:text-base tracking-tight">PUNTOS: <span className="text-[#ff4d94]">{user?.points || 0}</span></span>
                        </div>
                        <div className="flex flex-col items-center">
                            <img 
                                alt="BestKids Mascot" 
                                className="h-14 md:h-20 w-auto object-contain" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-ALZLlNC0T-MVtRWyDr7vhwEyPSd_mSuBPs3NFupduOTqD5Axxga-6TW7ikZ4hDtQBhpuMOSjP1SOmD7RZ4gh0I9fqVlQ4SKA_fTWyTc4xFzUHcCGhHkPiqRhrk56Bna3lcPzvwu4JRj_5LfjNFv4woWz_QvquSb9EpqLi5OpbbDkgbWmYT0r3zIPjdFShPBzi6srHPnUtD9SgGjwOmPM9vOsQLG6tA-PXNivK38WmU3rIBESbdBP7LflJNdXoYFAUIsnfwJOLChI" 
                            />
                        </div>
                    </div>
                </header>

                {/* Main Workspace */}
                <section className="flex-grow flex flex-col items-center justify-start z-10 w-full overflow-hidden mt-2">
                    {/* Question Prompt Area */}
                    <div className="w-full max-w-2xl bg-white rounded-full py-3 px-6 md:px-8 border-b-4 border-[#f2e8d5] flex items-center gap-4 shadow-sm mb-4">
                        {currentExercise.instructionAudioUrl && (
                            <button 
                                onClick={toggleInstructionAudio}
                                className={`p-2.5 md:p-3.5 rounded-full transition-all shrink-0 ${playingInstruction ? 'bg-orange-500 text-white animate-pulse shadow-md shadow-orange-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                            >
                                {playingInstruction ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
                            </button>
                        )}
                        <div className="text-base md:text-2xl text-[#2d3e50] font-black text-center flex-grow leading-snug">
                            {currentExercise.instruction}
                        </div>
                    </div>

                    {/* Empty/Translucent Workspace for child mechanics */}
                    <div className="flex-grow w-full bg-white/20 rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-start p-4 overflow-y-auto min-h-0">
                        {renderMechanic()}
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="flex justify-between items-center mt-4 z-10 relative">
                    {/* Exit Button */}
                    <button 
                        onClick={() => onFinish(null)}
                        className="bg-white border-2 border-[#f2e8d5] w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_4px_0_#ddd] hover:scale-105 active:translate-y-[2px] active:shadow-[0_2px_0_#ddd] transition-all text-[#6b46c1] shrink-0"
                    >
                        <Home size={24} />
                    </button>

                    {/* Main Action Button */}
                    <motion.button 
                        onClick={handleConfirmAnswer}
                        disabled={currentAnswer === null || currentAnswer === undefined || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#ff4d94] text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-black text-base md:text-2xl shadow-[0_6px_0_#d12e6d] hover:translate-y-[1px] hover:shadow-[0_2px_0_#d12e6d] active:translate-y-[2px] active:shadow-[0_1px_0_#d12e6d] transition-all flex items-center gap-2 md:gap-3 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none shrink-0"
                    >
                        <Send size={20} className="rotate-45" fill="currentColor" />
                        <span>Enviar respuesta</span>
                    </motion.button>

                    {/* Spacer for balance */}
                    <div className="w-12 md:w-16 shrink-0"></div>
                </footer>
            </main>

            {/* Overlays de Feedback */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm ${showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-white p-16 rounded-[80px] shadow-2xl flex flex-col items-center border-[20px] border-white"
                        >
                            {showFeedback === 'correct' ? (
                                <>
                                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
                                        <Star size={64} fill="white" />
                                    </div>
                                    <h3 className="text-5xl font-black text-green-500 italic">¡GENIAL!</h3>
                                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-tighter">¡Sigue así!</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white mb-6">
                                        <X size={64} strokeWidth={4} />
                                    </div>
                                    <h3 className="text-5xl font-black text-red-500 italic">¡ÁNIMO!</h3>
                                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-tighter">Vuelve a intentarlo</p>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/** 
 * Lógica de validación local (solo para preview) 
 * Debe estar sincronizada con el backend 
 */
function validateAnswerLocal(exercise: any, answer: any): boolean {
    const { type, content } = exercise;
    if (!content) return false;

    switch (type) {
        case 'SEÑALAR_IMAGEN':
        case 'AUDIO_SELECCION': {
            const correctIds = (content.options || []).filter((o: any) => o.isCorrect).map((o: any) => o.id);
            if (content.multipleCorrect) {
                return Array.isArray(answer) &&
                    answer.length === correctIds.length &&
                    answer.every((id: any) => correctIds.includes(id));
            }
            return answer === correctIds[0];
        }
        case 'OPCION_MULTIPLE': {
            const correctId = (content.options || []).find((o: any) => o.isCorrect)?.id;
            return answer === correctId;
        }
        case 'VERDADERO_FALSO':
            return answer === content.correctAnswer;
        case 'TECLADO_VIRTUAL':
            return String(answer).toLowerCase().trim() === String(content.correctSyllable).toLowerCase().trim();
        case 'ARRASTRAR_SILABAS':
            return JSON.stringify(answer) === JSON.stringify((content.items || []).map((i: any) => i.word));
        case 'UNIR_LINEAS': {
            const pairs = answer as Array<[string, string]>;
            const correctPairs = content.correctPairs || [];
            return Array.isArray(pairs) && pairs.length === correctPairs.length &&
                pairs.every(p => correctPairs.some((cp: any) => cp[0] === p[0] && cp[1] === p[1]));
        }
        case 'CLASIFICAR_GRUPOS': {
            const assignments = answer as Array<{ itemId: string, groupId: string }>;
            return Array.isArray(assignments) && assignments.every((a: any) => {
                const item = (content.items || []).find((i: any) => i.id === a.itemId);
                return item && item.correctGroupId === a.groupId;
            });
        }
        case 'PINTAR': {
            const assignments = answer as Array<{ itemId: string, color: string }>;
            return Array.isArray(assignments) && assignments.every((a: any) => {
                const pair = (content.correctPairs || []).find((p: any) => p.itemId === a.itemId);
                return pair && pair.color === a.color;
            });
        }
        case 'COMPLETAR_HUECOS': {
            const answers = answer as Record<string, string>;
            return Array.isArray(content.gaps) && content.gaps.every((g: any) =>
                answers[g.id]?.toLowerCase().trim() === g.correctAnswer.toLowerCase().trim()
            );
        }
        default:
            return true;
    }
}
