import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorldsController } from './worlds.controller';
import { WorldsService } from './worlds.service';
import { World } from './entities/world.entity';
import { WorldLevel } from './entities/world-level.entity';
import { LevelExercise } from './entities/level-exercise.entity';
import { UserLevelProgress } from './entities/user-level-progress.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            World,
            WorldLevel,
            LevelExercise,
            UserLevelProgress,
        ]),
    ],
    controllers: [WorldsController],
    providers: [WorldsService],
    exports: [WorldsService],
})
export class WorldsModule { }
