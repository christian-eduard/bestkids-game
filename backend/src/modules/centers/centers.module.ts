import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentersController } from './centers.controller';
import { CentersService } from './centers.service';
import { Center } from './entities/center.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Center, User, Class]),
    ],
    controllers: [CentersController],
    providers: [CentersService],
    exports: [CentersService],
})
export class CentersModule { }
