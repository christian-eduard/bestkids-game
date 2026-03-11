import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private usersService: UsersService,
    ) { }

    // ============================================
    // ENVIAR MENSAJE
    // ============================================
    async send(
        senderId: number,
        data: {
            recipientId: number;
            subject: string;
            content: string;
            parentMessageId?: number;
            isAnnouncement?: boolean;
        },
    ): Promise<Message> {
        const message = this.messagesRepository.create({
            senderId,
            recipientId: data.recipientId,
            subject: data.subject,
            content: data.content,
            parentMessageId: data.parentMessageId || null,
            isAnnouncement: data.isAnnouncement || false,
        });

        return this.messagesRepository.save(message);
    }

    // ============================================
    // ENVIAR ANUNCIO MASIVO
    // ============================================
    async sendBroadcast(
        senderId: number,
        subject: string,
        content: string,
        targetRoleId?: number
    ): Promise<number> {
        let recipients = await this.usersService.findAll();

        // Filter by role if specified
        if (targetRoleId) {
            recipients = recipients.filter(u => u.roleId === targetRoleId);
        }

        // Exclude self
        recipients = recipients.filter(u => u.id !== senderId);

        if (recipients.length === 0) return 0;

        // Create messages in bulk
        // Note: typeorm .save can handle arrays but hooks might not run? 
        // For simple create it is fine.
        const messages = recipients.map(recipient => this.messagesRepository.create({
            senderId,
            recipientId: recipient.id,
            subject,
            content,
            isAnnouncement: true,
        }));

        await this.messagesRepository.save(messages);
        return messages.length;
    }

    // ============================================
    // OBTENER BANDEJA DE ENTRADA
    // ============================================
    async getInbox(userId: number): Promise<Message[]> {
        return this.messagesRepository.find({
            where: { recipientId: userId, isDeletedByRecipient: false },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });
    }

    // ============================================
    // OBTENER MENSAJES ENVIADOS
    // ============================================
    async getSent(userId: number): Promise<Message[]> {
        return this.messagesRepository.find({
            where: { senderId: userId, isDeletedBySender: false },
            relations: ['recipient'],
            order: { createdAt: 'DESC' },
        });
    }

    // ============================================
    // OBTENER UN MENSAJE
    // ============================================
    async getById(id: number, userId: number): Promise<Message> {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ['sender', 'recipient', 'parentMessage'],
        });

        if (!message) {
            throw new NotFoundException('Mensaje no encontrado');
        }

        // Verify access
        if (message.senderId !== userId && message.recipientId !== userId) {
            throw new ForbiddenException('No tienes acceso a este mensaje');
        }

        return message;
    }

    // ============================================
    // MARCAR COMO LEÍDO
    // ============================================
    async markAsRead(id: number, userId: number): Promise<Message> {
        const message = await this.getById(id, userId);

        if (message.recipientId !== userId) {
            throw new ForbiddenException('Solo el destinatario puede marcar como leído');
        }

        message.isRead = true;
        message.readAt = new Date();

        return this.messagesRepository.save(message);
    }

    // ============================================
    // ELIMINAR MENSAJE (soft delete)
    // ============================================
    async delete(id: number, userId: number): Promise<void> {
        const message = await this.getById(id, userId);

        if (message.senderId === userId) {
            message.isDeletedBySender = true;
        }
        if (message.recipientId === userId) {
            message.isDeletedByRecipient = true;
        }

        await this.messagesRepository.save(message);
    }

    // ============================================
    // CONTAR NO LEÍDOS
    // ============================================
    async getUnreadCount(userId: number): Promise<number> {
        return this.messagesRepository.count({
            where: { recipientId: userId, isRead: false, isDeletedByRecipient: false },
        });
    }

    // ============================================
    // OBTENER CONVERSACIÓN (thread)
    // ============================================
    async getThread(messageId: number, userId: number): Promise<Message[]> {
        const message = await this.getById(messageId, userId);

        // Get root message
        let rootId = message.parentMessageId || message.id;

        // Get all messages in thread
        const messages = await this.messagesRepository.find({
            where: [
                { id: rootId },
                { parentMessageId: rootId },
            ],
            relations: ['sender', 'recipient'],
            order: { createdAt: 'ASC' },
        });

        // Filter to only show messages user has access to
        return messages.filter(m =>
            (m.senderId === userId && !m.isDeletedBySender) ||
            (m.recipientId === userId && !m.isDeletedByRecipient)
        );
    }

    // ============================================
    // RESPONDER A UN MENSAJE
    // ============================================
    async reply(
        userId: number,
        messageId: number,
        content: string,
    ): Promise<Message> {
        const originalMessage = await this.getById(messageId, userId);

        // Determine recipient (the other person in the conversation)
        const recipientId = originalMessage.senderId === userId
            ? originalMessage.recipientId
            : originalMessage.senderId;

        const rootId = originalMessage.parentMessageId || originalMessage.id;

        return this.send(userId, {
            recipientId,
            subject: `Re: ${originalMessage.subject}`,
            content,
            parentMessageId: rootId,
        });
    }
}
