import * as schema from "./schema/index.js";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type Database = PostgresJsDatabase<typeof schema>;
