import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportReason } from './entities/moderation-report.entity';

@ApiTags('moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard)
export class ModerationController {
    constructor(private readonly moderationService: ModerationService) { }

    @Post('report')
    @ApiOperation({ summary: 'Submit a moderation report' })
    async createReport(@Request() req: any, @Body() body: { reportedUserId?: number, reason: ReportReason, description?: string }) {
        return this.moderationService.createReport(req.user.id, body);
    }

    @Get('reports')
    @ApiOperation({ summary: 'Get all reports (Admin only)' })
    async getReports() {
        // Add Role Guard check here
        return this.moderationService.findAllReports();
    }

    @Patch('reports/:id/resolve')
    @ApiOperation({ summary: 'Resolve a report' })
    async resolveReport(@Param('id') id: string, @Body() body: { status: 'resolved' | 'dismissed' }) {
        return this.moderationService.resolveReport(+id, body.status);
    }
}
