import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MentorshipService } from './mentorship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('mentorship')
@Controller('mentorship')
@UseGuards(JwtAuthGuard)
export class MentorshipController {
    constructor(private readonly mentorshipService: MentorshipService) { }

    @Post('assign')
    @ApiOperation({ summary: 'Assign a tutor to a student (Admin/Teacher only)' })
    async assignTutor(@Body() body: { studentId: number; tutorId: number }) {
        return this.mentorshipService.assignTutor(body.studentId, body.tutorId);
    }

    @Post('sessions')
    @ApiOperation({ summary: 'Schedule a mentoring session' })
    async scheduleSession(@Request() req: any, @Body() body: { studentId: number; date: string; notes?: string }) {
        // Assume req.user is the tutor for now, strictly
        return this.mentorshipService.scheduleSession(req.user.id, body.studentId, new Date(body.date), body.notes);
    }

    @Get('sessions')
    @ApiOperation({ summary: 'Get my scheduled sessions' })
    async getMySessions(@Request() req: any) {
        return this.mentorshipService.getUserSessions(req.user.id, req.user.role);
    }
}
