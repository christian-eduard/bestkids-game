"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TutorialStep {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialContextType {
    startTutorial: (steps: TutorialStep[]) => void;
    stopTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    currentStepIndex: number;
    steps: TutorialStep[];
    isActive: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [steps, setSteps] = useState<TutorialStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const startTutorial = useCallback((newSteps: TutorialStep[]) => {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsActive(true);
    }, []);

    const stopTutorial = useCallback(() => {
        setIsActive(false);
        setSteps([]);
        setCurrentStepIndex(0);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            stopTutorial();
        }
    }, [currentStepIndex, steps.length, stopTutorial]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    return (
        <TutorialContext.Provider value={{
            startTutorial,
            stopTutorial,
            nextStep,
            prevStep,
            currentStepIndex,
            steps,
            isActive
        }}>
            {children}
        </TutorialContext.Provider>
    );
}

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) throw new Error('useTutorial must be used within a TutorialProvider');
    return context;
};
