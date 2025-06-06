/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { sql } from "drizzle-orm";
import { DrizzlePostgresClient } from "./drizzle.interface.js";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly activeClients = new Set<DrizzlePostgresClient<any>>();
  private readonly logger = new Logger(DrizzleService.name);

  public addClient<T extends Record<string, unknown>>(
    client: DrizzlePostgresClient<T>,
  ) {
    this.activeClients.add(client);
  }

  async onModuleInit() {
    const client = Array.from(this.activeClients)[0];

    try {
      if (!client) {
        throw new Error("No Kysely client found");
      }
      await client.execute(sql`SELECT 1`);
      this.logger.log("✅ PostgreSQL is ready");
      return;
    } catch (error: unknown) {
      this.logger.error("Failed to connect to database", error);
    }
  }

  async onModuleDestroy() {
    for (const client of this.activeClients) {
      try {
        await client.$client.end();
      } catch (error: unknown) {
        this.logger.error("Failed to end postgress client", error);
      }
    }
  }
}
