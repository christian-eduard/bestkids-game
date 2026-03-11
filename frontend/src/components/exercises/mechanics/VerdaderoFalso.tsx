"use client";
import React from 'react';
import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    exercise: {
        instruction: string;
        content: {
            stimulusA: { type: 'audio' | 'image' | 'text', value: string };
            stimulusB: { type: 'audio' | 'image' | 'text', value: string };
            correctAnswer: boolean;
        }
    };
    onAnswer: (answer: boolean, timeMs: number) => void;
}

export default function VerdaderoFalso({ exercise, onAnswer }: Props) {
    const startTime = React.useRef(Date.now());

    const handleAnswer = (val: boolean) => {
        const timeMs = Date.now() - startTime.current;
        onAnswer(val, timeMs);
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
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-12">
            <h2 className="text-3xl font-bold text-gray-700 text-center bg-white px-12 py-6 rounded-[32px] shadow-sm">
                {exercise.instruction}
            </h2>

            <div className="flex items-center gap-16">
                <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-blue-50 w-64 h-64 flex items-center justify-center">
                    {renderStimulus(exercise.content.stimulusA)}
                </div>

                <div className="text-4xl font-bold text-gray-300">VS</div>

                <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-blue-50 w-64 h-64 flex items-center justify-center">
                    {renderStimulus(exercise.content.stimulusB)}
                </div>
            </div>

            <div className="flex gap-8">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer(true)}
                    className="group bg-green-500 hover:bg-green-600 text-white p-12 rounded-[40px] shadow-2xl transition-all border-b-8 border-green-700"
                >
                    <span className="text-6xl group-hover:animate-bounce block">👍</span>
                    <span className="text-xl font-black mt-2 block">SÍ</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAnswer(false)}
                    className="group bg-red-500 hover:bg-red-600 text-white p-12 rounded-[40px] shadow-2xl transition-all border-b-8 border-red-700"
                >
                    <span className="text-6xl group-hover:animate-bounce block">👎</span>
                    <span className="text-xl font-black mt-2 block">NO</span>
                </motion.button>
            </div>
        </div>
    );
}
