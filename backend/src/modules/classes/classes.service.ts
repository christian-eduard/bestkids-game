import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private classesRepository: Repository<Class>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(data: any) {
        const newClass = this.classesRepository.create(data);
        return this.classesRepository.save(newClass);
    }

    async findAll() {
        return this.classesRepository.find({
            relations: ['teacher', 'students', 'center'],
            order: { createdAt: 'DESC' }
        });
    }

    async findAllByTeacher(teacherId: number) {
        return this.classesRepository.find({
            where: { teacherId },
            relations: ['students'],
            order: { name: 'ASC' }
        });
    }

    async findOne(id: number) {
        const classEntity = await this.classesRepository.findOne({
            where: { id },
            relations: ['teacher', 'students', 'center'],
        });

        if (!classEntity) throw new NotFoundException('Class not found');
        return classEntity;
    }

    async update(id: number, data: any) {
        await this.classesRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number) {
        // Logic: Should we set student class_id to null? Yes.
        const classEntity = await this.findOne(id);

        // Remove students from class first
        if (classEntity.students.length > 0) {
            await this.usersRepository.update(
                classEntity.students.map(s => s.id),
                { classId: null }
            );
        }

        return this.classesRepository.delete(id);
    }

    async addStudent(classId: number, studentId: number) {
        const classEntity = await this.findOne(classId);
        const student = await this.usersRepository.findOne({ where: { id: studentId } });

        if (!student) throw new NotFoundException('Student not found');

        student.classId = classId;
        return this.usersRepository.save(student);
    }

    async removeStudent(classId: number, studentId: number) {
        const student = await this.usersRepository.findOne({
            where: { id: studentId, classId }
        });

        if (!student) throw new NotFoundException('Student not found in this class');

        student.classId = null;
        return this.usersRepository.save(student);
    }
}
