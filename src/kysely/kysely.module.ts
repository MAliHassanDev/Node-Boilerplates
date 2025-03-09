import { DynamicModule, Module } from "@nestjs/common";
import { KyselyConfig } from "kysely";
import { createKyselyProviders } from "./providers/kysely.providers.js";

@Module({})
export class KyselyModule {
  public static forRoot(config: KyselyConfig): DynamicModule {
    const providers = createKyselyProviders(config);
    return {
      global: true,
      module: KyselyModule,
      providers,
      exports: providers,
    };
  }
}
