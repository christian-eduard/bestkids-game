import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { Unit } from './entities/unit.entity';
import { UserExerciseResult } from './entities/user-exercise-result.entity';
import { SubjectArea } from './entities/subject-area.entity';
import { GamificationService } from '../gamification/gamification.service';
import { Repository } from 'typeorm';

describe('ExercisesMechanicsValidation', () => {
    let service: ExercisesService;

    const mockRepository = {
        save: jest.fn(),
        create: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn(),
    };

    const mockGamification = {
        addPoints: jest.fn(),
        addCoins: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExercisesService,
                { provide: getRepositoryToken(Exercise), useValue: mockRepository },
                { provide: getRepositoryToken(Unit), useValue: mockRepository },
                { provide: getRepositoryToken(UserExerciseResult), useValue: mockRepository },
                { provide: getRepositoryToken(SubjectArea), useValue: mockRepository },
                { provide: GamificationService, useValue: mockGamification },
            ],
        }).compile();

        service = module.get<ExercisesService>(ExercisesService);
    });

    const validate = (type: ExerciseType, content: any, answer: any) => {
        // Access private method for testing purposes
        return (service as any).validateAnswer({ type, content } as Exercise, answer);
    };

    it('should validate SEÑALAR_IMAGEN correctly', () => {
        const content = {
            options: [
                { id: "1", isCorrect: true },
                { id: "2", isCorrect: false }
            ]
        };
        expect(validate(ExerciseType.SEÑALAR_IMAGEN, content, "1")).toBe(true);
        expect(validate(ExerciseType.SEÑALAR_IMAGEN, content, "2")).toBe(false);
    });

    it('should validate OPCION_MULTIPLE correctly', () => {
        const content = {
            options: [
                { id: "opt1", isCorrect: false },
                { id: "opt2", isCorrect: true }
            ]
        };
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, "opt2")).toBe(true);
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, "opt1")).toBe(false);
    });

    it('should require the exact set of correct options in multiple-answer mode', () => {
        const content = {
            multipleCorrect: true,
            options: [
                { id: 'melon', isCorrect: true },
                { id: 'balon', isCorrect: true },
                { id: 'mesa', isCorrect: false },
            ],
        };
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, ['balon', 'melon'])).toBe(true);
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, ['melon'])).toBe(false);
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, ['melon', 'mesa'])).toBe(false);
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, ['melon', 'melon'])).toBe(false);
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, 'melon')).toBe(false);
    });

    it('should also recognize legacy multiple correct options without the mode flag', () => {
        const content = { options: [
            { id: 'a', isCorrect: true }, { id: 'b', isCorrect: true },
        ] };
        expect(validate(ExerciseType.OPCION_MULTIPLE, content, ['a', 'b'])).toBe(true);
    });

    it('should validate VERDADERO_FALSO correctly', () => {
        const content = { correctAnswer: true };
        expect(validate(ExerciseType.VERDADERO_FALSO, content, true)).toBe(true);
        expect(validate(ExerciseType.VERDADERO_FALSO, content, false)).toBe(false);
    });

    it('should validate ARRASTRAR_SILABAS correctly', () => {
        const content = { items: [{ word: "GATO" }] };
        expect(validate(ExerciseType.ARRASTRAR_SILABAS, content, ["GATO"])).toBe(true);
        expect(validate(ExerciseType.ARRASTRAR_SILABAS, content, ["PERRO"])).toBe(false);
    });

    it('should validate UNIR_LINEAS correctly', () => {
        const content = { correctPairs: [["l1", "r1"], ["l2", "r2"]] };
        expect(validate(ExerciseType.UNIR_LINEAS, content, [["l1", "r1"], ["l2", "r2"]])).toBe(true);
        expect(validate(ExerciseType.UNIR_LINEAS, content, [["l1", "r2"], ["l2", "r1"]])).toBe(false);
    });

    it('should validate CLASIFICAR_GRUPOS correctly', () => {
        const content = {
            items: [
                { id: "it1", correctGroupId: "g1" },
                { id: "it2", correctGroupId: "g2" }
            ]
        };
        expect(validate(ExerciseType.CLASIFICAR_GRUPOS, content, [{ itemId: "it1", groupId: "g1" }, { itemId: "it2", groupId: "g2" }])).toBe(true);
        expect(validate(ExerciseType.CLASIFICAR_GRUPOS, content, [{ itemId: "it1", groupId: "g2" }])).toBe(false);
    });

    it('should validate PINTAR correctly', () => {
        const content = {
            correctPairs: [{ itemId: "sun", color: "#FFFF00" }]
        };
        expect(validate(ExerciseType.PINTAR, content, [{ itemId: "sun", color: "#FFFF00" }])).toBe(true);
        expect(validate(ExerciseType.PINTAR, content, [{ itemId: "sun", color: "#FF0000" }])).toBe(false);
    });

    it('should validate TECLADO_VIRTUAL correctly', () => {
        const content = { correctSyllable: "RA" };
        expect(validate(ExerciseType.TECLADO_VIRTUAL, content, "RA")).toBe(true);
        expect(validate(ExerciseType.TECLADO_VIRTUAL, content, "ra ")).toBe(true);
        expect(validate(ExerciseType.TECLADO_VIRTUAL, content, "MA")).toBe(false);
    });

    it('should validate AUDIO_SELECCION correctly', () => {
        const content = {
            options: [{ id: "a1", isCorrect: true }, { id: "a2", isCorrect: false }]
        };
        expect(validate(ExerciseType.AUDIO_SELECCION, content, "a1")).toBe(true);
        expect(validate(ExerciseType.AUDIO_SELECCION, content, "a2")).toBe(false);
    });

    it('should validate COMPLETAR_HUECOS correctly', () => {
        const content = {
            gaps: [{ id: "gap1", correctAnswer: "amarillo" }]
        };
        expect(validate(ExerciseType.COMPLETAR_HUECOS, content, { gap1: "amarillo" })).toBe(true);
        expect(validate(ExerciseType.COMPLETAR_HUECOS, content, { gap1: "AMARILLO " })).toBe(true);
        expect(validate(ExerciseType.COMPLETAR_HUECOS, content, { gap1: "rojo" })).toBe(false);
    });
});
