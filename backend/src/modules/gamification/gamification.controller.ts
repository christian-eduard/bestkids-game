import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get my gamification profile' })
    async getMyProfile(@Request() req: any) {
        return this.gamificationService.getOrCreateProfile(req.user.id);
    }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get leaderboard' })
    async getLeaderboard(
        @Request() req: any,
        @Query('scope') scope: 'global' | 'class' | 'center' = 'global'
    ) {
        return this.gamificationService.getLeaderboard(req.user.id, scope);
    }

    @Get('achievements')
    @ApiOperation({ summary: 'Get available achievements' })
    async getAchievements() {
        return this.gamificationService.getAllAchievements();
    }

    @Get('my-achievements')
    @ApiOperation({ summary: 'Get my unlocked achievements' })
    async getMyAchievements(@Request() req: any) {
        return this.gamificationService.getUserAchievements(req.user.id);
    }

    @Get('avatars')
    @ApiOperation({ summary: 'Get available avatars' })
    async getAvatars() {
        return this.gamificationService.getAllAvatars();
    }

    @Get('my-avatars')
    @ApiOperation({ summary: 'Get my unlocked avatars' })
    async getMyAvatars(@Request() req: any) {
        return this.gamificationService.getUserAvatars(req.user.id);
    }

    @Post('avatar/select')
    @ApiOperation({ summary: 'Select an avatar' })
    async selectAvatar(@Request() req: any, @Body() body: { avatarId: number }) {
        return this.gamificationService.selectAvatar(req.user.id, body.avatarId);
    }
}
