import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorshipService } from './mentorship.service';
import { MentorshipController } from './mentorship.controller';
import { MentoringSession } from './entities/mentoring-session.entity';
import { StudentTutor } from './entities/student-tutor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MentoringSession, StudentTutor])],
    controllers: [MentorshipController],
    providers: [MentorshipService],
})
export class MentorshipModule { }
