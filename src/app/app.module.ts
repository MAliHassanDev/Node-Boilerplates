import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../core/auth/auth.module.js";
import { SharedModule } from "../shared/shared.module.js";
import { DrizzleModule } from "../shared/modules/drizzle/drizzle.module.js";
import { EnvService } from "../shared/services/env/env.service.js";
import * as schema from "../db/schema/index.js";
import { envSchema } from "@/shared/services/env/env.schema";
import { UsersModule } from "@/core/accounts/accounts.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { JwtAuthGuard } from "@/core/auth/guards/jwt-auth.guard";
import { CacheModule } from "@nestjs/cache-manager";
import { createKeyv } from "@keyv/redis";
import { RolesGuard } from "@/core/roles/guards/roles.guard";

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
            casing: "snake_case",
            schema: { ...schema },
          },
        };
      },
    }),
    CacheModule.registerAsync({
      useFactory: (envService: EnvService) => {
        return {
          ttl: 6000,
          stores: [createKeyv(envService.get("REDIS_URL"))],
        };
      },
      inject: [EnvService],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: "short",
          ttl: 1000,
          limit: 3,
        },
        {
          name: "medium",
          ttl: 10000,
          limit: 20,
        },
        {
          name: "long",
          ttl: 60000,
          limit: 100,
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
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
