import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('parents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('parents')
export class ParentsController {
    constructor(private readonly parentsService: ParentsService) { }

    @Get('my-children')
    @ApiOperation({ summary: 'Get my children' })
    async getMyChildren(@Request() req: any) {
        return this.parentsService.getMyChildren(req.user.id);
    }

    @Post('link-child')
    @ApiOperation({ summary: 'Link a child account using student code' })
    async linkChild(@Request() req: any, @Body() body: { studentCode: string }) {
        return this.parentsService.linkChild(req.user.id, body.studentCode);
    }

    @Get('children/:id/progress')
    @ApiOperation({ summary: 'Get child progress and stats' })
    async getChildProgress(@Param('id') id: string) {
        return this.parentsService.getChildProgress(+id);
    }
}
