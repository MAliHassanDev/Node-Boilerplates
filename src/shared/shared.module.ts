import { Global, Module } from "@nestjs/common";
import { EnvService } from "./services/env/env.service.js";

@Global()
@Module({
  exports: [EnvService],
  providers: [EnvService],
})
export class SharedModule {}
