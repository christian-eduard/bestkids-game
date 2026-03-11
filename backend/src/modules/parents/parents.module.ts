import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ExerciseAttempt]),
    ],
    controllers: [ParentsController],
    providers: [ParentsService],
    exports: [ParentsService],
})
export class ParentsModule { }
