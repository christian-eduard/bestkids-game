// Sistema de sonidos para feedback de ejercicios
class SoundManager {
    private sounds: { [key: string]: HTMLAudioElement } = {};
    private musicEnabled: boolean = true;
    private soundEnabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            this.loadSounds();
            this.loadSettings();
        }
    }

    private loadSettings() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        const soundEnabled = localStorage.getItem('soundEnabled');

        this.musicEnabled = musicEnabled !== 'false';
        this.soundEnabled = soundEnabled !== 'false';
    }

    private loadSounds() {
        // Crear sonidos usando Web Audio API
        this.sounds = {
            correct: this.createSound(800, 0.2, 'sine'),
            incorrect: this.createSound(200, 0.3, 'sawtooth'),
            achievement: this.createSound(1000, 0.3, 'sine'),
            click: this.createSound(400, 0.1, 'sine'),
            celebration: this.createSound(1200, 0.4, 'sine'),
            levelUp: this.createSound(900, 0.5, 'triangle'),
        };
    }

    private createSound(frequency: number, duration: number, type: OscillatorType): HTMLAudioElement {
        // Crear un audio element vacío como placeholder
        const audio = new Audio();
        audio.volume = 0.3;

        // Guardar parámetros para generar el sonido cuando se reproduzca
        (audio as any)._soundParams = { frequency, duration, type };

        return audio;
    }

    private playWebAudioSound(frequency: number, duration: number, type: OscillatorType) {
        if (!this.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    play(soundName: keyof typeof this.sounds) {
        if (!this.soundEnabled) return;

        const sound = this.sounds[soundName];
        if (sound && (sound as any)._soundParams) {
            const { frequency, duration, type } = (sound as any)._soundParams;
            this.playWebAudioSound(frequency, duration, type);
        }
    }

    playCorrect() {
        this.play('correct');
        // Sonido de celebración adicional
        setTimeout(() => this.play('achievement'), 100);
    }

    playIncorrect() {
        this.play('incorrect');
    }

    playCelebration() {
        this.play('celebration');
        setTimeout(() => this.play('levelUp'), 200);
    }

    playClick() {
        this.play('click');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', String(this.soundEnabled));
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        localStorage.setItem('musicEnabled', String(this.musicEnabled));
        return this.musicEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }
}

// Singleton instance
let soundManager: SoundManager | null = null;

export const getSoundManager = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!soundManager) {
        soundManager = new SoundManager();
    }
    return soundManager;
};

export default getSoundManager;
