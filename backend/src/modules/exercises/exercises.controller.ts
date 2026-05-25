import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Get('units/:worldId')
    @ApiOperation({ summary: 'Obtener unidades de un mundo' })
    async getUnits(@Param('worldId') worldId: string) {
        return this.exercisesService.getUnitsByWorld(+worldId);
    }

    @Get('subjects')
    @ApiOperation({ summary: 'Obtener materias/áreas de aprendizaje' })
    async getSubjects() {
        return this.exercisesService.getSubjectAreas();
    }

    @Get('unit/:unitId')
    @ApiOperation({ summary: 'Obtener ejercicios de una unidad con dificultad adaptativa' })
    async getExercises(
        @Request() req: any,
        @Param('unitId') unitId: string
    ) {
        return this.exercisesService.getExercisesByUnit(+unitId, req.user.userId || req.user.id);
    }

    @Post('submit')
    @ApiOperation({ summary: 'Enviar respuesta a un ejercicio' })
    @ApiResponse({ status: 200, description: 'Resultado de la validación y premios' })
    async submitAnswer(
        @Request() req: any,
        @Body() body: { exerciseId: number; answer: any; responseTimeMs: number }
    ) {
        return this.exercisesService.submitAnswer(
            req.user.userId || req.user.id,
            body.exerciseId,
            body.answer,
            body.responseTimeMs
        );
    }

    @Get('stats/:userId')
    @ApiOperation({ summary: 'Estadísticas de ejercicio del usuario' })
    async getUserStats(@Param('userId') userId: string) {
        return this.exercisesService.getUserStats(+userId);
    }

    // Panel Master
    @Post('unit')
    @ApiOperation({ summary: 'Crear nueva unidad (Master)' })
    async createUnit(@Body() body: any) {
        return this.exercisesService.createUnit(body);
    }

    @Post('exercise')
    @ApiOperation({ summary: 'Crear nuevo ejercicio (Master)' })
    async createExercise(@Body() body: any) {
        return this.exercisesService.createExercise(body);
    }

    @Get('unit/:unitId/raw')
    @ApiOperation({ summary: 'Obtener todos los ejercicios de una unidad crudos (Master)' })
    async getExercisesRaw(@Param('unitId') unitId: string) {
        return this.exercisesService.getExercisesRaw(+unitId);
    }

    @Get('exercise/:id')
    @ApiOperation({ summary: 'Obtener un ejercicio por ID' })
    async getExercise(@Param('id') id: string) {
        return this.exercisesService.findOne(+id);
    }

    @Put('unit/:id')
    @ApiOperation({ summary: 'Editar unidad (Master)' })
    async updateUnit(@Param('id') id: string, @Body() body: any) {
        return this.exercisesService.updateUnit(+id, body);
    }

    @Delete('unit/:id')
    @ApiOperation({ summary: 'Eliminar unidad (Master)' })
    async deleteUnit(@Param('id') id: string) {
        return this.exercisesService.deleteUnit(+id);
    }

    @Put('exercise/:id')
    @ApiOperation({ summary: 'Editar ejercicio (Master)' })
    async updateExercise(@Param('id') id: string, @Body() body: any) {
        return this.exercisesService.updateExercise(+id, body);
    }

    @Delete('exercise/:id')
    @ApiOperation({ summary: 'Eliminar ejercicio (Master)' })
    async deleteExercise(@Param('id') id: string) {
        return this.exercisesService.deleteExercise(+id);
    }

    @Post('exercise/:id/duplicate')
    @ApiOperation({ summary: 'Duplicar ejercicio (Master)' })
    async duplicateExercise(@Param('id') id: string) {
        return this.exercisesService.duplicateExercise(+id);
    }
}
