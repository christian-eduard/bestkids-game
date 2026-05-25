"use client";
import React from 'react';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseStimulus from '../shared/ExerciseStimulus';

interface Props {
    exercise: {
        instruction: string;
        instructionAudioUrl?: string;
        content: {
            stimulus?: { type: 'image' | 'text' | 'audio' | 'video', value: string, size?: 'sm' | 'md' | 'lg' };
            instructionSize?: 'sm' | 'md' | 'lg';
            stimulusA: { type: 'audio' | 'image' | 'text', value: string };
            stimulusB: { type: 'audio' | 'image' | 'text', value: string };
            correctAnswer: boolean;
        }
    };
    onAnswer: (answer: boolean, timeMs: number) => void;
    embedded?: boolean;
    onAnswerChange?: (answer: any) => void;
}

export default function VerdaderoFalso({ exercise, onAnswer, embedded = false, onAnswerChange }: Props) {
    const [selectedVal, setSelectedVal] = React.useState<boolean | null>(null);
    const [playingInstruction, setPlayingInstruction] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const startTime = React.useRef(Date.now());

    const toggleAudio = () => {
        if (!exercise.instructionAudioUrl) return;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            setPlayingInstruction(false);
        } else {
            const audio = new Audio(exercise.instructionAudioUrl);
            audioRef.current = audio;
            audio.play().catch(e => console.error(e));
            setPlayingInstruction(true);
            audio.onended = () => {
                setPlayingInstruction(false);
                audioRef.current = null;
            };
        }
    };

    const handleSelect = (val: boolean) => {
        if (embedded) {
            setSelectedVal(val);
            if (onAnswerChange) {
                onAnswerChange(val);
            }
        } else {
            const timeMs = Date.now() - startTime.current;
            onAnswer(val, timeMs);
        }
    };

    const renderStimulus = (stim: { type: string, value: string }) => {
        switch (stim.type) {
            case 'image': return <img src={stim.value} className="max-h-48 rounded-2xl" alt="" />;
            case 'text': return <span className="text-6xl font-black text-purple-600">{stim.value}</span>;
            case 'audio': return (
                <button
                    onClick={() => new Audio(stim.value).play()}
                    className="p-8 bg-purple-100 text-purple-600 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                    <Volume2 size={48} />
                </button>
            );
            default: return null;
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8">
            {embedded ? (
                exercise.content.stimulus ? (
                    <div className="mb-2">
                        <ExerciseStimulus stimulus={exercise.content.stimulus} />
                    </div>
                ) : null
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[32px] shadow-sm border-2 border-purple-100 max-w-2xl">
                        <h2 className={`font-black text-gray-700 leading-tight ${exercise.content.instructionSize === 'sm' ? 'text-lg' : exercise.content.instructionSize === 'lg' ? 'text-4xl' : 'text-2xl'}`}>
                            {exercise.instruction}
                        </h2>
                        {exercise.instructionAudioUrl && (
                            <button 
                                onClick={toggleAudio}
                                className={`p-4 rounded-2xl transition-all ${playingInstruction ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-200' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                            >
                                {playingInstruction ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
                            </button>
                        )}
                    </div>

                    <ExerciseStimulus stimulus={exercise.content.stimulus} />
                </div>
            )}

            <div className="flex items-center gap-16">
                <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-blue-50 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                    {renderStimulus(exercise.content.stimulusA)}
                </div>

                <div className="text-4xl font-bold text-gray-300">VS</div>

                <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-blue-50 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                    {renderStimulus(exercise.content.stimulusB)}
                </div>
            </div>

            <div className="flex gap-8">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSelect(true)}
                    className={`group text-white p-8 md:p-12 rounded-[40px] shadow-2xl transition-all border-b-8 ${
                        selectedVal === true 
                            ? 'bg-green-600 ring-8 ring-green-200 border-green-800 scale-105' 
                            : 'bg-green-500 hover:bg-green-600 border-green-700'
                    }`}
                >
                    <span className="text-4xl md:text-6xl group-hover:animate-bounce block">👍</span>
                    <span className="text-lg md:text-xl font-black mt-2 block">SÍ</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSelect(false)}
                    className={`group text-white p-8 md:p-12 rounded-[40px] shadow-2xl transition-all border-b-8 ${
                        selectedVal === false 
                            ? 'bg-red-600 ring-8 ring-red-200 border-red-800 scale-105' 
                            : 'bg-red-50 hover:bg-red-600 border-red-700'
                    }`}
                >
                    <span className="text-4xl md:text-6xl group-hover:animate-bounce block">👎</span>
                    <span className="text-lg md:text-xl font-black mt-2 block">NO</span>
                </motion.button>
            </div>
        </div>
    );
}
