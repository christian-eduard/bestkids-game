import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get global statistics' })
    async getGlobalStats() {
        return this.adminService.getGlobalStats();
    }

    // ============ CENTERS ============

    @Get('centers')
    @ApiOperation({ summary: 'Get all centers' })
    async getAllCenters() {
        return this.adminService.getAllCenters();
    }

    @Get('exercises')
    @ApiOperation({ summary: 'Get all exercises' })
    async getAllExercises() {
        return this.adminService.getAllExercises();
    }

    @Post('centers')
    @ApiOperation({ summary: 'Create center' })
    async createCenter(@Body() data: any) {
        return this.adminService.createCenter(data);
    }

    @Put('centers/:id')
    @ApiOperation({ summary: 'Update center' })
    async updateCenter(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateCenter(+id, data);
    }

    @Delete('centers/:id')
    @ApiOperation({ summary: 'Deactivate center' })
    async deleteCenter(@Param('id') id: string) {
        await this.adminService.deleteCenter(+id);
        return { message: 'Center deactivated' };
    }

    // ============ AVATARS ============

    @Get('avatars')
    @ApiOperation({ summary: 'Get all avatars' })
    async getAllAvatars() {
        return this.adminService.getAllAvatars();
    }

    @Post('avatars')
    @ApiOperation({ summary: 'Create avatar' })
    async createAvatar(@Body() data: any) {
        return this.adminService.createAvatar(data);
    }

    @Put('avatars/:id')
    @ApiOperation({ summary: 'Update avatar' })
    async updateAvatar(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateAvatar(+id, data);
    }

    @Delete('avatars/:id')
    @ApiOperation({ summary: 'Delete avatar' })
    async deleteAvatar(@Param('id') id: string) {
        await this.adminService.deleteAvatar(+id);
        return { message: 'Avatar deleted' };
    }

    // ============ ACHIEVEMENTS ============

    @Get('achievements')
    @ApiOperation({ summary: 'Get all achievements' })
    async getAllAchievements() {
        return this.adminService.getAllAchievements();
    }

    @Post('achievements')
    @ApiOperation({ summary: 'Create achievement' })
    async createAchievement(@Body() data: any) {
        return this.adminService.createAchievement(data);
    }

    @Put('achievements/:id')
    @ApiOperation({ summary: 'Update achievement' })
    async updateAchievement(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateAchievement(+id, data);
    }

    @Delete('achievements/:id')
    @ApiOperation({ summary: 'Delete achievement' })
    async deleteAchievement(@Param('id') id: string) {
        await this.adminService.deleteAchievement(+id);
        return { message: 'Achievement deleted' };
    }

    // ============ WORLDS ============

    @Get('worlds')
    @ApiOperation({ summary: 'Get all worlds (admin view)' })
    async getAllWorlds() {
        return this.adminService.getAllWorlds();
    }
}
