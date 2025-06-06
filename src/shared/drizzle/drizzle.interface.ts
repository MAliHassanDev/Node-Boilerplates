/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
} from "@nestjs/common";
import { DrizzleConfig } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { Options, PostgresType } from "postgres";

export interface DrizzlePostgresConfig {
  postgres: {
    url: string;
    config?: Options<Record<string, PostgresType>>;
  };
  drizzleConfig?: DrizzleConfig<any>;
}

export interface DrizzleModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (
    ...options: any[]
  ) => DrizzlePostgresConfig | Promise<DrizzlePostgresConfig>;
}

export interface DrizzlePostgresClient<T extends Record<string, unknown>>
  extends PostgresJsDatabase<T> {
  $client: postgres.Sql<Record<string, unknown>>;
}
