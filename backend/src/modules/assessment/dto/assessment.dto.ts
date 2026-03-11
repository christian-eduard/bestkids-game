import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class SubmitAssessmentAnswerDto {
    @IsNumber()
    exerciseId: number;

    @IsBoolean()
    isCorrect: boolean;

    @IsNumber()
    @IsOptional()
    timeSpentSeconds?: number;
}

export class StartAssessmentDto {
    @IsNumber()
    userId: number;
}

export class AssessmentProgressDto {
    totalQuestions: number;
    answeredQuestions: number;
    progressPercentage: number;
    currentSubjectArea: string;
    completed: boolean;
}

export class AssessmentResultDto {
    userId: number;
    overallScore: number;
    subjectResults: Array<{
        subjectArea: string;
        score: number;
        difficultyLevel: string;
        rtiLevel: string;
        recommendedExercises: string;
    }>;
    avatarUnlocked: boolean;
    completedAt: Date;
}
