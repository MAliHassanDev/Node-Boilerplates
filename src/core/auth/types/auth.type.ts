import { Account } from "../../accounts/types/user.type.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: number;
  provider: Account["provider"];
  providerId: string | null;
};

export interface AuthenticatedUser extends Omit<AuthTokenPayload, "sub"> {
  id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user: AuthenticatedUser;
  }
}

export interface OAuthUserProfile {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: [{ value: string; verified: boolean }];
  provider: "google" | "github";
}
