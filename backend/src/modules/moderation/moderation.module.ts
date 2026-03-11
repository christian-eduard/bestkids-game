import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { ModerationReport } from './entities/moderation-report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ModerationReport])],
    controllers: [ModerationController],
    providers: [ModerationService],
})
export class ModerationModule { }
