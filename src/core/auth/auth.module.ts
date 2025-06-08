import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategy/local.strategy.js";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants/auth.constants.js";
import { JwtStrategy } from "./strategy/passport.strategy.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.accessToken.secret,
      signOptions: { expiresIn: jwtConstants.accessToken.expireTimeInSec },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
