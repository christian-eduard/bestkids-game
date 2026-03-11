import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { Unit } from './entities/unit.entity';
import { ExerciseOption } from './entities/exercise-option.entity';
import { UserExerciseResult } from './entities/user-exercise-result.entity';
import { SubjectArea } from './entities/subject-area.entity';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Exercise,
            Unit,
            ExerciseOption,
            UserExerciseResult,
            SubjectArea
        ]),
        GamificationModule,
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService, TypeOrmModule],
})
export class ExercisesModule { }
