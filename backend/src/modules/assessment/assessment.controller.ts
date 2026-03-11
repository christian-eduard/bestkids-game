import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { RtiService } from './rti.service';
import { AdaptiveAlgorithmService } from './adaptive-algorithm.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Temporarily disabled
import { SubmitAssessmentAnswerDto } from './dto/assessment.dto';

@Controller('assessment')
// @UseGuards(JwtAuthGuard) // Temporarily disabled until guard is created
export class AssessmentController {
    constructor(
        private readonly assessmentService: AssessmentService,
        private readonly rtiService: RtiService,
        private readonly adaptiveService: AdaptiveAlgorithmService,
    ) { }

    @Post('start/:userId')
    async startAssessment(@Param('userId') userId: number) {
        return this.assessmentService.startInitialAssessment(userId);
    }

    @Get('exercises/:userId')
    async getExercises(@Param('userId') userId: number) {
        return this.assessmentService.getAssessmentExercises(userId);
    }

    @Post('submit/:userId')
    async submitAnswer(
        @Param('userId') userId: number,
        @Body() dto: SubmitAssessmentAnswerDto,
    ) {
        const result = await this.assessmentService.submitAssessmentAnswer(
            userId,
            dto.exerciseId,
            dto.isCorrect,
        );

        // Actualizar progreso adaptativo
        const exercise = await this.getExerciseDetails(dto.exerciseId);
        if (exercise) {
            await this.adaptiveService.trackResult(
                userId,
                exercise.subjectAreaId,
                dto.isCorrect,
            );
        }

        return result;
    }

    @Get('progress/:userId')
    async getProgress(@Param('userId') userId: number) {
        return this.assessmentService.getAssessmentProgress(userId);
    }

    @Get('results/:userId')
    async getResults(@Param('userId') userId: number) {
        return this.assessmentService.getAssessmentResults(userId);
    }

    @Get('complete/:userId')
    async isComplete(@Param('userId') userId: number) {
        const completed = await this.assessmentService.isAssessmentComplete(userId);
        return { completed };
    }

    // RtI Endpoints
    @Get('rti/level/:userId')
    async getRtiLevel(@Param('userId') userId: number) {
        const level = await this.rtiService.calculateOverallRtiLevel(userId);
        return { level };
    }

    @Get('rti/students/:teacherId')
    async getStudentsByRti(
        @Param('teacherId') teacherId: number,
        @Body('level') level?: string,
    ) {
        return this.rtiService.getStudentsByRtiLevel(teacherId, level as any);
    }

    @Get('rti/intervention/:userId')
    async getInterventionPlan(@Param('userId') userId: number) {
        return this.rtiService.generateInterventionPlan(userId);
    }

    // Adaptive Algorithm Endpoints
    @Get('adaptive/recommended/:userId/:subjectAreaId')
    async getRecommended(
        @Param('userId') userId: number,
        @Param('subjectAreaId') subjectAreaId: number,
    ) {
        return this.adaptiveService.getRecommendedExercises(userId, subjectAreaId);
    }

    @Get('adaptive/progress/:userId')
    async getAdaptiveProgress(@Param('userId') userId: number) {
        return this.adaptiveService.getStudentProgress(userId);
    }

    private async getExerciseDetails(exerciseId: number) {
        // Implementación simplificada - en producción retornaría del servicio
        return { id: exerciseId, subjectAreaId: 1 };
    }
}
