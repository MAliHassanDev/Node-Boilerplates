import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorators/roles.decorator";
import { Role } from "../types/roles.type";
import { IS_PUBLIC_KEY } from "@/core/auth/decorators/auth.decorators";
import { ROLE } from "../roles.constants";
import type { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role["name"][] | undefined>(
      ROLE_KEY,
      [context.getHandler()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0 || isPublic) {
      return true;
    }
    const allowedRoleCodes = roles.map(role => ROLE[role].code);

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    return allowedRoleCodes.includes(user.role);
  }
}
