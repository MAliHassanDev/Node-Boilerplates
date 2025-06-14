import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { EnvService } from "../../../shared/services/env/env.service.js";
import { AuthenticatedUser, OAuthUserProfile } from "../types/auth.type.js";
import { AccountsService } from "../../accounts/accounts.service.js";

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy, "github") {
  private readonly logger = new Logger(GithubAuthStrategy.name);

  public constructor(
    private readonly envService: EnvService,
    private readonly accountsService: AccountsService,
  ) {
    super({
      clientID: envService.get("GITHUB_CLIENT_ID"),
      clientSecret: envService.get("GITHUB_CLIENT_SECRET"),
      callbackURL: envService.get("GITHUB_CALLBACK_URL"),
      scope: ["user:email"],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: OAuthUserProfile,
  ) {
    try {
      const userAccount = await this.accountsService.findOrCreate({
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
      } satisfies AuthenticatedUser;
    } catch (error: unknown) {
      this.logger.error("Failed to validate user in github strategy", error);
      throw error;
    }
  }
}
