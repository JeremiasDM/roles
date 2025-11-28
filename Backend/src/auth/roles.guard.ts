// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si no hay roles requeridos, es público (o solo requiere estar logueado)
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos el usuario desde la request (inyectado por JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // Si es Presidenta, tiene acceso a todo (Super Admin)
    if (user && user.rol === Role.PRESIDENTA) {
        return true;
    }

    // Verifica si el rol del usuario coincide con alguno de los requeridos
    return requiredRoles.some((role) => user?.rol === role);
  }
}