import { UserEntity } from "../../users/entities/user.entity.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: number;
};

declare module "express-serve-static-core" {
  interface Request {
    user: UserEntity;
  }
}
