import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StoreItem } from './entities/store-item.entity';
import { UserInventory } from './entities/user-inventory.entity';
import { User } from '../users/entities/user.entity';
import { GamificationProfile } from '../gamification/entities/gamification-profile.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(StoreItem)
        private itemsRepo: Repository<StoreItem>,
        @InjectRepository(UserInventory)
        private inventoryRepo: Repository<UserInventory>,
        private dataSource: DataSource,
    ) { }

    async findAllItems() {
        return this.itemsRepo.find({ where: { isActive: true } });
    }

    async getUserInventory(userId: number) {
        return this.inventoryRepo.find({
            where: { userId },
            relations: ['item'],
        });
    }

    async purchaseItem(userId: number, itemId: number) {
        // Transactional purchase
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Check item exists
            const item = await queryRunner.manager.findOne(StoreItem, { where: { id: itemId } });
            if (!item) throw new NotFoundException('Item not found');

            // 2. Get user's profile for points
            const profile = await queryRunner.manager.findOne(GamificationProfile, {
                where: { userId }
            });
            if (!profile) throw new NotFoundException('User profile not found');

            if (profile.totalPoints < item.cost) {
                throw new BadRequestException('Insufficient points');
            }

            // 3. Check if already owned
            const existing = await queryRunner.manager.findOne(UserInventory, {
                where: { userId, itemId }
            });
            if (existing) {
                throw new ConflictException('Item already owned');
            }

            // 4. Deduct points
            profile.totalPoints -= item.cost;
            await queryRunner.manager.save(profile);

            // 5. Add to inventory
            const inventory = new UserInventory();
            inventory.userId = userId;
            inventory.itemId = itemId;
            await queryRunner.manager.save(inventory);

            await queryRunner.commitTransaction();

            return {
                success: true,
                message: `Purchased ${item.name}`,
                remainingPoints: profile.totalPoints,
                item
            };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    // Admin: Create Item
    async createItem(data: Partial<StoreItem>) {
        const item = this.itemsRepo.create(data);
        return this.itemsRepo.save(item);
    }

    async equipItem(userId: number, itemId: number) {
        // 1. Verify user owns the item
        const inventory = await this.inventoryRepo.findOne({
            where: { userId, itemId },
            relations: ['item']
        });

        if (!inventory) {
            throw new NotFoundException('Item not found in inventory');
        }

        const item = inventory.item;

        // 2. Logic: Unequip other items of the same type?
        // Assuming we only allow one of each type equipped at a time.
        // We find all equipped items of this type for this user and unequip them.

        // Find existing equipped items of same type
        const currentlyEquipped = await this.inventoryRepo.createQueryBuilder('inv')
            .leftJoinAndSelect('inv.item', 'item')
            .where('inv.userId = :userId', { userId })
            .andWhere('inv.isEquipped = :isEquipped', { isEquipped: true })
            .andWhere('item.type = :type', { type: item.type })
            .getMany();

        for (const equipped of currentlyEquipped) {
            equipped.isEquipped = false;
            await this.inventoryRepo.save(equipped);
        }

        // 3. Mark target item as equipped
        inventory.isEquipped = true;
        await this.inventoryRepo.save(inventory);

        // 4. (Optional) Sync with GamificationProfile if needed for Avatar representation
        // For now, we rely on the inventory state.

        return {
            success: true,
            message: `Equipped ${item.name}`,
            item: inventory.item,
            inventoryUpdate: {
                id: inventory.id,
                isEquipped: true
            }
        };
    }

    async updateItem(id: number, data: Partial<StoreItem>) {
        await this.itemsRepo.update(id, data);
        return this.itemsRepo.findOne({ where: { id } });
    }
}

