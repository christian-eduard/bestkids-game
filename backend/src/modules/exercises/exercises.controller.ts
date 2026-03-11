import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdaptiveLearningService } from './services/adaptive-learning.service';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService,
        private readonly adaptiveLearningService: AdaptiveLearningService,
    ) { }

    @Get('subjects')
    @ApiOperation({ summary: 'Get all active subject areas' })
    async getSubjects() {
        return this.exercisesService.findAllSubjectAreas();
    }

    @Get('all')
    @ApiOperation({ summary: 'Get all active exercises' })
    async getAllExercises() {
        return this.exercisesService.findAll();
    }

    @Get('subject/:id')
    @ApiOperation({ summary: 'Get exercises by subject area' })
    async getExercisesBySubject(@Param('id') id: string) {
        return this.exercisesService.findBySubject(+id);
    }

    @Get('next-recommended')
    @ApiOperation({ summary: 'Get next recommended exercise (adaptive)' })
    async getNextRecommended(
        @Request() req: any,
        @Query('subjectAreaId') subjectAreaId: string,
        @Query('difficulty') difficulty?: string,
    ) {
        const completedExercises = await this.exercisesService.getCompletedExerciseIds(req.user.id);

        return this.adaptiveLearningService.getNextExercise(
            req.user.id,
            +subjectAreaId,
            difficulty as any || 'easy',
            completedExercises,
        );
    }

    @Get('my-progress')
    @ApiOperation({ summary: 'Get current user progress and RtI classification' })
    async getMyProgress(@Request() req: any) {
        const userId = req.user.id;

        // Get all attempts
        const attempts = await this.exercisesService.getAllAttempts(userId);

        if (attempts.length === 0) {
            return {
                totalAttempts: 0,
                correctAttempts: 0,
                totalPoints: 0,
                avgTimePerExercise: 0,
                successRate: 0,
                recentPerformance: [] as any[],
            };
        }

        // Calculate stats
        const correctAttempts = attempts.filter(a => a.isCorrect).length;
        const totalPoints = attempts.reduce((sum, a) => sum + a.pointsEarned, 0);
        const avgTime = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / attempts.length;
        const successRate = Math.round((correctAttempts / attempts.length) * 100);

        // Get recent performance for display
        const recentPerformance: any[] = await this.exercisesService.getRecentPerformances(userId, 10);

        // Calculate RtI classification
        const consecutiveFailures = this.calculateConsecutiveFailures(attempts);
        const lastActivity = attempts[0]?.createdAt || new Date();

        const rtiMetrics = {
            totalExercises: attempts.length,
            correctExercises: correctAttempts,
            avgTimePerExercise: avgTime,
            consecutiveFailures,
            lastActivityDate: lastActivity,
            weeklyProgress: 0, // TODO: Calculate from previous week
        };

        // Simple RtI classification based on success rate
        let rtiTier: 1 | 2 | 3 = 1;
        let tierLabel = 'Tier 1';
        let tierColor = 'green';
        let recommendation = 'Excelente progreso';

        if (successRate < 40) {
            rtiTier = 3;
            tierLabel = 'Tier 3';
            tierColor = 'red';
            recommendation = 'Necesita intervención intensiva';
        } else if (successRate < 60) {
            rtiTier = 2;
            tierLabel = 'Tier 2';
            tierColor = 'yellow';
            recommendation = 'Necesita apoyo adicional';
        }

        return {
            totalAttempts: attempts.length,
            correctAttempts,
            totalPoints,
            avgTimePerExercise: Math.round(avgTime),
            successRate,
            recentPerformance,
            rtiClassification: {
                tier: rtiTier,
                tierLabel,
                tierColor,
                recommendation,
            },
        };
    }

    private calculateConsecutiveFailures(attempts: any[]): number {
        let consecutive = 0;
        for (const attempt of attempts) {
            if (!attempt.isCorrect) {
                consecutive++;
            } else {
                break;
            }
        }
        return consecutive;
    }

    @Get(':id')

    @ApiOperation({ summary: 'Get exercise details (play mode)' })
    async getExercise(@Param('id') id: string) {
        return this.exercisesService.findOne(+id);
    }

    @Post(':id/submit')
    @ApiOperation({ summary: 'Submit exercise answer and get adaptive feedback' })
    async submitExercise(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { answer: any; timeSpent: number },
    ) {
        const result = await this.exercisesService.submitAttempt(
            req.user.id,
            +id,
            body.answer,
            body.timeSpent,
        );

        // Get adaptive recommendation if student has enough attempts
        const recentPerformances = await this.exercisesService.getRecentPerformances(req.user.id, 5);

        if (recentPerformances.length >= 5) {
            const exercise = await this.exercisesService.findOne(+id);
            const recommendation = await this.adaptiveLearningService.analyzePerformance(
                req.user.id,
                recentPerformances,
                exercise.difficultyLevel,
                exercise.subjectAreaId,
            );

            return {
                ...result,
                adaptiveRecommendation: recommendation,
            };
        }

        return result;
    }

    @Post()
    @ApiOperation({ summary: 'Create new exercise' })
    async create(@Body() body: any) {
        return this.exercisesService.create(body);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update exercise' })
    async update(@Param('id') id: string, @Body() body: any) {
        return this.exercisesService.update(+id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete exercise' })
    async remove(@Param('id') id: string) {
        return this.exercisesService.remove(+id);
    }
}

