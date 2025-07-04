import { SetMetadata } from "@nestjs/common";
import { Role } from "../types/roles.type";

export const ROLE_KEY = "role";
export const Roles = (roles: Role["name"][]) => SetMetadata(ROLE_KEY, roles);
