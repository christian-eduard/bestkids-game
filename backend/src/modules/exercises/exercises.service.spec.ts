import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { Unit } from './entities/unit.entity';
import { ExerciseOption } from './entities/exercise-option.entity';
import { UserExerciseResult } from './entities/user-exercise-result.entity';
import { GamificationService } from '../gamification/gamification.service';
import { SubjectArea } from './entities/subject-area.entity';
import { NotFoundException } from '@nestjs/common';

describe('ExercisesService', () => {
    let service: ExercisesService;
    let resultRepo: any;
    let exerciseRepo: any;

    const mockResultRepository = {
        find: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockExerciseRepository = {
        findOne: jest.fn(),
        find: jest.fn(),
    };

    const mockGamificationService = {
        addPoints: jest.fn(),
        addCoins: jest.fn(),
        getProfile: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExercisesService,
                { provide: getRepositoryToken(Exercise), useValue: mockExerciseRepository },
                { provide: getRepositoryToken(Unit), useValue: {} },
                { provide: getRepositoryToken(ExerciseOption), useValue: {} },
                { provide: getRepositoryToken(UserExerciseResult), useValue: mockResultRepository },
                { provide: getRepositoryToken(SubjectArea), useValue: {} },
                { provide: GamificationService, useValue: mockGamificationService },
            ],
        }).compile();

        service = module.get<ExercisesService>(ExercisesService);
        resultRepo = module.get(getRepositoryToken(UserExerciseResult));
        exerciseRepo = module.get(getRepositoryToken(Exercise));
    });

    describe('getUserAdaptiveDifficulty', () => {
        it('should return 1 if guest has no previous results', async () => {
            resultRepo.find.mockResolvedValue([]);
            const diff = await service.getUserAdaptiveDifficulty(1, 1);
            expect(diff).toBe(1);
        });

        it('should increase difficulty if last 3 results are correct', async () => {
            resultRepo.find.mockResolvedValue([
                { isCorrect: true, exercise: { difficulty: 1 } },
                { isCorrect: true, exercise: { difficulty: 1 } },
                { isCorrect: true, exercise: { difficulty: 1 } },
            ]);
            const diff = await service.getUserAdaptiveDifficulty(1, 1);
            expect(diff).toBe(2);
        });

        it('should decrease difficulty if last 3 results are incorrect', async () => {
            resultRepo.find.mockResolvedValue([
                { isCorrect: false, exercise: { difficulty: 2 } },
                { isCorrect: false, exercise: { difficulty: 2 } },
                { isCorrect: false, exercise: { difficulty: 2 } },
            ]);
            const diff = await service.getUserAdaptiveDifficulty(1, 1);
            expect(diff).toBe(1);
        });

        it('should maintain difficulty if results are mixed', async () => {
            resultRepo.find.mockResolvedValue([
                { isCorrect: true, exercise: { difficulty: 2 } },
                { isCorrect: false, exercise: { difficulty: 2 } },
                { isCorrect: true, exercise: { difficulty: 2 } },
            ]);
            const diff = await service.getUserAdaptiveDifficulty(1, 1);
            expect(diff).toBe(2);
        });
    });

    describe('submitAnswer', () => {
        it('should reward XP and coins on correct answer', async () => {
            const userId = 1;
            const exerciseId = 100;
            const exercise = { id: exerciseId, correctAnswer: '7', difficulty: 2 };

            exerciseRepo.findOne.mockResolvedValue(exercise);
            resultRepo.count.mockResolvedValue(0);
            resultRepo.create.mockReturnValue({});
            resultRepo.save.mockResolvedValue({});

            const result = await service.submitAnswer(userId, exerciseId, '7', 5000);

            expect(result.isCorrect).toBe(true);
            expect(result.xpEarned).toBe(20);
            expect(mockGamificationService.addPoints).toHaveBeenCalledWith(userId, 20);
        });

        it('should not reward XP on incorrect answer', async () => {
            const exercise = { id: 1, correctAnswer: '7', difficulty: 1 };
            exerciseRepo.findOne.mockResolvedValue(exercise);
            resultRepo.count.mockResolvedValue(0);

            const result = await service.submitAnswer(1, 1, '5', 2000);

            expect(result.isCorrect).toBe(false);
            expect(result.xpEarned).toBe(0);
        });
    });
});
