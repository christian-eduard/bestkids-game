import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { SubjectArea } from './entities/subject-area.entity';
import { ExerciseAttempt } from './entities/exercise-attempt.entity';
import { GamificationModule } from '../gamification/gamification.module';
import { AdaptiveLearningService } from './services/adaptive-learning.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Exercise, SubjectArea, ExerciseAttempt]),
        GamificationModule,
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService, AdaptiveLearningService],
    exports: [ExercisesService, AdaptiveLearningService],
})
export class ExercisesModule { }


