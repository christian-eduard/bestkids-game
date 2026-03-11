import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('admin')
    @ApiOperation({ summary: 'Get system wide statistics' })

    async getAdminStats() {
        const overview = await this.analyticsService.getSystemStats();
        const activity = await this.analyticsService.getActivityTrend(7);

        return {
            overview,
            activity
        };
    }

    @Get('admin/advanced')
    @ApiOperation({ summary: 'Get advanced usage stats for admin dashboard' })
    async getAdvancedStats() {
        return this.analyticsService.getAdvancedStats();
    }
}
