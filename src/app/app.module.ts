import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule } from "@nestjs/config";
import configurations from "../config/configurations.js";
import { KyselyModule } from "../kysely/kysely.module.js";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { AuthModule } from "../core/auth/auth.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),

    KyselyModule.forRoot({
      dialect: new MysqlDialect({
        pool: createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
