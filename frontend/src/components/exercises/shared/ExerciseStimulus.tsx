"use client";
import React from 'react';

interface Stimulus {
    type: 'image' | 'text' | 'audio' | 'video' | 'grid';
    value: any;
    size?: 'sm' | 'md' | 'lg';
}

interface Props {
    stimulus?: Stimulus;
}

export default function ExerciseStimulus({ stimulus }: Props) {
    if (!stimulus || stimulus.type === 'audio' || stimulus.type === 'grid') return null;

    const sizeClasses = {
        sm: 'max-w-xs',
        md: 'max-w-md',
        lg: 'max-w-2xl'
    };

    const textSizeClasses = {
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-6xl'
    };

    return (
        <div className={`bg-white p-4 rounded-3xl shadow-md border-4 border-green-200 flex items-center justify-center overflow-hidden w-full mx-auto
            ${sizeClasses[stimulus.size || 'md']}`}
        >
            {stimulus.type === 'image' && (
                <img 
                    src={stimulus.value} 
                    className="w-full h-auto max-h-80 object-contain rounded-2xl" 
                    alt="Estímulo" 
                />
            )}
            {stimulus.type === 'video' && (
                <video 
                    src={stimulus.value} 
                    className="w-full h-auto max-h-80 rounded-2xl" 
                    controls 
                    autoPlay 
                    muted 
                />
            )}
            {stimulus.type === 'text' && (
                <p className={`font-black text-purple-600 px-8 underline decoration-green-300 underline-offset-8 text-center
                    ${textSizeClasses[stimulus.size || 'md']}`}
                >
                    {stimulus.value}
                </p>
            )}
        </div>
    );
}
