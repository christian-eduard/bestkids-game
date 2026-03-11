/**
 * Mensajes de Feedback Positivo y Constructivo
 * Según PDF cliente: "Feedback SIEMPRE POSITIVO. Nunca 'incorrecto' o 'mal'"
 */

export type FeedbackType = 'correct' | 'almost' | 'tryAgain' | 'excellent' | 'good' | 'keep_going';

export interface FeedbackMessage {
    message: string;
    emoji: string;
    color: string; // Tailwind color class
    celebrationLevel: 'none' | 'small' | 'big'; // Para confetti
}

/**
 * Mensajes POSITIVOS para cada tipo de feedback
 * NUNCA usar: "Incorrecto", "Mal", "Error"
 * SIEMPRE usar: "Casi", "Inténtalo de nuevo", "Puedes hacerlo"
 */
export const FEEDBACK_MESSAGES: Record<FeedbackType, FeedbackMessage[]> = {
    correct: [
        { message: "¡EXCELENTE! ⭐", emoji: "⭐", color: "text-bestkids-green", celebrationLevel: "small" },
        { message: "¡MUY BIEN! 🎉", emoji: "🎉", color: "text-bestkids-green", celebrationLevel: "small" },
        { message: "¡CORRECTO! 👏", emoji: "👏", color: "text-bestkids-green", celebrationLevel: "small" },
        { message: "¡GENIAL! 🌟", emoji: "🌟", color: "text-bestkids-green", celebrationLevel: "small" },
        { message: "¡PERFECTO! ✨", emoji: "✨", color: "text-bestkids-green", celebrationLevel: "small" },
    ],

    excellent: [
        { message: "¡INCREÍBLE! 🏆", emoji: "🏆", color: "text-bestkids-purple", celebrationLevel: "big" },
        { message: "¡ERES UN CAMPEÓN! 👑", emoji: "👑", color: "text-bestkids-purple", celebrationLevel: "big" },
        { message: "¡ESPECTACULAR! 🎊", emoji: "🎊", color: "text-bestkids-purple", celebrationLevel: "big" },
        { message: "¡ASOMBROSO! 💫", emoji: "💫", color: "text-bestkids-purple", celebrationLevel: "big" },
    ],

    good: [
        { message: "¡Bien hecho! 👍", emoji: "👍", color: "text-bestkids-blue", celebrationLevel: "small" },
        { message: "¡Muy bien! 😊", emoji: "😊", color: "text-bestkids-blue", celebrationLevel: "small" },
        { message: "¡Buen trabajo! 💪", emoji: "💪", color: "text-bestkids-blue", celebrationLevel: "small" },
    ],

    almost: [
        { message: "¡Casi! Inténtalo de nuevo 💪", emoji: "💪", color: "text-bestkids-orange", celebrationLevel: "none" },
        { message: "¡Muy cerca! Sigue intentando 🎯", emoji: "🎯", color: "text-bestkids-orange", celebrationLevel: "none" },
        { message: "¡Casi lo tienes! Una más 🌟", emoji: "🌟", color: "text-bestkids-orange", celebrationLevel: "none" },
        { message: "¡Estás cerca! Prueba otra vez 🚀", emoji: "🚀", color: "text-bestkids-orange", celebrationLevel: "none" },
    ],

    tryAgain: [
        { message: "Inténtalo otra vez 😊", emoji: "😊", color: "text-bestkids-yellow", celebrationLevel: "none" },
        { message: "Vamos, tú puedes 💫", emoji: "💫", color: "text-bestkids-yellow", celebrationLevel: "none" },
        { message: "¡No te rindas! 🌈", emoji: "🌈", color: "text-bestkids-yellow", celebrationLevel: "none" },
        { message: "Sigue intentando 🎈", emoji: "🎈", color: "text-bestkids-yellow", celebrationLevel: "none" },
    ],

    keep_going: [
        { message: "¡Sigue así! 🚀", emoji: "🚀", color: "text-bestkids-pink", celebrationLevel: "none" },
        { message: "¡Vas muy bien! ⭐", emoji: "⭐", color: "text-bestkids-pink", celebrationLevel: "none" },
        { message: "¡Continúa! 💪", emoji: "💪", color: "text-bestkids-pink", celebrationLevel: "none" },
    ],
};

/**
 * Obtener un mensaje aleatorio de feedback para un tipo
 */
export function getRandomFeedback(type: FeedbackType): FeedbackMessage {
    const messages = FEEDBACK_MESSAGES[type];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

/**
 * Determinar tipo de feedback según % de acierto
 */
export function getFeedbackType(accuracy: number): FeedbackType {
    if (accuracy === 100) return 'excellent';
    if (accuracy >= 80) return 'correct';
    if (accuracy >= 60) return 'good';
    if (accuracy >= 40) return 'almost';
    if (accuracy >= 20) return 'tryAgain';
    return 'keep_going';
}

/**
 * Obtener feedback completo basado en si la respuesta fue correcta
 */
export function getFeedback(isCorrect: boolean, streak: number = 0): FeedbackMessage {
    if (isCorrect) {
        // Racha larga = mensaje excelente
        if (streak >= 5) {
            return getRandomFeedback('excellent');
        }
        // Racha media = mensaje correcto
        if (streak >= 3) {
            return getRandomFeedback('correct');
        }
        // Normal = mensaje bueno
        return getRandomFeedback('good');
    } else {
        // No correcto = mensaje constructivo (nunca negativo)
        return getRandomFeedback('almost');
    }
}

/**
 * Obtener un mensaje de éxito simple (para componentes de ejercicios)
 */
export function getSuccessMessage(): string {
    const messages = [
        '¡Excelente! 🎉',
        '¡Muy bien! ⭐',
        '¡Perfecto! 🌟',
        '¡Genial! 👏',
        '¡Lo lograste! 🏆',
        '¡Fantástico! ✨',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Obtener un mensaje de ánimo constructivo (nunca negativo)
 */
export function getEncouragementMessage(): string {
    const messages = [
        '¡Casi lo tienes! 💪',
        '¡Sigue intentando! 🌈',
        '¡Tú puedes! 🚀',
        '¡No te rindas! 🎯',
        '¡Muy cerca! 😊',
        '¡Inténtalo de nuevo! ⭐',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

