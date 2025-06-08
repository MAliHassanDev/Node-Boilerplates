import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service.js";
import { PasswordService } from "../../shared/services/password.service.js";
import { UserEntity } from "../users/entities/user.entity.js";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenPayload } from "./types/auth.type.js";

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findFirstIncludePassword(email);

    if (!user) {
      throw new NotFoundException("No account is registered with this email");
    }

    const doPasswordsMatch = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!doPasswordsMatch) {
      throw new UnauthorizedException("Incorrect password");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  public login(user: UserEntity) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.code,
    } satisfies AuthTokenPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
