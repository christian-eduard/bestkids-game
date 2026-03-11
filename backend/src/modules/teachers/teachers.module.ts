import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Class, ExerciseAttempt]),
    ],
    controllers: [TeachersController],
    providers: [TeachersService],
    exports: [TeachersService],
})
export class TeachersModule { }
