import { Kysely, KyselyConfig } from "kysely";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants/kysely.constants.js";

function createKyselyClient<DB>(config: KyselyConfig): Kysely<DB> {
  return new Kysely<DB>(config);
}

export function createKyselyProviders(config: KyselyConfig) {
  return [
    {
      provide: KYSELY_MODULE_CONNECTION_TOKEN,
      useValue: createKyselyClient(config),
    } as const,
  ];
}
