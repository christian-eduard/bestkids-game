import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async create(userId: number, type: NotificationType, title: string, message: string, metadata?: any) {
        const notification = this.notificationRepository.create({
            userId,
            type,
            title,
            message,
            metadata,
        });
        return this.notificationRepository.save(notification);
    }

    async findByUser(userId: number, limit: number = 50) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findUnreadByUser(userId: number) {
        return this.notificationRepository.find({
            where: { userId, isRead: false },
            order: { createdAt: 'DESC' },
        });
    }

    async countUnread(userId: number): Promise<number> {
        return this.notificationRepository.count({
            where: { userId, isRead: false },
        });
    }

    async markAsRead(id: number) {
        await this.notificationRepository.update(id, { isRead: true });
    }

    async markAllAsRead(userId: number) {
        await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true }
        );
    }

    async delete(id: number) {
        await this.notificationRepository.delete(id);
    }

    // Helper methods for specific notification types
    async notifyAchievement(userId: number, achievementName: string) {
        return this.create(
            userId,
            NotificationType.ACHIEVEMENT,
            '🏆 ¡Nuevo Logro!',
            `Has desbloqueado: ${achievementName}`,
            { achievementName }
        );
    }

    async notifyAssignment(userId: number, assignmentTitle: string, dueDate: Date) {
        return this.create(
            userId,
            NotificationType.ASSIGNMENT,
            '📚 Nueva Asignación',
            `Tienes una nueva tarea: ${assignmentTitle}`,
            { assignmentTitle, dueDate }
        );
    }

    async notifyLowPerformance(userId: number, subjectName: string) {
        return this.create(
            userId,
            NotificationType.ALERT,
            '⚠️ Alerta de Rendimiento',
            `Se ha detectado bajo rendimiento en ${subjectName}`,
            { subjectName }
        );
    }

    async notifyWeeklyReport(userId: number) {
        return this.create(
            userId,
            NotificationType.REPORT,
            '📊 Reporte Semanal Disponible',
            'Tu reporte semanal está listo para descargar',
        );
    }
}
