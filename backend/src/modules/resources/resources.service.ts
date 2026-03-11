import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource, ResourceType } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
    ) { }

    async create(data: {
        title: string;
        description?: string;
        type: ResourceType;
        url: string;
        category?: string;
        metadata?: any;
        createdBy: number;
    }) {
        const resource = this.resourceRepository.create(data);
        return this.resourceRepository.save(resource);
    }

    async findAll() {
        return this.resourceRepository.find({
            relations: ['creator'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        const resource = await this.resourceRepository.findOne({
            where: { id },
            relations: ['creator'],
        });
        if (!resource) throw new NotFoundException('Recurso no encontrado');
        return resource;
    }

    async update(id: number, data: Partial<Resource>) {
        await this.resourceRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number) {
        const resource = await this.findOne(id);
        await this.resourceRepository.remove(resource);
        return { success: true };
    }

    async findByType(type: ResourceType) {
        return this.resourceRepository.find({
            where: { type },
            order: { createdAt: 'DESC' },
        });
    }

    async findByCategory(category: string) {
        return this.resourceRepository.find({
            where: { category },
            order: { createdAt: 'DESC' },
        });
    }

    async findCategories(): Promise<string[]> {
        const result = await this.resourceRepository
            .createQueryBuilder('resource')
            .select('DISTINCT resource.category', 'category')
            .where('resource.category IS NOT NULL')
            .andWhere("resource.category != ''")
            .orderBy('resource.category', 'ASC')
            .getRawMany();
        return result.map(r => r.category);
    }

    async updateCategory(oldName: string, newName: string) {
        await this.resourceRepository
            .createQueryBuilder()
            .update(Resource)
            .set({ category: newName })
            .where('category = :oldName', { oldName })
            .execute();
        return { success: true, oldName, newName };
    }

    async deleteCategory(category: string) {
        // Set category to 'General' for all resources in this category
        await this.resourceRepository
            .createQueryBuilder()
            .update(Resource)
            .set({ category: 'General' })
            .where('category = :category', { category })
            .execute();
        return { success: true };
    }
}
