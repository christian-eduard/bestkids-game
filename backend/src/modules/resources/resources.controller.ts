import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResourceType } from './entities/resource.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new media resource' })
    async create(@Body() data: any, @Request() req: any) {
        return this.resourcesService.create({
            ...data,
            createdBy: req.user.id,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get all media resources' })
    async findAll(@Query('type') type?: ResourceType, @Query('category') category?: string) {
        if (type) return this.resourcesService.findByType(type);
        if (category) return this.resourcesService.findByCategory(category);
        return this.resourcesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific resource by ID' })
    async findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a resource' })
    async update(@Param('id') id: string, @Body() data: any) {
        return this.resourcesService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a resource' })
    async remove(@Param('id') id: string) {
        return this.resourcesService.remove(+id);
    }
}
