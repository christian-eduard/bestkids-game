import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './entities/assignment.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Assignment, Class, User])],
    controllers: [AssignmentsController],
    providers: [AssignmentsService],
    exports: [AssignmentsService],
})
export class AssignmentsModule { }
