import { DynamicModule, Module, Provider } from "@nestjs/common";
import {
  DrizzleModuleAsyncOptions,
  DrizzlePostgresConfig,
} from "./drizzle.interface.js";
import {
  DRIZZLE_CONFIG_TOKEN,
  DRIZZLE_CONNECTION_TOKEN,
} from "./drizzle.constants.js";
import { DrizzleService } from "./drizzle.service.js";
import { createDrizzleClient } from "./drizzle.provider.js";

export class DrizzleModule {
  public static forRootAsync(
    options: DrizzleModuleAsyncOptions,
  ): DynamicModule {
    const provider: Provider = {
      provide: DRIZZLE_CONNECTION_TOKEN,
      inject: [DRIZZLE_CONFIG_TOKEN, DrizzleService],
      useFactory: (
        config: DrizzlePostgresConfig,
        drizzleSercie: DrizzleService,
      ) => {
        return createDrizzleClient(config, drizzleSercie);
      },
    };
    return {
      global: true,
      module: DrizzleModule,
      exports: [provider],
      providers: [
        DrizzleService,
        provider,
        {
          inject: options.inject,
          provide: DRIZZLE_CONFIG_TOKEN,
          useFactory: options.useFactory,
        },
      ],
      imports: options.imports,
    };
  }
}
