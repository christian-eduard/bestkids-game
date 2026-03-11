import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Center } from '../centers/entities/center.entity';
import { User } from '../users/entities/user.entity';
import { World } from '../worlds/entities/world.entity';
import { Avatar } from '../gamification/entities/avatar.entity';
import { Achievement } from '../gamification/entities/achievement.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Center)
        private centerRepository: Repository<Center>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(World)
        private worldRepository: Repository<World>,
        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
        @InjectRepository(Achievement)
        private achievementRepository: Repository<Achievement>,
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
    ) { }

    // ============ ANALYTICS ============

    async getGlobalStats() {
        const centers = await this.centerRepository.count({ where: { isActive: true } });
        const teachers = await this.userRepository.count({ where: { roleId: 3, isActive: true } });
        const students = await this.userRepository.count({ where: { roleId: 5, isActive: true } });
        const worlds = await this.worldRepository.count({ where: { isActive: true } });

        return {
            centers,
            teachers,
            students,
            worlds,
        };
    }

    // ============ CENTERS CRUD ============

    async getAllCenters() {
        return this.centerRepository.find({
            order: { name: 'ASC' },
        });
    }

    async createCenter(data: any) {
        const center = this.centerRepository.create(data);
        return this.centerRepository.save(center);
    }

    async updateCenter(id: number, data: any) {
        await this.centerRepository.update(id, data);
        return this.centerRepository.findOne({ where: { id } });
    }

    async deleteCenter(id: number) {
        await this.centerRepository.update(id, { isActive: false });
    }

    // ============ AVATARS CRUD ============

    async getAllAvatars() {
        return this.avatarRepository.find({
            order: { unlockPointsRequired: 'ASC' },
        });
    }

    async createAvatar(data: any) {
        const avatar = this.avatarRepository.create(data);
        return this.avatarRepository.save(avatar);
    }

    async updateAvatar(id: number, data: any) {
        await this.avatarRepository.update(id, data);
        return this.avatarRepository.findOne({ where: { id } });
    }

    async deleteAvatar(id: number) {
        await this.avatarRepository.delete(id);
    }

    // ============ ACHIEVEMENTS CRUD ============

    async getAllAchievements() {
        return this.achievementRepository.find({
            order: { name: 'ASC' },
        });
    }

    async createAchievement(data: any) {
        const achievement = this.achievementRepository.create(data);
        return this.achievementRepository.save(achievement);
    }

    async updateAchievement(id: number, data: any) {
        await this.achievementRepository.update(id, data);
        return this.achievementRepository.findOne({ where: { id } });
    }

    async deleteAchievement(id: number) {
        await this.achievementRepository.delete(id);
    }

    // ============ WORLDS CRUD (Admin UI) ============

    async getAllWorlds() {
        return this.worldRepository.find({
            relations: ['levels'],
            order: { orderIndex: 'ASC' },
        });
    }

    // ============ EXERCISES CRUD ============

    async getAllExercises() {
        return this.exerciseRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
}
