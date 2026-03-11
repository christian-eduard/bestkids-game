import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findChildren(parentId: number): Promise<User[]> {
        return this.usersRepository.find({
            where: { parentId },
            select: ['id', 'username', 'firstName', 'lastName', 'email', 'avatarId', 'lastLoginAt', 'createdAt'],
        });
    }

    async findAllStudents() {
        // Assuming Role ID 1 is Student. In a real app, join with Roles table.
        return this.usersRepository.find({
            where: { roleId: 5 },
            select: ['id', 'username', 'firstName', 'lastName', 'email', 'lastLoginAt', 'createdAt'],
        });
    }

    async findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async findOneByUsername(username: string): Promise<User | null> {
        return this.usersRepository.createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.username = :username', { username })
            .getOne();
    }


    async update(id: number, updateUserDto: any): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
            delete updateUserDto.password;
        }

        this.usersRepository.merge(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.softDelete(id);
    }

    async linkChild(parentId: number, studentCode: string): Promise<User> {
        const student = await this.usersRepository.findOne({ where: { studentCode } });
        if (!student) {
            throw new NotFoundException('Código de estudiante no válido');
        }

        if (student.parentId) {
            // Check if already linked to THIS parent to avoid error
            if (student.parentId === parentId) return student;
            // Optionally forbid relinking, or allow overwriting. For now, allow overwrite or implement logic check.
            // throw new ForbiddenException('Este estudiante ya está vinculado a un padre');
        }

        student.parentId = parentId;
        return this.usersRepository.save(student);
    }

    private generateStudentCode(): string {
        // Simple code generator: BK-XXXXX
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `BK-${random}`;
    }

    // Override original create to add code generation
    async create(createUserDto: any): Promise<User> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);

        // If role is Student (1), generate code. 
        // Ideally we check role better, but assuming data comes with roleId
        let studentCode = null;
        if (createUserDto.roleId === 5) {
            studentCode = this.generateStudentCode();
            // Ensure uniqueness logic would go here in production (retry on conflict)
        }

        const user = this.usersRepository.create({
            ...createUserDto,
            passwordHash,
            studentCode
        });
        return (await this.usersRepository.save(user)) as unknown as User;
    }
}
