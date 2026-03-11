'use client';

import React, { useState } from 'react';

export enum ExerciseType {
    MULTIPLE_CHOICE = 'multiple_choice',
    DRAG_DROP = 'drag_drop',
    MATCHING = 'matching',
    FILL_BLANKS = 'fill_blanks',
    SEQUENCE = 'sequence',
    TRUE_FALSE = 'true_false',
    MULTI_SELECT = 'multi_select',
}

// import { ExerciseType } from '@/../../backend/src/modules/exercises/entities/exercise.entity'; // Removed to fix build
import MultipleChoiceExercise, {
    MultipleChoiceContent,
} from './MultipleChoiceExercise';
import TrueFalseExercise, { TrueFalseContent } from './TrueFalseExercise';
import MultiSelectExercise, { MultiSelectContent } from './MultiSelectExercise';
import FillBlanksExercise, { FillBlanksContent } from './FillBlanksExercise';
import SequenceExercise, { SequenceContent } from './SequenceExercise';
import DragDropExercise, { DragDropContent } from './DragDropExercise';
import MatchingExercise, { MatchingContent } from './MatchingExercise';

export interface Exercise {
    id: number;
    title: string;
    description?: string;
    exerciseType: ExerciseType;
    difficultyLevel: string;
    content: any;
    points: number;
    hints?: string[];
}

interface ExercisePlayerProps {
    exercise: Exercise;
    onComplete: (exerciseId: number, isCorrect: boolean, answer: any, timeSpent: number) => void;
    onHintRequest?: (exerciseId: number, hintIndex: number) => void;
}

export default function ExercisePlayer({
    exercise,
    onComplete,
    onHintRequest,
}: ExercisePlayerProps) {
    const [startTime] = useState(Date.now());
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [result, setResult] = useState<{ isCorrect: boolean; isSubmitting: boolean } | null>(null);

    const handleAnswer = (answer: any) => {
        if (result) return;
        setSelectedAnswer(answer);
    };

    const validateAnswer = () => {
        if (!selectedAnswer) return;

        let isCorrect = false;
        const content = exercise.content;

        switch (exercise.exerciseType) {
            case ExerciseType.MULTIPLE_CHOICE:
                isCorrect = selectedAnswer === content.correctAnswer;
                break;
            case ExerciseType.TRUE_FALSE:
                isCorrect = selectedAnswer === content.correctAnswer;
                break;
            case ExerciseType.MATCHING:
                // Check if all pairs match
                if (!Array.isArray(selectedAnswer) || selectedAnswer.length !== content.correctPairs.length) {
                    isCorrect = false;
                } else {
                    isCorrect = selectedAnswer.every((pair: any) =>
                        content.correctPairs.some((correct: any) =>
                            correct.left === pair.left && correct.right === pair.right
                        )
                    );
                }
                break;
            case ExerciseType.DRAG_DROP:
                // Check sequence of IDs
                if (!Array.isArray(selectedAnswer)) {
                    isCorrect = false;
                } else {
                    isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(content.correctSequence);
                }
                break;
            case ExerciseType.SEQUENCE:
                // Check sequence of IDs
                if (!Array.isArray(selectedAnswer)) {
                    isCorrect = false;
                } else {
                    isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(content.correctOrder);
                }
                break;
            case ExerciseType.FILL_BLANKS:
                // Check all blanks
                if (!Array.isArray(selectedAnswer)) {
                    isCorrect = false;
                } else {
                    isCorrect = content.blanks.every((blank: any, index: number) =>
                        selectedAnswer[index]?.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim()
                    );
                }
                break;
            case ExerciseType.MULTI_SELECT:
                // Check if arrays match (sort to ignore order)
                if (!Array.isArray(selectedAnswer)) {
                    isCorrect = false;
                } else {
                    const sortedSelected = [...selectedAnswer].sort();
                    const sortedCorrect = [...content.correctAnswers].sort();
                    isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
                }
                break;
            default:
                isCorrect = false;
        }

        setResult({ isCorrect, isSubmitting: true });

        // Delay completion to show feedback
        setTimeout(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            onComplete(exercise.id, isCorrect, selectedAnswer, timeSpent);
        }, 2000);
    };

    const handleRequestHint = () => {
        if (exercise.hints && currentHintIndex < exercise.hints.length) {
            if (onHintRequest) {
                onHintRequest(exercise.id, currentHintIndex);
            }
            alert(exercise.hints[currentHintIndex]);
            setCurrentHintIndex((prev) => prev + 1);
        }
    };

    const renderExercise = () => {
        const commonProps = {
            onAnswer: handleAnswer,
            selectedAnswer,
            result,
            isSubmitting: result?.isSubmitting || false,
        };

        switch (exercise.exerciseType) {
            case ExerciseType.MULTIPLE_CHOICE:
                return <MultipleChoiceExercise content={exercise.content as MultipleChoiceContent} {...commonProps} />;
            case ExerciseType.TRUE_FALSE:
                return <TrueFalseExercise content={exercise.content as TrueFalseContent} {...commonProps} />;
            case ExerciseType.MULTI_SELECT:
                return <MultiSelectExercise content={exercise.content as MultiSelectContent} {...commonProps} />;
            case ExerciseType.FILL_BLANKS:
                return <FillBlanksExercise content={exercise.content as FillBlanksContent} {...commonProps} />;
            case ExerciseType.SEQUENCE:
                return <SequenceExercise content={exercise.content as SequenceContent} {...commonProps} />;
            case ExerciseType.DRAG_DROP:
                return <DragDropExercise content={exercise.content as DragDropContent} {...commonProps} />;
            case ExerciseType.MATCHING:
                return <MatchingExercise content={exercise.content as MatchingContent} {...commonProps} />;
            default:
                return (
                    <div className="max-w-4xl mx-auto p-6 text-center">
                        <div className="p-8 bg-yellow-50 border-4 border-yellow-300 rounded-2xl">
                            <p className="text-2xl font-bold text-gray-800 mb-4">⚠️ Tipo de ejercicio no soportado</p>
                            <p className="text-lg text-gray-600">El tipo de ejercicio "{exercise.exerciseType}" aún no está implementado.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
            {renderExercise()}

            {!result && (
                <div className="mt-12 w-full max-w-md">
                    <button
                        onClick={validateAnswer}
                        disabled={!selectedAnswer}
                        className="w-full bg-primary hover:bg-fuchsia-600 text-white text-xl font-black py-4 rounded-xl shadow-[0_4px_0_0_#86198f] hover:shadow-[0_2px_0_0_#86198f] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                    >
                        COMPROBAR
                    </button>
                    {exercise.hints && exercise.hints.length > 0 && (
                        <button
                            onClick={handleRequestHint}
                            className="mt-4 w-full text-indigo-500 font-bold hover:underline"
                        >
                            ¿Necesitas una pista?
                        </button>
                    )}
                </div>
            )}

            {result && (
                <div className={`mt-8 p-6 rounded-2xl border-4 ${result.isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'} animate-in slide-in-from-bottom duration-500`}>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-4xl">
                            {result.isCorrect ? 'check_circle' : 'error'}
                        </span>
                        <div>
                            <p className="font-black text-xl uppercase">
                                {result.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                            </p>
                            <p className="font-medium">
                                {result.isCorrect ? '¡Has ganado puntos!' : 'Inténtalo de nuevo en la próxima.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
