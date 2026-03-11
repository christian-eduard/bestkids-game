
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) { }

    @Get('placement-test')
    @ApiOperation({ summary: 'Get exercises for placement test' })
    async getPlacementTest() {
        return this.evaluationsService.generatePlacementTest();
    }

    @Post('placement-test')
    @ApiOperation({ summary: 'Submit placement test answers' })
    async submitPlacementTest(
        @Request() req: any,
        @Body() body: { answers: { exerciseId: number, isCorrect: boolean }[] }
    ) {
        return this.evaluationsService.submitPlacementTest(req.user.id, body.answers);
    }
}
