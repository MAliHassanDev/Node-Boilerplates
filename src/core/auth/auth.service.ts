import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AccountsService } from "../accounts/accounts.service.js";
import { PasswordService } from "../../shared/services/password.service.js";
import { JwtService } from "@nestjs/jwt";
import { AuthorizedUser, AuthTokenPayload } from "./types/auth.type.js";

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: AccountsService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findFirstIncludePassword(email);

    if (!user) {
      throw new NotFoundException("No account is registered with this email");
    }

    const { password: _, ...userWithoutPassword } = user;

    if (user.provider !== "local") {
      return userWithoutPassword;
    }

    if (!user.password) {
      throw new UnauthorizedException("Missing password");
    }

    const doPasswordsMatch = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException("Incorrect password");
    }

    return userWithoutPassword;
  }

  public login(user: AuthorizedUser) {
    const { id, ...rest } = user;
    const payload = {
      sub: id,
      ...rest,
    } satisfies AuthTokenPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
