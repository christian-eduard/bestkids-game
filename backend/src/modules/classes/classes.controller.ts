import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new class' })
    create(@Request() req: any, @Body() createClassDto: any) {
        // Force teacherId to be the current user if role is teacher
        // Or if admin, allow setting teacherId
        const teacherId = req.user.role === 'teacher' ? req.user.id : createClassDto.teacherId;
        return this.classesService.create({ ...createClassDto, teacherId });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all classes for current user (teacher)' })
    findAll(@Request() req: any) {
        if (req.user.role === 'admin') {
            return this.classesService.findAll();
        }
        return this.classesService.findAllByTeacher(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get class details' })
    findOne(@Param('id') id: string) {
        return this.classesService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update class details' })
    update(@Param('id') id: string, @Body() updateClassDto: any) {
        return this.classesService.update(+id, updateClassDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Remove a class' })
    remove(@Param('id') id: string) {
        return this.classesService.remove(+id);
    }

    @Post(':id/students/:studentId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Add a student to a class' })
    addStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
        return this.classesService.addStudent(+id, +studentId);
    }

    @Delete(':id/students/:studentId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Remove a student from a class' })
    removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
        return this.classesService.removeStudent(+id, +studentId);
    }
}
