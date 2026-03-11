import { Controller, Get, Post, Delete, Param, StreamableFile, Res, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('infra')
@Controller('infra/backups')
@UseGuards(JwtAuthGuard)
export class BackupController {
    constructor(private readonly backupService: BackupService) { }

    @Post()
    @ApiOperation({ summary: 'Trigger a new database backup' })
    async createBackup() {
        return this.backupService.createBackup();
    }

    @Get()
    @ApiOperation({ summary: 'List all available backups' })
    async listBackups() {
        return this.backupService.listBackups();
    }

    @Get(':filename')
    @ApiOperation({ summary: 'Download a backup file' })
    async downloadBackup(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
        const file = this.backupService.getBackupFile(filename);
        res.set({
            'Content-Type': 'application/sql',
            'Content-Disposition': `attachment; filename="${filename}"`,
        });
        return file;
    }

    @Delete(':filename')
    @ApiOperation({ summary: 'Delete a backup file' })
    async deleteBackup(@Param('filename') filename: string) {
        return this.backupService.deleteBackup(filename);
    }
}
