import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentoringSession } from './entities/mentoring-session.entity';
import { StudentTutor } from './entities/student-tutor.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MentorshipService {
    constructor(
        @InjectRepository(MentoringSession)
        private sessionRepo: Repository<MentoringSession>,
        @InjectRepository(StudentTutor)
        private assignmentRepo: Repository<StudentTutor>,
    ) { }

    // Assign Tutor
    async assignTutor(studentId: number, tutorId: number) {
        const assignment = this.assignmentRepo.create({ studentId, tutorId });
        return this.assignmentRepo.save(assignment);
    }

    // Schedule Session
    async scheduleSession(tutorId: number, studentId: number, date: Date, notes?: string) {
        const session = this.sessionRepo.create({
            tutorId,
            studentId,
            scheduledAt: date,
            notes,
            status: 'scheduled'
        });
        return this.sessionRepo.save(session);
    }

    // Get My Sessions (as Tutor or Student)
    async getUserSessions(userId: number, role: string) {
        if (role === 'teacher' || role === 'admin') {
            return this.sessionRepo.find({
                where: { tutorId: userId },
                relations: ['student'],
                order: { scheduledAt: 'ASC' }
            });
        } else {
            return this.sessionRepo.find({
                where: { studentId: userId },
                relations: ['tutor'],
                order: { scheduledAt: 'ASC' }
            });
        }
    }
}
