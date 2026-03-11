import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

interface CelebrationProps {
    show: boolean;
    onComplete?: () => void;
    duration?: number; // milliseconds
}

/**
 * Componente de Celebración con Confetti
 * Según requerimientos del cliente: "Feedback inmediato y CONSTRUCTIVO"
 * Uso: Al acertar ejercicios, completar logros, ganar puntos
 */
export default function Celebration({ show, onComplete, duration = 3000 }: CelebrationProps) {
    const [isActive, setIsActive] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (show) {
            setIsActive(true);

            // Auto-hide after duration
            const timer = setTimeout(() => {
                setIsActive(false);
                onComplete?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onComplete]);

    useEffect(() => {
        // Get window size for confetti
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
                colors={[
                    '#4A90E2', // Azul BestKids
                    '#7ED321', // Verde BestKids  
                    '#F5A623', // Naranja BestKids
                    '#BD10E0', // Morado BestKids
                    '#F8E71C', // Amarillo BestKids
                    '#FF6B9D', // Rosa BestKids
                ]}
            />
        </div>
    );
}
