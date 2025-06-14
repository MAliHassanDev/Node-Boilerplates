import { accountsTable } from "../../../db/schema/index.js";

export type Account = typeof accountsTable.$inferSelect;
export type NewAccount = typeof accountsTable.$inferInsert;
export type AccountUpdate = Partial<NewAccount>;
