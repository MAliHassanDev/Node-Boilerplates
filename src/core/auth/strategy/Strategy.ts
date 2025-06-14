import { Logger } from "@nestjs/common";
import { AccountsService } from "../../accounts/accounts.service.js";
import { AuthenticatedUser, OAuthUserProfile } from "../types/auth.type.js";

export class Strategy {
  private readonly logger = new Logger(Strategy.name);

  public constructor(private readonly accountsService: AccountsService) {}

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: OAuthUserProfile,
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
      } satisfies AuthenticatedUser;
    } catch (error: unknown) {
      this.logger.error("Failed to validate user in google strategy", error);
      throw error;
    }
  }
}
