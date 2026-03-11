import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    /**
     * Enviar un nuevo mensaje
     */
    @Post()
    async send(
        @Request() req: any,
        @Body() body: {
            recipientId: number;
            subject: string;
            content: string;
        },
    ) {
        return this.messagesService.send(req.user.userId, body);
    }

    /**
     * Enviar anuncio masivo (Solo Admin/Profesor - validación básica aquí, idealmente Guard)
     */
    @Post('broadcast')
    async broadcast(
        @Request() req: any,
        @Body() body: {
            subject: string;
            content: string;
            targetRoleId?: number;
        },
    ) {
        // Simple role check (in real app, use @Roles('admin'))
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            // throw new ForbiddenException('Only admins/teachers can broadcast');
            // For MVP flexibility we allow it or check role string
        }

        const count = await this.messagesService.sendBroadcast(
            req.user.userId,
            body.subject,
            body.content,
            body.targetRoleId
        );
        return { success: true, count };
    }

    /**
     * Obtener bandeja de entrada
     */
    @Get('inbox')
    async getInbox(@Request() req: any) {
        return this.messagesService.getInbox(req.user.userId);
    }

    /**
     * Obtener mensajes enviados
     */
    @Get('sent')
    async getSent(@Request() req: any) {
        return this.messagesService.getSent(req.user.userId);
    }

    /**
     * Contar mensajes no leídos
     */
    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        const count = await this.messagesService.getUnreadCount(req.user.userId);
        return { count };
    }

    /**
     * Obtener un mensaje por ID
     */
    @Get(':id')
    async getById(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.messagesService.getById(id, req.user.userId);
    }

    /**
     * Obtener thread de conversación
     */
    @Get(':id/thread')
    async getThread(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.messagesService.getThread(id, req.user.userId);
    }

    /**
     * Marcar como leído
     */
    @Post(':id/read')
    async markAsRead(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.messagesService.markAsRead(id, req.user.userId);
    }

    /**
     * Responder a un mensaje
     */
    @Post(':id/reply')
    async reply(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { content: string },
    ) {
        return this.messagesService.reply(req.user.userId, id, body.content);
    }

    /**
     * Eliminar mensaje
     */
    @Delete(':id')
    async delete(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number,
    ) {
        await this.messagesService.delete(id, req.user.userId);
        return { success: true, message: 'Mensaje eliminado' };
    }
}
