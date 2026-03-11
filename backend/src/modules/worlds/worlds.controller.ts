import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('worlds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('worlds')
export class WorldsController {
    constructor(private readonly worldsService: WorldsService) { }

    // ============ WORLDS ============

    @Get()
    @ApiOperation({ summary: 'Get all worlds for current user' })
    async getWorlds(@Request() req: any) {
        // If student, return with unlock status
        if (req.user.roleId === 5) { // STUDENT
            return this.worldsService.findWorldsForStudent(req.user.id);
        }
        // For other roles, return all worlds
        return this.worldsService.findAllWorlds();
    }

    @Get('levels/:id')
    @ApiOperation({ summary: 'Get level details' })
    async getLevel(@Param('id') id: string) {
        return this.worldsService.findLevelById(+id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get world details' })
    async getWorld(@Param('id') id: string) {
        return this.worldsService.findOneWorld(+id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new world (admin only)' })
    async createWorld(@Body() data: any) {
        return this.worldsService.createWorld(data);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update world (admin only)' })
    async updateWorld(@Param('id') id: string, @Body() data: any) {
        return this.worldsService.updateWorld(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete world (admin only)' })
    async deleteWorld(@Param('id') id: string) {
        await this.worldsService.deleteWorld(+id);
        return { message: 'World deleted successfully' };
    }

    // ============ LEVELS ============

    @Get(':worldId/levels')
    @ApiOperation({ summary: 'Get levels for a world' })
    async getLevels(@Param('worldId') worldId: string, @Request() req: any) {
        // If student, return with unlock status
        if (req.user.roleId === 5) {
            return this.worldsService.findLevelsForStudent(+worldId, req.user.id);
        }
        return this.worldsService.findLevelsByWorld(+worldId);
    }

    @Post('levels')
    @ApiOperation({ summary: 'Create new level (admin only)' })
    async createLevel(@Body() data: any) {
        return this.worldsService.createLevel(data);
    }

    @Put('levels/:id')
    @ApiOperation({ summary: 'Update level (admin only)' })
    async updateLevel(@Param('id') id: string, @Body() data: any) {
        return this.worldsService.updateLevel(+id, data);
    }

    @Delete('levels/:id')
    @ApiOperation({ summary: 'Delete level (admin only)' })
    async deleteLevel(@Param('id') id: string) {
        await this.worldsService.deleteLevel(+id);
        return { message: 'Level deleted successfully' };
    }

    // ============ LEVEL EXERCISES ============

    @Post('levels/:levelId/exercises/:exerciseId')
    @ApiOperation({ summary: 'Add exercise to level (admin only)' })
    async addExerciseToLevel(
        @Param('levelId') levelId: string,
        @Param('exerciseId') exerciseId: string,
        @Body() data: { orderIndex?: number }
    ) {
        return this.worldsService.addExerciseToLevel(+levelId, +exerciseId, data.orderIndex);
    }

    @Delete('levels/:levelId/exercises/:exerciseId')
    @ApiOperation({ summary: 'Remove exercise from level (admin only)' })
    async removeExerciseFromLevel(
        @Param('levelId') levelId: string,
        @Param('exerciseId') exerciseId: string
    ) {
        await this.worldsService.removeExerciseFromLevel(+levelId, +exerciseId);
        return { message: 'Exercise removed from level' };
    }

    // ============ USER PROGRESS ============

    @Get('progress/me')
    @ApiOperation({ summary: 'Get my progress across all worlds' })
    async getMyProgress(@Request() req: any) {
        return this.worldsService.getUserProgress(req.user.id);
    }

    @Post('progress/level/:levelId/complete')
    @ApiOperation({ summary: 'Mark exercise as completed in level' })
    async completeExercise(
        @Request() req: any,
        @Param('levelId') levelId: string
    ) {
        return this.worldsService.updateUserProgress(req.user.id, +levelId, true);
    }
}
