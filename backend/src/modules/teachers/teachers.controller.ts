import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }

    @Get('my-classes')
    @ApiOperation({ summary: 'Get my classes as teacher' })
    async getMyClasses(@Request() req: any) {
        return this.teachersService.getMyClasses(req.user.id);
    }

    @Get('classes/:id')
    @ApiOperation({ summary: 'Get class details with student stats' })
    async getClassDetails(@Param('id') id: string, @Request() req: any) {
        return this.teachersService.getClassDetails(+id, req.user.id);
    }

    @Get('students/:id')
    @ApiOperation({ summary: 'Get student details and progress' })
    async getStudentDetails(@Param('id') id: string) {
        return this.teachersService.getStudentDetails(+id);
    }

    @Get('students-by-tier/:tier')
    @ApiOperation({ summary: 'Get students by RtI tier' })
    async getStudentsByTier(@Param('tier') tier: string, @Request() req: any) {
        return this.teachersService.getStudentsByTier(req.user.id, +tier as 1 | 2 | 3);
    }

    @Get('classes/:id/performance')
    @ApiOperation({ summary: 'Get class performance evolution over time' })
    async getClassPerformanceEvolution(@Param('id') id: string, @Request() req: any) {
        return this.teachersService.getClassPerformanceEvolution(+id, req.user.id);
    }
}
