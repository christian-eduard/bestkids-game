import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Get()
    @ApiOperation({ summary: 'Get all subject area progress for current user' })
    async getAllProgress(@Request() req: any) {
        return this.progressService.getAllAreasProgress(req.user.id);
    }

    @Get('area/:subjectAreaId')
    @ApiOperation({ summary: 'Get progress for a specific subject area' })
    async getAreaProgress(
        @Request() req: any,
        @Param('subjectAreaId') subjectAreaId: string,
    ) {
        return this.progressService.getAreaProgress(req.user.id, +subjectAreaId);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get exercise attempt history' })
    async getAttemptHistory(@Request() req: any) {
        return this.progressService.getAttemptHistory(req.user.id);
    }

    @Get('activity')
    @ApiOperation({ summary: 'Get recent activity (last 7 days)' })
    async getRecentActivity(@Request() req: any) {
        return this.progressService.getRecentActivity(req.user.id);
    }

    @Get('exercise/:exerciseId')
    @ApiOperation({ summary: 'Get attempts for a specific exercise' })
    async getExerciseAttempts(
        @Request() req: any,
        @Param('exerciseId') exerciseId: string,
    ) {
        return this.progressService.getExerciseAttempts(req.user.id, +exerciseId);
    }
}
