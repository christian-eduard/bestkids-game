import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Center } from '../centers/entities/center.entity';
import { User } from '../users/entities/user.entity';
import { World } from '../worlds/entities/world.entity';
import { Avatar } from '../gamification/entities/avatar.entity';
import { Achievement } from '../gamification/entities/achievement.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Center, User, World, Avatar, Achievement, Exercise]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }
