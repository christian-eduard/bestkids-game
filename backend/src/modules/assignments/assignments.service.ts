import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(teacherId: number, data: any) {
        const assignment = this.assignmentRepository.create({
            ...data,
            teacherId,
        });
        return this.assignmentRepository.save(assignment);
    }

    async assignToClass(teacherId: number, data: { classId: number, exerciseId: number, title?: string, instructions?: string, dueDate?: string }) {
        const classEntity = await this.classRepository.findOne({
            where: { id: data.classId },
            relations: ['students'],
        });

        if (!classEntity) {
            throw new Error('Class not found');
        }

        const assignments = classEntity.students.map((student: User) => {
            return this.assignmentRepository.create({
                teacherId,
                studentId: student.id,
                classId: data.classId,
                exerciseId: data.exerciseId,
                title: data.title,
                instructions: data.instructions,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
            });
        });

        return this.assignmentRepository.save(assignments);
    }

    async findByTeacher(teacherId: number) {
        return this.assignmentRepository.find({
            where: { teacherId },
            relations: ['class', 'student', 'exercise'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByStudent(studentId: number) {
        return this.assignmentRepository.find({
            where: { studentId },
            relations: ['exercise', 'teacher', 'class'],
            order: { dueDate: 'ASC' },
        });
    }

    async update(id: number, data: any) {
        await this.assignmentRepository.update(id, data);
        return this.assignmentRepository.findOne({ where: { id } });
    }

    async delete(id: number) {
        const assignment = await this.assignmentRepository.findOne({ where: { id } });
        if (assignment) {
            await this.assignmentRepository.remove(assignment);
        }
    }

    async getTeacherStats(teacherId: number) {
        const assignments = await this.assignmentRepository.find({
            where: { teacherId },
        });

        const pending = assignments.filter((a: Assignment) => a.status === 'pending').length;
        const inProgress = assignments.filter((a: Assignment) => a.status === 'in_progress').length;
        const completed = assignments.filter((a: Assignment) => a.status === 'completed').length;
        const overdue = assignments.filter((a: Assignment) => a.status === 'overdue').length;

        const completedWithScores = assignments.filter((a: Assignment) => a.status === 'completed' && a.score !== null);
        const averageScore = completedWithScores.length > 0
            ? Math.round(completedWithScores.reduce((sum: number, a: Assignment) => sum + (a.score || 0), 0) / completedWithScores.length)
            : 0;

        return {
            totalAssignments: assignments.length,
            pending,
            inProgress,
            completed,
            overdue,
            averageScore,
        };
    }
}
