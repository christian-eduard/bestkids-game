import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../progress/entities/exercise-attempt.entity';
import { Assignment } from '../assignments/entities/assignment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ExerciseAttempt, Assignment]),
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule { }
