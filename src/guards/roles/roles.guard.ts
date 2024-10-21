import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../../modules/users/enums/role.enum';
import { ROLES_KEY } from 'src/decorators/role-decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const request = context.switchToHttp().getRequest()
    const user = request.user;

    if(!user || !user.roles){
      throw new UnauthorizedException('You do not have permission to access this route')
    }

    const hasRole = () => requiredRoles.some((role) => user.roles.includes(role));
    if(!hasRole()){
      throw new UnauthorizedException('You do not have permission to access this route')
    }

    return true;
  }
}
