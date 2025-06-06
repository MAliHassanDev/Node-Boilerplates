import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../core/auth/auth.module.js";
import { SharedModule } from "../shared/shared.module.js";
import { DrizzleModule } from "../shared/modules/drizzle/drizzle.module.js";
import { EnvService } from "../shared/services/env/env.service.js";
import * as schema from "../db/schema/index.js";
import { envSchema } from "../shared/services/env/env.schema.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: env => envSchema.parse(env),
    }),
    DrizzleModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => {
        return {
          postgres: {
            url: envService.get("DATABASE_URL"),
          },
          drizzleConfig: {
            logger: true,
            casing: "snake_case",
            schema: { ...schema },
          },
        };
      },
    }),
    SharedModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
