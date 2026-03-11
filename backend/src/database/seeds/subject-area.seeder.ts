import { DataSource } from 'typeorm';
import { SubjectArea } from '../../modules/exercises/entities/subject-area.entity';

export class SubjectAreaSeeder {
    public async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(SubjectArea);

        // Check if already seeded
        const count = await repository.count();
        if (count > 0) {
            console.log('Subject areas already seeded. Skipping...');
            return;
        }

        const subjectAreas = [
            {
                name: 'Matemáticas',
                icon: '🔢',
                colorHex: '#667eea',
                description: 'Números, operaciones, geometría y problemas matemáticos',
                orderIndex: 1,
            },
            {
                name: 'Lengua y Literatura',
                icon: '📚',
                colorHex: '#F8E71C',
                description: 'Lectura, escritura, gramática y comprensión lectora',
                orderIndex: 2,
            },
            {
                name: 'Ciencias Naturales',
                icon: '🔬',
                colorHex: '#7ED321',
                description: 'Biología, física, química y el mundo natural',
                orderIndex: 3,
            },
            {
                name: 'Ciencias Sociales',
                icon: '🌍',
                colorHex: '#F5A623',
                description: 'Historia, geografía y sociedad',
                orderIndex: 4,
            },
            {
                name: 'Inglés',
                icon: '🇬🇧',
                colorHex: '#BD10E0',
                description: 'Vocabulario, gramática y conversación en inglés',
                orderIndex: 5,
            },
            {
                name: 'Arte y Creatividad',
                icon: '🎨',
                colorHex: '#FF6B9D',
                description: 'Dibujo, música, manualidades y expresión artística',
                orderIndex: 6,
            },
            {
                name: 'Educación Física',
                icon: '⚽',
                colorHex: '#4A90E2',
                description: 'Deportes, salud y actividad física',
                orderIndex: 7,
            },
        ];

        const entities = repository.create(subjectAreas);
        await repository.save(entities);

        console.log(`✅ Seeded ${entities.length} subject areas`);
    }
}
