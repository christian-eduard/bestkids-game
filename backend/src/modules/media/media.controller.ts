import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
    Res,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import type { Response } from 'express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Subir un archivo multimedia' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req: any, file: any, cb: any) => {
                    let type = 'images';
                    if (file.mimetype.startsWith('audio/')) type = 'audio';
                    else if (file.mimetype.startsWith('video/')) type = 'video';
                    else if (file.mimetype.startsWith('application/') || file.mimetype.startsWith('text/')) type = 'documents';
                    cb(null, `./uploads/${type}`);
                },
                filename: (req: any, file: any, cb: any) => {
                    const filename: string = uuidv4();
                    const extension: string = path.parse(file.originalname).ext;
                    cb(null, `${filename}${extension}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                const allowedMimes = [
                    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
                    'audio/mpeg', 'audio/wav', 'audio/ogg',
                    'video/mp4', 'video/webm',
                    'application/pdf', 'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'text/plain'
                ];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new HttpException('Tipo de archivo no permitido', HttpStatus.BAD_REQUEST), false);
                }
            },
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB max
            },
        }),
    )
    async uploadFile(@UploadedFile() file: any) {
        if (!file) {
            throw new HttpException('Archivo requerido', HttpStatus.BAD_REQUEST);
        }

        const type = file.mimetype.split('/')[0];
        let category = file.mimetype.startsWith('image/') ? 'images' : type;
        if (file.mimetype.startsWith('application/') || file.mimetype.startsWith('text/')) {
            category = 'documents';
        }

        return {
            url: `/api/media/file/${category}/${file.filename}`,
            type: category,
            originalName: file.originalname,
            size: file.size,
        };
    }

    @Get('file/:type/:filename')
    @ApiOperation({ summary: 'Obtener un archivo multimedia' })
    async serveFile(
        @Param('type') type: string,
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        return res.sendFile(filename, { root: `./uploads/${type}` });
    }

    @Delete(':type/:filename')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Eliminar un archivo multimedia' })
    async deleteFile(
        @Param('type') type: string,
        @Param('filename') filename: string
    ) {
        // En producción aquí validaríamos roles Master/Admin
        await this.mediaService.deleteFile(`${type}/${filename}`);
        return { message: 'Archivo eliminado' };
    }
}
