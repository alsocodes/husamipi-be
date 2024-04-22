import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Access } from './access.enum';
import { ACCESS_KEY } from './access.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAccess = this.reflector.getAllAndOverride<Access[]>(
      ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAccess) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredAccess.some((access) => user.accesses?.includes(access));
  }
}
