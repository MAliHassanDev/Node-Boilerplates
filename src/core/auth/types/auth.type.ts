import { Account } from "../../accounts/types/user.type.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: number;
  provider: Account["provider"];
  providerId: string | null;
};

export interface AuthorizedUser extends Omit<AuthTokenPayload, "sub"> {
  id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user: AuthorizedUser;
  }
}
