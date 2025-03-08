import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategy/local.strategy.js";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller.js";
import { UsersModule } from "../users/users.module.js";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
