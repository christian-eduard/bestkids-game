import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { GamificationProfile } from './entities/gamification-profile.entity';
import { Avatar } from './entities/avatar.entity';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        GamificationProfile,
        Avatar,
        Achievement,
        UserAchievement,
    ])],
    controllers: [GamificationController],
    providers: [GamificationService],
    exports: [GamificationService],
})
export class GamificationModule { }
