import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CentersService } from './centers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('centers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('centers')
export class CentersController {
    constructor(private readonly centersService: CentersService) { }

    @Get('my-center/stats')
    @ApiOperation({ summary: 'Get my center statistics' })
    async getMyCenterStats(@Request() req: any) {
        return this.centersService.getMyCenterStats(req.user.centerId);
    }

    @Get('my-center/teachers')
    @ApiOperation({ summary: 'Get teachers of my center' })
    async getTeachers(@Request() req: any) {
        return this.centersService.getTeachers(req.user.centerId);
    }

    @Get('my-center/students')
    @ApiOperation({ summary: 'Get students of my center' })
    async getStudents(@Request() req: any) {
        return this.centersService.getStudents(req.user.centerId);
    }

    @Get('my-center/classes')
    @ApiOperation({ summary: 'Get classes of my center' })
    async getClasses(@Request() req: any) {
        return this.centersService.getClasses(req.user.centerId);
    }

    @Post('teachers')
    @ApiOperation({ summary: 'Create teacher in my center' })
    async createTeacher(@Request() req: any, @Body() data: any) {
        return this.centersService.createTeacher(req.user.centerId, data);
    }

    @Post('students')
    @ApiOperation({ summary: 'Create student in my center' })
    async createStudent(@Request() req: any, @Body() data: any) {
        return this.centersService.createStudent(req.user.centerId, data);
    }

    @Post('classes')
    @ApiOperation({ summary: 'Create class in my center' })
    async createClass(@Request() req: any, @Body() data: any) {
        return this.centersService.createClass(req.user.centerId, data);
    }

    @Put('teachers/:id')
    @ApiOperation({ summary: 'Update teacher' })
    async updateTeacher(@Request() req: any, @Param('id') id: string, @Body() data: any) {
        return this.centersService.updateTeacher(+id, req.user.centerId, data);
    }

    @Put('students/:id')
    @ApiOperation({ summary: 'Update student' })
    async updateStudent(@Request() req: any, @Param('id') id: string, @Body() data: any) {
        return this.centersService.updateStudent(+id, req.user.centerId, data);
    }

    @Put('classes/:id')
    @ApiOperation({ summary: 'Update class' })
    async updateClass(@Request() req: any, @Param('id') id: string, @Body() data: any) {
        return this.centersService.updateClass(+id, req.user.centerId, data);
    }

    @Delete('teachers/:id')
    @ApiOperation({ summary: 'Deactivate teacher' })
    async deleteTeacher(@Request() req: any, @Param('id') id: string) {
        await this.centersService.deleteTeacher(+id, req.user.centerId);
        return { message: 'Teacher deactivated' };
    }

    @Delete('students/:id')
    @ApiOperation({ summary: 'Deactivate student' })
    async deleteStudent(@Request() req: any, @Param('id') id: string) {
        await this.centersService.deleteStudent(+id, req.user.centerId);
        return { message: 'Student deactivated' };
    }

    @Delete('classes/:id')
    @ApiOperation({ summary: 'Delete class' })
    async deleteClass(@Request() req: any, @Param('id') id: string) {
        await this.centersService.deleteClass(+id, req.user.centerId);
        return { message: 'Class deleted' };
    }
}
