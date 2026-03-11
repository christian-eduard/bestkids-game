import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Get my notifications' })
    async getMyNotifications(@Request() req: any) {
        return this.notificationsService.findByUser(req.user.id);
    }

    @Get('unread')
    @ApiOperation({ summary: 'Get unread notifications' })
    async getUnreadNotifications(@Request() req: any) {
        return this.notificationsService.findUnreadByUser(req.user.id);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notifications count' })
    async getUnreadCount(@Request() req: any) {
        const count = await this.notificationsService.countUnread(req.user.id);
        return { count };
    }

    @Post(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    async markAsRead(@Param('id') id: string) {
        await this.notificationsService.markAsRead(+id);
        return { message: 'Notification marked as read' };
    }

    @Post('read-all')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    async markAllAsRead(@Request() req: any) {
        await this.notificationsService.markAllAsRead(req.user.id);
        return { message: 'All notifications marked as read' };
    }
}
