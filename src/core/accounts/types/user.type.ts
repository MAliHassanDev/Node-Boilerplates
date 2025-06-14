import { accountTable } from "../../../db/schema/index.js";

export type Account = typeof accountTable.$inferSelect;
export type NewAccount = typeof accountTable.$inferInsert;
export type AccountUpdate = Partial<NewAccount>;
