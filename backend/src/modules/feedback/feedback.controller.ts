import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Submit feedback' })
    async create(@Request() req: any, @Body() data: { message: string; category?: string; page?: string; userAgent?: string }) {
        return this.feedbackService.create({
            ...data,
            userId: req.user?.id,
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all feedback (admin only)' })
    async findAll(@Request() req: any) {
        // Only admins (roleId 1 or 2) can view feedback
        if (req.user.roleId > 2) {
            return [];
        }
        return this.feedbackService.findAll();
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get feedback stats' })
    async getStats(@Request() req: any) {
        if (req.user.roleId > 2) {
            return { total: 0, unread: 0, byCategory: [] };
        }
        return this.feedbackService.getStats();
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my own feedback history' })
    async getMyFeedback(@Request() req: any) {
        return this.feedbackService.findByUser(req.user.id);
    }

    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark feedback as read' })
    async markAsRead(@Param('id') id: string) {
        return this.feedbackService.markAsRead(+id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete feedback' })
    async delete(@Param('id') id: string) {
        await this.feedbackService.delete(+id);
        return { message: 'Feedback deleted' };
    }
}
