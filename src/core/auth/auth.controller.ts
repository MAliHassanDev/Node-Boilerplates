import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { AuthService } from "./auth.service.js";
import type { Request } from "express";
import { Public } from "./decorators/auth.decorators.js";

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
  public login(@Req() req: Request) {
    console.log(req.user);
    return this.authService.login(req.user);
  }
}
