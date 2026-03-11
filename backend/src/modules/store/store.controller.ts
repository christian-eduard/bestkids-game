import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('store')
@ApiBearerAuth()
@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Get('items')
    @ApiOperation({ summary: 'Get all shop items' })
    async getItems() {
        return this.storeService.findAllItems();
    }

    @Get('inventory')
    @ApiOperation({ summary: 'Get current user inventory' })
    async getMyInventory(@Request() req: any) {
        return this.storeService.getUserInventory(req.user.id);
    }

    @Post('buy/:itemId')
    @ApiOperation({ summary: 'Purchase an item using points' })
    async purchase(@Request() req: any, @Param('itemId') itemId: string) {
        return this.storeService.purchaseItem(req.user.id, +itemId);
    }

    @Post('equip/:itemId')
    @ApiOperation({ summary: 'Equip an owned item' })
    async equip(@Request() req: any, @Param('itemId') itemId: string) {
        return this.storeService.equipItem(req.user.id, +itemId);
    }

    @Post('items')
    @ApiOperation({ summary: 'Create store item (Admin)' })
    async createItem(@Body() body: any) {
        return this.storeService.createItem(body);
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update store item (Admin)' })
    async updateItem(@Param('id') id: string, @Body() body: any) {
        return this.storeService.updateItem(+id, body);
    }
}
