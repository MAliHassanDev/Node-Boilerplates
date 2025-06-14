import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategy/local.strategy.js";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../accounts/accounts.module.js";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants/auth.constants.js";
import { JwtStrategy } from "./strategy/jwt.strategy.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { GoogleStrategy } from "./strategy/google-auth2.0.strategy.js";
import { GoogleAuthGuard } from "./guards/google-auth.guard.js";

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
    GoogleStrategy,
    GoogleAuthGuard,
    LocalStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
