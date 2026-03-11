import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Unit } from './entities/unit.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(Unit)
        private unitsRepository: Repository<Unit>,
    ) { }

    // COURSES CRUD
    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find({
            relations: ['units', 'units.exercises'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepository.findOne({
            where: { id },
            relations: ['units', 'units.exercises'],
        });
        if (!course) throw new NotFoundException(`Course ${id} not found`);
        return course;
    }

    async create(data: Partial<Course>): Promise<Course> {
        const course = this.coursesRepository.create(data);
        return this.coursesRepository.save(course);
    }

    async update(id: number, data: Partial<Course>): Promise<Course> {
        await this.coursesRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.coursesRepository.delete(id);
    }

    // UNITS CRUD
    async createUnit(courseId: number, data: Partial<Unit>): Promise<Unit> {
        const unit = this.unitsRepository.create({ ...data, courseId });
        return this.unitsRepository.save(unit);
    }

    async updateUnit(id: number, data: Partial<Unit>): Promise<Unit> {
        await this.unitsRepository.update(id, data);
        return this.unitsRepository.findOneBy({ id });
    }

    async deleteUnit(id: number): Promise<void> {
        await this.unitsRepository.delete(id);
    }

    // Assign Exercise to Unit (Helper, though usually done via Exercise update)
    async addExerciseToUnit(unitId: number, exerciseId: number) {
        // This would typically involve updating the Exercise entity
        // We'll leave this to the Exercises module or handle it if we inject Exercise Repo
    }
}
