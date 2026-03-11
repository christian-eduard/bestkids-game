import { DataSource } from 'typeorm';
import { StoreItem, StoreItemType } from '../../modules/store/entities/store-item.entity';
import { GamificationProfile } from '../../modules/gamification/entities/gamification-profile.entity';
import { User } from '../../modules/users/entities/user.entity';

export class StoreSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const itemRepo = dataSource.getRepository(StoreItem);
        const userRepo = dataSource.getRepository(User);
        const profileRepo = dataSource.getRepository(GamificationProfile);

        // 1. Create Store Items (10 productos)
        const items = [
            // Stickers / Accesorios
            {
                name: 'Gafas de Sol Cool',
                description: '¡Añade estilo a tu avatar con estas gafas geniales!',
                cost: 50,
                type: StoreItemType.STICKER,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
                isActive: true
            },
            {
                name: 'Sombrero de Fiesta',
                description: '¡Listo para celebrar cada logro!',
                cost: 100,
                type: StoreItemType.STICKER,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/2418/2418147.png',
                isActive: true
            },
            {
                name: 'Corona de Campeón',
                description: 'Para los reyes y reinas del aprendizaje.',
                cost: 200,
                type: StoreItemType.STICKER,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/2923/2923223.png',
                isActive: true
            },
            {
                name: 'Capa de Superhéroe',
                description: '¡Vuela hacia el conocimiento!',
                cost: 300,
                type: StoreItemType.STICKER,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/5632/5632381.png',
                isActive: true
            },
            // Marcos de Avatar
            {
                name: 'Marco Dorado',
                description: 'Un marco brillante para campeones.',
                cost: 500,
                type: StoreItemType.AVATAR_FRAME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/2550/2550254.png',
                isActive: true
            },
            {
                name: 'Marco Neón',
                description: '¡Brilla con luz propia!',
                cost: 750,
                type: StoreItemType.AVATAR_FRAME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/3504/3504066.png',
                isActive: true
            },
            {
                name: 'Marco Arcoíris',
                description: 'Todos los colores del éxito.',
                cost: 600,
                type: StoreItemType.AVATAR_FRAME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616554.png',
                isActive: true
            },
            // Temas
            {
                name: 'Tema Espacial',
                description: 'Lleva tu dashboard a las estrellas.',
                cost: 2000,
                type: StoreItemType.THEME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/1545/1545532.png',
                isActive: true
            },
            {
                name: 'Tema Selva',
                description: '¡Salvaje y verde como la naturaleza!',
                cost: 1500,
                type: StoreItemType.THEME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
                isActive: true
            },
            {
                name: 'Tema Oceánico',
                description: 'Sumérgete en el aprendizaje marino.',
                cost: 1800,
                type: StoreItemType.THEME,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942079.png',
                isActive: true
            }
        ];

        console.log('  Creating store items...');
        for (const itemData of items) {
            const existing = await itemRepo.findOne({ where: { name: itemData.name } });
            if (!existing) {
                await itemRepo.save(itemRepo.create(itemData));
            }
        }

        // 2. Grant points to 'student1' for testing
        console.log('  Granting points to student1...');
        const student = await userRepo.findOne({ where: { username: 'student1' } });
        if (student) {
            let profile = await profileRepo.findOne({ where: { userId: student.id } });
            if (!profile) {
                profile = profileRepo.create({
                    userId: student.id,
                    totalPoints: 0,
                    currentLevel: 1
                });
            }

            // Ensure enough points to buy items
            if (profile.totalPoints < 5000) {
                profile.totalPoints = 5000;
                profile.weeklyPoints = 5000; // For leaderboard visibility
                await profileRepo.save(profile);
                console.log(`  Updated student1 points to ${profile.totalPoints}`);
            }
        } else {
            console.log('  Warning: student1 not found');
        }
    }
}
