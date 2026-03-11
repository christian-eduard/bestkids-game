
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { User } from '../users/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { UserExerciseResult } from '../exercises/entities/user-exercise-result.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Exercise, UserExerciseResult]),
    ],
    controllers: [EvaluationsController],
    providers: [EvaluationsService],
    exports: [EvaluationsService],
})
export class EvaluationsModule { }
