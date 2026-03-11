import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { User } from '../users/entities/user.entity';
import { ExerciseAttempt } from '../exercises/entities/exercise-attempt.entity';
import { Class } from '../classes/entities/class.entity';
import { Center } from '../centers/entities/center.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, ExerciseAttempt, Class, Center])],
    controllers: [ReportsController],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule { }
