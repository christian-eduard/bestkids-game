"use client";

import { useEffect, useState } from "react";

interface BackgroundMusicProps {
    enabled?: boolean;
}

export default function BackgroundMusic({ enabled = true }: BackgroundMusicProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.1);

    useEffect(() => {
        if (!enabled) return;

        const musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        if (musicEnabled) {
            playBackgroundMusic();
        }

        return () => {
            stopBackgroundMusic();
        };
    }, [enabled]);

    const playBackgroundMusic = () => {
        if (typeof window === 'undefined') return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Crear música de fondo simple usando osciladores
            const createMelody = () => {
                const notes = [
                    { freq: 523.25, duration: 0.5 }, // C5
                    { freq: 587.33, duration: 0.5 }, // D5
                    { freq: 659.25, duration: 0.5 }, // E5
                    { freq: 698.46, duration: 0.5 }, // F5
                    { freq: 783.99, duration: 1.0 }, // G5
                ];

                let currentTime = audioContext.currentTime;

                notes.forEach(note => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = note.freq;
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(volume, currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + note.duration);

                    currentTime += note.duration;
                });

                // Repetir la melodía
                setTimeout(createMelody, notes.reduce((sum, n) => sum + n.duration, 0) * 1000 + 2000);
            };

            createMelody();
            setIsPlaying(true);
        } catch (error) {
            console.warn('Background music not supported:', error);
        }
    };

    const stopBackgroundMusic = () => {
        setIsPlaying(false);
    };

    return null; // Este componente no renderiza nada visible
}
