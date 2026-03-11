import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(+id);
    }

    @Post()
    create(@Body() body: any) { // DTOs should be used in prod
        return this.coursesService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.coursesService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(+id);
    }

    // Units
    @Post(':id/units')
    createUnit(@Param('id') courseId: string, @Body() body: any) {
        return this.coursesService.createUnit(+courseId, body);
    }

    @Patch('units/:id')
    updateUnit(@Param('id') unitId: string, @Body() body: any) {
        return this.coursesService.updateUnit(+unitId, body);
    }

    @Delete('units/:id')
    deleteUnit(@Param('id') unitId: string) {
        return this.coursesService.deleteUnit(+unitId);
    }
}
