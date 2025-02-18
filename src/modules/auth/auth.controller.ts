import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { LoginInDto } from "./dto/login-user.dto.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  /*------- Login ------- */
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  public login(@Body() loginDto: LoginInDto, @Request() req: Express.Request) {
    return req.user;
  }
}
