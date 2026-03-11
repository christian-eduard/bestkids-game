import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
    ) { }

    async create(data: { message: string; category?: string; page?: string; userAgent?: string; userId?: number }) {
        const feedback = this.feedbackRepository.create(data);
        return this.feedbackRepository.save(feedback);
    }

    async findAll() {
        return this.feedbackRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: number) {
        await this.feedbackRepository.update(id, { isRead: true });
        return this.feedbackRepository.findOne({ where: { id } });
    }

    async delete(id: number) {
        await this.feedbackRepository.delete(id);
    }

    async getStats() {
        const total = await this.feedbackRepository.count();
        const unread = await this.feedbackRepository.count({ where: { isRead: false } });
        const byCategory = await this.feedbackRepository
            .createQueryBuilder('f')
            .select('f.category', 'category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('f.category')
            .getRawMany();

        return { total, unread, byCategory };
    }

    async findByUser(userId: number) {
        return this.feedbackRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            select: ['id', 'message', 'category', 'createdAt', 'isRead'],
        });
    }
}
