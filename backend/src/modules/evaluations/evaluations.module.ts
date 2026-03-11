
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { User } from '../users/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExerciseAttempt } from '../progress/entities/exercise-attempt.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Exercise, ExerciseAttempt]),
    ],
    controllers: [EvaluationsController],
    providers: [EvaluationsService],
    exports: [EvaluationsService],
})
export class EvaluationsModule { }
