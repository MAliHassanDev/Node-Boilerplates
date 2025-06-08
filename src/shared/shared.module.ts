import { Global, Module } from "@nestjs/common";
import { EnvService } from "./services/env/env.service.js";
import { PasswordService } from "./services/password.service.js";

@Global()
@Module({
  exports: [EnvService, PasswordService],
  providers: [EnvService, PasswordService],
})
export class SharedModule {}
