import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { AreaProgress } from './entities/area-progress.entity';
import { ExerciseAttempt } from './entities/exercise-attempt.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AreaProgress, ExerciseAttempt])],
    controllers: [ProgressController],
    providers: [ProgressService],
    exports: [ProgressService],
})
export class ProgressModule { }
