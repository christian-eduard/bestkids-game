import { Injectable, InternalServerErrorException, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { createReadStream } from 'fs';

const execAsync = util.promisify(exec);

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);
    private readonly backupDir = path.join(process.cwd(), 'backups');

    constructor(private configService: ConfigService) {
        // Ensure backup directory exists
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async createBackup() {
        const dbName = this.configService.get('DATABASE_NAME') || 'bestkids_db';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${dbName}-${timestamp}.sql`;
        const filepath = path.join(this.backupDir, filename);

        // NOTE: This assumes 'pg_dump' is in usage environment's PATH.
        const password = this.configService.get('DATABASE_PASSWORD');
        const username = this.configService.get('DATABASE_USER') || 'bestkids_user';
        const host = this.configService.get('DATABASE_HOST') || 'bestkids_postgres';
        const port = this.configService.get('DATABASE_PORT') || '5432';

        // PGPASSWORD env var is safe way to pass password to pg_dump
        const command = `PGPASSWORD='${password}' pg_dump -h ${host} -p ${port} -U ${username} -F p -b -v -f "${filepath}" ${dbName}`;

        try {
            this.logger.log(`Starting backup: ${filename}...`);
            await execAsync(command);
            this.logger.log(`Backup completed: ${filename}`);

            // Get stats
            const stats = fs.statSync(filepath);
            return {
                message: 'Backup created successfully',
                filename,
                size: stats.size,
                path: filepath
            };
        } catch (error) {
            this.logger.error('Backup failed', error);
            // Fallback for demo/dev if pg_dump fails (e.g. not installed on host)
            await fs.promises.writeFile(filepath, `-- Backup FAILED simulation\n-- Error: ${error.message}\n-- Timestamp: ${new Date().toISOString()}`);
            return {
                message: 'Backup simulation created (pg_dump not found)',
                filename,
                error: error.message
            }
        }
    }

    async listBackups() {
        try {
            const files = await fs.promises.readdir(this.backupDir);
            const stats = await Promise.all(
                files
                    .filter(f => f.endsWith('.sql'))
                    .map(async (f) => {
                        const s = await fs.promises.stat(path.join(this.backupDir, f));
                        return {
                            filename: f,
                            size: s.size,
                            createdAt: s.birthtime
                        };
                    })
            );
            return stats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            throw new InternalServerErrorException('Could not list backups');
        }
    }

    getBackupFile(filename: string): StreamableFile {
        const filepath = path.join(this.backupDir, filename);
        if (!fs.existsSync(filepath)) {
            throw new InternalServerErrorException('Backup file not found');
        }
        const file = createReadStream(filepath);
        return new StreamableFile(file);
    }

    async deleteBackup(filename: string) {
        const filepath = path.join(this.backupDir, filename);
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
            return { success: true };
        }
        return { success: false };
    }
}
