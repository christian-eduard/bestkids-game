import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamificationProfile } from './entities/gamification-profile.entity';
import { Avatar } from './entities/avatar.entity';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';

@Injectable()
export class GamificationService implements OnModuleInit {
    constructor(
        @InjectRepository(GamificationProfile)
        private profileRepository: Repository<GamificationProfile>,
        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
        @InjectRepository(Achievement)
        private achievementRepository: Repository<Achievement>,
        @InjectRepository(UserAchievement)
        private userAchievementRepository: Repository<UserAchievement>,
    ) { }

    async onModuleInit() {
        console.log('✅ Gamification Service initialized');
    }

    async getProfile(userId: number) {
        try {
            let profile = await this.profileRepository.findOne({
                where: { userId },
                relations: ['user']
            });
            if (!profile) {
                console.log(`Creating profile for user ${userId}`);
                profile = this.profileRepository.create({
                    userId,
                    totalPoints: 0,
                    currentLevel: 1,
                    dailyPoints: 0,
                    weeklyPoints: 0,
                    monthlyPoints: 0
                });
                await this.profileRepository.save(profile);

                profile = await this.profileRepository.findOne({
                    where: { userId },
                    relations: ['user']
                });
            }
            return profile;
        } catch (error) {
            console.error('Error in getProfile:', error);
            throw error;
        }
    }

    async addPoints(userId: number, amount: number) {
        const profile = await this.getProfile(userId);
        if (!profile) return null;

        profile.totalPoints += amount;
        profile.experiencePoints += amount;
        profile.dailyPoints += amount;
        profile.weeklyPoints += amount;
        profile.monthlyPoints += amount;
        profile.lastActivityDate = new Date();

        const pointsForNext = profile.currentLevel * 1000;
        if (profile.experiencePoints >= pointsForNext) {
            profile.currentLevel++;
        }

        return this.profileRepository.save(profile);
    }

    async getAllAvatars() {
        return this.avatarRepository.find({
            order: { unlockPointsRequired: 'ASC' },
        });
    }

    async getUnlockedAvatars(userId: number) {
        const profile = await this.getProfile(userId);
        if (!profile) return [];
        const avatars = await this.getAllAvatars();

        return avatars.map(avatar => ({
            ...avatar,
            isUnlocked: profile.totalPoints >= avatar.unlockPointsRequired &&
                profile.currentLevel >= avatar.unlockLevelRequired,
            isSelected: profile.selectedAvatarId === avatar.id,
        }));
    }

    async selectAvatar(userId: number, avatarId: number) {
        const profile = await this.getProfile(userId);
        if (!profile) throw new NotFoundException('Profile not found');
        const avatar = await this.avatarRepository.findOne({ where: { id: avatarId } });

        if (!avatar) {
            throw new NotFoundException('Avatar not found');
        }

        if (profile.totalPoints < avatar.unlockPointsRequired ||
            profile.currentLevel < avatar.unlockLevelRequired) {
            throw new BadRequestException('Avatar not unlocked yet');
        }

        profile.selectedAvatarId = avatarId;
        await this.profileRepository.save(profile);

        return { success: true, selectedAvatar: avatar };
    }

    async updateAvatar(userId: number, avatarData: any) {
        const profile = await this.getProfile(userId);
        if (!profile) throw new NotFoundException('Profile not found');

        // Avatar customization would go here
        return this.profileRepository.save(profile);
    }

    async getProfileFrames(userId: number) {
        const profile = await this.getProfile(userId);
        const frames = [
            { id: 1, name: 'Novato', color: '#CBD5E1', minPoints: 0 },
            { id: 2, name: 'Explorador', color: '#60A5FA', minPoints: 1000 },
            { id: 3, name: 'Veterano', color: '#A855F7', minPoints: 5000 },
            { id: 4, name: 'Leyenda', color: '#F59E0B', minPoints: 15000 },
            { id: 5, name: 'BestKid Master', color: '#EF4444', minPoints: 50000 },
        ];

        return frames.map(f => ({
            ...f,
            isUnlocked: profile.totalPoints >= f.minPoints
        }));
    }

    async updateStreak(userId: number) {
        const profile = await this.getProfile(userId);
        const today = new Date();
        const lastActivity = profile.lastActivityDate ? new Date(profile.lastActivityDate) : null;

        if (!lastActivity) {
            profile.currentStreakDays = 1;
        } else {
            const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 3600 * 24));
            if (diffDays === 1) {
                profile.currentStreakDays += 1;
            } else if (diffDays > 1) {
                profile.currentStreakDays = 1;
            }
        }

        // Multiplier bonus: 10% per streak day (up to 50%)
        const bonusMultiplier = Math.min(profile.currentStreakDays * 0.1, 0.5);
        return { profile, bonusMultiplier };
    }

    async getAllAchievements() {
        return this.achievementRepository.find();
    }

    async getUserAchievements(userId: number) {
        const allAchievements = await this.getAllAchievements();
        const userAchievements = await this.userAchievementRepository.find({
            where: { userId },
            relations: ['achievement'],
        });

        return allAchievements.map(achievement => ({
            ...achievement,
            isUnlocked: userAchievements.some((ua: any) => ua.achievementId === achievement.id),
            progress: 0, // Progress tracking would go here
        }));
    }

    async claimAchievement(userId: number, achievementId: number) {
        const userAchievement = await this.userAchievementRepository.findOne({
            where: { userId, achievementId },
        });

        if (!userAchievement) {
            throw new NotFoundException('Achievement not found or not unlocked');
        }

        // Mark as claimed in future implementation
        // userAchievement.claimedAt = new Date();
        await this.userAchievementRepository.save(userAchievement);

        await this.addPoints(userId, userAchievement.achievement?.pointsReward || 0);

        return { success: true, achievement: userAchievement };
    }

    async getLeaderboard(userId: number, scope: 'global' | 'class' | 'center' = 'global') {
        const profiles = await this.profileRepository.find({
            relations: ['user'],
            order: { totalPoints: 'DESC' },
            take: 50,
        });

        const leaderboard = profiles.map((profile, index) => ({
            userId: profile.userId,
            userName: profile.user?.firstName + ' ' + profile.user?.lastName || 'Usuario',
            totalPoints: profile.totalPoints,
            level: profile.currentLevel,
            rank: index + 1,
        }));

        const myProfile = profiles.find(p => p.userId === userId);
        const myRank = myProfile ? {
            userId: myProfile.userId,
            userName: myProfile.user?.firstName + ' ' + myProfile.user?.lastName || 'Usuario',
            totalPoints: myProfile.totalPoints,
            level: myProfile.currentLevel,
            rank: profiles.findIndex(p => p.userId === userId) + 1,
        } : null;

        return { leaderboard, myRank };
    }

    async getWeeklyLeaderboard(limit = 10) {
        return this.profileRepository.find({
            relations: ['user'],
            order: { weeklyPoints: 'DESC' },
            take: limit,
        });
    }

    async resetDaily() {
        const profiles = await this.profileRepository.find();
        for (const profile of profiles) {
            profile.dailyPoints = 0;
        }
        await this.profileRepository.save(profiles);
    }

    async getOrCreateProfile(userId: number) {
        return this.getProfile(userId);
    }

    async getUserAvatars(userId: number) {
        return this.getUnlockedAvatars(userId);
    }
}
