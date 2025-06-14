import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { AuthService } from "./auth.service.js";
import { Public } from "./decorators/auth.decorators.js";
import { GoogleAuthGuard } from "./guards/google-auth.guard.js";
import { User } from "../../shared/decorators/user.decorator.js";
import type { AuthorizedUser } from "./types/auth.type.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  /*------- Login ------- */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  public login(@User() user: AuthorizedUser) {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("/google/login")
  public googleLogin() {
    // guard redirects to google url
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get("/google/callback")
  public googleAuthCallback(@User() user: AuthorizedUser | undefined) {
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}
