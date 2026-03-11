import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
    let service: UsersService;
    let repo: Repository<User>;

    const mockUser = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
    };

    const mockRepo = {
        findOne: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockReturnValue(mockUser),
        save: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
            expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: expect.any(Array) });
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockUser]);
        });
    });
});
