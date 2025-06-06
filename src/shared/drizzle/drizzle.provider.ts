import postgres from "postgres";
import { DrizzlePostgresConfig } from "./drizzle.interface.js";
import { DrizzleService } from "./drizzle.service.js";
import { drizzle } from "drizzle-orm/postgres-js";

export function createDrizzleClient(
  config: DrizzlePostgresConfig,
  service: DrizzleService,
) {
  const queryClient = postgres(config.postgres.url);
  const client = drizzle({ client: queryClient, ...config.drizzleConfig });
  service.addClient(client);
  return client;
}
