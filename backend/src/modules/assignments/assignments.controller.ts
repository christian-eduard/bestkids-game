import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create assignment (teacher)' })
    async create(@Request() req: any, @Body() data: any) {
        return this.assignmentsService.create(req.user.id, data);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create bulk assignments for multiple students' })
    async createBulk(@Request() req: any, @Body() data: { studentIds: number[]; exerciseId: number; title?: string; instructions?: string; dueDate?: string }) {
        const results = [];
        for (const studentId of data.studentIds) {
            const assignment = await this.assignmentsService.create(req.user.id, {
                studentId,
                exerciseId: data.exerciseId,
                title: data.title,
                instructions: data.instructions,
                dueDate: data.dueDate,
            });
            results.push(assignment);
        }
        return results;
    }

    @Post('class')
    @ApiOperation({ summary: 'Assign exercise to a whole class' })
    async assignToClass(@Request() req: any, @Body() data: { classId: number; exerciseId: number; title?: string; instructions?: string; dueDate?: string }) {
        return this.assignmentsService.assignToClass(req.user.id, data);
    }

    @Get('teacher')
    @ApiOperation({ summary: 'Get all assignments created by teacher' })
    async getTeacherAssignments(@Request() req: any) {
        return this.assignmentsService.findByTeacher(req.user.id);
    }

    @Get('teacher/stats')
    @ApiOperation({ summary: 'Get teacher assignment stats' })
    async getTeacherStats(@Request() req: any) {
        return this.assignmentsService.getTeacherStats(req.user.id);
    }

    @Get('my-assignments')
    @ApiOperation({ summary: 'Get my assignments (teacher or student)' })
    async getMyAssignments(@Request() req: any) {
        if (req.user.roleId === 3) { // TEACHER
            return this.assignmentsService.findByTeacher(req.user.id);
        } else if (req.user.roleId === 5) { // STUDENT
            return this.assignmentsService.findByStudent(req.user.id);
        }
        return [];
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update assignment' })
    async update(@Param('id') id: string, @Body() data: any) {
        return this.assignmentsService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete assignment' })
    async delete(@Param('id') id: string) {
        await this.assignmentsService.delete(+id);
        return { message: 'Assignment deleted' };
    }
}
