import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Center } from '../centers/entities/center.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class CentersService {
    constructor(
        @InjectRepository(Center)
        private centerRepository: Repository<Center>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
    ) { }

    async getMyCenterStats(centerId: number) {
        const center = await this.centerRepository.findOne({
            where: { id: centerId },
        });

        const teachers = await this.userRepository.count({
            where: { centerId, roleId: 3 }, // TEACHER
        });

        const students = await this.userRepository.count({
            where: { centerId, roleId: 5 }, // STUDENT
        });

        const classes = await this.classRepository.count({
            where: { centerId },
        });

        return {
            center,
            stats: {
                teachers,
                students,
                classes,
            },
        };
    }

    async getTeachers(centerId: number) {
        return this.userRepository.find({
            where: { centerId, roleId: 3 },
            select: ['id', 'firstName', 'lastName', 'email', 'isActive'],
        });
    }

    async getStudents(centerId: number) {
        return this.userRepository.find({
            where: { centerId, roleId: 5 },
            select: ['id', 'firstName', 'lastName', 'email', 'isActive'],
        });
    }

    async getClasses(centerId: number) {
        return this.classRepository.find({
            where: { centerId },
            relations: ['teacher', 'students'],
        });
    }

    async createTeacher(centerId: number, data: any) {
        const teacher = this.userRepository.create({
            ...data,
            centerId,
            roleId: 3, // TEACHER
        });
        return this.userRepository.save(teacher);
    }

    async createStudent(centerId: number, data: any) {
        const student = this.userRepository.create({
            ...data,
            centerId,
            roleId: 5, // STUDENT
        });
        return this.userRepository.save(student);
    }

    async createClass(centerId: number, data: any) {
        const classEntity = this.classRepository.create({
            ...data,
            centerId,
        });
        return this.classRepository.save(classEntity);
    }

    async updateTeacher(id: number, centerId: number, data: any) {
        await this.userRepository.update({ id, centerId, roleId: 3 }, data);
        return this.userRepository.findOne({ where: { id, centerId, roleId: 3 } });
    }

    async updateStudent(id: number, centerId: number, data: any) {
        await this.userRepository.update({ id, centerId, roleId: 5 }, data);
        return this.userRepository.findOne({ where: { id, centerId, roleId: 5 } });
    }

    async updateClass(id: number, centerId: number, data: any) {
        await this.classRepository.update({ id, centerId }, data);
        return this.classRepository.findOne({ where: { id, centerId } });
    }

    async deleteTeacher(id: number, centerId: number) {
        await this.userRepository.update({ id, centerId, roleId: 3 }, { isActive: false });
    }

    async deleteStudent(id: number, centerId: number) {
        await this.userRepository.update({ id, centerId, roleId: 5 }, { isActive: false });
    }

    async deleteClass(id: number, centerId: number) {
        await this.classRepository.delete({ id, centerId });
    }
}
