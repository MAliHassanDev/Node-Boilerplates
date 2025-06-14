import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { EnvService } from "../../../shared/services/env/env.service.js";
import { AuthorizedUser } from "../types/auth.type.js";
import { AccountsService } from "../../accounts/accounts.service.js";

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: [{ value: string; verified: boolean }];
  provider: "google";
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  public constructor(
    private readonly envService: EnvService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      clientID: envService.get("GOOGLE_CLIENT_ID"),
      clientSecret: envService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: envService.get("GOOGLE_CALLBACK_URL"),
      scope: ["profile", "email"],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ) {
    try {
      let userAccount = await this.accountsService.findFirst({
        email: profile.emails[0].value,
      });

      userAccount ??= await this.accountsService.create({
        firstName: profile.displayName,
        email: profile.emails[0].value,
        provider: profile.provider,
        providerId: profile.id,
      });

      return {
        id: userAccount.id,
        email: userAccount.email,
        providerId: userAccount.providerId,
        provider: userAccount.provider,
        role: userAccount.role.code,
      } satisfies AuthorizedUser;
    } catch (error: unknown) {
      this.logger.error("Failed to validate user in google strategy", error);
      throw error;
    }
  }
}
