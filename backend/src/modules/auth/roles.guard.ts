import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole, ROLES_KEY } from './roles.decorator';

const roleIds: Record<AppRole, number> = {
    master: 1,
    admin: 2,
    teacher: 3,
    parent: 4,
    student: 5,
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles?.length) return true;

        const user = context.switchToHttp().getRequest().user;
        const roleId = Number(user?.roleId);
        return Number.isInteger(roleId) && requiredRoles.some(role => roleIds[role] === roleId);
    }
}
