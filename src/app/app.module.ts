import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../core/auth/auth.module.js";
import { SharedModule } from "../shared/shared.module.js";
import { DrizzleModule } from "../shared/modules/drizzle/drizzle.module.js";
import { EnvService } from "../shared/services/env/env.service.js";
import * as schema from "../db/schema/index.js";
import { envSchema } from "../shared/services/env/env.schema.js";
import { UsersModule } from "../core/users/users.module.js";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    SharedModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
