import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModerationReport, ReportReason } from './entities/moderation-report.entity';

@Injectable()
export class ModerationService {
    constructor(
        @InjectRepository(ModerationReport)
        private reportRepo: Repository<ModerationReport>,
    ) { }

    async createReport(reporterId: number, data: { reportedUserId?: number, reason: ReportReason, description?: string }) {
        const report = this.reportRepo.create({
            reporterId,
            ...data,
            status: 'pending'
        });
        return this.reportRepo.save(report);
    }

    async findAllReports() {
        return this.reportRepo.find({
            relations: ['reporter', 'reportedUser'],
            order: { createdAt: 'DESC' }
        });
    }

    async resolveReport(id: number, status: 'resolved' | 'dismissed') {
        await this.reportRepo.update(id, { status });
        return this.reportRepo.findOneBy({ id });
    }
}
