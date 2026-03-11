import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
    private readonly uploadPath = 'uploads';

    constructor() {
        this.ensureDirectories();
    }

    private ensureDirectories() {
        const types = ['images', 'audio', 'video'];
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath);
        }
        types.forEach(type => {
            const dir = path.join(this.uploadPath, type);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }

    async deleteFile(filename: string): Promise<void> {
        // Filename example: images/uuid.png
        const filePath = path.join(this.uploadPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            throw new NotFoundException('Archivo no encontrado');
        }
    }
}
